import { Check } from 'lucide-react';

import { cn } from '@/lib/cn';
import { StartFreeButton } from './StartFree';

// The three real plans — mapped 1:1 to the Stripe prices and the billing page.
const FEATURES = [
  'Unlimited estimates',
  'AI labor & material line items',
  'Branded PDF + shareable link',
  'Email + open tracking',
];

const PLANS = [
  {
    name: 'Pro',
    tag: 'Monthly',
    price: '$29',
    unit: '/mo',
    note: 'Cancel anytime, no contract.',
    featured: false,
    badge: '',
  },
  {
    name: 'Founding',
    tag: 'Lifetime rate',
    price: '$19',
    unit: '/mo for life',
    note: 'First 100 contractors only — the lowest price we’ll ever offer.',
    featured: true,
    badge: 'Best deal · first 100',
  },
  {
    name: 'Pro Annual',
    tag: 'Best value',
    price: '$24',
    unit: '/mo',
    note: 'Billed yearly ($288) — two months free.',
    featured: false,
    badge: '',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Pricing</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-mist sm:text-4xl">
          Pick the plan that fits.
        </h2>
        <p className="mt-3 text-lg text-mist-soft">
          No per-seat games, no usage metering. One flat price — most guys make it back on the first
          job.
        </p>
      </div>

      <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={`${p.name}-${p.tag}`}
            className={cn(
              'relative flex flex-col rounded-3xl border bg-night-800 p-6 shadow-card',
              p.featured
                ? 'border-accent shadow-glow ring-1 ring-accent/30 sm:-mt-2 sm:mb-2'
                : 'border-hairline',
            )}
          >
            {p.badge ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-fg">
                {p.badge}
              </span>
            ) : null}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold text-mist">{p.name}</h3>
              <span className="text-xs font-semibold uppercase tracking-wide text-mist-mute">
                {p.tag}
              </span>
            </div>
            <p className="mt-3">
              <span className="text-4xl font-extrabold tracking-tight text-mist">{p.price}</span>
              <span className="text-sm text-mist-mute"> {p.unit}</span>
            </p>
            <p className="mt-2 min-h-[2.75rem] text-sm text-mist-soft">{p.note}</p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-mist-soft">
                  <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-accent/10 text-accent-bright">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <StartFreeButton
              tone={p.featured ? 'accent' : 'outline'}
              size="md"
              label="Get started"
              withArrow={false}
              className="mt-6 w-full"
            />
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-mist-mute">
        Cancel anytime · No contracts · Set up in two minutes
      </p>
    </section>
  );
}
