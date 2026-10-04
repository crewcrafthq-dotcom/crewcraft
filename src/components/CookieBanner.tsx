'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { isUntaggedRoute } from '@/lib/consent';
import { setConsent, useConsent } from '@/lib/use-consent';

/**
 * Opt-in consent for the two tags that set cookies: GA4 and the Meta Pixel.
 * Shown only where consent is legally required (see /api/public/region) — a US
 * contractor landing from an ad doesn't meet a banner, which is both lawful and
 * the difference between a signup and a bounce.
 *
 * "Reject" is a real button with the same weight as "Accept": under GDPR,
 * refusing has to be as easy as agreeing, so there's no cookie wall, no
 * pre-ticked box, and no close-X that quietly counts as yes. Doing nothing
 * leaves every non-essential tag off.
 *
 * Login, theme and the region probe are unaffected — those are strictly
 * necessary or cookieless, and never gated.
 */
export function CookieBanner() {
  const pathname = usePathname();
  const { showBanner } = useConsent();

  // Customer-facing estimate/lead pages run no tags at all, so a homeowner
  // e-signing an estimate has nothing to consent to.
  if (isUntaggedRoute(pathname)) return null;
  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-paper-900/97 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lift backdrop-blur-md animate-fade-up"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        {/* Icon stays on the title's line — as its own flex child it took a
            whole row on a phone and pushed the banner to a third of the screen. */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-accent/10 text-accent-bright">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p id="cookie-banner-title" className="text-sm font-bold text-ink">
              Cookies for measuring our ads
            </p>
            <p className="mt-0.5 text-sm leading-snug text-ink-soft">
              Google Analytics and the Meta Pixel, to see which ads bring contractors here.
              Staying logged in needs no permission — say no and nothing breaks.{' '}
              <Link
                href="/cookies"
                className="font-medium text-ink underline hover:text-accent-bright"
              >
                What we’d set
              </Link>
            </p>
          </div>
        </div>
        {/* Equal prominence, reject first on the reading path. */}
        <div className="flex flex-none gap-2">
          <Button
            variant="secondary"
            size="md"
            className="flex-1 sm:flex-none"
            onClick={() => setConsent('denied')}
          >
            Reject
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1 sm:flex-none"
            onClick={() => setConsent('granted')}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
