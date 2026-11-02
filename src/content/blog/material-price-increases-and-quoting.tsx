import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'material-price-increases-and-quoting',
  title: 'Quoting when material prices will not sit still',
  metaTitle: 'Quoting Through Material Price Rises',
  description:
    'How to quote when material prices keep moving: quote expiry windows, escalation wording, and when to lock a price rather than absorb the increase yourself.',
  published: '2026-10-04',
  readingMinutes: 6,
  topic: 'Pricing',
};

export function Body() {
  return (
    <>
      <p>
        You quote a job in March, the customer signs in June, and the equipment costs 14% more
        than it did when you priced it. Somebody absorbs that, and without a clause in the quote,
        it is you.
      </p>

      <h2>Put an expiry on every quote</h2>
      <p>
        The simplest protection there is, and most contractors omit it. One line: “This quote is
        valid for 30 days.” It is standard, nobody objects to it, and it ends the argument about
        a price you gave someone last spring.
      </p>
      <p>
        Thirty days suits most residential work. Shorten it to fourteen when a specific material
        is moving fast, and say why — customers accept a short window far better when it comes
        with a reason.
      </p>

      <h2>Escalation wording, for longer jobs</h2>
      <p>
        On work that will not start for months, an expiry is not enough. An escalation clause
        handles it:
      </p>
      <blockquote>
        <p>
          Material pricing is based on supplier costs as of [date]. If supplier pricing for
          [material] increases by more than 5% before materials are ordered, the difference will
          be passed through at cost, with documentation provided. Decreases are passed through the
          same way.
        </p>
      </blockquote>
      <p>
        The last sentence does real work. A clause that only moves upward reads as a licence to
        raise the price; one that moves both ways reads as fair, and it costs you almost nothing
        because prices rarely fall.
      </p>

      <h2>When to lock instead</h2>
      <p>
        If you can buy the material now and store it, a locked price is a selling point — and
        sometimes worth more than the margin you protect. Buying early also makes sense when the
        deposit covers it, which is another argument for{' '}
        <a href="/blog/contractor-payment-terms">taking the deposit at signature</a> rather than
        at the start of work.
      </p>

      <h2>Do not quietly eat it</h2>
      <p>
        The common failure is not a bad clause — it is having no clause and absorbing the increase
        to avoid an awkward conversation. On a job with $4,000 of materials, a 12% rise is $480,
        which on many jobs is the entire profit. A documented pass-through conversation is
        uncomfortable for five minutes; absorbing it is a job you worked for nothing.
      </p>

      <h2>Keep the price book honest</h2>
      <p>
        Escalation clauses protect signed work. The thing that protects unsigned work is your
        price book being current. If the supply house quoted you a new number this week, that is
        the moment to change the entry — not at a quarterly review that never happens.
      </p>

      <h2>Show the increase, do not hide it</h2>
      <p>
        When you do pass one through, show the supplier documentation. Customers accept a
        verifiable cost increase and resent an unexplained one, and the difference between those
        two reactions is a single attachment.
      </p>

      <h2>Where Toolbelt helps</h2>
      <p>
        Your price book holds the material and labour rates separately, so a supplier change
        updates one entry and every future draft prices from the new number — and the quote
        carries your terms with it. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/how-to-build-a-contractor-price-book">building a price book</a> and{' '}
        <a href="/blog/change-order-template-for-contractors">change orders</a>.
      </p>
    </>
  );
}
