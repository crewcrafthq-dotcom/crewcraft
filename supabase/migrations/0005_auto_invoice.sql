-- Auto-invoice on acceptance: when a customer e-signs an estimate, the invoice
-- is created and emailed without the contractor lifting a finger.
alter table public.businesses
  add column if not exists auto_invoice boolean not null default false;
