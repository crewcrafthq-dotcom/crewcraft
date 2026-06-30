import { cn } from '@/lib/cn';
import { TRADE_BUSINESS, TRADE_CONTENT } from '@/lib/marketing';
import type { Trade } from '@/lib/types';

/**
 * A reusable, realistic branded-estimate mock. Uses the accent CSS variables of
 * the nearest [data-trade] wrapper, so the trade selector re-themes it for free.
 */
export function EstimatePreview({
  trade,
  className,
  compact = false,
}: {
  trade: Trade;
  className?: string;
  compact?: boolean;
}) {
  const c = TRADE_CONTENT[trade];
  const biz = TRADE_BUSINESS[trade];
  const initials = biz.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const labor = c.lines.filter((l) => l.category === 'labor');
  const materials = c.lines.filter((l) => l.category === 'materials');

  return (
    <div
      className={cn(
        'w-full min-w-0 rounded-2xl border border-line bg-white shadow-lift',
        compact ? 'p-4' : 'p-5 sm:p-6',
        className,
      )}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-navy text-xs font-bold text-cream">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-navy">{biz.name}</p>
            <p className="truncate text-[11px] text-navy-muted">License {biz.license}</p>
          </div>
        </div>
        <div className="flex-none text-right">
          <p className="text-sm font-bold tracking-wide text-accent-deep">ESTIMATE</p>
          <p className="text-[11px] text-navy-muted">Today</p>
        </div>
      </div>

      <div className="my-4 h-1 rounded-full bg-accent" />

      <p className="text-[10px] font-semibold uppercase tracking-wider text-navy-muted">Prepared for</p>
      <p className="text-sm font-semibold text-navy">{biz.customer}</p>

      <div className="mt-4 space-y-3">
        <PreviewGroup label="Labor" lines={labor} />
        <PreviewGroup label="Materials" lines={materials} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-accent-fg">
        <span className="font-bold">Total</span>
        <span className="text-lg font-bold">{c.total}</span>
      </div>
    </div>
  );
}

function PreviewGroup({
  label,
  lines,
}: {
  label: string;
  lines: { desc: string; amount: string }[];
}) {
  if (lines.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-accent-deep">{label}</p>
      <div className="divide-y divide-line">
        {lines.map((l) => (
          <div key={l.desc} className="flex items-center justify-between gap-3 py-1.5 text-sm">
            <span className="min-w-0 truncate text-navy-soft">{l.desc}</span>
            <span className="flex-none font-semibold text-navy">{l.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
