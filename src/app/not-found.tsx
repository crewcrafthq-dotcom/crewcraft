import Link from 'next/link';
import { Compass } from 'lucide-react';

import { buttonClasses } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cream-card text-navy-soft shadow-card">
        <Compass className="h-7 w-7" />
      </span>
      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-navy-muted">404</p>
      <h1 className="mt-1 text-2xl font-bold text-navy">Can’t find that one</h1>
      <p className="mt-1 text-navy-soft">It may have been deleted, or the link is off.</p>
      <Link href="/dashboard" className={buttonClasses('primary', 'md') + ' mt-6'}>
        Back to your apps
      </Link>
    </main>
  );
}
