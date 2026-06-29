import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

import { AI_MODEL } from '@/lib/config';
import { roundCents } from '@/lib/format';
import type { GeneratedEstimate, Trade } from '@/lib/types';
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

  return {
    scopeOfWork: result.data.scopeOfWork.trim(),
    lineItems: result.data.lineItems.map((li) => ({
      category: li.category,
      description: li.description.trim(),
      quantity: Math.max(0, Number.isFinite(li.quantity) ? li.quantity : 0),
      unit: li.unit.trim(),
      unitPrice: roundCents(Math.max(0, Number.isFinite(li.unitPrice) ? li.unitPrice : 0)),
    })),
    assumptions: result.data.assumptions.map((a) => a.trim()).filter(Boolean),
  };
}

interface GenerateArgs {
  trade: Trade;
  laborRate: number;
  jobDescription: string;
}

/** Call the model and return parsed suggestions. Server-only. */
export async function generateEstimate({
  trade,
  laborRate,
  jobDescription,
}: GenerateArgs): Promise<GeneratedEstimate> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 2048,
    system: buildSystemPrompt(trade, laborRate),
    messages: [{ role: 'user', content: jobDescription }],
  });

  // Read text output safely — never assume content[0] is text.
  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  return parseGenerated(text);
}
