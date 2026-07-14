/**
 * Residential service load calculation — NEC 220.82 "optional method" style.
 * A field aid for electricians sizing a service ahead of a panel-upgrade quote:
 * general lighting load by square footage, small-appliance/laundry circuits,
 * fixed appliances at nameplate, first 10 kVA at 100% + remainder at 40%,
 * then the larger of heating/cooling at 100%.
 *
 * NOT a permit document — the app says so on screen. Verify with the AHJ.
 */

export interface ApplianceEntry {
  name: string;
  va: number;
}

export interface LoadCalcInput {
  sqft: number;
  /** NEC minimum is 2 small-appliance circuits + 1 laundry circuit. */
  smallApplianceCircuits: number;
  laundryCircuits: number;
  appliances: ApplianceEntry[];
  /** Heating VA and cooling VA — the larger one counts at 100%. */
  heatingVa: number;
  coolingVa: number;
}

export interface LoadCalcResult {
  generalVa: number; // 3 VA/sqft + 1500 per SA/laundry circuit
  applianceVa: number; // fixed appliances at nameplate
  baseVa: number; // general + appliances (before demand factor)
  demandVa: number; // first 10 kVA @ 100%, remainder @ 40%
  hvacVa: number; // max(heating, cooling)
  totalVa: number;
  amps: number; // totalVa / 240
  recommendedService: number | null; // next standard size, null when > biggest
}

export const STANDARD_SERVICES = [100, 125, 150, 200, 225, 300, 400];

const n = (v: number) => (Number.isFinite(v) && v > 0 ? v : 0);

export function computeServiceLoad(input: LoadCalcInput): LoadCalcResult {
  const generalVa =
    Math.round(n(input.sqft) * 3) +
    1500 * (n(input.smallApplianceCircuits) + n(input.laundryCircuits));
  const applianceVa = input.appliances.reduce((sum, a) => sum + n(a.va), 0);
  const baseVa = generalVa + applianceVa;

  const demandVa = baseVa <= 10000 ? baseVa : 10000 + Math.round((baseVa - 10000) * 0.4);
  const hvacVa = Math.max(n(input.heatingVa), n(input.coolingVa));
  const totalVa = demandVa + hvacVa;
  const amps = Math.round((totalVa / 240) * 10) / 10;

  const recommendedService = STANDARD_SERVICES.find((s) => s >= amps) ?? null;

  return { generalVa, applianceVa, baseVa, demandVa, hvacVa, totalVa, amps, recommendedService };
}

/** Plain-text summary a contractor can paste into an estimate's notes. */
export function loadCalcSummary(input: LoadCalcInput, r: LoadCalcResult): string {
  const lines = [
    `Service load check (NEC 220.82 optional method)`,
    `Dwelling: ${n(input.sqft)} sq ft → general load ${r.generalVa.toLocaleString()} VA (incl. ${input.smallApplianceCircuits} small-appliance + ${input.laundryCircuits} laundry circuits)`,
    `Fixed appliances: ${r.applianceVa.toLocaleString()} VA`,
    `Demand after factor (first 10 kVA @100%, rest @40%): ${r.demandVa.toLocaleString()} VA`,
    `HVAC (larger of heat/cool): ${r.hvacVa.toLocaleString()} VA`,
    `Calculated load: ${r.totalVa.toLocaleString()} VA ≈ ${r.amps} A @ 240 V`,
    r.recommendedService
      ? `Suggested service size: ${r.recommendedService} A`
      : `Calculated load exceeds 400 A — engineered service required`,
    `Field estimate only — verify per local code/AHJ before permitting.`,
  ];
  return lines.join('\n');
}
