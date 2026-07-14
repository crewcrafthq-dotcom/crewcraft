import type { Metadata } from 'next';
import { Check, CircleDollarSign, FileText, Mail, Smartphone, Sparkles, X, Zap } from 'lucide-react';

import { EstimatePreview } from '@/components/marketing/EstimatePreview';
import { StartFreeButton, TrustLine } from '@/components/marketing/StartFree';
import { StickyCtaBar } from '@/components/marketing/StickyCtaBar';
import { TradeIcon } from '@/components/TradeIcon';
import { TradeTheme } from '@/components/TradeTheme';
import { cn } from '@/lib/cn';
import { PRICING_TIERS, TRADE_CONTENT } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import { TRADES } from '@/lib/types';

/**
 * Google Ads landing page (/lp/google) — high-intent search traffic
 * ("contractor estimate software", "hvac estimate app", …). These visitors are
 * comparing tools, so the page answers like a spec sheet: exact features,
 * exact prices, objections handled, no mystery. Noindex via the /lp layout.
 */
export const metadata: Metadata = {
  title: 'Contractor Estimate Software — Branded Quotes in 60 Seconds',
  description:
    'Estimate software for HVAC, plumbing, electrical & roofing contractors. Type the job, get AI line items, send a branded PDF. Free to start, from $19/mo.',
};

const FEATURES = [
  { icon: Zap, title: 'AI line items in seconds', body: 'Type the job in plain English — labor and materials come back split out and totaled.' },
  { icon: Sparkles, title: 'Your brand on every quote', body: 'Logo, license, and trade colors on a clean PDF and a phone-friendly link.' },
  { icon: Mail, title: 'Email + open tracking', body: 'Send from the app and see the moment the customer opens it.' },
  { icon: Smartphone, title: 'Built for the driveway', body: 'Everything works one-handed on a phone, between calls.' },
  { icon: FileText, title: 'Computed math, always', body: 'Quantities × unit prices, tax, deposits — calculated in code, never guessed by AI.' },
  { icon: CircleDollarSign, title: 'Flat, honest pricing', body: '3 estimates free. Then $19–29/mo flat for unlimited — every new app included.' },
];

const COMPARE: { row: string; toolbelt: boolean | string; crm: boolean | string; hand: boolean | string }[] = [
  { row: 'Time to a sendable estimate', toolbelt: '~60 seconds', crm: '15–30 min', hand: 'Your evening' },
  { row: 'Looks professionally designed', toolbelt: true, crm: true, hand: false },
  { row: 'Learning curve', toolbelt: 'None', crm: 'Weeks', hand: 'None' },
  { row: 'Price', toolbelt: 'From $19/mo', crm: '$100–300+/mo', hand: '“Free”' },
  { row: 'Works alongside your current software', toolbelt: true, crm: false, hand: true },
];

