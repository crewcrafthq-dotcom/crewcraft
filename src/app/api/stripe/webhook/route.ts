import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';

import { isPaidStatus } from '@/lib/config';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Stripe webhook. Verifies the signature against the raw body, then syncs
 * plan + subscription_status onto the business (keyed by stripe_customer_id).
 * Handles checkout.session.completed, customer.subscription.updated, deleted.
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

  async function syncByCustomer(
    customerId: string,
    fields: { subscription_status: string; stripe_subscription_id: string | null },
  ) {
    await admin
      .from('businesses')
      .update({
        plan: isPaidStatus(fields.subscription_status) ? 'pro' : 'free',
        subscription_status: fields.subscription_status,
        stripe_subscription_id: fields.stripe_subscription_id,
      })
      .eq('stripe_customer_id', customerId);
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
      default:
        break;
    }
  } catch (err) {
    console.error('Stripe webhook handling failed:', err);
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
