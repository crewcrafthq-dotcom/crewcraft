import type { LineItem, LineItemCategory } from './types';

/**
 * The single source of truth for estimate math (§5 guardrail). Every line total
 * and every running total is computed here, in integer cents, from quantity ×
 * unit price — the model's arithmetic is never trusted. The editor, the PDF,
 * the public page, and the save path all call this so they can never disagree.
 */

export interface TotalsInput {
  quantity: number;
  unitPrice: number;
}

const toCents = (dollars: number): number =>
  Math.round((Number(dollars) || 0) * 100);
const toDollars = (cents: number): number => cents / 100;

/** quantity × unit_price for one line, rounded to whole cents. */
export function lineTotal(quantity: number, unitPrice: number): number {
  const cents = Math.round((Number(quantity) || 0) * toCents(unitPrice));
  return toDollars(cents);
}

export interface ComputedTotals {
  subtotal: number;
  taxAmount: number;
  total: number;
  depositDue: number;
  balanceDue: number;
}

export function computeTotals(
  items: Array<TotalsInput>,
  taxRatePercent: number,
  deposit = 0,
): ComputedTotals {
  const subtotalCents = items.reduce(
    (sum, it) =>
      sum + Math.round((Number(it.quantity) || 0) * toCents(it.unitPrice)),
    0,
  );
  const rate = Number(taxRatePercent) || 0;
  const taxCents = Math.round((subtotalCents * rate) / 100);
  const totalCents = subtotalCents + taxCents;

  // Deposit can't exceed the total; balance is what's left after it.
  const depositCents = Math.min(Math.max(toCents(deposit), 0), totalCents);
  const balanceCents = totalCents - depositCents;

  return {
    subtotal: toDollars(subtotalCents),
    taxAmount: toDollars(taxCents),
    total: toDollars(totalCents),
    depositDue: toDollars(depositCents),
    balanceDue: toDollars(balanceCents),
  };
}

export const CATEGORY_LABELS: Record<LineItemCategory, string> = {
  labor: 'Labor',
  materials: 'Materials',
  other: 'Other',
};

const CATEGORY_ORDER: LineItemCategory[] = ['labor', 'materials', 'other'];

/** Group line items by category in a fixed Labor → Materials → Other order. */
export function groupByCategory(
  items: LineItem[],
): Array<{ category: LineItemCategory; items: LineItem[] }> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items
      .filter((i) => i.category === category)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((g) => g.items.length > 0);
}
