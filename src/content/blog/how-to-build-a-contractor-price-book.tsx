import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'how-to-build-a-contractor-price-book',
  title: 'How to build a price book you will actually use',
  metaTitle: 'How to Build a Contractor Price Book',
  description:
    'How to build a contractor price book from jobs you already run: what to include, what to leave out, and how to keep it current without a spreadsheet night.',
  published: '2026-09-07',
  readingMinutes: 6,
  topic: 'Pricing',
};

export function Body() {
  return (
    <>
      <p>
        Most contractors already have a price book. It lives in their head, it changes depending
        on how the day went, and it cannot be handed to anyone else. Writing it down is the single
        highest-leverage admin job in a small trade business — and it does not take a weekend.
      </p>

      <h2>Start from the jobs you already do</h2>
      <p>
        Do not try to price your whole trade. Pull your last twenty invoices and find the repeats.
        Almost every shop finds that fifteen to twenty line items cover 80% of the work: a water
        heater swap, a condenser changeout, a panel swap, a service call, a diagnostic fee.
      </p>
      <p>Those repeats are your price book. Everything else can stay custom.</p>

      <h2>What each entry needs</h2>
      <ul>
        <li>
          <strong>A name a customer would recognise</strong> — “Replace 40-gal gas water heater,”
          not “WH-40-G.”
        </li>
        <li>
          <strong>The unit</strong> — each, hour, square, linear foot. Mixing units is how totals
          go wrong.
        </li>
        <li>
          <strong>Your price, not your cost</strong> — the number that already carries your markup.
        </li>
        <li>
          <strong>What it includes</strong> — haul-off, permit, the first hour of labour. This is
          the line that prevents arguments later.
        </li>
      </ul>

      <h2>What to leave out</h2>
      <p>
        Anything you price once a year. Anything where the real cost swings more than 30% job to
        job. Anything you would have to look up anyway. A price book padded with rarely-used
        entries stops being a shortcut and becomes another thing to maintain.
      </p>

      <h2>Separate the material from the labour</h2>
      <p>
        Copper moves. Equipment moves. Your labour rate does not move nearly as fast. If the two
        are baked into one number, a supplier price rise silently eats your margin on every job
        until someone notices. Split them, and you only have to update one side.
      </p>

      <h2>Keeping it current without a spreadsheet night</h2>
      <h3>Update on contact, not on schedule</h3>
      <p>
        Nobody sits down in January to review 60 prices. But when the supply house quotes you a
        new number on a Tuesday, that is the moment to change the entry — it takes fifteen
        seconds and it is the only review that ever actually happens.
      </p>
      <h3>Review the top ten quarterly</h3>
      <p>
        The handful of items you sell weekly deserve four checks a year. The long tail can drift.
      </p>
      <h3>Watch what you keep overriding</h3>
      <p>
        If you change the same entry on every estimate, the entry is wrong. That is not
        discipline, it is a signal.
      </p>

      <h2>The part most people miss</h2>
      <p>
        A price book is also a training tool. The day you put a second person in a van, the
        difference between a business and a busy person is whether your prices exist outside your
        head. It is also what lets you take a week off without the quoting stopping.
      </p>

      <h2>Where Toolbelt fits</h2>
      <p>
        Toolbelt’s Price Book holds your real rates and materials, and the AI prices every draft
        estimate from them — so the book is not a document you consult, it is the thing doing the
        quoting. Three free estimates to try it against a job you have already priced by hand.
      </p>

      <p>
        Pair this with{' '}
        <a href="/blog/how-much-should-a-contractor-charge-per-hour">
          setting your hourly rate
        </a>{' '}
        and <a href="/blog/markup-vs-margin-for-contractors">markup vs margin</a>, which together
        decide every number in the book.
      </p>
    </>
  );
}
