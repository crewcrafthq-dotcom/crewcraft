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
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: Plan;
  subscription_status: string | null; // Stripe status: active, trialing, canceled, ...
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
  // send + follow-up reminders
  sent_at: string | null;
  reminders_enabled: boolean;
  last_reminder_at: string | null;
  reminder_count: number;
  // review requests
  review_requested_at: string | null;
  created_at: string;
  updated_at: string;
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
