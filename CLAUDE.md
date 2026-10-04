# CLAUDE.md — context for working on this repo

## The business

This is **Toolbelt by Crewcraft** (crewcraftapp.com) — software for HVAC,
plumbing, electrical, and roofing contractors, built and run by a solo founder
(Stefan). Crewcraft also sells AI estimate prompts at crewcraft.ai; this app is
the done-for-you version. Contractors use it **on their phones** — mobile-first
is non-negotiable.

Core flow: describe a job in plain English (or attach job-site photos) → Claude
drafts itemized labor/materials → contractor sends a branded estimate by link →
homeowner e-signs (typed name) and pays a deposit → invoice is created (and
optionally auto-sent) → payment reconciles it automatically via Stripe Connect.

Pricing: Free = 3 estimates total (only "used" estimates count — never let
empty abandoned drafts burn the free tier), Pro = $29/mo ($24 annual, $19/mo
founding), via Stripe subscriptions.

**Working with the owner:** he is not a professional developer. Give dashboard
steps (Supabase / Stripe / Vercel) click-by-click, and paste full SQL contents
— never just migration file paths. He merges PRs himself on GitHub.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind, deployed on **Vercel**
- **Supabase** — Postgres + RLS, password & magic-link auth, storage (logos).
  Migrations in `supabase/migrations/` are applied **manually** in the SQL
  editor. 0001–0010 are live (verified against the project's `information_
  schema` on 2026-10-04 — `rate_events`, `jobs`, `equipment`, `permits`,
  `service_reminders` and `leads` all exist); **0011 billing grace is
  pending**. New schema = new numbered migration file, and tell the owner to
  run it.
- **Anthropic** — `AI_MODEL` in `src/lib/config.ts` (server-only key) for
  line-item generation, incl. photo (vision) and Good/Better/Best tier modes
- **@react-pdf/renderer** — branded estimate/invoice PDFs (Poppins)
- **Resend** — all email (estimate/invoice sends, reminders, notifications)
- **Stripe** — platform subscriptions AND **Connect** (Standard accounts,
  direct charges; contractors connect their own Stripe, the platform never
  carries loss liability)
- **Vercel Cron** (`vercel.json`) — daily follow-up sweep

Env vars beyond the obvious (see `.env.example`): `CRON_SECRET` (cron auth),
`STRIPE_CONNECT_WEBHOOK_SECRET` (Connect webhook — configured in Stripe to
listen on **connected accounts** for `checkout.session.completed` +
`account.updated`), `OWNER_EMAILS` (comma-separated admin emails with
unlimited estimates — `isOwnerEmail` in `src/lib/config.ts`).

## Architecture rules — do not regress these

1. **All money math goes through `computeTotals`** (`src/lib/estimates.ts`,
   integer cents). Never trust AI output or client-side arithmetic for totals.
2. **Public pages/PDFs** (`/e/[token]`, `/api/public/*`) read via the
   service-role client keyed by unguessable `public_token`. Both server
   Supabase clients (`src/lib/supabase/server.ts`, `admin.ts`) pin fetch to
   `cache: 'no-store'` — Next's Data Cache once served stale accepted-state to
   homeowners. Keep it that way.
3. **Two switchable themes, one token set** (July 2026): "Paper & Blueprint"
   light (default) and "Jobsite Dark" — every `paper.*`/`ink.*`/`hairline`/
   shadow token resolves through CSS variables defined in `globals.css`
   (`:root` = light, `[data-theme="dark"]` = the original night palette).
   The switch lives in Settings (`ThemeToggle`, localStorage key
   `toolbelt-theme`, applied pre-paint by the `theme-init` script in
   layout.tsx). Trade accents carry light+dark tunings via `themeVars()`
   (`src/lib/trades.ts`). For status text use the themed `text-ok`/`text-bad`
   tokens, never raw emerald/red shades (they only read on one theme). The
   public customer page keeps its static `bg-cream text-navy` look. Barlow
   Condensed uppercase display headings, blueprint grid + `.hazard` stripes.
4. **AI output is parsed + zod-validated** (`parseGenerated`,
   `parseGeneratedTiers` in `src/lib/ai/generate.ts` — unit-tested) with
   friendly fallback copy. The model's arithmetic is never used.
5. **Estimates and invoices share one table** (`estimates.kind`), so line
   items, PDFs, emails, and RLS are shared. Customers are **derived** from
   documents (`src/lib/customers.ts`) — there is no customers table.

## Before pushing

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest — totals, AI parsers, customer grouping
npm run lint        # next lint
npm run pdf:smoke   # renders estimate + invoice PDFs to ./scratch/
```

## Feature map (all live)

Estimate builder (AI + photos + tiers + price book) · customer e-sign
accept/decline · invoices (INV numbering, due dates, PAID stamp) ·
auto-invoice-on-acceptance (`businesses.auto_invoice`) · Stripe Connect
checkout for deposits/balances with webhook auto-mark-paid
(`estimates.deposit_paid_at`) · follow-up reminders (manual + daily cron:
quiet estimates and overdue invoices, max 2, per-document toggle) · Customers
(derived CRM) · Analytics (win rate, quoted vs won) · review-request emails
(`businesses.review_link`; manual from the share panel AND auto after an
invoice is paid when `businesses.auto_review_request` is on — cron pass 3 in
`/api/cron/reminders`, idempotent via `review_requested_at`, only invoices
paid within `REVIEW_ASK_WINDOW_DAYS`, needs migration 0008) · get-paid
fallbacks (`payment_link`,
`payment_instructions`) · voice dictation in the estimate builder
(`VoiceButton`, Web Speech API, renders nothing when unsupported) · trade
tools under `/apps/*`: Load Calc Helper (NEC 220.82-style,
`src/lib/load-calc.ts`, unit-tested), Water Heater Quote Pack + Maintenance
Plan Builder (presets in `src/lib/app-presets.ts` → draft estimate via
`src/app/apps/actions.ts`, same free-tier gate as /estimates/new), Material
Order Sheet (printable materials list), Supplement Drafter (AI letter via
`/api/ai/supplement`), Photo Report Builder (client-side branded PDF —
photos never uploaded), and — behind migration 0010 (all fail soft with a
"run migration 0010" notice until applied) — Scheduling (`/apps/schedule`,
agenda + evening "tomorrow's jobs" digest via cron), Equipment & Filter Log
(`/apps/equipment`), Permit Tracker (`/apps/permits`, day-before inspection
email), Seasonal Tune-Up Reminders (`/apps/service-reminders`, cron emails
customer + rolls next_due forward), Storm/Emergency Lead Page
(`/apps/lead-page` manager + public `/r/[lead_token]` form → instant
auto-reply + lead email + inbox; honeypot + per-IP rate limit). Cron
`/api/cron/reminders` now runs 6 passes, each guarded so one failing pass
never kills the rest.

**Billing / dunning (Oct 2026):** gate features on `hasProAccess(business)`,
never `isPaidStatus(status)` — the latter counts only `active`/`trialing`, so
on its own it downgraded a paying contractor the same day their card bounced
while Stripe was still retrying for two weeks. A `past_due`/`unpaid`
subscription keeps Pro until `businesses.grace_until` (migration **0011**,
`PAST_DUE_GRACE_DAYS` = 14, sized to outlast Stripe's retry schedule). The
webhook sets that deadline **once** per dunning cycle — Stripe fires a failure
event per retry, and recomputing it each time would roll it forward forever —
and clears it on `invoice.payment_succeeded`. `invoice.payment_failed` also
sends the dunning email, on the first and last attempt only
(`next_payment_attempt === null` means Stripe has given up). `BillingGraceBanner`
renders inside `AppShell`, so it shows on all 24 app screens; `getSession` is
React-`cache()`d so that costs no extra query. Everything fails soft before
0011 is applied: the webhook retries its write without the column, and
`grace_until` comes back `undefined`, which lands on the old behaviour.
**The Stripe dashboard must be subscribed to `invoice.payment_failed` and
`invoice.payment_succeeded`** or none of this fires.

**Security (July 2026):** password login goes through `/api/auth/login` with
DB-backed rate limiting (`rate_events`, migration 0009 — fails OPEN if the
table is missing); AI routes have a per-user daily cap (`AI_DAILY_LIMIT`);
security headers in next.config (incl. HSTS — deliberately `max-age=86400`, no
`includeSubDomains`/`preload`, so it stays rollback-able; raise once the live
site has run clean); review/payment links validated http(s) and
escaped in email hrefs. `/login` is the only page with a credential field and
is `noindex` + out of the sitemap; in production only, any `*.vercel.app` host
307s to the apex domain so the branded login form never answers on a non-brand
hostname (what Search Console's "possible phishing detected on user login"
report keys off) — preview builds keep their own URL via `VERCEL_ENV`.
Desktop app chrome is a sidebar (`AppSidebar`,
data-driven from `liveTradeTools()` in `src/lib/marketing.ts`); mobile stays
top-bar. Brand positioning is **platform-first** ("software tools for
contractors"), not estimates-first.

## Marketing site & ads

Landing page has per-trade deep-dive sections with anchor ids
(`#hvac #plumbing #electrical #roofing`, data in `TRADE_SECTIONS` in
`src/lib/marketing.ts`) and a 4-tier pricing grid (`PRICING_TIERS` — single
source of truth for landing + /billing). Ad landing pages live at `/lp/meta`
and `/lp/google` (noindex; every ad needs a destination URL) with paste-ready
ad copy in `docs/ads/*.md`. SEO playbook: `docs/SEO-GUIDE.md`. Legal pages:
`/privacy`, `/terms`. Google Ads signup conversion fires from `/onboarding`
(`SignupConversion`) once `NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL` is set.

**Never hardcode the tool count.** `LIVE_TOOL_COUNT` and `extraTradeTools()`
in `src/lib/marketing.ts` derive it from `APP_LINEUP` + `liveTradeTools()`,
deduped by destination (Toolbelt Voice lives inside `/estimates`; Supplement
Drafter is the roofing name for Toolbelt Supplements) — currently 18. It had
drifted to a hardcoded "Fourteen" in the hero and belt heading and a `14` in
the `Stats` tile, a claim a prospect can sit and count. Adding a tool now
updates all three.

**Tags/analytics:** `GoogleTag` (`src/components/GoogleTag.tsx`) loads gtag.js
ONCE and configures both the Ads id (`AW-…`) and the GA4 measurement id
(`G-…`) on it — never add a second gtag.js, that's the one thing Google's
"don't add more than one Google tag" warning is about. Plus Umami (cookieless)
and Vercel Analytics in layout.tsx, and `MetaPixel`. `GoogleTag` and
`MetaPixel` both sit out `CUSTOMER_ROUTES = ['/e/', '/r/']`: those URLs carry
the `public_token` that *is* the access control (rule 2), so tagging them would
ship capability tokens to Google/Meta and skew every rate with homeowners who
aren't prospects. Keep any new tag out of those routes too.

**Cookie consent (Oct 2026):** `CookieBanner` + `useConsent`
(`src/lib/use-consent.ts`), constants in `src/lib/consent.ts`. Opt-in only in
`CONSENT_REGIONS` (EEA + GB + CH) — `/api/public/region` reads Vercel's
`x-vercel-ip-country` and the client *fetches* it rather than the layout calling
`headers()`, because `headers()` in the root layout would drop every marketing
page out of static rendering. Unknown country ⇒ consent required (fail safe).
Google side is Consent Mode v2: the `consent-default` script in layout.tsx is
`beforeInteractive` and **must stay that way** — gtag.js ignores defaults queued
after it loads. A stored choice overrides the region defaults there, so a
decision survives reload. Meta has no consent mode, so the pixel simply doesn't
mount without consent, and `setConsent` also calls `fbq('consent','revoke')` to
stop a pixel already loaded in this page view. Reject must stay as easy as
accept (no cookie wall, no pre-ticked box, no dismiss-means-yes). `/cookies`
and `/privacy` describe exactly this — update them together with any tag
change.

## Roadmap / open seams

- Scheduling shipped (`/apps/schedule`, live in `APP_LINEUP`); the dashboard's
  "On the way" section is now whatever a trade still has at `status !== 'live'`
- Known gaps: AI photos aren't stored/shown on estimates; the
  `auto_review_request` self-heal retry in `business-write.ts` can be removed
  once migration 0008 is confirmed applied.
