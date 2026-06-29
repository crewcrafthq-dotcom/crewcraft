-- Row Level Security (§4). Users only ever touch their own rows. The public
-- estimate page does NOT read through anon RLS — it goes through a server route
-- using the service-role key, which bypasses RLS for read-only display only.

alter table public.businesses enable row level security;
alter table public.estimates  enable row level security;
alter table public.line_items enable row level security;

-- ── businesses: owner-only ─────────────────────────────────────────────────
drop policy if exists "businesses_select_own" on public.businesses;
create policy "businesses_select_own" on public.businesses
  for select using (auth.uid() = user_id);

drop policy if exists "businesses_insert_own" on public.businesses;
create policy "businesses_insert_own" on public.businesses
  for insert with check (auth.uid() = user_id);

drop policy if exists "businesses_update_own" on public.businesses;
create policy "businesses_update_own" on public.businesses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "businesses_delete_own" on public.businesses;
create policy "businesses_delete_own" on public.businesses
  for delete using (auth.uid() = user_id);

-- ── estimates: owner-only ──────────────────────────────────────────────────
drop policy if exists "estimates_select_own" on public.estimates;
create policy "estimates_select_own" on public.estimates
  for select using (auth.uid() = user_id);

drop policy if exists "estimates_insert_own" on public.estimates;
create policy "estimates_insert_own" on public.estimates
  for insert with check (auth.uid() = user_id);

drop policy if exists "estimates_update_own" on public.estimates;
create policy "estimates_update_own" on public.estimates
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "estimates_delete_own" on public.estimates;
create policy "estimates_delete_own" on public.estimates
  for delete using (auth.uid() = user_id);

-- ── line_items: gated by ownership of the parent estimate ──────────────────
drop policy if exists "line_items_select_own" on public.line_items;
create policy "line_items_select_own" on public.line_items
  for select using (
    exists (
      select 1 from public.estimates e
      where e.id = line_items.estimate_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "line_items_insert_own" on public.line_items;
create policy "line_items_insert_own" on public.line_items
  for insert with check (
    exists (
      select 1 from public.estimates e
      where e.id = line_items.estimate_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "line_items_update_own" on public.line_items;
create policy "line_items_update_own" on public.line_items
  for update using (
    exists (
      select 1 from public.estimates e
      where e.id = line_items.estimate_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "line_items_delete_own" on public.line_items;
create policy "line_items_delete_own" on public.line_items
  for delete using (
    exists (
      select 1 from public.estimates e
      where e.id = line_items.estimate_id and e.user_id = auth.uid()
    )
  );
