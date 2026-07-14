'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react';

import { Input, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { CATEGORY_LABELS, lineTotal } from '@/lib/estimates';
import { money } from '@/lib/format';
import type { LineItemCategory, PriceBookItem } from '@/lib/types';
import { newRow, type EditorRow } from './types';

interface Props {
  rows: EditorRow[];
  onChange: (rows: EditorRow[]) => void;
}

type PickerItem = Pick<PriceBookItem, 'id' | 'category' | 'description' | 'unit' | 'unit_price'>;

const iconBtn =
  'grid h-8 w-8 place-items-center rounded-lg text-ink-mute transition cursor-pointer ' +
  'hover:bg-paper-700 disabled:cursor-default disabled:opacity-30';

export function LineItemsEditor({ rows, onChange }: Props) {
  const [picker, setPicker] = useState<PickerItem[] | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);

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

  async function openPicker() {
    if (pickerOpen) {
      setPickerOpen(false);
      return;
    }
    setPickerOpen(true);
    if (picker === null) {
      setPickerLoading(true);
      try {
        const res = await fetch('/api/pricebook');
        const json = await res.json().catch(() => ({}));
        setPicker(res.ok ? ((json.items ?? []) as PickerItem[]) : []);
      } catch {
        setPicker([]);
      } finally {
        setPickerLoading(false);
      }
    }
  }

  function addFromBook(item: PickerItem) {
    onChange([
      ...rows,
      {
        key: Math.random().toString(36).slice(2),
        category: item.category,
        description: item.description,
        quantity: '1',
        unit: item.unit,
        unitPrice: String(item.unit_price),
      },
    ]);
  }

  return (
    <div>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-hairline bg-paper-850 px-4 py-6 text-center text-sm text-ink-mute">
          No line items yet. Build them from the job above, or add them by hand.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={row.key} className="rounded-xl border border-hairline bg-paper-850 p-3">
              <div className="flex items-start gap-2">
                <Input
                  aria-label="Description"
                  placeholder="What's the line?"
                  value={row.description}
                  onChange={(e) => update(row.key, { description: e.target.value })}
                  className="flex-1 bg-paper-800"
                />
                <button
                  type="button"
                  onClick={() => remove(row.key)}
                  aria-label="Delete line"
                  className={iconBtn + ' mt-1.5 hover:text-bad'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Select
                  aria-label="Category"
                  value={row.category}
                  onChange={(e) => update(row.key, { category: e.target.value as LineItemCategory })}
                  className="h-9 w-28 bg-paper-800 text-sm"
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
                  className="h-9 w-16 bg-paper-800 text-sm"
                  placeholder="Qty"
                />
                <Input
                  aria-label="Unit"
                  value={row.unit}
                  onChange={(e) => update(row.key, { unit: e.target.value })}
                  className="h-9 w-16 bg-paper-800 text-sm"
                  placeholder="unit"
                />
                <div className="flex items-center rounded-xl border border-hairline bg-paper-800 pl-2.5 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
                  <span className="text-ink-mute">$</span>
                  <Input
                    aria-label="Unit price"
                    inputMode="decimal"
                    value={row.unitPrice}
                    onChange={(e) => update(row.key, { unitPrice: e.target.value })}
                    className="h-9 w-20 border-0 bg-transparent pl-1 text-sm focus:ring-0"
                    placeholder="0.00"
                  />
                </div>
                <span className="ml-auto text-sm font-semibold text-ink">
                  {money(lineTotal(Number(row.quantity) || 0, Number(row.unitPrice) || 0))}
                </span>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    aria-label="Move up"
                    disabled={i === 0}
                    className={iconBtn}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    aria-label="Move down"
                    disabled={i === rows.length - 1}
                    className={iconBtn}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => add('labor')}>
          <Plus />
          Labor
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => add('materials')}>
          <Plus />
          Materials
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={openPicker}>
          <BookOpen />
          From price book
        </Button>
      </div>

      {pickerOpen ? (
        <div className="mt-3 rounded-xl border border-hairline bg-paper-850 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Price book</p>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              aria-label="Close price book"
              className={iconBtn}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {pickerLoading ? (
            <p className="py-3 text-sm text-ink-mute">Loading…</p>
          ) : !picker || picker.length === 0 ? (
            <p className="py-3 text-sm text-ink-mute">
              Nothing saved yet.{' '}
              <Link href="/pricebook" className="text-accent-bright underline-offset-2 hover:underline">
                Add your rates in the Price Book
              </Link>{' '}
              and they&rsquo;ll show up here.
            </p>
          ) : (
            <div className="max-h-56 divide-y divide-hairline overflow-y-auto">
              {picker.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addFromBook(item)}
                  className="flex w-full items-center gap-3 px-1 py-2 text-left transition hover:bg-paper-800"
                >
                  <span className="w-20 flex-none text-xs font-semibold uppercase tracking-wide text-ink-mute">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.description}</span>
                  <span className="flex-none text-sm text-ink-soft">
                    {money(item.unit_price)}
                    {item.unit ? <span className="text-ink-mute"> / {item.unit}</span> : null}
                  </span>
                  <Plus className="h-4 w-4 flex-none text-ink-mute" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
