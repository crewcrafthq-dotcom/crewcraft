import type { Metadata } from 'next';
import { Check, Clock4, FileText, MoonStar, Send } from 'lucide-react';

import { BeforeAfter } from '@/components/marketing/BeforeAfter';
import { DemoModal, WatchDemoButton } from '@/components/marketing/DemoModal';
import { StartFreeButton, TrustLine } from '@/components/marketing/StartFree';
import { StickyCtaBar } from '@/components/marketing/StickyCtaBar';
import { TradeIcon } from '@/components/TradeIcon';
import { TRADE_CONTENT } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import { TRADES } from '@/lib/types';

/**
 * Meta ads landing page (/lp/meta) — cold, interruption traffic from Facebook
 * and Instagram, ~95% on a phone. One emotional argument, short sections, the
 * demo video up close, and a single repeated CTA. Kept out of organic search
 * via the /lp layout's noindex.
 */
export const metadata: Metadata = {
  title: 'Stop typing quotes at night',
  description:
    'Type the job in plain English, send a branded estimate in under a minute. Built for HVAC, plumbing, electrical & roofing. 3 free — no credit card.',
};

const PAINS = [
  { icon: MoonStar, text: 'Quotes written after dinner, again' },
  { icon: Clock4, text: 'Half-finished estimates stuck in your notes app' },
  { icon: Send, text: 'Jobs that went cold while the paperwork waited' },
];

const STEPS = [
  'Type the job like you’d tell your apprentice',
  'AI drafts the labor & materials — you tweak any line',
  'Send a branded PDF before you leave the driveway',
];

export default function MetaAdPage() {
  return (
    <>
      <main>
        {/* hook */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(80%_60%_at_50%_0%,#000_30%,transparent_75%)]"
          />
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-14 pt-6 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-14 lg:pb-20 lg:pt-10">
            <div className="min-w-0 animate-fade-up">
              <h1 className="text-[2.7rem] font-bold uppercase leading-[0.95] text-ink sm:text-6xl">
                Still typing quotes at <span className="text-accent-bright">9&nbsp;PM?</span>
              </h1>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                Type the job in plain English. Toolbelt writes the estimate — labor, materials,
                totals, your logo — in under a minute. Send it from the driveway.
              </p>

              <ul className="mt-6 space-y-2.5">
                {PAINS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.text} className="flex items-center gap-3 text-ink-soft">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-paper-800 text-ink-mute">
                        <Icon className="h-4 w-4" />
                      </span>
                      {p.text}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <StartFreeButton />
                <WatchDemoButton />
              </div>
              <TrustLine className="mt-4" />
            </div>

            <div className="min-w-0 animate-fade-up [animation-delay:140ms]">
              <div className="gradient-border relative rounded-3xl bg-paper-850/60 p-2 shadow-lift sm:p-3">
                <BeforeAfter trade="hvac" />
              </div>
            </div>
          </div>
        </section>

        {/* how */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
            <h2 className="text-2xl font-bold uppercase text-ink sm:text-3xl">
              Three sentences. That’s the whole job.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <div key={s} className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm font-bold text-accent-fg">
                    {i + 1}
                  </span>
                  <p className="mt-3 text-ink-soft">{s}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-ink-mute">
              <FileText className="h-4 w-4" />
              Prices are suggestions you control — you own the final number, always.
            </p>
          </div>
        </section>

        {/* proof */}
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-bold uppercase text-ink sm:text-3xl">
            Contractors who got their evenings back
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {(['hvac', 'electrical', 'roofing'] as const).map((t) => {
              const c = TRADE_CONTENT[t];
              return (
                <figure key={t} className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
                  <blockquote className="font-medium leading-relaxed text-ink">
                    “{c.testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-ink">
                    {c.testimonial.name}
                    <span className="font-normal text-ink-mute">
                      {' · '}
                      {c.testimonial.trade}, {c.testimonial.city}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {/* built for the trades */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-mute">Built for</span>
            {TRADES.map((t) => {
              const theme = getTheme(t);
              return (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-paper-800 px-3 py-1.5 text-sm font-semibold text-ink-soft"
                >
                  <TradeIcon trade={t} className="h-4 w-4" style={{ color: theme.accent }} />
                  {theme.label}
                </span>
              );
            })}
          </div>
        </section>

        {/* price honesty + objections */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold uppercase text-ink sm:text-3xl">
                  Free to try. Cheap to keep.
                </h2>
                <p className="mt-3 text-lg text-ink-soft">
                  3 estimates free — no card, no timer. If it wins you a job, it’s $19–29/mo flat
                  for unlimited estimates and every new Toolbelt app as it ships. Cancel anytime.
                </p>
                <div className="mt-6">
                  <StartFreeButton label="Quote my next job free" />
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  ['Does it replace my software?', 'No — it kills the quoting part. Keep ServiceTitan, Jobber, whatever you run.'],
                  ['Is the AI making up prices?', 'Every line is a suggestion you can change. The math is computed, never guessed.'],
                  ['Do I need to learn anything?', 'If you can send a text, you can send an estimate. Set up your logo once, done.'],
                ].map(([q, a]) => (
                  <li key={q} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-accent/10 text-accent-bright">
                      <Check className="h-4 w-4" />
                    </span>
                    <p className="text-ink-soft">
                      <strong className="text-ink">{q}</strong> {a}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* final */}
        <section className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6 sm:py-20">
          <h2 className="text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
            Tonight, the paperwork does itself.
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Three free estimates. Under a minute each. No card.
          </p>
          <div className="mt-7 flex justify-center">
            <StartFreeButton />
          </div>
          <TrustLine className="mt-4" />
        </section>
      </main>

      <DemoModal />
      <StickyCtaBar />
    </>
  );
}
