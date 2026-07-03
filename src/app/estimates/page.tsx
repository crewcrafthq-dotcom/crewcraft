import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  FilePlus2,
  FileText,
  Layers,
  Trophy,
} from 'lucide-react';

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

type Row = Pick<Estimate, 'id' | 'customer_name' | 'total' | 'status' | 'created_at'>;

export default async function EstimatesPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('id, customer_name, total, status, created_at, updated_at')
    .eq('user_id', user.id)
    .eq('kind', 'estimate')
    .order('updated_at', { ascending: false });

  const estimates = (data ?? []) as Row[];
  const paid = isPaidStatus(business.subscription_status);
  const remaining = Math.max(0, FREE_ESTIMATE_LIMIT - estimates.length);

  const openCount = estimates.filter((e) => ['draft', 'sent', 'viewed'].includes(e.status)).length;
  const acceptedCount = estimates.filter((e) => e.status === 'accepted').length;
  const wonValue = estimates
    .filter((e) => e.status === 'accepted')
    .reduce((s, e) => s + (e.total || 0), 0);

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-mist-mute">
        <Link href="/dashboard" className="hover:text-mist">
          Apps
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-mist-soft">Estimate Builder</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-display-sm font-bold text-mist">Estimates</h1>
          <p className="mt-1 text-mist-soft">Every estimate you’ve built, newest first.</p>
        </div>
        <Link href="/estimates/new" className={buttonClasses('primary', 'md')}>
          <FilePlus2 />
          New estimate
        </Link>
      </div>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Layers} label="Total" value={String(estimates.length)} />
        <Stat icon={FileText} label="In play" value={String(openCount)} />
        <Stat icon={CheckCircle2} label="Accepted" value={String(acceptedCount)} />
        <Stat icon={Trophy} label="Won" value={money(wonValue)} accent />
      </div>

      {!paid ? (
        <Card className="mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-mist-soft">
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
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent-bright">
            <FileText className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-mist">No estimates yet</h2>
          <p className="mt-1 max-w-sm text-mist-soft">
            Describe a job in plain words and Crewcraft drafts the line items. Takes about a minute.
          </p>
          <Link href="/estimates/new" className={buttonClasses('primary', 'md') + ' mt-6'}>
            <FilePlus2 />
            Build your first estimate
          </Link>
        </Card>
      ) : (
        <Card className="divide-y divide-hairline overflow-hidden">
          {estimates.map((e) => (
            <Link
              key={e.id}
              href={`/estimates/${e.id}`}
              className="group flex items-center gap-4 px-4 py-3.5 transition duration-150 hover:bg-night-850"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-night-700 text-mist-soft transition group-hover:bg-accent/10 group-hover:text-accent-bright">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-mist">
                  {e.customer_name || 'Untitled estimate'}
                </p>
                <p className="text-sm text-mist-mute">{shortDate(e.created_at)}</p>
              </div>
              <span className="font-semibold text-mist">{money(e.total)}</span>
              <StatusBadge status={e.status} />
              <ArrowUpRight className="h-4 w-4 flex-none text-mist-mute opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </Card>
      )}
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-4">
      <span
        className={
          'grid h-9 w-9 place-items-center rounded-lg ' +
          (accent ? 'bg-accent text-accent-fg' : 'bg-night-700 text-mist-soft')
        }
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-3 text-2xl font-bold text-mist">{value}</p>
      <p className="text-sm text-mist-mute">{label}</p>
    </Card>
  );
}
