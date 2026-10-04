import { ToolIcon } from '@/components/ToolIcon';
import { APP_LINEUP, extraTradeTools, LIVE_TOOL_COUNT } from '@/lib/marketing';
import { StartFreeButton } from './StartFree';

export function AppLineup() {
  const [flagship, ...rest] = APP_LINEUP.filter((a) => a.status === 'live');
  const next = APP_LINEUP.filter((a) => a.status !== 'live');

  return (
    <section id="apps" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="eyebrow">What’s on the belt</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {LIVE_TOOL_COUNT} live tools. One flat price.
        </h2>
        <p className="mt-3 text-lg text-ink-soft">
          Apps you use and automations that run for you — the paperwork side of the business,
          covered end to end, plus tools built for your specific trade (see your trade’s belt
          above). One subscription covers all of it, current and future.
        </p>
      </div>

      {/* flagship */}
      <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-hairline bg-paper-800 p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-accent text-accent-fg shadow-accent">
            <ToolIcon icon={flagship.icon} className="h-7 w-7" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-ink">{flagship.name}</h3>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent-bright">
                Live now
              </span>
            </div>
            <p className="mt-1 text-ink-soft">{flagship.tagline}</p>
          </div>
        </div>
        <StartFreeButton size="md" className="w-full sm:w-auto" />
      </div>

      {/* the rest of the live belt */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((tool) => (
          <div key={tool.name} className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent-bright">
                <ToolIcon icon={tool.icon} className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent-bright">
                Live now
              </span>
            </div>
            <h3 className="mt-4 font-bold text-ink">{tool.name}</h3>
            <p className="mt-1 text-sm text-ink-soft">{tool.tagline}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
              {tool.kind === 'automation' ? 'Automation — runs for you' : 'App — you drive it'}
            </p>
          </div>
        ))}
      </div>

      {/* coming next */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {next.map((tool) => (
          <div key={tool.name} className="rounded-2xl border border-dashed border-hairline bg-paper-800/60 p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper-700 text-ink-mute">
                <ToolIcon icon={tool.icon} className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-paper-700 px-2 py-0.5 text-xs font-semibold text-ink-mute">
                Coming next
              </span>
            </div>
            <h3 className="mt-4 font-bold text-ink-soft">{tool.name}</h3>
            <p className="mt-1 text-sm text-ink-mute">{tool.tagline}</p>
          </div>
        ))}
      </div>

      {/* Derived, so it can't drift from the belt: this list was four tools
          short and named Supplement Drafter twice (it's carded above). */}
      <p className="mt-6 text-sm text-ink-mute">
        Plus trade tools live today: {extraTradeTools().map((t) => t.name).join(', ')} — every one
        included in every paid plan.
      </p>
    </section>
  );
}
