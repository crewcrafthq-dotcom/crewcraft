import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'estimates-from-the-truck',
  title: 'Estimates from the truck: what a real morning looks like when it works',
  metaTitle: 'Estimates From the Truck: A Real Morning',
  description:
    'What sending estimates from the truck actually looks like on a real morning — three calls, three quotes sent before lunch, no evening paperwork left over.',
  published: '2026-08-29',
  readingMinutes: 6,
  topic: 'Workflow',
};

export function Body() {
  return (
    <>
      <p>
        Here’s what a morning running <strong>estimates from the truck</strong> actually looks
        like, start to finish — not a feature list, an actual sequence of three calls before
        lunch.
      </p>

      <h2>7:40 AM — the water heater call</h2>
      <p>
        Garage, 40-gallon gas unit, pilot won’t hold. It’s a replacement, not a repair. Before
        pulling out of the driveway: one sentence typed into the phone — “Replace a 40-gallon gas
        water heater, haul off the old one” — a fifteen-second check of the draft, and the
        customer’s got a link in her inbox with the total and an e-sign button before the truck’s
        out of park.
      </p>

      <h2>9:15 AM — the service call that turns into more</h2>
      <p>
        Started as a slow drain, turned into “while you’re here, can you look at this other
        thing.” This is the moment estimates usually get lost — too many small items to remember
        by the time you’re writing it up that night. From the truck, it’s two more lines added to
        the same draft before you leave the curb, itemized instead of forgotten.
      </p>

      <h2>11:30 AM — the repipe walkthrough</h2>
      <p>
        Bigger job, worth breaking into phases so the homeowner isn’t staring at one intimidating
        number. A phone description gets the shape of it drafted on the spot; you adjust the
        phasing before sending, but the tedious part — line items, pricing, formatting — is
        already done.
      </p>

      <h2>What didn’t happen: an evening of paperwork</h2>
      <p>
        Three real jobs, three sent estimates, zero of them written from memory at 9 PM. That’s
        the actual case for estimates from the truck — not that it’s impressive technology, but
        that Sunday doesn’t have to be catch-up day.
      </p>

      <h2>What makes this possible</h2>
      <p>
        It only works if the tool prices from your own rates, works one-handed on a phone, and
        finishes the job — e-sign and a deposit link — instead of stopping at a PDF you still have
        to email. Anything less and you’re back to typing everything up that night anyway.
      </p>

      <h2>Run your own estimates from the truck this week</h2>
      <p>
        Toolbelt is built for exactly this sequence: type or dictate the job, check the priced
        draft, send. Three free estimates, no card, so you can try it on your actual next three
        calls.
      </p>

      <p>
        <a href="/#try">Try it on the homepage</a> first if you want to see it work before signing
        up. For the mechanics of the workflow itself, see
        <a href="/blog/send-estimates-from-the-field">how to send estimates from the field</a>,
        and if evenings are still where the real writing happens for you right now,
        <a href="/blog/stop-doing-estimates-after-hours">here’s how to actually stop that</a>.
      </p>
    </>
  );
}
