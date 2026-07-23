import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ToolbeltLockup } from '@/components/marketing/ToolbeltLockup';

/**
 * Shared frame for /privacy and /terms — plain-English legal pages in the site
 * theme. Sections are h2 + paragraphs/lists supplied by the page.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <ToolbeltLockup />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the site
        </Link>
      </div>

      <h1 className="mt-10 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-ink-mute">Last updated: {updated}</p>

      <div className="legal-prose mt-8 space-y-8">{children}</div>

      <p className="mt-12 border-t border-hairline pt-6 text-sm text-ink-mute">
        Questions? Email{' '}
        <a href="mailto:support@crewcraftapp.com" className="font-medium text-ink-soft underline">
          support@crewcraftapp.com
        </a>
        {' '}— a person answers, within 24 hours.
      </p>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
