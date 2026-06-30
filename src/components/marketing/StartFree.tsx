import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tone = 'navy' | 'light' | 'accent';

const TONES: Record<Tone, string> = {
  navy: 'bg-navy text-cream hover:bg-navy-deep shadow-card', // high-contrast on beige
  light: 'bg-cream text-navy hover:bg-white shadow-lift', // on the dark band
  accent: 'bg-accent text-accent-fg hover:brightness-95 shadow-accent',
};

/** The one conversion action, repeated across the page. Always → free signup. */
export function StartFreeButton({
  tone = 'navy',
  size = 'lg',
  className,
  label = 'Start free — 3 estimates, no card',
  withArrow = true,
}: {
  tone?: Tone;
  size?: 'md' | 'lg';
  className?: string;
  label?: string;
  withArrow?: boolean;
}) {
  return (
    <Link
      href="/login"
      className={cn(
        'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition duration-150 ease-out-soft',
        'active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        size === 'lg' ? 'h-14 px-7 text-base' : 'h-12 px-6 text-sm',
        TONES[tone],
        className,
      )}
    >
      {label}
      {withArrow ? (
        <ArrowRight className="h-[1.1em] w-[1.1em] transition duration-150 group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}

/** "No credit card · 3 free estimates · Built for the trades." */
export function TrustLine({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <p className={cn('text-sm', tone === 'dark' ? 'text-cream/70' : 'text-navy-muted', className)}>
      No credit card · 3 free estimates · Built for the trades
    </p>
  );
}
