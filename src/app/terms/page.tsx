import type { Metadata } from 'next';

import { LegalPage, LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms for using Toolbelt by Crewcraft. Plain English: what you get, what you own, what we promise.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 13, 2026">
      <LegalSection title="The short version">
        <p>
          Toolbelt helps you write and send estimates. Your estimates are yours, the final numbers
          are your call, and you can cancel anytime. Use it honestly and we’ll get along fine.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          Toolbelt by Crewcraft (“Toolbelt”, “we”) is estimate software for contractors: you
          describe a job, the AI drafts labor and material line items, and you edit and send a
          branded estimate. New apps are added to the belt over time; paid subscriptions include
          the apps that ship while your subscription is active.
        </p>
      </LegalSection>

      <LegalSection title="AI drafts are suggestions — you own the number">
        <p>
          The AI proposes line items and prices as a starting point. It can be wrong, and prices
          vary by market. <strong className="text-ink">You are responsible for reviewing every
          line, the final price, and compliance with your local licensing, permitting, and
          consumer-protection rules before sending an estimate.</strong> The math (quantities ×
          unit prices, tax, totals) is always computed by the software, never guessed by the AI.
        </p>
      </LegalSection>

      <LegalSection title="Your account and your content">
        <ul className="list-disc space-y-2 pl-5">
          <li>You need to be 18+ and running a real business (or working for one).</li>
          <li>
            Your estimates, logo, and business details are yours. You give us permission to store
            and process them purely to run the service for you.
          </li>
          <li>Keep your login to yourself; you’re responsible for activity on your account.</li>
          <li>
            Don’t use Toolbelt to send spam, scams, or estimates for work you don’t intend to
            perform. We can suspend accounts that abuse the service or the people it emails.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Plans, billing, and cancellation">
        <ul className="list-disc space-y-2 pl-5">
          <li>The free tier is 3 estimates, no card, no time limit.</li>
          <li>
            Paid plans bill through Stripe — monthly or yearly, at the price shown when you
            subscribed. Founding-rate subscribers keep their rate for as long as their
            subscription stays active.
          </li>
          <li>
            Cancel anytime from the billing page; you keep access until the end of the period
            you’ve paid for. We don’t do lock-in contracts.
          </li>
          <li>
            If something went wrong with a charge, email us within 30 days and we’ll sort it out.
            Otherwise, fees already paid are non-refundable except where the law says different.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="What we promise (and don't)">
        <p>
          We work to keep Toolbelt fast, available, and accurate — but it’s provided “as is”,
          without warranties. We’re not liable for lost profits or indirect damages, and our total
          liability is capped at what you’ve paid us in the last 12 months. Nothing here limits
          liability that can’t legally be limited.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If we change these terms in a way that matters, we’ll email you before it takes effect.
          Keeping your account after that means you accept the new terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
