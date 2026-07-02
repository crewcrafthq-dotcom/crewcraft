import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  FileText,
  Receipt,
  TrendingUp,
  Users2,
} from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { getSession } from '@/lib/auth';
import { buildCustomers, type CustomerDoc } from '@/lib/customers';
import { money } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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
  const winRate = decided > 0 ? `${Math.round((accepted / decided) * 100)}%` : '—';
  const outstanding = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((s, i) => s + (i.total || 0), 0);

  const firstName = business.name.split(' ')[0];

  const apps = [
    {
      name: 'Estimate Builder',
      desc: 'Turn a plain-English job (or a few photos) into a branded estimate in under a minute.',
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
      meta: `Win rate ${winRate}`,
    },
    {
      name: 'Price Book',
      desc: 'Save your real rates and materials — the AI prices every draft with them.',
      href: '/pricebook',
      icon: BookOpen,
      meta: `${priceBookCount ?? 0} ${priceBookCount === 1 ? 'item' : 'items'} saved`,
    },
  ];

  return (
    <AppShell trade={business.trade} businessName={business.name}>
      <header className="mb-8">
        <p className="eyebrow">Your workspace</p>
        <h1 className="mt-1 text-display-sm font-bold text-mist">Welcome back, {firstName}.</h1>
        <p className="mt-1.5 text-mist-soft">Pick a tool to get to work.</p>
      </header>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-mist-mute">Your apps</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <Link
              key={app.name}
              href={app.href}
              className="group block animate-fade-up rounded-2xl border border-hairline bg-night-800 p-5 shadow-card card-interactive"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-fg shadow-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-bright">
                  Live
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-mist">{app.name}</h3>
              <p className="mt-1 text-sm text-mist-soft">{app.desc}</p>
              <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-sm">
                <span className="text-mist-mute">{app.meta}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-accent-bright">
                  Open
                  <ArrowRight className="h-4 w-4 transition duration-150 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}

        {/* Roadmap */}
        <div className="rounded-2xl border border-dashed border-hairline bg-night-800/50 p-5">
          <div className="flex items-start justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-night-700 text-mist-mute">
              <CalendarClock className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-night-700 px-2.5 py-1 text-xs font-semibold text-mist-mute">
              Soon
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold text-mist-soft">Scheduling</h3>
          <p className="mt-1 text-sm text-mist-mute">Book the job and keep your week straight.</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-mist-mute">
        More tools are on the way — built for the trades, not for spreadsheets.
      </p>
    </AppShell>
  );
}
