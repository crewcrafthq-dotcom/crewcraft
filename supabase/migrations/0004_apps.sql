-- Crewcraft apps expansion: customer accept/e-sign, invoices, follow-up
-- reminders, review requests, get-paid settings, and the price book.

-- ── estimates → documents ───────────────────────────────────────────────────
-- One table carries both estimates and invoices; `kind` tells them apart so
-- line items, PDFs, emails, and RLS are shared instead of duplicated.
alter table public.estimates
  add column if not exists kind text not null default 'estimate'
    check (kind in ('estimate', 'invoice'));

-- Invoices add a 'paid' status on top of the estimate lifecycle.
alter table public.estimates drop constraint if exists estimates_status_check;
alter table public.estimates
  add constraint estimates_status_check
    check (status in ('draft', 'sent', 'viewed', 'accepted', 'declined', 'paid'));

-- Customer accept / decline with a typed-name signature.
alter table public.estimates add column if not exists signed_name    text;
alter table public.estimates add column if not exists accepted_at    timestamptz;
alter table public.estimates add column if not exists declined_at    timestamptz;
alter table public.estimates add column if not exists decline_reason text;

-- Invoice fields.
alter table public.estimates add column if not exists due_date           date;
alter table public.estimates add column if not exists paid_at            timestamptz;
alter table public.estimates add column if not exists source_estimate_id uuid
  references public.estimates (id) on delete set null;

-- Send + follow-up reminder tracking.
alter table public.estimates add column if not exists sent_at           timestamptz;
alter table public.estimates add column if not exists reminders_enabled boolean not null default true;
alter table public.estimates add column if not exists last_reminder_at  timestamptz;
alter table public.estimates add column if not exists reminder_count    integer not null default 0;

-- Review requests.
alter table public.estimates add column if not exists review_requested_at timestamptz;

create index if not exists estimates_user_kind_idx on public.estimates (user_id, kind);

-- ── businesses: get-paid + review settings ──────────────────────────────────
alter table public.businesses add column if not exists review_link          text;
alter table public.businesses add column if not exists payment_link         text;
alter table public.businesses add column if not exists payment_instructions text;

-- ── price_book_items ────────────────────────────────────────────────────────
-- The contractor's saved rates and materials. Fed into the AI prompt so
-- drafts come back priced their way.
create table if not exists public.price_book_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  category    text not null check (category in ('labor', 'materials', 'other')),
  description text not null default '',
  unit        text not null default '',
  unit_price  numeric not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists price_book_items_user_id_idx on public.price_book_items (user_id);

alter table public.price_book_items enable row level security;

drop policy if exists "price_book_select_own" on public.price_book_items;
create policy "price_book_select_own" on public.price_book_items
  for select using (auth.uid() = user_id);

drop policy if exists "price_book_insert_own" on public.price_book_items;
create policy "price_book_insert_own" on public.price_book_items
  for insert with check (auth.uid() = user_id);

drop policy if exists "price_book_update_own" on public.price_book_items;
create policy "price_book_update_own" on public.price_book_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "price_book_delete_own" on public.price_book_items;
create policy "price_book_delete_own" on public.price_book_items
  for delete using (auth.uid() = user_id);
