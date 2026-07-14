import { notFound, redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { EstimateEditor } from '@/components/estimate/EstimateEditor';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { EstimateWithItems } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** The invoice editor — same editor component as estimates, invoice mode. */
export default async function InvoicePage({ params }: { params: { id: string } }) {
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

  const invoice = data as EstimateWithItems;
  if (invoice.kind !== 'invoice') redirect(`/estimates/${invoice.id}`);
  invoice.line_items = (invoice.line_items ?? []).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <AppShell trade={business.trade} businessName={business.name} width="narrow">
      <EstimateEditor business={business} estimate={invoice} />
    </AppShell>
  );
}
