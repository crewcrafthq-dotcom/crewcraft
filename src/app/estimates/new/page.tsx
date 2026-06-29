import { redirect } from 'next/navigation';

import { countEstimates, getSession } from '@/lib/auth';
import { FREE_ESTIMATE_LIMIT, isPaidStatus } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Creates a blank draft and drops the contractor straight into the editor.
 * The free-tier gate lives here: a 4th estimate redirects to the paywall
 * unless the subscription is active (§4, §6).
 */
export default async function NewEstimatePage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  if (!isPaidStatus(business.subscription_status)) {
    const count = await countEstimates(user.id);
    if (count >= FREE_ESTIMATE_LIMIT) redirect('/billing?reason=limit');
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('estimates')
    .insert({
      user_id: user.id,
      customer_name: '',
      tax_rate: business.default_tax_rate ?? 0,
    })
    .select('id')
    .single();

  if (error || !data) redirect('/dashboard?error=create');
  redirect(`/estimates/${data.id}`);
}
