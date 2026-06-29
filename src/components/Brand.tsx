import { Hammer } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Crewcraft wordmark + monogram tile. Brand stays navy across all trades. */
export function Brand({
  className,
  showWord = true,
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-navy text-cream shadow-sm">
        <Hammer className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
      {showWord ? <span className="text-lg font-bold tracking-tight text-navy">Crewcraft</span> : null}
    </span>
  );
}
