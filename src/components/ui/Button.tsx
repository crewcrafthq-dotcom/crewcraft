import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg shadow-accent hover:brightness-110 active:brightness-95',
  secondary:
    'bg-paper-800 text-ink border border-hairline hover:bg-paper-700 hover:border-hairline-strong',
  ghost: 'text-ink-soft hover:bg-paper-800 hover:text-ink',
  danger: 'text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-500/30',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2', // 44px — comfortable phone tap target
  lg: 'h-12 px-6 text-base gap-2',
};

const BASE =
  'inline-flex items-center justify-center rounded-lg font-semibold cursor-pointer select-none ' +
  'transition duration-150 ease-out-soft active:scale-[0.98] ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-900 ' +
  'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ' +
  '[&>svg]:h-[1.1em] [&>svg]:w-[1.1em] [&>svg]:flex-none';

/** Class string for the button look — reuse on <a> links too. */
export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />
  ),
);
Button.displayName = 'Button';
