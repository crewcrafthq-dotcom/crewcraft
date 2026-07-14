import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, CalendarClock, FileText, PartyPopper, Receipt, TriangleAlert, Users2 } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { ToolIcon } from '@/components/ToolIcon';
import { getSession } from '@/lib/auth';
import { TRADE_SECTIONS, type ToolItem } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SOON = [
  { name: 'Invoices', desc: 'Turn an accepted estimate into an invoice and get paid.', icon: Receipt },
  { name: 'Scheduling', desc: 'Book the job and keep your week straight.', icon: CalendarClock },
  { name: 'Customers', desc: 'Every customer and job in one place.', icon: Users2 },
];

// Available to every trade, not just roofing (materials exist on every quote).
const ORDER_SHEET: ToolItem = {
  name: 'Material Order Sheet',
  tagline: 'Estimate → supplier order list, no re-typing at the counter.',
  status: 'live',
  icon: 'materials',
  kind: 'app',
  href: '/apps/order-sheet',
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string; error?: string };
}) {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { count } = await supabase
    .from('estimates')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);
  const estimateCount = count ?? 0;

  const tradeLabel = getTheme(business.trade).label;
  const tradeTools = TRADE_SECTIONS[business.trade].tools.filter(
    (t) => t.name !== 'Estimate Builder',
  );
  const liveTools = tradeTools.filter((t) => t.status === 'live' && t.href);
  if (business.trade !== 'roofing') liveTools.push(ORDER_SHEET);
  const upcoming = tradeTools.filter((t) => t.status !== 'live');

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      {searchParams.upgraded === '1' ? (
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
          <TriangleAlert className="h-5 w-5 flex-none text-red-600" />
          <p className="text-sm text-ink-soft">
            That estimate didn’t save — give it another try. If it keeps happening, email{' '}
            <a href="mailto:hello@crewcraftapp.com" className="font-semibold text-ink underline">
              hello@crewcraftapp.com
            </a>
            .
          </p>
        </div>
      ) : null}

      <header className="mb-8">
        <p className="eyebrow">Your workspace</p>
        <h1 className="mt-1 text-display-sm font-bold text-ink">Welcome back, {business.name}.</h1>
        <p className="mt-1.5 text-ink-soft">Pick a tool to get to work.</p>
      </header>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-mute">
        Your apps — live
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Flagship */}
        <Link
          href="/estimates"
          className="group block animate-fade-up rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card card-interactive"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-fg shadow-accent">
              <FileText className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-bright">
              Live
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink">Estimate Builder</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Turn a plain-English job into a clean, branded estimate in under a minute.
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-sm">
            <span className="text-ink-mute">
              {estimateCount} {estimateCount === 1 ? 'estimate' : 'estimates'}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-accent-bright">
              Open
              <ArrowRight className="h-4 w-4 transition duration-150 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* Live trade tools */}
        {liveTools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href!}
            className="group block animate-fade-up rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card card-interactive"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-fg shadow-accent">
                <ToolIcon icon={tool.icon} className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-bright">
                Live
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">{tool.name}</h3>
            <p className="mt-1 text-sm text-ink-soft">{tool.tagline}</p>
            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
                {tool.kind === 'automation' ? 'Automation' : 'App'} · built for {tradeLabel}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-accent-bright">
                Open
                <ArrowRight className="h-4 w-4 transition duration-150 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-mute">
        On the way
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((tool) => (
          <div
            key={tool.name}
            className="rounded-2xl border border-dashed border-hairline bg-paper-800/50 p-5"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-paper-700 text-ink-mute">
                <ToolIcon icon={tool.icon} className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-paper-700 px-2.5 py-1 text-xs font-semibold text-ink-mute">
                {tool.status === 'next' ? 'Coming next' : 'Planned'}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink-soft">{tool.name}</h3>
            <p className="mt-1 text-sm text-ink-mute">{tool.tagline}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
              {tool.kind === 'automation' ? 'Automation — runs for you' : 'App — you drive it'}
            </p>
          </div>
        ))}
        {SOON.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.name}
              className="rounded-2xl border border-dashed border-hairline bg-paper-800/50 p-5"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-paper-700 text-ink-mute">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-paper-700 px-2.5 py-1 text-xs font-semibold text-ink-mute">
                  Soon
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-soft">{app.name}</h3>
              <p className="mt-1 text-sm text-ink-mute">{app.desc}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-ink-mute">
        More tools are on the way — built for the trades, not for spreadsheets. Want one bumped up
        the list?{' '}
        <a href="mailto:hello@crewcraftapp.com" className="font-medium text-ink-soft underline hover:text-ink">
          Tell us.
        </a>
      </p>
    </AppShell>
  );
}
