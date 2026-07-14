'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';

type Tone = 'accent' | 'solid' | 'outline';

// Paper & Blueprint: solid safety-orange on paper, crisp edges, honest shadow.
const TONES: Record<Tone, string> = {
  accent: 'bg-accent text-accent-fg hover:brightness-110 hover:-translate-y-0.5 shadow-accent',
  solid: 'bg-ink text-white hover:bg-navy-deep hover:-translate-y-0.5',
  outline: 'border border-hairline-strong bg-paper-800/70 text-ink backdrop-blur hover:bg-paper-750 hover:border-accent/40',
};

/** The one conversion action, repeated across the page. Always → free signup. */
export function StartFreeButton({
  tone = 'accent',
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
      href="/login?mode=signup"
      onClick={() => trackEvent('start_free_click', { label })}
      className={cn(
        'group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 ease-out-soft',
        'active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-900',
        size === 'lg' ? 'h-14 px-7 text-base' : 'h-12 px-6 text-sm',
        TONES[tone],
        className,
      )}
    >
      {label}
      {withArrow ? (
        <ArrowRight className="h-[1.1em] w-[1.1em] transition duration-200 group-hover:translate-x-1" />
      ) : null}
    </Link>
  );
}

/** "No credit card · 3 free estimates · Built for the trades." */
export function TrustLine({ className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <p className={cn('text-sm text-ink-mute', className)}>
      No credit card · 3 free estimates · Built for the trades
    </p>
  );
}
