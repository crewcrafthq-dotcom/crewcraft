import { BadgeCheck } from 'lucide-react';

import { TradeTheme } from '@/components/TradeTheme';

/**
 * The single dark spotlight band (§ "show it fast"). Deep night makes the real
 * product video and the amber accent pop. Electrical theme = navy-on-amber.
 */
export function DemoStrip() {
  return (
    <section id="demo" className="bg-night-950 text-mist">
      <TradeTheme trade="electrical">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-bright">
              See it work
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              From three sentences to send-ready.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-mist-soft">
              Watch a real estimate go from a plain-English job to a branded, send-ready quote — in
              about half a minute.
            </p>
          </div>

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            <span className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-lift">
              <BadgeCheck className="h-3.5 w-3.5" />
              Real demo
            </span>
            <div className="gradient-border overflow-hidden rounded-3xl bg-night-850/60 p-2 shadow-lift sm:p-3">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src="/showcase.mp4"
                controls
                playsInline
                preload="metadata"
                className="aspect-square w-full rounded-2xl bg-black"
              />
            </div>
          </div>
        </div>
      </TradeTheme>
    </section>
  );
}
