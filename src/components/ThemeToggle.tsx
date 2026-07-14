'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/cn';

type ThemeName = 'light' | 'dark';

function applyTheme(theme: ThemeName) {
  if (theme === 'dark') document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem('toolbelt-theme', theme);
  } catch {
    /* private mode — theme still applies for this visit */
  }
}

/**
 * Light/dark segmented switch. "Paper" is the light estimate-paper theme,
 * "Jobsite" the original dark one. Persists in localStorage; layout.tsx
 * applies it before first paint.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>('light');

  // Read the applied theme after mount (matches the pre-paint init script).
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  function pick(next: ThemeName) {
    setTheme(next);
    applyTheme(next);
  }

  const OPTIONS: { value: ThemeName; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Paper — light', icon: Sun },
    { value: 'dark', label: 'Jobsite — dark', icon: Moon },
  ];

  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-2 gap-1 rounded-xl bg-paper-850 p-1">
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => pick(o.value)}
            className={cn(
              'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
              active ? 'bg-paper-800 text-ink shadow-card' : 'text-ink-mute hover:text-ink',
            )}
          >
            <Icon className="h-4 w-4" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
