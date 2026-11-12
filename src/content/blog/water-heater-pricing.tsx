import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-plumbers-price-water-heater-replacement',
  title: 'How plumbers price a water heater replacement — the full breakdown',
  metaTitle: 'How Plumbers Price a Water Heater Swap',
  description:
    'Everything that belongs in a water heater quote: labor, the unit, code items, haul-off, permits — and how to present tank vs. tankless without losing the job.',
  published: '2026-08-20',
  readingMinutes: 6,
  trade: 'plumbing',
  topic: 'Pricing',
  faq: [
    {
      q: 'What goes into the price of a water heater replacement?',
      a:
        'Four things: the unit itself, labour the customer cannot see, the code items that surprise people, and haul-off, permit and the small stuff. Showing them as separate lines is what defends a price that is higher than the next quote.',
    },
    {
      q: 'Should I quote tank or tankless?',
      a:
        'Quote both, side by side, as options rather than as an argument. Letting the homeowner choose between two priced paths converts better than talking them into one.',
    },
    {
      q: 'Does the cheapest water heater quote win?',
      a:
        'Usually not — speed wins this job more often than price does. Water heater failures are urgent, and the quote that arrives first is frequently the one that gets accepted.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        A water heater replacement is the most-shopped job in plumbing. The homeowner has no hot
        water, three tabs open, and a number in their head from a big-box website that doesn&rsquo;t
        include half of what the job actually takes. Your estimate has to close that gap fast —
        here&rsquo;s what goes into it.
      </p>

      <h2>What the price is actually made of</h2>
      <h3>The unit</h3>
      <p>
        A standard 40- or 50-gallon gas tank is the baseline. What moves the number: capacity,
        warranty length (6-year vs. 10-12 year), power vent vs. atmospheric, and brand tier. Quote
        the exact model — &ldquo;50-gal gas, 10-year warranty&rdquo; reads like a professional
        chose it; &ldquo;water heater&rdquo; reads like a guess.
      </p>

      <h3>Labor that isn&rsquo;t obvious to the customer</h3>
      <ul>
        <li>Drain, disconnect, and remove the old unit (heavier than any homeowner expects)</li>
        <li>Set, level, and connect the new one — water, gas, venting</li>
        <li>Leak-test the gas line and check draft</li>
        <li>Fill, purge air, verify operation and temperature</li>
      </ul>

      <h3>The code items that surprise people</h3>
      <p>
        This is where cheap quotes fall apart. Depending on your jurisdiction and what the old
        install looked like, the job may also need: a new T&amp;P discharge line, expansion tank,
        drain pan with a routed drain, seismic straps, a sediment trap on the gas line, updated
        venting, or a raised platform in a garage. <strong>Itemize these.</strong> When your quote
        is $400 over the guy who ignored them, the line items are your defense — and the inspector
        is your backup.
      </p>

      <h3>Haul-off, permit, and the small stuff</h3>
      <p>
        Disposal fees are real, permits are real (and often specifically required for water
        heaters), and flex connectors, valves, and fittings add up. A line that says &ldquo;permit
        &amp; inspection included&rdquo; is worth more than its price — it tells the homeowner
        you&rsquo;re doing it right.
      </p>

      <h2>Tank vs. tankless: sell it as options, not an argument</h2>
      <p>
        The homeowner googling &ldquo;tankless worth it?&rdquo; doesn&rsquo;t want a lecture — they
        want to see both numbers side by side. Present it as a good/better/best choice:
      </p>
      <table>
        <thead>
          <tr><th>Option</th><th>What it is</th><th>The honest pitch</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Good</td>
            <td>Like-for-like tank, 6-yr warranty</td>
            <td>Hot water back today, lowest cost</td>
          </tr>
          <tr>
            <td>Better</td>
            <td>Premium tank, 10–12-yr warranty, expansion tank</td>
            <td>Same footprint, decade of peace</td>
          </tr>
          <tr>
            <td>Best</td>
            <td>Tankless with required gas/vent upgrades priced in</td>
            <td>Endless hot water, wall space back — priced honestly, upgrades included</td>
          </tr>
        </tbody>
      </table>
      <p>
        The trap to avoid: quoting tankless <em>without</em> the gas line upsizing and venting it
        usually needs. That lowball wins the signature and loses the profit. Price the real job.
      </p>

      <h2>Speed wins this job more than price does</h2>
      <p>
        No-hot-water customers hire whoever makes the problem feel handled first. The plumber who
        sends an itemized, signable quote from the garage — deposit button included — beats the one
        who &ldquo;will email something tonight.&rdquo; That&rsquo;s a workflow problem more than a
        pricing problem, and it&rsquo;s fixable: see{' '}
        <a href="/for/plumbing">how a plumbing-specific estimate tool handles it</a>, water heater
        presets included.
      </p>

      <h2>The one-paragraph summary</h2>
      <p>
        Quote the exact unit. Itemize the labor. Call out the code items by name. Include haul-off
        and the permit. Offer tank and tankless as clean options. Send it before you leave the
        driveway with a way to sign and pay a deposit. Do all that and you&rsquo;re no longer
        competing with a big-box installer&rsquo;s teaser price — you&rsquo;re the company that
        clearly knows what the job takes.
      </p>
    </>
  );
}
