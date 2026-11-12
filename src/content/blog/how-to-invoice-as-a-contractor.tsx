import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-invoice-as-a-contractor',
  title: 'How to invoice as a contractor so you get paid the first time',
  metaTitle: 'How to Invoice as a Contractor',
  description:
    'How to invoice as a contractor: what every invoice needs, when to send it, and the small details that decide whether you get paid this week or next month.',
  published: '2026-09-16',
  readingMinutes: 6,
  topic: 'Getting paid',
  faq: [
    {
      q: 'What has to be on a contractor invoice?',
      a:
        'A unique sequential invoice number, your business name and licence number, the customer and the job address as separate fields, a plain description of the work, dates, any deposit shown as a deduction, the balance due, a due date as an actual date, and how to pay.',
    },
    {
      q: 'When should a contractor send an invoice?',
      a:
        'The day the job finishes. An invoice that arrives while the customer can still see the work is paid faster than the identical invoice sent a week later; batching them weekly adds about three and a half days to every payment.',
    },
    {
      q: 'Why do invoices get paid late?',
      a:
        'Usually the invoice itself: a missing PO number, no due date, a total that does not match the signed estimate, or going to whoever was on site rather than whoever pays the bills.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        Send it the day the job finishes, put the balance and a real due date where they cannot be
        missed, and make paying it a single tap. An invoice is not paperwork — it is the last step
        of the sale, and a surprising share of late payments are caused by the invoice itself — missing a PO number, arriving three weeks
        after the work, or asking someone to go and find their chequebook.
      </p>

      <h2>What every contractor invoice needs</h2>
      <ul>
        <li>
          <strong>A unique invoice number.</strong> Sequential. This is the first thing a
          bookkeeper asks for.
        </li>
        <li>
          <strong>Your business name, licence number and contact details.</strong> Licence number
          is not optional in most trades, and it quietly signals you are legitimate.
        </li>
        <li>
          <strong>The customer’s name and the job address</strong> — which are often not the same
          address, especially for rentals and property managers.
        </li>
        <li>
          <strong>The work, in their language.</strong> “Replaced 40-gallon gas water heater,
          hauled away old unit” beats “labour and materials per quote.”
        </li>
        <li>
          <strong>Dates.</strong> Work completed and invoice issued.
        </li>
        <li>
          <strong>Deposits already paid</strong>, shown as a deduction, with the balance in bold.
        </li>
        <li>
          <strong>Due date as a date</strong>, not “net 30.” People pay dates, not terms.
        </li>
        <li>
          <strong>How to pay</strong>, with the easiest option first.
        </li>
      </ul>

      <h2>Send it the day the job finishes</h2>
      <p>
        This is the whole game. An invoice sent while the customer can still see the new unit gets
        paid faster than an identical invoice sent eleven days later, when the pleasure has worn
        off and a credit card bill has arrived. Same document, different outcome.
      </p>
      <p>
        If you invoice weekly in a batch on Sunday night, you are adding an average of three and a
        half days to every single payment, for free.
      </p>

      <h2>Make paying it a tap</h2>
      <p>
        Every extra step between reading the invoice and paying it loses you days. A link they can
        pay on their phone, on the sofa, the evening they get it, is the difference between
        getting paid in two days and getting paid in two weeks — and it removes the follow-up
        conversation entirely.
      </p>

      <h2>Common mistakes</h2>
      <ul>
        <li>No due date, just “payment on receipt.” Receipt of what, by when?</li>
        <li>
          Not matching the invoice to the estimate. If the numbers differ and nothing explains
          why, you have invited a phone call instead of a payment.
        </li>
        <li>Burying the balance owed under a wall of line items.</li>
        <li>Sending it to whoever was on site, rather than whoever pays the bills.</li>
      </ul>

      <h2>When the work changed</h2>
      <p>
        If the job grew, the invoice is not the place the customer should first learn about it.
        That is a change order, signed before the extra work happened. An invoice that silently
        exceeds the estimate is the single most common cause of a dispute.
      </p>

      <h2>Make the invoice come from the estimate</h2>
      <p>
        In Toolbelt an accepted estimate becomes an invoice in one tap — same line items, same
        branding, deposit already deducted, with a pay button wired to your own Stripe. Optionally
        it creates and sends itself the moment the customer accepts. Three free estimates, no
        card.
      </p>

      <p>
        Next:{' '}
        <a href="/blog/contractor-invoice-template">a contractor invoice template</a>,{' '}
        <a href="/blog/contractor-payment-terms">payment terms that protect cash flow</a>, and{' '}
        <a href="/blog/how-to-get-paid-faster-as-a-contractor">how to get paid faster</a>.
      </p>
    </>
  );
}
