import { ChevronDown } from 'lucide-react';
import { FAQ } from '@/lib/marketing';

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h2 className="text-center text-3xl font-bold leading-tight text-navy sm:text-4xl">
        Straight answers.
      </h2>

      <div className="mt-8 space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-line bg-cream-card p-5 shadow-card"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-navy [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown className="h-5 w-5 flex-none text-navy-muted transition duration-200 group-open:rotate-180" />
            </summary>
            <p className="mt-3 leading-relaxed text-navy-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
