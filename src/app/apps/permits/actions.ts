'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { PermitStatus } from '@/lib/types';

const STATUSES: PermitStatus[] = ['applied', 'issued', 'inspection', 'closed'];
const s = (form: FormData, key: string) => String(form.get(key) ?? '').trim() || null;

export async function createPermit(formData: FormData): Promise<void> {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const jobName = s(formData, 'job_name');
  if (!jobName) redirect('/apps/permits?error=missing');

  const inspection = s(formData, 'inspection_date');
  const supabase = createClient();
  const { error } = await supabase.from('permits').insert({
    user_id: user.id,
    job_name: jobName,
    jurisdiction: s(formData, 'jurisdiction'),
    permit_no: s(formData, 'permit_no'),
    inspection_date: inspection && /^\d{4}-\d{2}-\d{2}$/.test(inspection) ? inspection : null,
    notes: s(formData, 'notes'),
  });
  if (error) redirect('/apps/permits?error=save');

  revalidatePath('/apps/permits');
  redirect('/apps/permits');
}

export async function advancePermit(id: string, status: PermitStatus): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  if (!STATUSES.includes(status)) return;
  const supabase = createClient();
  await supabase.from('permits').update({ status }).eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/permits');
}

export async function deletePermit(id: string): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const supabase = createClient();
  await supabase.from('permits').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/permits');
}
