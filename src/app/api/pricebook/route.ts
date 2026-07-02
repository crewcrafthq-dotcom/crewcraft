import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/** The signed-in contractor's price book — feeds the editor's quick-add picker. */
export async function GET() {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ error: 'You need to sign in again.' }, { status: 401 });

  const supabase = createClient();
  const { data } = await supabase
    .from('price_book_items')
    .select('id, category, description, unit, unit_price')
    .eq('user_id', user.id)
    .order('category')
    .order('description');

  return NextResponse.json({ items: data ?? [] });
}
