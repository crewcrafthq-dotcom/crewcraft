import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'change-order-template-for-contractors',
  title: 'Change orders: the paperwork that stops scope creep eating your margin',
  metaTitle: 'Change Order Template for Contractors',
  description:
    'A change order template for contractors, plus when to write one: the scope changes that need paperwork, what goes on it, and how to get it signed fast.',
  published: '2026-10-08',
  readingMinutes: 6,
  topic: 'Templates',
};

export function Body() {
  return (
    <>
      <p>
        “While you’re here, could you just…” is the most expensive sentence in the trades. Said
        four times across a job, it is a day of unpaid labour and an invoice the customer disputes
        because it does not match the quote they signed.
      </p>

      <h2>What a change order is for</h2>
      <p>
        It is not bureaucracy. It is a short document that records three things: what changed, what
        it costs, and that they agreed before you did it. That last word is the entire point —
        approval after the work is a negotiation, approval before it is a price.
      </p>

      <h2>The template</h2>
      <ul>
        <li>
          <strong>Change order number</strong> and the original estimate or job number.
        </li>
        <li>
          <strong>Date</strong>.
        </li>
        <li>
          <strong>Customer and job address</strong>.
        </li>
        <li>
          <strong>Description of the change</strong> — plainly. “Add a dedicated 20A circuit to
          the garage freezer outlet.”
        </li>
        <li>
          <strong>Reason</strong> — customer request, hidden condition, code requirement,
          inspector. This single field prevents most later disputes.
        </li>
        <li>
          <strong>Cost breakdown</strong> — labour and materials, same format as the estimate.
        </li>
        <li>
          <strong>Schedule impact</strong> — “adds one day.” Time surprises annoy customers more
          than money ones.
        </li>
        <li>
          <strong>Revised contract total</strong> — original, this change, new total. Show all
          three.
        </li>
        <li>
          <strong>Signature and date</strong>.
        </li>
      </ul>

      <h2>When you need one</h2>
      <p>Write one for any of these, regardless of size:</p>
      <ul>
        <li>Anything the customer asks for that was not quoted.</li>
        <li>Hidden conditions — rot, undersized wiring, a cracked heat exchanger.</li>
        <li>Anything the inspector requires that was not in the original scope.</li>
        <li>Material substitutions that change the price in either direction.</li>
      </ul>
      <p>
        The threshold is not dollars. A $90 change you do for free teaches the customer that
        changes are free, and the next one is $900.
      </p>

      <h2>How to raise one without souring the job</h2>
      <p>
        Timing and tone do the work. Raise it the moment you discover it, on site, before you
        proceed. Lead with the problem and the consequence of ignoring it, then the number:
      </p>
      <blockquote>
        <p>
          The decking under the valley is rotted through — about 40 square feet. If we roof over
          it the warranty is void and it will fail. Replacing it is $380 and about two hours.
          Want me to do it while we’re open?
        </p>
      </blockquote>
      <p>
        That is not upselling. That is the conversation a professional has, and customers
        generally respond well to it — far better than to a line item they discover on an invoice.
      </p>

      <h2>Get it signed on the spot</h2>
      <p>
        A change order you will “write up tonight” gets signed at a much lower rate than one
        signed in the driveway, because by tonight the urgency is gone and the work is already
        done. Sending a small, signable document from your phone, while you are standing in front
        of the rot, is the whole difference.
      </p>

      <h2>How Toolbelt handles it</h2>
      <p>
        Describe the change in a sentence, get a priced, branded document, send it for a typed
        signature before you pick the tools back up — and the invoice at the end is built from
        what was actually accepted, so the totals cannot drift. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/what-to-do-when-a-customer-wont-pay">
          what to do when a customer won’t pay
        </a>{' '}
        and <a href="/blog/how-to-invoice-as-a-contractor">how to invoice as a contractor</a>.
      </p>
    </>
  );
}
