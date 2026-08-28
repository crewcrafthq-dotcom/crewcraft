import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'software-support-and-adoption-pitfalls',
  title: 'Software support and the real reasons new estimating tools do not stick',
  metaTitle: 'Estimating Software Support & Adoption',
  description:
    'What kind of support to expect from estimating software, and the specific reasons crews stop using new tools a few weeks after switching.',
  published: '2026-08-28',
  readingMinutes: 5,
  topic: 'Workflow',
};

export function Body() {
  return (
    <>
      <p>
        Plenty of contractors have a story about software they bought, used for a month, and
        quietly went back to the old way. It is rarely because the software was broken. It is
        almost always one of a small number of predictable reasons &mdash; worth knowing before
        you switch, not after.
      </p>

      <h2>Why new tools stop getting used</h2>
      <ul>
        <li>
          <strong>It did not fit into the moment work actually happens.</strong> If writing an
          estimate means going back to an office computer instead of doing it from the truck or
          the driveway, it competes with just doing it the old way &mdash; and the old way is
          already a habit.
        </li>
        <li>
          <strong>Setup got left half-done.</strong> A price book that was never loaded, a logo
          that was never uploaded &mdash; software that defaults to generic output because the
          five-minute setup step got skipped feels worse than the old process, not better.
        </li>
        <li>
          <strong>It did not speak the trade.</strong> Generic construction software built for
          general contractors often does not understand HVAC, plumbing, electrical, or roofing
          language well, and correcting that every time erases the time it was supposed to save.
        </li>
        <li>
          <strong>Nobody set the habit early.</strong> The first two weeks decide whether a tool
          sticks. If the first few real jobs go through it, it becomes the new normal; if the
          first busy week gets handled the old way &ldquo;just this once,&rdquo; it usually stays
          that way.
        </li>
      </ul>

      <h2>What to actually ask about support</h2>
      <p>
        &ldquo;Support&rdquo; on a landing page can mean anything from a documentation page to a
        24-hour phone line. For a small trade business, the more useful question is response
        time and who you actually reach &mdash; a support ticket queue at a large company, or
        someone who can look at your actual account and fix something today. Ask directly, and
        judge the answer by how specific it is.
      </p>

      <h2>A rollout plan that actually works</h2>
      <ol>
        <li>Load your rates and logo before the first real job, not after.</li>
        <li>Run your next three real estimates through the new tool, no exceptions, even the busy day.</li>
        <li>
          Send the customer the estimate straight from the tool instead of exporting and
          re-sending, so the e-sign and follow-up parts actually get used.
        </li>
        <li>Check in after two weeks: is it faster than the old way yet, on a real job, not a demo?</li>
      </ol>

      <h2>How Toolbelt approaches this</h2>
      <p>
        Toolbelt is built by a single founder, and support is a direct line rather than a ticket
        queue &mdash; questions get answered by the person who built the feature, usually within
        a day. Setup is short on purpose: company name, logo, and rates, and every estimate after
        that carries them automatically, which is meant to remove the &ldquo;half-finished
        setup&rdquo; failure mode above before it happens.
      </p>
    </>
  );
}
