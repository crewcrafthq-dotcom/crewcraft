import type { Metadata } from 'next';

import { LegalPage, LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'How Toolbelt protects contractor accounts, customer data and payments: Stripe handles every card, data is isolated per account, and logins are rate-limited.',
  alternates: { canonical: '/security' },
  robots: { index: true, follow: true },
};

export default function SecurityPage() {
  return (
    <LegalPage title="Security" updated="July 23, 2026">
      <LegalSection title="The short version">
        <p>
          You handle homeowners’ money and personal details, so we treat your account the way a
          bank treats a vault door. Card numbers never touch our servers, every contractor’s data
          is walled off from every other account at the database level, and the links your
          customers click can’t be guessed. Here’s the plain-English version of how.
        </p>
      </LegalSection>

      <LegalSection title="Payments — Stripe holds the money, not us">
        <p>
          All payments run through <strong className="text-ink">Stripe</strong>, the same
          processor behind Amazon and Shopify. When a homeowner pays a deposit, they pay on
          Stripe’s hosted checkout page, into <em>your</em> connected Stripe account — the money
          goes straight to you, and the card number is seen only by Stripe. Toolbelt never
          receives, stores, or even passes through card details. Your Toolbelt subscription
          works the same way.
        </p>
      </LegalSection>

      <LegalSection title="Your data — isolated per account">
        <p>
          Your business profile, estimates, customers, and price book live in a managed Postgres
          database (Supabase) with <strong className="text-ink">row-level security</strong> —
          isolation enforced by the database itself, not just by application code. Your account
          can only ever read its own rows; there is no query another contractor could run that
          returns your data. Data is encrypted in transit (HTTPS everywhere) and at rest.
        </p>
      </LegalSection>

      <LegalSection title="Customer estimate links — unguessable by design">
        <p>
          The link a homeowner receives contains a long random token — the kind of string you’d
          need billions of years to guess by trying. No login is required to view an estimate
          (homeowners shouldn’t need an account to say yes), but there is no way to enumerate or
          stumble onto someone else’s estimate. E-signatures record the typed name and the moment
          of acceptance, and land on the PDF.
        </p>
      </LegalSection>

      <LegalSection title="Logins — hashed, rate-limited, magic-linked">
        <p>
          Passwords are stored hashed (we never see them), magic-link login is available if you
          prefer no password at all, and repeated failed login attempts are rate-limited to shut
          down password-guessing. Sessions use secure, HTTP-only cookies.
        </p>
      </LegalSection>

      <LegalSection title="The AI — drafts with your data, never trains on it">
        <p>
          Job descriptions you type (and photos you attach) are sent to Anthropic’s Claude API to
          draft line items, and that’s all they’re used for — they are not used to train AI
          models. The AI’s arithmetic is never trusted: every total is recomputed by our own
          code. AI drafting also has per-account daily limits, which keeps abuse from ever
          affecting the service you pay for.
        </p>
      </LegalSection>

      <LegalSection title="Job photos — some never leave your phone">
        <p>
          The Photo Report Builder assembles its branded PDF entirely on your device — those
          photos are never uploaded to our servers at all. What you shoot on a roof stays yours.
        </p>
      </LegalSection>

      <LegalSection title="The plumbing behind the plumbing">
        <ul className="list-disc space-y-2 pl-5">
          <li>Hosted on Vercel with HTTPS enforced on every request.</li>
          <li>
            Hardened browser headers (frame-embedding blocked, content sniffing disabled) on
            every page.
          </li>
          <li>
            Links you save in Settings (payment link, review link) are validated and escaped
            before they ever appear in an email to your customer.
          </li>
          <li>Live payment webhooks are signature-verified — a forged “paid” event is rejected.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Found something?">
        <p>
          If you believe you’ve found a security issue, email{' '}
          <a href="mailto:support@crewcraftapp.com" className="font-medium text-ink underline">
            support@crewcraftapp.com
          </a>{' '}
          with “SECURITY” in the subject line. You’ll get a same-day human reply, and if it’s
          real, it gets fixed before anything else gets built.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
