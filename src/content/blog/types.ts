import type { Trade } from '@/lib/types';

export interface PostMeta {
  slug: string;
  title: string;
  /** Meta description AND the card blurb on /blog — ~150 chars, plain. */
  description: string;
  /** ISO date, shown and used in BlogPosting JSON-LD. */
  published: string;
  readingMinutes: number;
  /** Colors the card + links the post to its /for page. Omit = all trades. */
  trade?: Trade;
  /** Short label shown on the card, e.g. "Pricing" or "Getting paid". */
  topic: string;
}
