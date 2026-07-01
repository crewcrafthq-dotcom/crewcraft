'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { PlayCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

// Tiny module store so any trigger (hero button, footer link) can open the one
// modal that's mounted at the page root. Same pattern as the toast store.
let open = false;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function openDemo() {
  open = true;
  emit();
}
function closeDemo() {
  open = false;
  emit();
}

/** Mounted once at the page root. The demo video popup with a top-left close. */
export function DemoModal() {
  const isOpen = useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );

  // Close on Escape and lock body scroll while the popup is up.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDemo();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Toolbelt product demo"
    >
      {/* dim + blur backdrop; click anywhere off the video to close */}
      <button
        type="button"
        aria-label="Close demo"
        onClick={closeDemo}
        className="absolute inset-0 animate-fade-in cursor-default bg-night-950/85 backdrop-blur-sm"
      />

      {/* X button, top-left of the screen (as requested) */}
      <button
        type="button"
        onClick={closeDemo}
        aria-label="Close demo"
        className="fixed left-4 top-4 z-[80] inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong bg-night-800/90 text-mist shadow-lift backdrop-blur transition hover:border-accent/40 hover:bg-night-700"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative w-full max-w-xl animate-fade-up">
        <div className="gradient-border overflow-hidden rounded-3xl bg-night-850/80 p-2 shadow-lift sm:p-3">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src="/showcase.mp4"
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="aspect-square w-full rounded-2xl bg-black"
          />
        </div>
      </div>
    </div>
  );
}

/** The primary hero trigger — matches the old outline button styling. */
export function WatchDemoButton() {
  return (
    <button
      type="button"
      onClick={openDemo}
      className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-hairline-strong bg-night-800/70 px-6 font-semibold text-mist backdrop-blur transition duration-200 hover:border-accent/40 hover:bg-night-700"
    >
      <PlayCircle className="h-5 w-5 text-accent-bright" />
      Watch the 35-second demo
    </button>
  );
}

/** A plain text-link trigger (used in the footer). */
export function DemoTextLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button type="button" onClick={openDemo} className={cn('cursor-pointer text-left', className)}>
      {children}
    </button>
  );
}
