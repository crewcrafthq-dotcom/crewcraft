import type { LineItemCategory, Trade } from './types';

/**
 * One-tap quote presets used by the Water Heater Quote Pack (plumbing) and the
 * Maintenance Plan Builder (HVAC). Each preset becomes a draft estimate the
 * contractor lands in immediately — every price is a starting suggestion they
 * edit in the editor, exactly like AI-generated lines.
 */

export interface PresetLine {
  category: LineItemCategory;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

export interface QuotePreset {
  id: string;
  app: 'water-heater' | 'maintenance-plan';
  trade: Trade;
  tier: string;
  name: string;
  blurb: string;
  scope: string;
  lines: PresetLine[];
}

export const QUOTE_PRESETS: QuotePreset[] = [
  // ── Water Heater Quote Pack (plumbing) ─────────────────────────────────
  {
    id: 'wh-good',
    app: 'water-heater',
    trade: 'plumbing',
    tier: 'Good',
    name: '40-gal gas tank swap',
    blurb: 'Like-for-like replacement. The workhorse quote.',
    scope:
      'Replace existing 40-gallon gas water heater in current location. Includes new water flex connectors, gas sediment trap, safety test, and haul-off of the old unit.',
    lines: [
      { category: 'labor', description: 'Remove old unit, set & connect new 40-gal gas water heater, leak/safety test', quantity: 1, unit: 'job', unit_price: 320 },
      { category: 'labor', description: 'Haul off & dispose of old water heater', quantity: 1, unit: 'job', unit_price: 45 },
      { category: 'materials', description: '40-gal gas water heater (6-yr tank warranty)', quantity: 1, unit: 'ea', unit_price: 620 },
      { category: 'materials', description: 'Water flex connectors, gas connector & sediment trap', quantity: 1, unit: 'kit', unit_price: 85 },
      { category: 'other', description: 'Plumbing permit (where required)', quantity: 1, unit: 'ea', unit_price: 75 },
    ],
  },
  {
    id: 'wh-better',
    app: 'water-heater',
    trade: 'plumbing',
    tier: 'Better',
    name: '50-gal high-recovery + expansion tank',
    blurb: 'More hot water, code-current install.',
    scope:
      'Upgrade to a 50-gallon high-recovery gas water heater with new thermal expansion tank. Includes connectors, sediment trap, safety test, and haul-off.',
    lines: [
      { category: 'labor', description: 'Remove old unit, set & connect 50-gal high-recovery heater, install expansion tank', quantity: 1, unit: 'job', unit_price: 390 },
      { category: 'labor', description: 'Haul off & dispose of old water heater', quantity: 1, unit: 'job', unit_price: 45 },
      { category: 'materials', description: '50-gal high-recovery gas water heater (8-yr tank warranty)', quantity: 1, unit: 'ea', unit_price: 890 },
      { category: 'materials', description: 'Thermal expansion tank', quantity: 1, unit: 'ea', unit_price: 65 },
      { category: 'materials', description: 'Connectors, valves & sediment trap', quantity: 1, unit: 'kit', unit_price: 95 },
      { category: 'other', description: 'Plumbing permit (where required)', quantity: 1, unit: 'ea', unit_price: 75 },
    ],
  },
  {
    id: 'wh-best',
    app: 'water-heater',
    trade: 'plumbing',
    tier: 'Best',
    name: 'Tankless conversion',
    blurb: 'Endless hot water, the premium option on the page.',
    scope:
      'Convert from tank to a condensing tankless water heater: mount and vent unit, re-pipe water and gas connections, install isolation valve kit and condensate neutralizer, commission and test. Gas line upsizing allowance included; final routing confirmed on site.',
    lines: [
      { category: 'labor', description: 'Remove tank, mount & vent tankless unit, re-pipe water/gas, commission', quantity: 1, unit: 'job', unit_price: 950 },
      { category: 'materials', description: 'Condensing tankless water heater (0.93 UEF)', quantity: 1, unit: 'ea', unit_price: 1650 },
      { category: 'materials', description: 'Stainless venting kit', quantity: 1, unit: 'kit', unit_price: 210 },
      { category: 'materials', description: 'Isolation valve kit & condensate neutralizer', quantity: 1, unit: 'kit', unit_price: 140 },
      { category: 'materials', description: 'Gas line upsizing allowance', quantity: 1, unit: 'ea', unit_price: 180 },
      { category: 'other', description: 'Plumbing/mechanical permit (where required)', quantity: 1, unit: 'ea', unit_price: 95 },
    ],
  },

  // ── Maintenance Plan Builder (HVAC) ────────────────────────────────────
  {
    id: 'mp-basic',
    app: 'maintenance-plan',
    trade: 'hvac',
    tier: 'Basic',
    name: '1 visit / year',
    blurb: 'The foot-in-the-door plan for one-system homes.',
    scope:
      'Annual precision tune-up and safety inspection for one system: check refrigerant charge, test capacitors and electrical connections, clean condensate drain, replace standard filter, and report findings with photos.',
    lines: [
      { category: 'labor', description: 'Annual precision tune-up & safety inspection (1 system)', quantity: 1, unit: 'visit', unit_price: 129 },
      { category: 'materials', description: 'Standard 1" pleated filter', quantity: 1, unit: 'ea', unit_price: 14 },
    ],
  },
  {
    id: 'mp-standard',
    app: 'maintenance-plan',
    trade: 'hvac',
    tier: 'Standard',
    name: '2 visits / year',
    blurb: 'Spring cooling + fall heating. The plan most homeowners pick.',
    scope:
      'Two-visit annual maintenance agreement for one system: spring cooling tune-up and fall heating tune-up, filters included each visit, with priority scheduling and a 10% discount on repairs during the agreement.',
    lines: [
      { category: 'labor', description: 'Spring cooling tune-up (1 system)', quantity: 1, unit: 'visit', unit_price: 119 },
      { category: 'labor', description: 'Fall heating tune-up (1 system)', quantity: 1, unit: 'visit', unit_price: 119 },
      { category: 'materials', description: 'Standard 1" pleated filters (one per visit)', quantity: 2, unit: 'ea', unit_price: 14 },
      { category: 'other', description: 'Priority scheduling + 10% repair discount (12 months)', quantity: 1, unit: 'yr', unit_price: 0 },
    ],
  },
  {
    id: 'mp-premium',
    app: 'maintenance-plan',
    trade: 'hvac',
    tier: 'Premium',
    name: '2 visits + priority perks',
    blurb: 'The plan that pays for the truck: perks worth saying yes to.',
    scope:
      'Premium two-visit maintenance agreement for one system: spring and fall precision tune-ups, filters included, condensate treatment and coil rinse, priority same-week scheduling, no overtime rates, and 15% off repairs during the agreement.',
    lines: [
      { category: 'labor', description: 'Spring cooling tune-up (1 system)', quantity: 1, unit: 'visit', unit_price: 119 },
      { category: 'labor', description: 'Fall heating tune-up (1 system)', quantity: 1, unit: 'visit', unit_price: 119 },
      { category: 'labor', description: 'Condensate treatment & outdoor coil rinse', quantity: 1, unit: 'visit', unit_price: 45 },
      { category: 'materials', description: 'Standard 1" pleated filters (one per visit)', quantity: 2, unit: 'ea', unit_price: 14 },
      { category: 'other', description: 'Priority scheduling, no overtime rates, 15% repair discount (12 months)', quantity: 1, unit: 'yr', unit_price: 89 },
    ],
  },
];

export function getPreset(id: string): QuotePreset | undefined {
  return QUOTE_PRESETS.find((p) => p.id === id);
}

export function presetsForApp(app: QuotePreset['app']): QuotePreset[] {
  return QUOTE_PRESETS.filter((p) => p.app === app);
}

/** Suggested total of a preset (pre-tax) — shown on the preset card. */
export function presetSubtotal(p: QuotePreset): number {
  return p.lines.reduce((sum, l) => sum + l.quantity * l.unit_price, 0);
}
