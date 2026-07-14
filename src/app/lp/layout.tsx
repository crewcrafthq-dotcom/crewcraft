import type { Metadata } from 'next';
import Link from 'next/link';

import { StartFreeButton } from '@/components/marketing/StartFree';
import { ToolbeltLockup } from '@/components/marketing/ToolbeltLockup';

/**
 * Chrome for the paid-traffic landing pages (/lp/meta, /lp/google).
 *
 * Deliberately minimal: no site nav (one job, one CTA — nowhere to leak
 * attention), a logo that still gets you home, and the legal links Meta and
 * Google both require on ad destinations. `noindex` keeps paid pages from
 * competing with the homepage in organic search; ad crawlers don't need
 * indexing to review the page.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-hidden pb-20 lg:pb-0">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-6">
        <Link href="/" aria-label="Toolbelt by Crewcraft — home">
          <ToolbeltLockup />
        </Link>
        <StartFreeButton size="md" label="Start free" withArrow={false} />
      </header>

      {children}

      <footer className="border-t border-hairline bg-paper-850">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-mute sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Toolbelt, by Crewcraft</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition hover:text-ink-soft">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-ink-soft">
              Terms
            </Link>
            <a href="mailto:hello@crewcraftapp.com" className="transition hover:text-ink-soft">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
