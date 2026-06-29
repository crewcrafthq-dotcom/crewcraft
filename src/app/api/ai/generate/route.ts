import { NextResponse, type NextRequest } from 'next/server';

import { getSession } from '@/lib/auth';
import { AiParseError, generateEstimate } from '@/lib/ai/generate';

export const runtime = 'nodejs';

/**
 * Line-item generator (§5). Server-only — the Anthropic key never reaches the
 * browser. Returns the parsed { scopeOfWork, lineItems, assumptions } shape, or
 * a friendly error the editor can show.
 */
export async function POST(request: NextRequest) {
  const { user, business } = await getSession();
  if (!user || !business) {
    return NextResponse.json({ error: 'You need to sign in again.' }, { status: 401 });
  }

  let body: { jobDescription?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const jobDescription = String(body?.jobDescription ?? '').trim();
  if (!jobDescription) {
    return NextResponse.json({ error: 'Describe the job first.' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI isn’t set up yet — add line items by hand.' }, { status: 503 });
  }

  try {
    const result = await generateEstimate({
      trade: business.trade,
      laborRate: business.default_labor_rate ?? 0,
      jobDescription,
    });
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
