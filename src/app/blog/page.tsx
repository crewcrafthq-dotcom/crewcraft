import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { StartFreeButton, TrustLine } from '@/components/marketing/StartFree';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { ToolbeltLockup } from '@/components/marketing/ToolbeltLockup';
import { TradeIcon } from '@/components/TradeIcon';
import { BLOG_POSTS } from '@/content/blog';
import { getTheme } from '@/lib/trades';
import { shortDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Field Guide: Estimating & Pricing for the Trades',
  description:
    'Practical guides for HVAC, plumbing, electrical and roofing contractors: what winning estimates include, how to price jobs, and how to get paid.',
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
};

// The article list as structured data — lets search and AI crawlers see the
// whole Field Guide from the index page. Built from BLOG_POSTS, so it always
// matches the cards below.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://crewcraftapp.com/blog',
  name: 'The Field Guide — Toolbelt by Crewcraft',
  description:
    'Practical guides for HVAC, plumbing, electrical and roofing contractors: estimating, pricing, deposits, follow-ups, and getting paid.',
  publisher: { '@id': 'https://crewcraftapp.com/#org' },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: BLOG_POSTS.map(({ meta }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://crewcraftapp.com/blog/${meta.slug}`,
      name: meta.title,
    })),
  },
};

export default function BlogIndexPage() {
  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <header className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-5 sm:px-6">
        <Link href="/" aria-label="Toolbelt by Crewcraft — home">
          <ToolbeltLockup />
        </Link>
        <StartFreeButton size="md" label="Start free" withArrow={false} />
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-16 sm:px-6">
        <div className="pb-10 pt-6">
          <p className="eyebrow">The Field Guide</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Estimating, pricing, and getting paid — written for the trades.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            No fluff, no recycled marketing advice. Practical guides on the paperwork side of
            contracting, from the team building{' '}
            <Link href="/" className="font-medium text-accent-bright underline">
              Toolbelt
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-5">
          {BLOG_POSTS.map(({ meta }) => (
            <Link
              key={meta.slug}
              href={`/blog/${meta.slug}`}
              className="group rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card transition hover:border-accent/40 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wide text-ink-mute">
                {meta.trade ? (
                  <span className="inline-flex items-center gap-1.5 text-accent-bright">
                    <TradeIcon trade={meta.trade} className="h-3.5 w-3.5" />
                    {getTheme(meta.trade).label}
                  </span>
                ) : null}
                <span>{meta.topic}</span>
                <span>·</span>
                <span>{shortDate(meta.published)}</span>
                <span>·</span>
                <span>{meta.readingMinutes} min read</span>
              </div>
              <h2 className="mt-2 text-xl font-bold leading-snug text-ink sm:text-2xl">
                {meta.title}
              </h2>
              <p className="mt-1.5 text-ink-soft">{meta.description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-bright">
                Read the guide
                <ArrowRight className="h-4 w-4 transition duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {/*
          Holo AI embed, written exactly as the vendor's snippet specifies: a
          target div plus a plain deferred <script> in the markup.

          This deliberately does NOT use next/script. afterInteractive injects
          the tag only once hydration is done — which is after DOMContentLoaded
          has already fired. An embed that renders on a DOMContentLoaded
          listener (a very common pattern) would then load with a clean 200 and
          silently draw nothing. A plain deferred script is executed by the
          browser during parse, before that event, which is the timing the
          vendor built and tested against.

          Known trade-off: React does not execute script tags it inserts
          itself, so on an App Router soft navigation into /blog the embed will
          not run until a real page load. Correct rendering on a direct visit
          — which is what search traffic does — matters more here.

          It sits BELOW the Field Guide grid rather than replacing it: those
          posts are server-rendered, listed in sitemap.xml and carry
          BlogPosting JSON-LD; anything injected here is none of those things.
        */}
        <div id="holo-blog" className="mt-12 empty:mt-0" />
        <script
          src="https://prod-api-holo-ai.fly.dev/public/seo/embed/71cca383-71e0-4a95-b67e-0e50623b0782.js"
          defer
        />

        <div className="mt-12 rounded-2xl border border-hairline bg-paper-850 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-bold uppercase text-ink">
            Reading about better estimates is the slow way.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            Toolbelt writes them for you — describe the job, send a branded, e-signable estimate
            with a deposit button, in about a minute.
          </p>
          <div className="mt-5 flex justify-center">
            <StartFreeButton />
          </div>
          <TrustLine className="mt-4 text-center" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
