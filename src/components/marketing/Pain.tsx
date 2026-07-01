import { Clock4, FileWarning, MoonStar } from 'lucide-react';

const ITEMS = [
  { icon: MoonStar, title: 'Nights and weekends', body: 'Quotes written up after dinner, again.' },
  { icon: FileWarning, title: 'Half-finished estimates', body: 'Sitting in your notes app, never sent.' },
  { icon: Clock4, title: 'Follow-ups that slip', body: 'And jobs that quietly go cold.' },
];

export function Pain() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <h2 className="max-w-2xl text-3xl font-bold leading-tight text-mist sm:text-4xl">
        The job ends at five. The paperwork doesn’t.
      </h2>
      <p className="mt-3 max-w-xl text-lg text-mist-soft">
        The work you got paid for is already done. This is the part that steals your evenings.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="rounded-2xl border border-hairline bg-night-800 p-5 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-night-700 text-mist-soft">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-bold text-mist">{it.title}</h3>
              <p className="mt-1 text-sm text-mist-soft">{it.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
