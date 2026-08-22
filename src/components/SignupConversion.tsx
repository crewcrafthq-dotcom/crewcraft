'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires the signup conversion once per browser session. Mounted on /onboarding —
 * the first page every fresh signup lands on and existing users never revisit.
 *
 * Sends a generic `sign_up` event always, plus the Google Ads conversion when
 * NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL is set (format: AW-XXXXXXXXX/AbCdEfGh —
 * create a "Sign-up" conversion action in Google Ads and paste its send_to id),
 * plus Meta's standard CompleteRegistration when the Pixel is loaded
 * (NEXT_PUBLIC_META_PIXEL_ID set) — the event Meta Ads optimizes signups on.
 */
export function SignupConversion() {
  useEffect(() => {
    if (sessionStorage.getItem('cc-signup-tracked')) return;
    sessionStorage.setItem('cc-signup-tracked', '1');

    // Both tag scripts load afterInteractive and can land a beat after this
    // effect — poll briefly instead of losing the conversion to the race.
    const fire = (ready: () => boolean, send: () => void, tries = 0) => {
      if (ready()) send();
      else if (tries < 20) setTimeout(() => fire(ready, send, tries + 1), 500);
    };

    fire(
      () => typeof window.gtag === 'function',
      () => {
        window.gtag!('event', 'sign_up', { method: 'email' });
        const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL;
        if (sendTo) window.gtag!('event', 'conversion', { send_to: sendTo });
      },
    );

    fire(
      () => typeof window.fbq === 'function',
      () => window.fbq!('track', 'CompleteRegistration'),
    );
  }, []);

  return null;
}
