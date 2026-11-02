import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'scheduling-software-for-contractors',
  title: 'Scheduling software for contractors: what a small crew actually needs',
  metaTitle: 'Scheduling Software for Contractors',
  description:
    'Scheduling software for contractors without the enterprise bloat: what a one-to-five-truck shop actually needs, and the features that just add admin.',
  published: '2026-11-01',
  readingMinutes: 6,
  topic: 'Workflow',
};

export function Body() {
  return (
    <>
      <p>
        Search <strong>scheduling software for contractors</strong> and you will be shown dispatch
        boards built for forty-truck operations, priced per user, with a two-week onboarding. If
        you run one to five vans, almost none of that solves your problem — and the cost of
        adopting it is usually higher than the problem itself.
      </p>

      <h2>What a small shop actually needs</h2>
      <ul>
        <li>
          <strong>Tomorrow, on one screen.</strong> Who is going where, in what order, with the
          address and the phone number. That is the whole core requirement.
        </li>
        <li>
          <strong>Usable one-handed on a phone.</strong> Scheduling happens in a van, not at a
          desk.
        </li>
        <li>
          <strong>Attached to the job.</strong> The appointment should know which estimate it came
          from. Retyping the address is where errors enter.
        </li>
        <li>
          <strong>Something that tells you about tomorrow, tonight.</strong> The most common
          scheduling failure in a small shop is not a clash — it is forgetting.
        </li>
      </ul>

      <h2>What you probably do not need</h2>
      <ul>
        <li>
          <strong>Drag-and-drop dispatch boards.</strong> Brilliant with twelve techs, pure
          overhead with two.
        </li>
        <li>
          <strong>GPS tracking.</strong> If you can see all your vans from the yard, this is a
          subscription for a feeling.
        </li>
        <li>
          <strong>Route optimisation.</strong> Useful across thirty stops a day. Across five, you
          already know the town better than the algorithm.
        </li>
        <li>
          <strong>Customer self-booking.</strong> Appealing until a kitchen refit books a
          thirty-minute service slot.
        </li>
        <li>
          <strong>Per-user pricing</strong> for people who will open it twice a week.
        </li>
      </ul>

      <h2>The real failure mode</h2>
      <p>
        Small shops rarely lose jobs to double-booking. They lose them to a job that never made it
        onto any list — a callback promised in a driveway, a part that arrived, a customer who
        said “call me in two weeks.” Those live in a text message or somebody’s memory until they
        are a complaint.
      </p>
      <p>
        So the test for any scheduling tool is not how powerful the calendar is. It is whether
        things reliably get <em>onto</em> it, in the thirty seconds you have while standing in a
        driveway. A tool that is excellent but takes two minutes to enter a job will quietly go
        unused.
      </p>

      <h2>Judge it on three questions</h2>
      <ul>
        <li>Can I add a job in under thirty seconds, on my phone, with gloves half off?</li>
        <li>Does tomorrow reach me without opening the app?</li>
        <li>Does it know about the estimate, or am I typing the address again?</li>
      </ul>
      <p>If a tool fails those, extra features will not rescue it.</p>

      <h2>What Toolbelt does here</h2>
      <p>
        A clean agenda rather than a dispatch board, jobs that carry their estimate and customer
        with them, and an evening email with tomorrow’s jobs so the schedule reaches you without
        you going looking. Included in the same flat price as everything else on the belt — no
        per-user fee. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/permit-tracking-for-contractors">permit tracking</a> and{' '}
        <a href="/blog/integrating-estimating-with-other-tools">
          integrating estimating with your other tools
        </a>
        .
      </p>
    </>
  );
}
