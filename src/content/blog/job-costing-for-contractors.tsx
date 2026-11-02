import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'job-costing-for-contractors',
  title: 'Job costing: finding out which jobs actually make money',
  metaTitle: 'Job Costing for Contractors',
  description:
    'Job costing for contractors, simply: what to track per job, how to compare quoted against actual, and what to do when the numbers say you are losing money.',
  published: '2026-09-22',
  readingMinutes: 6,
  topic: 'Pricing',
};

export function Body() {
  return (
    <>
      <p>
        Plenty of contractors know their revenue and almost none know which jobs produced the
        profit. That matters, because the instinct about which work is good is wrong more often
        than it is right — the job that felt smooth is frequently the one that paid worst.
      </p>

      <h2>The whole idea in one line</h2>
      <p>
        Job costing is comparing what you quoted against what the job actually cost, per job,
        afterwards. That is it. Everything else is bookkeeping decoration.
      </p>

      <h2>What to track</h2>
      <ul>
        <li>
          <strong>Labour hours, actual.</strong> Not estimated, not remembered. The single most
          distorted number in the trades.
        </li>
        <li>
          <strong>Material cost, actual</strong> — including the second supply house run nobody
          counts.
        </li>
        <li>
          <strong>Subcontractor cost</strong>, if any.
        </li>
        <li>
          <strong>Other direct costs</strong> — permits, dumpster, equipment hire, parking.
        </li>
        <li>
          <strong>Revenue</strong>, including approved change orders.
        </li>
      </ul>
      <p>
        That gives gross profit per job. Overhead sits above all of it and is handled by your
        rate, not by apportioning the insurance bill across jobs — a rabbit hole that stops people
        doing this at all.
      </p>

      <h2>Start with ten jobs</h2>
      <p>
        Not a system, not software. Ten recent jobs, a spreadsheet, five columns. The pattern
        shows up fast and it is usually uncomfortable.
      </p>

      <h2>What the numbers usually say</h2>
      <ul>
        <li>
          <strong>Small jobs underperform badly.</strong> The fixed cost of showing up does not
          shrink with the job.
        </li>
        <li>
          <strong>One job type is carrying the business.</strong> Often not the one you talk about
          most.
        </li>
        <li>
          <strong>Hours overrun predictably.</strong> If every job runs 20% long, your estimating
          is 20% optimistic and the fix is arithmetic, not effort.
        </li>
        <li>
          <strong>Unbilled change orders are the biggest single leak.</strong> The work happened
          and the money did not.
        </li>
      </ul>

      <h2>What to do with the answer</h2>
      <p>
        Three options per job type, and only three: raise the price, reduce the cost, or stop
        doing it. “Try harder next time” is not one of them — if a job type loses money
        consistently, it is the pricing that is wrong, not the crew.
      </p>
      <p>
        Dropping an unprofitable job type feels like shrinking. It usually is not: the hours go
        back into work that pays, and revenue holds while profit rises.
      </p>

      <h2>Close the loop on estimating</h2>
      <p>
        The point of job costing is not reporting. It is feeding real numbers back into the next
        quote — your price book should change when the costing says it should. That is the whole
        loop, and it is where the compounding happens.
      </p>

      <h2>Where the data comes from</h2>
      <p>
        Toolbelt keeps quoted totals, approved change orders and what was actually invoiced
        against each job, so the quoted-vs-billed half of the comparison is already there rather
        than reconstructed from memory. Analytics shows win rate and average ticket on top. Three
        free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/markup-vs-margin-for-contractors">markup vs margin</a>,{' '}
        <a href="/blog/change-order-template-for-contractors">change orders</a> — the biggest
        leak on the list — and{' '}
        <a href="/blog/how-to-build-a-contractor-price-book">keeping the price book current</a>.
      </p>
    </>
  );
}
