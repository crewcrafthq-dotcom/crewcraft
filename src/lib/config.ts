// Single place for the knobs that change rarely but matter a lot.

/**
 * Line-item generator model. Swapping this one constant is the whole "use the
 * cheaper model" lever (§3). Haiku 4.5 is the cheaper fallback.
 */
export const AI_MODEL = 'claude-sonnet-4-6';
export const AI_MODEL_FALLBACK = 'claude-haiku-4-5';

/** Free tier: 3 estimates total, then the paywall (§6). Not per month. */
export const FREE_ESTIMATE_LIMIT = 3;

/** Follow-up reminders: nudge after N quiet days, at most MAX times. */
export const REMINDER_AFTER_DAYS = 3;
export const REMINDER_MAX = 2;

/** Invoices default to net-14. */
export const INVOICE_DUE_DAYS = 14;

/** Estimates advertise a validity window (shown on the public page + PDF). */
export const ESTIMATE_VALID_DAYS = 30;

/** AI photo input: keep request bodies sane. */
export const AI_MAX_PHOTOS = 4;

/** Stripe price ids, wired from env so this code carries no secrets. */
export const STRIPE_PRICES = {
  proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
  proAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? '',
  founding: process.env.STRIPE_PRICE_FOUNDING ?? '',
} as const;

export type PlanKey = keyof typeof STRIPE_PRICES;

/** Pricing copy shown on the billing page. $29/mo is the anchor (§6). */
export const PRICING = {
  proMonthly: { label: 'Pro — monthly', price: '$29', cadence: '/mo', priceKey: 'proMonthly' as PlanKey },
  proAnnual: { label: 'Pro — yearly', price: '$24', cadence: '/mo billed yearly ($288)', priceKey: 'proAnnual' as PlanKey },
  founding: { label: 'Founding — locked for life', price: '$19', cadence: '/mo (first 100)', priceKey: 'founding' as PlanKey },
} as const;

/** App base URL. No trailing slash. */
export function appUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return url.replace(/\/$/, '');
}

/** A Stripe subscription that counts as paid. */
export function isPaidStatus(status: string | null | undefined): boolean {
  return status === 'active' || status === 'trialing';
}
