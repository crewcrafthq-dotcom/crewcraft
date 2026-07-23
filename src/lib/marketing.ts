import type { PlanKey } from '@/lib/config';
import type { Trade } from '@/lib/types';

export interface PreviewLine {
  category: 'labor' | 'materials';
  desc: string;
  amount: string;
}

export interface TradeContent {
  job: string; // plain-English job a contractor would type
  lines: PreviewLine[];
  total: string;
}

/** Per-trade example used by the hero, trade selector, and output showcase. */
export const TRADE_CONTENT: Record<Trade, TradeContent> = {
  hvac: {
    job: 'Replace a 3-ton AC condenser and coil, reconnect the lineset, haul off the old unit.',
    lines: [
      { category: 'labor', desc: 'Condenser & coil swap, lineset reconnect', amount: '$640.00' },
      { category: 'materials', desc: '3-ton condenser', amount: '$1,850.00' },
      { category: 'materials', desc: 'Evaporator coil', amount: '$420.00' },
    ],
    total: '$2,910.00',
  },
  plumbing: {
    job: 'Replace a 40-gallon gas water heater in the garage, haul off the old one.',
    lines: [
      { category: 'labor', desc: 'Remove & install, test for leaks', amount: '$320.00' },
      { category: 'materials', desc: '40-gal gas water heater', amount: '$720.00' },
      { category: 'materials', desc: 'Fittings & gas connector', amount: '$85.00' },
    ],
    total: '$1,125.00',
  },
  electrical: {
    job: 'Swap a 100A panel for 200A service, bring grounding up to code, coordinate the permit.',
    lines: [
      { category: 'labor', desc: 'Panel swap, rewire, permit coordination', amount: '$880.00' },
      { category: 'materials', desc: '200A main panel', amount: '$420.00' },
      { category: 'materials', desc: 'Breakers & grounding kit', amount: '$180.00' },
    ],
    total: '$1,480.00',
  },
  roofing: {
    job: 'Tear off and replace 22 squares of architectural shingles, new flashing and 2 sheets of decking.',
    lines: [
      { category: 'labor', desc: 'Tear-off & install, 22 sq', amount: '$4,400.00' },
      { category: 'materials', desc: 'Architectural shingles, 22 sq', amount: '$2,200.00' },
      { category: 'materials', desc: 'Flashing & decking', amount: '$360.00' },
    ],
    total: '$6,960.00',
  },
};

/** The example business shown on each trade's preview estimate. */
export const TRADE_BUSINESS: Record<Trade, { name: string; license: string; customer: string }> = {
  hvac: { name: 'Summit Heating & Air', license: 'M-12 4471', customer: 'Dana R.' },
  plumbing: { name: 'Akron Plumbing Co.', license: 'P-08 9920', customer: 'Lori K.' },
  electrical: { name: 'Bright Spark Electric', license: 'C-10 9988', customer: 'Sam D.' },
  roofing: { name: 'Ridgeline Roofing', license: 'GC 33120', customer: 'Pat W.' },
};

export type ToolStatus = 'live' | 'next' | 'planned';

export type ToolIconKey =
  | 'estimates'
  | 'esign'
  | 'invoices'
  | 'customers'
  | 'analytics'
  | 'pricebook'
  | 'voice'
  | 'supplements'
  | 'followup'
  | 'reviews'
  | 'scheduling'
  | 'maintenance'
  | 'reminders'
  | 'log'
  | 'waterheater'
  | 'afterhours'
  | 'permits'
  | 'loadcalc'
  | 'options'
  | 'storm'
  | 'photos'
  | 'materials';

export interface ToolItem {
  name: string;
  tagline: string;
  status: ToolStatus;
  icon: ToolIconKey;
  /** `app` = you open it and use it; `automation` = it runs for you. */
  kind: 'app' | 'automation';
  /** In-app route for live tools (dashboard links to it). */
  href?: string;
}

