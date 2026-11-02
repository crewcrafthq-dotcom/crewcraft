import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'contractor-warranty-terms',
  title: 'Warranty terms: what to promise and what to put in writing',
  metaTitle: 'Contractor Warranty Terms',
  description:
    'Contractor warranty terms that protect both sides: labour vs manufacturer cover, how long to offer, what to exclude, and where to state it all up front.',
  published: '2026-10-10',
  readingMinutes: 6,
  topic: 'Getting paid',
};

export function Body() {
  return (
    <>
      <p>
        “We stand behind our work” is a sentiment, not a warranty. It is also the reason a
        customer calls three years later expecting a free visit for something you never intended
        to cover. Written terms protect both of you, and they close jobs.
      </p>

      <h2>Two warranties, not one</h2>
      <p>Customers routinely blur these, so separate them explicitly:</p>
      <ul>
        <li>
          <strong>Manufacturer warranty</strong> covers the equipment and comes from the
          manufacturer. You do not control its length or its terms, and it usually excludes
          labour.
        </li>
        <li>
          <strong>Your labour warranty</strong> covers your installation. This is the one you
          decide, and it is the one that matters when something fails in year two.
        </li>
      </ul>
      <p>
        The classic unhappy call is a part covered under a ten-year manufacturer warranty that
        takes two hours to fit, with no labour cover. Say in advance who pays for those two hours.
      </p>

      <h2>How long to offer</h2>
      <p>
        One year on labour is the common floor. Two years is a genuine differentiator and costs
        less than people expect, because installation faults almost always show up in the first
        few months.
      </p>
      <p>
        Longer, on specific work, can be a strong selling point — a ten-year workmanship warranty
        on a roof, for instance. Only offer it on work where you control the variables and your
        process is consistent.
      </p>

      <h2>What to exclude, plainly</h2>
      <ul>
        <li>Normal wear and consumables — filters, belts, batteries.</li>
        <li>Damage from lack of maintenance. This is why maintenance plans pair well with longer warranties.</li>
        <li>Work altered or repaired by someone else afterwards.</li>
        <li>Pre-existing conditions you flagged and the customer declined to fix.</li>
        <li>Acts of God, impact damage, abuse.</li>
        <li>Customer-supplied materials — never warrant something you did not buy.</li>
      </ul>
      <p>
        That last one deserves its own sentence on the quote. Fitting a homeowner’s own water
        heater is a reasonable thing to do; warranting it is not.</p>

      <h2>Say it on the estimate, not the invoice</h2>
      <p>
        Warranty terms belong on the document the customer signs <em>before</em> the work, where
        they are part of the value. On the invoice afterwards they look like you are limiting
        something after the fact.
      </p>
      <p>
        Three lines is enough: what is covered, for how long, and what is not. If it needs a page,
        nobody will read it and you have protected nothing.
      </p>

      <h2>Honour it quickly, or do not offer it</h2>
      <p>
        A warranty call handled same-week generates referrals. The same call dodged for a fortnight
        generates a review that costs you jobs for years. The cost of honouring it is almost always
        smaller than the cost of the review, and it is not close.
      </p>

      <h2>Keep the terms on every quote</h2>
      <p>
        Toolbelt estimates carry your standard terms through to the signed document, so the
        warranty is part of what the customer accepted rather than something you have to remember
        to mention. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/contractor-payment-terms">payment terms</a>,{' '}
        <a href="/blog/contractor-insurance-explained">contractor insurance</a>, and{' '}
        <a href="/blog/how-to-respond-to-a-bad-review">responding to a bad review</a>.
      </p>
      <p>
        General information, not legal advice — warranty rules vary by state and some trades carry
        statutory minimums.
      </p>
    </>
  );
}
