import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'contractor-deposits-how-much-to-ask',
  title: 'Deposits: how much to ask for, and how to actually collect one',
  description:
    'Typical deposit ranges by job type, the state rules to check first, and why the collection method decides whether you ever see the money.',
  published: '2026-08-20',
  readingMinutes: 5,
  topic: 'Getting paid',
};

export function Body() {
  return (
    <>
      <p>
        A deposit does three jobs: it covers materials you&rsquo;re about to buy, it filters out
        customers who were never going to commit, and it turns &ldquo;probably&rdquo; into a date on
        the calendar. Most contractors under-use them — either asking too little, or asking
        correctly and then making the payment itself so awkward it never lands.
      </p>

      <h2>Typical ranges (and the logic behind them)</h2>
      <table>
        <thead>
          <tr><th>Job type</th><th>Common deposit</th><th>Why</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Service / small repair</td>
            <td>None, or trip fee</td>
            <td>Payment on completion is the norm; a deposit adds friction the ticket doesn&rsquo;t justify</td>
          </tr>
          <tr>
            <td>Equipment replacement (water heater, AC changeout)</td>
            <td>30–50%</td>
            <td>Covers the unit so you&rsquo;re never financing the customer&rsquo;s equipment</td>
          </tr>
          <tr>
            <td>Multi-day projects (re-roof, repipe, panel + rewire)</td>
            <td>10–33% up front, then progress payments</td>
            <td>Milestones keep cash aligned with work: e.g. a third to schedule, a third at material delivery, balance at completion</td>
          </tr>
        </tbody>
      </table>
      <p>
        The pattern underneath: <strong>the deposit should roughly cover what you&rsquo;d lose if
        the customer vanished the night before the job</strong> — materials ordered, slots turned
        away. More than that starts to feel like risk to the homeowner; less means you&rsquo;re the
        one carrying it.
      </p>

      <h2>Check your state before you pick a number</h2>
      <p>
        Deposit caps are real law in some places. The famous one: California limits home
        improvement contract down payments to <strong>$1,000 or 10% of the contract price,
        whichever is less</strong>. Several other states regulate deposit size or require specific
        contract language for home improvement work, and licensing boards enforce it. Two minutes
        on your state licensing board&rsquo;s site is cheap insurance — and &ldquo;our deposit
        follows state law&rdquo; is a trust line your competitors can&rsquo;t fake.
      </p>

      <h2>Put the terms on the estimate, not in a conversation</h2>
      <p>
        The deposit conversation goes best when it isn&rsquo;t a conversation. Print it on the
        estimate: <em>&ldquo;50% deposit schedules the job; balance due on completion.&rdquo;</em>
        Attached to a signature line, it stops being a negotiation and becomes a checkout. Nobody
        haggles with a form.
      </p>

      <h2>Collection method decides whether you get paid</h2>
      <p>
        Here&rsquo;s the quiet killer: a homeowner says yes on Tuesday, and the deposit arrives
        &ldquo;whenever we&rsquo;re both home for the check.&rdquo; Days pass; enthusiasm cools;
        sometimes the job quietly dies in the gap. The fix is making payment part of the acceptance
        itself:
      </p>
      <ul>
        <li><strong>Best:</strong> a pay button on the estimate — customer signs and pays the deposit by card in the same two minutes. The yes and the money arrive together.</li>
        <li><strong>Fine:</strong> a payment link texted immediately after they accept.</li>
        <li><strong>Weakest:</strong> &ldquo;bring a check to the job.&rdquo; You&rsquo;ve turned your schedule into an unsecured loan.</li>
      </ul>
      <p>
        Card fees sting until you price them against the alternative: one no-show with materials on
        your truck costs more than a year of processing fees. (This is exactly how{' '}
        <a href="/">Toolbelt</a> wires it — e-sign and deposit on the same estimate link, money
        straight into your own Stripe account, invoice marked paid automatically.)
      </p>

      <h2>The short version</h2>
      <ol>
        <li>Size the deposit to your real exposure — commonly 30–50% on equipment jobs, staged draws on big ones.</li>
        <li>Check your state&rsquo;s cap before you standardize.</li>
        <li>Print the terms on every estimate.</li>
        <li>Collect at the moment of yes, by card, not later by check.</li>
      </ol>
      <p>
        A signed estimate with a paid deposit isn&rsquo;t a lead anymore. It&rsquo;s a job. Build
        your paperwork so that&rsquo;s the default outcome.
      </p>
    </>
  );
}
