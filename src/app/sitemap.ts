import type { MetadataRoute } from 'next';

// Served at /sitemap.xml — lists the public, indexable pages for Google.
// Ad landing pages (/lp/*) are noindex on purpose and stay out of here.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://crewcraftapp.com';
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
