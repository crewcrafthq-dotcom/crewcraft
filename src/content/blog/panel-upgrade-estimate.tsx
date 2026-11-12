import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'quoting-a-200-amp-panel-upgrade',
  title: 'Quoting a 100A→200A panel upgrade: what belongs in the estimate',
  metaTitle: 'Quoting a 100A→200A Panel Upgrade',
  description:
    'Load calculations, utility coordination, permits and inspection, grounding updates — how electricians scope a service upgrade estimate that holds up.',
  published: '2026-08-20',
  readingMinutes: 6,
  trade: 'electrical',
  topic: 'Estimates',
  faq: [
    {
      q: 'What belongs in a 200A panel upgrade quote?',
      a:
        'Start with the load calculation, then price the scope most quotes leave out, explain what the day itself involves for the household, structure the price as options, and put the assumptions in writing.',
    },
    {
      q: 'Do you need a load calculation before quoting a panel upgrade?',
      a:
        'Yes, before committing to a number. The calculation is what decides whether this is a straightforward swap or a job that pulls in the utility, and that difference is thousands of dollars.',
    },
    {
      q: 'Why explain the day of the panel upgrade?',
      a:
        'Because the homeowner is buying a day without power as well as a panel. Saying how long it is off, and what that means, prevents the complaint that otherwise arrives mid-job.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        Panel upgrades are having a moment — EV chargers, heat pumps, induction ranges, and
        30-amp-at-a-time home electrification keep pushing 100A services past their limit. Which
        means more homeowners than ever are collecting three quotes for a job they don&rsquo;t
        understand. The estimate that explains the job wins it.
      </p>

      <h2>Start with the load calc — before you commit to a number</h2>
      <p>
        The first question isn&rsquo;t &ldquo;what does a 200A panel cost&rdquo; — it&rsquo;s
        &ldquo;does this house actually need 200A, and will it pass inspection at 200A once the EV
        charger lands?&rdquo; A quick NEC 220.82-style calculation answers it: square footage,
        fixed appliances, HVAC, and the planned additions. Two minutes of arithmetic protects you
        from quoting a service that fails at rough-in — and telling a homeowner &ldquo;I ran your
        load calculation, here&rsquo;s the math&rdquo; instantly separates you from the guy who
        eyeballed it. (A calculator built for this lives in{' '}
        <a href="/for/electrical">Toolbelt&rsquo;s electrical kit</a>.)
      </p>

      <h2>The scope most quotes leave out</h2>
      <p>A service upgrade is never just the panel. The complete estimate covers:</p>
      <ul>
        <li><strong>The panel itself</strong> — 200A, 40-space; name the brand and model.</li>
        <li><strong>New service entrance</strong> where required: mast, weatherhead, SE cable, meter base (often utility-spec&rsquo;d).</li>
        <li><strong>Utility coordination</strong> — the disconnect/reconnect appointment; who schedules it and the realistic wait.</li>
        <li><strong>Grounding brought to current code</strong>: ground rods, bonding of water and gas lines, GEC sizing.</li>
        <li><strong>Code-required breakers</strong>: AFCI/GFCI requirements can add real cost on a reconnect — line-item them so the number doesn&rsquo;t look padded.</li>
        <li><strong>Permit and inspection</strong>, named and included.</li>
        <li><strong>Circuit relabeling</strong> — twenty minutes that homeowners rave about.</li>
      </ul>

      <h2>Explain the day itself</h2>
      <p>
        The homeowner&rsquo;s hidden worry is &ldquo;how long is my power off?&rdquo; Answer it in
        the estimate: <em>&ldquo;Power is disconnected by the utility in the morning; expect 4–8
        hours without service; we coordinate same-day reconnection and inspection where the
        jurisdiction allows.&rdquo;</em> One honest sentence buys more trust than any adjective.
      </p>

      <h2>Structure the price as options</h2>
      <table>
        <thead>
          <tr><th>Option</th><th>Scope</th></tr>
        </thead>
        <tbody>
          <tr><td>Good</td><td>200A panel swap, grounding to code, permit &amp; inspection</td></tr>
          <tr><td>Better</td><td>Everything above + whole-home surge protection</td></tr>
          <tr><td>Best</td><td>Everything above + EV-ready 50A circuit to the garage</td></tr>
        </tbody>
      </table>
      <p>
        The &ldquo;best&rdquo; tier does quiet work for you: it plants the idea that this upgrade is
        the gateway to the EV charger — and makes you the obvious electrician to install it.
      </p>

      <h2>Put the assumptions in writing</h2>
      <p>
        Service upgrades have discovery risk: corroded SE cable, unpermitted subpanels, aluminum
        branch circuits. Handle it the same way roofers handle rotten decking — a written
        allowance: <em>&ldquo;Price assumes serviceable existing SE conductors; replacement, if
        required at disconnect, quoted separately before proceeding.&rdquo;</em> You&rsquo;re not
        hedging; you&rsquo;re documenting. Inspectors respect it and so do customers.
      </p>

      <p>
        An estimate with the load calc referenced, the utility dance explained, grounding and
        AFCI/GFCI itemized, and the permit included doesn&rsquo;t read like a price — it reads like
        the plan of the person who&rsquo;s clearly done this two hundred times. That&rsquo;s what
        the signature is really for.
      </p>
    </>
  );
}
