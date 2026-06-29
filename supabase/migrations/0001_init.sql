-- Crewcraft Estimate Builder — schema (§4)
-- One business per user; estimates own their line items.

create extension if not exists pgcrypto;

-- ── businesses ─────────────────────────────────────────────────────────────
create table if not exists public.businesses (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null unique references auth.users (id) on delete cascade,
  trade                  text not null check (trade in ('hvac', 'plumbing', 'electrical', 'roofing')),
  name                   text not null,
  logo_url               text,
  license                text,
  phone                  text,
  email                  text,
  address                text,
  default_tax_rate       numeric not null default 0,
  default_labor_rate     numeric not null default 0,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text not null default 'free' check (plan in ('free', 'pro')),
  subscription_status    text,
  created_at             timestamptz not null default now()
);

-- ── estimates ──────────────────────────────────────────────────────────────
create table if not exists public.estimates (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  customer_name    text not null default '',
  customer_address text,
  customer_phone   text,
  customer_email   text,
  status           text not null default 'draft'
                     check (status in ('draft', 'sent', 'viewed', 'accepted', 'declined')),
  scope_of_work    text,
  subtotal         numeric not null default 0,
  tax_rate         numeric not null default 0,
  tax_amount       numeric not null default 0,
  deposit          numeric not null default 0,
  total            numeric not null default 0,
  notes            text,
  public_token     uuid not null unique default gen_random_uuid(),
  viewed_at        timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists estimates_user_id_idx on public.estimates (user_id);
create index if not exists estimates_public_token_idx on public.estimates (public_token);

-- ── line_items ─────────────────────────────────────────────────────────────
create table if not exists public.line_items (
  id          uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references public.estimates (id) on delete cascade,
  category    text not null check (category in ('labor', 'materials', 'other')),
  description text not null default '',
  quantity    numeric not null default 1,
  unit        text not null default '',
  unit_price  numeric not null default 0,
  line_total  numeric not null default 0,
  sort_order  integer not null default 0
);

create index if not exists line_items_estimate_id_idx on public.line_items (estimate_id);

-- keep estimates.updated_at fresh on every write
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists estimates_set_updated_at on public.estimates;
create trigger estimates_set_updated_at
  before update on public.estimates
  for each row execute function public.set_updated_at();
