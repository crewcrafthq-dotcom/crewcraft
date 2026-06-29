import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Eye, FileText, Wand2 } from 'lucide-react';

import { Brand } from '@/components/Brand';
import { TradeIcon } from '@/components/TradeIcon';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { getTheme } from '@/lib/trades';
import { TRADES } from '@/lib/types';

export const dynamic = 'force-dynamic';

const FEATURES = [
  { icon: Wand2, title: 'Describe the job', body: 'Type it in plain words. Get itemized labor and materials back.' },
  { icon: FileText, title: 'Send a clean estimate', body: 'A branded PDF and a link the customer opens on their phone.' },
  { icon: Eye, title: 'Know when they look', body: 'See the moment a customer opens it, right on your dashboard.' },
];

export default async function LandingPage() {
  const { user, business } = await getSession();
  if (user) redirect(business ? '/dashboard' : '/onboarding');

  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-6">
      <header className="flex items-center justify-between py-5">
        <Brand />
        <Link href="/login" className={buttonClasses('secondary', 'sm')}>
          Log in
        </Link>
      </header>

      {/* hero */}
      <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <div className="animate-fade-up">
          <p className="eyebrow">For HVAC · Plumbing · Electrical · Roofing</p>
          <h1 className="mt-3 text-display-sm font-bold leading-tight tracking-tight text-navy sm:text-display lg:text-display-lg">
            Estimates done before you leave the driveway.
          </h1>
          <p className="mt-4 max-w-md text-lg text-navy-soft">
            Type the job in plain words. Get a clean, branded estimate you can send from your phone —
            in under a minute.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/login" className={buttonClasses('primary', 'lg')}>
              Start free
              <ArrowRight />
            </Link>
            <span className="text-sm text-navy-muted">First 3 estimates free. No card.</span>
          </div>

          {/* trade chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {TRADES.map((t) => {
              const theme = getTheme(t);
              return (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream-card px-3 py-1.5 text-sm font-medium text-navy-soft shadow-sm"
                >
                  <TradeIcon trade={t} className="h-4 w-4" style={{ color: theme.accent }} />
                  {theme.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* product preview */}
        <div className="animate-fade-up [animation-delay:120ms]">
          <PreviewCard />
        </div>
      </section>

      {/* features */}
      <section className="grid gap-4 py-10 sm:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="rounded-2xl border border-line bg-cream-card p-5 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent-deep">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-navy">{f.title}</h3>
              <p className="mt-1 text-sm text-navy-soft">{f.body}</p>
            </div>
          );
        })}
      </section>

      <footer className="flex items-center justify-between border-t border-line py-6 text-sm text-navy-muted">
        <span>© {new Date().getFullYear()} Crewcraft</span>
        <Link href="/login" className="font-medium text-navy-soft hover:text-navy">
          Get started →
        </Link>
      </footer>
    </main>
  );
}

/** A small faux estimate, just for the hero. Uses the default accent. */
function PreviewCard() {
  return (
    <div className="rotate-[0.6deg] rounded-3xl border border-line bg-cream-card p-5 shadow-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-xs font-bold text-cream">
            BS
          </span>
          <div>
            <p className="text-sm font-bold text-navy">Bright Spark Electric</p>
            <p className="text-[11px] text-navy-muted">License C-10 998877</p>
          </div>
        </div>
        <span className="text-sm font-bold tracking-wide text-accent-deep">ESTIMATE</span>
      </div>

      <div className="my-4 h-1 rounded-full bg-accent" />

      <p className="eyebrow">Prepared for</p>
      <p className="text-sm font-semibold text-navy">Dana Homeowner</p>

      <div className="mt-4 space-y-2 text-sm">
        {[
          ['Panel swap & rewire', '$880.00'],
          ['200A main panel', '$420.00'],
          ['Breakers & grounding kit', '$180.00'],
        ].map(([label, amt]) => (
          <div key={label} className="flex items-center justify-between border-b border-line pb-2">
            <span className="text-navy-soft">{label}</span>
            <span className="font-semibold text-navy">{amt}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-accent-fg">
        <span className="font-bold">Total</span>
        <span className="text-lg font-bold">$1,603.50</span>
      </div>
    </div>
  );
}
