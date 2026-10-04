// Shared domain types. These mirror the Supabase tables in supabase/migrations.

export type Trade = 'hvac' | 'plumbing' | 'electrical' | 'roofing';

export const TRADES: Trade[] = ['hvac', 'plumbing', 'electrical', 'roofing'];

export type LineItemCategory = 'labor' | 'materials' | 'other';

/** Estimates and invoices share one table; `kind` tells them apart. */
export type DocumentKind = 'estimate' | 'invoice';

export type EstimateStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'declined'
  | 'paid';

export type Plan = 'free' | 'pro';

export interface Business {
  id: string;
  user_id: string;
  trade: Trade;
  name: string;
  logo_url: string | null;
  license: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  default_tax_rate: number; // percent, e.g. 8.25
  default_labor_rate: number; // dollars per hour
  review_link: string | null; // e.g. the Google review URL
  payment_link: string | null; // e.g. a Stripe Payment Link
  payment_instructions: string | null; // e.g. "Zelle to (555) 123-4567"
  auto_invoice: boolean; // on acceptance, create + email the invoice automatically
  auto_review_request: boolean; // on invoice paid, email the review ask automatically (cron)
  lead_token: string; // unguessable token for the public storm/emergency lead page
  stripe_account_id: string | null; // Connect: the contractor's own Stripe account
  stripe_charges_enabled: boolean; // Connect: cached "can take payments" status
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: Plan;
  subscription_status: string | null; // Stripe status: active, trialing, canceled, ...
  // When Pro lapses after a failed renewal. Optional because the column only
  // exists once migration 0011 has been run — see hasProAccess().
  grace_until?: string | null;
  created_at: string;
}

export interface LineItem {
  id: string;
  estimate_id: string;
  category: LineItemCategory;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number; // dollars
  line_total: number; // dollars — always recomputed in code
  sort_order: number;
}

export interface Estimate {
  id: string;
  user_id: string;
  kind: DocumentKind;
  customer_name: string;
  customer_address: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  status: EstimateStatus;
  scope_of_work: string | null;
  subtotal: number;
  tax_rate: number; // percent
  tax_amount: number;
  deposit: number;
  total: number;
  notes: string | null;
  public_token: string;
  viewed_at: string | null;
  // customer accept / decline (e-sign)
  signed_name: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  decline_reason: string | null;
  // invoice fields
  due_date: string | null;
  paid_at: string | null;
  source_estimate_id: string | null;
  // online deposit collection (estimates)
  deposit_paid_at: string | null;
  // send + follow-up reminders
  sent_at: string | null;
  reminders_enabled: boolean;
  last_reminder_at: string | null;
  reminder_count: number;
  // review requests
  review_requested_at: string | null;
  // multilingual PDF
  pdf_language: string; // BCP-47-ish code from PDF_LANGUAGES; 'en' default
  pdf_translation: PdfTranslation | null; // cached AI translation of typed content
  created_at: string;
  updated_at: string;
}

/** Cached translation of an estimate's free-text content for one language. */
export interface PdfTranslation {
  lang: string;
  hash: string; // fingerprint of the source content; stale cache is ignored
  scope: string | null;
  notes: string | null;
  items: Record<string, string>; // line_item id → translated description
}

export interface EstimateWithItems extends Estimate {
  line_items: LineItem[];
}

/** A saved rate or material in the contractor's price book. */
export interface PriceBookItem {
  id: string;
  user_id: string;
  category: LineItemCategory;
  description: string;
  unit: string;
  unit_price: number;
  created_at: string;
}

// What the AI generator hands back to the editor (prices are suggestions).
export interface GeneratedLineItem {
  category: LineItemCategory;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface GeneratedEstimate {
  scopeOfWork: string;
  lineItems: GeneratedLineItem[];
  assumptions: string[];
}

/** One Good/Better/Best pricing option. */
export interface GeneratedTier extends GeneratedEstimate {
  name: string;
}

export interface GeneratedTiers {
  tiers: GeneratedTier[];
}

// ── App tables (migration 0010) ─────────────────────────────────────────

export type JobStatus = 'scheduled' | 'done' | 'canceled';

export interface Job {
  id: string;
  user_id: string;
  estimate_id: string | null;
  title: string;
  customer_name: string | null;
  address: string | null;
  starts_at: string;
  duration_min: number;
  notes: string | null;
  status: JobStatus;
  reminder_sent_at: string | null;
  created_at: string;
}

export interface EquipmentItem {
  id: string;
  user_id: string;
  customer_name: string;
  label: string;
  brand: string | null;
  model: string | null;
  serial: string | null;
  filter_size: string | null;
  refrigerant: string | null;
  installed_year: number | null;
  notes: string | null;
  created_at: string;
}

export type PermitStatus = 'applied' | 'issued' | 'inspection' | 'closed';

export interface Permit {
  id: string;
  user_id: string;
  estimate_id: string | null;
  job_name: string;
  jurisdiction: string | null;
  permit_no: string | null;
  status: PermitStatus;
  inspection_date: string | null;
  reminder_sent_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface ServiceReminder {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  cadence_months: number;
  next_due: string;
  enabled: boolean;
  last_sent_at: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  message: string | null;
  source: string;
  created_at: string;
}
