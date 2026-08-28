import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'estimating-software-pricing-guide',
  title: 'Estimating software pricing: what contractors actually pay',
  metaTitle: 'Estimating Software Pricing Guide',
  description:
    'How estimating software is typically priced — per-user, flat monthly, or enterprise quote-only — and what a flat, published price actually gets you.',
  published: '2026-08-26',
  readingMinutes: 5,
  topic: 'Pricing',
};

export function Body() {
  return (
    <>
      <p>
        Estimating software pricing is one of the least transparent corners of contractor
        software. Some products publish a price on the homepage; a lot do not, and
        &ldquo;contact sales&rdquo; is doing a lot of work on those pages. Here is what the
        common pricing shapes actually mean, so you can tell what you are looking at before you
        pick up the phone.
      </p>

      <h2>The pricing models you will run into</h2>
      <ul>
        <li>
          <strong>Per-user, per month.</strong> Common in tools built for larger commercial
          outfits with dedicated estimators. Fine if you have one or two people who ever touch
          estimating; expensive fast if the whole crew needs access, since every additional
          login adds to the bill.
        </li>
        <li>
          <strong>Flat, per business, per month.</strong> Less common, and worth seeking out for
          a small crew &mdash; the price does not change whether it is one person or five using
          it, which matches how most trade businesses actually operate.
        </li>
        <li>
          <strong>Enterprise, quote-only.</strong> Usually signals the product is priced and
          sold for businesses much larger than a typical small trade contractor. Not necessarily
          bad software, but budget for a number well above what a published price would show.
        </li>
        <li>
          <strong>Free with paid upgrades.</strong> Worth testing on a real job before paying
          anything &mdash; what matters is whether the free tier lets you actually finish and
          send a real estimate, or just preview one.
        </li>
      </ul>

      <h2>What to ask, regardless of the model</h2>
      <p>
        Whatever the pricing page shows, get a straight answer to: does the price change if I
        hire someone? Is there a setup or onboarding fee on top of the subscription? What happens
        to my price book and customer data if I cancel? A lot of the real cost of estimating
        software shows up in the answers to those three questions, not in the sticker price.
      </p>

      <h2>What Toolbelt actually costs</h2>
      <p>
        Toolbelt publishes its pricing rather than gating it behind a sales call: free to try on
        three real estimates, no card required, then $29 a month flat for unlimited estimates,
        e-sign, invoicing, and every tool on the belt &mdash; the same price whether it is one
        person using it or your whole office. Paying yearly brings that to $24/month billed as
        $288, and the first 100 contractors can lock a founding rate of $19/month for as long as
        they stay. See the full breakdown on the{' '}
        <a href="/#pricing">pricing section</a> of the homepage.
      </p>
    </>
  );
}
