import 'server-only';

import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'node:crypto';
import { z } from 'zod';

import { AI_MODEL_FALLBACK } from '@/lib/config';
import { createAdminClient } from '@/lib/supabase/admin';
import type { EstimateWithItems, PdfTranslation } from '@/lib/types';
import { normalizeLang } from './languages';
import { PDF_LANGUAGES } from './languages';
import { stringsFor, type PdfStrings } from './i18n';

export interface Localized {
  estimate: EstimateWithItems;
  strings: PdfStrings;
  locale: string;
}

/** English name of a language, for the translation instruction. */
function languageName(lang: string): string {
  return PDF_LANGUAGES.find((l) => l.code === lang)?.label ?? 'English';
}

/** The translatable free-text of an estimate + a fingerprint of it. */
function sourceBundle(estimate: EstimateWithItems) {
  const items: Record<string, string> = {};
  for (const li of estimate.line_items) {
    if (li.description?.trim()) items[li.id] = li.description;
  }
  const bundle = {
    scope: estimate.scope_of_work ?? null,
    notes: estimate.notes ?? null,
    items,
  };
  const hash = createHash('sha1').update(JSON.stringify(bundle)).digest('hex').slice(0, 16);
  return { bundle, hash };
}

const translationSchema = z.object({
  scope: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  items: z.record(z.string(), z.string()).optional(),
});

/** Apply a cached/fresh translation onto a copy of the estimate. */
function applyTranslation(estimate: EstimateWithItems, t: PdfTranslation): EstimateWithItems {
  return {
    ...estimate,
    scope_of_work: t.scope ?? estimate.scope_of_work,
    notes: t.notes ?? estimate.notes,
    line_items: estimate.line_items.map((li) => ({
      ...li,
      description: t.items[li.id] ?? li.description,
    })),
  };
}

/**
 * Return an estimate ready to render in its chosen PDF language: translated
 * labels always, and translated typed content (cached) for non-English. Never
 * throws — on any failure the labels still localize and the content falls back
 * to what the contractor typed, so a PDF is always produced.
 */
export async function localizeEstimate(estimate: EstimateWithItems): Promise<Localized> {
  const lang = normalizeLang(estimate.pdf_language);
  const strings = stringsFor(lang);
  const locale = PDF_LANGUAGES.find((l) => l.code === lang)?.locale ?? 'en-US';

  if (lang === 'en') return { estimate, strings, locale };

  const { bundle, hash } = sourceBundle(estimate);
  const nothingToTranslate = !bundle.scope && !bundle.notes && Object.keys(bundle.items).length === 0;
  if (nothingToTranslate) return { estimate, strings, locale };

  // Fresh cache hit?
  const cached = estimate.pdf_translation;
  if (cached && cached.lang === lang && cached.hash === hash) {
    return { estimate: applyTranslation(estimate, cached), strings, locale };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { estimate, strings, locale }; // labels only
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: AI_MODEL_FALLBACK,
      max_tokens: 2048,
      system:
        `You translate a contractor's estimate content into ${languageName(lang)}. ` +
        'Translate the string VALUES only; keep the JSON keys and the item ids unchanged. ' +
        'Preserve numbers, measurements, units, and proper nouns. Use natural trade terminology. ' +
        'Return ONLY the JSON object, same shape as the input.',
      messages: [{ role: 'user', content: JSON.stringify(bundle) }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = translationSchema.parse(JSON.parse(json));

    const translation: PdfTranslation = {
      lang,
      hash,
      scope: parsed.scope ?? bundle.scope,
      notes: parsed.notes ?? bundle.notes,
      items: { ...bundle.items, ...(parsed.items ?? {}) },
    };

    // Cache it (best-effort; a failed write just means we translate again).
    createAdminClient()
      .from('estimates')
      .update({ pdf_translation: translation })
      .eq('id', estimate.id)
      .then(undefined, () => undefined);

    return { estimate: applyTranslation(estimate, translation), strings, locale };
  } catch (err) {
    console.error('PDF translation failed:', err);
    return { estimate, strings, locale }; // labels localized, content as-typed
  }
}
