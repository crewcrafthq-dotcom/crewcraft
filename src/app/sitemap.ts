import type { MetadataRoute } from 'next';

// Served at /sitemap.xml — lists the public, indexable pages for Google.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://crewcraftapp.com';
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
