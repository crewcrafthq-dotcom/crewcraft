import type { Config } from 'tailwindcss';

/**
 * Toolbelt (by Crewcraft) design tokens — DARK SaaS system.
 *
 * `night.*`  = background layers (page → surface → raised → hover).
 * `mist.*`   = text on dark (primary → soft → mute), all ≥4.5:1 on night.
 * `hairline` = subtle 1px borders.
 * The per-trade accent still arrives as CSS variables (R G B channels) on a
 * [data-trade] wrapper (see globals.css + lib/trades.ts) and is tuned to glow
 * on dark. Legacy `cream`/`navy`/`line` remain until every page is migrated.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Dark system ────────────────────────────────────────────────
        night: {
          950: '#06090F', // deepest wells / footer base
          900: '#0A0E1A', // page canvas
          850: '#0D1322', // sunken
          800: '#111A2E', // card / surface
          750: '#152139', // surface hover
          700: '#1A2740', // raised
          600: '#243350', // strong border / pressed
          DEFAULT: '#0A0E1A',
        },
        mist: {
          DEFAULT: '#F4F7FD', // primary text
          soft: '#AEBCD6', // secondary text (4.6:1 on night-800)
          mute: '#7C8AA6', // tertiary / meta (4.5:1 on night-900)
        },
        hairline: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.14)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)', // ink on an accent fill
          bright: 'rgb(var(--accent-bright) / <alpha-value>)', // accent text on dark
          tint: 'rgb(var(--accent) / 0.12)', // faint accent fill on dark
          deep: 'rgb(var(--accent-deep) / <alpha-value>)', // legacy: accent text on light
          soft: 'rgb(var(--accent-soft) / <alpha-value>)', // legacy: light tint
        },

        // ── Legacy (light) — kept until full migration ─────────────────
        cream: { DEFAULT: '#F1EADF', sunken: '#F6F1E8', card: '#FFFFFF', deep: '#ECE3D5' },
        navy: { DEFAULT: '#16263A', soft: '#48586B', muted: '#6B7482', deep: '#0E1A2B' },
        line: '#E8DFD1',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['1.875rem', { lineHeight: '2.2rem', letterSpacing: '-0.02em' }],
        display: ['2.75rem', { lineHeight: '2.95rem', letterSpacing: '-0.03em' }],
        'display-lg': ['3.75rem', { lineHeight: '3.85rem', letterSpacing: '-0.035em' }],
        'display-xl': ['4.75rem', { lineHeight: '4.85rem', letterSpacing: '-0.04em' }],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        // dark depth: crisp inner top-light + deep drop
        card: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 12px 34px -14px rgba(0,0,0,0.7)',
        lift: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 30px 60px -22px rgba(0,0,0,0.8)',
        // accent glow for primary CTAs and highlights
        accent: '0 10px 30px -8px rgb(var(--accent) / 0.5)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.30), 0 12px 40px -10px rgb(var(--accent) / 0.55)',
        'glow-sm': '0 0 24px -6px rgb(var(--accent) / 0.5)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'border-flow': { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        'pulse-slow': {
          '0%,100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.12)', opacity: '0.8' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-slow': 'pulse-slow 15s ease-in-out infinite',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
