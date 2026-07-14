'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires the signup conversion once per browser session. Mounted on /onboarding —
 * the first page every fresh signup lands on and existing users never revisit.
 *
 * Sends a generic `sign_up` event always, plus the Google Ads conversion when
 * NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL is set (format: AW-XXXXXXXXX/AbCdEfGh —
 * create a "Sign-up" conversion action in Google Ads and paste its send_to id).
 */
export function SignupConversion() {
  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    if (sessionStorage.getItem('cc-signup-tracked')) return;
    sessionStorage.setItem('cc-signup-tracked', '1');

    window.gtag('event', 'sign_up', { method: 'email' });

    const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL;
    if (sendTo) {
      window.gtag('event', 'conversion', { send_to: sendTo });
    }
  }, []);

  return null;
}
