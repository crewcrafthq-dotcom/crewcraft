import * as React from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-hairline bg-paper-800 shadow-card', className)}
      {...props}
    />
  );
}
