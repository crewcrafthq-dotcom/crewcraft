import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'hiring-your-first-employee-in-the-trades',
  title: 'Hiring your first employee without blowing up the business',
  metaTitle: 'Hiring Your First Trades Employee',
  description:
    'Hiring your first employee in the trades: what they really cost, when you can afford one, who to hire first, and the systems to have ready before day one.',
  published: '2026-10-20',
  readingMinutes: 7,
  topic: 'Operations',
};

export function Body() {
  return (
    <>
      <p>
        The first hire is the point where a busy tradesperson becomes a business, and it is also
        where a lot of profitable one-person operations quietly become unprofitable two-person
        ones. The difference is almost entirely preparation.
      </p>

      <h2>What an employee actually costs</h2>
      <p>
        The wage is not the cost. Add payroll taxes, workers’ compensation (which in the trades
        can be a serious percentage), general liability loading, a vehicle or a seat in yours,
        tools, phone, training time, and the hours of yours they consume in the first months.
      </p>
      <p>
        A reasonable planning figure is <strong>1.25 to 1.4 times the wage</strong>. A $25/hour
        helper costs somewhere around $32 to $35 an hour to employ, before they have been
        productive for a single minute.
      </p>

      <h2>When you can afford one</h2>
      <p>Three signals together, not one alone:</p>
      <ul>
        <li>
          <strong>You are consistently turning down work</strong> — not busy for a season, turning
          away jobs for months.
        </li>
        <li>
          <strong>You have a cash buffer</strong> covering three months of their fully-loaded
          cost. They will not be profitable immediately.
        </li>
        <li>
          <strong>Your prices work.</strong> Hiring into thin margins multiplies the thin margin.
          If you are not sure, do the{' '}
          <a href="/blog/job-costing-for-contractors">job costing</a> first.
        </li>
      </ul>

      <h2>Who to hire first</h2>
      <p>
        The instinct is another technician. Often the better first hire is the one that frees up
        <em> your</em> most expensive hours.
      </p>
      <ul>
        <li>
          <strong>A helper or apprentice</strong> — doubles your output on two-person jobs, cheap,
          and you train them to your standard.
        </li>
        <li>
          <strong>Part-time admin</strong> — if you are losing evenings to quoting, invoicing and
          phone calls, ten hours a week here can return more margin than another van.
        </li>
        <li>
          <strong>An experienced technician</strong> — the fastest capacity increase and the
          highest risk. They arrive with habits, and they can work unsupervised only if your
          standards exist outside your head.
        </li>
      </ul>

      <h2>Have these ready before day one</h2>
      <ul>
        <li>
          <strong>Workers’ comp in place.</strong> Not pending. Day one.
        </li>
        <li>
          <strong>Payroll set up</strong> — properly. Misclassifying an employee as a contractor
          to avoid this is the single most expensive shortcut in the trades.
        </li>
        <li>
          <strong>Your prices written down.</strong> A price book is how someone else quotes the
          way you would.
        </li>
        <li>
          <strong>A schedule they can see</strong> without ringing you.
        </li>
        <li>
          <strong>A written standard for what finished looks like</strong> — including cleanup,
          which is what customers actually notice.
        </li>
      </ul>

      <h2>The first ninety days</h2>
      <p>
        Expect them to cost more than they earn. Keep them with you rather than sending them out
        alone, correct small things immediately and specifically, and check in weekly. Most bad
        first hires are not bad people — they are people who were never told precisely what good
        looked like.
      </p>

      <h2>Systems before people</h2>
      <p>
        Everything you only know by heart becomes a bottleneck the moment someone else needs it.
        Toolbelt puts the prices, the quotes, the customer history and the schedule in one place a
        second person can actually use — which is most of what makes a first hire work. Three free
        estimates, no card.
      </p>

      <p>
        See also{' '}
        <a href="/blog/how-to-build-a-contractor-price-book">building a price book</a>,{' '}
        <a href="/blog/contractor-insurance-explained">contractor insurance</a>, and{' '}
        <a href="/blog/scheduling-software-for-contractors">scheduling for small crews</a>.
      </p>
    </>
  );
}
