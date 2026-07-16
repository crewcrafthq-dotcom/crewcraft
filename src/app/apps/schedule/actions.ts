'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { JobStatus } from '@/lib/types';

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Create a job from the schedule form and stay on the schedule. */
export async function createJob(formData: FormData): Promise<void> {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const title = String(formData.get('title') ?? '').trim();
  const date = String(formData.get('date') ?? '').trim(); // yyyy-mm-dd
  const time = String(formData.get('time') ?? '').trim() || '09:00';
  if (!title || !date) redirect('/apps/schedule?error=missing');

  const startsAt = new Date(`${date}T${time}`);
  if (Number.isNaN(startsAt.getTime())) redirect('/apps/schedule?error=missing');

  const duration = Number(formData.get('duration_min'));
  const supabase = createClient();
  const { error } = await supabase.from('jobs').insert({
    user_id: user.id,
    title,
    customer_name: String(formData.get('customer_name') ?? '').trim() || null,
    address: String(formData.get('address') ?? '').trim() || null,
    starts_at: startsAt.toISOString(),
    duration_min: Number.isFinite(duration) && duration > 0 ? Math.min(duration, 24 * 60) : 120,
    notes: String(formData.get('notes') ?? '').trim() || null,
  });
  if (error) redirect('/apps/schedule?error=save');

  revalidatePath('/apps/schedule');
  redirect('/apps/schedule');
}

export async function setJobStatus(id: string, status: JobStatus): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const supabase = createClient();
  await supabase.from('jobs').update({ status }).eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/schedule');
}

export async function deleteJob(id: string): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const supabase = createClient();
  await supabase.from('jobs').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/schedule');
}
