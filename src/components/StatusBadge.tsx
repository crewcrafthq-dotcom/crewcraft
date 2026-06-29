import { cn } from '@/lib/cn';
import type { EstimateStatus } from '@/lib/types';

const STATUS: Record<EstimateStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-cream-deep text-navy-soft' },
  sent: { label: 'Sent', className: 'bg-navy/10 text-navy' },
  viewed: { label: 'Viewed', className: 'bg-accent-soft text-accent-deep' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-700' },
};

export function StatusBadge({ status }: { status: EstimateStatus }) {
  const s = STATUS[status] ?? STATUS.draft;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}
