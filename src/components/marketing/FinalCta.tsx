import { StartFreeButton, TrustLine } from './StartFree';

export function FinalCta() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="relative rounded-3xl border border-hairline bg-paper-800 p-8 text-center shadow-lift sm:p-12">
        <div aria-hidden className="hazard absolute inset-x-0 top-0 h-1.5 rounded-t-3xl opacity-80" />
        <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Put the whole belt on before the next job.
        </h2>
        <p className="mt-3 text-lg text-ink-soft">
          Quote it, e-sign it, invoice it, get paid — starting with three free estimates, no card.
        </p>
        <div className="mt-7 flex justify-center">
          <StartFreeButton />
        </div>
        <TrustLine className="mt-4" />
      </div>
    </section>
  );
}
