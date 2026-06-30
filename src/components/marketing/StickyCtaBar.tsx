'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { StartFreeButton } from './StartFree';

/** Thumb-reachable signup, always one tap away on mobile once you start scrolling. */
export function StickyCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 p-3 backdrop-blur-md transition-transform duration-300 ease-out-soft lg:hidden',
        show ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <StartFreeButton size="md" className="w-full" withArrow={false} />
    </div>
  );
}
