import { Check } from 'lucide-react';

import { cn } from '@/lib/cn';
import { PRICING_TIERS } from '@/lib/marketing';
import { StartFreeButton } from './StartFree';

// Every plan is the same full product — the strip below the cards says so once.
// The cards differentiate on billing and the perks we can genuinely keep.
const PRODUCT_FEATURES = [
  'AI line items from text or photos',
  'Good / Better / Best options',
  'Customer e-sign on every estimate',
  'Invoices + auto-invoice on acceptance',
  'Online payments via your Stripe',
  'Auto follow-ups & overdue chasing',
  'Customers, analytics & price book',
  'Trade tools: load calc, quote packs & more',
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Pricing</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Start free. Commit when it wins you a job.
        </h2>
        <p className="mt-3 text-lg text-ink-soft">
          No per-seat games, no usage metering. One flat price buys the whole belt — every app we
          ship, not just estimates.
        </p>
      </div>

      <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING_TIERS.map((p) => (
          <div
            key={p.key}
            className={cn(
              'relative flex flex-col rounded-3xl border bg-paper-800 p-6 shadow-card',
              p.featured
                ? 'border-accent ring-1 ring-accent/30 lg:-mt-2 lg:mb-2'
                : 'border-hairline',
            )}
          >
            {p.featured ? (
              <div aria-hidden className="hazard absolute inset-x-0 top-0 h-1.5 rounded-t-3xl opacity-80" />
            ) : null}
            {p.badge ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-fg">
                {p.badge}
              </span>
            ) : null}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold text-ink">{p.name}</h3>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                {p.tag}
              </span>
            </div>
            <p className="mt-3">
              <span className="text-4xl font-extrabold tracking-tight text-ink">{p.price}</span>
              <span className="text-sm text-ink-mute"> {p.unit}</span>
            </p>
            <p className="mt-2 min-h-[2.75rem] text-sm text-ink-soft">{p.blurb}</p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-accent/10 text-accent-bright">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <StartFreeButton
              tone={p.featured ? 'accent' : 'outline'}
              size="md"
              label={p.key === 'free' ? 'Start free' : 'Get started'}
              withArrow={false}
              className="mt-6 w-full"
            />
          </div>
        ))}
      </div>

      {/* one product, one feature list — every plan gets all of it */}
      <div className="mt-8 rounded-2xl border border-hairline bg-paper-800 p-6 shadow-card sm:p-7">
        <p className="text-sm font-bold uppercase tracking-wide text-ink-mute">
          Every plan includes all of it
        </p>
        <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-ink-soft">
              <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-accent/10 text-accent-bright">
                <Check className="h-3.5 w-3.5" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-center text-sm text-ink-mute">
        Every plan starts with 3 free estimates · No credit card · Cancel anytime · Set up in two
        minutes
      </p>
    </section>
  );
}
