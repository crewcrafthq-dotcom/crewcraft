import type { Trade } from '@/lib/types';

export interface PostMeta {
  slug: string;
  /** The headline: used for the H1 and the card on /blog. Written to be read. */
  title: string;
  /**
   * SEO <title>, when the headline is too long for Google's ~60 char cut-off.
   * Budget is 49 chars — the " · Toolbelt" template eats the other 11.
   * Falls back to `title` when omitted.
   */
  metaTitle?: string;
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
