-- Server-side rate limiting: login attempts + AI usage caps.
-- Service-role only — RLS is enabled with no policies, so the public anon key
-- can neither read nor write these rows.
create table if not exists public.rate_events (
  id bigint generated always as identity primary key,
  identifier text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_events_ident_time
  on public.rate_events (identifier, created_at desc);

alter table public.rate_events enable row level security;
