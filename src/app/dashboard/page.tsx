import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BookOpen,
  FileText,
  PartyPopper,
  Receipt,
  TrendingUp,
  TriangleAlert,
  Users2,
} from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { MetaEvent } from '@/components/MetaEvent';
import { ToolIcon } from '@/components/ToolIcon';
import { getSession } from '@/lib/auth';
import { PLAN_VALUE_USD, type PlanKey } from '@/lib/config';
import { buildCustomers, type CustomerDoc } from '@/lib/customers';
import { money } from '@/lib/format';
import { liveTradeTools, TRADE_SECTIONS } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string; error?: string; plan?: string };
}) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const [{ data: docs }, { count: priceBookCount }] = await Promise.all([
    supabase
      .from('estimates')
      .select(
        'id, kind, customer_name, customer_email, customer_phone, customer_address, status, total, created_at, updated_at',
      )
      .eq('user_id', user.id),
    supabase
      .from('price_book_items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  const all = (docs ?? []) as CustomerDoc[];
  const estimates = all.filter((d) => d.kind === 'estimate');
  const invoices = all.filter((d) => d.kind === 'invoice');
  const customers = buildCustomers(all);

  const accepted = estimates.filter((e) => e.status === 'accepted').length;
  const declined = estimates.filter((e) => e.status === 'declined').length;
  const decided = accepted + declined;
  const winRateMeta = decided > 0 ? `Win rate ${Math.round((accepted / decided) * 100)}%` : 'No data yet';
  const outstanding = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((s, i) => s + (i.total || 0), 0);

  // The paperwork pipeline — every trade, every day.
  const core = [
    {
      name: 'Estimate Builder',
      desc: 'Type it, dictate it, or snap photos — a branded estimate in under a minute.',
      href: '/estimates',
      icon: FileText,
      meta: `${estimates.length} ${estimates.length === 1 ? 'estimate' : 'estimates'}`,
    },
    {
      name: 'Invoices',
      desc: 'One tap turns an accepted estimate into an invoice. Track what’s owed and what’s paid.',
      href: '/invoices',
      icon: Receipt,
      meta: outstanding > 0 ? `${money(outstanding)} outstanding` : `${invoices.length} total`,
    },
    {
      name: 'Customers',
      desc: 'Every customer and job in one place — built automatically from your paperwork.',
      href: '/customers',
      icon: Users2,
      meta: `${customers.length} ${customers.length === 1 ? 'customer' : 'customers'}`,
    },
    {
      name: 'Analytics',
      desc: 'Win rate, average ticket, quoted vs won. Know which jobs are worth chasing.',
      href: '/analytics',
      icon: TrendingUp,
      meta: winRateMeta,
    },
    {
      name: 'Price Book',
      desc: 'Save your real rates and materials — the AI prices every draft with them.',
      href: '/pricebook',
      icon: BookOpen,
      meta: `${priceBookCount ?? 0} ${priceBookCount === 1 ? 'item' : 'items'} saved`,
    },
  ];

  const tradeLabel = getTheme(business.trade).label;
  // Paid conversion: Stripe sends the plan back on the success URL, so the
  // value events carry the amount actually charged. Both fire once per browser.
  const planKey = searchParams.plan as PlanKey | undefined;
  const paidValue = planKey ? PLAN_VALUE_USD[planKey] : undefined;
  const justUpgraded = searchParams.upgraded === '1';

  const tools = liveTradeTools();
  const mine = tools.filter((t) => t.trade === business.trade);
  const others = tools.filter((t) => t.trade !== business.trade);
  const upcoming = TRADE_SECTIONS[business.trade].tools.filter((t) => t.status !== 'live');

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      {justUpgraded && paidValue !== undefined ? (
        <>
          <MetaEvent
            event="Subscribe"
            params={{ value: paidValue, currency: 'USD', predicted_ltv: paidValue }}
            once={`cc-meta-subscribe-${planKey}`}
          />
          <MetaEvent
            event="Purchase"
            params={{ value: paidValue, currency: 'USD', content_name: planKey! }}
            once={`cc-meta-purchase-${planKey}`}
          />
        </>
      ) : null}

      {justUpgraded ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 animate-fade-up">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-accent text-accent-fg">
            <PartyPopper className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-ink">You’re on Pro — unlimited estimates unlocked.</p>
            <p className="text-sm text-ink-soft">Every new Toolbelt app is included as it ships. Go win some jobs.</p>
          </div>
        </div>
      ) : null}

      {searchParams.error === 'create' ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
          <TriangleAlert className="h-5 w-5 flex-none text-bad" />
          <p className="text-sm text-ink-soft">
            That estimate didn’t save — give it another try. If it keeps happening, email{' '}
            <a href="mailto:support@crewcraftapp.com" className="font-semibold text-ink underline">
              support@crewcraftapp.com
            </a>
            .
          </p>
        </div>
      ) : null}

      <header className="mb-8">
        <p className="eyebrow">Your workspace</p>
        <h1 className="mt-1 text-display-sm font-bold text-ink">Welcome back, {business.name}.</h1>
        <p className="mt-1.5 text-ink-soft">The whole belt, one screen. Pick a tool.</p>
      </header>

      {/* the paperwork pipeline — compact tiles, no status chatter */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-mute">
        Run the business
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {core.map((app) => {
          const Icon = app.icon;
          return (
            <Link
              key={app.name}
              href={app.href}
              className="group flex items-start gap-3 rounded-xl border border-hairline bg-paper-800 p-4 shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-accent/50"
            >
              <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-accent/10 text-accent-bright">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">{app.name}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{app.desc}</span>
                <span className="mt-1 block text-[11px] text-ink-mute">{app.meta}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* the contractor's own trade */}
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-mute">
        Built for {tradeLabel}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mine.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href!}
            className="group flex items-start gap-3 rounded-xl border border-hairline bg-paper-800 p-4 shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-accent/50"
          >
            <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-accent/10 text-accent-bright">
              <ToolIcon icon={tool.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink">{tool.name}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{tool.tagline}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* every other trade's tools still work — materials lists, photo reports… */}
      {others.length > 0 ? (
        <>
          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-mute">
            From the other trades — yours too
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {others.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href!}
                className="group flex items-center gap-3 rounded-xl border border-hairline bg-paper-800 p-3.5 shadow-card transition hover:border-accent/40"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-accent/10 text-accent-bright">
                  <ToolIcon icon={tool.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{tool.name}</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
                    {getTheme(tool.trade).label}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      {/* honest roadmap */}
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-mute">
        On the way
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((tool) => (
          <div
            key={tool.name}
            className="flex items-start gap-3 rounded-xl border border-dashed border-hairline bg-paper-800/50 p-4"
          >
            <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-paper-700 text-ink-mute">
              <ToolIcon icon={tool.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink-soft">{tool.name}</span>
                <span className="rounded-full bg-paper-700 px-2 py-0.5 text-[10px] font-semibold text-ink-mute">
                  {tool.status === 'next' ? 'Next' : 'Planned'}
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-ink-mute">{tool.tagline}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-mute">
        More tools are on the way — built for the trades, not for spreadsheets. Want one bumped up
        the list?{' '}
        <a href="mailto:support@crewcraftapp.com" className="font-medium text-ink-soft underline hover:text-ink">
          Tell us.
        </a>
      </p>
    </AppShell>
  );
}
