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

export interface ToolItem {
  name: string;
  tagline: string;
  status: 'live' | 'next';
  icon:
    | 'estimates'
    | 'esign'
    | 'invoices'
    | 'followup'
    | 'customers'
    | 'analytics'
    | 'voice'
    | 'supplements'
    | 'reviews';
}

/** What's on the belt. Estimates is the flagship; the rest are honest about status. */
export const APP_LINEUP: ToolItem[] = [
  { name: 'Toolbelt Estimates', tagline: 'Type the job — or snap photos — and send a branded, e-signable estimate.', status: 'live', icon: 'estimates' },
  { name: 'Invoices', tagline: 'Accepted estimates become invoices — automatically, if you want.', status: 'live', icon: 'invoices' },
  { name: 'Follow-up Engine', tagline: 'Quotes and overdue invoices that chase themselves so you don’t.', status: 'live', icon: 'followup' },
  { name: 'Customers', tagline: 'Every customer and job history, built from your paperwork.', status: 'live', icon: 'customers' },
  { name: 'Analytics', tagline: 'Win rate, average ticket, quoted vs won.', status: 'live', icon: 'analytics' },
  { name: 'Toolbelt Voice', tagline: 'Talk it out, get the paperwork.', status: 'next', icon: 'voice' },
  { name: 'Toolbelt Supplements', tagline: 'Roofing insurance supplements, done faster.', status: 'next', icon: 'supplements' },
];

export const PRICING = {
  free: {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    line: '3 estimates total — a real taste, no timer.',
    features: ['3 estimates', 'AI line items', 'Customer e-sign', 'No credit card'],
  },
  pro: {
    name: 'Pro',
    price: '$29',
    cadence: '/mo',
    annual: '$24/mo billed annually',
    line: 'Unlimited estimates. One flat price.',
    features: ['Unlimited estimates', 'E-sign, invoices & auto follow-ups', 'Customers + analytics', 'Cancel anytime'],
  },
  founding: {
    name: 'Founding',
    price: '$19',
    cadence: '/mo for life',
    line: 'First 100 contractors lock this rate for good.',
  },
};

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Does this replace ServiceTitan, Jobber, or Housecall Pro?',
    a: 'No. It does the one thing those make slow — estimates. Use it alongside whatever you already run. Most guys keep their software and use Toolbelt just to quote.',
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
