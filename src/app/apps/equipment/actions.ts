'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const s = (form: FormData, key: string) => String(form.get(key) ?? '').trim() || null;

export async function createEquipment(formData: FormData): Promise<void> {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const customer = s(formData, 'customer_name');
  const label = s(formData, 'label');
  if (!customer || !label) redirect('/apps/equipment?error=missing');

  const year = Number(formData.get('installed_year'));
  const supabase = createClient();
  const { error } = await supabase.from('equipment').insert({
    user_id: user.id,
    customer_name: customer,
    label,
    brand: s(formData, 'brand'),
    model: s(formData, 'model'),
    serial: s(formData, 'serial'),
    filter_size: s(formData, 'filter_size'),
    refrigerant: s(formData, 'refrigerant'),
    installed_year: Number.isInteger(year) && year > 1950 && year < 2100 ? year : null,
    notes: s(formData, 'notes'),
  });
  if (error) redirect('/apps/equipment?error=save');

  revalidatePath('/apps/equipment');
  redirect('/apps/equipment');
}

export async function deleteEquipment(id: string): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const supabase = createClient();
  await supabase.from('equipment').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/equipment');
}