/** What's on the belt for every trade. Statuses are honest — live means live. */
export const APP_LINEUP: ToolItem[] = [
  { name: 'Toolbelt Estimates', tagline: 'Type it, dictate it, or snap photos — send a branded, e-signable estimate.', status: 'live', icon: 'estimates', kind: 'app', href: '/estimates' },
  { name: 'Invoices', tagline: 'Accepted estimates become invoices — automatically, if you want.', status: 'live', icon: 'invoices', kind: 'app', href: '/invoices' },
  { name: 'Follow-up Engine', tagline: 'Quotes and overdue invoices that chase themselves so you don’t.', status: 'live', icon: 'followup', kind: 'automation' },
  { name: 'Customers', tagline: 'Every customer and job history, built from your paperwork.', status: 'live', icon: 'customers', kind: 'app', href: '/customers' },
  { name: 'Analytics', tagline: 'Win rate, average ticket, quoted vs won.', status: 'live', icon: 'analytics', kind: 'app', href: '/analytics' },
  { name: 'Price Book', tagline: 'Your real rates and materials — the AI prices every draft with them.', status: 'live', icon: 'pricebook', kind: 'app', href: '/pricebook' },
  { name: 'Toolbelt Voice', tagline: 'Dictate the job — the mic lives right in the estimate builder.', status: 'live', icon: 'voice', kind: 'app', href: '/estimates' },
  { name: 'Toolbelt Supplements', tagline: 'Insurance supplement letters, drafted in a minute.', status: 'live', icon: 'supplements', kind: 'app', href: '/apps/supplements' },
  { name: 'Review-Getter', tagline: 'Invoice paid → review ask sent, automatically. Or one tap — your call.', status: 'live', icon: 'reviews', kind: 'automation' },
  { name: 'Toolbelt Scheduling', tagline: 'A clean agenda + tomorrow’s jobs emailed to you every evening.', status: 'live', icon: 'scheduling', kind: 'app', href: '/apps/schedule' },
];

export interface TradeSectionContent {
  /** Anchor id — also the ad deep-link target (#hvac, #plumbing, …). */
  id: Trade;
  headline: string;
  sub: string;
  /** Job types the AI already writes well — real trade language. */
  knows: string[];
  /** The trade's belt: shared flagship + tools specific to this trade. */
  tools: ToolItem[];
}

/**
 * Per-trade deep-dive sections. Statuses are honest: `live` ships today,
 * `next` is in the build queue, `planned` is on the roadmap.
 */
