import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:brightness-95 shadow-sm',
  secondary: 'bg-cream-card text-navy border border-line hover:bg-cream-deep',
  ghost: 'text-navy-soft hover:bg-cream-deep',
  danger: 'text-red-700 hover:bg-red-50 border border-transparent',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm', // 44px — comfortable phone tap target
  lg: 'h-12 px-6 text-base',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition select-none ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

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
