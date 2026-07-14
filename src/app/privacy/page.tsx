import type { Metadata } from 'next';

import { LegalPage, LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Toolbelt by Crewcraft collects, uses, and protects your data. Plain English, no tricks.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 13, 2026">
      <LegalSection title="The short version">
        <p>
          We collect what we need to run Toolbelt for you — your account email, your business
          details, and the estimates you create. We don’t sell your data, we don’t sell your
          customers’ data, and we don’t spam anyone. If you want your data gone, email us and
          it’s gone.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Account data</strong> — your email address and password
            (stored hashed; we never see it), or a magic-link login.
          </li>
          <li>
            <strong className="text-ink">Business data</strong> — the company name, trade, logo,
            license number, contact details, and default rates you enter so they appear on your
            estimates.
          </li>
          <li>
            <strong className="text-ink">Estimate data</strong> — the job descriptions, line
            items, and customer contact details you add to an estimate. Your customers’ details
            are used only to render and send that estimate on your behalf.
          </li>
          <li>
            <strong className="text-ink">Usage data</strong> — anonymous page analytics (Vercel
            Analytics) and, if you arrived from an ad, standard advertising cookies (Google Ads
            tag) so we know the ad worked.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How the AI works with your data">
        <p>
          When you type a job description, we send that text to Anthropic’s Claude API to draft
          line items. The text is processed to generate your estimate and is not used by us to
          train AI models. Don’t paste anything into a job description you wouldn’t put on the
          estimate itself.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with (our processors)">
        <p>We run on a small set of services, each seeing only what it needs:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong className="text-ink">Supabase</strong> — database, authentication, and file storage (your logo).</li>
          <li><strong className="text-ink">Stripe</strong> — payments. Your card number never touches our servers.</li>
          <li><strong className="text-ink">Resend</strong> — sends estimate emails you trigger and account emails.</li>
          <li><strong className="text-ink">Anthropic</strong> — AI drafting of line items from your job description.</li>
          <li><strong className="text-ink">Vercel</strong> — hosting and anonymous analytics.</li>
          <li><strong className="text-ink">Google</strong> — ad conversion measurement, only when you arrive via an ad.</li>
        </ul>
        <p>We never sell your data or your customers’ data to anyone. No exceptions.</p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use the cookies needed to keep you logged in, plus the Google Ads tag for ad
          measurement. No third-party data brokers, no cross-site tracking networks.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can export or delete your data at any time — email{' '}
          <a href="mailto:hello@crewcraftapp.com" className="font-medium text-ink underline">
            hello@crewcraftapp.com
          </a>{' '}
          from your account address and we’ll handle it within 30 days. Deleting your account
          removes your business profile, estimates, and logo from our systems (payment records
          are kept as long as tax law requires).
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If we change this policy in a way that matters, we’ll email you before it takes effect.
          The date at the top always tells you when it last moved.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
