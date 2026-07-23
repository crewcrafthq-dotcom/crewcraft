import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ToolbeltLockup } from '@/components/marketing/ToolbeltLockup';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'What shipped in Toolbelt, dated and in plain English — new apps, automations, and fixes for the contractors on the belt.',
  alternates: { canonical: '/changelog' },
  robots: { index: true, follow: true },
};

interface Entry {
  date: string;
  title: string;
  points: string[];
}

// Newest first. Plain English, no ticket numbers — what a contractor would
// actually notice. Add a new entry at the top whenever a PR ships something
// user-visible.
const ENTRIES: Entry[] = [
  {
    date: 'July 19, 2026',
    title: 'PDF downloads that actually download on phones',
    points: [
      'Tapping “Download PDF” on a phone now saves a real file with the customer’s name on it — no more blank taps or preview tabs.',
      'Same fix on the homeowner’s estimate page: the download button downloads.',
    ],
  },
  {
    date: 'July 16, 2026',
    title: 'Five new apps and a security hardening pass',
    points: [
      'Scheduling — a clean agenda plus “tomorrow’s jobs” emailed to you every evening.',
      'Equipment & Filter Log — every unit you’ve touched: model, serial, filter size, refrigerant.',
      'Permit Tracker — permit status per job, with a day-before inspection email.',
      'Seasonal Tune-Up Reminders — “time for your spring check” emails itself and reschedules itself.',
      'Storm/Emergency Lead Page — a public lead form that answers every homeowner instantly, even at 2am.',
      'Review-Getter went fully automatic: invoice paid → review ask sent.',
      'Under the hood: login rate-limiting, daily AI limits per account, hardened browser headers.',
    ],
  },
  {
    date: 'July 14, 2026',
    title: 'The Paper & Blueprint redesign — and three roofing-grade apps',
    points: [
      'New look across the whole app: blueprint light theme, with the original Jobsite Dark one tap away in Settings.',
      'Material Order Sheet — your estimate becomes the supplier list, no re-typing at the counter.',
      'Supplement Drafter — insurance supplement letters drafted in a minute.',
      'Photo Report Builder — roof photos into a captioned, branded PDF; photos never leave your phone.',
      'Estimate PDFs paginate cleanly — rows and totals never split across pages.',
    ],
  },
  {
    date: 'July 11, 2026',
    title: 'Toolbelt on your home screen, estimates in 22 languages',
    points: [
      'Install Toolbelt like an app — add it to your phone’s home screen, no app store needed.',
      'Every estimate can carry a PDF language: English, Spanish, Romanian, and 19 more.',
    ],
  },
  {
    date: 'July 5, 2026',
    title: 'Try it without signing up',
    points: [
      'The homepage now has a live demo — type a job, watch the estimate build itself, no account needed.',
    ],
  },
  {
    date: 'July 3, 2026',
    title: 'Integrated payments (your own Stripe)',
    points: [
      'Connect your Stripe account and every accepted estimate can take a deposit online — money goes straight to you.',
      'Payments reconcile themselves: the invoice is marked paid the moment the charge succeeds.',
      'Accepted estimates can turn into invoices automatically (flip it on in Settings).',
    ],
  },
  {
    date: 'July 2, 2026',
    title: 'The big one: e-sign, invoices, follow-ups, photos, tiers',
    points: [
      'Customers accept and e-sign estimates right on the link — typed-name signature, straight onto the PDF.',
      'Invoices with INV numbering, due dates, and a PAID stamp — one tap from any accepted estimate.',
      'Automatic follow-ups chase quiet quotes and overdue invoices, politely, max twice.',
      'Photo-to-estimate: snap the job, the AI drafts the line items.',
      'Good / Better / Best pricing options on any estimate.',
      'Price book, Customers, and Analytics apps join the belt.',
    ],
  },
  {
    date: 'June 29, 2026',
    title: 'Toolbelt launches',
    points: [
      'Describe a job in plain English, get an itemized, branded, sendable estimate — the flagship Estimate Builder goes live for HVAC, plumbing, electrical, and roofing.',
    ],
  },
];

export default function ChangelogPage() {
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

      <h1 className="mt-10 text-3xl font-bold text-ink sm:text-4xl">Changelog</h1>
      <p className="mt-2 text-ink-soft">
        Everything that ships, dated and in plain English. This page is the honest answer to
        “is this thing actively worked on?” — judge for yourself.
      </p>

      <div className="mt-10 space-y-10">
        {ENTRIES.map((entry) => (
          <article key={entry.date} className="relative border-l-2 border-hairline pl-6">
            <span
              aria-hidden
              className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent"
            />
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-mute">
              {entry.date}
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink">{entry.title}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft">
              {entry.points.map((p) => (
                <li key={p} className="leading-relaxed">
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-12 border-t border-hairline pt-6 text-sm text-ink-mute">
        Want something on this page? Email{' '}
        <a href="mailto:support@crewcraftapp.com" className="font-medium text-ink-soft underline">
          support@crewcraftapp.com
        </a>{' '}
        — founding members vote on what gets built next.
      </p>
    </main>
  );
}
