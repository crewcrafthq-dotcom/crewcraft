import { describe, expect, it } from 'vitest';

import { computeTotals, groupByCategory, lineTotal } from './estimates';
import type { LineItem } from './types';

describe('lineTotal', () => {
  it('multiplies quantity by unit price', () => {
    expect(lineTotal(2, 10)).toBe(20);
    expect(lineTotal(3, 12.5)).toBe(37.5);
  });

  it('rounds to whole cents', () => {
    expect(lineTotal(2.5, 99.99)).toBe(249.98); // 249.975 → 249.98
  });

  it('avoids floating-point drift', () => {
    expect(lineTotal(0.1, 0.2)).toBe(0.02); // not 0.020000000000000004
    expect(lineTotal(1, 0.3)).toBe(0.3);
  });

  it('treats bad input as zero', () => {
    expect(lineTotal(NaN, 10)).toBe(0);
    expect(lineTotal(2, Number('x'))).toBe(0);
  });
});

describe('computeTotals', () => {
  it('sums subtotal, applies tax, totals it up', () => {
    const t = computeTotals(
      [
        { quantity: 2, unitPrice: 10 },
        { quantity: 1, unitPrice: 5 },
      ],
      10, // 10% tax
    );
    expect(t.subtotal).toBe(25);
    expect(t.taxAmount).toBe(2.5);
    expect(t.total).toBe(27.5);
  });

  it('splits deposit and balance', () => {
    const t = computeTotals([{ quantity: 1, unitPrice: 100 }], 0, 40);
    expect(t.total).toBe(100);
    expect(t.depositDue).toBe(40);
    expect(t.balanceDue).toBe(60);
  });

  it('clamps a deposit larger than the total', () => {
    const t = computeTotals([{ quantity: 1, unitPrice: 100 }], 0, 500);
    expect(t.depositDue).toBe(100);
    expect(t.balanceDue).toBe(0);
  });

  it('handles fractional quantities and rounds tax', () => {
    const t = computeTotals([{ quantity: 2.5, unitPrice: 99.99 }], 8.25);
    expect(t.subtotal).toBe(249.98);
    expect(t.taxAmount).toBe(20.62); // round(249.98 * 8.25%) = 20.6234 → 20.62
    expect(t.total).toBe(270.6);
  });

  it('is empty-safe', () => {
    const t = computeTotals([], 8);
    expect(t.subtotal).toBe(0);
    expect(t.total).toBe(0);
  });
});

describe('groupByCategory', () => {
  const item = (over: Partial<LineItem>): LineItem => ({
    id: Math.random().toString(),
    estimate_id: 'e',
    category: 'labor',
    description: '',
    quantity: 1,
    unit: '',
    unit_price: 0,
    line_total: 0,
    sort_order: 0,
    ...over,
  });

  it('orders Labor → Materials → Other and drops empty groups', () => {
    const groups = groupByCategory([
      item({ category: 'materials', sort_order: 1 }),
      item({ category: 'labor', sort_order: 0 }),
    ]);
    expect(groups.map((g) => g.category)).toEqual(['labor', 'materials']);
  });
});
