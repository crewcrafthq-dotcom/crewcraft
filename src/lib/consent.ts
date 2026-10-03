/**
 * Cookie-consent constants shared by the server (the region probe) and the
 * client (the banner, the Google tag's consent defaults). No React, no browser
 * APIs — it's imported from a route handler and from the root layout.
 */

/** Where opt-in consent is legally required before non-essential tags run. */
export const CONSENT_REGIONS = [
  // EU 27
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  // Rest of the EEA
  'IS', 'LI', 'NO',
  // UK (post-Brexit, same PECR requirement) and Switzerland (revFADP)
  'GB', 'CH',
] as const;

export type ConsentChoice = 'granted' | 'denied';

/** localStorage key. Mirrors `toolbelt-theme`'s naming. */
export const CONSENT_STORAGE_KEY = 'toolbelt-consent';

/**
 * Routes where no non-essential tag loads at all (GoogleTag and MetaPixel both
 * sit them out), so there is nothing to consent to and no banner to show. Kept
 * in step with CUSTOMER_ROUTES in those components.
 */
export const UNTAGGED_ROUTES = ['/e/', '/r/'];

export function isUntaggedRoute(pathname: string | null): boolean {
  return UNTAGGED_ROUTES.some((p) => pathname?.startsWith(p));
}
