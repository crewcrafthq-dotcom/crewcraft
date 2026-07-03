-- Stripe Connect: contractors link their own Stripe (Standard) account so
-- homeowners pay through the app and invoices reconcile themselves.

alter table public.businesses
  add column if not exists stripe_account_id text;
alter table public.businesses
  add column if not exists stripe_charges_enabled boolean not null default false;

-- When a deposit is collected online for an accepted estimate.
alter table public.estimates
  add column if not exists deposit_paid_at timestamptz;
