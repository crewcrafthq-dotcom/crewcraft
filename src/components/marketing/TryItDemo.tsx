'use client';

import { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

import { TradeIcon } from '@/components/TradeIcon';
import { cn } from '@/lib/cn';
import { trackEvent, trackMeta } from '@/lib/analytics';
import { money } from '@/lib/format';
import { TRADE_BUSINESS, TRADE_CONTENT } from '@/lib/marketing';
import { getTheme, themeVars } from '@/lib/trades';
import { TRADES, type Trade } from '@/lib/types';
import { StartFreeButton } from './StartFree';

type Phase = 'idle' | 'building' | 'done';

interface DemoLine {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface DemoResult {
  scopeOfWork: string;
  lineItems: DemoLine[];
  total: number;
  /** True when the API was unreachable and the canned sample stood in. */
  sample: boolean;
}

/** The canned per-trade sample, shaped like a real result. */
function sampleResult(trade: Trade): DemoResult {
  const c = TRADE_CONTENT[trade];
  return {
    scopeOfWork: c.job,
    lineItems: c.lines.map((l) => ({
      category: l.category,
      description: l.desc,
      quantity: 1,
      unit: '',
      unitPrice: Number(l.amount.replace(/[^0-9.]/g, '')) || 0,
    })),
    total: Number(c.total.replace(/[^0-9.]/g, '')) || 0,
    sample: true,
  };
}

/**
 * Interactive landing demo: type a real job, get real AI line items back.
 *
 * This used to be a canned per-trade script. A visitor could edit the job and
 * still get the same three hardcoded lines — which taught them nothing about
 * whether the model understands their trade, the one thing they came to find
 * out. It now calls /api/public/try-it for a genuine generation, and falls
 * back to the sample only when that call fails, so the section is never dead.
 *
 * The email step below the result is the site's only lead capture: the visitor
 * gets the estimate as a branded PDF, we get someone to follow up with.
 */
export function TryItDemo() {
  const [trade, setTrade] = useState<Trade>('hvac');
  const [job, setJob] = useState(TRADE_CONTENT.hvac.job);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const biz = TRADE_BUSINESS[trade];
  const labor = (result?.lineItems ?? []).filter((l) => l.category === 'labor');
  const materials = (result?.lineItems ?? []).filter((l) => l.category !== 'labor');
  const lineCount = result?.lineItems.length ?? 0;

  function pickTrade(t: Trade) {
    setTrade(t);
    setJob(TRADE_CONTENT[t].job);
    setPhase('idle');
    setResult(null);
    setError(null);
    setSent(false);
    setSendError(null);
  }

  async function build() {
    setPhase('building');
    setError(null);
    setSent(false);
    setSendError(null);
    trackEvent('try_it_build', { trade });

    try {
      const res = await fetch('/api/public/try-it', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ trade, job }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(json.lineItems) && json.lineItems.length > 0) {
        setResult({
          scopeOfWork: String(json.scopeOfWork ?? ''),
          lineItems: json.lineItems as DemoLine[],
          total: Number(json.total) || 0,
          sample: false,
        });
      } else {
        // Rate-limited, AI off, or unreadable: show the sample and say so.
        setError(typeof json.error === 'string' ? json.error : null);
        setResult(sampleResult(trade));
      }
    } catch {
      setError(null);
      setResult(sampleResult(trade));
    }
    setPhase('done');
  }

  async function emailPdf(e: React.FormEvent) {
    e.preventDefault();
    if (!result || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch('/api/public/try-it/pdf', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          businessName: company,
          trade,
          job,
          scopeOfWork: result.scopeOfWork,
          lineItems: result.lineItems,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setSent(true);
        trackEvent('try_it_email_pdf', { trade });
        // The only real pre-signup lead this site has.
        trackMeta('Lead', { content_name: 'try_it_pdf' });
      } else {
        setSendError(typeof json.error === 'string' ? json.error : 'Could not send that.');
      }
    } catch {
      setSendError('Could not send that. Try again.');
    }
    setSending(false);
  }

  return (
    <section id="try" data-trade={trade} style={themeVars(trade)} className="bg-paper-850">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">See it work</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Type a job. Watch the estimate build.
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            No signup. Describe a job you actually quoted this week and see what comes back.
          </p>
        </div>

        {/* trade chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TRADES.map((t) => {
            const theme = getTheme(t);
            const active = t === trade;
            return (
              <button
                key={t}
                type="button"
                onClick={() => pickTrade(t)}
                aria-pressed={active}
                data-trade={t}
                style={themeVars(t)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition',
                  active
                    ? 'border-accent bg-accent text-accent-fg shadow-accent'
                    : 'border-hairline text-ink-soft hover:bg-paper-800 hover:text-ink',
                )}
              >
                <TradeIcon trade={t} className="h-4 w-4" />
                {theme.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          {/* input side */}
          <div className="rounded-2xl border border-hairline bg-paper-800 p-6 shadow-card sm:p-7">
            <label
              htmlFor="try-job"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-mute"
            >
              <Wand2 className="h-4 w-4" />
              The job
            </label>
            <textarea
              id="try-job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              rows={4}
              className="mt-3 w-full rounded-xl border border-hairline bg-paper-850 p-4 leading-relaxed text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
              placeholder="Describe the job in plain words…"
            />
            <button
              type="button"
              onClick={build}
              disabled={phase === 'building'}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-accent-fg shadow-accent transition hover:shadow-glow disabled:opacity-70 sm:w-auto"
            >
              <Sparkles className={cn('h-[1.1em] w-[1.1em]', phase === 'building' && 'animate-pulse')} />
              {phase === 'building' ? 'Building…' : 'Build the estimate'}
            </button>
            <p className="mt-3 text-xs text-ink-mute">
              Real AI, your words, no signup. Labor is priced at a generic $95/hr — your own
              rates replace it once you start free.
            </p>
          </div>

          {/* output side */}
          <div className="min-h-[22rem]">
            {phase === 'idle' ? (
              <div className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-paper-800/40 p-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent-bright">
                  <Sparkles className="h-6 w-6" />
                </span>
                <p className="mt-4 font-semibold text-ink">Your estimate shows up here</p>
                <p className="mt-1 text-sm text-ink-mute">Hit “Build the estimate” to watch it.</p>
              </div>
            ) : phase === 'building' ? (
              <div className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-hairline bg-white/95 p-6 text-center shadow-lift">
                <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-line border-t-accent" />
                <p className="mt-4 text-sm font-medium text-navy-soft">Reading the job…</p>
              </div>
            ) : (
              <div className="animate-fade-up rounded-2xl border border-line bg-white p-5 shadow-lift sm:p-6">
                {/* header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-navy">{biz.name}</p>
                    <p className="text-[11px] text-navy-muted">License {biz.license}</p>
                  </div>
                  <p className="text-sm font-bold tracking-wide text-accent-deep">ESTIMATE</p>
                </div>
                <div className="my-4 h-1 rounded-full bg-accent" />

                {/* staggered line reveal — the "watch it build" moment */}
                <div className="space-y-3">
                  <Group label="Labor" lines={labor} start={0} />
                  <Group label="Materials" lines={materials} start={labor.length} />
                </div>

                <div
                  className="mt-4 flex animate-fade-up items-center justify-between rounded-xl bg-accent px-4 py-3 text-accent-fg"
                  style={{ animationDelay: `${(lineCount + 1) * 140}ms`, animationFillMode: 'both' }}
                >
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold">{money(result?.total ?? 0)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* sample fallback notice — only when the live call didn't land */}
        {phase === 'done' && result?.sample ? (
          <p className="mt-4 text-center text-sm text-ink-mute">
            {error ?? 'The live demo is taking a breather'} — that one is our stock sample.
          </p>
        ) : null}

        {/* email capture: the estimate as a branded PDF */}
        {phase === 'done' && result && !result.sample ? (
          <div className="mt-6 rounded-2xl border border-hairline bg-paper-800 p-6 shadow-card">
            {sent ? (
              <div className="text-center">
                <p className="font-bold text-ink">Sent — check your inbox.</p>
                <p className="mt-1 text-sm text-ink-soft">
                  The PDF is on its way. Open it on your phone: that is what your customer sees.
                </p>
              </div>
            ) : (
              <form onSubmit={emailPdf} className="flex flex-col gap-3">
                <div>
                  <p className="font-bold text-ink">Want this as a PDF?</p>
                  <p className="text-sm text-ink-soft">
                    We will email it over so you can see how it reads on a phone.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company (optional)"
                    aria-label="Your company name"
                    className="h-12 w-full rounded-xl border border-hairline bg-paper-850 px-4 text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    aria-label="Your email"
                    className="h-12 w-full rounded-xl border border-hairline bg-paper-850 px-4 text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex h-12 flex-none items-center justify-center rounded-xl bg-accent px-6 font-semibold text-accent-fg shadow-accent transition hover:shadow-glow disabled:opacity-70"
                  >
                    {sending ? 'Sending…' : 'Email it to me'}
                  </button>
                </div>
                {sendError ? <p className="text-sm text-bad">{sendError}</p> : null}
                <p className="text-xs text-ink-mute">
                  One email with your estimate attached. No list, no drip, unsubscribe not required.
                </p>
              </form>
            )}
          </div>
        ) : null}

        {/* conversion */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-paper-800 p-6 text-center shadow-card sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-bold text-ink">Like what it wrote? Make it yours.</p>
            <p className="text-sm text-ink-soft">
              Your logo, license and real rates on every estimate — e-signed and paid online.
              Three free, no card.
            </p>
          </div>
          <StartFreeButton size="md" label="Start free" className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}

function Group({
  label,
  lines,
  start,
}: {
  label: string;
  lines: DemoLine[];
  start: number;
}) {
  if (lines.length === 0) return null;
  return (
    <div>
      <p
        className="mb-1 animate-fade-up text-xs font-bold text-accent-deep"
        style={{ animationDelay: `${start * 140}ms`, animationFillMode: 'both' }}
      >
        {label}
      </p>
      <div className="divide-y divide-line">
        {lines.map((l, i) => (
          <div
            key={`${l.description}-${i}`}
            className="flex animate-fade-up items-center justify-between gap-3 py-1.5 text-sm"
            style={{ animationDelay: `${(start + i + 1) * 140}ms`, animationFillMode: 'both' }}
          >
            <span className="min-w-0 truncate text-navy-soft">
              {l.description}
              {l.quantity > 1 ? ` · ${l.quantity}${l.unit ? ` ${l.unit}` : ''}` : ''}
            </span>
            <span className="flex-none font-semibold text-navy">
              {money(l.quantity * l.unitPrice)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