export const TRADE_SECTIONS: Record<Trade, TradeSectionContent> = {
  hvac: {
    id: 'hvac',
    headline: 'Quote the changeout from the driveway.',
    sub: 'Condenser swaps, coil replacements, full system changeouts — the work is standard. Writing it up shouldn’t eat your evening.',
    knows: [
      'Changeouts and full system swaps — condenser, coil, lineset, haul-off',
      'Repairs priced clean: capacitors, blower motors, refrigerant charges',
      'Tune-ups and maintenance visits that read like a plan, not a favor',
    ],
    tools: [
      { name: 'Estimate Builder', tagline: 'Type the changeout, send the branded quote.', status: 'live', icon: 'estimates', kind: 'app', href: '/estimates' },
      { name: 'Maintenance Plan Builder', tagline: 'Turn one-off tune-ups into recurring revenue.', status: 'live', icon: 'maintenance', kind: 'app', href: '/apps/maintenance-plan' },
      { name: 'Follow-up Engine', tagline: 'Unanswered quotes get a nudge — automatically.', status: 'live', icon: 'followup', kind: 'automation' },
      { name: 'Seasonal Tune-Up Reminders', tagline: '“Time for your spring check” emails itself — and reschedules itself too.', status: 'live', icon: 'reminders', kind: 'automation', href: '/apps/service-reminders' },
      { name: 'Equipment & Filter Log', tagline: 'Every unit you’ve touched: model, serial, filter size, refrigerant.', status: 'live', icon: 'log', kind: 'app', href: '/apps/equipment' },
    ],
  },
  plumbing: {
    id: 'plumbing',
    headline: 'Price the water heater while you’re still in the garage.',
    sub: 'Water heaters, repipes, service calls — quoted and sent before the homeowner has finished googling “how much should this cost.”',
    knows: [
      'Water heaters — tank and tankless, haul-off and permit included',
      'Repipes and remodels broken into phases a homeowner can follow',
      'Service calls itemized so “while you’re here” becomes a line item, not a favor',
    ],
    tools: [
      { name: 'Estimate Builder', tagline: 'Three sentences in the garage → a quote in their inbox.', status: 'live', icon: 'estimates', kind: 'app', href: '/estimates' },
      { name: 'Water Heater Quote Pack', tagline: 'Tank vs tankless, good-better-best, side by side.', status: 'live', icon: 'waterheater', kind: 'app', href: '/apps/water-heater' },
      { name: 'Emergency Lead Page', tagline: '2am “my pipe burst” requests get an instant reply — while you sleep.', status: 'live', icon: 'afterhours', kind: 'automation', href: '/apps/lead-page' },
      { name: 'Permit Tracker', tagline: 'Which job is waiting on which permit — with day-before inspection reminders.', status: 'live', icon: 'permits', kind: 'app', href: '/apps/permits' },
      { name: 'Review-Getter', tagline: 'Paid invoices turn into review asks automatically — flip it on in Settings.', status: 'live', icon: 'reviews', kind: 'automation' },
    ],
  },
  electrical: {
    id: 'electrical',
    headline: 'Panel swap quoted before the ladder’s back on the truck.',
    sub: 'Panel upgrades, EV chargers, remodel rough-ins — scoped, itemized, and in the customer’s inbox while the competition is still “getting back to them.”',
    knows: [
      'Panel upgrades — 100A to 200A, grounding, permit coordination',
      'EV charger installs with the load assumptions spelled out in writing',
      'Remodel rough-ins and fixture packages, room by room',
    ],
    tools: [
      { name: 'Estimate Builder', tagline: 'Describe the panel swap, send the branded quote.', status: 'live', icon: 'estimates', kind: 'app', href: '/estimates' },
      { name: 'Load Calc Helper', tagline: 'A quick service-load sanity check before you commit to a number.', status: 'live', icon: 'loadcalc', kind: 'app', href: '/apps/load-calc' },
      { name: 'Follow-up Engine', tagline: 'Quotes chase themselves so you can stay on the tools.', status: 'live', icon: 'followup', kind: 'automation' },
      { name: 'Permit & Inspection Tracker', tagline: 'Every job’s permit status and inspection date, with reminders.', status: 'live', icon: 'permits', kind: 'app', href: '/apps/permits' },
      { name: 'Good-Better-Best Options', tagline: 'One job, three option tiers, one tap.', status: 'live', icon: 'options', kind: 'app', href: '/estimates' },
    ],
  },
  roofing: {
    id: 'roofing',
    headline: 'Measure, price, and send before you’re off the roof.',
    sub: 'Tear-offs by the square, storm scopes, repairs with photos — the paperwork trade. Toolbelt exists to un-paperwork it.',
    knows: [
      'Tear-off and re-roof by the square — shingles, underlayment, flashing, decking',
      'Storm-damage scopes that hold up next to an adjuster’s',
      'Repairs documented so the homeowner understands what they’re paying for',
    ],
    tools: [
      { name: 'Estimate Builder', tagline: '22 squares, typed in plain English, sent from the driveway.', status: 'live', icon: 'estimates', kind: 'app', href: '/estimates' },
      { name: 'Material Order Sheet', tagline: 'Estimate → supplier order list, no re-typing at the counter.', status: 'live', icon: 'materials', kind: 'app', href: '/apps/order-sheet' },
      { name: 'Supplement Drafter', tagline: 'Insurance supplement letters, drafted in a minute instead of at midnight.', status: 'live', icon: 'supplements', kind: 'app', href: '/apps/supplements' },
      { name: 'Photo Report Builder', tagline: 'Roof photos into a clean, captioned PDF the homeowner trusts.', status: 'live', icon: 'photos', kind: 'app', href: '/apps/photo-report' },
      { name: 'Storm Response Pack', tagline: 'Hail hits: share your storm link — every lead gets an instant reply.', status: 'live', icon: 'storm', kind: 'automation', href: '/apps/lead-page' },
    ],
  },
};

export interface TradePageContent {
  /** <title> for /for/[trade] — keyword-first, brand-last. */
  metaTitle: string;
  metaDescription: string;
  /** H1 — deliberately different wording than the landing section headline. */
  h1: string;
  intro: string;
  /** The trade's named kit — same concept per trade, its own name. */
  kitName: string;
  steps: { title: string; body: string }[];
  faq: { q: string; a: string }[];
}

/**
 * Standalone per-trade pages at /for/[trade] — the SEO version of the landing
 * sections. Same product, each trade in its own words: different headline,
 * steps, kit name, and FAQ so no two pages read like a find-and-replace.
 */
