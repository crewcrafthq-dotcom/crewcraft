'use server';

import { redirect } from 'next/navigation';

import { countEstimates, getSession } from '@/lib/auth';
import { getPreset } from '@/lib/app-presets';
import { FREE_ESTIMATE_LIMIT, isPaidStatus } from '@/lib/config';
import { computeTotals, lineTotal } from '@/lib/estimates';
import { createClient } from '@/lib/supabase/server';

/**
 * Turn a quote preset (Water Heater Quote Pack, Maintenance Plan Builder) into
 * a draft estimate and drop the contractor straight into the editor. Runs the
 * same free-tier gate as /estimates/new — preset drafts are real estimates.
 */
export async function createEstimateFromPreset(presetId: string): Promise<void> {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const preset = getPreset(presetId);
  if (!preset) redirect('/dashboard');

  if (!isPaidStatus(business.subscription_status)) {
    const count = await countEstimates(user.id);
    if (count >= FREE_ESTIMATE_LIMIT) redirect('/billing?reason=limit');
  }

  const supabase = createClient();
  const taxRate = business.default_tax_rate ?? 0;
  const totals = computeTotals(
    preset.lines.map((l) => ({ quantity: l.quantity, unitPrice: l.unit_price })),
    taxRate,
    0,
  );

  const { data: estimate, error } = await supabase
    .from('estimates')
    .insert({
      user_id: user.id,
      customer_name: '',
      scope_of_work: preset.scope,
      tax_rate: taxRate,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total: totals.total,
    })
    .select('id')
    .single();
  if (error || !estimate) redirect('/dashboard?error=create');

  const rows = preset.lines.map((l, index) => ({
    estimate_id: estimate.id,
    category: l.category,
    description: l.description,
    quantity: l.quantity,
    unit: l.unit,
    unit_price: l.unit_price,
    line_total: lineTotal(l.quantity, l.unit_price),
    sort_order: index,
  }));
  const { error: itemsError } = await supabase.from('line_items').insert(rows);
  if (itemsError) redirect('/dashboard?error=create');

  redirect(`/estimates/${estimate.id}`);
}
