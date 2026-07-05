import { Zap, Sparkles, ShieldCheck, Crosshair, Smartphone, CircleDollarSign } from 'lucide-react';

import { RevealGroup } from './RevealGroup';

const REASONS = [
  {
    icon: Zap,
    title: '60 seconds, not 20 minutes',
    body: 'Type a few sentences the way you’d say them. A full labor-and-materials estimate comes back before you finish your coffee.',
  },
  {
    icon: Sparkles,
    title: 'Looks like you hired a designer',
    body: 'Your logo, license, and colors on every quote. The kind of estimate that makes a homeowner trust the number — and you.',
  },
  {
    icon: ShieldCheck,
    title: 'You own every number',
    body: 'The AI suggests, the math is computed, and you set the final price. Never a black box — it’s your quote, always.',
  },
  {
    icon: Crosshair,
    title: 'One job, done right',
    body: 'Not a bloated CRM you’ll use 10% of. Toolbelt quotes — fast, clean, professional. That focus is the whole point.',
  },
  {
    icon: Smartphone,
    title: 'Works from the driveway',
    body: 'Quote on your phone between calls. Send the branded estimate before you pull away from the curb.',
  },
  {
    icon: CircleDollarSign,
    title: 'One flat price, start free',
    body: 'Three free estimates, no card. Then $19–29 flat — no per-seat games, no surprise fees, cancel anytime.',
  },
];

export function WhyToolbelt() {
  return (
    <section id="why" className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Why Toolbelt</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-mist sm:text-4xl">
          Built for the truck, not the back office.
        </h2>
        <p className="mt-3 text-lg text-mist-soft">
          The competition sells you a do-everything system. Toolbelt does the one thing you dread —
          and makes it a minute of your day.
        </p>
      </div>

      <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              style={{ '--i': i } as React.CSSProperties}
              className="reveal-child card-dark card-interactive group p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent-bright ring-1 ring-accent/20 transition group-hover:bg-accent group-hover:text-accent-fg">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-mist">{r.title}</h3>
              <p className="mt-2 leading-relaxed text-mist-soft">{r.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </section>
  );
}
