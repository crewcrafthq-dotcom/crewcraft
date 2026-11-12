import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-price-a-service-call',
  title: 'How to price a service call so it pays for itself',
  metaTitle: 'How to Price a Service Call',
  description:
    'How to price a service call: what the trip charge covers, diagnostic fees, whether to waive it on repair, and the number that makes short jobs profitable.',
  published: '2026-09-06',
  readingMinutes: 6,
  topic: 'Pricing',
  faq: [
    {
      q: 'How much should a service call cost?',
      a:
        'Most shops charge between $89 and $149 for a service call. Work your own floor from the whole block of time it consumes — drive out, diagnose, fix, write up, drive on — which is often ninety minutes for a job that takes thirty.',
    },
    {
      q: 'What is the difference between a trip charge and a diagnostic fee?',
      a:
        'A trip charge pays for getting there and is owed whether or not anything is fixed. A diagnostic fee pays for finding the fault, which on an intermittent problem is most of the value you provide.',
    },
    {
      q: 'Should I waive the service call fee if they approve the repair?',
      a:
        'You can, as long as the fee is built into the repair price rather than simply deleted. Never waive the diagnostic on a no-repair visit — that is exactly the call where your expertise was the whole product.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        Most shops charge <strong>$89 to $149</strong>, and the right number for you comes from the
        whole block of time the call consumes rather than the minutes spent holding a wrench. A
        service call is the easiest job to lose money on: forty minutes of work, ninety minutes of
        driving, a part off the van, and a number you picked years ago because it sounded
        reasonable on the phone.
      </p>

      <h2>What the call actually costs you</h2>
      <p>
        Count the whole block, not the wrench time: drive out, diagnose, fix, write it up, drive
        to the next one. A “thirty-minute” repair routinely consumes ninety minutes of your day.
        If your rate only covers the thirty, you are donating the other hour.
      </p>
      <p>
        Multiply the real block by your hourly rate, add the van cost for the distance, add the
        parts, and you have the floor. Anything under that is a job you would be better off not
        taking.
      </p>

      <h2>Trip charge vs diagnostic fee</h2>
      <p>They are not the same thing, and conflating them confuses customers:</p>
      <ul>
        <li>
          <strong>Trip charge</strong> pays for getting there. It is distance and time, and it is
          owed whether or not anything gets fixed.
        </li>
        <li>
          <strong>Diagnostic fee</strong> pays for finding the fault. That is skill, and on
          intermittent problems it is most of the value you provide.
        </li>
      </ul>
      <p>
        Many shops bundle them into one “service call fee” of $89–$149. That is fine, as long as
        you can explain in one sentence what it buys.
      </p>

      <h2>Should you waive it if they go ahead?</h2>
      <p>
        Waiving the fee when the customer approves the repair is a strong closer and most trades
        use some version of it. Two rules make it work rather than cost you:
      </p>
      <ul>
        <li>
          <strong>Build it into the repair price.</strong> You are repositioning the fee, not
          deleting it. If the repair price is unchanged, you just gave away $99.
        </li>
        <li>
          <strong>Never waive the diagnostic on a no-repair call.</strong> That is exactly the
          visit where your expertise was the entire product.
        </li>
      </ul>

      <h2>Say the number before you drive</h2>
      <p>
        Every price objection on a service call traces back to a number the customer first heard
        in their kitchen. Say it on the phone, plainly: “There’s a $109 service call that covers
        the visit and the diagnosis. If you go ahead with the repair, that comes off the price.”
        Customers almost never argue with a fee they agreed to before you left the yard.
      </p>

      <h2>After-hours is a different rate</h2>
      <p>
        Evenings, weekends and holidays cost you more and should cost more. Publish it. A stated
        after-hours rate also does useful filtering — some calls become tomorrow-morning
        appointments, which suits everyone.
      </p>

      <h2>The minimum that is not negotiable</h2>
      <p>
        Set a minimum charge that covers the block, and hold it. The jobs that feel too small to
        charge properly for are precisely the ones eating your week. Three $60 calls in a day is a
        busy, unprofitable day.
      </p>

      <h2>Turn the call into a quote on the spot</h2>
      <p>
        The repair you diagnose is worth quoting before you leave — and so is the replacement you
        spotted while you were there. Toolbelt turns a sentence into a priced, e-signable quote
        from the driveway, with your service call rate already in the price book. Three free
        estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/how-much-should-a-contractor-charge-per-hour">
          setting your hourly rate
        </a>{' '}
        and <a href="/blog/how-to-build-a-contractor-price-book">building a price book</a>.
      </p>
    </>
  );
}
