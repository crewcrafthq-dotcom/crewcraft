'use client';

import { useEffect, useState } from 'react';

import { CONSENT_STORAGE_KEY, type ConsentChoice } from './consent';

/**
 * Consent state, shared by every component that needs it (the banner, the Meta
 * Pixel, the "change your choice" button on /cookies). A tiny module-level
 * store rather than a context provider: the state is one enum and two booleans,
 * and this way the root layout doesn't gain another wrapper.
 *
 *   required === null  → still asking the server which region this is
 *   required === true  → EEA/UK/CH: nothing non-essential runs without opt-in
 *   required === false → elsewhere: tags run unless the visitor opted out
 */
type ConsentState = { required: boolean | null; choice: ConsentChoice | null };

let state: ConsentState = { required: null, choice: null };
const listeners = new Set<() => void>();
let probeStarted = false;

function emit(next: Partial<ConsentState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function readStoredChoice(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    // Private mode / storage blocked: treat as undecided.
    return null;
  }
}

/**
 * Ask the server whether this visitor's country needs opt-in consent. Runs once
 * per page load. Any failure falls back to "consent required" — the mistake
 * that costs us a little measurement, not the one that breaks the law.
 */
function startRegionProbe() {
  if (probeStarted) return;
  probeStarted = true;
  emit({ choice: readStoredChoice() });
  fetch('/api/public/region', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => emit({ required: typeof j?.consentRequired === 'boolean' ? j.consentRequired : true }))
    .catch(() => emit({ required: true }));
}

export function useConsent() {
  const [, bump] = useState(0);
  useEffect(() => {
    const listener = () => bump((n) => n + 1);
    listeners.add(listener);
    startRegionProbe();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    ...state,
    /** May a non-essential tag run right now? */
    allowed: state.choice === 'granted' || (state.required === false && state.choice !== 'denied'),
    /** Should the banner be on screen? */
    showBanner: state.required === true && state.choice === null,
  };
}

/**
 * Record a choice and tell Google about it. Google Consent Mode is already
 * denied-by-default in these regions (see the consent-default script in
 * layout.tsx), so this `update` is what actually releases the tags.
 */
export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Choice won't survive this session; the banner reappearing is the correct
    // failure mode (better than assuming consent we can't remember).
  }
  emit({ choice });

  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
  };

  const v: ConsentChoice = choice === 'granted' ? 'granted' : 'denied';
  w.gtag?.('consent', 'update', {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v,
  });

  // Outside the consent regions the pixel is already loaded by the time someone
  // opts out on /cookies, and a fired PageView can't be recalled — but Meta's
  // consent API stops everything after it, including any trackMeta() call later
  // in this same page view. Without this, opting out only took effect on the
  // next navigation.
  w.fbq?.('consent', choice === 'granted' ? 'grant' : 'revoke');
}

/** Forget the stored choice so the banner asks again (the /cookies page link). */
export function resetConsent() {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // nothing to forget
  }
  emit({ choice: null });
}
