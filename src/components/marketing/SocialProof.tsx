import { StartFreeButton } from './StartFree';

/**
 * No fabricated testimonial wall — the product is new and this audience can
 * smell fake reviews a mile off. A plain-spoken founder note converts better
 * with the trades than invented five-star quotes, and it's true.
 */
export function SocialProof() {
  return (
    <section className="bg-night-850">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold leading-tight text-mist sm:text-4xl">
            No fake five-star wall. Just the work.
          </h2>

          <div className="mt-10 rounded-3xl border border-hairline bg-night-800 p-7 shadow-card sm:p-10">
            <p className="text-lg leading-relaxed text-mist-soft">
              We&rsquo;re new, and we&rsquo;re not going to pretend otherwise with made-up reviews.
              Here&rsquo;s what&rsquo;s true instead: Crewcraft started by writing AI estimate
              prompts for HVAC, plumbing, electrical, and roofing contractors — guys who were
              quoting jobs at the kitchen table at 11pm. Toolbelt is that work turned into an app
              that does it for you.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-mist-soft">
              So judge it the way you&rsquo;d judge a new sub on the crew:{' '}
              <span className="font-semibold text-mist">by the work, not the pitch.</span> Three
              estimates are free — type a real job from this week and look at what comes back.
            </p>
            <p className="mt-6 text-sm font-semibold text-mist">
              — Stefan
              <span className="font-normal text-mist-mute"> · founder, Crewcraft</span>
            </p>
          </div>

          {/* CTA sits right next to the honesty, not in a silo */}
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-night-800 p-6 text-center shadow-card sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-lg font-bold text-mist">Your estimate&rsquo;s next.</p>
              <p className="text-sm text-mist-soft">Under a minute, start to send. Three free, no card.</p>
            </div>
            <StartFreeButton size="md" className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
