import type { Metadata } from 'next';

import { LegalPage, LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'The cookies Toolbelt by Crewcraft uses: login sessions, ad-conversion measurement, and nothing else. No data brokers, no cross-site tracking.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="August 20, 2026">
      <LegalSection title="The short version">
        <p>
          Toolbelt uses the smallest set of cookies that still lets the product work: one to keep
          you logged in, one to remember your theme, and — only if you arrived from an ad — the
          standard Google Ads tag so we know the ad worked. No data brokers, no cross-site
          tracking networks, no selling anything to anyone.
        </p>
      </LegalSection>

      <LegalSection title="Cookies we set">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Login session</strong> — a secure, HTTP-only cookie from
            our auth provider (Supabase) that keeps you signed in. Strictly necessary; the app
            can’t work without it.
          </li>
          <li>
            <strong className="text-ink">Theme preference</strong> — stored in your browser’s
            local storage (not sent to any server) so the app remembers light or dark mode.
          </li>
          <li>
            <strong className="text-ink">Google Ads conversion tag</strong> — set only when you
            land here from a Google ad, so we can count that the ad led to a signup. It measures
            the ad, not you.
          </li>
        </ul>
        <p>
          Our page analytics (Vercel Analytics) are anonymous and cookieless — they don’t set or
          read anything on your device.
        </p>
      </LegalSection>

      <LegalSection title="Managing cookies">
        <p>
          You can clear or block cookies in your browser settings at any time. Blocking the
          session cookie will log you out; blocking the ad tag changes nothing about how the
          product works. The full picture of what data we hold and why is in the{' '}
          <a href="/privacy" className="font-medium text-ink underline">privacy policy</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
