'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const emailOk = (e: string) => /\S+@\S+\.\S+/.test(e);

export async function createServiceReminder(formData: FormData): Promise<void> {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const name = String(formData.get('customer_name') ?? '').trim();
  const email = String(formData.get('customer_email') ?? '').trim().toLowerCase();
  const nextDue = String(formData.get('next_due') ?? '').trim();
  const cadence = Number(formData.get('cadence_months'));
  if (!name || !emailOk(email) || !/^\d{4}-\d{2}-\d{2}$/.test(nextDue)) {
    redirect('/apps/service-reminders?error=missing');
  }

  const supabase = createClient();
  const { error } = await supabase.from('service_reminders').insert({
    user_id: user.id,
    customer_name: name,
    customer_email: email,
    cadence_months: Number.isInteger(cadence) && cadence >= 1 && cadence <= 24 ? cadence : 6,
    next_due: nextDue,
  });
  if (error) redirect('/apps/service-reminders?error=save');

  revalidatePath('/apps/service-reminders');
  redirect('/apps/service-reminders');
}

export async function toggleServiceReminder(id: string, enabled: boolean): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const supabase = createClient();
  await supabase.from('service_reminders').update({ enabled }).eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/service-reminders');
}

export async function deleteServiceReminder(id: string): Promise<void> {
  const { user } = await getSession();
  if (!user) redirect('/login');
  const supabase = createClient();
  await supabase.from('service_reminders').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/apps/service-reminders');
}
