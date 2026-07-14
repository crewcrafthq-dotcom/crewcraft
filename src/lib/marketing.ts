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
  testimonial: { quote: string; name: string; trade: string; city: string };
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
    testimonial: {
      quote: 'I quote jobs from the driveway now. Used to be an hour of typing after dinner.',
      name: 'Mike R.',
      trade: 'HVAC',
      city: 'Tulsa',
    },
  },
  plumbing: {
    job: 'Replace a 40-gallon gas water heater in the garage, haul off the old one.',
    lines: [
      { category: 'labor', desc: 'Remove & install, test for leaks', amount: '$320.00' },
      { category: 'materials', desc: '40-gal gas water heater', amount: '$720.00' },
      { category: 'materials', desc: 'Fittings & gas connector', amount: '$85.00' },
    ],
    total: '$1,125.00',
    testimonial: {
      quote: 'Customers say it looks like I hired a designer. I typed three sentences.',
      name: 'Dave P.',
      trade: 'Plumbing',
      city: 'Akron',
    },
  },
  electrical: {
    job: 'Swap a 100A panel for 200A service, bring grounding up to code, coordinate the permit.',
    lines: [
      { category: 'labor', desc: 'Panel swap, rewire, permit coordination', amount: '$880.00' },
      { category: 'materials', desc: '200A main panel', amount: '$420.00' },
      { category: 'materials', desc: 'Breakers & grounding kit', amount: '$180.00' },
    ],
    total: '$1,480.00',
    testimonial: {
      quote: 'Sent the estimate before I left the driveway. Closed it that night.',
      name: 'Carlos M.',
      trade: 'Electrical',
      city: 'Fresno',
    },
  },
  roofing: {
    job: 'Tear off and replace 22 squares of architectural shingles, new flashing and 2 sheets of decking.',
    lines: [
      { category: 'labor', desc: 'Tear-off & install, 22 sq', amount: '$4,400.00' },
      { category: 'materials', desc: 'Architectural shingles, 22 sq', amount: '$2,200.00' },
      { category: 'materials', desc: 'Flashing & decking', amount: '$360.00' },
    ],
    total: '$6,960.00',
    testimonial: {
      quote: 'Even just the estimates gave me my weekends back. Three sentences and it’s done.',
      name: 'Tanya W.',
      trade: 'Roofing',
      city: 'Raleigh',
    },
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
  | 'voice'
  | 'supplements'
  | 'followup'
  | 'reviews'
  | 'invoices'
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

/** What's on the belt for every trade. Estimates is the flagship; the rest are honest about status. */
export const APP_LINEUP: ToolItem[] = [
  { name: 'Toolbelt Estimates', tagline: 'Type the job, send a branded estimate.', status: 'live', icon: 'estimates', kind: 'app' },
  { name: 'Toolbelt Voice', tagline: 'Talk it out, get the paperwork.', status: 'next', icon: 'voice', kind: 'app' },
  { name: 'Toolbelt Invoices', tagline: 'Accepted estimate → invoice → paid.', status: 'next', icon: 'invoices', kind: 'app' },
  { name: 'Follow-up Engine', tagline: 'Quotes that chase themselves so you don’t.', status: 'next', icon: 'followup', kind: 'automation' },
  { name: 'Review-Getter', tagline: 'Turn finished jobs into 5-star reviews.', status: 'next', icon: 'reviews', kind: 'automation' },
  { name: 'Toolbelt Scheduling', tagline: 'Book the job, keep the week straight.', status: 'next', icon: 'scheduling', kind: 'app' },
  { name: 'Toolbelt Supplements', tagline: 'Roofing insurance supplements, done faster.', status: 'next', icon: 'supplements', kind: 'app' },
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
      { name: 'Seasonal Tune-Up Reminders', tagline: '“Time for your spring check” goes out by itself — and books the calendar.', status: 'planned', icon: 'reminders', kind: 'automation' },
      { name: 'Equipment & Filter Log', tagline: 'Every unit you’ve touched: model, serial, filter size, refrigerant.', status: 'planned', icon: 'log', kind: 'app' },
      { name: 'Follow-up Engine', tagline: 'Unanswered quotes get a nudge on day 2 and day 5.', status: 'next', icon: 'followup', kind: 'automation' },
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
      { name: 'Review-Getter', tagline: 'Finished jobs turn into 5-star reviews on their own.', status: 'next', icon: 'reviews', kind: 'automation' },
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
      { name: 'Permit & Inspection Tracker', tagline: 'Every job’s permit status and inspection date, with reminders.', status: 'planned', icon: 'permits', kind: 'automation' },
      { name: 'Good-Better-Best Options', tagline: 'One job, three option tiers, one tap.', status: 'planned', icon: 'options', kind: 'app' },
      { name: 'Follow-up Engine', tagline: 'Quotes chase themselves so you can stay on the tools.', status: 'next', icon: 'followup', kind: 'automation' },
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
      { name: 'Toolbelt Supplements', tagline: 'Insurance supplements, drafted in minutes instead of nights.', status: 'next', icon: 'supplements', kind: 'app' },
      { name: 'Storm Response Pack', tagline: 'Hail hits: instant auto-replies and a landing page for the flood of calls.', status: 'planned', icon: 'storm', kind: 'automation' },
      { name: 'Photo Report Builder', tagline: 'Roof photos into a clean, captioned PDF the homeowner trusts.', status: 'planned', icon: 'photos', kind: 'app' },
    ],
  },
};

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
 * Every claim here is either enforced in code (the 3-estimate gate) or a
 * commitment we can keep by hand (support, betas, roadmap votes, price lock).
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
      'AI labor & material line items',
      'Branded PDF + shareable link',
      'Email sending + open tracking',
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
      'AI line items, branded PDF + tracking',
      'Every new Toolbelt app as it ships',
      'Email support',
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
];
