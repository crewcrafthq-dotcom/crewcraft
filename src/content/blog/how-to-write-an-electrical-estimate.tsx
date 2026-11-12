import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-write-an-electrical-estimate',
  title: 'How to write an electrical estimate that holds up after the inspection',
  metaTitle: 'How to Write an Electrical Estimate',
  description:
    'How to write an electrical estimate that holds up at inspection and doesn’t get argued about later — load assumptions, permits, and clean line items.',
  published: '2026-08-29',
  readingMinutes: 6,
  topic: 'How-to',
  trade: 'electrical',
  faq: [
    {
      q: 'What should an electrical estimate include?',
      a:
        'Name the job like you would explain it to an apprentice, then split panel, breakers, grounding and labour into separate lines. Write your load assumptions down, put your licence number on the document, and offer tiers where the job allows.',
    },
    {
      q: 'Should a licence number go on an electrical estimate?',
      a:
        'Yes. It is expected in most jurisdictions and it quietly signals that you are a real, permitted company — which matters on work an inspector will later sign off.',
    },
    {
      q: 'Why write load assumptions on the quote?',
      a:
        'Because the price depends on them. An assumption kept in your head becomes a dispute when the job turns out to need a service upgrade that nobody priced.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        A panel upgrade estimate has to survive two things: the homeowner comparing it to another
        bid, and an inspector checking the work against it. Here’s <strong>how to write an
        electrical estimate</strong> that holds up to both.
      </p>

      <h2>1. Name the job like you’d explain it to an apprentice</h2>
      <p>
        “Swap a 100A panel for 200A service, bring grounding up to code, coordinate the permit.”
        That’s the scope. Everything else is breaking it into priced lines an inspector and a
        homeowner can both follow.
      </p>

      <h2>2. Split panel, breakers, grounding, and labor into separate lines</h2>
      <ul>
        <li><strong>Labor</strong> — panel swap, rewire, permit coordination, priced at your rate.</li>
        <li><strong>Materials</strong> — the panel, breakers, and grounding kit, priced at cost plus markup.</li>
        <li><strong>Permit</strong> — named on its own line, not buried in labor.</li>
      </ul>
      <p>
        A lump-sum “panel upgrade — $1,480” tells the homeowner nothing and gives the inspector
        nothing to check against. Broken out, it’s a document that does both jobs.
      </p>

      <h2>3. Write your load assumptions down, not just in your head</h2>
      <p>
        If an EV charger or a hot tub is on the horizon, say what you assumed today. “Panel sized
        for current load; EV charger circuit quoted separately” is one sentence that prevents an
        argument next spring when the assumption gets tested.
      </p>

      <h2>4. Put your license number on the document</h2>
      <p>
        Half of what a homeowner is buying, especially on electrical work, is the confidence
        you’re the real thing. Your license number on the estimate — not just on the truck — is
        part of what closes the job.
      </p>

      <h2>5. Offer tiers when the job allows it</h2>
      <p>
        Panel upgrades, EV chargers, and remodel rough-ins are exactly the jobs where good-better-
        best works. One tap to show three options beats a phone call explaining the difference
        between them.
      </p>

      <h2>How to write an electrical estimate faster, once the structure’s set</h2>
      <p>
        Toolbelt drafts the panel swap, the EV charger, or the rough-in from a sentence, priced
        from your rates, with the load assumptions and permit line already in place. The Load
        Calc Helper gives you a quick sanity check on your phone before you commit to a number.
      </p>

      <p>
        Free on three real jobs, no card: <a href="/for/electrical">start with Toolbelt for
        electrical</a>. For the software side, see
        <a href="/blog/electrical-estimate-software">electrical estimate software</a>, and for
        how AI fits into this without touching your math,
        <a href="/blog/ai-estimation-software-for-trades">this one covers that</a>.
      </p>
    </>
  );
}
