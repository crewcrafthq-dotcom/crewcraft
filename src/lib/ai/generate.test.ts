import { describe, expect, it } from 'vitest';

import { AiParseError, parseGenerated, parseGeneratedTiers } from './generate';

const valid = JSON.stringify({
  scopeOfWork: '  Replace the water heater.  ',
  lineItems: [
    { category: 'labor', description: '  Install  ', quantity: 2, unit: 'hr', unitPrice: 95 },
    { category: 'materials', description: 'Water heater', quantity: '1', unit: 'ea', unitPrice: '650.005' },
  ],
  assumptions: ['  Gas line is in place  ', '   '],
});

describe('parseGenerated', () => {
  it('parses clean JSON and trims/sanitizes', () => {
    const out = parseGenerated(valid);
    expect(out.scopeOfWork).toBe('Replace the water heater.');
    expect(out.lineItems).toHaveLength(2);
    expect(out.lineItems[0].description).toBe('Install');
    expect(out.lineItems[1].quantity).toBe(1); // coerced from string
    expect(out.lineItems[1].unitPrice).toBe(650.01); // rounded to cents
    expect(out.assumptions).toEqual(['Gas line is in place']); // blank dropped
  });

  it('strips a ```json code fence', () => {
    const fenced = '```json\n' + valid + '\n```';
    expect(parseGenerated(fenced).lineItems).toHaveLength(2);
  });

  it('tolerates text around the JSON', () => {
    const noisy = `Sure! Here you go:\n${valid}\nLet me know if you need changes.`;
    expect(parseGenerated(noisy).scopeOfWork).toBe('Replace the water heater.');
  });

  it('clamps negative prices and quantities to zero', () => {
    const neg = JSON.stringify({
      scopeOfWork: 'x',
      lineItems: [{ category: 'labor', description: 'a', quantity: -5, unit: 'hr', unitPrice: -10 }],
      assumptions: [],
    });
    const out = parseGenerated(neg);
    expect(out.lineItems[0].quantity).toBe(0);
    expect(out.lineItems[0].unitPrice).toBe(0);
  });

  it('throws AiParseError on non-JSON', () => {
    expect(() => parseGenerated('totally not json')).toThrow(AiParseError);
  });

  it('throws AiParseError when the shape is wrong', () => {
    const wrong = JSON.stringify({ scopeOfWork: 'x', items: [] }); // missing lineItems/assumptions
    expect(() => parseGenerated(wrong)).toThrow(AiParseError);
  });

  it('throws AiParseError on a bad category', () => {
    const badCat = JSON.stringify({
      scopeOfWork: 'x',
      lineItems: [{ category: 'plumbing', description: 'a', quantity: 1, unit: 'hr', unitPrice: 1 }],
      assumptions: [],
    });
    expect(() => parseGenerated(badCat)).toThrow(AiParseError);
  });
});

const tierBody = (name: string) => ({
  name,
  scopeOfWork: `${name} option scope.`,
  lineItems: [
    { category: 'labor', description: 'Install', quantity: 2, unit: 'hr', unitPrice: 95 },
  ],
  assumptions: [],
});

describe('parseGeneratedTiers', () => {
  it('parses three named options', () => {
    const raw = JSON.stringify({ tiers: [tierBody('Good'), tierBody('Better'), tierBody('Best')] });
    const out = parseGeneratedTiers(raw);
    expect(out.tiers.map((t) => t.name)).toEqual(['Good', 'Better', 'Best']);
    expect(out.tiers[0].lineItems[0].unitPrice).toBe(95);
  });

  it('sanitizes each tier like a single estimate', () => {
    const dirty = tierBody('Good');
    dirty.lineItems[0].unitPrice = -5 as never;
    const raw = JSON.stringify({ tiers: [dirty, tierBody('Better')] });
    expect(parseGeneratedTiers(raw).tiers[0].lineItems[0].unitPrice).toBe(0);
  });

  it('strips code fences around the tiers JSON', () => {
    const raw =
      '```json\n' + JSON.stringify({ tiers: [tierBody('Good'), tierBody('Better')] }) + '\n```';
    expect(parseGeneratedTiers(raw).tiers).toHaveLength(2);
  });

  it('throws AiParseError when tiers are missing or too few', () => {
    expect(() => parseGeneratedTiers(JSON.stringify({ tiers: [tierBody('Good')] }))).toThrow(
      AiParseError,
    );
    expect(() => parseGeneratedTiers(JSON.stringify({ options: [] }))).toThrow(AiParseError);
  });
});
