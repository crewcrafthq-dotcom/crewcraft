import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-write-a-roofing-estimate',
  title: 'How to write a roofing estimate that survives the adjuster and the homeowner',
  metaTitle: 'How to Write a Roofing Estimate',
  description:
    'How to write a roofing estimate that holds up to both the homeowner and an insurance adjuster — per-square pricing, photos, and what to put in writing.',
  published: '2026-08-29',
  readingMinutes: 6,
  topic: 'How-to',
  trade: 'roofing',
};

export function Body() {
  return (
    <>
      <p>
        A roofing estimate has two readers: the homeowner deciding whether to sign, and sometimes
        an adjuster deciding whether to pay. Here’s <strong>how to write a roofing estimate</strong>
        that holds up to both.
      </p>

      <h2>1. Price by the square, not by the project</h2>
      <p>
        “Tear off and replace 22 squares of architectural shingles, new flashing and 2 sheets of
        decking” is a real scope. Price the tear-off labor per square, the shingles per square,
        and flashing and decking as their own lines. Per-square pricing is what an adjuster
        expects to see, and it’s what makes your number defensible instead of arbitrary.
      </p>

      <h2>2. Document with photos, not adjectives</h2>
      <p>
        “Storm damage to the north slope” is an opinion. A photo of the hail hits, captioned, is
        documentation. Every claim on the estimate that can be shown instead of described should
        be — it’s the difference between a quote and a report.
      </p>

      <h2>3. Break out what insurance typically covers versus what it doesn’t</h2>
      <p>
        Code-required upgrades, extra decking, disposal fees — these get argued about more than
        the shingles do. Naming them clearly on the estimate, separate from the base tear-off,
        gives you something concrete to point to instead of relitigating the whole number.
      </p>

      <h2>4. Write the assumption behind the price</h2>
      <p>
        “Decking replacement priced at 2 sheets; additional rot found during tear-off billed at
        $X/sheet” turns a mid-job surprise into something you already agreed on, instead of a
        fight.
      </p>

      <h2>5. Give the homeowner a way to sign today</h2>
      <p>
        Storm season means every roofer on the street is knocking on doors. An e-sign link and a
        deposit button beat “I’ll email you something” every time someone else is also standing
        on that porch.
      </p>

      <h2>How to write a roofing estimate faster, once the structure’s set</h2>
      <p>
        This structure is the same whether you write it on a clipboard or type it into an app —
        the app just does it faster. Toolbelt prices tear-offs by the square from your own
        material costs, and the Photo Report Builder turns roof photos into a clean, captioned PDF
        without the photos ever leaving your phone.
      </p>

      <p>
        Free on three real roofs, no card: <a href="/for/roofing">start with Toolbelt for
        roofing</a>. For the software comparison, see
        <a href="/blog/roofing-estimate-software">roofing estimate software</a>, and if you need a
        starting structure fast, <a href="/blog/free-estimate-template-for-contractors">this
        template breakdown</a> works for any trade.
      </p>
    </>
  );
}
