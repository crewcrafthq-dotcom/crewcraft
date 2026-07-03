import type { Estimate } from './types';

/**
 * Customers are derived, not stored: every estimate/invoice carries its
 * customer fields, so we group documents by email (preferred) or name. No
 * second table to keep in sync — the CRM view is always as fresh as the docs.
 */

export type CustomerDoc = Pick<
  Estimate,
  | 'id'
  | 'kind'
  | 'customer_name'
  | 'customer_email'
  | 'customer_phone'
  | 'customer_address'
  | 'status'
  | 'total'
  | 'created_at'
  | 'updated_at'
>;

export interface CustomerSummary {
  key: string; // stable grouping key — see customerKey()
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  estimateCount: number;
  invoiceCount: number;
  quoted: number; // all estimate totals
  won: number; // accepted estimate totals
  collected: number; // paid invoice totals
  lastActivity: string; // ISO date of the newest doc
}

/** Group by email when we have one (case-insensitive), else by name. */
export function customerKey(doc: {
  customer_email: string | null;
  customer_name: string;
}): string | null {
  const email = (doc.customer_email ?? '').trim().toLowerCase();
  if (email) return `email:${email}`;
  const name = (doc.customer_name ?? '').trim().toLowerCase();
  if (name) return `name:${name}`;
  return null; // no identity — skip
}

/** URL-safe form of the key for /customers/[key]. */
export function encodeCustomerKey(key: string): string {
  return Buffer.from(key, 'utf8').toString('base64url');
}

export function decodeCustomerKey(encoded: string): string | null {
  try {
    const key = Buffer.from(encoded, 'base64url').toString('utf8');
    return key.startsWith('email:') || key.startsWith('name:') ? key : null;
  } catch {
    return null;
  }
}

/** Roll documents up into per-customer summaries, newest activity first. */
export function buildCustomers(docs: CustomerDoc[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();

  for (const doc of docs) {
    const key = customerKey(doc);
    if (!key) continue;

    let entry = map.get(key);
    if (!entry) {
      entry = {
        key,
        name: doc.customer_name?.trim() || 'Unnamed customer',
        email: doc.customer_email,
        phone: doc.customer_phone,
        address: doc.customer_address,
        estimateCount: 0,
        invoiceCount: 0,
        quoted: 0,
        won: 0,
        collected: 0,
        lastActivity: doc.updated_at,
      };
      map.set(key, entry);
    }

    // Prefer the most complete contact details we've seen.
    if (!entry.email && doc.customer_email) entry.email = doc.customer_email;
    if (!entry.phone && doc.customer_phone) entry.phone = doc.customer_phone;
    if (!entry.address && doc.customer_address) entry.address = doc.customer_address;
    if (doc.customer_name?.trim() && entry.name === 'Unnamed customer') {
      entry.name = doc.customer_name.trim();
    }

    if (doc.kind === 'invoice') {
      entry.invoiceCount += 1;
      if (doc.status === 'paid') entry.collected += doc.total || 0;
    } else {
      entry.estimateCount += 1;
      entry.quoted += doc.total || 0;
      if (doc.status === 'accepted') entry.won += doc.total || 0;
    }

    if (doc.updated_at > entry.lastActivity) entry.lastActivity = doc.updated_at;
  }

  return Array.from(map.values()).sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
}

/** The docs belonging to one customer key, newest first. */
export function docsForCustomer(docs: CustomerDoc[], key: string): CustomerDoc[] {
  return docs
    .filter((d) => customerKey(d) === key)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}
