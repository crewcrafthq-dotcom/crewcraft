import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';
import { Card } from '@/components/ui/Card';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { FREE_ESTIMATE_LIMIT, isPaidStatus } from '@/lib/config';
import { money, shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Estimate } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('id, customer_name, total, status, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const estimates = (data ?? []) as Pick<
    Estimate,
    'id' | 'customer_name' | 'total' | 'status' | 'created_at' | 'updated_at'
  >[];

  const paid = isPaidStatus(business.subscription_status);
  const remaining = Math.max(0, FREE_ESTIMATE_LIMIT - estimates.length);

  return (
    <AppShell trade={business.trade}>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Estimates</h1>
      </div>

      {!paid ? (
        <Card className="mb-5 flex items-center justify-between gap-4 p-4">
          <p className="text-sm text-navy-soft">
            {remaining > 0
              ? `${remaining} of ${FREE_ESTIMATE_LIMIT} free estimates left.`
              : 'You’ve used your 3 free estimates.'}
          </p>
          <Link href="/billing" className={buttonClasses('primary', 'sm')}>
            Go Pro
          </Link>
        </Card>
      ) : null}

      {estimates.length === 0 ? (
        <Card className="p-10 text-center">
          <h2 className="text-lg font-semibold">No estimates yet</h2>
          <p className="mt-1 text-navy-soft">Start your first one — it takes a minute.</p>
          <Link href="/estimates/new" className={buttonClasses('primary', 'md') + ' mt-5'}>
            New estimate
          </Link>
        </Card>
      ) : (
        <Card className="divide-y divide-line overflow-hidden">
          {estimates.map((e) => (
            <Link
              key={e.id}
              href={`/estimates/${e.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-cream-deep"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{e.customer_name || 'Untitled estimate'}</p>
                <p className="text-sm text-navy-muted">{shortDate(e.created_at)}</p>
              </div>
              <div className="flex flex-none items-center gap-3">
                <span className="font-semibold">{money(e.total)}</span>
                <StatusBadge status={e.status} />
              </div>
            </Link>
          ))}
        </Card>
      )}
    </AppShell>
  );
}
