import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from '@/components/ui/toast';
import { CookieBanner } from '@/components/CookieBanner';
import { GoogleTag } from '@/components/GoogleTag';
import { MetaPixel } from '@/components/MetaPixel';
import { ServiceWorker } from '@/components/ServiceWorker';
import { CONSENT_REGIONS, CONSENT_STORAGE_KEY } from '@/lib/consent';

// Umami — privacy-friendly, cookieless page analytics. The website id is a
// public identifier (it ships in the page source), so it lives here like the
// Google tag ids in GoogleTag.tsx; NEXT_PUBLIC_UMAMI_WEBSITE_ID overrides it
// for a fork.
const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || 'ea02467a-d75a-4e6e-a96a-5cfa9487086a';

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

// Poppins is NOT declared here on purpose. It is a PDF-only face: the renderer
// registers the TTFs straight off disk in src/lib/pdf/fonts.ts, and no CSS on
// the site ever asks for it. Declaring it with next/font made every page
// preload ~460 KB of TTF that nothing rendered — the single biggest slice of
// page weight on the marketing pages. Web UI is Inter + Barlow Condensed only.

const TITLE = 'Toolbelt by Crewcraft — AI Estimate Software for Contractors';
const DESCRIPTION =
  'AI estimate software for HVAC, plumbing, electrical and roofing contractors. Branded estimates in 60 seconds — e-signed, invoiced, paid online. 3 free, no card.';

export const metadata: Metadata = {
  // Makes every relative URL (canonical, OG image) absolute against the live domain.
  metadataBase: new URL('https://crewcraftapp.com'),
  title: {
    default: TITLE,
    // Short suffix: every child title has to fit Google's ~60 char cut-off.
    template: '%s · Toolbelt',
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
    <html lang="en" className={`${inter.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        {/* Apply the saved theme before first paint — no light/dark flash. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem('toolbelt-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`}
        </Script>
        {/* Google Consent Mode v2 defaults. MUST be queued onto dataLayer
            before gtag.js loads, hence beforeInteractive — once the library has
            read the queue, a late default is just ignored. Denied by default in
            the consent regions (the banner's Accept flips it with a `consent`
            update); granted elsewhere, where the regime is opt-out. A stored
            choice overrides both, so a decision survives the next page load
            instead of the default briefly winning. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
(function(){
var deny={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'};
var grant={ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'};
var c=null;try{c=localStorage.getItem('${CONSENT_STORAGE_KEY}')}catch(e){}
if(c==='granted'){gtag('consent','default',grant);return}
if(c==='denied'){gtag('consent','default',deny);return}
gtag('consent','default',Object.assign({},deny,{wait_for_update:500,region:${JSON.stringify(CONSENT_REGIONS)}}));
gtag('consent','default',grant);
})();`}
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
        {/* Google Ads conversions + GA4 analytics, one gtag.js load. Skips the
            tokenised customer pages — see the component. */}
        <GoogleTag />
        <CookieBanner />
        {/* Umami. afterInteractive is next/script's equivalent of the `defer`
            in Umami's snippet: it never blocks first paint, which the font
            cleanup just bought us. */}
        <Script
          id="umami"
          src="https://cloud.umami.is/script.js"
          data-website-id={UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
