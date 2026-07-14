import { describe, expect, it } from 'vitest';

import {
  buildCustomers,
  customerKey,
  decodeCustomerKey,
  docsForCustomer,
  encodeCustomerKey,
  type CustomerDoc,
} from './customers';

function doc(overrides: Partial<CustomerDoc>): CustomerDoc {
  return {
    id: Math.random().toString(36).slice(2),
    kind: 'estimate',
    customer_name: 'Jane Doe',
    customer_email: 'jane@example.com',
    customer_phone: null,
    customer_address: null,
    status: 'sent',
    total: 100,
    created_at: '2026-06-01T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
    ...overrides,
  };
}

describe('customerKey', () => {
  it('prefers a case-insensitive email over the name', () => {
    expect(customerKey(doc({ customer_email: 'Jane@Example.COM' }))).toBe('email:jane@example.com');
  });

  it('falls back to the lowercased name', () => {
    expect(customerKey(doc({ customer_email: null, customer_name: '  Jane Doe ' }))).toBe(
      'name:jane doe',
    );
  });

  it('returns null when there is no identity at all', () => {
    expect(customerKey(doc({ customer_email: null, customer_name: '' }))).toBeNull();
  });
});

describe('encode/decodeCustomerKey', () => {
  it('round-trips keys through the URL-safe form', () => {
    const key = 'email:jane+test@example.com';
    expect(decodeCustomerKey(encodeCustomerKey(key))).toBe(key);
  });

  it('rejects garbage', () => {
    expect(decodeCustomerKey('!!!not-base64url!!!')).toBeNull();
    expect(decodeCustomerKey(encodeCustomerKey('bogus:whatever'))).toBeNull();
  });
});

describe('buildCustomers', () => {
  it('groups docs by email and totals quoted/won/collected separately', () => {
    const docs = [
      doc({ status: 'sent', total: 100 }),
      doc({ status: 'accepted', total: 500 }),
      doc({ kind: 'invoice', status: 'paid', total: 500 }),
      doc({ customer_email: 'other@example.com', customer_name: 'Bob', total: 50 }),
    ];
    const customers = buildCustomers(docs);
    expect(customers).toHaveLength(2);

    const jane = customers.find((c) => c.email === 'jane@example.com')!;
    expect(jane.estimateCount).toBe(2);
    expect(jane.invoiceCount).toBe(1);
    expect(jane.quoted).toBe(600); // both estimates
    expect(jane.won).toBe(500); // the accepted one
    expect(jane.collected).toBe(500); // the paid invoice
  });

  it('skips docs with no identity and sorts by last activity', () => {
    const customers = buildCustomers([
      doc({ customer_email: null, customer_name: '' }),
      doc({ customer_email: 'old@example.com', updated_at: '2026-01-01T00:00:00Z' }),
      doc({ customer_email: 'new@example.com', updated_at: '2026-06-15T00:00:00Z' }),
    ]);
    expect(customers.map((c) => c.email)).toEqual(['new@example.com', 'old@example.com']);
  });

  it('backfills contact details from later docs', () => {
    const customers = buildCustomers([
      doc({ customer_phone: null }),
      doc({ customer_phone: '(555) 111-2222' }),
    ]);
    expect(customers[0].phone).toBe('(555) 111-2222');
  });
});

describe('docsForCustomer', () => {
  it('returns only the matching docs, newest first', () => {
    const a = doc({ updated_at: '2026-02-01T00:00:00Z' });
    const b = doc({ updated_at: '2026-05-01T00:00:00Z' });
    const other = doc({ customer_email: 'other@example.com' });
    const out = docsForCustomer([a, b, other], 'email:jane@example.com');
    expect(out.map((d) => d.id)).toEqual([b.id, a.id]);
  });
});
