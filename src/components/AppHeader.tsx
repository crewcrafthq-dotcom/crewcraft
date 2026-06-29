import Link from 'next/link';

import { buttonClasses } from '@/components/ui/Button';
import { SignOutButton } from '@/components/SignOutButton';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          Crewcraft
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/estimates/new" className={buttonClasses('primary', 'sm')}>
            New estimate
          </Link>
          <Link href="/settings" className={buttonClasses('ghost', 'sm')}>
            Settings
          </Link>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}
