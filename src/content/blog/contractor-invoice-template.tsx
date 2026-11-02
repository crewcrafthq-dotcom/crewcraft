import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'contractor-invoice-template',
  title: 'A contractor invoice template that actually gets paid',
  metaTitle: 'Contractor Invoice Template',
  description:
    'A free contractor invoice template, line by line: the fields that matter, the ones that cause disputes, and how to send it so paying is a single tap.',
  published: '2026-09-21',
  readingMinutes: 5,
  topic: 'Templates',
};

export function Body() {
  return (
    <>
      <p>
        Most free <strong>contractor invoice templates</strong> are a table with your logo at the
        top. They are fine. They are also why so many contractors wait a month to get paid — a
        template can only carry information, it cannot carry a payment. Here is the structure that
        works, and what to do about the part a document cannot do.
      </p>

      <h2>The template, top to bottom</h2>
      <h3>Header</h3>
      <p>
        Business name, logo, licence number, phone, email. Invoice number and invoice date on the
        right. If you do nothing else, make the invoice number sequential — gaps and duplicates
        are what get invoices queried.
      </p>
      <h3>Bill to / work performed at</h3>
      <p>
        Two separate blocks. Landlords, property managers and warranty companies all pay for work
        at an address they do not live at, and merging the two fields is a reliable way to be told
        “this isn’t ours.”
      </p>
      <h3>Line items</h3>
      <p>
        Description, quantity, unit, unit price, line total. Write descriptions a homeowner would
        recognise. One or two lines of plain scope above the table does more to prevent disputes
        than any amount of detail inside it.
      </p>
      <h3>The money block</h3>
      <p>
        Subtotal, tax, <strong>less deposit paid</strong>, then <strong>balance due</strong> —
        bigger and bolder than everything else on the page. The balance is the only number most
        people read.
      </p>
      <h3>Due date and payment</h3>
      <p>
        An actual date. Then how to pay, easiest first. If a card or bank link is available, it
        goes above the bank details, not below them.
      </p>
      <h3>Footer</h3>
      <p>Warranty terms, late fee policy if you have one, and a thank you. Keep it to two lines.</p>

      <h2>The fields that prevent arguments</h2>
      <ul>
        <li>
          <strong>Reference to the signed estimate.</strong> “Per estimate #104, accepted 12 Sept.”
        </li>
        <li>
          <strong>Change orders listed separately</strong>, each with its own approval date.
        </li>
        <li>
          <strong>PO number</strong> if it is a commercial customer. Without it, some accounts
          payable departments simply will not process you.
        </li>
        <li>
          <strong>What is excluded.</strong> One line. Saves a surprising number of phone calls.
        </li>
      </ul>

      <h2>Where templates run out</h2>
      <p>
        A Word or PDF template cannot tell you whether it was opened, cannot take a payment,
        cannot deduct the deposit automatically, and cannot chase itself when it goes quiet. You
        end up doing those four jobs by hand, per invoice, forever. That is the real cost of a
        free template, and it is paid in Sunday evenings.
      </p>

      <h2>A template that does the rest</h2>
      <p>
        Toolbelt builds the invoice from the accepted estimate — your branding, sequential INV
        numbering, deposit deducted, due date set, and a pay button connected to your own Stripe.
        Overdue ones get a polite nudge on their own. Three free estimates, no card.
      </p>

      <p>
        Read{' '}
        <a href="/blog/how-to-invoice-as-a-contractor">how to invoice as a contractor</a> for the
        timing, and{' '}
        <a href="/blog/free-estimate-template-for-contractors">
          the estimate template
        </a>{' '}
        for the document that comes before it.
      </p>
    </>
  );
}
