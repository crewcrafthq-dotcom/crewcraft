# Meta Ads Pack — Toolbelt by Crewcraft

Everything you paste into Meta Ads Manager. The ads below click through to the
landing page already live at **https://crewcraftapp.com/lp/meta** — that page
exists because every ad needs a destination URL; this file is the ad itself.

Add UTM tags to the destination so you can tell ads apart in analytics:

```
https://crewcraftapp.com/lp/meta?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

---

## Campaign setup (recommended)

| Setting | Value | Why |
| --- | --- | --- |
| Objective | Sales (conversion: Sign-up) — fallback: Leads | Optimizes for people who actually sign up, not clickers |
| Conversion event | Pixel `SignUp` (fire on /onboarding) | Note: only the Google tag is installed today — add the Meta Pixel before scaling spend |
| Budget to start | $20–30/day, one campaign, Advantage+ audience | Enough data to exit learning in ~1 week |
| Placements | Advantage+ (auto) | Meta finds cheap reels/stories inventory |
| Audience seed | Interests: HVAC, plumbing, electrician, roofing, general contractor, ServiceTitan, Jobber, Housecall Pro + job title where available. Age 25–55. | The tools they already use are the strongest signal |
| Later | Lookalike 1–3% of signups once ≥100 signups | Best scaling audience |

**Creative assets already in `/public`:** `ad-square.png` (1:1 feed),
`ad-landscape.png` (1.91:1), `video-frame-1.png` / `video-frame-2.png`,
`showcase.mp4` (35s square demo — the strongest asset; captions on, sound-off safe).

---

## Ad 1 — "9 PM" (pain hook, lead with the demo video)

**Creative:** `showcase.mp4` (or square image `ad-square.png`)

**Primary text (A):**
> Still typing quotes at 9 PM?
>
> Type the job in plain English — "Replace a 40-gal water heater, haul off the old one" — and Toolbelt writes the estimate. Labor, materials, totals, your logo. Under a minute.
>
> 3 estimates free. No credit card.

**Primary text (B):**
> The job ends at five. The paperwork doesn't.
>
> Toolbelt turns three typed sentences into a branded estimate — priced, totaled, and sent from the driveway. Built for HVAC, plumbing, electrical & roofing.
>
> Try it on your next real job. 3 free, no card.

**Headline (≤40):** `Send a branded estimate in 60 seconds`
**Description (≤30):** `3 free estimates. No card.`
**CTA button:** Sign Up

---

## Ad 2 — "Looks like you hired a designer" (proof/vanity angle)

**Creative:** `ad-landscape.png` or a before/after carousel: scribbled note → finished estimate (frames exist as `video-frame-1/2.png`)

**Primary text:**
> Customers say it looks like I hired a designer. I typed three sentences." — Dave P., plumber, Akron
>
> Your logo, your license, your prices — on an estimate a homeowner trusts. The AI drafts the line items; you stay in charge of every number.
>
> Free to try on 3 real jobs.

**Headline:** `The estimate that wins the job`
**Description:** `Your logo. Your numbers.`
**CTA button:** Sign Up

---

## Ad 3 — "Not another CRM" (objection killer, retargeting)

**Audience:** retarget site visitors / video viewers 25%+

**Primary text:**
> It's not another CRM. It does one thing: estimates.
>
> Keep ServiceTitan, Jobber, or the notebook on your dash. Toolbelt is the fast lane for the part you hate — writing the quote. 60 seconds, typed like a text message, sent before you leave the driveway.
>
> $19–29/mo flat after 3 free. Cancel anytime.

**Headline:** `Quotes in 60s. Keep your software.`
**Description:** `Flat price. Cancel anytime.`
**CTA button:** Get Started

---

## Compliance checklist (why ads get rejected)

- Landing page has Privacy Policy + Terms links ✔ (already on /lp/meta)
- No before/after income claims, no "guaranteed jobs" language ✔
- Don't call out personal attributes ("Are YOU a struggling contractor?" ✗ —
  the copy above stays on the work, not the person) ✔
- Testimonials must be real people. Mike R. / Dave P. / Carlos M. / Tanya W. are
  **illustrative personas** right now — swap in real customer quotes (with
  permission) before using them in paid ads, or run the ads without quotes.

## Measurement

1. Install the **Meta Pixel** (base + `SignUp` event on /onboarding — mirror of
   the Google `SignupConversion` component, ~10 lines; ask Claude to add it).
2. Judge creative on **cost per signup**, not CPC. Kill an ad after ~$40 spend
   with zero signups; scale the winner +20%/every 3 days.
