import { describe, expect, it } from 'vitest';

import { AiParseError, parseGenerated } from './generate';

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
