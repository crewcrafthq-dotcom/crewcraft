import type { MetadataRoute } from 'next';

// Served at /robots.txt — lets Google crawl the public site, blocks the app,
// API, auth and private estimate routes, and points to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/estimates',
        '/billing',
        '/settings',
        '/onboarding',
        '/api/',
        '/auth/',
        '/e/',
      ],
    },
    sitemap: 'https://crewcraftapp.com/sitemap.xml',
    host: 'https://crewcraftapp.com',
  };
}
