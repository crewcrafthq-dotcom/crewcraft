'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, Receipt, TrendingUp, Users2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const LINKS = [
  { href: '/dashboard', label: 'Apps', icon: LayoutGrid, match: (p: string) => p === '/dashboard' },
  {
    href: '/estimates',
    label: 'Estimates',
    icon: FileText,
    match: (p: string) => p.startsWith('/estimates'),
  },
  {
    href: '/invoices',
    label: 'Invoices',
    icon: Receipt,
    match: (p: string) => p.startsWith('/invoices'),
  },
  {
    href: '/customers',
    label: 'Customers',
    icon: Users2,
    match: (p: string) => p.startsWith('/customers'),
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: TrendingUp,
    match: (p: string) => p.startsWith('/analytics'),
  },
];

export function NavLinks() {
  const path = usePathname();
  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {LINKS.map((l) => {
        const active = l.match(path);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition duration-150',
              active
                ? 'bg-night-700 text-mist'
                : 'text-mist-soft hover:bg-night-700/60 hover:text-mist',
            )}
          >
            <Icon className="h-4 w-4" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
