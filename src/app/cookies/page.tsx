import type { Metadata } from 'next';

import { ConsentChoiceButton } from '@/components/ConsentChoiceButton';
import { LegalPage, LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'The cookies Toolbelt by Crewcraft uses: login sessions, and ad/analytics measurement you can switch off. No data brokers, no cross-site tracking.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="October 3, 2026">
      <LegalSection title="The short version">
        <p>
          Two cookies are needed for the product to work at all: one keeps you logged in, one
          remembers whether you picked light or dark. Everything else is measurement — knowing
          which ads bring contractors here — and you can switch it off without breaking anything.
          No data brokers, no cross-site tracking networks, nothing sold to anyone.
        </p>
      </LegalSection>

      <LegalSection title="Change your mind">
        <p>
          If you’re in the EU, the UK or Switzerland, nothing in the measurement group runs until
          you say yes. Everywhere else it runs unless you turn it off — here:
        </p>
        <ConsentChoiceButton />
      </LegalSection>

      <LegalSection title="Strictly necessary — always on">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Login session</strong> — a secure, HTTP-only cookie from
            our auth provider (Supabase) that keeps you signed in. The app can’t work without it.
          </li>
          <li>
            <strong className="text-ink">Theme preference</strong> — kept in your browser’s local
            storage, never sent to a server, so the app remembers light or dark mode.
          </li>
          <li>
            <strong className="text-ink">Your cookie choice</strong> — also local storage. We have
            to remember a “no” in order to honour it.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Measurement — only with your permission">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Google Analytics (GA4)</strong> — which pages people read
            and which ones lead to a signup. Set by Google.
          </li>
          <li>
            <strong className="text-ink">Google Ads conversion tag</strong> — counts that an ad led
            to a signup. It measures the ad, not you.
          </li>
          <li>
            <strong className="text-ink">Meta Pixel</strong> — the same job for Facebook and
            Instagram ads. Set by Meta.
          </li>
        </ul>
        <p>
          Turn these down and the Google tags switch to a mode that counts a visit without storing
          anything on your device; the Meta Pixel isn’t loaded at all.
        </p>
      </LegalSection>

      <LegalSection title="Cookieless by design">
        <p>
          Our day-to-day page analytics — <strong className="text-ink">Umami</strong> and{' '}
          <strong className="text-ink">Vercel Analytics</strong> — set and read nothing on your
          device and build no profile of you, which is why they aren’t in the permission group
          above and why we chose them.
        </p>
      </LegalSection>

      <LegalSection title="What customers never get">
        <p>
          When a contractor sends you an estimate to sign, or you fill in their storm-damage lead
          form, that page carries <strong className="text-ink">no advertising or analytics tags
          whatsoever</strong> — no Google tag, no pixel, no banner to dismiss. You came to sign a
          document, not to be measured.
        </p>
      </LegalSection>

      <LegalSection title="Managing cookies in your browser">
        <p>
          You can clear or block cookies in your browser settings at any time. Blocking the session
          cookie will log you out; blocking the measurement tags changes nothing about how the
          product works. The full picture of what data we hold and why is in the{' '}
          <a href="/privacy" className="font-medium text-ink underline">privacy policy</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
