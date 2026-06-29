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
};

export default nextConfig;
