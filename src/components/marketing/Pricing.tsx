import { Check } from 'lucide-react';

import { cn } from '@/lib/cn';
import { PRICING } from '@/lib/marketing';
import { StartFreeButton } from './StartFree';

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Pricing</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-navy sm:text-4xl">
          One tool, one price. No feature maze.
        </h2>
        <p className="mt-3 text-lg text-navy-soft">
          Start free. Upgrade once it’s paid for itself — about one job.
        </p>
      </div>

      <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-3">
        {/* Free */}
        <PlanCard name={PRICING.free.name} price={PRICING.free.price} cadence={PRICING.free.cadence} line={PRICING.free.line}>
          <Features items={PRICING.free.features} />
        </PlanCard>

        {/* Pro — anchor */}
        <PlanCard
          featured
          name={PRICING.pro.name}
          price={PRICING.pro.price}
          cadence={PRICING.pro.cadence}
          sub={PRICING.pro.annual}
          line={PRICING.pro.line}
        >
          <Features items={PRICING.pro.features} />
        </PlanCard>

        {/* Founding */}
        <PlanCard
          name={PRICING.founding.name}
          price={PRICING.founding.price}
          cadence={PRICING.founding.cadence}
          line={PRICING.founding.line}
        >
          <p className="text-sm text-navy-soft">
            Everything in Pro, locked at the lowest price we’ll ever offer.
          </p>
        </PlanCard>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  cadence,
  sub,
  line,
  featured,
  children,
}: {
  name: string;
  price: string;
  cadence: string;
  sub?: string;
  line: string;
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl border bg-cream-card p-6 shadow-card',
        featured ? 'border-accent shadow-lift ring-1 ring-accent/30' : 'border-line',
      )}
    >
      {featured ? (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-fg">
          Most popular
        </span>
      ) : null}
      <h3 className="font-semibold text-navy">{name}</h3>
      <p className="mt-2">
        <span className="text-4xl font-bold tracking-tight text-navy">{price}</span>
        <span className="text-sm text-navy-muted"> {cadence}</span>
      </p>
      {sub ? <p className="mt-0.5 text-sm text-navy-muted">{sub}</p> : null}
      <p className="mt-3 text-sm text-navy-soft">{line}</p>
      <div className="mt-5 flex-1">{children}</div>
      <StartFreeButton size="md" label="Start free" withArrow={false} className="mt-6 w-full" />
    </div>
  );
}

function Features({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((f) => (
        <li key={f} className="flex items-center gap-2.5 text-sm text-navy-soft">
          <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-accent-soft text-accent-deep">
            <Check className="h-3.5 w-3.5" />
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}
