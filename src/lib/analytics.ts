'use client';

import { track as vercelTrack } from '@vercel/analytics';

/**
 * One place to fire a marketing event. Goes to both Vercel Web Analytics and
 * the Google tag, so the landing page reports a real engagement funnel instead
 * of one bounce number. Firing these also makes a session count as "engaged"
 * in GA4 — which visitors who scroll/click genuinely are.
 */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(name, props);
  } catch {
    // analytics must never break the page
  }
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') w.gtag('event', name, props ?? {});
  } catch {
    // ignore
  }
}
