import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'roofing-estimate-that-wins-and-survives-the-adjuster',
  title: 'How to write a roofing estimate that wins the job — and survives the adjuster',
  description:
    'Squares, waste factor, decking allowances, photo documentation, and supplement-ready scope language — the roofing estimate as a legal and sales document.',
  published: '2026-08-20',
  readingMinutes: 7,
  trade: 'roofing',
  topic: 'Estimates',
};

export function Body() {
  return (
    <>
      <p>
        Roofing is the paperwork trade. The estimate isn&rsquo;t just a price — it&rsquo;s the
        document a homeowner compares against two competitors, an insurance adjuster measures
        against a Xactimate scope, and a supplier turns into an order. Write it once, correctly,
        and all three of those conversations get easier.
      </p>

      <h2>Measure like you&rsquo;ll be audited</h2>
      <p>
        Everything downstream depends on the square count. State it explicitly — &ldquo;22 squares,
        6/12 pitch, single story&rdquo; — and then state your waste factor separately.
        A straightforward gable roof might carry 10% waste; cut-up hips and valleys can
        justify 15% or more. Adjusters argue waste constantly; an estimate that shows its
        math (&ldquo;22 SQ measured + 12% waste = 24.6 SQ ordered&rdquo;) is an estimate that
        wins those arguments.
      </p>

      <h2>Itemize the layers, not just the shingles</h2>
      <p>A tear-off and re-roof is eight or nine distinct scopes. List them:</p>
      <ul>
        <li>Tear-off and disposal (dumpster included — say so)</li>
        <li>Underlayment, ice &amp; water shield at eaves/valleys where code requires</li>
        <li>Drip edge, starter strip, field shingles by name and line (&ldquo;architectural, 30-yr&rdquo;)</li>
        <li>Ridge cap and ridge vent</li>
        <li>Pipe boots, step and counter flashing</li>
        <li>Decking allowance — see below</li>
        <li>Cleanup: magnetic sweep for nails, gutters cleared</li>
      </ul>
      <p>
        Each line is a small proof that you saw the whole roof. The one-line
        &ldquo;$14,500 — roof replacement&rdquo; competitor can&rsquo;t explain his number;
        yours explains itself.
      </p>

      <h2>The decking allowance: the most important paragraph on the page</h2>
      <p>
        You cannot see rot until tear-off. Handle it in writing, before it becomes a driveway
        argument: <em>&ldquo;Price includes replacement of up to 2 sheets of decking. Additional
        decking replaced at $X per sheet, documented with photos before install.&rdquo;</em> That
        sentence protects your margin, and the photo clause protects your credibility.
      </p>

      <h2>Photos are half the estimate</h2>
      <p>
        For retail jobs, photos justify the price to a homeowner who will never climb the roof.
        For storm work, they justify the claim to an adjuster who wasn&rsquo;t there. Shoot the
        same set every time: overview from each slope, close-ups of hail bruising or wind creases
        with something for scale, flashing condition, and every penetration. A captioned photo
        report attached to the estimate reads like evidence, because it is —{' '}
        <a href="/for/roofing">tools built for roofing</a> can assemble one from your phone shots
        in a couple of minutes.
      </p>

      <h2>Write scope language the adjuster already speaks</h2>
      <p>
        When insurance is involved, mirror the structure adjusters use: quantities by squares and
        linear feet, named components, code items called out as code items (&ldquo;drip edge
        required per local code&rdquo;). When the first scope comes in short — it often does — your
        supplement letter is easier to write because your estimate already reads like one. Document
        what the adjuster missed, cite the photo, state the quantity, and ask for the line.
        Polite, specific, and in writing beats loud every time.
      </p>

      <h2>Close the sale in the same document</h2>
      <ul>
        <li><strong>Deposit terms</strong>: what schedules the job, what&rsquo;s due at completion.</li>
        <li><strong>Timeline</strong>: &ldquo;1–2 days on site, weather permitting.&rdquo;</li>
        <li><strong>Workmanship warranty</strong> stated separately from the manufacturer&rsquo;s.</li>
        <li><strong>A signature line</strong> — storm season is a race, and the signed estimate is the finish line.</li>
      </ul>

      <p>
        The roofer who sends this document from the driveway — measured, itemized, photographed,
        signable — doesn&rsquo;t just look more professional than the napkin-number guy. On
        insurance work, that piece of paper routinely recovers thousands of dollars the first
        scope left out. In this trade, the paperwork <em>is</em> the profit.
      </p>
    </>
  );
}
