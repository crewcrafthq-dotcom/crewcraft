import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'stop-doing-estimates-after-hours',
  title: 'How to stop doing estimates after hours, for good',
  metaTitle: 'Stop Doing Estimates After Hours',
  description:
    'How to stop doing estimates after hours without falling behind — the real reasons it happens, and the specific habit change that actually fixes it.',
  published: '2026-08-29',
  readingMinutes: 6,
  topic: 'FAQ',
  faq: [
    {
      q: 'Why do contractors end up writing estimates at night?',
      a:
        'Because the quote is postponed at the job, where all the information is, and reconstructed later from memory at the kitchen table. The evening is where the deferred work lands, not where it starts.',
    },
    {
      q: 'Isn\'t an estimate written on site sloppier?',
      a:
        'Generally the opposite. Written while you are still looking at the job it reflects what is actually there, whereas the version typed at 9pm is assembled from notes and recollection.',
    },
    {
      q: 'What actually breaks the after-hours habit?',
      a:
        'Writing and sending the quote before you leave the driveway. Deciding to “be more disciplined” does not survive a bad day; removing the step that has to happen later does.',
    },
  ],
};

export function Body() {
  return (
    <>
      <p>
        The job ends at five. The paperwork doesn’t. If you want to know
        <strong>how to stop doing estimates after hours</strong>, here are the actual questions
        that come up when contractors try to fix this — and straight answers to each.
      </p>

      <h2>Why do estimates keep ending up in the evening in the first place?</h2>
      <p>
        Because writing one takes real focus, and a job site doesn’t give you real focus between
        calls. So it gets pushed to “tonight, after dinner,” which becomes 9 PM, tired, doing math
        from memory. It’s not a discipline problem — it’s that the tool you’re using requires
        quiet time you don’t have during the day.
      </p>

      <h2>If I write it on-site instead, won’t it be sloppier?</h2>
      <p>
        The opposite, usually. On-site, the job is right in front of you — you’re not
        reconstructing what you saw eight hours ago from a mental note. The estimates that are
        actually sloppy are the ones written from memory at the end of a long day.
      </p>

      <h2>What’s the one change that actually breaks the habit?</h2>
      <p>
        Write the estimate before you leave the job, not after you get home. That’s the entire
        fix. Everything else — better software, a template, dictation instead of typing — exists
        to make that one habit change realistic instead of aspirational.
      </p>

      <h2>What if the job’s complicated and needs more thought?</h2>
      <p>
        Draft it on-site, even messy, and clean it up later if you need to — but get the line
        items and rough numbers down while you’re standing there. A rough draft written on-site
        beats a polished one written from memory that misses two items you forgot by evening.
      </p>

      <h2>Doesn’t this just move the work, not remove it?</h2>
      <p>
        It moves it to when it’s fastest, which is the difference between fifteen minutes on-site
        and forty-five minutes at night reconstructing details and doing math you’re too tired to
        trust. Same work, much less of it, done at the moment it’s cheapest to do.
      </p>

      <h2>How does software actually help versus just deciding to change the habit?</h2>
      <p>
        Willpower alone doesn’t survive a busy week. Software that drafts line items from a
        sentence, prices them from your own rates, and lets you send from the same screen removes
        the friction that made “I’ll do it tonight” the easier choice in the first place.
      </p>

      <h2>How Toolbelt helps you stop doing estimates after hours</h2>
      <p>
        Type or dictate the job on-site, check the priced draft, send an e-signable link with a
        deposit button — all from the truck, all before you drive to the next call. Three free
        estimates, no card, to test the habit change on real jobs this week.
      </p>

      <p>
        <a href="/#try">Try it on the homepage</a> now, or read
        <a href="/blog/estimates-from-the-truck">what a full morning of this actually looks
        like</a>. If Excel is your current system,
        <a href="/blog/estimate-software-vs-excel-for-contractors">this one’s the honest
        comparison</a>.
      </p>
    </>
  );
}
