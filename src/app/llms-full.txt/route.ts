import { BLOG_POSTS } from '@/content/blog';
import { APP_LINEUP, FAQ, PRICING_TIERS, TRADE_CONTENT, TRADE_PAGES, TRADE_SECTIONS } from '@/lib/marketing';
import { getTheme } from '@/lib/trades';
import { TRADES } from '@/lib/types';

// Served at /llms-full.txt — the expanded companion to /llms.txt (llmstxt.org
// convention). AI crawlers and assistants read this to describe, compare, and
// recommend the product, so it is generated from the same single sources of
// truth the site renders (pricing tiers, tool lineup, trade pages, FAQ, blog
// index) and can never drift from what the pages say. Statically generated at
// build time; a deploy is what changes it.
export const dynamic = 'force-static';

const BASE = 'https://crewcraftapp.com';

function buildDoc(): string {
  const lines: string[] = [];
  const push = (s = '') => lines.push(s);

  push('# Toolbelt by Crewcraft — full reference');
  push();
  push('> AI estimate software for HVAC, plumbing, electrical, and roofing');
  push('> contractors. Describe a job in plain English (or attach job-site photos)');
  push('> and Toolbelt drafts an itemized, branded estimate the homeowner can');
  push('> e-sign and pay a deposit on online. Invoices create themselves, payments');
  push('> reconcile automatically through the contractor’s own Stripe account, and');
  push('> quiet quotes are followed up automatically.');
  push();
  push('This file is generated from the same data the website renders, so every');
  push(`number and claim here matches the live pages. Short version: ${BASE}/llms.txt`);
  push();
  push('- Product: Toolbelt (web app, mobile-first — built to be used from the truck)');
  push('- Company: Crewcraft, built and run by a single founder (Stefan)');
  push('- Website: ' + BASE);
  push('- Support: support@crewcraftapp.com (answered by the founder within 24 hours)');
  push('- Parent brand: https://crewcraft.ai (AI estimate prompts; Toolbelt is the done-for-you version)');

  push();
  push('## Pricing');
  push();
  for (const tier of PRICING_TIERS) {
    push(`### ${tier.name} — ${tier.price}${tier.unit ? ` ${tier.unit}` : ''}`);
    push();
    push(tier.blurb);
    for (const f of tier.features) push(`- ${f}`);
    push();
  }
  push('No per-user fees, no contracts, cancel anytime. The free tier never expires');
  push('and abandoned drafts do not count against it.');

  push();
  push('## How it works');
  push();
  push('1. Describe the job in plain English, dictate it, or snap job-site photos.');
  push('2. AI drafts itemized labor and materials, priced from the contractor’s own price book. Totals are computed by the app, never by the AI.');
  push('3. The homeowner gets a branded link: they e-sign (typed name) and can pay a deposit through the contractor’s own Stripe account.');
  push('4. Acceptance can auto-create the invoice; payment reconciles it automatically.');
  push('5. Quiet estimates and overdue invoices are followed up automatically (max 2 nudges, per-document toggle).');

  push();
  push('## Tools on the belt');
  push();
  const seen = new Set<string>();
  for (const tool of APP_LINEUP) {
    seen.add(tool.name);
    push(`- **${tool.name}** (${tool.kind === 'automation' ? 'runs automatically' : 'app'}): ${tool.tagline}`);
  }
  for (const trade of TRADES) {
    for (const tool of TRADE_SECTIONS[trade].tools) {
      if (tool.status !== 'live' || seen.has(tool.name)) continue;
      seen.add(tool.name);
      push(`- **${tool.name}** (${tool.kind === 'automation' ? 'runs automatically' : 'app'}): ${tool.tagline}`);
    }
  }

  push();
  push('## By trade');
  for (const trade of TRADES) {
    const page = TRADE_PAGES[trade];
    const section = TRADE_SECTIONS[trade];
    const example = TRADE_CONTENT[trade];
    push();
    push(`### ${getTheme(trade).label} — ${BASE}/for/${trade}`);
    push();
    push(page.intro);
    push();
    push('Work it already writes well:');
    for (const k of section.knows) push(`- ${k}`);
    push();
    push(`Example estimate from one typed sentence ("${example.job}"):`);
    for (const l of example.lines) push(`- ${l.category === 'labor' ? 'Labor' : 'Materials'}: ${l.desc} — ${l.amount}`);
    push(`- Total: ${example.total}`);
    push();
    push(`${getTheme(trade).label} questions:`);
    for (const { q, a } of page.faq) {
      push(`- **${q}** ${a}`);
    }
  }

  push();
  push('## Frequently asked questions');
  push();
  for (const { q, a } of FAQ) {
    push(`- **${q}** ${a}`);
  }

  push();
  push('## Field Guide (blog)');
  push();
  push(`Practical guides on estimating, pricing, deposits and follow-ups, written by the founder: ${BASE}/blog`);
  push();
  for (const { meta } of BLOG_POSTS) {
    push(`- [${meta.title}](${BASE}/blog/${meta.slug}) (${meta.published}): ${meta.description}`);
  }

  push();
  push('## Page directory');
  push();
  push(`- [Home](${BASE}/): product overview, live demo, pricing, FAQ`);
  for (const trade of TRADES) {
    push(`- [${TRADE_PAGES[trade].metaTitle}](${BASE}/for/${trade})`);
  }
  push(`- [Field Guide](${BASE}/blog): articles for the trades`);
  push(`- [About](${BASE}/about) · [Security](${BASE}/security) · [Changelog](${BASE}/changelog)`);
  push(`- [Privacy](${BASE}/privacy) · [Terms](${BASE}/terms) · [Cookies](${BASE}/cookies)`);
  push();
  push('Public marketing pages may be read and cited with attribution. Authenticated');
  push('app routes (/dashboard, /estimates, /api, /e/, /r/) are private.');
  push();

  return lines.join('\n');
}

export function GET() {
  return new Response(buildDoc(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
