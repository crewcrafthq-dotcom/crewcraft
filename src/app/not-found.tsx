import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-navy-muted">404</p>
      <h1 className="mt-2 text-2xl font-bold">Can’t find that one</h1>
      <p className="mt-1 text-navy-soft">It may have been deleted, or the link is off.</p>
      <Link href="/dashboard" className={buttonClasses('primary', 'md') + ' mt-6'}>
        Back to estimates
      </Link>
    </main>
  );
}
