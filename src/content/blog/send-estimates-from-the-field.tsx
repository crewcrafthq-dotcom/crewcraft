import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'send-estimates-from-the-field',
  title: 'How to send estimates from the field without a laptop or an office stop',
  metaTitle: 'Send Estimates From the Field',
  description:
    'How to send estimates from the field on your phone — the exact workflow that skips the office stop, from job description to signed quote in one visit.',
  published: '2026-08-29',
  readingMinutes: 6,
  topic: 'Workflow',
  faq: [
    {
      q: 'Can you send an estimate without a laptop?',
      a:
        'Yes — describe the job the way you would say it, check the numbers rather than building them from zero, and send from the same screen. The whole sequence works standing up, one-handed.',
    },
    {
      q: 'What does “I\'ll email it tonight” actually cost?',
      a:
        'The jobs where someone else quoted first. Urgency fades once the homeowner is no longer standing next to the problem, and a quote that arrives days later competes against ones that did not wait.',
    },
    {
      q: 'Is it faster to photograph the job than describe it?',
      a:
        'Often, yes. When the situation is quicker to show than to write, photos replace typing and the draft comes back from the pictures instead.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        The job’s done, the customer’s standing there, and you’re deciding between “I’ll get you
        a number tomorrow” and actually finishing this right now. Here’s how to
        <strong>send estimates from the field</strong> so tomorrow never has to happen.
      </p>

      <h2>Why “I’ll email it tonight” costs you jobs</h2>
      <p>
        Every hour between the visit and the quote is an hour the homeowner spends thinking about
        the other bids, or forgetting about yours entirely. The contractor who sends a
        professional number before leaving the driveway is playing a different game than the one
        who promises to follow up.
      </p>

      <h2>The workflow that actually works standing up</h2>
      <h3>1. Describe the job the way you’d say it, not the way you’d type a report</h3>
      <p>
        “3-ton condenser and coil, reconnect the lineset, haul off the old unit.” One sentence,
        typed or dictated. This isn’t the place for paragraphs — the software’s job is to expand
        it, not yours to write it out.
      </p>
      <h3>2. Check the numbers, don’t build them from zero</h3>
      <p>
        If the tool prices from your saved rates, checking a draft takes twenty seconds. Building
        every line from a blank template on a phone screen takes ten minutes you don’t have.
      </p>
      <h3>3. Send from the same screen, not a different app</h3>
      <p>
        The moment you have to export a PDF, open email, attach it, and type a message, you’ve
        added three chances to get distracted and finish it later instead of now.
      </p>

      <h2>What “later” actually costs</h2>
      <p>
        A quote sent that night, from memory, after a full day, is where prices get guessed and
        line items get forgotten. Sending from the field isn’t just about speed — it’s about
        writing the estimate while the job is fresh instead of reconstructing it at 9 PM.
      </p>

      <h2>Photos instead of typing, when that’s faster</h2>
      <p>
        For a data plate, a panel, or a roof section, a photo is faster than a sentence and more
        accurate than memory. Software that reads the photo and drafts from it removes the last
        excuse to put the quote off until you’re home.
      </p>

      <h2>Software built to send estimates from the field</h2>
      <p>
        Toolbelt is built to be used standing in a driveway with one thumb: describe the job or
        snap a photo, check the priced draft, and send a link the customer can e-sign and pay a
        deposit on — all before you’re back in the truck.
      </p>

      <p>
        Try the whole flow on a real job: <a href="/#try">the homepage demo</a> needs no account.
        For what that actually looks like on a busy morning,
        <a href="/blog/estimates-from-the-truck">estimates from the truck</a> walks through it,
        and if evenings are still where your estimates happen,
        <a href="/blog/stop-doing-estimates-after-hours">this one’s about breaking that habit</a>.
      </p>
    </>
  );
}
