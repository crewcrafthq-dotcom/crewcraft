-- Review-Getter automation: when this is on (and a review_link is saved), the
-- daily cron emails the customer a review ask once, automatically, after an
-- invoice is marked paid. Manual asks from the share panel keep working the
-- same either way.
alter table public.businesses
  add column if not exists auto_review_request boolean not null default false;
