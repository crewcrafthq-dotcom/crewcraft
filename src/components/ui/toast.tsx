'use client';

import { useSyncExternalStore } from 'react';
import { Check, CircleAlert, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToastKind = 'success' | 'error' | 'info';
type ToastItem = { id: number; message: string; kind: ToastKind };

let items: ToastItem[] = [];
const listeners = new Set<() => void>();
let uid = 0;

function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

/** Fire a toast from anywhere in a client component: toast('Link copied'). */
export function toast(message: string, kind: ToastKind = 'success') {
  const id = ++uid;
  items = [...items, { id, message, kind }];
  emit();
  setTimeout(() => dismiss(id), 3000);
}

const ICON: Record<ToastKind, typeof Check> = { success: Check, error: CircleAlert, info: Info };
const TONE: Record<ToastKind, string> = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  info: 'text-accent-bright',
};

/** Mounted once (root layout). Renders the bottom-right toast stack. */
export function Toaster() {
  const list = useSyncExternalStore(
    subscribe,
    () => items,
    () => items,
  );
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
      {list.map((t) => {
        const Icon = ICON[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex animate-toast-in items-center gap-3 rounded-xl border border-hairline-strong bg-paper-800/95 px-4 py-3 shadow-lift backdrop-blur"
          >
            <Icon className={cn('h-5 w-5 flex-none', TONE[t.kind])} />
            <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="cursor-pointer text-ink-mute transition hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
