'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';

/**
 * Fires a one-time event at 25/50/75/100% scroll depth. Mounted once on the
 * landing page so we can see how far visitors actually read — the difference
 * between "bounced instantly" and "read the whole thing, then left."
 */
export function ScrollDepth() {
  useEffect(() => {
    const hit = new Set<number>();
    const marks = [25, 50, 75, 100];

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      for (const m of marks) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          trackEvent('scroll_depth', { percent: m });
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // catch short pages / initial position
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
