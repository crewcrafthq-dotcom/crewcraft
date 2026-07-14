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
  { name: 'Review-Getter', tagline: 'Turn finished jobs into 5-star reviews.', status: 'live', icon: 'reviews', kind: 'automation' },
  { name: 'Toolbelt Scheduling', tagline: 'Book the job, keep the week straight.', status: 'next', icon: 'scheduling', kind: 'app' },
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
      { name: 'Seasonal Tune-Up Reminders', tagline: '“Time for your spring check” goes out by itself — and books the calendar.', status: 'planned', icon: 'reminders', kind: 'automation' },
      { name: 'Equipment & Filter Log', tagline: 'Every unit you’ve touched: model, serial, filter size, refrigerant.', status: 'planned', icon: 'log', kind: 'app' },
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
      { name: 'After-Hours Auto-Reply', tagline: '2am “my pipe burst” texts get an instant answer with your emergency rate.', status: 'planned', icon: 'afterhours', kind: 'automation' },
      { name: 'Permit Tracker', tagline: 'Which job is waiting on which permit — without the sticky notes.', status: 'planned', icon: 'permits', kind: 'app' },
      { name: 'Review-Getter', tagline: 'Finished jobs turn into 5-star reviews on their own.', status: 'live', icon: 'reviews', kind: 'automation' },
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
      { name: 'Permit & Inspection Tracker', tagline: 'Every job’s permit status and inspection date, with reminders.', status: 'planned', icon: 'permits', kind: 'automation' },
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
      { name: 'Storm Response Pack', tagline: 'Hail hits: instant auto-replies and a landing page for the flood of calls.', status: 'planned', icon: 'storm', kind: 'automation' },
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
