# Crewcraft

Software for HVAC, plumbing, electrical, and roofing contractors, built around
one flow: describe a job in plain English (or snap photos of it), send a
branded estimate the homeowner opens on their phone, get it signed, invoiced,
and paid.

This started as the Estimate Builder — the done-for-you version of the estimate
prompts [Crewcraft](https://crewcraft.ai) already sells — and has grown into a
small toolbelt:

- **Estimate Builder** — AI drafts itemized labor + materials from a plain-English
  description and/or job-site photos; optional Good/Better/Best three-option mode.
- **Accept & e-sign** — homeowners approve (typed-name signature) or decline right
  on the public estimate page; the contractor is emailed and the signature lands
  on the PDF.
- **Invoices** — one tap converts an accepted estimate; due dates, PAID stamp,
  outstanding/overdue tracking, "pay online" link for deposits and balances.
- **Follow-ups** — manual one-tap reminders plus an optional daily cron that
  nudges quiet customers after 3 days (max twice, per-estimate toggle).
- **Customers** — CRM-lite built automatically from the paperwork: history,
  quoted/won/collected per customer.
- **Analytics** — win rate, average ticket, quoted vs won by month, pipeline.
- **Price Book** — saved rates and materials; the AI prices every draft with them.
- **Review requests** — post-job "leave us a review" email with your Google link.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — Postgres, magic-link auth, Row Level Security, Storage (logos)
- **Anthropic** (`@anthropic-ai/sdk`, `claude-sonnet-4-6`) — server-only line-item generator
- **@react-pdf/renderer** — branded PDF with embedded Poppins
- **Stripe** — Checkout, Customer Portal, webhooks
- **Resend** — estimate email

Mobile-first: contractors use this on a phone.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in keys — see SETUP.md
npm run dev
```

Provisioning the four services (Supabase, Anthropic, Stripe, Resend) is walked
through step-by-step in **[SETUP.md](./SETUP.md)**.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `next lint` |
| `npm run test` | Vitest — totals math, AI JSON parsers, customer grouping |
| `npm run pdf:smoke` | Render sample estimate + invoice PDFs to `./scratch/` |

## How it's laid out

```
src/
  app/                 # routes (App Router)
    api/               # ai/generate, estimates/*/(pdf|send|remind|review-request),
                       # public/*/(pdf|respond), pricebook, cron/reminders, stripe/*
    estimates/[id]/    # the estimate editor
    invoices/          # invoice list + editor (same editor component, invoice mode)
    customers/         # CRM-lite list + per-customer history
    analytics/         # win rate, quoted vs won, pipeline
    pricebook/         # saved rates & materials
    e/[token]/         # public estimate/invoice page (no login; accept/e-sign lives here)
  components/          # UI primitives, BusinessForm, estimate editor parts
  lib/
    ai/                # §5 system prompt + parse/validate (parsers are unit-tested)
    pdf/               # @react-pdf document (estimate + invoice) + fonts + render
    email/             # Resend seam + all templates (estimate, invoice, reminder, review)
    estimates.ts       # computeTotals — the single source of truth for all math
    customers.ts       # derives the customer roll-up from documents (unit-tested)
    supabase/          # browser / server / service-role clients
    trades.ts          # per-trade accent tokens (CSS vars + PDF hex)
supabase/migrations/   # schema, RLS, storage bucket, apps expansion (0004)
```

## Design notes

- **Crewcraft V3 Clean** (`§8`): beige `#F2EBE0` background, navy/beige neutrals,
  Poppins. The trade accent is set by the business's trade and applied through CSS
  variables so the whole app + PDF render in that color.
- **Totals are never trusted from the model.** Every line total and running total
  is recomputed in `computeTotals` (integer cents) from quantity × unit price.
- **AI output is treated as suggestions.** The route strips stray code fences,
  parses, and zod-validates; on failure the editor shows a friendly retry message
  and the contractor can enter items by hand. Assumptions are surfaced above the
  line items for review.

## Out of scope (for now)

Voice input (a clean seam is left on the job-description box), scheduling,
teams, template libraries, and in-app card processing (payments run through the
contractor's own payment link — e.g. a Stripe Payment Link — set in Settings).
