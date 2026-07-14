import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { ToolIcon } from '@/components/ToolIcon';
import { TradeIcon } from '@/components/TradeIcon';
import { TradeTheme } from '@/components/TradeTheme';
import { cn } from '@/lib/cn';
import { TRADE_SECTIONS, type ToolItem } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import { TRADES } from '@/lib/types';
import { Reveal } from './Reveal';

const STATUS: Record<ToolItem['status'], { label: string; className: string }> = {
  live: { label: 'Live', className: 'bg-accent text-accent-fg' },
  next: { label: 'Coming next', className: 'bg-accent/10 text-accent-bright' },
  planned: { label: 'Planned', className: 'bg-paper-700 text-ink-mute' },
};

/**
 * One deep-dive section per trade: the pitch in that trade's language, the jobs
 * the AI already writes well, and the trade's belt of apps + automations.
 * Server-rendered (all four in the DOM) so Google indexes every trade, and each
 * carries an anchor id (#hvac, #plumbing, …) that ads can deep-link to.
 */
export function TradeSections() {
  return (
    <section id="for-your-trade" aria-label="Built around your trade">
      {TRADES.map((trade, i) => {
        const c = TRADE_SECTIONS[trade];
        const theme = getTheme(trade);
        const flip = i % 2 === 1;

        return (
          <TradeTheme key={trade} trade={trade}>
            <div id={trade} className={cn('scroll-mt-24', i % 2 === 1 && 'bg-paper-850')}>
              <Reveal>
                <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
                  {/* pitch */}
                  <div className={cn(flip && 'lg:order-2')}>
                    <p className="eyebrow inline-flex items-center gap-2">
                      <TradeIcon trade={trade} className="h-4 w-4" />
                      For {theme.label} contractors
                    </p>
                    <h3 className="mt-2 text-2xl font-bold leading-tight text-ink sm:text-3xl">
                      {c.headline}
                    </h3>
                    <p className="mt-3 text-lg leading-relaxed text-ink-soft">{c.sub}</p>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-mute">
                      It knows the work
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {c.knows.map((line) => (
                        <li key={line} className="flex items-start gap-3">
                          <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-accent/10 text-accent-bright">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-ink-soft">{line}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/login?mode=signup"
                      className="group mt-6 inline-flex items-center gap-1.5 font-semibold text-accent-bright transition hover:brightness-110"
                    >
                      Quote your next {trade === 'hvac' ? 'HVAC' : theme.label.toLowerCase()} job — free
                      <ArrowRight className="h-4 w-4 transition duration-150 group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  {/* the trade's belt */}
                  <div className={cn('min-w-0', flip && 'lg:order-1')}>
                    <div className="card-paper p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-bold text-ink">The {theme.label} belt</h4>
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                          Apps & automations
                        </span>
                      </div>
                      <ul className="mt-4 divide-y divide-hairline">
                        {c.tools.map((tool) => {
                          const status = STATUS[tool.status];
                          const isLive = tool.status === 'live';
                          return (
                            <li key={tool.name} className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
                              <span
                                className={cn(
                                  'mt-0.5 grid h-10 w-10 flex-none place-items-center rounded-xl',
                                  isLive
                                    ? 'bg-accent text-accent-fg shadow-accent'
                                    : 'bg-paper-700 text-ink-mute',
                                )}
                              >
                                <ToolIcon icon={tool.icon} className="h-5 w-5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <p className={cn('font-semibold', isLive ? 'text-ink' : 'text-ink-soft')}>
                                    {tool.name}
                                  </p>
                                  <span
                                    className={cn(
                                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                      status.className,
                                    )}
                                  >
                                    {status.label}
                                  </span>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
                                    {tool.kind === 'automation' ? 'Automation' : 'App'}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-ink-mute">{tool.tagline}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </TradeTheme>
        );
      })}
    </section>
  );
}
