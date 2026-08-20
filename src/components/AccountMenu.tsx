'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Compass, CreditCard, LogOut, Settings } from 'lucide-react';

import { cn } from '@/lib/cn';
import { createClient } from '@/lib/supabase/client';

export function AccountMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const initial = (name?.trim()?.[0] ?? 'C').toUpperCase();

  async function signOut() {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex cursor-pointer items-center gap-1 rounded-full border border-hairline bg-paper-800 py-1 pl-1 pr-2 shadow-sm transition hover:border-hairline-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/45"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-sm font-bold text-accent-fg">
          {initial}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-ink-mute transition', open && 'rotate-180')} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 origin-top-right animate-fade-up rounded-2xl border border-hairline bg-paper-800 p-1.5 shadow-lift"
        >
          <div className="truncate px-3 py-2 text-sm font-semibold text-ink">{name || 'Your business'}</div>
          <div className="my-1 h-px bg-hairline" />
          <MenuLink href="/settings" icon={Settings}>
            Settings
          </MenuLink>
          <MenuLink href="/billing" icon={CreditCard}>
            Billing & plan
          </MenuLink>
          <MenuLink href="/blog" icon={Compass}>
            Field Guide
          </MenuLink>
          <div className="my-1 h-px bg-hairline" />
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper-700 hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper-700 hover:text-ink"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
