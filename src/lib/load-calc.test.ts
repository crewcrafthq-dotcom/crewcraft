import { describe, expect, it } from 'vitest';

import { computeServiceLoad } from './load-calc';

describe('computeServiceLoad (NEC 220.82 optional method)', () => {
  it('computes the classic 2000 sqft example', () => {
    const r = computeServiceLoad({
      sqft: 2000,
      smallApplianceCircuits: 2,
      laundryCircuits: 1,
      appliances: [
        { name: 'Range', va: 12000 },
        { name: 'Dryer', va: 5000 },
        { name: 'Water heater', va: 4500 },
      ],
      heatingVa: 10000,
      coolingVa: 5000,
    });

    // general: 3*2000 + 1500*3 = 10500; appliances 21500; base 32000
    expect(r.generalVa).toBe(10500);
    expect(r.applianceVa).toBe(21500);
    expect(r.baseVa).toBe(32000);
    // demand: 10000 + 0.4 * 22000 = 18800; + heat 10000 = 28800 VA
    expect(r.demandVa).toBe(18800);
    expect(r.totalVa).toBe(28800);
    expect(r.amps).toBe(120);
    expect(r.recommendedService).toBe(125);
  });

  it('skips the demand factor at or under 10 kVA', () => {
    const r = computeServiceLoad({
      sqft: 800,
      smallApplianceCircuits: 2,
      laundryCircuits: 0,
      appliances: [],
      heatingVa: 0,
      coolingVa: 3000,
    });
    // general: 2400 + 3000 = 5400 → no reduction
    expect(r.demandVa).toBe(5400);
    expect(r.totalVa).toBe(8400);
    expect(r.recommendedService).toBe(100);
  });

  it('returns null service above 400 A and ignores negative inputs', () => {
    const big = computeServiceLoad({
      sqft: 20000,
      smallApplianceCircuits: 4,
      laundryCircuits: 2,
      appliances: [{ name: 'Everything', va: 90000 }],
      heatingVa: 30000,
      coolingVa: -5,
    });
    expect(big.recommendedService).toBeNull();
    expect(big.hvacVa).toBe(30000);
  });
});
