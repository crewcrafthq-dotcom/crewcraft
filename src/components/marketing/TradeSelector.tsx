'use client';

import { useState } from 'react';
import { Quote } from 'lucide-react';

import { TradeIcon } from '@/components/TradeIcon';
import { cn } from '@/lib/cn';
import { TRADE_CONTENT } from '@/lib/marketing';
import { getTheme, themeVars } from '@/lib/trades';
import { TRADES, type Trade } from '@/lib/types';
import { EstimatePreview } from './EstimatePreview';

export function TradeSelector() {
  const [trade, setTrade] = useState<Trade>('hvac');
  const c = TRADE_CONTENT[trade];

  return (
    <section id="trades" className="bg-paper-850">
      <div data-trade={trade} style={themeVars(trade)} className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Built for your trade</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Pick your trade. Watch it fit.
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            The right units, the right line items, your accent color — tap your trade and see.
          </p>
        </div>

        {/* selector */}
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {TRADES.map((t) => {
            const theme = getTheme(t);
            const active = t === trade;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTrade(t)}
                aria-pressed={active}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-150 active:scale-[0.98]',
                  active
                    ? 'border-transparent shadow-accent'
                    : 'border-hairline bg-paper-800 text-ink-soft hover:bg-paper-700',
                )}
                style={active ? { backgroundColor: theme.accent, color: theme.accentFg } : undefined}
              >
                <TradeIcon
                  trade={t}
                  className="h-4 w-4"
                  style={active ? undefined : { color: theme.accent }}
                />
                {theme.label}
              </button>
            );
          })}
        </div>

        {/* example + testimonial swap to the trade */}
        <div className="mt-9 grid items-center gap-6 lg:grid-cols-2">
          <EstimatePreview trade={trade} className="mx-auto w-full max-w-md min-w-0" />
          <figure className="rounded-2xl border border-hairline bg-paper-800 p-6 shadow-card sm:p-8">
            <Quote className="h-8 w-8 text-accent" />
            <blockquote className="mt-4 text-xl font-medium leading-snug text-ink sm:text-2xl">
              “{c.testimonial.quote}”
            </blockquote>
            <figcaption className="mt-5 text-sm font-semibold text-ink">
              {c.testimonial.name}
              <span className="font-normal text-ink-mute">
                {' · '}
                {c.testimonial.trade}, {c.testimonial.city}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
