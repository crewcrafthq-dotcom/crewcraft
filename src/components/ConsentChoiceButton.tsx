'use client';

import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { setConsent, useConsent } from '@/lib/use-consent';

/**
 * Lets anyone change their mind from /cookies — the withdrawal route GDPR
 * requires to be as easy as giving consent. Also the only way a visitor outside
 * the consent regions (who never sees the banner) can opt out.
 */
export function ConsentChoiceButton() {
  const { choice, required, allowed } = useConsent();

  const status =
    choice === 'granted'
      ? 'You’ve allowed them.'
      : choice === 'denied'
        ? 'You’ve turned them off.'
        : required === false
          ? 'No choice saved — they’re on, as your region’s rules allow. Turn them off here any time.'
          : required === true
            ? 'No choice saved — they’re off until you allow them.'
            : 'Checking…';

  return (
    <div className="not-prose rounded-2xl border border-hairline bg-paper-850 p-5">
      <p className="text-sm font-bold text-ink">Your choice, right now</p>
      <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
        <span
          className={allowed ? 'text-ok' : 'text-ink-mute'}
          aria-hidden
        >
          {allowed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </span>
        {status}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={allowed ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setConsent('granted')}
          disabled={choice === 'granted'}
        >
          Allow analytics cookies
        </Button>
        <Button
          variant={allowed ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setConsent('denied')}
          disabled={choice === 'denied'}
        >
          Turn them off
        </Button>
      </div>
      <p className="mt-3 text-xs text-ink-mute">
        Saved in this browser only. Clearing your browser data resets it, and a different
        browser or device is a separate choice.
      </p>
    </div>
  );
}
