import { StatCounter } from './StatCounter';

// Honest, product-true numbers — not fabricated user counts.
const STATS = [
  { value: 14, suffix: '', label: 'live tools on the belt' },
  { value: 60, suffix: 's', label: 'to a finished estimate' },
  { value: 4, suffix: '', label: 'trades supported' },
  { value: 3, suffix: '', label: 'free estimates to start' },
];

export function Stats() {
  return (
    <section className="mx-auto -mt-4 max-w-6xl px-5 sm:px-6">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-paper-900 px-6 py-8 text-center">
            <p className="text-4xl font-extrabold tracking-tight text-ink">
              <StatCounter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1.5 text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
