import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Package } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';
import { getSession } from '@/lib/auth';
import { money, shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Estimate } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Material Order Sheet' };

/**
 * Material Order Sheet — pick an estimate, get a printable supplier order list
 * built from its material lines. No re-typing at the supply house counter.
 */
export default async function OrderSheetIndexPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('id, customer_name, status, total, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(50);
  const estimates = (data ?? []) as Pick<
    Estimate,
    'id' | 'customer_name' | 'status' | 'total' | 'updated_at'
  >[];

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <p className="eyebrow">Material Order Sheet</p>
      <h1 className="mt-1 text-display-sm font-bold text-ink">
        From estimate to supplier list.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Pick an estimate — its material lines become a clean order sheet you can print or copy for
        the supply house. Quantities and descriptions come straight from the quote.
      </p>

      {estimates.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-hairline bg-paper-800/60 p-8 text-center">
          <Package className="mx-auto h-8 w-8 text-ink-mute" />
          <p className="mt-3 font-semibold text-ink">No estimates yet</p>
          <p className="mt-1 text-sm text-ink-soft">
            Build your first estimate and the order sheet is one tap from here.
          </p>
          <Link
            href="/estimates/new"
            className="mt-4 inline-flex items-center gap-1.5 font-semibold text-accent-bright hover:brightness-110"
          >
            New estimate <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="mt-7 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-paper-800 shadow-card">
          {estimates.map((e) => (
            <li key={e.id}>
              <Link
                href={`/apps/order-sheet/${e.id}`}
                className="flex items-center justify-between gap-3 p-4 transition hover:bg-paper-750 sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {e.customer_name || 'Unnamed customer'}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-mute">
                    {shortDate(e.updated_at)} · {money(e.total)}
                  </p>
                </div>
                <div className="flex flex-none items-center gap-3">
                  <StatusBadge status={e.status} />
                  <ArrowRight className="h-4 w-4 text-ink-mute" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
