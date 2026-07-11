'use client';

import { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

import { TradeIcon } from '@/components/TradeIcon';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';
import { TRADE_BUSINESS, TRADE_CONTENT } from '@/lib/marketing';
import { getTheme, themeVars } from '@/lib/trades';
import { TRADES, type Trade } from '@/lib/types';
import { StartFreeButton } from './StartFree';

type Phase = 'idle' | 'building' | 'done';

/**
 * Interactive landing demo: pick/edit a job, watch an itemized estimate build.
 * Scripted (per-trade canned data), so it's instant, always perfect, and costs
 * nothing — no live AI for anonymous visitors. The "run your own job" path is
 * the free signup, which is the conversion.
 */
export function TryItDemo() {
  const [trade, setTrade] = useState<Trade>('hvac');
  const [job, setJob] = useState(TRADE_CONTENT.hvac.job);
  const [phase, setPhase] = useState<Phase>('idle');

  const c = TRADE_CONTENT[trade];
  const biz = TRADE_BUSINESS[trade];
  const labor = c.lines.filter((l) => l.category === 'labor');
  const materials = c.lines.filter((l) => l.category === 'materials');

  function pickTrade(t: Trade) {
    setTrade(t);
    setJob(TRADE_CONTENT[t].job);
    setPhase('idle');
  }

  function build() {
    setPhase('building');
    trackEvent('try_it_build', { trade });
    // two-beat: a brief "reading the job" pause, then the estimate reveals
    window.setTimeout(() => setPhase('done'), 850);
  }

  return (
    <section id="try" data-trade={trade} style={themeVars(trade)} className="bg-night-850">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">See it work</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-mist sm:text-4xl">
            Type a job. Watch the estimate build.
          </h2>
          <p className="mt-3 text-lg text-mist-soft">
            No signup to look. Pick your trade, tweak the job, and hit build.
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
                    : 'border-hairline text-mist-soft hover:bg-night-800 hover:text-mist',
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
          <div className="rounded-2xl border border-hairline bg-night-800 p-6 shadow-card sm:p-7">
            <label
              htmlFor="try-job"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-mist-mute"
            >
              <Wand2 className="h-4 w-4" />
              The job
            </label>
            <textarea
              id="try-job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              rows={4}
              className="mt-3 w-full rounded-xl border border-hairline bg-night-850 p-4 leading-relaxed text-mist placeholder:text-mist-mute focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
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
            <p className="mt-3 text-xs text-mist-mute">
              This is a sample estimate. Run your own real job — free, no card.
            </p>
          </div>

          {/* output side */}
          <div className="min-h-[22rem]">
            {phase === 'idle' ? (
              <div className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-night-800/40 p-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent-bright">
                  <Sparkles className="h-6 w-6" />
                </span>
                <p className="mt-4 font-semibold text-mist">Your estimate shows up here</p>
                <p className="mt-1 text-sm text-mist-mute">Hit “Build the estimate” to watch it.</p>
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
                  style={{ animationDelay: `${(c.lines.length + 1) * 140}ms`, animationFillMode: 'both' }}
                >
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold">{c.total}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* conversion */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-night-800 p-6 text-center shadow-card sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-bold text-mist">That was a sample. Now do your real job.</p>
            <p className="text-sm text-mist-soft">
              Type it, edit any line, send a branded estimate. Three free, no card.
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
  lines: { desc: string; amount: string }[];
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
            key={l.desc}
            className="flex animate-fade-up items-center justify-between gap-3 py-1.5 text-sm"
            style={{ animationDelay: `${(start + i + 1) * 140}ms`, animationFillMode: 'both' }}
          >
            <span className="min-w-0 truncate text-navy-soft">{l.desc}</span>
            <span className="flex-none font-semibold text-navy">{l.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
