import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowUpRight,
  ChevronRight,
  Mail,
  Phone,
  Trophy,
  Users2,
} from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { buildCustomers, encodeCustomerKey, type CustomerDoc } from '@/lib/customers';
import { money, shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select(
      'id, kind, customer_name, customer_email, customer_phone, customer_address, status, total, created_at, updated_at',
    )
    .eq('user_id', user.id);

  const customers = buildCustomers((data ?? []) as CustomerDoc[]);
  const repeatCount = customers.filter((c) => c.estimateCount + c.invoiceCount > 1).length;
  const wonTotal = customers.reduce((s, c) => s + c.won, 0);

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-ink-mute">
        <Link href="/dashboard" className="hover:text-ink">
          Apps
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-ink-soft">Customers</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-display-sm font-bold text-ink">Customers</h1>
        <p className="mt-1 text-ink-soft">
          Every customer and their job history, pulled straight from your estimates and invoices.
        </p>
      </div>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat icon={Users2} label="Customers" value={String(customers.length)} />
        <Stat icon={ArrowUpRight} label="Repeat" value={String(repeatCount)} />
        <Stat icon={Trophy} label="Won with them" value={money(wonTotal)} accent />
      </div>

      {customers.length === 0 ? (
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent-bright">
            <Users2 className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-ink">No customers yet</h2>
          <p className="mt-1 max-w-sm text-ink-soft">
            Build your first estimate and the customer shows up here automatically — no separate
            address book to maintain.
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-hairline overflow-hidden">
          {customers.map((c) => (
            <Link
              key={c.key}
              href={`/customers/${encodeCustomerKey(c.key)}`}
              className="group flex items-center gap-4 px-4 py-3.5 transition duration-150 hover:bg-paper-850"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-paper-700 text-sm font-bold text-ink-soft transition group-hover:bg-accent/10 group-hover:text-accent-bright">
                {initials(c.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{c.name}</p>
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-ink-mute">
                  {c.email ? (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="max-w-[180px] truncate">{c.email}</span>
                    </span>
                  ) : null}
                  {c.phone ? (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {c.phone}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm text-ink-soft">
                  {c.estimateCount} {c.estimateCount === 1 ? 'estimate' : 'estimates'}
                  {c.invoiceCount > 0
                    ? ` · ${c.invoiceCount} ${c.invoiceCount === 1 ? 'invoice' : 'invoices'}`
                    : ''}
                </p>
                <p className="text-sm text-ink-mute">Last {shortDate(c.lastActivity)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink">{money(c.won || c.quoted)}</p>
                <p className="text-xs text-ink-mute">{c.won > 0 ? 'won' : 'quoted'}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 flex-none text-ink-mute opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </Card>
      )}
    </AppShell>
  );
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?'
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
          (accent ? 'bg-accent text-accent-fg' : 'bg-paper-700 text-ink-soft')
        }
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      <p className="text-sm text-ink-mute">{label}</p>
    </Card>
  );
}
