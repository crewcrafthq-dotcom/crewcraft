import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-get-paid-faster-as-a-contractor',
  title: 'How to get paid faster as a contractor',
  metaTitle: 'How to Get Paid Faster: Contractors',
  description:
    'How to get paid faster as a contractor: five changes that move money weeks earlier, from a deposit at signature to a pay button on every single invoice.',
  published: '2026-10-02',
  readingMinutes: 6,
  topic: 'Getting paid',
  faq: [
    {
      q: 'How can a contractor get paid faster?',
      a:
        'Take the deposit at signature rather than at the start of work, invoice the day you finish, put a payment link on the invoice, send it to whoever actually pays, and automate the overdue reminder. Together these commonly move average days-to-payment from about 30 to under 10.',
    },
    {
      q: 'Is it worth paying card fees to get paid faster?',
      a:
        'Usually yes. Card fees are almost always cheaper than two extra weeks of float plus the time spent chasing, because a bank transfer asks the customer to open an app, find the account and type a reference, while a link asks for a thumb.',
    },
    {
      q: 'Should I offer a discount for early payment?',
      a:
        'Not as a first move. You would be paying several percent to fix a process problem that costs nothing to fix directly — change the timing and the payment method first, and keep discounts for genuinely slow commercial payers.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        Take the deposit at signature, invoice the day you finish, and put a pay button on it —
        those three alone commonly move average days-to-payment from about thirty to under ten.
        Getting paid faster is rarely about chasing harder; it is about removing the gaps you built
        into your own process without noticing — and most shops have four or five of them,
        each worth a few days.
      </p>

      <h2>1. Take the deposit at signature, not at the start of work</h2>
      <p>
        If the deposit is collected when you show up with materials, you have already fronted the
        materials. Collected at acceptance, it arrives before you spend anything. Same amount,
        same customer, a week or two earlier, and a meaningfully lower chance the job evaporates.
      </p>

      <h2>2. Invoice the day you finish</h2>
      <p>
        Not Friday. Not when you do the books. The day. An invoice that arrives while the
        customer can still see the work gets paid faster than the identical invoice sent a week
        later — this is the single biggest lever on the list and it is free.
      </p>

      <h2>3. Put a payment button on it</h2>
      <p>
        Bank details require the customer to open their banking app, find the account, type a
        reference and get it right. A link requires a thumb. The difference across a year of
        invoices is enormous, and card fees are almost always cheaper than two extra weeks of
        float plus the chasing.
      </p>

      <h2>4. Invoice the person who pays, not the person who was there</h2>
      <p>
        On rentals, commercial work and anything involving a property manager, the person who
        watched you work frequently cannot authorise a payment. Ask at quoting time who the
        invoice should go to, and get the email then.
      </p>

      <h2>5. Let the reminder send itself</h2>
      <p>
        Overdue invoices need a nudge at around day 3 past due, and again a week later. Almost
        nobody does this reliably, because it requires remembering on a day when you are on a
        roof. Automating it recovers money you were already owed — you are not asking for
        anything new, just asking at all.
      </p>

      <h2>The compounding effect</h2>
      <p>
        None of these is dramatic alone. Together they routinely pull average days-to-payment from
        around 30 to under 10. On $300,000 of annual revenue, that is roughly $17,000 that sits in
        your account instead of someone else’s — which is the difference between buying materials
        with cash and buying them on a card.
      </p>

      <h2>What not to do</h2>
      <p>
        Do not discount for early payment as a first move. You are paying several percent to fix
        a process problem that costs nothing to fix directly. Discounts are for genuinely slow
        commercial payers, after the easy changes are made.
      </p>

      <h2>Close the gaps at once</h2>
      <p>
        Toolbelt collects the deposit on the estimate, turns the accepted estimate into an invoice
        in one tap (or automatically), puts a pay button on it wired to your own Stripe, marks it
        paid when the money lands, and nudges the ones that go quiet. Three free estimates, no
        card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/contractor-payment-terms">contractor payment terms</a> and{' '}
        <a href="/blog/how-to-invoice-as-a-contractor">how to invoice as a contractor</a>.
      </p>
    </>
  );
}
