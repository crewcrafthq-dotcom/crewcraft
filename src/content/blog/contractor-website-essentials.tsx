import type { PostMeta } from './types';

export const meta: PostMeta = {
  slug: 'contractor-website-essentials',
  title: 'What a contractor website actually needs',
  metaTitle: 'Contractor Website Essentials',
  description:
    'What a contractor website actually needs: the pages that convert, what belongs above the fold, and the expensive extras that change nothing at all.',
  published: '2026-09-26',
  readingMinutes: 6,
  topic: 'Growth',
};

export function Body() {
  return (
    <>
      <p>
        A contractor website has one job: turn someone who is already interested into a phone
        call. It is not a brochure, and it is almost never the thing that found them — that was
        Google, a neighbour, or your van. By the time they are reading, they are checking whether
        you are real.
      </p>

      <h2>Above the fold, on a phone</h2>
      <p>Four things, visible without scrolling, on a 390px screen:</p>
      <ul>
        <li>What you do and where. “Licensed plumber serving Boulder County.”</li>
        <li>Your phone number, as a tappable link.</li>
        <li>One trust signal — licence number, years in business, review count.</li>
        <li>A button that does something: call, or request a quote.</li>
      </ul>
      <p>
        Most visitors never scroll past this. If it is a stock photo and the word “Welcome,” the
        rest of the site does not matter.
      </p>

      <h2>The pages that earn their place</h2>
      <h3>Home</h3>
      <p>The above-the-fold block, services, service area, reviews, call to action. Done.</p>
      <h3>One page per core service</h3>
      <p>
        This is where search traffic actually lands. “Water heater replacement in Boulder” is a
        page, not a bullet on a list. Three or four of these out-earn a twenty-page site every
        time.
      </p>
      <h3>About</h3>
      <p>
        Read more than contractors expect, because people want to know who is coming to their
        house. A real photo of you and the van beats any amount of copy.
      </p>
      <h3>Reviews</h3>
      <p>Pulled from Google, not retyped. Retyped testimonials read as invented, because many are.</p>
      <h3>Contact</h3>
      <p>Phone, email, service area, hours, and a short form. Not a form alone.</p>

      <h2>The expensive extras that change nothing</h2>
      <ul>
        <li>
          <strong>A gallery of 200 photos.</strong> Nobody scrolls it. Twelve good ones is more
          persuasive.
        </li>
        <li>
          <strong>A blog nobody updates.</strong> Three posts from 2023 signals a business that
          may not exist.
        </li>
        <li>
          <strong>Animation and sliders.</strong> They slow the page, and speed is a ranking
          factor and a conversion factor.
        </li>
        <li>
          <strong>Live chat</strong> nobody staffs.
        </li>
      </ul>

      <h2>The two things that matter technically</h2>
      <p>
        <strong>Speed</strong> — most visits are on a phone on mobile data, and a slow site loses
        people before it says anything. <strong>Matching details</strong> — your name, address and
        phone must match your Google Business Profile exactly, or you weaken the listing that is
        doing most of the work.
      </p>

      <h2>Where the real leverage is</h2>
      <p>
        For most trade businesses the Google Business Profile out-performs the website by a wide
        margin. Get the profile right first; the site’s job is to confirm what the profile already
        convinced them of, and to let them contact you without thinking.
      </p>

      <p>
        See{' '}
        <a href="/blog/google-business-profile-for-contractors">
          your Google Business Profile
        </a>{' '}
        and <a href="/blog/how-to-get-more-contractor-leads">getting more leads</a>.
      </p>
    </>
  );
}
