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
        ],
      },
    ];
  },
};

export default nextConfig;
