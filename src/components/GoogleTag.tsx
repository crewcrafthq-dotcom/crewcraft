'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Google Ads conversion tracking + GA4 page analytics. Both ids ride ONE
// gtag.js load: Google's "don't add more than one Google tag" rule is about
// loading the library twice, not about configuring several ids on it. Both are
// public identifiers (they ship in the page source of every site running them),
// so they're hardcoded like the Meta pixel id; the NEXT_PUBLIC_* overrides let
// a fork or a test property swap them without a code change.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18291771001';
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-DXMC057VN0';

/**
 * Routes belonging to the CONTRACTOR's customers, not to Crewcraft prospects —
 * the same list MetaPixel sits out, for a second reason that matters more here:
 * these URLs carry the unguessable `public_token` that IS the access control
 * for the public estimate (architecture rule 2). Loading a Google tag on them
 * would hand those capability tokens to Google in `page_location` and print
 * them in GA4's "Pages and screens" report. Homeowners also aren't prospects,
 * so counting them would skew every rate in the account.
 *
 * Safe as a render-time guard because nothing navigates into /e/ or /r/
 * client-side — every link to them is an absolute URL from an email or
 * window.location.origin, i.e. a fresh document load with no tag on it.
 */
const CUSTOMER_ROUTES = ['/e/', '/r/'];

export function GoogleTag() {
  const pathname = usePathname();
  if (CUSTOMER_ROUTES.some((p) => pathname?.startsWith(p))) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
gtag('config', '${GA4_ID}');`}
      </Script>
    </>
  );
}
