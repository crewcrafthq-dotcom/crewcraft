import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'markup-vs-margin-for-contractors',
  title: 'Markup vs margin: the math that quietly eats contractor profit',
  metaTitle: 'Markup vs Margin for Contractors',
  description:
    'Markup vs margin for contractors in plain numbers: why a 20% markup is not a 20% profit margin, and the conversion that protects every job you price.',
  published: '2026-08-31',
  readingMinutes: 6,
  topic: 'Pricing',
  faq: [
    {
      q: 'What is the difference between markup and margin?',
      a:
        'Markup is what you add on top of your cost; margin is what is left out of what the customer pays. A $1,000 job sold at $1,200 carries a 20% markup but a 16.7% margin, because $200 is a fifth of the cost and only a sixth of the price.',
    },
    {
      q: 'What markup do I need for a 30% margin?',
      a:
        'A 43% markup. To hit any target margin, divide your cost by (1 minus the margin): $1,000 of cost at a 30% target is 1,000 ÷ 0.70 = $1,429. A 20% margin needs 25% markup, 25% needs 33%, and 40% needs 67%.',
    },
    {
      q: 'Why does discounting hurt so much?',
      a:
        'Because a discount comes out of profit, not out of cost. Taking $200 off a $1,200 quote does not cost you a sixth of the job — it wipes out the entire $200 of profit and you work it for nothing.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        A 20% markup is not a 20% margin: add 20% to $1,000 of cost and the $200 you make is a
        16.7% margin, not a fifth. Two contractors quote the same job and both say they work on
        “twenty percent.” One ends the
        year with money in the account and one doesn’t. The difference is almost never effort —
        it’s that one of them is using <strong>markup</strong> and thinks it’s{' '}
        <strong>margin</strong>.
      </p>

      <h2>The two numbers, defined once</h2>
      <p>
        <strong>Markup</strong> is what you add on top of your cost. <strong>Margin</strong> is
        what’s left out of what the customer pays. Same job, same dollars, two different
        denominators — and that’s the whole trap.
      </p>
      <p>
        Take a job that costs you $1,000 in labor and materials. Add 20% markup and you charge
        $1,200. Your profit is $200. But $200 out of $1,200 is a{' '}
        <strong>16.7% margin</strong>, not 20%. You just worked the job for a sixth less than you
        thought.
      </p>

      <h2>The conversion worth memorising</h2>
      <p>
        To hit a target margin, divide your cost by (1 − margin). For a 30% margin on $1,000 of
        cost: 1,000 ÷ 0.70 = $1,429. That’s a 42.9% markup. Not 30%.
      </p>
      <ul>
        <li>20% margin needs 25% markup</li>
        <li>25% margin needs 33% markup</li>
        <li>30% margin needs 43% markup</li>
        <li>40% margin needs 67% markup</li>
      </ul>
      <p>
        If you have been marking up 30% and calling it a 30% margin, you have been running a 23%
        margin. On $400,000 of annual revenue that gap is roughly $28,000 — about what a decent
        used service van costs.
      </p>

      <h2>Where it bites hardest</h2>
      <p>
        Material-heavy jobs. A panel upgrade or a full re-roof carries a lot of cost, so a small
        error in the multiplier compounds fast. Labor-only service calls hide the problem because
        the dollar amounts are small enough that nobody checks.
      </p>
      <p>
        It also bites when you discount. Knocking $200 off a $1,200 quote doesn’t cost you a
        sixth of your revenue — it costs you your entire $200 of profit. The job is now free
        labour. Discounts come out of margin, never out of cost, and that is why a “small”
        discount so often turns a decent week into a break-even one.
      </p>

      <h2>What to actually do about it</h2>
      <h3>Price from a target margin, not a habit</h3>
      <p>
        Decide the margin the business needs to survive — overhead, slow months, a truck that
        will need replacing — then work backwards to the multiplier. The multiplier is output,
        not input.
      </p>
      <h3>Separate labour and material markups</h3>
      <p>
        Most trades carry different margins on each. Materials you buy and resell often support a
        different number than the hours you can never get back. Blending them into one percentage
        hides which half of the job is actually paying you.
      </p>
      <h3>Check the total, not the lines</h3>
      <p>
        Line-item math is where errors hide. The number worth looking at before you send is the
        bottom one: what percentage of this total is profit, and is that the number you decided
        on?
      </p>

      <h2>Make the math stop being your job</h2>
      <p>
        Toolbelt prices drafts from the rates you set and computes every total in code — the
        multiplier is applied the same way on every estimate, whether you write it at 7am or
        after dinner. Three free estimates, no card, to check the numbers against a job you have
        already priced.
      </p>

      <p>
        Next, make the rates themselves right:{' '}
        <a href="/blog/how-to-build-a-contractor-price-book">how to build a price book</a> and{' '}
        <a href="/blog/how-much-should-a-contractor-charge-per-hour">
          how much to charge per hour
        </a>
        . Or <a href="/">see a job priced in about a minute</a>.
      </p>
    </>
  );
}
