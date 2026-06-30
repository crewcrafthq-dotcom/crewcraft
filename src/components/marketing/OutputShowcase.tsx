import { Check } from 'lucide-react';

import { TradeTheme } from '@/components/TradeTheme';
import { EstimatePreview } from './EstimatePreview';

const CALLOUTS = [
  'Your logo and license, right up top',
  'Labor and materials, grouped and totaled',
  'A total they can’t misread',
  'Opens clean on their phone — no app, no login',
];

export function OutputShowcase() {
  return (
    <TradeTheme trade="plumbing">
      <section id="output" className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="eyebrow">The estimate they get</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Looks like you hired a designer.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-soft">
              The kind of quote that makes a homeowner trust the number — and you, before you’ve
              even started the job.
            </p>
            <ul className="mt-6 space-y-3">
              {CALLOUTS.map((line) => (
                <li key={line} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-accent-soft text-accent-deep">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-navy">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:pl-6">
            <EstimatePreview trade="plumbing" className="mx-auto w-full max-w-md min-w-0" />
          </div>
        </div>
      </section>
    </TradeTheme>
  );
}
