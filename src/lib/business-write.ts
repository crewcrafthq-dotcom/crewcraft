import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { TRADES, type Trade } from '@/lib/types';

export type WriteResult = { ok: true } | { ok: false; error: string };

function str(form: FormData, key: string): string | null {
  const v = String(form.get(key) ?? '').trim();
  return v === '' ? null : v;
}

function num(form: FormData, key: string): number {
  const v = Number(form.get(key));
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

/**
 * Create or update the user's single business row from a submitted form.
 * Handles the optional logo upload to the (public) `logos` bucket. Shared by
 * onboarding and settings.
 */
export async function writeBusinessFromForm(formData: FormData): Promise<WriteResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You need to sign in again.' };

  const trade = String(formData.get('trade') ?? '') as Trade;
  if (!TRADES.includes(trade)) return { ok: false, error: 'Pick your trade.' };

  const name = str(formData, 'name');
  if (!name) return { ok: false, error: 'Add your company name.' };

  // Optional logo upload (stored under the user's own folder per storage RLS).
  let logoUrl: string | undefined;
  const logo = formData.get('logo');
  if (logo instanceof File && logo.size > 0) {
    if (logo.size > 5 * 1024 * 1024) {
      return { ok: false, error: 'Logo is too big — keep it under 5MB.' };
    }
    const ext = (logo.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${user.id}/logo-${Date.now()}.${ext || 'png'}`;
    const { error: upErr } = await supabase.storage
      .from('logos')
      .upload(path, logo, { upsert: true, contentType: logo.type || undefined });
    if (upErr) return { ok: false, error: 'Logo upload failed — try a smaller image.' };
    logoUrl = supabase.storage.from('logos').getPublicUrl(path).data.publicUrl;
  }

  const fields: Record<string, unknown> = {
    trade,
    name,
    license: str(formData, 'license'),
    phone: str(formData, 'phone'),
    email: str(formData, 'email'),
    address: str(formData, 'address'),
    default_tax_rate: num(formData, 'default_tax_rate'),
    default_labor_rate: num(formData, 'default_labor_rate'),
  };

  // Get-paid + review settings only exist on the settings form (not onboarding)
  // — write them only when the form actually carried them.
  for (const key of ['review_link', 'payment_link', 'payment_instructions'] as const) {
    if (formData.has(key)) fields[key] = str(formData, key);
  }
  // Checkboxes: a sentinel field marks the form as carrying them, since an
  // unchecked box submits nothing at all.
  if (formData.has('auto_invoice_present')) {
    fields.auto_invoice = formData.get('auto_invoice') === 'on';
  }
  if (formData.has('auto_review_request_present')) {
    fields.auto_review_request = formData.get('auto_review_request') === 'on';
  }

  const { data: existing } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  // Self-heal for the window before migration 0008 runs: if the write fails
  // and carried auto_review_request, retry without it so every other setting
  // still saves. Remove once the column is live everywhere.
  const withoutAutoReview = (row: Record<string, unknown>) => {
    const { auto_review_request: _skip, ...rest } = row;
    return rest;
  };

  if (existing) {
    const patch = logoUrl ? { ...fields, logo_url: logoUrl } : fields;
    let { error } = await supabase.from('businesses').update(patch).eq('user_id', user.id);
    if (error && 'auto_review_request' in patch) {
      ({ error } = await supabase
        .from('businesses')
        .update(withoutAutoReview(patch))
        .eq('user_id', user.id));
    }
    if (error) return { ok: false, error: 'Could not save. Try again.' };
  } else {
    const row = { user_id: user.id, ...fields, logo_url: logoUrl ?? null };
    let { error } = await supabase.from('businesses').insert(row);
    if (error && 'auto_review_request' in row) {
      ({ error } = await supabase.from('businesses').insert(withoutAutoReview(row)));
    }
    if (error) return { ok: false, error: 'Could not save. Try again.' };
  }

  return { ok: true };
}
