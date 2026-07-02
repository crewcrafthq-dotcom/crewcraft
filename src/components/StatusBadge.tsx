import { cn } from '@/lib/cn';
import type { EstimateStatus } from '@/lib/types';

const STATUS: Record<EstimateStatus, { label: string; className: string; dot: string }> = {
  draft: { label: 'Draft', className: 'bg-night-700 text-mist-soft', dot: 'bg-night-800-muted' },
  sent: { label: 'Sent', className: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  viewed: { label: 'Viewed', className: 'bg-accent/10 text-accent-bright', dot: 'bg-accent' },
  accepted: { label: 'Accepted', className: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  declined: { label: 'Declined', className: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  paid: { label: 'Paid', className: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
};

export function StatusBadge({ status }: { status: EstimateStatus }) {
  const s = STATUS[status] ?? STATUS.draft;
  return (
    <span
      className={cn(
        'inline-flex flex-none items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        s.className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
}