export default function GoogleAdPage() {
  return (
    <>
      <main>
        {/* message-matched hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(80%_60%_at_50%_0%,#000_30%,transparent_75%)]"
          />
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-14 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20 lg:pt-10">
            <div className="min-w-0 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-bright">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                HVAC · Plumbing · Electrical · Roofing
              </span>
              <h1 className="mt-5 text-[2.7rem] font-bold uppercase leading-[0.95] text-ink sm:text-6xl">
                Estimate software built for contractors
              </h1>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                Type the job in plain English, get AI-drafted labor and material line items, and
                send a branded estimate in under a minute — from your phone.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <StartFreeButton label="Start free — 3 estimates" />
              </div>
              <TrustLine className="mt-4" />
            </div>

            <div className="min-w-0 animate-fade-up [animation-delay:140ms]">
              <TradeTheme trade="hvac">
                <div className="gradient-border rounded-3xl bg-paper-850/60 p-2 shadow-lift sm:p-3">
                  <EstimatePreview trade="hvac" />
                </div>
              </TradeTheme>
            </div>
          </div>
        </section>

        {/* spec sheet */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
            <h2 className="text-2xl font-bold uppercase text-ink sm:text-3xl">
              Everything you need to quote. Nothing you don’t.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent-bright ring-1 ring-accent/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 font-bold text-ink">{f.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* comparison */}
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-bold uppercase text-ink sm:text-3xl">
            Not another CRM. On purpose.
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            The big platforms do everything, so quoting takes a training course. Toolbelt does one
            job — the estimate — and does it in a minute.
          </p>

          <div className="mt-7 overflow-x-auto rounded-2xl border border-hairline shadow-card">
            <table className="w-full min-w-[560px] border-collapse bg-paper-800 text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-ink">
                  <th className="p-4 font-semibold text-ink-mute"> </th>
                  <th className="p-4 font-bold text-accent-bright">Toolbelt</th>
                  <th className="p-4 font-semibold">Do-it-all CRMs</th>
                  <th className="p-4 font-semibold">Typing it yourself</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.row} className="border-b border-hairline last:border-0">
                    <td className="p-4 font-medium text-ink">{r.row}</td>
                    {[r.toolbelt, r.crm, r.hand].map((v, i) => (
                      <td key={i} className={cn('p-4', i === 0 ? 'text-ink' : 'text-ink-soft')}>
                        {v === true ? (
                          <Check className="h-5 w-5 text-accent-bright" aria-label="Yes" />
                        ) : v === false ? (
                          <X className="h-5 w-5 text-ink-mute" aria-label="No" />
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* trades */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
            <h2 className="text-2xl font-bold uppercase text-ink sm:text-3xl">
              It speaks your trade
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {TRADES.map((t) => {
                const theme = getTheme(t);
                const c = TRADE_CONTENT[t];
                return (
                  <TradeTheme key={t} trade={t}>
                    <div className="flex h-full items-start gap-3.5 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-accent text-accent-fg">
                        <TradeIcon trade={t} className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-ink">{theme.label}</h3>
                        <p className="mt-1 text-sm text-ink-soft">“{c.job}”</p>
                        <p className="mt-2 text-xs font-semibold text-accent-bright">
                          → itemized and totaled at {c.total}
                        </p>
                      </div>
                    </div>
                  </TradeTheme>
                );
              })}
            </div>
          </div>
        </section>

        {/* transparent pricing */}
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-bold uppercase text-ink sm:text-3xl">Pricing, up front</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_TIERS.map((p) => (
              <div
                key={p.key}
                className={cn(
                  'relative flex flex-col rounded-2xl border bg-paper-800 p-5 shadow-card',
                  p.featured ? 'border-accent ring-1 ring-accent/30' : 'border-hairline',
                )}
              >
                {p.featured ? (
                  <div aria-hidden className="hazard absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-80" />
                ) : null}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-bold text-ink">{p.name}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-mute">{p.tag}</span>
                </div>
                <p className="mt-2">
                  <span className="text-3xl font-extrabold tracking-tight text-ink">{p.price}</span>
                  <span className="text-xs text-ink-mute"> {p.unit}</span>
                </p>
                <p className="mt-1.5 flex-1 text-xs text-ink-soft">{p.blurb}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-mute">
            Every paid plan: unlimited estimates + every new Toolbelt app as it ships. Cancel
            anytime — no contracts, no per-seat fees.
          </p>
          <div className="mt-6">
            <StartFreeButton label="Start free — no credit card" />
          </div>
        </section>

        {/* beyond the quote + final */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Customer e-sign', 'Every estimate link has an accept button — typed-name signature, straight onto the PDF.'],
                ['Invoices & payments', 'Accepted estimates become invoices, and your Stripe takes the deposit online.'],
                ['Automatic follow-ups', 'Quiet quotes and overdue invoices get chased for you, politely, on a schedule.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
                  <h3 className="text-sm font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <h2 className="text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
                Your next estimate, in a minute.
              </h2>
              <p className="mt-3 text-lg text-ink-soft">
                3 free estimates. No credit card. Set up in two minutes.
              </p>
              <div className="mt-7 flex justify-center">
                <StartFreeButton />
              </div>
            </div>
          </div>
        </section>
      </main>

      <StickyCtaBar />
    </>
  );
}
