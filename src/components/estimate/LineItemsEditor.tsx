'use client';

import { Input, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { lineTotal } from '@/lib/estimates';
import { money } from '@/lib/format';
import { CATEGORY_LABELS } from '@/lib/estimates';
import type { LineItemCategory } from '@/lib/types';
import { newRow, type EditorRow } from './types';

interface Props {
  rows: EditorRow[];
  onChange: (rows: EditorRow[]) => void;
}

export function LineItemsEditor({ rows, onChange }: Props) {
  const update = (key: string, patch: Partial<EditorRow>) =>
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const remove = (key: string) => onChange(rows.filter((r) => r.key !== key));

  const move = (index: number, dir: -1 | 1) => {
    const next = [...rows];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const add = (category: LineItemCategory) => onChange([...rows, newRow(category)]);

  return (
    <div>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.key} className="rounded-xl border border-line bg-cream-card p-3">
            <div className="flex items-start gap-2">
              <Input
                aria-label="Description"
                placeholder="What's the line?"
                value={row.description}
                onChange={(e) => update(row.key, { description: e.target.value })}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => remove(row.key)}
                aria-label="Delete line"
                className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg text-navy-muted hover:bg-cream-deep hover:text-red-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Select
                aria-label="Category"
                value={row.category}
                onChange={(e) =>
                  update(row.key, { category: e.target.value as LineItemCategory })
                }
                className="h-9 w-28 text-sm"
              >
                {(Object.keys(CATEGORY_LABELS) as LineItemCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
              <Input
                aria-label="Quantity"
                inputMode="decimal"
                value={row.quantity}
                onChange={(e) => update(row.key, { quantity: e.target.value })}
                className="h-9 w-16 text-sm"
                placeholder="Qty"
              />
              <Input
                aria-label="Unit"
                value={row.unit}
                onChange={(e) => update(row.key, { unit: e.target.value })}
                className="h-9 w-16 text-sm"
                placeholder="unit"
              />
              <div className="flex items-center">
                <span className="text-navy-muted">$</span>
                <Input
                  aria-label="Unit price"
                  inputMode="decimal"
                  value={row.unitPrice}
                  onChange={(e) => update(row.key, { unitPrice: e.target.value })}
                  className="h-9 w-24 text-sm"
                  placeholder="0.00"
                />
              </div>
              <span className="ml-auto text-sm font-semibold">
                {money(lineTotal(Number(row.quantity) || 0, Number(row.unitPrice) || 0))}
              </span>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  aria-label="Move up"
                  disabled={i === 0}
                  className="flex h-8 w-7 items-center justify-center rounded text-navy-muted hover:bg-cream-deep disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  aria-label="Move down"
                  disabled={i === rows.length - 1}
                  className="flex h-8 w-7 items-center justify-center rounded text-navy-muted hover:bg-cream-deep disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => add('labor')}>
          + Labor
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => add('materials')}>
          + Materials
        </Button>
      </div>
    </div>
  );
}
