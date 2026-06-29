import Link from 'next/link';
import { redirect } from 'next/navigation';

import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const { user, business } = await getSession();
  if (user) redirect(business ? '/dashboard' : '/onboarding');

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <span className="text-lg font-bold tracking-tight">Crewcraft</span>
        <Link href="/login" className={buttonClasses('ghost', 'sm')}>
          Log in
        </Link>
      </header>

      <div className="flex flex-1 flex-col justify-center py-12">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Estimates done before you leave the driveway.
        </h1>
        <p className="mt-4 text-lg text-navy-soft">
          Type the job in plain words. Get a clean, branded estimate you can send
          from your phone — in under a minute.
        </p>

        <ul className="mt-8 space-y-3 text-navy">
          {[
            'Describe the work, get itemized line items back.',
            'Your logo, license, and rates on every estimate.',
            'Send a link or PDF. See when the customer opens it.',
          ].map((line) => (
            <li key={line} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link href="/login" className={buttonClasses('primary', 'lg')}>
            Start free
          </Link>
          <p className="mt-3 text-sm text-navy-muted">First 3 estimates are free.</p>
        </div>
      </div>

      <footer className="py-6 text-sm text-navy-muted">
        © {new Date().getFullYear()} Crewcraft
      </footer>
    </main>
  );
}
