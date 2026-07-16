import { NextResponse, type NextRequest } from 'next/server';

import { getSession } from '@/lib/auth';
import { AI_DAILY_LIMIT, AI_MAX_PHOTOS } from '@/lib/config';
import { checkRateLimit, recordRateEvent } from '@/lib/rate-limit';
import {
  AiParseError,
  generateEstimate,
  generateEstimateTiers,
  type PhotoInput,
} from '@/lib/ai/generate';
import { createClient } from '@/lib/supabase/server';
import type { PriceBookItem } from '@/lib/types';

export const runtime = 'nodejs';

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
// Photos are downscaled client-side; anything bigger than ~3MB of base64 per
// photo means that didn't happen.
const PHOTO_MAX_B64 = 3 * 1024 * 1024 * 1.4;

/**
 * Line-item generator (§5). Server-only — the Anthropic key never reaches the
 * browser. Accepts optional job-site photos and a Good/Better/Best flag, and
 * prices with the contractor's saved price book. Returns the parsed shape, or
 * a friendly error the editor can show.
 */
export async function POST(request: NextRequest) {
  const { user, business } = await getSession();
  if (!user || !business) {
    return NextResponse.json({ error: 'You need to sign in again.' }, { status: 401 });
  }

  // Per-user daily cap — protects the Anthropic bill from runaway scripts.
  const aiKey = `ai:${user.id}`;
  const { allowed } = await checkRateLimit(aiKey, AI_DAILY_LIMIT, 24 * 60);
  if (!allowed) {
    return NextResponse.json(
      { error: 'You’ve hit today’s AI limit — it resets tomorrow. Add line items by hand for now.' },
      { status: 429 },
    );
  }

  let body: { jobDescription?: unknown; photos?: unknown; tiers?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const jobDescription = String(body?.jobDescription ?? '').trim();
  const photos = parsePhotos(body?.photos);
  if (photos === null) {
    return NextResponse.json(
      { error: `Photos must be JPEG/PNG/WebP — up to ${AI_MAX_PHOTOS}.` },
      { status: 400 },
    );
  }
  if (!jobDescription && photos.length === 0) {
    return NextResponse.json({ error: 'Describe the job first.' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI isn’t set up yet — add line items by hand.' }, { status: 503 });
  }

  // The contractor's saved rates make the drafts come back priced their way.
  const supabase = createClient();
  const { data: pb } = await supabase
    .from('price_book_items')
    .select('*')
    .eq('user_id', user.id)
    .order('category')
    .limit(60);
  const priceBook = (pb ?? []) as PriceBookItem[];

  const args = {
    trade: business.trade,
    laborRate: business.default_labor_rate ?? 0,
    jobDescription: jobDescription || 'See the attached job-site photos.',
    photos,
    priceBook,
  };

  try {
    const result = body?.tiers === true
      ? await generateEstimateTiers(args)
      : await generateEstimate(args);
    await recordRateEvent(aiKey);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AiParseError) {
      return NextResponse.json(
        { error: "couldn't read that — try rephrasing the job" },
        { status: 422 },
      );
    }
    console.error('AI generate failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong building the items. Try again, or add them by hand.' },
      { status: 500 },
    );
  }
}

/** Validate the photos array; [] when absent, null when malformed. */
function parsePhotos(raw: unknown): PhotoInput[] | null {
  if (raw == null) return [];
  if (!Array.isArray(raw) || raw.length > AI_MAX_PHOTOS) return null;

  const photos: PhotoInput[] = [];
  for (const item of raw) {
    const mediaType = (item as { mediaType?: unknown })?.mediaType;
    const data = (item as { data?: unknown })?.data;
    if (
      typeof mediaType !== 'string' ||
      !PHOTO_TYPES.includes(mediaType as (typeof PHOTO_TYPES)[number]) ||
      typeof data !== 'string' ||
      data.length === 0 ||
      data.length > PHOTO_MAX_B64 ||
      !/^[A-Za-z0-9+/=]+$/.test(data)
    ) {
      return null;
    }
    photos.push({ mediaType: mediaType as PhotoInput['mediaType'], data });
  }
  return photos;
}
