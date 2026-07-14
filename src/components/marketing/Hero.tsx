import Link from 'next/link';
import { Eye, Zap } from 'lucide-react';

import { BeforeAfter } from './BeforeAfter';
import { WatchDemoButton } from './DemoModal';
import { MobileMenu } from './MobileMenu';
import { StartFreeButton, TrustLine } from './StartFree';
import { ToolbeltLockup } from './ToolbeltLockup';

const NAV = [
  { label: 'How it works', href: '#how' },
  { label: 'Your trade', href: '#trades' },
  { label: 'Apps', href: '#apps' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* backdrop: dotted grid + slow-pulsing accent blobs */}
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(80%_60%_at_50%_0%,#000_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-40 -z-10 h-[560px] w-[560px] rounded-full bg-accent/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* nav */}
        <nav className="flex items-center justify-between py-5">
          <ToolbeltLockup />
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="nav-underline rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition hover:text-ink sm:inline-flex"
            >
              Log in
            </Link>
            <StartFreeButton size="md" label="Start free" withArrow={false} className="hidden sm:inline-flex" />
            <MobileMenu links={NAV} />
          </div>
        </nav>

        {/* hero body */}
        <div className="grid items-center gap-10 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-28 lg:pt-12">
          <div className="min-w-0 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-bright">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              Built for contractors
              <span className="hidden sm:inline"> — HVAC · Plumbing · Electrical · Roofing</span>
            </span>

            <h1 className="mt-5 text-[2.9rem] font-bold uppercase leading-[0.95] text-ink sm:text-6xl lg:text-[4.5rem]">
              Every tool the{' '}
              <span className="bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent">
                paperwork
              </span>{' '}
              side of your business needs.
            </h1>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              Estimates in 60 seconds, e-signed online, invoiced automatically, paid through your
              Stripe, followed up without you — fourteen live tools on one belt, one flat price.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <StartFreeButton />
              <WatchDemoButton />
            </div>
            <TrustLine className="mt-5" />
          </div>

          {/* product visual in a glowing frame + floating cards */}
          <div className="relative min-w-0 animate-fade-up [animation-delay:140ms]">
            <div className="gradient-border relative rounded-3xl bg-paper-850/60 p-2 shadow-lift sm:p-3">
              <BeforeAfter trade="hvac" />
            </div>

            <div className="absolute -left-4 -top-4 hidden animate-float items-center gap-2.5 rounded-xl border border-hairline-strong bg-paper-800/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-ok">
                <Eye className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">Opened by customer</p>
                <p className="text-[11px] text-ink-mute">2 minutes ago</p>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-3 hidden animate-float-slow items-center gap-2.5 rounded-xl border border-hairline-strong bg-paper-800/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent-bright">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">Ready in 48s</p>
                <p className="text-[11px] text-ink-mute">typed → sent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
