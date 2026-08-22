import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/toast';
import { MetaPixel } from '@/components/MetaPixel';
import { ServiceWorker } from '@/components/ServiceWorker';

// Google Ads conversion tracking (gtag.js). The base tag lets Google detect the
// site; the signup conversion event is fired from the post-signup flow.
const GOOGLE_ADS_ID = 'AW-18291771001';

// Inter for the whole web UI — crisp, technical, premium SaaS feel.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

// Barlow Condensed for display headings — the DIN-like industrial voice of the
// "Jobsite Dark" theme. Headlines only; body copy stays Inter.
const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
});

// Poppins stays available (matches the TTFs the PDF embeds).
const poppins = localFont({
  src: [
    { path: '../../public/fonts/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Poppins-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

const TITLE = 'Toolbelt by Crewcraft — AI Estimate Software for Contractors';
const DESCRIPTION =
  'AI estimate software for HVAC, plumbing, electrical & roofing contractors. Branded estimates in 60 seconds, e-sign, invoices, online payments, follow-ups — one flat-price toolbelt. 3 free estimates, no credit card.';

export const metadata: Metadata = {
  // Makes every relative URL (canonical, OG image) absolute against the live domain.
  metadataBase: new URL('https://crewcraftapp.com'),
  title: {
    default: TITLE,
    template: '%s · Toolbelt by Crewcraft',
  },
  description: DESCRIPTION,
  applicationName: 'Toolbelt by Crewcraft',
  // Installable PWA: iOS home-screen app metadata (manifest is auto-linked from
  // app/manifest.ts).
  appleWebApp: {
    capable: true,
    title: 'Toolbelt',
    statusBarStyle: 'black-translucent',
  },
  keywords: [
    'contractor software',
    'software for contractors',
    'contractor estimate app',
    'contractor invoicing software',
    'estimating software for contractors',
    'HVAC contractor software',
    'plumbing contractor software',
    'electrical contractor software',
    'roofing contractor software',
    'quote software for contractors',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://crewcraftapp.com',
    siteName: 'Toolbelt by Crewcraft',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Toolbelt by Crewcraft' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F2EBE0',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        {/* Apply the saved theme before first paint — no light/dark flash. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem('toolbelt-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`}
        </Script>
        {/* Scroll-reveal sections must never be a blank page for no-JS visitors/crawlers. */}
        <noscript>
          <style>{`.reveal,.reveal-child{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
        <Toaster />
        <ServiceWorker />
        <Analytics />
        <MetaPixel />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
        </Script>
      </body>
    </html>
  );
}
