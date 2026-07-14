# Google SEO Guide — crewcraftapp.com

Practical, ordered by impact, specific to this site (Next.js on Vercel, one marketing
page + `/privacy` + `/terms`, noindex ad pages under `/lp/*`). Written July 13, 2026.

---

## 0. What's already in place (don't redo)

- `metadataBase`, unique title/description, OG + Twitter cards, canonical
- `robots.txt` (app/api/auth blocked, sitemap referenced) and `sitemap.xml`
- JSON-LD: `Organization` + `SoftwareApplication` with offers (incl. Free tier)
- HTTPS on Vercel, mobile-first responsive, `noscript` fallback for scroll-reveal content
- Server-rendered trade sections (`#hvac`, `#plumbing`, `#electrical`, `#roofing`) —
  crawlable trade-specific copy, the on-page foundation for trade keywords
- Ad landing pages (`/lp/meta`, `/lp/google`) are `noindex` so they never compete
  with the homepage

## 1. Week one — plumbing (do these once, ~1 hour)

1. **Google Search Console**: add property `crewcraftapp.com` (Domain property via
   DNS TXT on your registrar). Submit `https://crewcraftapp.com/sitemap.xml`.
   This is the single most important SEO action — without it you're blind.
2. **Request indexing** of `/` after each significant content change (GSC → URL
   inspection → Request indexing).
3. **Bing Webmaster Tools**: import from GSC (2 clicks, free traffic, powers Copilot).
4. **Check rendering**: GSC URL Inspection → View crawled page → confirm the trade
   sections and pricing appear in the rendered HTML (they're server-rendered, so
   they should).
5. **Rich Results Test** (search.google.com/test/rich-results) on `/` — confirm the
   `SoftwareApplication` schema parses; fix anything flagged.

## 2. Keyword map (what this site can actually win)

One page can't rank for everything. Current homepage targets the **category head
terms**; the trade sections capture **trade modifiers**; future pages win the rest.

| Intent | Keywords | Where it ranks |
| --- | --- | --- |
| Category | contractor estimate software, estimate app for contractors, quote software for contractors | Homepage |
| Trade | hvac estimate software, plumbing estimate app, electrical estimating software, roofing estimate app | Homepage trade sections now → dedicated pages later (step 4) |
| Problem | how to write an hvac estimate, plumbing estimate example, roofing estimate per square | Blog/templates (step 5) |
| Competitor | jobber alternative for estimates, servicetitan too expensive, housecall pro alternative | Comparison pages (step 5) |
| Brand | toolbelt estimates, crewcraft app | Homepage (already wins) |

Rule: **one primary keyword per URL.** Never create two pages chasing the same term.

## 3. On-page tuning of the current homepage (30 min)

- Title is `Toolbelt by Crewcraft — Estimates in 60 seconds`. Brand-first is a choice;
  a keyword-first variant will rank better while the brand is unknown:
  `Contractor Estimate Software — Branded Quotes in 60s | Toolbelt`. Swap once you
  care more about search than brand recall (measure CTR in GSC either way).
- H1 stays benefit-led — good. The trade sections give each trade an H3 with real
  trade vocabulary (changeout, repipe, 200A panel, squares) — this is what Google's
  language models use to match trade queries. Keep that language dense and real.
- Every image needs descriptive `alt`. The estimate previews are DOM (good — real
  text, not screenshots).
- Internal anchors (`#hvac` etc.) don't rank separately, but Google shows them as
  jump links in results — free SERP real estate. Nav + footer already link them.

## 4. The next four pages to build (highest SEO ROI)

Dedicated, indexable per-trade landing pages:

- `/hvac-estimate-software`
- `/plumbing-estimate-software`
- `/electrical-estimate-software`
- `/roofing-estimate-software`

Each: keyword-matched title + H1, the existing trade section content expanded
(pains, 3–4 job examples with real numbers, the trade toolkit, trade testimonial,
FAQ with trade-specific questions), pricing summary, CTA. 600–900 words of real
content each — reuse `TRADE_SECTIONS` data, don't hide it behind tabs. Add all four
to the sitemap and link them from the footer ("Built for" column) and from each
trade section ("More for HVAC →").

These four pages are where trade-modifier searches (the highest-intent, lowest-
competition queries you can win this year) should land.

## 5. Content that earns links and long-tail traffic (1–2/month is enough)

Priority order:

1. **Free estimate templates** — `/templates/hvac-estimate-template` etc. Searches
   like "hvac estimate template free" are people one step before wanting your
   product. Offer the PDF free, no email wall (link magnet), CTA: "or type the job
   and let the AI fill it in."
2. **"How to price X" guides** — how to price a water heater install, panel upgrade,
   roof replacement per square. Written from contractor experience, with real number
   ranges. These earn trade-forum links (Reddit r/HVAC, r/electricians, ContractorTalk).
3. **Comparison pages** — "Toolbelt vs typing it yourself", "Jobber alternative for
   estimates only". Honest tone (you already do this in the FAQ): you're not a CRM
   replacement, you're the fast quoting lane.

## 6. Authority (backlinks that are actually gettable)

- **Directories, week one**: Product Hunt launch, AlternativeTo, SaaSHub, G2 +
  Capterra listings (free), There's An AI For That. All dofollow-adjacent, all
  discovery surfaces buyers actually use.
- **Trade communities**: genuinely participate in r/HVAC, r/Plumbing, r/electricians,
  ContractorTalk; share the free templates when relevant. No drive-by link drops.
- **Crewcraft.ai** (the parent brand) should link prominently to crewcraftapp.com —
  it's your most relevant, fully-controlled backlink.
- **Ask early customers** with websites to mention the tool ("Estimates powered by
  Toolbelt" footer link is a natural ask alongside the Review-Getter roadmap).

## 7. Performance & Core Web Vitals

- Vercel + server components = good baseline. Watch these:
  - `showcase.mp4` is only loaded when the demo modal opens (`preload="metadata"`) — keep it that way.
  - Fonts use `next/font` with `display: swap` — good, no layout shift.
  - Keep hero free of large images; the estimate preview is DOM, which is ideal (LCP is text).
- Check **GSC → Core Web Vitals** monthly; run PageSpeed Insights after any redesign.
  Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1 on **mobile**.

## 8. AI search (bonus, 30 min)

A growing share of "best estimate software" answers come from ChatGPT/Claude/
Perplexity/AI Overviews. Cheap wins:

- Keep the FAQ in real question form (already done) — FAQs are what AI answers cite.
- Publish an `llms.txt` at the root summarizing what Toolbelt is, who it's for,
  pricing, and links (plain markdown).
- The honest, specific claims style you already use ("3 free, no card, $19–29 flat")
  is exactly what AI engines quote — keep numbers concrete.

## 9. Measure (monthly, 20 minutes)

- **GSC Performance**: impressions + CTR for the keyword groups in the map above.
  Expect impressions to move in 4–8 weeks, clicks in 8–16. SEO compounds slowly —
  paid ads carry acquisition until then.
- **GSC Coverage**: all indexable pages green, `/lp/*` correctly excluded ("noindex").
- **Vercel Analytics**: watch which sections convert (scroll + CTA clicks) and feed
  that back into copy.

## 10. Things to NOT do

- Don't buy links or "SEO packages" — a 5-page SaaS site with paid links is how you
  get filtered.
- Don't spin up hundreds of thin programmatic pages ("estimate software in {city}")
  — you have no city-specific content; that's a scaled-content penalty risk.
- Don't chase "AI estimate generator" style keywords with separate near-duplicate
  pages — one strong page per intent.
- Don't noindex/canonicalize anything without checking GSC coverage first.
