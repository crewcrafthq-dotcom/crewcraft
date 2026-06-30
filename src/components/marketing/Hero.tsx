import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

import { BeforeAfter } from './BeforeAfter';
import { StartFreeButton, TrustLine } from './StartFree';
import { ToolbeltLockup } from './ToolbeltLockup';

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <nav className="flex items-center justify-between py-5">
          <ToolbeltLockup />
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-navy-soft transition hover:text-navy"
          >
            Log in
          </Link>
        </nav>

        <div className="grid items-center gap-10 pb-14 pt-4 lg:grid-cols-2 lg:gap-14 lg:pb-24 lg:pt-10">
          <div className="animate-fade-up">
            <p className="eyebrow">For HVAC · Plumbing · Electrical · Roofing</p>
            <h1 className="mt-3 text-[2.15rem] font-bold leading-[1.06] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
              Type the job. Get a branded estimate in under a minute.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-soft">
              Toolbelt kills the after-hours paperwork. The quote’s written, totaled, and ready to
              send before you leave the driveway.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <StartFreeButton />
              <Link
                href="#demo"
                className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-cream-card px-6 font-semibold text-navy shadow-sm transition duration-150 hover:bg-cream-deep"
              >
                <PlayCircle className="h-5 w-5" />
                Watch the 15-second demo
              </Link>
            </div>
            <TrustLine className="mt-4" />
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <BeforeAfter trade="hvac" />
          </div>
        </div>
      </div>
    </section>
  );
}
