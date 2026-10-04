import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Activity,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  FileText,
  TrendingUp,
  UserPlus,
  Users2,
} from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { getSession } from '@/lib/auth';
import { isDunningStatus, isOwnerEmail, isPaidStatus, PRICING } from '@/lib/config';
import { money } from '@/lib/format';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const WEEKS = 8;

interface BizRow {
  user_id: string;
  subscription_status: string | null;
  created_at: string;
}

interface DocRow {
  user_id: string;
  kind: string;
  status: string;
  total: number;
  sent_at: string | null;
  accepted_at: string | null;
  paid_at: string | null;
  created_at: string;
}

/**
 * Owner-only growth dashboard — the Friday numbers: signups, activation,
 * documents moving through the funnel, Pro subscriptions. Reads across all
 * accounts via the service-role client, so the isOwnerEmail gate is the wall.
 * (Web-side funnel events — scroll depth, CTA clicks, try-it builds — live in
 * the Vercel Analytics dashboard; this page covers everything after signup.)
 */
export default async function AdminPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!isOwnerEmail(user.email)) redirect('/dashboard');
  if (!business) redirect('/onboarding');

  const admin = createAdminClient();
  const [{ data: bizRows }, { data: docRows }] = await Promise.all([
    admin.from('businesses').select('user_id, subscription_status, created_at'),
    admin
      .from('estimates')
      .select('user_id, kind, status, total, sent_at, accepted_at, paid_at, created_at'),
  ]);

  const businesses = (bizRows ?? []) as BizRow[];
  const docs = (docRows ?? []) as DocRow[];
  const estimates = docs.filter((d) => d.kind === 'estimate');
  const invoices = docs.filter((d) => d.kind === 'invoice');

  // ── headline numbers ──────────────────────────────────────────────────────
  const senders = new Set(estimates.filter((e) => e.sent_at || e.status !== 'draft').map((e) => e.user_id));
  const activation =
    businesses.length > 0 ? Math.round((senders.size / businesses.length) * 100) : 0;
  // Still counts only subscriptions actually collecting money — a contractor
  // inside the dunning grace window has Pro, but hasn't paid, so folding them
  // in here would quietly inflate MRR.
  const proCount = businesses.filter((b) => isPaidStatus(b.subscription_status)).length;
  const atRiskCount = businesses.filter((b) => isDunningStatus(b.subscription_status)).length;
  const collected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + (i.total || 0), 0);

  // ── weekly trend (last 8 ISO-ish weeks, Monday starts) ───────────────────
  const weeks = lastWeeks(WEEKS);
  const rows = weeks.map(({ start, end, label }) => {
    const inWeek = (iso: string | null) => Boolean(iso && iso >= start && iso < end);
    const signups = businesses.filter((b) => inWeek(b.created_at)).length;
    const sent = estimates.filter((e) => inWeek(e.sent_at)).length;
    const accepted = estimates.filter((e) => inWeek(e.accepted_at)).length;
    const paid = invoices.filter((i) => inWeek(i.paid_at));
    return {
      label,
      signups,
      sent,
      accepted,
      paidCount: paid.length,
      paidValue: paid.reduce((s, i) => s + (i.total || 0), 0),
    };
  });

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-ink-mute">
        <Link href="/dashboard" className="hover:text-ink">
          Apps
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-ink-soft">Growth (owner)</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-display-sm font-bold text-ink">Growth</h1>
        <p className="mt-1 text-ink-soft">
          The whole platform, every account — your Friday review numbers.
        </p>
      </div>

      {/* headline tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          icon={Users2}
          label="Contractors"
          value={String(businesses.length)}
          hint={`${senders.size} have sent an estimate`}
        />
        <Tile
          icon={Activity}
          label="Activation"
          value={`${activation}%`}
          hint="Signed up → sent ≥1 estimate"
          accent
        />
        <Tile
          icon={CreditCard}
          label="Pro subscribers"
          value={String(proCount)}
          hint={
            atRiskCount > 0
              ? `≈ ${money(proCount * priceAnchor())} MRR · ${atRiskCount} failing payment`
              : `≈ ${money(proCount * priceAnchor())} MRR at the anchor price`
          }
        />
        <Tile
          icon={BadgeCheck}
          label="Collected (all time)"
          value={money(collected)}
          hint="Paid invoices across all accounts"
        />
      </div>

      {/* weekly trend */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <h2 className="flex items-center gap-2 font-semibold text-ink">
            <TrendingUp className="h-[18px] w-[18px] text-ink-mute" />
            Last {WEEKS} weeks
          </h2>
          <span className="text-xs text-ink-mute">newest first</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs font-bold uppercase tracking-wide text-ink-mute">
                <th className="px-4 py-2.5">Week of</th>
                <th className="px-4 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1"><UserPlus className="h-3.5 w-3.5" />Signups</span>
                </th>
                <th className="px-4 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />Sent</span>
                </th>
                <th className="px-4 py-2.5 text-right">Accepted</th>
                <th className="px-4 py-2.5 text-right">Invoices paid</th>
                <th className="px-4 py-2.5 text-right">$ collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {[...rows].reverse().map((r) => (
                <tr key={r.label} className="text-ink-soft">
                  <td className="px-4 py-2.5 font-medium text-ink">{r.label}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.signups}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.sent}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.accepted}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.paidCount}</td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-ink">
                    {money(r.paidValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-sm text-ink-mute">
        Pre-signup funnel (visits, scroll depth, try-it builds, Start-free clicks) lives in the
        Vercel Analytics dashboard. This page is everything after signup, straight from the
        database. Only OWNER_EMAILS accounts can open it.
      </p>
    </AppShell>
  );
}

/** The Pro anchor price in dollars, parsed from the pricing copy ("$29"). */
function priceAnchor(): number {
  const n = Number(String(PRICING.proMonthly.price).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 29;
}

function Tile({
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
          (accent ? 'bg-accent text-accent-fg' : 'bg-paper-700 text-ink-soft')
        }
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-0.5 text-xs text-ink-mute">{hint}</p>
    </Card>
  );
}

/** Monday-aligned week windows, oldest → newest. */
function lastWeeks(n: number): Array<{ start: string; end: string; label: string }> {
  const out: Array<{ start: string; end: string; label: string }> = [];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i -= 1) {
    const start = new Date(monday);
    start.setDate(monday.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    out.push({
      start: start.toISOString(),
      end: end.toISOString(),
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return out;
}
