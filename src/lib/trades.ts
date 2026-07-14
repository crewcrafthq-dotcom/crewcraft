import type { Trade } from './types';

/**
 * Per-trade accent tokens (§8). Each trade carries hex values (used by the PDF
 * via @react-pdf) and "R G B" channel strings (fed into CSS variables so
 * Tailwind's `accent` colors resolve to the trade color across the whole app).
 *
 * Electrical is the careful one: navy text on amber fills (never white), and a
 * deeper amber for amber-colored text on the beige background.
 */
export interface TradeTheme {
  trade: Trade;
  label: string;
  blurb: string;
  accent: string; // fill / primary accent (hex — used by the PDF)
  accentFg: string; // text that sits on an accent fill (PDF)
  accentDeep: string; // accent-colored text on a light background (PDF / legacy)
  // Light-theme (Paper & Blueprint) channel strings:
  accentRgb: string; // web fill — same hex as the PDF accent, as R G B channels
  accentFgRgb: string; // ink on an accent fill (white; navy for electrical amber)
  accentDeepRgb: string;
  accentSoftRgb: string; // faint tint background
  accentBrightRgb: string; // accent-colored TEXT on the paper canvas (AA on beige)
  // Dark-theme (Jobsite Dark) channel strings — brightened to glow on night:
  darkAccentRgb: string;
  darkAccentFgRgb: string; // near-black ink on the bright fill
  darkAccentBrightRgb: string; // accent-colored TEXT on night
}

const THEMES: Record<Trade, TradeTheme> = {
  hvac: {
    trade: 'hvac',
    label: 'HVAC',
    blurb: 'Heating, cooling, ductwork.',
    accent: '#E8722A',
    accentFg: '#FFFFFF',
    accentDeep: '#C2571A',
    accentRgb: '232 114 42',
    accentFgRgb: '255 255 255',
    accentDeepRgb: '194 87 26',
    accentSoftRgb: '247 226 210',
    accentBrightRgb: '179 80 18',
    darkAccentRgb: '255 122 47',
    darkAccentFgRgb: '10 14 26',
    darkAccentBrightRgb: '255 160 105',
  },
  plumbing: {
    trade: 'plumbing',
    label: 'Plumbing',
    blurb: 'Pipes, fixtures, water heaters.',
    accent: '#0F8A8A',
    accentFg: '#FFFFFF',
    accentDeep: '#0B6E6E',
    accentRgb: '15 138 138',
    accentFgRgb: '255 255 255',
    accentDeepRgb: '11 110 110',
    accentSoftRgb: '214 236 236',
    accentBrightRgb: '10 105 105',
    darkAccentRgb: '34 211 197',
    darkAccentFgRgb: '10 14 26',
    darkAccentBrightRgb: '94 234 212',
  },
  electrical: {
    trade: 'electrical',
    label: 'Electrical',
    blurb: 'Panels, wiring, fixtures.',
    accent: '#FFB400',
    accentFg: '#16263A', // navy on amber — never white
    accentDeep: '#D29100', // deeper amber for text on beige
    accentRgb: '255 180 0',
    accentFgRgb: '22 38 58',
    accentDeepRgb: '210 145 0',
    accentSoftRgb: '252 239 201',
    accentBrightRgb: '148 100 0',
    darkAccentRgb: '255 194 75',
    darkAccentFgRgb: '10 14 26',
    darkAccentBrightRgb: '255 209 130',
  },
  roofing: {
    trade: 'roofing',
    label: 'Roofing',
    blurb: 'Shingles, flashing, repairs.',
    accent: '#C0362C',
    accentFg: '#FFFFFF',
    accentDeep: '#9B2A22',
    accentRgb: '192 54 44',
    accentFgRgb: '255 255 255',
    accentDeepRgb: '155 42 34',
    accentSoftRgb: '242 216 213',
    accentBrightRgb: '158 43 34',
    darkAccentRgb: '255 92 114',
    darkAccentFgRgb: '10 14 26',
    darkAccentBrightRgb: '255 138 152',
  },
};

export function getTheme(trade: Trade): TradeTheme {
  return THEMES[trade] ?? THEMES.hvac;
}

/**
 * Inline style for a [data-trade] wrapper: writes the light (--al…) and dark
 * (--ad…) accent sets; the indirection rules in globals.css resolve --accent
 * etc. from whichever set matches the active [data-theme].
 */
export function themeVars(trade: Trade): React.CSSProperties {
  const t = getTheme(trade);
  return {
    '--al': t.accentRgb,
    '--afl': t.accentFgRgb,
    '--abl': t.accentBrightRgb,
    '--adl': t.accentDeepRgb,
    '--asl': t.accentSoftRgb,
    '--ad': t.darkAccentRgb,
    '--afd': t.darkAccentFgRgb,
    '--abd': t.darkAccentBrightRgb,
    '--add': t.accentDeepRgb,
    '--asd': t.accentSoftRgb,
  } as React.CSSProperties;
}
