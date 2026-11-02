import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'quoting-ev-charger-installs',
  title: 'Quoting EV charger installs: the load math and the surprises',
  metaTitle: 'Quoting EV Charger Installs',
  description:
    'How electricians quote EV charger installs: load calculations, the panel upgrade conversation, permits and rebates, and the line items that get missed.',
  published: '2026-10-24',
  readingMinutes: 7,
  topic: 'Electrical',
  trade: 'electrical',
};

export function Body() {
  return (
    <>
      <p>
        EV charger installs look like a two-hour job and frequently are not. The quote that goes
        wrong is nearly always the one given over the phone, before anyone has looked at the panel.
      </p>

      <h2>The load calculation decides everything</h2>
      <p>
        A Level 2 charger is a continuous load — you size at 125% of the rated current. A 48A
        charger needs a 60A circuit, and that is before anything else in the house.
      </p>
      <p>
        Run the service calculation properly (NEC 220.82 or 220.83 for an existing dwelling). The
        answer determines whether this is a straightforward circuit or a service upgrade, and that
        is a difference of thousands of dollars. Never quote without it.
      </p>

      <h2>When the panel cannot take it</h2>
      <p>Three options, and the customer should see all three:</p>
      <ul>
        <li>
          <strong>Load management.</strong> A device that prevents the charger and a large load
          running simultaneously. Often lets a 100A service take a charger without an upgrade, and
          it is far cheaper than the alternative.
        </li>
        <li>
          <strong>A smaller charger.</strong> 32A instead of 48A. Most overnight charging does not
          need the larger unit, and plenty of customers are happy once the maths is explained in
          miles per hour.
        </li>
        <li>
          <strong>Service upgrade.</strong> The honest answer sometimes, and a much bigger job
          involving the utility.
        </li>
      </ul>

      <h2>The line items that get missed</h2>
      <ul>
        <li>
          <strong>The run length.</strong> Panel in the basement, charger on the far side of a
          detached garage, is a completely different job from a panel on the garage wall. Measure.
        </li>
        <li>
          <strong>Trenching</strong> for a detached garage, plus whatever is under the lawn.
        </li>
        <li>
          <strong>Conduit and surface mounting</strong> where fishing a wall is not possible.
        </li>
        <li>
          <strong>GFCI requirements</strong> — for a hardwired unit the charger may provide it;
          for a receptacle install it generally does not.
        </li>
        <li>
          <strong>Receptacle vs hardwired.</strong> A NEMA 14-50 looks cheaper and brings its own
          requirements. Hardwiring is often the better install and should be offered as an option,
          not assumed.
        </li>
        <li>
          <strong>Permit and inspection</strong> — required nearly everywhere for a new 240V
          circuit.
        </li>
        <li>
          <strong>Commissioning</strong> — app setup, Wi-Fi connection, showing the customer how
          it works. Budget the time; it is rarely five minutes.
        </li>
      </ul>

      <h2>Rebates are part of the sale</h2>
      <p>
        Utility and state rebates frequently cover a meaningful slice of the job, and many
        customers do not know they exist. Knowing your local programmes — and which require a
        licensed installer or a specific model — turns a price objection into a reason to go
        ahead. Some require pre-approval before work starts, so raise it at quoting time, not
        after.
      </p>

      <h2>Give them options on one page</h2>
      <p>
        Charger size, receptacle versus hardwired, load management versus upgrade — this is
        exactly the job for good/better/best. A single number invites a second opinion; three
        options invite a decision.
      </p>

      <h2>Quote it from the driveway</h2>
      <p>
        Toolbelt’s Load Calc Helper gives you the service-load sanity check on site, then a
        sentence becomes a priced, branded, e-signable quote with tiers and a deposit button —
        before you leave. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/quoting-a-200-amp-panel-upgrade">quoting a 200A panel upgrade</a>,{' '}
        <a href="/blog/quoting-standby-generator-installs">standby generators</a>, and{' '}
        <a href="/for/electrical">Toolbelt for electrical</a>.
      </p>
    </>
  );
}
