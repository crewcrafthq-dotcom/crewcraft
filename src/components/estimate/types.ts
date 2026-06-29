import type { LineItemCategory } from '@/lib/types';

/** A line item while it's being edited (numbers kept as strings for the inputs). */
export interface EditorRow {
  key: string;
  category: LineItemCategory;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
}

export function newRow(category: LineItemCategory = 'labor'): EditorRow {
  return {
    key: Math.random().toString(36).slice(2),
    category,
    description: '',
    quantity: category === 'labor' ? '1' : '1',
    unit: category === 'labor' ? 'hr' : 'ea',
    unitPrice: '',
  };
}