export const TRADE_PAGES: Record<Trade, TradePageContent> = {
  hvac: {
    metaTitle: 'HVAC Estimating Software & Apps for Contractors',
    metaDescription:
      'HVAC estimating software that quotes changeouts in a minute. AI line items, branded PDFs, e-sign, deposits, tune-up reminders and an equipment log — $29/mo flat.',
    h1: 'HVAC estimating software that quotes the changeout in a minute',
    intro:
      'Describe the job the way you’d tell your helper — “3-ton condenser and coil, reconnect the lineset, haul off the old unit” — and Toolbelt drafts the labor and materials, prices it from your rates, and sends a branded estimate the homeowner can e-sign and pay a deposit on. From the driveway, before the competition calls back.',
    kitName: 'The Changeout Kit',
    steps: [
      {
        title: 'Say the job',
        body: 'Type it or dictate it from the truck. Snap the data plate and the old unit if it’s easier — the AI reads photos too.',
      },
      {
        title: 'Check the numbers',
        body: 'Line items come pre-priced from your price book. Tweak the condenser price, add a line for the crane, done.',
      },
      {
        title: 'Send it before you leave',
        body: 'The homeowner gets a branded link — they e-sign, pay the deposit through your Stripe, and the invoice creates itself.',
      },
    ],
    faq: [
      {
        q: 'Does it handle repairs and maintenance, or just changeouts?',
        a: 'All of it. Capacitors, blower motors, refrigerant charges, tune-ups — the AI knows how HVAC work splits into labor and materials, and your price book keeps the numbers yours.',
      },
      {
        q: 'Can it sell maintenance plans?',
        a: 'Yes — the Maintenance Plan Builder turns your tune-up visits into a recurring plan estimate, and Seasonal Tune-Up Reminders email your customers when it’s time and roll the next date forward automatically.',
      },
      {
        q: 'What about equipment records?',
        a: 'The Equipment & Filter Log keeps every unit you’ve touched — model, serial, filter size, refrigerant — so the truck roll starts with answers, not attic archaeology.',
      },
      {
        q: 'Do I have to switch software?',
        a: 'No. Most HVAC contractors keep their dispatch or accounting software and use Toolbelt for quoting, e-sign, and getting paid. It’s $29/mo flat, and the first 3 estimates are free with no card.',
      },
    ],
  },
  plumbing: {
    metaTitle: 'Plumbing Estimate & Invoice App for Contractors',
    metaDescription:
      'Plumbing estimating app: water heaters, repipes and service calls quoted from your phone. Branded PDFs, e-sign, deposits, permit tracking, 2am lead auto-replies. Free to try.',
    h1: 'The plumbing estimate app that prices the job from the garage',
    intro:
      'Water heater swaps, repipes, “while you’re here” service calls — type three sentences and Toolbelt writes the estimate: itemized labor and materials at your rates, on a branded PDF, with an e-sign link and a deposit button wired to your own Stripe. The homeowner has a number before they’ve finished googling what it should cost.',
    kitName: 'The Service Truck Pack',
    steps: [
      {
        title: 'Describe it in the driveway',
        body: '“40-gallon gas water heater in the garage, haul off the old one.” Typed or dictated — plumber English, not software English.',
      },
      {
        title: 'Pick tank or tankless — or offer both',
        body: 'The Water Heater Quote Pack builds good-better-best options side by side, priced from your book, in one tap.',
      },
      {
        title: 'Get the yes and the deposit',
        body: 'They e-sign on their phone, the deposit hits your Stripe, the invoice creates itself, and quiet quotes get chased automatically.',
      },
    ],
    faq: [
      {
        q: 'Can it quote water heaters with options?',
        a: 'That’s its favorite job. The Water Heater Quote Pack presets tank vs tankless in good-better-best tiers, so the homeowner picks a lane instead of shopping your single number around.',
      },
      {
        q: 'What happens when a pipe bursts at 2am?',
        a: 'Your Emergency Lead Page takes the request, sends the customer an instant reply with your real availability, and emails you the lead — you decide in the morning whether it was worth waking up for.',
      },
      {
        q: 'Does it track permits?',
        a: 'Yes — the Permit Tracker keeps every job’s permit status and inspection date, and emails you the day before an inspection so nothing gets red-tagged for a no-show.',
      },
      {
        q: 'What does it cost?',
        a: '3 estimates free, no credit card. After that it’s $29/mo flat — unlimited estimates, invoices, e-sign, payments, and every app on this page. Cancel anytime.',
      },
    ],
  },
  electrical: {
    metaTitle: 'Electrical Estimating Software for Contractors',
    metaDescription:
      'Electrical estimating software for panel swaps, EV chargers and remodels. AI line items, a load calc helper, permit tracking, e-sign and deposits — $29/mo flat, free to try.',
    h1: 'Electrical estimating software with the load calc on the same belt',
    intro:
      'Panel upgrades, EV chargers, remodel rough-ins — describe the scope and Toolbelt drafts the estimate with your labor rate and material prices, runs a service-load sanity check when you need one, and sends a branded PDF the customer can e-sign and put a deposit on. Quoted before the ladder’s back on the truck.',
    kitName: 'The Panel Pack',
    steps: [
      {
        title: 'Scope it in plain English',
        body: '“100A to 200A service, bring grounding up to code, coordinate the permit.” The AI itemizes it the way an electrician would.',
      },
      {
        title: 'Sanity-check the load',
        body: 'The Load Calc Helper runs an NEC 220.82-style check so the number you commit to is one you can defend at inspection.',
      },
      {
        title: 'Offer three ways to say yes',
        body: 'Good-better-best options in one tap — the 200A panel, the panel plus surge protection, the whole-home package. E-sign, deposit, done.',
      },
    ],
    faq: [
      {
        q: 'Does the load calc replace my engineering?',
        a: 'No — it’s a fast NEC 220.82-style sanity check so you don’t quote a service that won’t pass. Your stamped calcs stay your stamped calcs; this keeps the estimate honest before you commit.',
      },
      {
        q: 'Can it quote EV charger installs?',
        a: 'Yes, with the load assumptions spelled out in writing on the estimate — which is exactly what saves the callback when the panel’s already tight.',
      },
      {
        q: 'How does it handle permits and inspections?',
        a: 'The Permit & Inspection Tracker keeps each job’s permit status and inspection date and emails you the day before, so the inspector never waits in an empty driveway.',
      },
      {
        q: 'Is my pricing exposed to the AI?',
        a: 'Your price book prices your estimates, and your data stays yours — it’s never used to train AI models, and every line the AI drafts is a suggestion you can change. The math is computed, never guessed.',
      },
    ],
  },
  roofing: {
    metaTitle: 'Roofing Estimate Software for Contractors',
    metaDescription:
      'Roofing estimate software for tear-offs, storm scopes and supplements. Photo reports, insurance supplement letters, material order sheets, e-sign and deposits. Free to try.',
    h1: 'Roofing estimate software built for the paperwork trade',
    intro:
      'Roofing runs on documents — estimates by the square, photo evidence, supplement letters, material orders. Toolbelt writes all of them. Describe the tear-off, attach the roof photos, and send a branded estimate the homeowner e-signs on their phone; the supplement letter and the supplier order sheet come off the same job.',
    kitName: 'The Storm Kit',
    steps: [
      {
        title: 'Scope it by the square',
        body: '“22 squares architectural, new flashing, 2 sheets of decking.” The AI breaks out tear-off, install, and materials at your prices.',
      },
      {
        title: 'Document it with photos',
        body: 'The Photo Report Builder turns roof photos into a captioned, branded PDF — proof the homeowner and the adjuster both trust. Photos stay on your phone, never uploaded.',
      },
      {
        title: 'Win the claim, order the materials',
        body: 'The Supplement Drafter writes the insurance letter in a minute, and the Material Order Sheet turns the estimate into a supplier list — no re-typing at the counter.',
      },
    ],
    faq: [
      {
        q: 'Does it help with insurance work?',
        a: 'Yes — storm scopes itemized so they hold up next to an adjuster’s, photo reports for evidence, and AI-drafted supplement letters when the first offer comes in short.',
      },
      {
        q: 'What happens when a storm hits?',
        a: 'You share your Storm Response link — every homeowner who fills it out gets an instant reply, you get the lead by email, and the list lives in your inbox ordered by street. First truck there wins the block.',
      },
      {
        q: 'Where do the roof photos go?',
        a: 'For photo reports, nowhere — the PDF is built on your device and the photos are never uploaded to our servers. What you shoot stays yours.',
      },
      {
        q: 'Can homeowners pay a deposit online?',
        a: 'Yes. The estimate link carries an e-sign button and, once accepted, a deposit button wired to your own Stripe account. Money goes straight to you; the invoice marks itself paid.',
      },
    ],
  },
};

