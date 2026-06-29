# Crewcraft Estimate Builder

Turn a plain-English job into a clean, branded estimate PDF in under a minute.
A contractor types what the job is, the AI drafts itemized labor + materials, and
they send a polished estimate the homeowner opens on their phone.

This is the first software product for [Crewcraft](https://crewcraft.ai) — the
done-for-you version of the estimate prompts they already sell to HVAC, plumbing,
electrical, and roofing contractors.

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
| `npm run test` | Vitest — totals math + AI JSON parser |
| `npm run pdf:smoke` | Render a sample PDF to `./scratch/` |

## How it's laid out

```
src/
  app/                 # routes (App Router)
    api/               # ai/generate, estimates/*/pdf|send, public/*/pdf, stripe/*
    estimates/[id]/    # the editor
    e/[token]/         # public, read-only estimate (no login)
  components/          # UI primitives, BusinessForm, estimate editor parts
  lib/
    ai/                # §5 system prompt + parse/validate (parseGenerated is unit-tested)
    pdf/               # @react-pdf document + font registration + render
    estimates.ts       # computeTotals — the single source of truth for all math
    supabase/          # browser / server / service-role clients
    trades.ts          # per-trade accent tokens (CSS vars + PDF hex)
supabase/migrations/   # schema, RLS, storage bucket
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

## Out of scope (v1)

Voice input (a clean seam is left on the job-description box), invoicing/payment
collection, scheduling, CRM, teams, template libraries, photo attachments.
