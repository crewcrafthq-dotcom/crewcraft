import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  AlarmClock,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Receipt,
  Wallet,
} from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/StatusBadge';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { money, shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Estimate } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Row = Pick<Estimate, 'id' | 'customer_name' | 'total' | 'status' | 'due_date' | 'created_at'>;

export default async function InvoicesPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('id, customer_name, total, status, due_date, created_at, updated_at')
    .eq('user_id', user.id)
    .eq('kind', 'invoice')
    .order('updated_at', { ascending: false });

  const invoices = (data ?? []) as Row[];
  const today = new Date().toISOString().slice(0, 10);

  const outstanding = invoices.filter((i) => i.status !== 'paid');
  const outstandingValue = outstanding.reduce((s, i) => s + (i.total || 0), 0);
  const overdue = outstanding.filter((i) => i.due_date && i.due_date < today);
  const collected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + (i.total || 0), 0);

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-mist-mute">
        <Link href="/dashboard" className="hover:text-mist">
          Apps
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-mist-soft">Invoices</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-display-sm font-bold text-mist">Invoices</h1>
          <p className="mt-1 text-mist-soft">
            Turn accepted estimates into invoices and get paid.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Receipt} label="Invoices" value={String(invoices.length)} />
        <Stat icon={Wallet} label="Outstanding" value={money(outstandingValue)} />
        <Stat icon={AlarmClock} label="Overdue" value={String(overdue.length)} />
        <Stat icon={BadgeCheck} label="Collected" value={money(collected)} accent />
      </div>

      {invoices.length === 0 ? (
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent-bright">
            <Receipt className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-mist">No invoices yet</h2>
          <p className="mt-1 max-w-sm text-mist-soft">
            When a customer accepts an estimate, open it and tap “Convert to invoice.” Everything
            carries over — line items, totals, the customer.
          </p>
          <Link
            href="/estimates"
            className="mt-6 inline-flex items-center gap-1 font-semibold text-accent-bright"
          >
            Go to estimates
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Card>
      ) : (
        <Card className="divide-y divide-hairline overflow-hidden">
          {invoices.map((inv) => {
            const isOverdue = inv.status !== 'paid' && inv.due_date && inv.due_date < today;
            return (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="group flex items-center gap-4 px-4 py-3.5 transition duration-150 hover:bg-night-850"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-night-700 text-mist-soft transition group-hover:bg-accent/10 group-hover:text-accent-bright">
                  <Receipt className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-mist">
                    {inv.customer_name || 'Untitled invoice'}
                  </p>
                  <p className="text-sm text-mist-mute">
                    {inv.due_date ? (
                      <>
                        Due {shortDate(inv.due_date)}
                        {isOverdue ? <span className="text-red-400"> · overdue</span> : null}
                      </>
                    ) : (
                      shortDate(inv.created_at)
                    )}
                  </p>
                </div>
                <span className="font-semibold text-mist">{money(inv.total)}</span>
                <StatusBadge status={inv.status} />
                <ArrowUpRight className="h-4 w-4 flex-none text-mist-mute opacity-0 transition group-hover:opacity-100" />
              </Link>
            );
          })}
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
