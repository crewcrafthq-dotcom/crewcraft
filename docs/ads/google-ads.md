# Google Ads Pack — Toolbelt by Crewcraft

Everything you paste into Google Ads. Ads click through to the landing page
already live at **https://crewcraftapp.com/lp/google** — the page is the
destination; this file is the campaign.

Final URL with tracking:

```
https://crewcraftapp.com/lp/google?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}
```

**Before spending:** create a conversion action (Goals → Conversions → New →
Website → "Sign-up"), copy its `AW-…/…` send-to id into the
`NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL` env var on Vercel, and redeploy. The site
already fires the event on /onboarding — without the label, nothing counts.

---

## Campaign structure

One Search campaign, 2 ad groups, exact + phrase match. Start $25–40/day,
bidding "Maximize conversions" (switch to tCPA after ~30 conversions).
Geo: US (or your target states). Networks: **Search only** — untick Display.

### Ad group 1 — Category

```
[contractor estimate software]     "contractor estimate software"
[estimate app for contractors]     "estimate app for contractors"
[estimating software for contractors]
[quote software for contractors]   "estimate maker for contractors"
[estimate builder app]
```

### Ad group 2 — Trade-specific

```
[hvac estimate software]        "hvac estimating app"
[plumbing estimate software]    "plumbing estimate app"
[electrical estimating software]
[roofing estimate software]     "roofing estimate app"
```

### Negative keywords (campaign level)

```
free template, template, excel, pdf download, salary, jobs, hiring,
training, course, certification, how to become, diy, homeowner
```

(Template/excel searchers want a document, not software — let SEO catch them.)

---

## Responsive Search Ad (one per ad group — pin nothing, let Google mix)

**Headlines (each ≤30 chars):**

| # | Headline | Chars |
| --- | --- | --- |
| 1 | Contractor Estimate Software | 28 |
| 2 | Send a Quote in 60 Seconds | 26 |
| 3 | 3 Free Estimates — No Card | 26 |
| 4 | Type the Job, Get the Quote | 27 |
| 5 | Branded PDF Estimates | 21 |
| 6 | AI Line Items, Your Prices | 26 |
| 7 | Quote From the Driveway | 23 |
| 8 | Flat Pricing From $19/mo | 24 |
| 9 | Estimate App for Contractors | 28 |
| 10 | Stop Typing Quotes at Night | 27 |
| 11 | Works With Your Software | 24 |
| 12 | Set Up in Two Minutes | 21 |
| 13 | See When Customers Open It | 26 |
| 14 | Built for the Trades | 20 |
| 15 | No Contracts, Cancel Anytime | 28 |

For ad group 2, swap #1/#9/#14 for trade versions: `HVAC Estimate Software` (22),
`Plumbing Estimate App` (21), `Roofing Quotes in 60 Seconds` (28),
`Electrical Estimating Tool` (26).

**Descriptions (each ≤90 chars):**

| # | Description | Chars |
| --- | --- | --- |
| 1 | Type the job in plain English. AI drafts labor & materials. Send a branded PDF in 60s. | 87 |
| 2 | 3 estimates free, no credit card. Then one flat price with every new app included. | 83 |
| 3 | Built for HVAC, plumbing, electrical & roofing. Your logo and license on every quote. | 86 |
| 4 | The math is computed, never guessed. You set the final price. Cancel anytime. | 78 |

**Paths:** `crewcraftapp.com/estimates/contractors` → path1: `estimates`, path2: `contractors`

---

## Assets (extensions)

**Sitelinks** (→ homepage anchors):
- `Pricing` — Flat plans from $19/mo → https://crewcraftapp.com/#pricing
- `For HVAC` — Quote changeouts fast → https://crewcraftapp.com/#hvac
- `For Roofing` — Price by the square → https://crewcraftapp.com/#roofing
- `How It Works` — Three steps, 60s → https://crewcraftapp.com/#how

**Callouts:** `No Credit Card` · `3 Free Estimates` · `Flat Monthly Price` ·
`Cancel Anytime` · `Built for the Trades` · `Works on Your Phone`

**Structured snippet:** Types: `HVAC Estimates, Plumbing Estimates, Electrical
Estimates, Roofing Estimates`

---

## Quality Score notes (why /lp/google is built the way it is)

- H1 mirrors the top keyword ("Estimate software built for contractors") →
  message match → higher QS → cheaper clicks.
- Pricing is on the page → unqualified clickers self-filter before you pay for
  their curiosity twice.
- Page is statically prerendered (fast LCP) and mobile-first → landing page
  experience score.
- Privacy/Terms in the footer → required for ad approval and Trust.

## First-month checklist

1. Conversion label env var set, one test signup shows in Google Ads (24–48h lag).
2. Search terms report weekly → add junk queries as negatives.
3. Judge on cost per signup; pause keywords with 30+ clicks and 0 signups.
4. Don't touch bidding during the first 2 weeks (learning period).
