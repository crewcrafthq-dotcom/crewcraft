import { BLOG_POSTS } from '@/content/blog';

// Served at /feed.xml — RSS 2.0 for the Field Guide.
//
// Generated from BLOG_POSTS, the same source the index page, sitemap and
// llms-full.txt read, so the feed can never drift from what is published.
// Statically generated at build time; a deploy is what changes it.
export const dynamic = 'force-static';

const BASE = 'https://crewcraftapp.com';
const TITLE = 'The Field Guide — Toolbelt by Crewcraft';
const DESCRIPTION =
  'Practical guides for HVAC, plumbing, electrical and roofing contractors: estimating, pricing, invoicing, getting paid, and winning work.';

/**
 * Escape for XML text and attributes. A stray & or < in a post title silently
 * breaks the whole feed for every reader, so this is not optional.
 */
function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822, which is what RSS 2.0 requires — not ISO 8601. */
function rfc822(iso: string): string {
  return new Date(`${iso}T09:00:00Z`).toUTCString();
}

export async function GET() {
  // BLOG_POSTS is already newest-first.
  const posts = BLOG_POSTS;
  const newest = posts[0]?.meta.published;

  const items = posts
    .map(({ meta }) => {
      const url = `${BASE}/blog/${meta.slug}`;
      return [
        '    <item>',
        `      <title>${xml(meta.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(meta.published)}</pubDate>`,
        `      <category>${xml(meta.topic)}</category>`,
        `      <description>${xml(meta.description)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(TITLE)}</title>
    <link>${BASE}/blog</link>
    <description>${xml(DESCRIPTION)}</description>
    <language>en</language>
${newest ? `    <lastBuildDate>${rfc822(newest)}</lastBuildDate>\n` : ''}    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
