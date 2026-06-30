import { Wrench } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * "Toolbelt, by Crewcraft" lockup. Toolbelt is the product and dominates;
 * Crewcraft is a quiet endorsement (never "powered by"). Tone switches the
 * wordmark color for the dark band / footer.
 */
export function ToolbeltLockup({
  tone = 'light',
  endorse = true,
  className,
}: {
  tone?: 'light' | 'dark';
  endorse?: boolean;
  className?: string;
}) {
  const word = tone === 'dark' ? 'text-cream' : 'text-navy';
  const sub = tone === 'dark' ? 'text-cream/60' : 'text-navy-muted';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-accent text-accent-fg shadow-sm">
        <Wrench className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('text-lg font-bold tracking-tight', word)}>Toolbelt</span>
        {endorse ? (
          <span className={cn('mt-0.5 text-[11px] font-medium', sub)}>by Crewcraft</span>
        ) : null}
      </span>
    </span>
  );
}
