import 'server-only';

import Stripe from 'stripe';

let client: Stripe | null = null;

/**
 * Lazily-constructed Stripe client. Built on first use (not at import) so the
 * app can build and boot without the secret key present. Server-only.
 */
export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    client = new Stripe(key);
  }
  return client;
}
