import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-write-an-hvac-estimate',
  title: 'How to write an HVAC estimate that wins the job before the callback',
  metaTitle: 'How to Write an HVAC Estimate',
  description:
    'How to write an HVAC estimate that reads professional and gets signed fast — the line items, the assumptions, and the follow-up most techs skip.',
  published: '2026-08-29',
  readingMinutes: 6,
  topic: 'How-to',
  trade: 'hvac',
  faq: [
    {
      q: 'What should an HVAC estimate include?',
      a:
        'Name the job the way you would say it out loud, split labour from equipment, itemise repairs instead of lumping them, put your assumptions in writing, and end with a way to say yes rather than a callback.',
    },
    {
      q: 'Why break an HVAC price into lines?',
      a:
        'Because a single line such as “AC replacement — $2,910” invites price comparison and nothing else. Broken out, the same number reads as a specification the customer can understand.',
    },
    {
      q: 'Should repairs be quoted as carefully as replacements?',
      a:
        'Yes. Repairs tend to get the lazy treatment, and a vague repair line is where both margin and trust leak out.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        The homeowner is getting three quotes. Whoever sends the clearest one first usually wins,
        not whoever’s cheapest. Here’s <strong>how to write an HVAC estimate</strong> that reads
        like you’ve done this a thousand times — because you have.
      </p>

      <h2>1. Name the job the way you’d say it out loud</h2>
      <p>
        “Replace a 3-ton AC condenser and coil, reconnect the lineset, haul off the old unit.” That
        sentence is the whole scope. Everything else on the estimate is just breaking it into
        priced lines.
      </p>

      <h2>2. Split labor from equipment, every time</h2>
      <ul>
        <li><strong>Labor</strong> — condenser and coil swap, lineset reconnect, priced at your rate.</li>
        <li><strong>Equipment</strong> — the condenser and evaporator coil, priced at your cost plus markup.</li>
        <li><strong>Extras</strong> — haul-off, a crane if it’s needed, anything that’s easy to forget writing it up that night.</li>
      </ul>
      <p>
        A single “AC replacement — $2,910” line invites price comparison. Broken out, it reads as
        exactly what you’re actually doing.
      </p>

      <h2>3. Don’t let repairs get the lazy treatment</h2>
      <p>
        Capacitors, blower motors, refrigerant charges — these get written sloppier than
        changeouts because they feel small. They shouldn’t. A clean repair estimate is how a
        one-time customer becomes a maintenance-plan customer.
      </p>

      <h2>4. Put the assumption in writing, not just in your head</h2>
      <p>
        If the ductwork needs work you’re not quoting today, say so on the document. “Existing
        ductwork assumed adequate; further work quoted separately if needed” costs you one
        sentence and saves you an argument in July.
      </p>

      <h2>5. End with a way to say yes, not a callback</h2>
      <p>
        E-sign and a deposit link beat “call the office to schedule” every time. The homeowner
        standing in the driveway with you is more likely to sign now than to remember to call
        Tuesday.
      </p>

      <h2>How to write an HVAC estimate faster, once you know the structure</h2>
      <p>
        This structure works whether you write it in a notebook or type it into an app. The
        difference is speed: Toolbelt drafts the condenser swap or the repair from a sentence —
        or a photo of the data plate — priced from your rates, with e-sign and deposit built in.
      </p>

      <p>
        Three free estimates, no card: <a href="/for/hvac">start with Toolbelt for HVAC</a>. For
        the software side of this, see <a href="/blog/hvac-estimate-software">HVAC estimate
        software</a>, and if you send estimates from the truck between calls,
        <a href="/blog/estimates-from-the-truck">this one’s about exactly that morning</a>.
      </p>
    </>
  );
}
