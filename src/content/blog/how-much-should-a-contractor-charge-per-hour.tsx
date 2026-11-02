import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-much-should-a-contractor-charge-per-hour',
  title: 'How much should a contractor charge per hour?',
  metaTitle: 'Contractor Hourly Rate: How to Set It',
  description:
    'How much should a contractor charge per hour? Build it from your overhead, real billable hours and the profit you need — not from what the next guy charges.',
  published: '2026-09-02',
  readingMinutes: 7,
  topic: 'Pricing',
};

export function Body() {
  return (
    <>
      <p>
        The worst way to answer this is the most common one: find out what the shop across town
        charges and sit a few dollars under it. You have just inherited their overhead, their
        truck payments and their mistakes.{' '}
        <strong>How much a contractor should charge per hour</strong> is arithmetic about your
        business, and it takes about twenty minutes to do properly.
      </p>

      <h2>Step 1: count the hours you can actually bill</h2>
      <p>
        A year has about 2,080 working hours. You will not bill 2,080. Take out holidays,
        sickness, quoting, driving, invoice chasing, supply house runs and the afternoon a job
        gets cancelled. Most one-truck operations land somewhere between{' '}
        <strong>1,100 and 1,400 billable hours</strong> a year.
      </p>
      <p>
        This single number is where most rates go wrong. Divide your costs by 2,080 and your rate
        is roughly 40% too low before you have made a penny of profit.
      </p>

      <h2>Step 2: add up what the business costs to exist</h2>
      <p>These are the costs that happen whether or not you work today:</p>
      <ul>
        <li>Vehicle — payment, fuel, insurance, maintenance, tyres</li>
        <li>Insurance — liability, workers’ comp, tools</li>
        <li>Licensing, bonding, continuing education</li>
        <li>Phone, software, accounting, bank fees</li>
        <li>Tool replacement — not a one-off, a yearly line</li>
        <li>Advertising, website, Google Business Profile management</li>
        <li>Any unbilled office or admin help</li>
      </ul>
      <p>
        Call that total your overhead. For a lot of small shops it lands between $30,000 and
        $60,000 a year, and almost everyone underestimates it the first time.
      </p>

      <h2>Step 3: pay yourself before profit</h2>
      <p>
        Your wage is a cost, not what’s left over. Decide the number you would have to pay someone
        to do your job, including payroll taxes. If you only take what remains at the end, you are
        the business’s lender, not its owner.
      </p>

      <h2>Step 4: put it together</h2>
      <p>
        (Your wage + overhead) ÷ billable hours = your <em>break-even</em> rate. Then add the
        margin the business needs on top.
      </p>
      <p>
        Worked example: $70,000 wage + $45,000 overhead = $115,000. Over 1,250 billable hours,
        that is $92/hour just to break even. For a 30% margin, divide by 0.70 — about{' '}
        <strong>$131/hour</strong>. If you had used 2,080 hours and skipped the margin, you would
        have quoted $55 and felt competitive right up until the year ended.
      </p>

      <h2>Sanity checks before you raise your rate</h2>
      <ul>
        <li>
          Does the number survive a slow February? If it only works at full utilisation, it is too
          low.
        </li>
        <li>
          Are you charging for the drive on service calls, or quietly absorbing it? A trip charge
          is not rude, it is accurate.
        </li>
        <li>
          Does the rate cover callbacks and warranty work? Those hours are real and nobody pays
          for them.
        </li>
      </ul>

      <h2>Flat rate vs hourly</h2>
      <p>
        Plenty of trades quote flat prices per job rather than per hour, and homeowners generally
        prefer it — a number beats a meter. But the flat price still has to come from an hourly
        figure underneath, or you are guessing. Work out the rate first, then wrap it.
      </p>

      <h2>Put the rate somewhere it gets used</h2>
      <p>
        A rate you worked out once and keep in your head gets eroded every time you quote tired.
        Toolbelt prices every draft from the labour rate and materials you set, so the number you
        decided on in daylight is the one that goes out at 9pm.
      </p>

      <p>
        Then read{' '}
        <a href="/blog/markup-vs-margin-for-contractors">markup vs margin</a> — getting the rate
        right and the multiplier wrong puts you back where you started — and{' '}
        <a href="/blog/how-to-build-a-contractor-price-book">how to build a price book</a>.
      </p>
    </>
  );
}
