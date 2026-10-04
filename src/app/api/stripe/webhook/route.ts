import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';

import { appUrl, isDunningStatus, isPaidStatus, PAST_DUE_GRACE_DAYS } from '@/lib/config';
import { sendAppEmail } from '@/lib/email/send';
import { paymentFailedEmailHtml } from '@/lib/email/templates';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Stripe webhook. Verifies the signature against the raw body, then syncs
 * plan + subscription_status (+ the dunning grace window) onto the business,
 * keyed by stripe_customer_id. Handles checkout.session.completed,
 * customer.subscription.updated/deleted, and invoice.payment_failed/succeeded.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  if (!secret || !signature) {
    return NextResponse.json({ error: 'Missing webhook signature.' }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error('Stripe signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const admin = createAdminClient();

  /**
   * Apply a patch to the business, retrying without `grace_until` if the
   * column isn't there yet. Mirrors the migration-0008 self-heal in
   * business-write.ts: until 0011 is run the subscription sync must still
   * work, and a 500 here would make Stripe retry the event forever.
   */
  async function patchBusiness(customerId: string, patch: Record<string, unknown>) {
    let { error } = await admin.from('businesses').update(patch).eq('stripe_customer_id', customerId);
    if (error && 'grace_until' in patch) {
      const { grace_until: _skip, ...rest } = patch;
      console.warn('businesses.grace_until missing — run migration 0011. Syncing without it.');
      ({ error } = await admin.from('businesses').update(rest).eq('stripe_customer_id', customerId));
    }
    if (error) throw new Error(`Business sync failed: ${error.message}`);
  }

  /** The grace window already on the row, if any. Null before migration 0011. */
  async function readGraceUntil(customerId: string): Promise<string | null> {
    const { data, error } = await admin
      .from('businesses')
      .select('grace_until')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    if (error) return null; // column not there yet — treated as "no window"
    return (data as { grace_until?: string | null } | null)?.grace_until ?? null;
  }

  /**
   * The deadline for this dunning cycle, set ONCE. Stripe fires a fresh
   * failure event for every retry (3–4 over two weeks), so recomputing it each
   * time would roll it forward forever and the subscription would never lapse.
   */
  async function nextGraceUntil(customerId: string): Promise<string> {
    return (
      (await readGraceUntil(customerId)) ??
      new Date(Date.now() + PAST_DUE_GRACE_DAYS * 86_400_000).toISOString()
    );
  }

  /** Sync a subscription's status onto the business, grace window included. */
  async function syncByCustomer(
    customerId: string,
    fields: { subscription_status: string; stripe_subscription_id: string | null },
  ) {
    const status = fields.subscription_status;
    const base = {
      subscription_status: status,
      stripe_subscription_id: fields.stripe_subscription_id,
    };

    if (isPaidStatus(status)) {
      // Paid again (or still) — any grace window is over and done with.
      await patchBusiness(customerId, { ...base, plan: 'pro', grace_until: null });
      return;
    }

    if (!isDunningStatus(status)) {
      // canceled / incomplete_expired / … — they're gone, no grace.
      await patchBusiness(customerId, { ...base, plan: 'free', grace_until: null });
      return;
    }

    await patchBusiness(customerId, {
      ...base,
      plan: 'pro',
      grace_until: await nextGraceUntil(customerId),
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string | null;
        if (customerId && subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          await syncByCustomer(customerId, {
            subscription_status: sub.status,
            stripe_subscription_id: sub.id,
          });
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await syncByCustomer(customerId, {
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
        });
        break;
      }
      /**
       * A renewal was declined. customer.subscription.updated also fires and
       * does the status sync, but only this event carries the retry schedule,
       * so it's where the contractor actually gets told.
       */
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscriptionId = (invoice as { subscription?: string | null }).subscription ?? null;
        if (!customerId) break;

        // Card-on-file failures only. A one-off invoice isn't a subscription
        // lapsing and must not start a grace window.
        if (!subscriptionId) break;

        // The failed invoice IS the signal, so the window opens here rather
        // than off whatever status we happen to read back: Stripe doesn't
        // guarantee the subscription has flipped to past_due by the time this
        // event is delivered, and a race would email a deadline of "null".
        // Harmless if the retry then succeeds — grace_until is only ever
        // consulted while the status is past_due/unpaid, and the success path
        // clears it.
        const graceUntil = await nextGraceUntil(customerId);
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await syncByCustomer(customerId, {
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
        });
        if (!isPaidStatus(sub.status)) {
          await patchBusiness(customerId, { grace_until: graceUntil });
        }

        // Stripe retries 3–4 times; mailing on every one would be nagging.
        // The first attempt is the heads-up, the last is the final warning —
        // `next_payment_attempt` is null once Stripe has given up.
        const isFirst = (invoice.attempt_count ?? 1) <= 1;
        const isFinal = !invoice.next_payment_attempt;
        if (!isFirst && !isFinal) break;

        const { data: business } = await admin
          .from('businesses')
          .select('name, email')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
        const to = (business as { email?: string | null } | null)?.email;
        if (!to) break;

        // Never let a mail failure 500 the webhook — Stripe would retry the
        // event and the status sync above has already been written.
        try {
          await sendAppEmail({
            to,
            fromName: 'Toolbelt by Crewcraft',
            subject: isFinal
              ? 'Last try: your Toolbelt payment didn’t go through'
              : 'Your Toolbelt payment didn’t go through',
            html: paymentFailedEmailHtml({
              businessName: (business as { name?: string | null } | null)?.name ?? 'there',
              graceUntil,
              isFinal,
              billingUrl: `${appUrl()}/billing`,
            }),
          });
        } catch (mailErr) {
          console.error('Dunning email failed:', mailErr);
        }
        break;
      }
      /** Card went through after a failure — close the grace window. */
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscriptionId = (invoice as { subscription?: string | null }).subscription ?? null;
        if (!customerId || !subscriptionId) break;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await syncByCustomer(customerId, {
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('Stripe webhook handling failed:', err);
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
