import { StartFreeButton, TrustLine } from './StartFree';

export function FinalCta() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="rounded-3xl border border-line bg-cream-card p-8 text-center shadow-lift sm:p-12">
        <h2 className="text-3xl font-bold leading-tight text-navy sm:text-4xl">
          Quote the next job before you leave the driveway.
        </h2>
        <p className="mt-3 text-lg text-navy-soft">
          Type it, send it, get back to work. Three free, no card.
        </p>
        <div className="mt-7 flex justify-center">
          <StartFreeButton />
        </div>
        <TrustLine className="mt-4" />
        <p className="mt-6 text-sm font-semibold text-navy-muted">From the Crewcraft crew.</p>
      </div>
    </section>
  );
}
