'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { BusinessFormState } from '@/components/BusinessForm';
import { writeBusinessFromForm } from '@/lib/business-write';

export async function createBusinessAction(
  _prev: BusinessFormState,
  formData: FormData,
): Promise<BusinessFormState> {
  const res = await writeBusinessFromForm(formData);
  if (!res.ok) return { error: res.error };
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
