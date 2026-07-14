import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

import { AI_MODEL } from '@/lib/config';
import { roundCents } from '@/lib/format';
import type {
  GeneratedEstimate,
  GeneratedTiers,
  PriceBookItem,
  Trade,
} from '@/lib/types';
import { buildSystemPrompt } from './prompt';

/** Thrown when the model's output can't be read as the expected shape. */
export class AiParseError extends Error {
  constructor() {
    super("couldn't read that — try rephrasing the job");
    this.name = 'AiParseError';
  }
}

const lineItemSchema = z.object({
  category: z.enum(['labor', 'materials', 'other']),
  description: z.string(),
  quantity: z.coerce.number(),
  unit: z.string(),
  unitPrice: z.coerce.number(),
});

const generatedSchema = z.object({
  scopeOfWork: z.string(),
  lineItems: z.array(lineItemSchema),
  assumptions: z.array(z.string()),
});

const tiersSchema = z.object({
  tiers: z
    .array(generatedSchema.extend({ name: z.string() }))
    .min(2)
    .max(3),
});

/**
 * Pull the JSON object out of the model's text: strip any stray code fences,
 * then take the first `{` through the last `}`. Tolerant of a stray sentence
 * before or after the JSON.
 */
function extractJson(text: string): string {
  const unfenced = text.replace(/```(?:json)?/gi, '');
  const start = unfenced.indexOf('{');
  const end = unfenced.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return unfenced.trim();
  return unfenced.slice(start, end + 1);
}

function sanitize(data: z.infer<typeof generatedSchema>): GeneratedEstimate {
  return {
    scopeOfWork: data.scopeOfWork.trim(),
    lineItems: data.lineItems.map((li) => ({
      category: li.category,
      description: li.description.trim(),
      quantity: Math.max(0, Number.isFinite(li.quantity) ? li.quantity : 0),
      unit: li.unit.trim(),
      unitPrice: roundCents(Math.max(0, Number.isFinite(li.unitPrice) ? li.unitPrice : 0)),
    })),
    assumptions: data.assumptions.map((a) => a.trim()).filter(Boolean),
  };
}

/**
 * Parse + sanitize the model's reply into a GeneratedEstimate. Pure and
 * network-free, so it's unit-tested directly. Prices/quantities are clamped to
 * sane values; final arithmetic is still done in computeTotals, never here.
 */
export function parseGenerated(raw: string): GeneratedEstimate {
  let data: unknown;
  try {
    data = JSON.parse(extractJson(raw));
  } catch {
    throw new AiParseError();
  }

  const result = generatedSchema.safeParse(data);
  if (!result.success) throw new AiParseError();

  return sanitize(result.data);
}

/** Parse + sanitize a Good/Better/Best reply. Pure, unit-testable. */
export function parseGeneratedTiers(raw: string): GeneratedTiers {
  let data: unknown;
  try {
    data = JSON.parse(extractJson(raw));
  } catch {
    throw new AiParseError();
  }

  const result = tiersSchema.safeParse(data);
  if (!result.success) throw new AiParseError();

  return {
    tiers: result.data.tiers.map((tier) => ({
      name: tier.name.trim() || 'Option',
      ...sanitize(tier),
    })),
  };
}

/** A job-site photo, already downscaled and base64-encoded by the editor. */
export interface PhotoInput {
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp';
  data: string; // base64, no data: prefix
}

interface GenerateArgs {
  trade: Trade;
  laborRate: number;
  jobDescription: string;
  photos?: PhotoInput[];
  priceBook?: PriceBookItem[];
}

async function callModel(args: GenerateArgs, tiers: boolean): Promise<string> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

  const photoBlocks: Anthropic.ImageBlockParam[] = (args.photos ?? []).map((p) => ({
    type: 'image',
    source: { type: 'base64', media_type: p.mediaType, data: p.data },
  }));

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: tiers ? 4096 : 2048,
    system: buildSystemPrompt(args.trade, args.laborRate, {
      priceBook: args.priceBook,
      hasPhotos: photoBlocks.length > 0,
      tiers,
    }),
    messages: [
      {
        role: 'user',
        content: [...photoBlocks, { type: 'text', text: args.jobDescription }],
      },
    ],
  });

  // Read text output safely — never assume content[0] is text.
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}

/** Call the model and return parsed suggestions. Server-only. */
export async function generateEstimate(args: GenerateArgs): Promise<GeneratedEstimate> {
  return parseGenerated(await callModel(args, false));
}

/** Call the model for three Good/Better/Best options. Server-only. */
export async function generateEstimateTiers(args: GenerateArgs): Promise<GeneratedTiers> {
  return parseGeneratedTiers(await callModel(args, true));
}
