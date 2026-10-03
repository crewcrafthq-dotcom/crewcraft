// Only the live site canonicalises its host. Preview builds keep serving on
// their own *.vercel.app URL so PR previews stay clickable, and `next dev`
// (no VERCEL_ENV) is untouched.
const isProduction = process.env.VERCEL_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // @react-pdf/renderer pulls in Node-targeted deps; keep it out of the bundler.
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    // Logo uploads ride through a Server Action; default is 1MB.
    serverActions: { bodySizeLimit: '5mb' },
  },
  images: {
    remotePatterns: [
      // Supabase Storage public URLs for uploaded logos.
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async redirects() {
    return [
      // One canonical host. www serving the full site as a duplicate is what
      // Semrush flagged as "canonical to another page" ×14 and doubled the
      // low-text-ratio list — every www URL now 308s to the apex domain.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.crewcraftapp.com' }],
        destination: 'https://crewcraftapp.com/:path*',
        permanent: true,
      },
      // The production *.vercel.app alias served the whole site — including the
      // branded /login form — on a hostname that isn't the brand. A branded
      // credential form on a non-brand domain is one of the shapes Chrome's
      // Safe Browsing login-phishing heuristic scores, and it's what Search
      // Console's "possible phishing detected on user login" report keys off.
      // Temporary (307) on purpose: nothing here needs the vercel.app URL to
      // rank, and a cached permanent redirect would be awkward to undo.
      ...(isProduction
        ? [
            {
              source: '/:path*',
              has: [{ type: 'host', value: '(?<deployment>.*)\\.vercel\\.app' }],
              destination: 'https://crewcraftapp.com/:path*',
              permanent: false,
            },
          ]
        : []),
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // No page here has a reason to live inside someone else's iframe.
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Microphone stays unlisted (voice dictation needs it).
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), usb=()' },
          // HSTS: the login form can never be downgraded to http. Deliberately
          // short (1 day) and without includeSubDomains/preload so it can be
          // rolled back inside a day if a cert ever misbehaves. Once the live
          // site has run clean for a while this can go to 63072000 (2 years).
          { key: 'Strict-Transport-Security', value: 'max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
