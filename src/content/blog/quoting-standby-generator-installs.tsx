import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'quoting-standby-generator-installs',
  title: 'Quoting standby generator installs before the first outage',
  metaTitle: 'Quoting Standby Generator Installs',
  description:
    'How electricians quote standby generator installs: the load math, the line items that get missed, and why a quote sent in October beats one sent in January.',
  published: '2026-10-26',
  readingMinutes: 7,
  topic: 'Electrical',
  trade: 'electrical',
};

export function Body() {
  return (
    <>
      <p>
        Standby generator work has a strange shape: demand spikes immediately after an outage,
        when lead times are longest and everyone is quoting. The jobs that go smoothly — and
        profitably — are nearly always quoted in the quiet weeks before.
      </p>

      <h2>Size it from the real load, not the brochure</h2>
      <p>
        The first decision is whole-house or essential circuits, and it drives everything
        downstream. Most homeowners say whole-house and mean “the fridge, the furnace, some
        lights and the well pump.”
      </p>
      <p>
        Run the load calculation properly. A 22kW unit where 14kW would serve the circuits they
        actually care about is several thousand dollars of equipment and a bigger gas line for no
        benefit — and the homeowner will feel sold to when the next quote comes in lower.
      </p>

      <h2>The line items that get missed</h2>
      <ul>
        <li>
          <strong>The gas line.</strong> Frequently the single largest surprise. Existing meter
          capacity, run length and pressure all matter, and an undersized supply will not start
          the unit under load. Confirm with the utility before you quote, not after.
        </li>
        <li>
          <strong>The pad.</strong> Concrete or composite, plus site prep and levelling.
        </li>
        <li>
          <strong>The transfer switch</strong> — automatic vs manual, and the service rating. A
          service upgrade hiding behind it changes the job completely.
        </li>
        <li>
          <strong>Trenching</strong> for the conductors and the gas line. Price per foot, and
          state the assumption about what is under the lawn.
        </li>
        <li>
          <strong>Permits and inspections</strong> — usually electrical and gas, sometimes
          mechanical, occasionally zoning for placement.
        </li>
        <li>
          <strong>Setback compliance.</strong> Distance from windows, doors, vents and the
          property line. Getting this wrong means moving a unit that is already bolted down.
        </li>
        <li>
          <strong>Commissioning</strong> — load bank test, exercise schedule, and walking the
          homeowner through it.
        </li>
      </ul>

      <h2>Quote the ongoing cost too</h2>
      <p>
        A generator needs an annual service and a weekly self-test. Say so in the quote, with the
        service price. It prevents the “nobody told me” conversation in year two and it sets up a
        recurring visit you can actually schedule.
      </p>

      <h2>Give them three tiers</h2>
      <p>
        Essential circuits, extended, whole-house — same page, three numbers. At this price point
        homeowners want to understand the trade-off rather than be handed a single figure. Tiered
        quotes also move the discussion from “is this too much” to “which one,” and they quietly
        raise the average sale.
      </p>

      <h2>Why October beats January</h2>
      <p>
        After a major outage, equipment lead times stretch to months, installers are booked, and
        the homeowner is comparing four quotes while frustrated. Before the season, you are
        competing with nobody, you can promise a date you will hit, and the customer is making a
        considered decision rather than a panicked one. The same job is worth more and goes
        better.
      </p>

      <h2>Quote it from the driveway</h2>
      <p>
        Toolbelt drafts the line items from a plain description and your own rates, gives you
        good/better/best tiers in one tap, and sends a branded, e-signable quote with a deposit
        button on it before you leave. The Load Calc Helper gives you a quick service-load sanity
        check first. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/quoting-a-200-amp-panel-upgrade">quoting a 200A panel upgrade</a> and{' '}
        <a href="/blog/how-to-write-an-electrical-estimate">
          how to write an electrical estimate
        </a>
        . Or <a href="/for/electrical">Toolbelt for electrical</a>.
      </p>
    </>
  );
}
