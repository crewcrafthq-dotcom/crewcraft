import { NextResponse, type NextRequest } from 'next/server';

import { getSession } from '@/lib/auth';
import { appUrl } from '@/lib/config';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/** Open the Stripe Customer Portal to manage or cancel. Returns { url }. */
export async function POST(_request: NextRequest) {
  const { user, business } = await getSession();
  if (!user || !business) {
    return NextResponse.json({ error: 'You need to sign in again.' }, { status: 401 });
  }
  if (!business.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account yet.' }, { status: 400 });
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: business.stripe_customer_id,
    return_url: `${appUrl()}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
