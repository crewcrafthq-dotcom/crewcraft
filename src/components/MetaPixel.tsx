'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

import { useConsent } from '@/lib/use-consent';

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
  const { allowed } = useConsent();
  if (!PIXEL_ID) return null;
  if (CUSTOMER_ROUTES.some((p) => pathname?.startsWith(p))) return null;
  // Meta has no equivalent of Google's Consent Mode — a loaded pixel has
  // already phoned home — so in consent regions it must not mount until the
  // visitor opts in. Outside them `allowed` is true as soon as the region probe
  // answers, which costs the pixel a couple of hundred milliseconds.
  if (!allowed) return null;
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
    </>
  );
}

/*
 * Meta's <noscript> tracking <img> used to sit here. It had to go: deciding
 * whether this visitor needs to opt in requires JavaScript, so a no-JS visitor
 * can only be handled one of two ways, and firing the pixel at someone whose
 * region we cannot determine is the wrong one. Costs us PageViews from the
 * fraction of visitors running no JS, who were never going to sign up anyway
 * (the whole app needs it).
 */
