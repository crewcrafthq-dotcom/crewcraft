import { PenLine } from 'lucide-react';

import { EstimatePreview } from './EstimatePreview';
import { TRADE_CONTENT } from '@/lib/marketing';
import type { Trade } from '@/lib/types';

/**
 * Hero visual: a scribbled job note transforming into a polished estimate, on a
 * loop. The finished (white) estimate is the in-flow element; the dark note
 * overlays it and cross-fades. Reduced-motion shows only the estimate.
 */
export function BeforeAfter({ trade = 'hvac' }: { trade?: Trade }) {
  const c = TRADE_CONTENT[trade];

  return (
    <div className="relative">
      {/* AFTER — the finished estimate (defines height) */}
      <div className="anim-after">
        <EstimatePreview trade={trade} />
      </div>

      {/* BEFORE — the scribbled note, overlaid */}
      <div className="anim-before absolute inset-0 flex">
        <div className="m-auto w-full -rotate-[1.4deg] rounded-2xl border border-hairline-strong bg-paper-800 p-5 shadow-lift sm:p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-700 px-2.5 py-1 text-xs font-semibold text-ink-soft">
            <PenLine className="h-3.5 w-3.5" />
            Your note
          </span>
          <p className="mt-3 font-medium leading-relaxed text-ink">
            {c.job}
            <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-1 animate-pulse bg-accent align-middle" />
          </p>
          <p className="mt-4 text-sm text-ink-mute">
            …then write it up, total it, make it look pro. After dinner. Again.
          </p>
        </div>
      </div>
    </div>
  );
}
