# Setup — Crewcraft Estimate Builder

Everything you need to take this from a fresh clone to a running app. Plan on
~30 minutes the first time. You'll create four accounts (Supabase, Anthropic,
Stripe, Resend) and paste their keys into one `.env.local` file.

> Secrets stay server-side. `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
> and every `STRIPE_*` value must never be exposed to the browser. Only the
> `NEXT_PUBLIC_*` vars are safe on the client.

---

## 0. Prerequisites

- Node.js 18.18+ (20 LTS recommended) and npm.
- Accounts: [Supabase](https://supabase.com), [Anthropic](https://console.anthropic.com),
  [Stripe](https://dashboard.stripe.com), [Resend](https://resend.com). Vercel for deploy.

```bash
npm install
cp .env.example .env.local   # then fill it in as you go below
```

---

## 1. Supabase (Postgres, Auth, Storage)

1. **Create a project.** Copy these into `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (Project Settings → API) → `SUPABASE_SERVICE_ROLE_KEY`

2. **Run the migrations** in order. In the dashboard go to **SQL Editor**, paste
   and run each file:
   - `supabase/migrations/0001_init.sql` — tables + indexes
   - `supabase/migrations/0002_rls.sql` — Row Level Security policies
   - `supabase/migrations/0003_storage.sql` — the public `logos` bucket + policies
   - `supabase/migrations/0004_apps.sql` — accept/e-sign, invoices, reminders,
     review requests, get-paid settings, and the price book

   (Or with the Supabase CLI: `supabase db push`.)

3. **Auth → magic link.** Authentication → Providers → **Email**: enable it and
   turn on "Email OTP / Magic Link". Then Authentication → **URL Configuration**:
   - Site URL: your app URL (e.g. `http://localhost:3000`)
   - Redirect URLs: add `http://localhost:3000/auth/callback` (and your production
     `https://yourdomain.com/auth/callback` later).

That's the whole datastore. The `logos` bucket is public-read so logos can show on
the PDF and the public estimate page; writes are restricted to each user's folder.

---

## 2. Anthropic (the line-item generator)

1. Create an API key in the [console](https://console.anthropic.com/settings/keys).
2. Set `ANTHROPIC_API_KEY` in `.env.local`.

The model is pinned in one place — `AI_MODEL` in `src/lib/config.ts`
(`claude-sonnet-4-6`). Switching to the cheaper `claude-haiku-4-5` is a one-line
change there.

---

## 3. Resend (sending the estimate email)

1. Add and verify your sending domain (Resend → Domains → add DNS records).
2. Create an API key → `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` to a verified address on that domain, e.g.
   `estimates@yourdomain.com`.

> `RESEND_FROM_EMAIL` is the one env var beyond the spec's §9 list — Resend
> requires a verified "from" address. For quick local testing you can use
> Resend's `onboarding@resend.dev`, which only delivers to your own account email.

---

## 4. Stripe (Pro subscription)

1. **Create three recurring Prices** (Products → add product, or the Prices API).
   Copy each price ID (`price_…`) into `.env.local`:
   - Pro monthly, $29/mo → `STRIPE_PRICE_PRO_MONTHLY`
   - Pro annual, $288/yr (shown as $24/mo) → `STRIPE_PRICE_PRO_ANNUAL`
   - Founding, $19/mo → `STRIPE_PRICE_FOUNDING`

2. **Secret key** (test mode is fine to start) → `STRIPE_SECRET_KEY`.

3. **Customer Portal.** Settings → Billing → Customer portal → activate it
   (needed for "Manage billing").

4. **Webhook.** Developers → Webhooks → add endpoint
   `https://yourdomain.com/api/stripe/webhook`, subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

   Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.

   **Local testing:** use the Stripe CLI instead of a public URL —
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   and use the `whsec_…` it prints as `STRIPE_WEBHOOK_SECRET`.

---

## 5. App URL

Set `NEXT_PUBLIC_APP_URL` (no trailing slash) — `http://localhost:3000` for dev,
your real domain in production. It's used for magic-link redirects, public
estimate links, and Stripe return URLs.

---

## 6. Run it

```bash
npm run dev      # http://localhost:3000
```

Click through: log in (magic link) → set up your business → New estimate →
describe a job → **Build line items** → edit → **Save draft** → Download PDF →
Copy link / Email. Open the public link in a private window to watch the status
flip to **Viewed**.

---

## 7. Verify (no cloud accounts required)

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run test        # vitest — totals + AI JSON parser guardrails
npm run pdf:smoke   # renders a sample PDF to ./scratch/estimate-smoke.pdf
npm run build       # production build
```

---

## 8. Deploy on Vercel

1. Import the repo. Framework preset: **Next.js** (no special build settings).
2. Add **every** variable from `.env.example` in Project Settings → Environment
   Variables. Set `NEXT_PUBLIC_APP_URL` to the production domain.
3. After the first deploy, update:
   - Supabase **Redirect URLs** → add `https://yourdomain.com/auth/callback`
   - Stripe **webhook** endpoint → `https://yourdomain.com/api/stripe/webhook`
4. The PDF and email routes run on the Node.js runtime (already set via
   `export const runtime = 'nodejs'`), so they work on Vercel functions as-is.
5. **Follow-up reminders (optional).** Set a `CRON_SECRET` env var (any long
   random string) and Vercel will call `/api/cron/reminders` daily at 15:00 UTC
   (schedule in `vercel.json`) with `Authorization: Bearer $CRON_SECRET`. The
   sweep nudges customers who haven't answered a sent estimate in 3 days, at
   most twice per estimate. Without `CRON_SECRET` the route stays off; manual
   "Send reminder" in the editor works either way.
