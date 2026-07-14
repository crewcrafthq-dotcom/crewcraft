'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  CreditCard,
  FileText,
  LayoutGrid,
  Receipt,
  Settings,
  TrendingUp,
  Users2,
} from 'lucide-react';

import { ToolIcon } from '@/components/ToolIcon';
import { cn } from '@/lib/cn';
import { liveTradeTools } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import type { Trade } from '@/lib/types';

const CORE = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/estimates', label: 'Estimates', icon: FileText },
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/customers', label: 'Customers', icon: Users2 },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/pricebook', label: 'Price Book', icon: BookOpen },
];

const ACCOUNT = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

/**
 * Desktop app sidebar (lg+): the whole platform at a glance — core apps, the
 * contractor's own trade tools first, the rest of the belt underneath. Mobile
 * keeps the top bar (thumbs > cursors on a jobsite).
 */
export function AppSidebar({ trade }: { trade: Trade }) {
  const path = usePathname();
  const tools = liveTradeTools();
  const mine = tools.filter((t) => t.trade === trade);
  const others = tools.filter((t) => t.trade !== trade);
  const tradeLabel = getTheme(trade).label;

  const item = (href: string, label: string, active: boolean, icon: React.ReactNode) => (
    <Link
      key={href}
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition duration-150',
        active ? 'bg-accent/10 font-semibold text-accent-bright' : 'text-ink-soft hover:bg-paper-750 hover:text-ink',
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );

  return (
    <nav
      aria-label="App navigation"
      className="sticky top-16 hidden max-h-[calc(100vh-4rem)] w-60 flex-none flex-col gap-5 self-start overflow-y-auto py-6 pr-4 lg:flex print:hidden"
    >
      <div className="space-y-0.5">
        {CORE.map((l) => {
          const active = l.exact ? path === l.href : path.startsWith(l.href);
          const Icon = l.icon;
          return item(l.href, l.label, active, <Icon className="h-4 w-4 flex-none" />);
        })}
      </div>

      <div>
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
          {tradeLabel} tools
        </p>
        <div className="space-y-0.5">
          {mine.map((t) =>
            item(t.href!, t.name, path.startsWith(t.href!), <ToolIcon icon={t.icon} className="h-4 w-4 flex-none" />),
          )}
          {mine.length === 0 ? (
            <p className="px-3 text-xs text-ink-mute">Trade tools coming.</p>
          ) : null}
        </div>
      </div>

      <div>
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
          More trade tools
        </p>
        <div className="space-y-0.5">
          {others.map((t) =>
            item(t.href!, t.name, path.startsWith(t.href!), <ToolIcon icon={t.icon} className="h-4 w-4 flex-none" />),
          )}
        </div>
      </div>

      <div className="mt-auto border-t border-hairline pt-4">
        <div className="space-y-0.5">
          {ACCOUNT.map((l) => {
            const Icon = l.icon;
            return item(l.href, l.label, path.startsWith(l.href), <Icon className="h-4 w-4 flex-none" />);
          })}
        </div>
      </div>
    </nav>
  );
}
