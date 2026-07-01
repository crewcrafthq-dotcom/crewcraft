import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, CalendarClock, FileText, Receipt, Users2 } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SOON = [
  { name: 'Invoices', desc: 'Turn an accepted estimate into an invoice and get paid.', icon: Receipt },
  { name: 'Scheduling', desc: 'Book the job and keep your week straight.', icon: CalendarClock },
  { name: 'Customers', desc: 'Every customer and job in one place.', icon: Users2 },
];

export default async function DashboardPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { count } = await supabase
    .from('estimates')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);
  const estimateCount = count ?? 0;

  const firstName = business.name.split(' ')[0];

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <header className="mb-8">
        <p className="eyebrow">Your workspace</p>
        <h1 className="mt-1 text-display-sm font-bold text-mist">Welcome back, {firstName}.</h1>
        <p className="mt-1.5 text-mist-soft">Pick a tool to get to work.</p>
      </header>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-mist-mute">Your apps</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Live app */}
        <Link
          href="/estimates"
          className="group block animate-fade-up rounded-2xl border border-hairline bg-night-800 p-5 shadow-card card-interactive"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-fg shadow-accent">
              <FileText className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-bright">
              Live
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold text-mist">Estimate Builder</h3>
          <p className="mt-1 text-sm text-mist-soft">
            Turn a plain-English job into a clean, branded estimate in under a minute.
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-sm">
            <span className="text-mist-mute">
              {estimateCount} {estimateCount === 1 ? 'estimate' : 'estimates'}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-accent-bright">
              Open
              <ArrowRight className="h-4 w-4 transition duration-150 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* Roadmap */}
        {SOON.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.name}
              className="rounded-2xl border border-dashed border-hairline bg-night-800/50 p-5"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-night-700 text-mist-mute">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-night-700 px-2.5 py-1 text-xs font-semibold text-mist-mute">
                  Soon
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-mist-soft">{app.name}</h3>
              <p className="mt-1 text-sm text-mist-mute">{app.desc}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-mist-mute">
        More tools are on the way — built for the trades, not for spreadsheets.
      </p>
    </AppShell>
  );
}
