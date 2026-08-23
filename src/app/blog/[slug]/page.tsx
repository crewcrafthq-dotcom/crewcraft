import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { StartFreeButton, TrustLine } from '@/components/marketing/StartFree';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { ToolbeltLockup } from '@/components/marketing/ToolbeltLockup';
import { BLOG_POSTS, getPost } from '@/content/blog';
import { getTheme } from '@/lib/trades';
import { shortDate } from '@/lib/format';

export function generateStaticParams() {
  return BLOG_POSTS.map(({ meta }) => ({ slug: meta.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.meta.metaTitle ?? post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${post.meta.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      title: post.meta.metaTitle ?? post.meta.title,
      description: post.meta.description,
      publishedTime: post.meta.published,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const { meta, Body } = post;
  const related = BLOG_POSTS.filter((p) => p.meta.slug !== meta.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: meta.title,
        description: meta.description,
        datePublished: meta.published,
        dateModified: meta.published,
        url: `https://crewcraftapp.com/blog/${meta.slug}`,
        author: {
          '@type': 'Person',
          name: 'Stefan',
          jobTitle: 'Founder',
          worksFor: { '@id': 'https://crewcraftapp.com/#org' },
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://crewcraftapp.com/#org',
          name: 'Crewcraft',
          logo: { '@type': 'ImageObject', url: 'https://crewcraftapp.com/icon-512.png' },
        },
        mainEntityOfPage: `https://crewcraftapp.com/blog/${meta.slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Field Guide', item: 'https://crewcraftapp.com/blog' },
          { '@type': 'ListItem', position: 2, name: meta.title },
        ],
      },
    ],
  };

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-5 sm:px-6">
        <Link href="/" aria-label="Toolbelt by Crewcraft — home">
          <ToolbeltLockup />
        </Link>
        <StartFreeButton size="md" label="Start free" withArrow={false} />
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All guides
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wide text-ink-mute">
          {meta.trade ? (
            <span className="text-accent-bright">{getTheme(meta.trade).label}</span>
          ) : null}
          <span>{meta.topic}</span>
          <span>·</span>
          <span>{shortDate(meta.published)}</span>
          <span>·</span>
          <span>{meta.readingMinutes} min read</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-2 text-sm text-ink-mute">
          By Stefan · founder, Toolbelt by Crewcraft
        </p>

        <article className="post-prose mt-8">
          <Body />
        </article>

        {/* the pitch, honestly separated from the article */}
        <div className="mt-12 rounded-2xl border border-hairline bg-paper-850 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-ink">
            Toolbelt does the paperwork this guide describes.
          </h2>
          <p className="mt-2 text-ink-soft">
            Describe the job in plain English — get an itemized, branded estimate the customer can
            e-sign and pay a deposit on, in about a minute. Built for HVAC, plumbing, electrical
            and roofing.
          </p>
          <div className="mt-5">
            <StartFreeButton />
          </div>
          <TrustLine className="mt-4" />
        </div>

        {related.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-mute">
              Keep reading
            </h2>
            <div className="mt-4 grid gap-3">
              {related.map(({ meta: r }) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-hairline bg-paper-800 p-4 transition hover:border-accent/40"
                >
                  <span className="font-semibold text-ink">{r.title}</span>
                  <ArrowRight className="h-4 w-4 flex-none text-ink-mute transition duration-150 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
