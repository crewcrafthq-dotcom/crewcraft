import Anthropic from '@anthropic-ai/sdk';
import { NextResponse, type NextRequest } from 'next/server';

import { getSession } from '@/lib/auth';
import { AI_MODEL } from '@/lib/config';

export const runtime = 'nodejs';

const MAX_FIELD = 4000;

/**
 * Supplement Drafter (roofing): drafts a professional insurance supplement
 * request letter from the claim details. Server-only Anthropic call — same
 * key and model as the estimate generator. The output is a draft the
 * contractor reviews and owns, exactly like AI line items.
 */
export async function POST(request: NextRequest) {
  const { user, business } = await getSession();
  if (!user || !business) {
    return NextResponse.json({ error: 'You need to sign in again.' }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI isn’t set up yet.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const field = (k: string) => String(body?.[k] ?? '').trim().slice(0, MAX_FIELD);
  const insurer = field('insurer');
  const claimNumber = field('claimNumber');
  const propertyAddress = field('propertyAddress');
  const items = field('items');
  if (!items) {
    return NextResponse.json({ error: 'List the items you’re supplementing for.' }, { status: 400 });
  }

  const system = `You draft insurance supplement request letters for roofing contractors.
Write a professional, firm-but-courteous letter to the insurance carrier requesting
supplemental payment for the listed items. Rules:
- Plain business English. No pleading, no aggression, no legal threats.
- One short paragraph of context, then a numbered list: each item with its
  justification (code requirement, manufacturer spec, or scope reality).
- Where the contractor gave a reason, use it; where they didn't, state the most
  common legitimate justification for that item (e.g. drip edge required by IRC
  R905.2.8.5, starter strip per manufacturer wind warranty) — phrased as the
  contractor's position, never as a fabricated fact about this specific roof.
- Do not invent prices, measurements, or damage details that weren't provided.
- Close with a request for a revised estimate and contact details.
- Output ONLY the letter text, no preamble or commentary.`;

  const details = [
    `Contractor: ${business.name}${business.license ? ` (License ${business.license})` : ''}`,
    business.phone ? `Phone: ${business.phone}` : '',
    business.email ? `Email: ${business.email}` : '',
    insurer ? `Carrier: ${insurer}` : '',
    claimNumber ? `Claim #: ${claimNumber}` : '',
    propertyAddress ? `Property: ${propertyAddress}` : '',
    '',
    'Items to supplement (with any reasons the contractor gave):',
    items,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: details }],
    });
    const letter = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    if (!letter) throw new Error('empty completion');
    return NextResponse.json({ letter });
  } catch (err) {
    console.error('AI supplement failed:', err);
    return NextResponse.json(
      { error: 'Could not draft the letter — try again in a moment.' },
      { status: 500 },
    );
  }
}
