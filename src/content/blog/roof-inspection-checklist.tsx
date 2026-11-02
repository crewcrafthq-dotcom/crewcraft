import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'roof-inspection-checklist',
  title: 'A roof inspection checklist that sells the work it finds',
  metaTitle: 'Roof Inspection Checklist',
  description:
    'A roof inspection checklist for contractors: what to check in order, what to photograph, and how to turn the findings into a quote before you leave.',
  published: '2026-09-30',
  readingMinutes: 7,
  topic: 'Roofing',
  trade: 'roofing',
};

export function Body() {
  return (
    <>
      <p>
        A roof inspection that ends in “it needs replacing” converts badly. One that ends with
        eight captioned photographs, a specific list of what is failing, and a priced option
        converts well — same roof, same conclusion, completely different conversation.
      </p>

      <h2>Start from the ground</h2>
      <p>
        Walk the perimeter first. Sagging rooflines, granules in the gutters and downspout
        splash-out, damaged fascia and soffit, overhanging limbs, and the age and condition of the
        gutters. Photograph each elevation wide before you go up — context shots you cannot
        recreate later.
      </p>

      <h2>Inside, before you climb</h2>
      <p>
        The attic tells you more than the shingles do. Daylight through the deck, staining on the
        sheathing, wet or compressed insulation, rusted nail tips, mould at the sheathing seams,
        and whether the bathroom fans actually vent outside or into the attic — a surprisingly
        common finding and an easy sell.
      </p>
      <p>Check the ventilation balance while you are there: intake at the soffit, exhaust at the ridge.</p>

      <h2>On the roof, in this order</h2>
      <ul>
        <li>
          <strong>Field shingles.</strong> Granule loss, curling, cupping, cracking, blistering.
          Note which slopes — south and west usually fail first.
        </li>
        <li>
          <strong>Storm damage.</strong> Hail bruising (soft to the touch, granules gone, mat
          exposed), wind creasing, missing tabs. Mark a test square and photograph it with the
          chalk.
        </li>
        <li>
          <strong>Valleys.</strong> Where leaks start. Open or closed, metal condition, debris.
        </li>
        <li>
          <strong>Flashing</strong> — step, counter, chimney, sidewall. The second most common
          leak source after valleys, and routinely the real cause when a customer blames the
          shingles.
        </li>
        <li>
          <strong>Penetrations.</strong> Pipe boots are the classic: the rubber splits at around
          ten to fifteen years and the roof is otherwise fine.
        </li>
        <li>
          <strong>Ridge and hip.</strong> Cap condition, ridge vent seating.
        </li>
        <li>
          <strong>Eaves and rakes.</strong> Drip edge present or absent, decking feel underfoot.
        </li>
        <li>
          <strong>Skylights and chimneys.</strong> Crickets, saddles, cap condition.
        </li>
      </ul>

      <h2>Photograph as evidence, not as a record</h2>
      <p>
        Wide shot for location, close shot for the defect, something for scale. Caption each one
        with the elevation and what it shows. Ten captioned photographs beat two hundred
        uncaptioned ones — for the customer, for an adjuster, and for you in six months.
      </p>

      <h2>Report like a professional, not a salesperson</h2>
      <p>
        Separate the findings into three buckets: needs attention now, will need attention within
        a couple of years, and fine. Homeowners trust a roofer who tells them which parts are
        good, and that trust is what makes the “needs attention now” section believable.
      </p>

      <h2>Quote before you leave</h2>
      <p>
        The gap between inspection and quote is where roofing jobs die. The homeowner was worried
        while you were on the ladder; by the time an emailed proposal arrives three days later,
        they have moved on.
      </p>

      <h2>Report and quote from the driveway</h2>
      <p>
        Toolbelt’s Photo Report Builder turns the captioned photos into a branded PDF on your
        phone — never uploaded anywhere — and a sentence turns the findings into a priced,
        e-signable quote with good/better/best options. Three free estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/roofing-supplements-after-a-storm">supplements after a storm</a>,{' '}
        <a href="/blog/job-site-photo-documentation">photo documentation</a>, and{' '}
        <a href="/for/roofing">Toolbelt for roofing</a>.
      </p>
    </>
  );
}
