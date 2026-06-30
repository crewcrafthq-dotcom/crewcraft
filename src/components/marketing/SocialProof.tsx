import { TradeIcon } from '@/components/TradeIcon';
import { themeVars, getTheme } from '@/lib/trades';
import { TRADE_CONTENT } from '@/lib/marketing';
import type { Trade } from '@/lib/types';
import { StartFreeButton } from './StartFree';

const PICKS: Trade[] = ['hvac', 'electrical', 'roofing'];

export function SocialProof() {
  return (
    <section className="bg-cream-sunken">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold leading-tight text-navy sm:text-4xl">
          Contractors who stopped doing paperwork at midnight.
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PICKS.map((t) => {
            const c = TRADE_CONTENT[t];
            const theme = getTheme(t);
            return (
              <figure
                key={t}
                data-trade={t}
                style={themeVars(t)}
                className="flex flex-col rounded-2xl border border-line bg-cream-card p-6 shadow-card"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-fg">
                  <TradeIcon trade={t} className="h-3.5 w-3.5" />
                  {theme.label}
                </span>
                <blockquote className="mt-4 flex-1 font-medium leading-relaxed text-navy">
                  “{c.testimonial.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-navy">
                  {c.testimonial.name}
                  <span className="font-normal text-navy-muted"> · {c.testimonial.city}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* CTA sits right next to the proof, not in a silo */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-line bg-cream-card p-6 text-center shadow-card sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-bold text-navy">Your estimate’s next.</p>
            <p className="text-sm text-navy-soft">Under a minute, start to send. Three free, no card.</p>
          </div>
          <StartFreeButton size="md" className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
