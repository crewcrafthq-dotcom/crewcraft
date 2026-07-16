'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function deleteLead(id: string): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const supabase = createClient();
  await supabase.from('leads').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/lead-page');
}
