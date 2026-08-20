import type { MetadataRoute } from 'next';

// Routes that are private (auth'd app, API, tokenized customer links) — never
// crawled, by anyone.
const PRIVATE = [
  '/dashboard',
  '/estimates',
  '/billing',
  '/settings',
  '/onboarding',
  '/apps/',
  '/api/',
  '/auth/',
  '/e/',
  '/r/',
];

// AI assistant/search crawlers, explicitly welcomed on the public site. A
// growing share of "best estimate software" answers come from these — being
// citable there is free distribution. Named groups REPLACE the `*` group for
// that bot, so each must carry the same disallow list.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'DuckAssistBot',
  'meta-externalagent',
  'CCBot',
];

// Served at /robots.txt — lets Google and AI assistants crawl the public site,
// blocks the app, API, auth and private estimate routes, and points to the
// sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: PRIVATE })),
    ],
    sitemap: 'https://crewcraftapp.com/sitemap.xml',
    host: 'https://crewcraftapp.com',
  };
}
