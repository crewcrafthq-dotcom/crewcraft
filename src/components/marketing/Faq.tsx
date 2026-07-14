'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { cn } from '@/lib/cn';
import { FAQ } from '@/lib/marketing';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
      <h2 className="text-center text-3xl font-bold leading-tight text-ink sm:text-4xl">
        Straight answers.
      </h2>

      <div className="mt-10 space-y-3">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={cn(
                'overflow-hidden rounded-2xl border bg-paper-800 shadow-card transition-colors',
                isOpen ? 'border-accent/40' : 'border-hairline',
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-semibold text-ink"
              >
                {item.q}
                <span
                  className={cn(
                    'grid h-7 w-7 flex-none place-items-center rounded-full border transition-all duration-300',
                    isOpen
                      ? 'rotate-45 border-accent bg-accent text-accent-fg'
                      : 'border-hairline-strong text-ink-mute',
                  )}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </button>

              {/* 0fr → 1fr gives a smooth, content-height-agnostic expand */}
              <div
                className="grid transition-all duration-300 ease-out-soft"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 leading-relaxed text-ink-soft">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
