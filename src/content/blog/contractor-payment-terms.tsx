import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'contractor-payment-terms',
  title: 'Contractor payment terms that protect your cash flow',
  metaTitle: 'Contractor Payment Terms Explained',
  description:
    'Contractor payment terms explained: deposits, progress payments, net 15 vs net 30, and the wording that keeps cash arriving before the job is finished.',
  published: '2026-09-28',
  readingMinutes: 6,
  topic: 'Getting paid',
  faq: [
    {
      q: 'What payment terms should a contractor use?',
      a:
        'Due on receipt suits residential service work, net 15 is a sensible default for small commercial, and net 30 is often non-negotiable with larger GCs — price for the thirty days of float. Whichever you pick, put an actual date on the invoice rather than the words.',
    },
    {
      q: 'How much deposit should a contractor take?',
      a:
        'Commonly 25 to 50% on equipment-heavy work, and little or nothing on straightforward service calls. Check your state\'s rules first — several cap residential deposits by percentage or dollar amount.',
    },
    {
      q: 'Can a contractor charge late fees?',
      a:
        'Generally yes where it is disclosed in advance, and 1 to 1.5% a month is typical. State it on the estimate the customer signs, not for the first time on an overdue invoice.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        Take a deposit at signature, tie progress payments to milestones the customer can see, and
        put an actual date on the invoice rather than the words “net 30.” Cash flow kills more trade
        businesses than bad work does. You can be profitable on paper
        and still be unable to pay the supply house, purely because of when money arrives.{' '}
        <strong>Payment terms</strong> are the lever that fixes that, and they cost nothing to
        change.
      </p>

      <h2>Deposits</h2>
      <p>
        A deposit does three things: it funds materials, it confirms the customer is real, and it
        makes the job harder to walk away from. Common ranges are 25–50% for equipment-heavy work
        and smaller or none for straightforward service calls.
      </p>
      <p>
        Check your state rules before setting a number — several cap residential deposits by
        percentage or dollar amount, and a few require the funds to be handled in specific ways.
      </p>

      <h2>Progress payments</h2>
      <p>
        On anything running more than a few days, do not finance the job yourself. Tie payments to
        milestones a customer can see: materials delivered, rough-in complete, final inspection
        passed. Milestones that are visible get paid without argument; milestones measured in
        percentages invite debate.
      </p>

      <h2>Net 15 vs net 30 vs due on receipt</h2>
      <ul>
        <li>
          <strong>Due on receipt</strong> — right for residential service work. Most homeowners
          will pay the same day if paying is easy.
        </li>
        <li>
          <strong>Net 15</strong> — a sensible default for small commercial. Long enough to be
          professional, short enough to matter.
        </li>
        <li>
          <strong>Net 30</strong> — often non-negotiable with larger GCs and property managers.
          Price for it. Thirty days of float has a cost and it belongs in the number.
        </li>
      </ul>
      <p>
        Whatever you pick, put a <em>date</em> on the invoice. “Net 30” requires the reader to do
        arithmetic, and people do not pay things they have to calculate.
      </p>

      <h2>Late fees</h2>
      <p>
        State them up front, in the estimate, not for the first time on an overdue invoice.
        1–1.5% per month is typical and generally enforceable where disclosed in advance. Their
        real value is not the revenue — it is that they give you a reason to follow up that is not
        personal.
      </p>

      <h2>Retainage</h2>
      <p>
        On commercial work, expect 5–10% withheld until final completion. It is normal. What is
        not normal is forgetting to invoice for it. Put the release date in your calendar the day
        the job closes, because nobody will remind you.
      </p>

      <h2>Say it before the work, in writing</h2>
      <p>Every term should appear on the estimate the customer signs:</p>
      <blockquote>
        <p>
          50% deposit due on acceptance. Balance due on completion, payable by card or bank
          transfer. Invoices unpaid after 15 days carry a 1.5% monthly service charge.
        </p>
      </blockquote>
      <p>
        Three sentences, agreed before anyone picked up a tool, resolve almost every payment
        argument that would otherwise happen later.
      </p>

      <h2>Terms the customer can act on</h2>
      <p>
        Toolbelt puts the deposit button on the estimate itself — accepted and part-paid in the
        same moment — then carries the deposit through to the invoice automatically and nudges
        overdue ones for you. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/contractor-deposits-how-much-to-ask">how much deposit to ask for</a>,{' '}
        <a href="/blog/how-to-get-paid-faster-as-a-contractor">how to get paid faster</a>, and{' '}
        <a href="/blog/what-to-do-when-a-customer-wont-pay">
          what to do when a customer won’t pay
        </a>
        .
      </p>
    </>
  );
}
