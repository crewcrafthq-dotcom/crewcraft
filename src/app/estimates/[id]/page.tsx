import { notFound, redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { EstimateEditor } from '@/components/estimate/EstimateEditor';
import { MetaEvent } from '@/components/MetaEvent';
import { countEstimates, getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { EstimateWithItems } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EstimatePage({ params }: { params: { id: string } }) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('*, line_items(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!data) notFound();

  const estimate = data as EstimateWithItems;
  if (estimate.kind === 'invoice') redirect(`/invoices/${estimate.id}`);
  estimate.line_items = (estimate.line_items ?? []).sort((a, b) => a.sort_order - b.sort_order);

  // Activation: the contractor's first real (non-empty) estimate. countEstimates
  // uses the same "used estimate" rule as the free tier, so an abandoned blank
  // draft never counts. The localStorage key keeps it to one event per browser.
  const activated = (await countEstimates(user.id)) === 1;

  return (
    <AppShell trade={business.trade} businessName={business.name} width="narrow">
      {activated ? <MetaEvent event="StartTrial" once="cc-meta-starttrial" /> : null}
      <EstimateEditor business={business} estimate={estimate} />
    </AppShell>
  );
}
