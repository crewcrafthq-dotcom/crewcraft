'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Meta (Facebook) Pixel base code. The live pixel id is hardcoded like the
// Google Ads id in layout.tsx — a pixel id is a public identifier (it ships in
// the page source of every site running one), not a secret. NEXT_PUBLIC_META_
// PIXEL_ID overrides it, so a fork or a test pixel needs no code change.
// CompleteRegistration is fired by SignupConversion on /onboarding, mirroring
// the Google tag. Standard fbq snippet, loaded after hydration like gtag.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1779561509895094';

/**
 * Routes belonging to the CONTRACTOR's customers, not to Crewcraft prospects:
 * the public estimate a homeowner e-signs, and the storm/emergency lead form
 * their leads fill in. Tracking homeowners would teach Meta to find more
 * homeowners — the opposite of who these ads are for — so the pixel sits out.
 */
const CUSTOMER_ROUTES = ['/e/', '/r/'];

export function MetaPixel() {
  const pathname = usePathname();
  if (!PIXEL_ID) return null;
  if (CUSTOMER_ROUTES.some((p) => pathname?.startsWith(p))) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
