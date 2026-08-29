import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-write-a-plumbing-estimate',
  title: 'How to write a plumbing estimate that gets signed the same day',
  metaTitle: 'How to Write a Plumbing Estimate',
  description:
    'How to write a plumbing estimate that reads clean and gets signed fast — the line items, the deposit, and the follow-up most contractors skip.',
  published: '2026-08-29',
  readingMinutes: 6,
  topic: 'How-to',
  trade: 'plumbing',
};

export function Body() {
  return (
    <>
      <p>
        You know how to fix the leak. Writing it up so the homeowner signs today instead of
        “thinking about it” is a different skill. Here’s <strong>how to write a plumbing
        estimate</strong> that actually closes, in the order it should go on the page.
      </p>

      <h2>1. Scope the job in one sentence, then break it into lines</h2>
      <p>
        Start with what you’d tell another plumber: “Replace a 40-gallon gas water heater in the
        garage, haul off the old one.” Then split it: removal and install as labor, the unit and
        fittings as materials, haul-off as its own line. A single lump sum invites comparison
        shopping; itemized lines make yours the reference the others get judged against.
      </p>

      <h2>2. Price labor and materials separately, always</h2>
      <ul>
        <li><strong>Labor</strong> — removal, install, and testing for leaks, priced at your rate.</li>
        <li><strong>Materials</strong> — the unit itself, fittings, and a gas connector, priced at cost plus your markup.</li>
        <li><strong>Extras</strong> — permit, haul-off fee, anything that’s easy to forget when you’re writing it from memory that night.</li>
      </ul>

      <h2>3. Name your assumptions in writing</h2>
      <p>
        “Haul-off included, permit not included” belongs on the document, not just in your head.
        This is the single biggest thing separating a plumbing estimate that holds up mid-job from
        one that turns into an argument about what was actually agreed to.
      </p>

      <h2>4. Give tank and tankless side by side if it’s relevant</h2>
      <p>
        If there’s any chance the homeowner asks about tankless, put both options on the page
        instead of waiting for the question. It reads as expertise, not upselling, when it’s
        already there before they ask.
      </p>

      <h2>5. Make accepting a 30-second action, not a phone call</h2>
      <p>
        The estimate should end with a way to say yes on the spot — a link to e-sign and pay a
        deposit, not “call me to schedule.” Every extra step between “sounds good” and “signed”
        is a chance for the job to go quiet.
      </p>

      <h2>How to write a plumbing estimate faster, once you know the structure</h2>
      <p>
        Writing one plumbing estimate this way, by hand, teaches you the structure. Doing it every
        single time by hand is how evenings disappear. Toolbelt drafts the water heater, the
        repipe, or the service call from a sentence — priced from your own rates — with the
        e-sign and deposit link already built in.
      </p>

      <p>
        Free on three real jobs, no card: <a href="/for/plumbing">start with Toolbelt for
        plumbing</a>. For the software side of this same decision, see
        <a href="/blog/plumbing-estimate-software">plumbing estimate software</a> and
        <a href="/blog/fastest-way-to-send-plumbing-estimates">the fastest way to send one from
        the field</a>.
      </p>
    </>
  );
}
