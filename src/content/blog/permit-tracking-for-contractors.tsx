import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'permit-tracking-for-contractors',
  title: 'Permit tracking: the admin that quietly delays your jobs',
  metaTitle: 'Permit Tracking for Contractors',
  description:
    'Permit tracking for contractors: how to keep every job’s permit and inspection date visible, and stop finding out at 7am that the inspector is coming.',
  published: '2026-11-02',
  readingMinutes: 5,
  topic: 'Workflow',
};

export function Body() {
  return (
    <>
      <p>
        Nobody loses a job over permits. They lose days — a week waiting on an approval nobody
        chased, a failed inspection because the right person was not on site, a final payment
        held because the sign-off never came back.
      </p>

      <h2>Why it goes wrong in small shops</h2>
      <p>
        Permits live in email, and email is where things go to be forgotten. The application is in
        sent items, the approval is three weeks down the inbox, and the inspection date exists
        only in a phone call somebody half remembers. There is no list. Nobody decided there would
        not be a list — it just never got made.
      </p>

      <h2>What to track per job</h2>
      <ul>
        <li>
          <strong>Jurisdiction.</strong> Neighbouring towns run completely different processes,
          fees and timelines.
        </li>
        <li>
          <strong>Permit type and number.</strong> One job often carries several — electrical,
          mechanical, plumbing.
        </li>
        <li>
          <strong>Applied date</strong> and expected turnaround, so you know when chasing is fair.
        </li>
        <li>
          <strong>Status</strong> — applied, issued, inspection booked, passed, failed, closed.
        </li>
        <li>
          <strong>Inspection date and time window.</strong> The field that actually costs money.
        </li>
        <li>
          <strong>Who must be on site.</strong> Some inspections need the licence holder, not
          whoever is nearest.
        </li>
        <li>
          <strong>Expiry.</strong> Permits lapse. A lapsed permit on a stalled job means
          reapplying and paying twice.
        </li>
      </ul>

      <h2>The two expensive mistakes</h2>
      <h3>Finding out the morning of</h3>
      <p>
        An inspection you learn about at 7am is an inspection you may not be ready for. The crew
        is committed elsewhere, the work is not quite at the stage it needs to be, and a failed
        inspection costs a re-inspection fee and usually a week. A day’s warning fixes almost all
        of it.
      </p>
      <h3>Starting work before issue</h3>
      <p>
        Tempting when the customer is pushing and the paperwork is slow. It risks a stop-work
        order, double fees, and in some jurisdictions your licence. It also voids the insurance
        position you are relying on if anything goes wrong.
      </p>

      <h2>Build the permit into the quote</h2>
      <p>
        Permit fees and the time to obtain them belong on the estimate as a visible line, not
        absorbed. Customers accept permit costs readily — they are a government fee, not your
        margin — and showing the timeline sets expectations before anyone is waiting.
      </p>

      <h2>Keep it on one screen</h2>
      <p>
        Toolbelt’s Permit Tracker holds every job’s permit status and inspection date in one list,
        and emails you the day before an inspection so it is never a 7am discovery. Three free
        estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/scheduling-software-for-contractors">scheduling for small crews</a> and{' '}
        <a href="/blog/how-to-write-an-electrical-estimate">
          how to write an electrical estimate
        </a>
        , where permit lines belong.
      </p>
    </>
  );
}
