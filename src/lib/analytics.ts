'use client';

import { track as vercelTrack } from '@vercel/analytics';

/**
 * Meta standard events we fire. Standard names (not custom ones) are what Meta
 * Ads can optimize delivery against, so every conversion here uses one.
 * Priority per the ad plan: CompleteRegistration is the primary optimization
 * event; StartTrial is the secondary (activation) signal.
 */
export type MetaEventName =
  | 'ViewContent'
  | 'Lead'
  | 'CompleteRegistration'
  | 'StartTrial'
  | 'Subscribe'
  | 'Purchase';

type Params = Record<string, string | number | boolean>;

/**
 * The tag scripts load `afterInteractive`, so they can land a beat after a
 * component mounts. Poll briefly instead of dropping the event on the floor.
 */
function whenReady(ready: () => boolean, send: () => void, tries = 0) {
  if (ready()) {
    send();
    return;
  }
  if (tries < 20) setTimeout(() => whenReady(ready, send, tries + 1), 500);
}

function fbq(): ((...args: unknown[]) => void) | undefined {
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  return typeof w.fbq === 'function' ? w.fbq : undefined;
}

function gtag(): ((...args: unknown[]) => void) | undefined {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  return typeof w.gtag === 'function' ? w.gtag : undefined;
}

/**
 * Fire-once guard. `key` is stored in localStorage, so a conversion survives a
 * refresh or a second visit to the same page and is never counted twice.
 * Returns false when the event has already been sent.
 */
function claimOnce(key: string): boolean {
  try {
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, '1');
    return true;
  } catch {
    // Private mode / storage disabled: fire rather than lose the conversion.
    return true;
  }
}

/**
 * One place to fire a marketing event. Goes to Vercel Web Analytics and the
 * Google tag, so the landing page reports a real engagement funnel instead of
 * one bounce number. Firing these also makes a session count as "engaged" in
 * GA4 — which visitors who scroll/click genuinely are.
 */
export function trackEvent(name: string, props?: Params) {
  try {
    vercelTrack(name, props);
  } catch {
    // analytics must never break the page
  }
  try {
    gtag()?.('event', name, props ?? {});
  } catch {
    // ignore
  }
}

/**
 * Fire a Meta standard conversion event. Pass `once` with a stable key for
 * conversions that must not double-count on refresh (signup, activation,
 * paid conversion); leave it off for page-level events like ViewContent.
 */
export function trackMeta(name: MetaEventName, params?: Params, once?: string) {
  try {
    if (once && !claimOnce(once)) return;
    whenReady(
      () => fbq() !== undefined,
      () => fbq()?.('track', name, params ?? {}),
    );
  } catch {
    // analytics must never break the page
  }
}
