import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { getSession } from '@/lib/auth';
import { money, shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { EstimateWithItems, LineItem } from '@/lib/types';
import { OrderSheetActions } from './OrderSheetActions';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Order sheet' };

/** Build the copyable plain-text order list from material lines. */
function orderText(businessName: string, customer: string, items: LineItem[]): string {
  const header = `Material order — ${businessName}${customer ? ` — job: ${customer}` : ''}`;
  const lines = items.map(
    (i) => `• ${i.quantity} ${i.unit || 'ea'} — ${i.description}`,
  );
  return [header, '', ...lines].join('\n');
}

export default async function OrderSheetPage({ params }: { params: { id: string } }) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('*, line_items(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!data) notFound();

  const estimate = data as EstimateWithItems;
  const materials = (estimate.line_items ?? [])
    .filter((i) => i.category === 'materials')
    .sort((a, b) => a.sort_order - b.sort_order);
  const materialsTotal = materials.reduce((sum, i) => sum + i.line_total, 0);
  const text = orderText(business.name, estimate.customer_name, materials);

  return (
    <AppShell trade={business.trade} businessName={business.name} width="narrow">
      <div className="print:hidden">
        <Link
          href="/apps/order-sheet"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All estimates
        </Link>
      </div>

      <div className="mt-4 rounded-2xl border border-hairline bg-paper-800 p-6 shadow-card print:border-0 print:bg-white print:p-0 print:shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Material order</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">{business.name}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {estimate.customer_name ? `Job: ${estimate.customer_name} · ` : ''}
              {shortDate(estimate.updated_at)}
            </p>
          </div>
          <p className="flex-none text-right text-sm text-ink-mute">
            {materials.length} item{materials.length === 1 ? '' : 's'}
          </p>
        </div>

        {materials.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-hairline p-5 text-sm text-ink-soft">
            This estimate has no material lines yet — add materials in the editor and come back.
          </p>
        ) : (
          <table className="mt-5 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-mute">
                <th className="py-2 pr-2">Qty</th>
                <th className="py-2 pr-2">Unit</th>
                <th className="py-2 pr-2">Item</th>
                <th className="py-2 text-right">Est. cost</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((i) => (
                <tr key={i.id} className="border-b border-hairline last:border-0">
                  <td className="py-2.5 pr-2 font-semibold text-ink">{i.quantity}</td>
                  <td className="py-2.5 pr-2 text-ink-soft">{i.unit || 'ea'}</td>
                  <td className="py-2.5 pr-2 text-ink">{i.description}</td>
                  <td className="py-2.5 text-right text-ink-soft">{money(i.line_total)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="pt-3 text-right font-semibold text-ink">
                  Materials total
                </td>
                <td className="pt-3 text-right font-bold text-ink">{money(materialsTotal)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {materials.length > 0 ? <OrderSheetActions text={text} /> : null}

      <p className="mt-4 text-xs text-ink-mute print:hidden">
        Costs shown are your estimate’s line totals, not supplier pricing.
      </p>
    </AppShell>
  );
}
