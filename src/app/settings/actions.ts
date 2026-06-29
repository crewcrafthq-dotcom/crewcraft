'use server';

import { revalidatePath } from 'next/cache';

import type { BusinessFormState } from '@/components/BusinessForm';
import { writeBusinessFromForm } from '@/lib/business-write';

export async function updateBusinessAction(
  _prev: BusinessFormState,
  formData: FormData,
): Promise<BusinessFormState> {
  const res = await writeBusinessFromForm(formData);
  if (!res.ok) return { error: res.error };
  revalidatePath('/settings');
  revalidatePath('/dashboard');
  return { ok: true };
}
