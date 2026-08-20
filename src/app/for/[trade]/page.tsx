import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

import { StartFreeButton, TrustLine } from '@/components/marketing/StartFree';
import { EstimatePreview } from '@/components/marketing/EstimatePreview';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { ToolbeltLockup } from '@/components/marketing/ToolbeltLockup';
import { ToolIcon } from '@/components/ToolIcon';
import { TradeIcon } from '@/components/TradeIcon';
import { TradeTheme } from '@/components/TradeTheme';
import { BLOG_POSTS } from '@/content/blog';
import { shortDate } from '@/lib/format';
import { TRADE_PAGES, TRADE_SECTIONS } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import { TRADES, type Trade } from '@/lib/types';

/**
 * Standalone per-trade landing pages (/for/hvac, /for/plumbing, …) — the
 * indexable, linkable big-brother of the homepage trade sections. Static,
 * public, one route, four genuinely different pages driven by TRADE_PAGES.
 */

export function generateStaticParams() {
  return TRADES.map((trade) => ({ trade }));
}

export function generateMetadata({ params }: { params: { trade: string } }): Metadata {
  const page = TRADE_PAGES[params.trade as Trade];
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/for/${params.trade}` },
    robots: { index: true, follow: true },
  };
}

export default function TradePage({ params }: { params: { trade: string } }) {
  const trade = params.trade as Trade;
  if (!TRADES.includes(trade)) notFound();

  const page = TRADE_PAGES[trade];
  const section = TRADE_SECTIONS[trade];
  const theme = getTheme(trade);
  const others = TRADES.filter((t) => t !== trade);
  // This trade's Field Guide articles plus the all-trades ones — internal
  // links both ways (guide posts link back here via their trade tag).
  const guides = BLOG_POSTS.filter(({ meta }) => !meta.trade || meta.trade === trade).slice(0, 3);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <TradeTheme trade={trade}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="overflow-x-hidden">
        {/* slim header — logo home, login, one CTA */}
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-6">
          <Link href="/" aria-label="Toolbelt by Crewcraft — home">
            <ToolbeltLockup />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              Log in
            </Link>
            <StartFreeButton size="md" label="Start free" withArrow={false} />
          </div>
        </header>

        {/* hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pb-20">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <TradeIcon trade={trade} className="h-4 w-4" />
              Toolbelt for {theme.label} contractors
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{page.intro}</p>
            <div className="mt-7">
              <StartFreeButton />
            </div>
            <TrustLine className="mt-4" />
          </div>
          <EstimatePreview trade={trade} className="mx-auto w-full max-w-md" />
        </section>

        {/* it knows the work */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">It knows the work</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {section.knows.map((line) => (
                <li key={line} className="flex items-start gap-3 rounded-2xl border border-hairline bg-paper-800 p-4 shadow-card">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-accent/10 text-accent-bright">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* three steps */}
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
            Driveway to deposit, three steps
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {page.steps.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-bold text-accent-fg">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-bold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* the trade's belt */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">{page.kitName}</p>
                <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
                  The {theme.label} belt — apps and automations
                </h2>
              </div>
              <p className="text-sm text-ink-mute">All included in every plan.</p>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {section.tools.map((tool) => (
                <li key={tool.name} className="flex items-start gap-3.5 rounded-2xl border border-hairline bg-paper-800 p-4 shadow-card">
                  <span className="mt-0.5 grid h-10 w-10 flex-none place-items-center rounded-xl bg-accent text-accent-fg shadow-accent">
                    <ToolIcon icon={tool.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-semibold text-ink">{tool.name}</p>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
                        {tool.kind === 'automation' ? 'Automation' : 'App'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-mute">{tool.tagline}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* trade FAQ */}
        <section className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">
            {theme.label} questions, straight answers
          </h2>
          <div className="mt-6 space-y-6">
            {page.faq.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card">
                <h3 className="font-bold text-ink">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* from the Field Guide — internal links into the trade's articles */}
        {guides.length > 0 ? (
          <section className="mx-auto max-w-3xl px-5 pb-12 sm:px-6 sm:pb-16">
            <p className="eyebrow">From the Field Guide</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
              How the pros write it up
            </h2>
            <div className="mt-6 grid gap-3">
              {guides.map(({ meta }) => (
                <Link
                  key={meta.slug}
                  href={`/blog/${meta.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-hairline bg-paper-800 p-4 transition hover:border-accent/40"
                >
                  <span>
                    <span className="block font-semibold text-ink">{meta.title}</span>
                    <span className="mt-0.5 block text-xs text-ink-mute">
                      {meta.topic} · {shortDate(meta.published)} · {meta.readingMinutes} min read
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 flex-none text-ink-mute transition duration-150 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* final CTA + other trades */}
        <section className="bg-paper-850">
          <div className="mx-auto max-w-6xl px-5 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
              Quote your next {theme.label} job free
            </h2>
            <p className="mt-3 text-lg text-ink-soft">
              3 estimates on the house. If they win you work, it’s $29/mo flat for everything.
            </p>
            <div className="mt-7 flex justify-center">
              <StartFreeButton />
            </div>
            <TrustLine className="mt-4" />

            <p className="mt-12 text-sm font-semibold uppercase tracking-wide text-ink-mute">
              Not your trade?
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
              {others.map((t) => (
                <Link
                  key={t}
                  href={`/for/${t}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright transition hover:brightness-110"
                >
                  Toolbelt for {getTheme(t).label}
                  <ArrowRight className="h-3.5 w-3.5 transition duration-150 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </TradeTheme>
  );
}
