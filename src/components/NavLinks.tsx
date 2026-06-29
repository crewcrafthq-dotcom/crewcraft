'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText } from 'lucide-react';
import { cn } from '@/lib/cn';

const LINKS = [
  { href: '/dashboard', label: 'Apps', icon: LayoutGrid, match: (p: string) => p === '/dashboard' },
  {
    href: '/estimates',
    label: 'Estimates',
    icon: FileText,
    match: (p: string) => p.startsWith('/estimates'),
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
                ? 'bg-cream-deep text-navy'
                : 'text-navy-soft hover:bg-cream-deep/60 hover:text-navy',
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
