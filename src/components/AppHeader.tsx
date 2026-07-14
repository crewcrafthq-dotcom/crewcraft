import Link from 'next/link';
import { Plus } from 'lucide-react';

import { AccountMenu } from '@/components/AccountMenu';
import { Brand } from '@/components/Brand';
import { NavLinks } from '@/components/NavLinks';
import { buttonClasses } from '@/components/ui/Button';

export function AppHeader({ businessName }: { businessName: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-paper-900/80 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <Link href="/dashboard" aria-label="Toolbelt home">
            <Brand />
          </Link>
          <NavLinks />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/estimates/new"
            aria-label="New estimate"
            className={buttonClasses('primary', 'sm')}
          >
            <Plus />
            <span className="hidden sm:inline">New estimate</span>
          </Link>
          <AccountMenu name={businessName} />
        </div>
      </div>
    </header>
  );
}
