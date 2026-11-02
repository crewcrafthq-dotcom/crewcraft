import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'contractor-insurance-explained',
  title: 'Contractor insurance, explained without the jargon',
  metaTitle: 'Contractor Insurance Explained',
  description:
    'Contractor insurance explained: general liability, workers’ comp, tools and commercial auto — what each covers, and the gaps that close small shops down.',
  published: '2026-09-18',
  readingMinutes: 7,
  topic: 'Operations',
};

export function Body() {
  return (
    <>
      <p>
        Insurance is the one business cost nobody enjoys and everybody needs. It is also sold in
        language designed to be skimmed, which is how contractors end up discovering a gap at the
        worst possible moment.
      </p>

      <h2>General liability</h2>
      <p>
        Covers damage you do to other people’s property and injuries to people who are not your
        employees. The drill through the water line, the ladder through the window, the customer
        who trips over your hose.
      </p>
      <p>
        $1M per occurrence / $2M aggregate is the common baseline, and most commercial customers
        and GCs will not let you on site without it. It is also what the certificate of insurance
        a homeowner asks for refers to.
      </p>

      <h2>Workers’ compensation</h2>
      <p>
        Covers injury to your employees. Required in nearly every state the moment you have one,
        and the penalties for going without are severe — in some states criminal.
      </p>
      <p>
        The trap: if you are a sole owner, you are often exempt, which sounds like a saving right
        up until you fall off a ladder and discover your health insurance excludes work injuries.
        Read that exclusion before you rely on it.
      </p>

      <h2>Commercial auto</h2>
      <p>
        Personal auto policies exclude business use. If the van is lettered, carrying tools, and
        driving to jobs, a personal policy may simply decline the claim. This is one of the most
        common and most expensive gaps in the trades.
      </p>

      <h2>Tools and equipment</h2>
      <p>
        Usually an inland marine policy. General liability does not cover your own tools being
        stolen out of your own van, which surprises people annually. If a theft would stop you
        working next week, insure it.
      </p>

      <h2>The ones worth knowing exist</h2>
      <ul>
        <li>
          <strong>Professional liability / E&amp;O</strong> — for design or specification advice.
          Relevant if you size systems or recommend solutions.
        </li>
        <li>
          <strong>Umbrella</strong> — extra limits over the others, usually inexpensive relative
          to the cover.
        </li>
        <li>
          <strong>Surety bonds</strong> — not insurance. They guarantee your performance to
          someone else, and you repay the surety if claimed. Frequently required for licensing.
        </li>
      </ul>

      <h2>The gaps that close businesses</h2>
      <ul>
        <li>
          <strong>Completed operations</strong> excluded or lapsed. Your work can fail two years
          after you finished; if the policy ended, the claim lands on you personally.
        </li>
        <li>
          <strong>Claims-made instead of occurrence</strong> policies, cancelled without tail
          cover. The old years become uninsured.
        </li>
        <li>
          <strong>Uninsured subcontractors.</strong> Their incident becomes your claim, and your
          insurer may charge you workers’ comp premium for them at audit.
        </li>
        <li>
          <strong>Work you do that the policy class code does not describe.</strong> Picking up
          roofing when you are classified as a plumber is a declined claim waiting to happen.
        </li>
      </ul>

      <h2>Put the cost in your rate</h2>
      <p>
        Insurance is overhead, which means it belongs in your hourly rate rather than in a vague
        sense that things are expensive. Contractors who price properly for it stop resenting the
        renewal.
      </p>

      <p>
        See{' '}
        <a href="/blog/how-much-should-a-contractor-charge-per-hour">
          how much to charge per hour
        </a>{' '}
        for where it lands in the number, and{' '}
        <a href="/blog/contractor-warranty-terms">warranty terms</a> for what you are promising
        beyond it.
      </p>
      <p>
        This is general information, not legal or insurance advice — requirements vary by state
        and by trade, so confirm yours with a broker who writes for contractors.
      </p>
    </>
  );
}
