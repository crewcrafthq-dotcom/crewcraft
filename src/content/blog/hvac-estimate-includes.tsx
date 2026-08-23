import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'what-a-professional-hvac-estimate-includes',
  title: 'What a professional HVAC estimate should include (with a real example)',
  metaTitle: 'What an HVAC Estimate Should Include',
  description:
    'The line items, scope language, and exclusions that separate a winning HVAC estimate from a number on a napkin — with a full changeout example.',
  published: '2026-08-20',
  readingMinutes: 6,
  trade: 'hvac',
  topic: 'Estimates',
};

export function Body() {
  return (
    <>
      <p>
        Two contractors look at the same 3-ton changeout. One texts the homeowner
        &ldquo;$7,800 for everything.&rdquo; The other sends an itemized, branded estimate twenty
        minutes later. Same price, same equipment — but only one of them looks like a company the
        homeowner can trust with a five-figure hole in their house. This is what that second
        estimate contains.
      </p>

      <h2>The anatomy of an estimate that wins</h2>
      <h3>1. A scope of work in homeowner English</h3>
      <p>
        Not &ldquo;R&amp;R condenser + coil.&rdquo; Write it the way you&rsquo;d explain it at the
        kitchen table: <em>&ldquo;Remove the failed condenser and indoor coil, set a new 3-ton
        16-SEER2 condenser on a new pad, install the matching coil, reconnect and pressure-test the
        lineset, pull a vacuum, charge to spec, and haul off the old equipment.&rdquo;</em> The
        homeowner is comparing you against a competitor they can actually understand — be that
        competitor.
      </p>

      <h3>2. Labor and materials, separated</h3>
      <p>
        Itemizing does two jobs: it justifies the total, and it protects you when the customer asks
        to cut something. A typical changeout breaks out like this:
      </p>
      <table>
        <thead>
          <tr><th>Line item</th><th>Type</th></tr>
        </thead>
        <tbody>
          <tr><td>Condenser &amp; coil swap, lineset reconnect, vacuum &amp; charge</td><td>Labor</td></tr>
          <tr><td>3-ton 16-SEER2 condenser</td><td>Materials</td></tr>
          <tr><td>Matching evaporator coil</td><td>Materials</td></tr>
          <tr><td>New pad, whip, disconnect, drain safety switch</td><td>Materials</td></tr>
          <tr><td>Refrigerant, brazing supplies, misc.</td><td>Materials</td></tr>
          <tr><td>Old equipment haul-off &amp; disposal</td><td>Labor</td></tr>
        </tbody>
      </table>
      <p>
        Notice what itemizing does to the &ldquo;$7,800 for everything&rdquo; competitor: next to
        your estimate, his number now looks like it&rsquo;s hiding something.
      </p>

      <h3>3. What&rsquo;s NOT included</h3>
      <p>
        The exclusions section prevents the phone call that eats your margin. Standard ones:
        electrical service upgrades, duct modifications beyond the plenum connections, drywall
        repair, permit fees if your jurisdiction bills them separately, and code-required extras
        discovered after opening the system. One honest paragraph here saves one ugly conversation
        later.
      </p>

      <h3>4. The details that signal &ldquo;real company&rdquo;</h3>
      <ul>
        <li>Your logo, license number, and phone — on every page, not just the first.</li>
        <li>An expiration date (&ldquo;valid 30 days&rdquo; — equipment prices move).</li>
        <li>Deposit amount and what triggers the balance (&ldquo;50% to schedule, balance on completion&rdquo;).</li>
        <li>A signature line. An estimate a customer can sign is an estimate that closes.</li>
      </ul>

      <h2>Offer three versions, not one</h2>
      <p>
        The single most effective change most HVAC contractors can make: stop sending one number.
        A good/better/best estimate — say, 14-SEER2 builder grade, 16-SEER2 with a better warranty,
        and a variable-speed heat pump — changes the homeowner&rsquo;s question from &ldquo;should I
        hire him?&rdquo; to &ldquo;which one should I pick?&rdquo; Most pick the middle. You priced
        the middle to win.
      </p>

      <h2>Speed is a line item too</h2>
      <p>
        The estimate that arrives while you&rsquo;re still in the driveway beats the prettier one
        that arrives Thursday. Homeowners without AC call three companies and stop calling when one
        of them looks professional <em>and</em> moves fast. However you produce your estimates —
        by hand, spreadsheet, or{' '}
        <a href="/for/hvac">software that drafts them from a plain-English description</a> — the
        goal is the same: itemized, branded, signable, and in their inbox before your van leaves
        the block.
      </p>

      <h2>The checklist</h2>
      <ol>
        <li>Plain-English scope of work</li>
        <li>Itemized labor and materials</li>
        <li>Equipment model numbers and efficiency ratings</li>
        <li>Exclusions</li>
        <li>Deposit terms and expiration date</li>
        <li>License, logo, contact info</li>
        <li>A way to accept and sign on the spot</li>
        <li>Ideally: three options instead of one</li>
      </ol>
      <p>
        None of this is complicated. It&rsquo;s just work — which is exactly why the contractors who
        do it stand out.
      </p>
    </>
  );
}
