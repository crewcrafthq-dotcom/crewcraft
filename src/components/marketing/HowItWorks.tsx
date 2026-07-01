import { PenLine, Send, Wand2 } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    icon: PenLine,
    title: 'Type the job',
    body: 'Plain English, like you’d tell your apprentice. A sentence or two is plenty.',
  },
  {
    icon: Wand2,
    title: 'It builds the estimate',
    body: 'Labor, materials, scope, and assumptions — split out and totaled. Edit any line.',
  },
  {
    icon: Send,
    title: 'Send it',
    body: 'A branded PDF or a phone-friendly link. Looks like you hired a designer.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <p className="eyebrow">How it works</p>
      <h2 className="mt-2 text-3xl font-bold leading-tight text-mist sm:text-4xl">
        Three steps. Under a minute.
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative rounded-2xl border border-hairline bg-night-800 p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm font-bold text-accent-fg">
                  {i + 1}
                </span>
                <Icon className="h-5 w-5 text-mist-mute" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-mist">{step.title}</h3>
              <p className="mt-1.5 text-mist-soft">{step.body}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2.5 rounded-2xl border border-hairline bg-night-850 px-5 py-4 text-center">
        <ShieldCheck className="h-5 w-5 flex-none text-mist-soft" />
        <p className="font-semibold text-mist">
          Prices are suggestions you control. You own the final number.
        </p>
      </div>
    </section>
  );
}
