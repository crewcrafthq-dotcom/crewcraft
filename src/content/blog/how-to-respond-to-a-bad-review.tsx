import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-respond-to-a-bad-review',
  title: 'How to respond to a bad review',
  metaTitle: 'How to Respond to a Bad Review',
  description:
    'How to respond to a bad review as a contractor: the reply structure that wins back future customers, what never to say, and when to ask for removal.',
  published: '2026-10-16',
  readingMinutes: 5,
  topic: 'Growth',
};

export function Body() {
  return (
    <>
      <p>
        The one-star review is not written for you. It is written for the next hundred people
        deciding whether to call you, and so is your reply. Once you see it that way, the right
        response becomes much easier to write — and much less satisfying.
      </p>

      <h2>Wait a day</h2>
      <p>
        Nothing good has ever been written twenty minutes after reading a review that is unfair.
        The reply is permanent, public, and read by people who have no idea what happened. A day
        costs you nothing.
      </p>

      <h2>The structure that works</h2>
      <ol>
        <li>
          <strong>Thank them, briefly.</strong> One line. It signals you are not defensive.
        </li>
        <li>
          <strong>Acknowledge the specific thing.</strong> Not “sorry you feel that way” — that
          reads as contempt to every third party. “You’re right that we arrived outside the
          window we gave you.”
        </li>
        <li>
          <strong>State what you did or will do.</strong> The fix, briefly.
        </li>
        <li>
          <strong>Move it offline.</strong> “I’d like to sort this out — please call me on
          [number] and ask for Dave.”
        </li>
      </ol>
      <p>
        Four sentences. Future customers are not looking for an argument you won; they are
        checking whether you behave reasonably when something goes wrong.
      </p>

      <h2>What never to say</h2>
      <ul>
        <li>
          <strong>Customer details.</strong> Not the address, not the amount, not their medical
          reason for cancelling. It is a privacy problem and it looks appalling.
        </li>
        <li>
          <strong>“This customer is lying.”</strong> Even when true. Nobody reading can
          adjudicate, so it reads as two people arguing.
        </li>
        <li>
          <strong>A paragraph of history.</strong> Length reads as guilt.
        </li>
        <li>
          <strong>Sarcasm.</strong> It is always obvious and it always costs you.
        </li>
      </ul>

      <h2>When it is genuinely fake</h2>
      <p>
        Competitors, mistaken identity, people who were never customers — these happen. Report it
        to Google for policy violation, state factually in the reply that you have no record of
        this person as a customer and invite them to contact you, and move on. Removal is
        inconsistent, so do not stake your reputation on winning it.
      </p>

      <h2>The actual fix is volume</h2>
      <p>
        One bad review among eight is devastating. One among eighty is invisible and even slightly
        reassuring — a perfect five-star record reads as suspicious to a lot of people. The
        durable answer to a bad review is a steady flow of ordinary good ones, which means asking
        every time, not just after jobs that went brilliantly.
      </p>

      <h2>Make the asking automatic</h2>
      <p>
        Toolbelt can send the review request when an invoice is marked paid — the moment with the
        highest reply rate — using your own Google link, once per customer. Volume stops being
        something you remember to do. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/how-to-get-more-google-reviews-as-a-contractor">
          getting more Google reviews
        </a>{' '}
        and{' '}
        <a href="/blog/google-business-profile-for-contractors">your Google Business Profile</a>.
      </p>
    </>
  );
}
