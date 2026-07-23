import type { Metadata } from 'next';

import { LegalPage, LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'About Toolbelt',
  description:
    'Toolbelt by Crewcraft is contractor software built and run by one founder — estimates, invoices, payments and follow-ups for HVAC, plumbing, electrical and roofing pros.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <LegalPage title="About Toolbelt" updated="July 23, 2026">
      <LegalSection title="The short version">
        <p>
          Toolbelt is contractor software — AI estimates, e-sign, invoices, online payments,
          follow-ups, and a belt of trade tools — built and run by one founder, not a software
          conglomerate. It exists because the paperwork side of the trades still eats evenings,
          and the software that promises to fix it usually costs $300 a month and takes a
          training course to use.
        </p>
      </LegalSection>

      <LegalSection title="Why it exists">
        <p>
          The best contractors we know lose jobs for one reason that has nothing to do with
          their work: the other guy got a professional-looking number into the homeowner’s inbox
          first. Toolbelt closes that gap. You describe the job the way you’d tell your helper,
          and a branded, itemized, e-signable estimate is in their inbox before you’ve left the
          driveway — with a deposit button wired to your own Stripe account.
        </p>
        <p>
          Everything else on the belt — automatic follow-ups, invoices that create themselves,
          review requests after the invoice is paid, tune-up reminders, permit tracking — obeys
          the same rule: if a computer can do the office work, the contractor shouldn’t have to.
        </p>
      </LegalSection>

      <LegalSection title="Small on purpose">
        <p>
          There’s no sales team, no venture capital, and no “book a demo with our account
          executive.” Your subscription is the entire business model, which means the product
          answers to exactly one group of people: the contractors paying for it. That’s also why
          the pricing is one flat rate with everything included — no per-seat games, no add-on
          menus, no contracts.
        </p>
        <p>
          Small has a real advantage: speed. Features on this site marked “live” shipped weeks
          after contractors asked for them. Founding members vote on what gets built next, and
          the <a href="/changelog" className="font-medium text-ink underline">changelog</a> is
          public — you can see exactly how often the belt gets a new tool.
        </p>
      </LegalSection>

      <LegalSection title="A person answers">
        <p>
          Email{' '}
          <a href="mailto:support@crewcraftapp.com" className="font-medium text-ink underline">
            support@crewcraftapp.com
          </a>{' '}
          and you get a reply from the person who built the software — within 24 hours, usually
          much faster. Bug reports, feature requests, “how do I,” or “please delete my data”: same
          address, same person, no ticket numbers.
        </p>
      </LegalSection>

      <LegalSection title="The boring details">
        <p>
          Toolbelt is made by Crewcraft, the same shop behind the AI estimate prompts at
          crewcraft.ai. It runs on Stripe for payments, Supabase for data, and Anthropic’s Claude
          for the AI drafting — the full list, and what each one sees, is in the{' '}
          <a href="/privacy" className="font-medium text-ink underline">privacy policy</a>. How we
          protect your account and your customers’ information is on the{' '}
          <a href="/security" className="font-medium text-ink underline">security page</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
