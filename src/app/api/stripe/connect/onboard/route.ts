import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { appUrl } from '@/lib/config';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Start (or resume) Stripe Connect onboarding for the contractor: create their
 * Standard connected account on first use, then hand them to Stripe's hosted
 * onboarding. GET so it works as a plain link from Settings — and because
 * account-link refresh_urls are visited by redirect. Idempotent: an existing
 * account is reused, never duplicated.
 */
export async function GET() {
  const { user, business } = await getSession();
  if (!user || !business) {
    return NextResponse.redirect(`${appUrl()}/login?next=${encodeURIComponent('/settings')}`);
  }

  const stripe = getStripe();

  try {
    let accountId = business.stripe_account_id;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'standard',
        email: business.email ?? user.email ?? undefined,
        business_profile: { name: business.name },
        metadata: { crewcraft_user_id: user.id },
      });
      accountId = account.id;
      const supabase = createClient();
      await supabase
        .from('businesses')
        .update({ stripe_account_id: accountId })
        .eq('user_id', user.id);
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl()}/api/stripe/connect/onboard`,
      return_url: `${appUrl()}/api/stripe/connect/refresh`,
      type: 'account_onboarding',
    });

    return NextResponse.redirect(link.url);
  } catch (err) {
    console.error('Stripe Connect onboarding failed:', err);
    return NextResponse.redirect(`${appUrl()}/settings?stripe=error`);
  }
}
