import { NextResponse, type NextRequest } from 'next/server';

import { AiParseError, generateEstimate } from '@/lib/ai/generate';
import {
  TRY_IT_GLOBAL_DAILY_LIMIT,
  TRY_IT_IP_LIMIT,
  TRY_IT_IP_WINDOW_MIN,
  TRY_IT_LABOR_RATE,
} from '@/lib/config';
import { computeTotals } from '@/lib/estimates';
import { checkRateLimit, clientIp, recordRateEvent } from '@/lib/rate-limit';
import { TRADES, type Trade } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JOB_MIN = 10;
const JOB_MAX = 600;

/**
 * The homepage demo, for real (§ landing page). An anonymous visitor types
 * their own job and gets genuine AI line items back — the canned per-trade
 * script it replaced could never show whether the model actually understands
 * their trade.
 *
 * Unauthenticated and it spends money, so it is fenced on three sides: per-IP
 * burst, a global daily ceiling, and fail-closed rate limiting. Totals are
 * computed here with computeTotals like everywhere else — the model's
 * arithmetic is never used.
 */
export async function POST(request: NextRequest) {
  let body: { trade?: unknown; job?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const trade = String(body?.trade ?? '') as Trade;
  if (!TRADES.includes(trade)) {
    return NextResponse.json({ error: 'Pick a trade first.' }, { status: 400 });
  }

  const job = String(body?.job ?? '').trim();
  if (job.length < JOB_MIN) {
    return NextResponse.json({ error: 'Describe the job in a sentence or two.' }, { status: 400 });
  }
  if (job.length > JOB_MAX) {
    return NextResponse.json(
      { error: `Keep it under ${JOB_MAX} characters for the demo.` },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'The live demo is off right now.' }, { status: 503 });
  }

  const ip = clientIp(request.headers);
  const ipKey = `try-it:${ip}`;
  const globalKey = 'try-it:global';

  const ipCheck = await checkRateLimit(ipKey, TRY_IT_IP_LIMIT, TRY_IT_IP_WINDOW_MIN, {
    failClosed: true,
  });
  if (!ipCheck.allowed) {
    return NextResponse.json(
      { error: 'That’s a few demos in a row — start free and run as many as you like.' },
      { status: 429 },
    );
  }

  const globalCheck = await checkRateLimit(globalKey, TRY_IT_GLOBAL_DAILY_LIMIT, 24 * 60, {
    failClosed: true,
  });
  if (!globalCheck.allowed) {
    return NextResponse.json(
      { error: 'The demo is busy today — start free to run your own jobs.' },
      { status: 429 },
    );
  }

  try {
    const result = await generateEstimate({
      trade,
      laborRate: TRY_IT_LABOR_RATE,
      jobDescription: job,
      priceBook: [],
    });

    // Never trust the model's arithmetic (architecture rule 1).
    const totals = computeTotals(
      result.lineItems.map((li) => ({ quantity: li.quantity, unitPrice: li.unitPrice })),
      0,
      0,
    );

    await recordRateEvent(ipKey);
    await recordRateEvent(globalKey);

    return NextResponse.json({
      scopeOfWork: result.scopeOfWork,
      lineItems: result.lineItems,
      assumptions: result.assumptions,
      subtotal: totals.subtotal,
      total: totals.total,
      laborRate: TRY_IT_LABOR_RATE,
    });
  } catch (err) {
    if (err instanceof AiParseError) {
      return NextResponse.json(
        { error: 'Couldn’t read that one — try describing the job a bit differently.' },
        { status: 422 },
      );
    }
    console.error('try-it demo generate failed:', err);
    return NextResponse.json({ error: 'Something went wrong. Try again in a moment.' }, { status: 500 });
  }
}
