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
  editor (0001–0006 are live). New schema = new numbered migration file, and
  tell the owner to run it.
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
`account.updated`).

## Architecture rules — do not regress these

1. **All money math goes through `computeTotals`** (`src/lib/estimates.ts`,
   integer cents). Never trust AI output or client-side arithmetic for totals.
2. **Public pages/PDFs** (`/e/[token]`, `/api/public/*`) read via the
   service-role client keyed by unguessable `public_token`. Both server
   Supabase clients (`src/lib/supabase/server.ts`, `admin.ts`) pin fetch to
   `cache: 'no-store'` — Next's Data Cache once served stale accepted-state to
   homeowners. Keep it that way.
3. **Two themes on purpose**: the contractor app is the dark night/mist theme;
   the public customer page is deliberately light (`bg-cream text-navy`). Each
   trade has its own accent via CSS vars (`src/lib/trades.ts`).
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
(`businesses.review_link`) · get-paid fallbacks (`payment_link`,
`payment_instructions`).

## Roadmap / open seams

- **Scheduling** — the one "Soon" card on the dashboard
- **Toolbelt Voice** — voice-to-estimate; the job-description box is the seam
- **Toolbelt Supplements** — roofing insurance supplements
- Known gaps: AI photos aren't stored/shown on estimates; review requests are
  manual-only (no auto-send after paid).
