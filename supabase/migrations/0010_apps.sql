-- Five new app surfaces: Scheduling, Equipment & Filter Log, Permit Tracker,
-- Seasonal Tune-Up Reminders, and the public Storm/Emergency Lead Page.
-- Every table is per-contractor with owner-only RLS; the public lead form
-- writes through the service role only (no anon insert policy).

-- ── Scheduling ──────────────────────────────────────────────────────────
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  estimate_id uuid references public.estimates(id) on delete set null,
  title text not null,
  customer_name text,
  address text,
  starts_at timestamptz not null,
  duration_min integer not null default 120,
  notes text,
  status text not null default 'scheduled', -- scheduled | done | canceled
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.jobs enable row level security;
create policy "own jobs" on public.jobs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists jobs_user_start on public.jobs (user_id, starts_at);

-- ── Equipment & Filter Log (HVAC) ───────────────────────────────────────
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  label text not null,            -- e.g. "Upstairs AC", "Garage heater"
  brand text,
  model text,
  serial text,
  filter_size text,               -- e.g. 16x25x1
  refrigerant text,               -- e.g. R-410A
  installed_year integer,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.equipment enable row level security;
create policy "own equipment" on public.equipment
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists equipment_user on public.equipment (user_id, customer_name);

-- ── Permit Tracker (plumbing / electrical / all) ────────────────────────
create table if not exists public.permits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  estimate_id uuid references public.estimates(id) on delete set null,
  job_name text not null,         -- customer / site
  jurisdiction text,              -- city / county office
  permit_no text,
  status text not null default 'applied', -- applied | issued | inspection | closed
  inspection_date date,
  reminder_sent_at timestamptz, -- day-before inspection email stamp
  notes text,
  created_at timestamptz not null default now()
);
alter table public.permits enable row level security;
create policy "own permits" on public.permits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists permits_user on public.permits (user_id, status);

-- ── Seasonal Tune-Up Reminders (HVAC automation) ────────────────────────
create table if not exists public.service_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  cadence_months integer not null default 6,
  next_due date not null,
  enabled boolean not null default true,
  last_sent_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.service_reminders enable row level security;
create policy "own service reminders" on public.service_reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists service_reminders_due on public.service_reminders (enabled, next_due);

-- ── Storm / Emergency Lead Page ─────────────────────────────────────────
-- Each business gets an unguessable public lead-page token (same pattern as
-- estimates.public_token).
alter table public.businesses
  add column if not exists lead_token uuid not null default gen_random_uuid();
create unique index if not exists businesses_lead_token on public.businesses (lead_token);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  message text,
  source text not null default 'lead-page',
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;
-- Owner can read/update/delete their leads; INSERTs come only from the
-- service role (public form API), so no anon/authenticated insert policy.
create policy "own leads read" on public.leads for select using (auth.uid() = user_id);
create policy "own leads delete" on public.leads for delete using (auth.uid() = user_id);
create index if not exists leads_user_time on public.leads (user_id, created_at desc);
