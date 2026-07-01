import { Wrench } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * "Toolbelt, by Crewcraft" lockup. Toolbelt is the product and dominates the
 * mark; "by Crewcraft" is a quiet endorsement underneath (never "powered by").
 * Default renders for the dark canvas (light text); pass `onLight` for the rare
 * light surface (inside a white card).
 */
export function ToolbeltLockup({
  onLight = false,
  endorse = true,
  className,
}: {
  onLight?: boolean;
  endorse?: boolean;
  className?: string;
}) {
  const word = onLight ? 'text-night-900' : 'text-mist';
  const sub = onLight ? 'text-night-600' : 'text-mist-mute';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-accent to-accent/70 text-accent-fg shadow-glow-sm">
        <Wrench className="h-[18px] w-[18px]" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('text-[1.2rem] font-extrabold tracking-tight', word)}>Toolbelt</span>
        {endorse ? (
          <span className={cn('mt-[3px] text-[9.5px] font-semibold uppercase tracking-[0.2em]', sub)}>
            by Crewcraft
          </span>
        ) : null}
      </span>
    </span>
  );
}
