import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'what-to-do-when-a-customer-wont-pay',
  title: 'What to do when a customer won’t pay',
  metaTitle: 'When a Customer Won’t Pay: Next Steps',
  description:
    'What to do when a customer won’t pay: the order to work through, what to send and when, and the paperwork that decides whether you ever collect at all.',
  published: '2026-10-06',
  readingMinutes: 7,
  topic: 'Getting paid',
  faq: [
    {
      q: 'What should I do when a customer will not pay?',
      a:
        'Work in order: confirm the invoice reached the right person and matches the signed estimate, send a friendly reminder at day three, call at day ten, offer a payment plan, then send a formal written demand at around day thirty before considering legal routes.',
    },
    {
      q: 'Should a contractor file a mechanic\'s lien?',
      a:
        'It is the strongest tool you have, but the deadlines are short and usually run from your last day on site. Check your state\'s rules before you need them, because missing the window removes the right entirely.',
    },
    {
      q: 'What decides whether a contractor gets paid in a dispute?',
      a:
        'Paperwork, not persistence. A signed estimate, signed change orders for anything that grew, dated photos and an invoice that matches usually end it at the reminder stage; without them you are arguing about memory.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        Work it in order: check the invoice actually reached the right person, send a friendly
        reminder at day three, call at day ten, offer a plan, then send a formal demand at day
        thirty. Most unpaid invoices are not fraud — they are forgetfulness, confusion, cash flow
        problems, or a dispute nobody told you about. Working through them in the right order recovers the
        large majority without anything escalating — and the order matters, because every step
        burns a little goodwill you cannot get back.
      </p>

      <h2>Step 1: check it is not you</h2>
      <p>
        Before anything else: did the invoice go to the right person, at the right address, with
        the right PO, matching the signed estimate? A surprising share of “won’t pay” turns out to
        be “never received it” or “it doesn’t match what we approved, so it is sitting in a
        query pile.”
      </p>

      <h2>Step 2: a friendly, specific reminder</h2>
      <p>
        Three days past due. Short, warm, and carrying the invoice again — never just “payment is
        overdue.” Include the amount, the invoice number, and a link to pay. Assume it was
        missed, because usually it was.
      </p>

      <h2>Step 3: pick up the phone</h2>
      <p>
        Around day 10. Email makes ignoring easy; a call makes it a conversation. The question to
        ask is not “when will you pay” but “is there a problem with the invoice?” If there is a
        dispute, you want to know now, and you want to be the person who asked rather than the
        person who assumed.
      </p>

      <h2>Step 4: offer a payment plan before you escalate</h2>
      <p>
        If the honest answer is that they cannot pay right now, half of something beats all of
        nothing six months later. Put the plan in writing, with dates and amounts, and have them
        confirm it. This is also useful evidence later if it comes to that.
      </p>

      <h2>Step 5: formal written demand</h2>
      <p>
        Around day 30. Plain and unemotional: the work, the amount, the date due, the previous
        attempts to contact, the late fee if disclosed, and a deadline. Say what happens if the
        deadline passes. Send it in a way you can prove was delivered.
      </p>

      <h2>Step 6: the legal routes</h2>
      <ul>
        <li>
          <strong>Mechanic’s lien.</strong> The strongest tool a contractor has — but it has hard
          deadlines, usually measured from last day on site, and they are short. Miss the window
          and the right is gone. Check your state’s rules before you need them, not after.
        </li>
        <li>
          <strong>Small claims court.</strong> Cheap, no lawyer needed, with limits commonly
          between $5,000 and $15,000. Bring the signed estimate, the change orders, the invoice,
          photos and your contact log.
        </li>
        <li>
          <strong>Collections.</strong> Typically 25–50% of what is recovered. Reasonable on an
          old debt you have written off mentally, poor value on a fresh one.
        </li>
      </ul>

      <h2>What decides whether you collect</h2>
      <p>
        Not persistence — paperwork. A signed estimate, signed change orders for everything that
        grew, dated photos, and an invoice that matches. With those, most of these steps end at
        step two or three. Without them, you are arguing about memory, and memory does not win.
      </p>

      <h2>Build the evidence as you go</h2>
      <p>
        Toolbelt estimates are accepted with a typed signature, timestamped on the document; the
        invoice is built from that same accepted estimate so the numbers cannot drift; and photo
        reports give you dated, captioned evidence of the condition you found. Three free
        estimates, no card.
      </p>

      <p>
        Prevention is cheaper:{' '}
        <a href="/blog/contractor-payment-terms">payment terms</a>,{' '}
        <a href="/blog/change-order-template-for-contractors">change orders</a>, and{' '}
        <a href="/blog/contractor-deposits-how-much-to-ask">deposits</a>.
      </p>
    </>
  );
}
