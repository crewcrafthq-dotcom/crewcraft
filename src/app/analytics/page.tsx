import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BadgeCheck,
  ChevronRight,
  Percent,
  Receipt,
  Target,
  TrendingUp,
} from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { money, shortDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Estimate } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Row = Pick<
  Estimate,
  'id' | 'kind' | 'status' | 'total' | 'created_at' | 'accepted_at' | 'updated_at' | 'paid_at'
>;

const MONTHS = 6;

export default async function AnalyticsPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('estimates')
    .select('id, kind, status, total, created_at, accepted_at, updated_at, paid_at')
    .eq('user_id', user.id);

  const docs = (data ?? []) as Row[];
  const estimates = docs.filter((d) => d.kind === 'estimate');
  const invoices = docs.filter((d) => d.kind === 'invoice');

  // ── headline numbers ──────────────────────────────────────────────────────
  const accepted = estimates.filter((e) => e.status === 'accepted');
  const declined = estimates.filter((e) => e.status === 'declined');
  const decided = accepted.length + declined.length;
  const winRate = decided > 0 ? Math.round((accepted.length / decided) * 100) : null;

  const quotedTotal = estimates.reduce((s, e) => s + (e.total || 0), 0);
  const wonTotal = accepted.reduce((s, e) => s + (e.total || 0), 0);
  const avgTicket = accepted.length > 0 ? wonTotal / accepted.length : null;
  const openValue = estimates
    .filter((e) => ['draft', 'sent', 'viewed'].includes(e.status))
    .reduce((s, e) => s + (e.total || 0), 0);
  const collected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + (i.total || 0), 0);

  // ── monthly quoted vs won (last 6 months) ────────────────────────────────
  const months = lastMonths(MONTHS);
  const monthly = months
    .map(({ key, label }) => {
      const quoted = estimates
        .filter((e) => monthKey(e.created_at) === key)
        .reduce((s, e) => s + (e.total || 0), 0);
      const won = accepted
        .filter((e) => monthKey(e.accepted_at ?? e.updated_at) === key)
        .reduce((s, e) => s + (e.total || 0), 0);
      return { key, label, quoted, won };
    })
    // A young account would otherwise show a wall of empty $0.00 months.
    .filter((m) => m.quoted > 0 || m.won > 0);
  const monthlyMax = Math.max(1, ...monthly.flatMap((m) => [m.quoted, m.won]));

  // ── pipeline funnel ───────────────────────────────────────────────────────
  const funnel = (['draft', 'sent', 'viewed', 'accepted', 'declined'] as const).map((status) => ({
    status,
    label: status[0].toUpperCase() + status.slice(1),
    count: estimates.filter((e) => e.status === status).length,
  }));
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

  const hasData = estimates.length > 0;

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-mist-mute">
        <Link href="/dashboard" className="hover:text-mist">
          Apps
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-mist-soft">Analytics</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-display-sm font-bold text-mist">Analytics</h1>
        <p className="mt-1 text-mist-soft">How your estimates turn into work — at a glance.</p>
      </div>

      {!hasData ? (
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent-bright">
            <TrendingUp className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-mist">Nothing to chart yet</h2>
          <p className="mt-1 max-w-sm text-mist-soft">
            Send a few estimates and this page starts tracking your win rate, average ticket, and
            monthly totals automatically.
          </p>
        </Card>
      ) : (
        <>
          {/* stat tiles */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat
              icon={Percent}
              label="Win rate"
              value={winRate === null ? '—' : `${winRate}%`}
              hint={
                decided > 0
                  ? `${accepted.length} won of ${decided} decided`
                  : 'No accepted/declined estimates yet'
              }
              accent
            />
            <Stat
              icon={Target}
              label="Average ticket"
              value={avgTicket === null ? '—' : money(avgTicket)}
              hint="Across accepted estimates"
            />
            <Stat
              icon={TrendingUp}
              label="In play"
              value={money(openValue)}
              hint="Draft, sent & viewed value"
            />
            <Stat
              icon={BadgeCheck}
              label="Collected"
              value={money(collected)}
              hint="Paid invoices"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* monthly quoted vs won */}
            <Card className="p-5">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-semibold text-mist">Quoted vs won</h2>
                {/* legend — fixed series order: quoted (neutral), won (accent) */}
                <div className="flex items-center gap-4 text-xs text-mist-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] border border-hairline-strong bg-night-600" />
                    Quoted
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-accent" />
                    Won
                  </span>
                </div>
              </div>
              <p className="mb-4 text-sm text-mist-mute">Last {MONTHS} months, by dollar value.</p>
              {monthly.length === 0 ? (
                <p className="rounded-xl border border-dashed border-hairline px-4 py-6 text-center text-sm text-mist-mute">
                  No dollars quoted yet — totals show up here as soon as an estimate has a value.
                </p>
              ) : (
                <div className="space-y-4">
                  {monthly.map((m) => (
                    <div key={m.key}>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-mist-mute">
                        {m.label}
                      </p>
                      <BarRow
                        label="Quoted"
                        value={m.quoted}
                        max={monthlyMax}
                        className="border border-hairline-strong bg-night-600"
                      />
                      <BarRow label="Won" value={m.won} max={monthlyMax} className="bg-accent" />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* pipeline */}
            <Card className="p-5">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-semibold text-mist">Pipeline</h2>
                <Link
                  href="/estimates"
                  className="text-sm font-medium text-accent-bright hover:underline"
                >
                  View estimates
                </Link>
              </div>
              <p className="mb-4 text-sm text-mist-mute">Where every estimate stands right now.</p>
              <div className="space-y-3">
                {funnel.map((f) => (
                  <div key={f.status} className="flex items-center gap-3">
                    <span className="w-20 flex-none text-sm text-mist-soft">{f.label}</span>
                    <div className="h-4 flex-1 overflow-hidden rounded-md bg-night-850">
                      <div
                        className="h-full rounded-md bg-accent"
                        style={{ width: `${Math.round((f.count / funnelMax) * 100)}%` }}
                        title={`${f.label}: ${f.count}`}
                      />
                    </div>
                    <span className="w-8 flex-none text-right text-sm font-semibold text-mist">
                      {f.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-hairline pt-4 text-center">
                <div>
                  <p className="text-lg font-bold text-mist">{money(quotedTotal)}</p>
                  <p className="text-xs text-mist-mute">Total quoted</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-accent-bright">{money(wonTotal)}</p>
                  <p className="text-xs text-mist-mute">Total won</p>
                </div>
              </div>
            </Card>
          </div>

          {/* recent wins */}
          {accepted.length > 0 ? (
            <Card className="mt-4 p-5">
              <h2 className="mb-3 font-semibold text-mist">Recent wins</h2>
              <div className="divide-y divide-hairline">
                {accepted
                  .slice()
                  .sort((a, b) =>
                    (b.accepted_at ?? b.updated_at).localeCompare(a.accepted_at ?? a.updated_at),
                  )
                  .slice(0, 5)
                  .map((e) => (
                    <Link
                      key={e.id}
                      href={`/estimates/${e.id}`}
                      className="flex items-center justify-between gap-3 py-2.5 text-sm transition hover:text-accent-bright"
                    >
                      <span className="text-mist-soft">
                        Accepted {shortDate(e.accepted_at ?? e.updated_at)}
                      </span>
                      <span className="inline-flex items-center gap-2 font-semibold text-mist">
                        {money(e.total)}
                        <Receipt className="h-4 w-4 text-mist-mute" />
                      </span>
                    </Link>
                  ))}
              </div>
            </Card>
          ) : null}
        </>
      )}
    </AppShell>
  );
}

/** One labeled horizontal bar — value always visible as text, never color-only. */
function BarRow({
  label,
  value,
  max,
  className,
}: {
  label: string;
  value: number;
  max: number;
  className: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="mb-1 flex items-center gap-3 last:mb-0">
      <div className="h-4 flex-1 overflow-hidden rounded-md bg-night-850">
        <div
          className={'h-full rounded-md ' + className}
          style={{ width: `${Math.max(value > 0 ? 2 : 0, pct)}%` }}
          title={`${label}: ${money(value)}`}
        />
      </div>
      <span className="w-24 flex-none text-right text-sm tabular-nums text-mist-soft">
        {money(value)}
      </span>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
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
      <p className="text-sm font-medium text-mist-soft">{label}</p>
      <p className="mt-0.5 text-xs text-mist-mute">{hint}</p>
    </Card>
  );
}

/** ["2026-02", …] for the last N months including the current one. */
function lastMonths(n: number): Array<{ key: string; label: string }> {
  const out: Array<{ key: string; label: string }> = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
  }
  return out;
}

function monthKey(iso: string | null): string {
  return (iso ?? '').slice(0, 7);
}
