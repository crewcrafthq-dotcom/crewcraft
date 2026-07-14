import { ArrowRight, Check } from 'lucide-react';

import { createEstimateFromPreset } from '@/app/apps/actions';
import { cn } from '@/lib/cn';
import { presetSubtotal, type QuotePreset } from '@/lib/app-presets';
import { money } from '@/lib/format';

/**
 * The good/better/best preset grid shared by the preset-driven apps. Each card
 * is a form posting to a server action that creates the draft estimate — no
 * client JS needed, works great on a phone in a garage.
 */
export function PresetPicker({ presets, featured }: { presets: QuotePreset[]; featured?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {presets.map((p) => {
        const isFeatured = p.id === featured;
        return (
          <div
            key={p.id}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-paper-800 p-5 shadow-card',
              isFeatured ? 'border-accent ring-1 ring-accent/30' : 'border-hairline',
            )}
          >
            {isFeatured ? (
              <div aria-hidden className="hazard absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-80" />
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-bright">{p.tier}</p>
            <h2 className="mt-1 font-bold text-ink">{p.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{p.blurb}</p>

            <ul className="mt-4 flex-1 space-y-1.5">
              {p.lines.map((l) => (
                <li key={l.description} className="flex items-start gap-2 text-xs text-ink-soft">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-accent-bright" />
                  <span className="min-w-0">{l.description}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-ink-mute">
              Starts at{' '}
              <span className="text-lg font-bold text-ink">{money(presetSubtotal(p))}</span>
              <span className="text-xs"> + tax · every line editable</span>
            </p>

            <form action={createEstimateFromPreset.bind(null, p.id)} className="mt-4">
              <button
                type="submit"
                className={cn(
                  'inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition',
                  isFeatured
                    ? 'bg-accent text-accent-fg shadow-accent hover:brightness-110'
                    : 'border border-hairline-strong bg-paper-800 text-ink hover:bg-paper-750',
                )}
              >
                Use this quote
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
