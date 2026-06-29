// Shared domain types. These mirror the Supabase tables in supabase/migrations.

export type Trade = 'hvac' | 'plumbing' | 'electrical' | 'roofing';

export const TRADES: Trade[] = ['hvac', 'plumbing', 'electrical', 'roofing'];

export type LineItemCategory = 'labor' | 'materials' | 'other';

export type EstimateStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'declined';

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
  created_at: string;
  updated_at: string;
}

export interface EstimateWithItems extends Estimate {
  line_items: LineItem[];
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
