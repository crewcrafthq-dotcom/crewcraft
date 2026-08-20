import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'why-homeowners-ghost-estimates',
  title: 'Why homeowners ghost your estimates — and the follow-up that fixes it',
  description:
    'Silence after a quote usually isn’t a no. What’s actually happening on the homeowner’s side, and a simple two-touch follow-up that recovers stalled jobs.',
  published: '2026-08-20',
  readingMinutes: 5,
  topic: 'Winning work',
};

export function Body() {
  return (
    <>
      <p>
        You measured the job, talked through the options, sent a fair number — then nothing. No
        yes, no no, no reply. Every contractor knows the ghost. The mistake is reading silence as
        rejection. Most of the time it&rsquo;s something far less dramatic, and far more fixable.
      </p>

      <h2>What silence usually means</h2>
      <ul>
        <li>
          <strong>Life happened.</strong> Your estimate arrived between a work crisis and a kid&rsquo;s
          practice. It&rsquo;s not declined — it&rsquo;s buried under forty other emails.
        </li>
        <li>
          <strong>They&rsquo;re waiting on the other quotes.</strong> Homeowners collect two or three
          bids and then stall, because comparing them is homework nobody wants to do.
        </li>
        <li>
          <strong>They have a question they feel dumb asking.</strong> &ldquo;What does
          &lsquo;R&amp;R&rsquo; mean?&rdquo; &ldquo;Is the permit extra?&rdquo; Rather than ask, people
          freeze.
        </li>
        <li>
          <strong>The next step isn&rsquo;t obvious.</strong> If accepting means &ldquo;call him back,
          discuss, figure out payment&rdquo; — that&rsquo;s three chores. Chores get postponed.
        </li>
      </ul>
      <p>
        Notice: none of these mean no. They mean <em>stalled</em>. And stalled jobs go to whichever
        contractor makes restarting easiest.
      </p>

      <h2>Remove the reasons before you send</h2>
      <p>
        Half of follow-up is not needing it. An estimate written in plain English kills the
        embarrassing-question stall. Itemized lines kill the comparison stall — yours becomes the
        reference the others get compared against. And a link where they can{' '}
        <strong>accept, sign, and pay the deposit in one sitting</strong> kills the
        three-chores stall: the moment of &ldquo;fine, let&rsquo;s do it&rdquo; becomes a
        30-second action instead of a phone call they&rsquo;ll make &ldquo;tomorrow.&rdquo;
      </p>

      <h2>The two-touch follow-up</h2>
      <p>
        Keep it short, keep it kind, and stop after two. You&rsquo;re jogging a memory, not
        applying pressure.
      </p>
      <h3>Touch one — day 3</h3>
      <blockquote>
        &ldquo;Hi Sarah — wanted to make sure the estimate for the water heater came through okay.
        Happy to answer anything, and if you&rsquo;d like I can hold next Tuesday for the install.
        — Mike&rdquo;
      </blockquote>
      <p>
        The soft scheduling offer matters: it converts &ldquo;should we do this?&rdquo; into
        &ldquo;does Tuesday work?&rdquo;
      </p>
      <h3>Touch two — day 7 to 10</h3>
      <blockquote>
        &ldquo;Hi Sarah — closing out my quotes for the month. If the timing&rsquo;s not right, no
        problem at all — just let me know either way so I can plan the schedule. Estimate&rsquo;s
        valid through the 15th.&rdquo;
      </blockquote>
      <p>
        A polite deadline plus explicit permission to say no. People who were drifting decide;
        people who were embarrassed to decline get a graceful exit — and tell their neighbor about
        the pro who handled it well.
      </p>

      <h2>Make it automatic, because you won&rsquo;t do it manually</h2>
      <p>
        Nobody gets into the trades to manage a reminders spreadsheet. On a busy week, follow-ups
        are the first thing dropped — which is exactly backwards, since they&rsquo;re the cheapest
        revenue you have: the work is done, the customer already met you, and the estimate is
        already written. This is a job for software: <a href="/">Toolbelt&rsquo;s follow-up
        engine</a> nudges quiet estimates for you (politely, capped at two) and tells you when the
        customer opens the quote — so &ldquo;did they even see it?&rdquo; stops being a mystery.
      </p>

      <p>
        Ghosting isn&rsquo;t a character flaw in your customers. It&rsquo;s friction. Sand it down
        — plain language, one-click acceptance, two respectful nudges — and a surprising share of
        your &ldquo;lost&rdquo; estimates turn out to have been sitting there waiting to be won.
      </p>
    </>
  );
}
