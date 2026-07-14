import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';

import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Connect webhook (events from contractors' connected accounts — configure the
 * endpoint in Stripe with "Listen to events on connected accounts").
 *
 *  - checkout.session.completed → invoice flips to Paid / estimate deposit is
 *    stamped, automatically. This is what removes the "mark paid" tap.
 *  - account.updated → keeps the cached charges_enabled flag fresh.
 *
 * Verified with STRIPE_CONNECT_WEBHOOK_SECRET (separate from the platform
 * subscription webhook's secret).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');
  if (!secret || !signature) {
    return NextResponse.json({ error: 'Missing webhook signature.' }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error('Connect webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== 'paid') break;
        const estimateId = session.metadata?.crewcraft_estimate_id;
        const kind = session.metadata?.crewcraft_kind;
        if (!estimateId) break;

        const now = new Date().toISOString();
        if (kind === 'invoice') {
          await admin
            .from('estimates')
            .update({ status: 'paid', paid_at: now })
            .eq('id', estimateId)
            .eq('kind', 'invoice');
        } else {
          await admin
            .from('estimates')
            .update({ deposit_paid_at: now })
            .eq('id', estimateId)
            .eq('kind', 'estimate');
        }
        break;
      }
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await admin
          .from('businesses')
          .update({ stripe_charges_enabled: Boolean(account.charges_enabled) })
          .eq('stripe_account_id', account.id);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('Connect webhook handling failed:', err);
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
