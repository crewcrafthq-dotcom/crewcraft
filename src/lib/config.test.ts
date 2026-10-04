import { describe, expect, it } from 'vitest';

import {
  graceDaysLeft,
  graceRemains,
  hasProAccess,
  isDunningStatus,
  isPaidStatus,
  PAST_DUE_GRACE_DAYS,
} from './config';

const DAY = 86_400_000;
const inDays = (n: number) => new Date(Date.now() + n * DAY).toISOString();

describe('isPaidStatus', () => {
  it('counts only active and trialing', () => {
    expect(isPaidStatus('active')).toBe(true);
    expect(isPaidStatus('trialing')).toBe(true);
    expect(isPaidStatus('past_due')).toBe(false);
    expect(isPaidStatus('canceled')).toBe(false);
    expect(isPaidStatus(null)).toBe(false);
    expect(isPaidStatus(undefined)).toBe(false);
  });
});

describe('isDunningStatus', () => {
  it('is the money-not-arrived-yet set, not the customer-left set', () => {
    expect(isDunningStatus('past_due')).toBe(true);
    expect(isDunningStatus('unpaid')).toBe(true);
    expect(isDunningStatus('canceled')).toBe(false);
    expect(isDunningStatus('active')).toBe(false);
    expect(isDunningStatus(null)).toBe(false);
  });
});

describe('graceRemains / graceDaysLeft', () => {
  it('reads a future deadline as time remaining, rounded up', () => {
    expect(graceRemains(inDays(5))).toBe(true);
    expect(graceDaysLeft(inDays(5))).toBe(5);
    // Part of a day still counts as a day — never tell someone "0 days left"
    // while they still have access.
    expect(graceDaysLeft(inDays(0.2))).toBe(1);
  });

  it('treats a past, missing or junk deadline as no grace', () => {
    expect(graceRemains(inDays(-1))).toBe(false);
    expect(graceRemains(null)).toBe(false);
    expect(graceRemains(undefined)).toBe(false);
    expect(graceRemains('not a date')).toBe(false);
    expect(graceDaysLeft(inDays(-1))).toBe(0);
    expect(graceDaysLeft(null)).toBe(0);
  });
});

describe('hasProAccess', () => {
  it('keeps a paying subscription on Pro', () => {
    expect(hasProAccess({ subscription_status: 'active', grace_until: null })).toBe(true);
    expect(hasProAccess({ subscription_status: 'trialing', grace_until: null })).toBe(true);
  });

  it('keeps a failed renewal on Pro while the grace window runs', () => {
    expect(hasProAccess({ subscription_status: 'past_due', grace_until: inDays(9) })).toBe(true);
    expect(hasProAccess({ subscription_status: 'unpaid', grace_until: inDays(1) })).toBe(true);
  });

  it('drops to free once the grace window expires', () => {
    expect(hasProAccess({ subscription_status: 'past_due', grace_until: inDays(-1) })).toBe(false);
  });

  it('gives no grace to a subscription that was cancelled outright', () => {
    // Cancelling is a decision, not a declined card — there is nothing to retry.
    expect(hasProAccess({ subscription_status: 'canceled', grace_until: inDays(9) })).toBe(false);
  });

  it('gives no grace to a free account', () => {
    expect(hasProAccess({ subscription_status: null })).toBe(false);
    expect(hasProAccess({ subscription_status: null, grace_until: inDays(9) })).toBe(false);
  });

  it('falls back to paid-status-only before migration 0011 adds the column', () => {
    // grace_until is `undefined` (not null) when the column doesn't exist, and
    // the old behaviour is what has to show through.
    expect(hasProAccess({ subscription_status: 'active' })).toBe(true);
    expect(hasProAccess({ subscription_status: 'past_due' })).toBe(false);
  });

  it('runs the window alongside Stripe retries, not past them', () => {
    // Stripe's default retry schedule gives up around day 14; a grace window
    // shorter than that would lock someone out while a retry could still save
    // them, and a much longer one gives free Pro after Stripe has given up.
    expect(PAST_DUE_GRACE_DAYS).toBe(14);
    const fresh = inDays(PAST_DUE_GRACE_DAYS);
    expect(hasProAccess({ subscription_status: 'past_due', grace_until: fresh })).toBe(true);
    expect(graceDaysLeft(fresh)).toBe(PAST_DUE_GRACE_DAYS);
  });
});
