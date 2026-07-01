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
  accentRgb: string; // web fill — brightened to glow on dark
  accentFgRgb: string; // ink on an accent fill (dark: near-black for all trades)
  accentDeepRgb: string;
  accentSoftRgb: string; // faint tint background (legacy light)
  accentBrightRgb: string; // accent-colored TEXT on dark
}

const THEMES: Record<Trade, TradeTheme> = {
  hvac: {
    trade: 'hvac',
    label: 'HVAC',
    blurb: 'Heating, cooling, ductwork.',
    accent: '#E8722A',
    accentFg: '#FFFFFF',
    accentDeep: '#C2571A',
    accentRgb: '255 122 47',
    accentFgRgb: '10 14 26',
    accentDeepRgb: '194 87 26',
    accentSoftRgb: '247 226 210',
    accentBrightRgb: '255 160 105',
  },
  plumbing: {
    trade: 'plumbing',
    label: 'Plumbing',
    blurb: 'Pipes, fixtures, water heaters.',
    accent: '#0F8A8A',
    accentFg: '#FFFFFF',
    accentDeep: '#0B6E6E',
    accentRgb: '34 211 197',
    accentFgRgb: '10 14 26',
    accentDeepRgb: '11 110 110',
    accentSoftRgb: '214 236 236',
    accentBrightRgb: '94 234 212',
  },
  electrical: {
    trade: 'electrical',
    label: 'Electrical',
    blurb: 'Panels, wiring, fixtures.',
    accent: '#FFB400',
    accentFg: '#16263A', // navy on amber — never white
    accentDeep: '#D29100', // deeper amber for text on beige
    accentRgb: '255 194 75',
    accentFgRgb: '10 14 26',
    accentDeepRgb: '210 145 0',
    accentSoftRgb: '252 239 201',
    accentBrightRgb: '255 209 130',
  },
  roofing: {
    trade: 'roofing',
    label: 'Roofing',
    blurb: 'Shingles, flashing, repairs.',
    accent: '#C0362C',
    accentFg: '#FFFFFF',
    accentDeep: '#9B2A22',
    accentRgb: '255 92 114',
    accentFgRgb: '10 14 26',
    accentDeepRgb: '155 42 34',
    accentSoftRgb: '242 216 213',
    accentBrightRgb: '255 138 152',
  },
};

export function getTheme(trade: Trade): TradeTheme {
  return THEMES[trade] ?? THEMES.hvac;
}

/** Inline style that sets the accent CSS variables for a [data-trade] wrapper. */
export function themeVars(trade: Trade): React.CSSProperties {
  const t = getTheme(trade);
  return {
    '--accent': t.accentRgb,
    '--accent-fg': t.accentFgRgb,
    '--accent-bright': t.accentBrightRgb,
    '--accent-deep': t.accentDeepRgb,
    '--accent-soft': t.accentSoftRgb,
  } as React.CSSProperties;
}
