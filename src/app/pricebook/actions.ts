'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import type { LineItemCategory } from '@/lib/types';

const CATEGORIES: LineItemCategory[] = ['labor', 'materials', 'other'];

/** Add one saved rate/material from the price book form. */
export async function addPriceBookItem(formData: FormData): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const rawCategory = String(formData.get('category') ?? '');
  const category = CATEGORIES.includes(rawCategory as LineItemCategory)
    ? (rawCategory as LineItemCategory)
    : 'other';
  const description = String(formData.get('description') ?? '').trim().slice(0, 200);
  const unit = String(formData.get('unit') ?? '').trim().slice(0, 20);
  const price = Number(formData.get('unit_price'));
  const unit_price = Number.isFinite(price) && price >= 0 ? Math.round(price * 100) / 100 : 0;

  if (!description) return;

  await supabase.from('price_book_items').insert({
    user_id: user.id,
    category,
    description,
    unit,
    unit_price,
  });

  revalidatePath('/pricebook');
}

/** Remove a saved item. */
export async function deletePriceBookItem(formData: FormData): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await supabase.from('price_book_items').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/pricebook');
}
