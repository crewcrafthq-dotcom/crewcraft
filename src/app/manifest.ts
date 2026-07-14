import type { MetadataRoute } from 'next';

/**
 * PWA manifest — makes Toolbelt installable to the home screen and run
 * full-screen (standalone), like a native app. Next serves this at
 * /manifest.webmanifest and links it automatically.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Toolbelt by Crewcraft',
    short_name: 'Toolbelt',
    description:
      'Type the job, send a branded estimate in under a minute. Built for HVAC, plumbing, electrical & roofing contractors.',
    id: '/',
    // Installed app opens straight into the workspace; middleware bounces
    // logged-out users to the landing/login as usual.
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0A0E1A',
    theme_color: '#0A0E1A',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/icon-512.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
