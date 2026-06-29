// Display helpers. Kept tiny and dependency-free.

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(amount: number): string {
  return USD.format(Number.isFinite(amount) ? amount : 0);
}

export function shortDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Round a dollar value to whole cents. Used everywhere money is computed. */
export function roundCents(amount: number): number {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
}
