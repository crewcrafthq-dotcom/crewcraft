import { PenLine } from 'lucide-react';

import { EstimatePreview } from './EstimatePreview';
import { TRADE_CONTENT } from '@/lib/marketing';
import type { Trade } from '@/lib/types';

/**
 * Hero visual: a messy job note transforming into a polished estimate, on a
 * loop. The finished estimate is the in-flow element (defines the box); the
 * note overlays it and cross-fades. Reduced-motion shows only the estimate.
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
        <div className="m-auto w-full -rotate-[1.2deg] rounded-2xl border border-line bg-cream-card p-5 shadow-card sm:p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-2.5 py-1 text-xs font-semibold text-navy-soft">
            <PenLine className="h-3.5 w-3.5" />
            Your note
          </span>
          <p className="mt-3 font-medium leading-relaxed text-navy">
            {c.job}
            <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-1 animate-pulse bg-accent align-middle" />
          </p>
          <p className="mt-4 text-sm text-navy-muted">
            …then write it up, total it, make it look pro. After dinner. Again.
          </p>
        </div>
      </div>
    </div>
  );
}
