'use client';

import { Input } from '@/components/ui/Field';
import { money } from '@/lib/format';
import type { ComputedTotals } from '@/lib/estimates';

interface Props {
  totals: ComputedTotals;
  taxRate: string;
  onTaxRate: (v: string) => void;
  deposit: string;
  onDeposit: (v: string) => void;
}

export function TotalsPanel({ totals, taxRate, onTaxRate, deposit, onDeposit }: Props) {
  return (
    <div className="space-y-2">
      <Row label="Subtotal" value={money(totals.subtotal)} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-mist-soft">
          <span>Tax</span>
          <Input
            aria-label="Tax rate percent"
            inputMode="decimal"
            value={taxRate}
            onChange={(e) => onTaxRate(e.target.value)}
            className="h-9 w-20 text-sm"
            placeholder="0"
          />
          <span>%</span>
        </div>
        <span className="font-medium">{money(totals.taxAmount)}</span>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-accent-fg">
        <span className="font-bold">Total</span>
        <span className="text-lg font-bold">{money(totals.total)}</span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-mist-soft">
          <span>Deposit</span>
          <div className="flex items-center">
            <span className="text-mist-mute">$</span>
            <Input
              aria-label="Deposit amount"
              inputMode="decimal"
              value={deposit}
              onChange={(e) => onDeposit(e.target.value)}
              className="h-9 w-24 text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
        <span className="font-medium text-accent-bright">{money(totals.depositDue)}</span>
      </div>

      {totals.depositDue > 0 ? (
        <Row label="Balance due" value={money(totals.balanceDue)} />
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-mist-soft">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
