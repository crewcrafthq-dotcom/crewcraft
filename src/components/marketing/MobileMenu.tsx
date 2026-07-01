'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/cn';
import { StartFreeButton } from './StartFree';
import { ToolbeltLockup } from './ToolbeltLockup';

/** Right slide-in mobile nav with a dark overlay backdrop (no native dropdowns). */
export function MobileMenu({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-mist transition hover:bg-night-800"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* panel */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[80%] max-w-xs flex-col border-l border-hairline bg-night-900 p-6 shadow-lift transition-transform duration-300 ease-out-soft',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between">
          <ToolbeltLockup />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-mist transition hover:bg-night-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-mist-soft transition hover:bg-night-800 hover:text-mist"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-3 text-base font-medium text-mist-soft transition hover:bg-night-800 hover:text-mist"
          >
            Log in
          </Link>
        </nav>

        <div className="mt-auto pt-6">
          <StartFreeButton size="md" label="Start free" withArrow={false} className="w-full" />
        </div>
      </aside>
    </div>
  );
}
