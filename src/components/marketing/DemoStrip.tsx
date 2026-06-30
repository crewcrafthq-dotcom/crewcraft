import { ArrowDown, ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';

import { TradeTheme } from '@/components/TradeTheme';
import { EstimatePreview } from './EstimatePreview';
import { TRADE_CONTENT } from '@/lib/marketing';

/**
 * The single dark spotlight band (§ "show it fast"). Deep navy makes the white
 * estimate and the amber accent pop. Electrical theme = navy-on-amber, which
 * reads premium on dark.
 */
export function DemoStrip() {
  const trade = 'electrical' as const;
  const c = TRADE_CONTENT[trade];

  return (
    <section id="demo" className="bg-navy-deep text-cream">
      <TradeTheme trade={trade}>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-cream/55">See it work</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              From three sentences to send-ready.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/70">
              Type the job like you’d say it. Toolbelt splits it into labor and materials, totals
              it, and lays it on your brand. You just check the numbers.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
            {/* input */}
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-cream/50">You type</p>
              <p className="mt-3 text-lg leading-relaxed text-cream">
                {c.job}
                <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-accent align-middle" />
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-semibold text-accent-fg shadow-accent">
                <Sparkles className="h-4 w-4" />
                Build line items
              </div>
            </div>

            {/* connector */}
            <div className="flex justify-center text-cream/35">
              <ArrowRight className="hidden h-8 w-8 lg:block" />
              <ArrowDown className="h-7 w-7 lg:hidden" />
            </div>

            {/* output */}
            <div className="relative min-w-0">
              <span className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-lift">
                <BadgeCheck className="h-3.5 w-3.5" />
                Ready to send
              </span>
              <EstimatePreview trade={trade} />
            </div>
          </div>
        </div>
      </TradeTheme>
    </section>
  );
}
