import type { PriceBookItem, Trade } from '@/lib/types';
import { getTheme } from '@/lib/trades';

export interface PromptOptions {
  /** The contractor's saved rates/materials — the model prices with these. */
  priceBook?: PriceBookItem[];
  /** Job-site photos are attached to the message. */
  hasPhotos?: boolean;
  /** Produce three Good/Better/Best options instead of one estimate. */
  tiers?: boolean;
}

const SINGLE_SHAPE = `{
  "scopeOfWork": "string",
  "lineItems": [
    {"category": "labor"|"materials"|"other", "description": "string", "quantity": number, "unit": "string", "unitPrice": number}
  ],
  "assumptions": ["string"]
}`;

const TIERS_SHAPE = `{
  "tiers": [
    {
      "name": "Good"|"Better"|"Best",
      "scopeOfWork": "string",
      "lineItems": [
        {"category": "labor"|"materials"|"other", "description": "string", "quantity": number, "unit": "string", "unitPrice": number}
      ],
      "assumptions": ["string"]
    }
  ]
}`;

/**
 * The line-item generator system prompt (§5), used as-is with the braces
 * filled. Do not soften the "Return ONLY valid JSON" instruction — the route
 * depends on it (and still defends against stray fences).
 */
export function buildSystemPrompt(
  trade: Trade,
  laborRate: number,
  options: PromptOptions = {},
): string {
  const tradeLabel = getTheme(trade).label;
  const rate = Number.isFinite(laborRate) ? laborRate : 0;

  const priceBookBlock =
    options.priceBook && options.priceBook.length > 0
      ? `\nThe contractor's saved price book — when a line matches one of these, use its exact unit and price:\n` +
        options.priceBook
          .map(
            (p) =>
              `- [${p.category}] ${p.description} — $${p.unit_price}${p.unit ? ` per ${p.unit}` : ''}`,
          )
          .join('\n')
      : '';

  const photosRule = options.hasPhotos
    ? '\n- Job-site photos are attached. Read equipment types, sizes, model info, visible damage, and site conditions from them; fold what you see into the line items and call out anything notable in the assumptions.'
    : '';

  const tiersRules = options.tiers
    ? `\n- Produce EXACTLY three options named "Good", "Better", and "Best".
- "Good" is the budget fix that solves the problem. "Better" is the recommended job most customers pick. "Best" adds the upgrades a quality-focused customer would want (better equipment, longer warranty, extras).
- Each option stands alone with its own complete line items, scope, and assumptions.`
    : '';

  return `You are an estimating assistant for a ${tradeLabel} contractor. Convert a plain-English job description into structured estimate line items.
Context:
- Trade: ${tradeLabel}
- Contractor's default labor rate: $${rate}/hr${priceBookBlock}
Rules:
- Break the work into clear line items. Separate labor from materials.
- Use sensible units for the trade (hours for labor; each/ft/unit for materials). Use the contractor's labor rate for labor lines.
- Prices are STARTING SUGGESTIONS the contractor will review and edit. Be reasonable and slightly conservative.
- Do not add permit fees, tax, or markup unless the description mentions them — the app handles tax separately.
- If the description is vague, make sensible assumptions and list them so the contractor can confirm.
- Write a short scope-of-work paragraph (2–4 sentences) in plain, confident language a homeowner understands. No marketing-speak.${photosRule}${tiersRules}
Return ONLY valid JSON, no markdown, in exactly this shape:
${options.tiers ? TIERS_SHAPE : SINGLE_SHAPE}`;
}
