-- Dunning grace window.
--
-- Before this, isPaidStatus() counted only 'active' and 'trialing', so the
-- moment Stripe flipped a subscription to 'past_due' the contractor dropped to
-- the free tier — mid-week, mid-job, with no warning — while Stripe was still
-- happily retrying the card for another two weeks. A declined renewal is
-- usually an expired card, not a customer who left.
--
-- grace_until is the moment Pro actually lapses. The Stripe webhook sets it on
-- the first failed invoice (now + PAST_DUE_GRACE_DAYS) and never extends it on
-- later retries, and clears it the moment a payment succeeds.

alter table public.businesses
  add column if not exists grace_until timestamptz;

comment on column public.businesses.grace_until is
  'While subscription_status is past_due/unpaid, Pro stays on until this moment. Set by the Stripe webhook on the first failed invoice; cleared when payment succeeds. NULL means no grace window is running.';
