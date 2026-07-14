import * as React from 'react';
import { cn } from '@/lib/cn';

const inputBase =
  'w-full rounded-xl border border-hairline bg-paper-850 px-4 text-ink placeholder:text-ink-mute ' +
  'transition duration-150 ease-out-soft ' +
  'hover:border-hairline-strong ' +
  'focus:bg-paper-800 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputBase, 'h-11', className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(inputBase, 'min-h-[96px] py-3 leading-relaxed', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(inputBase, 'h-11 cursor-pointer appearance-none pr-9', className)}
    {...props}
  />
));
Select.displayName = 'Select';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('field-label', className)} {...props} />;
}
