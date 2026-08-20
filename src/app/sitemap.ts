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
    { url: `${base}/for/hvac`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/plumbing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/electrical`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for/roofing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/changelog`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/security`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cookies`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
