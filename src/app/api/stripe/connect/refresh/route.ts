import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { appUrl } from '@/lib/config';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Stripe onboarding return_url. Pulls the connected account's live status and
 * caches charges_enabled on the business, then lands back on Settings.
 */
export async function GET() {
  const { user, business } = await getSession();
  if (!user || !business) {
    return NextResponse.redirect(`${appUrl()}/login?next=${encodeURIComponent('/settings')}`);
  }

  if (business.stripe_account_id) {
    try {
      const account = await getStripe().accounts.retrieve(business.stripe_account_id);
      const supabase = createClient();
      await supabase
        .from('businesses')
        .update({ stripe_charges_enabled: Boolean(account.charges_enabled) })
        .eq('user_id', user.id);
    } catch (err) {
      console.error('Stripe Connect status refresh failed:', err);
    }
  }

  return NextResponse.redirect(`${appUrl()}/settings?stripe=connected`);
}