/**
 * Every live, linkable trade tool across all four trades (deduped) — feeds the
 * app sidebar and the dashboard's cross-trade section. Estimate Builder is
 * excluded (it's the flagship, listed with the core apps).
 */
export function liveTradeTools(): (ToolItem & { trade: Trade })[] {
  const seen = new Set<string>();
  const out: (ToolItem & { trade: Trade })[] = [];
  for (const trade of Object.keys(TRADE_SECTIONS) as Trade[]) {
    for (const tool of TRADE_SECTIONS[trade].tools) {
      if (tool.status !== 'live' || !tool.href) continue;
      if (tool.href === '/estimates' || seen.has(tool.href)) continue;
      seen.add(tool.href);
      out.push({ ...tool, trade });
    }
  }
  return out;
}

export interface PricingTier {
  key: 'free' | 'proMonthly' | 'founding' | 'proAnnual';
  name: string;
  tag: string;
  price: string;
  unit: string;
  blurb: string;
  features: string[];
  featured: boolean;
  badge: string;
  /** Stripe price to check out with — absent on the free tier. */
  checkout?: PlanKey;
}

/**
 * The four tiers, one source of truth for the landing page and /billing.
 * Every plan gets the full product (see the shared strip on the pricing
 * section); tiers differ on billing and the perks we can genuinely keep:
 * price lock, support priority, early access, roadmap say.
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    key: 'free',
    name: 'Free',
    tag: 'Try it',
    price: '$0',
    unit: 'forever',
    blurb: 'Kick the tires on a real job. No card, no timer.',
    features: [
      '3 estimates, yours to keep',
      'AI line items — typed or from photos',
      'Branded PDF + e-signable link',
      'Customer accept & online payment',
      'No credit card required',
    ],
    featured: false,
    badge: '',
  },
  {
    key: 'proMonthly',
    name: 'Pro',
    tag: 'Monthly',
    price: '$29',
    unit: '/mo',
    blurb: 'For the busy season — or all year. No contract.',
    features: [
      'Unlimited estimates',
      'E-sign, invoices & auto follow-ups',
      'Customers, analytics & price book',
      'Every new Toolbelt app as it ships',
      'Cancel anytime',
    ],
    featured: false,
    badge: '',
    checkout: 'proMonthly',
  },
  {
    key: 'founding',
    name: 'Founding',
    tag: 'Lifetime rate',
    price: '$19',
    unit: '/mo for life',
    blurb: 'First 100 contractors. The lowest price we’ll ever offer.',
    features: [
      'Everything in Pro Annual',
      '$19/mo locked for as long as you stay',
      'Every future app included — price never moves',
      'Direct line to the builders',
      'Vote on which tool we build next',
    ],
    featured: true,
    badge: 'Best deal · first 100',
    checkout: 'founding',
  },
  {
    key: 'proAnnual',
    name: 'Pro Annual',
    tag: 'Best value',
    price: '$24',
    unit: '/mo',
    blurb: 'Billed yearly ($288) — two months free.',
    features: [
      'Everything in Pro',
      '2 months free vs monthly',
      'Priority support — front of the line',
      'Early access to new apps & betas',
      'Your price locked for the year',
    ],
    featured: false,
    badge: '',
    checkout: 'proAnnual',
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Does this replace ServiceTitan, Jobber, or Housecall Pro?',
    a: 'No. It does the one thing those make slow — estimates. Use it alongside whatever you already run. Most guys keep their software and use Toolbelt just to quote.',
  },
  {
    q: 'Is there really a free plan?',
    a: 'Yes. 3 estimates, free, no credit card — and they never expire. Quote three real jobs and see if the estimates win work before you pay a dollar.',
  },
  {
    q: 'Which trades does it cover?',
    a: 'HVAC, plumbing, electrical, and roofing today — the AI knows how each trade splits labor and materials, and your estimates carry your trade’s look. Another trade? Start free anyway; the estimates still work, and telling us your trade bumps it up the roadmap.',
  },
  {
    q: 'Is the AI making up prices?',
    a: 'No. Every line is a starting suggestion you can change, and the math is computed, not guessed. You set the final number — you always own it.',
  },
  {
    q: 'How long does it actually take?',
    a: 'Under a minute for most jobs. Type a few sentences, tweak a line or two, send. That’s it.',
  },
  {
    q: 'What do I need to start?',
    a: 'Your company name and your logo. Add your license and rates once, and they land on every estimate after that.',
  },
  {
    q: 'Can customers accept and pay online?',
    a: 'Yes. Every estimate link has an accept button — the customer types their name to e-sign, you get an email, and the signature lands on the PDF. Add your payment link in Settings and accepted estimates show a "Pay online" button for the deposit.',
  },
];
