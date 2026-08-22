'use client';

import { useEffect } from 'react';

import { trackMeta, type MetaEventName } from '@/lib/analytics';

/**
 * Fires one Meta standard event when the page mounts, then renders nothing.
 * Drop it into any server component to mark that page as a conversion.
 *
 * `once` takes a stable storage key for conversions that must never
 * double-count on a refresh (signup, activation, paid). Page-level signals
 * like ViewContent leave it off.
 */
export function MetaEvent({
  event,
  params,
  once,
}: {
  event: MetaEventName;
  params?: Record<string, string | number | boolean>;
  once?: string;
}) {
  useEffect(() => {
    trackMeta(event, params, once);
    // Values are literals from the server render; firing once on mount is the
    // whole point, so the mount-only dependency list is deliberate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
