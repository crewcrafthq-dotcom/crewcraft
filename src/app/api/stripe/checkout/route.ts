import { NextResponse, type NextRequest } from 'next/server';

import { getSession } from '@/lib/auth';
import { STRIPE_PRICES, appUrl, type PlanKey } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/** Start a Stripe Checkout subscription for the chosen plan. Returns { url }. */
export async function POST(request: NextRequest) {
  const { user, business } = await getSession();
  if (!user || !business) {
    return NextResponse.json({ error: 'You need to sign in again.' }, { status: 401 });
  }

  let body: { priceKey?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const priceKey = String(body?.priceKey ?? '') as PlanKey;
  const priceId = STRIPE_PRICES[priceKey];
  if (!priceId) {
    return NextResponse.json({ error: 'That plan isn’t available.' }, { status: 400 });
  }

  const stripe = getStripe();
  const supabase = createClient();

  // Reuse or create the Stripe customer for this business.
  let customerId = business.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: business.email ?? user.email ?? undefined,
      name: business.name,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from('businesses')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id);
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    client_reference_id: user.id,
    subscription_data: { metadata: { user_id: user.id } },
    success_url: `${appUrl()}/dashboard?upgraded=1`,
    cancel_url: `${appUrl()}/billing`,
  });

  return NextResponse.json({ url: checkout.url });
}
