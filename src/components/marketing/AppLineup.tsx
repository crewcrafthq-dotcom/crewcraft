import { ClipboardList, FileText, Mic, Send, Star } from 'lucide-react';

import { cn } from '@/lib/cn';
import { APP_LINEUP, type ToolItem } from '@/lib/marketing';
import { StartFreeButton } from './StartFree';

const ICONS: Record<ToolItem['icon'], React.ComponentType<{ className?: string }>> = {
  estimates: FileText,
  voice: Mic,
  supplements: ClipboardList,
  followup: Send,
  reviews: Star,
};

export function AppLineup() {
  const flagship = APP_LINEUP.find((a) => a.status === 'live')!;
  const next = APP_LINEUP.filter((a) => a.status === 'next');
  const FlagIcon = ICONS[flagship.icon];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">What’s on the belt</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-mist sm:text-4xl">
          One tool today. More coming.
        </h2>
        <p className="mt-3 text-lg text-mist-soft">
          Each app is a tool on the belt, built to kill the same paperwork — and marked honestly so
          you know what’s ready.
        </p>
      </div>

      {/* flagship */}
      <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-hairline bg-night-800 p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-accent text-accent-fg shadow-accent">
            <FlagIcon className="h-7 w-7" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-mist">{flagship.name}</h3>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent-bright">
                Live now
              </span>
            </div>
            <p className="mt-1 text-mist-soft">{flagship.tagline}</p>
          </div>
        </div>
        <StartFreeButton size="md" label="Start free" className="w-full sm:w-auto" />
      </div>

      {/* coming next */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {next.map((tool) => {
          const Icon = ICONS[tool.icon];
          return (
            <div
              key={tool.name}
              className={cn(
                'rounded-2xl border border-dashed border-hairline bg-night-800/60 p-5',
              )}
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-night-700 text-mist-mute">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-night-700 px-2 py-0.5 text-xs font-semibold text-mist-mute">
                  Coming next
                </span>
              </div>
              <h3 className="mt-4 font-bold text-mist-soft">{tool.name}</h3>
              <p className="mt-1 text-sm text-mist-mute">{tool.tagline}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
