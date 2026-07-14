import type { Config } from 'tailwindcss';

/**
 * Toolbelt (by Crewcraft) design tokens — "Paper & Blueprint" light industrial.
 *
 * `paper.*`  = background layers, warm estimate-paper beige (page → card → chip).
 *              950 is the one dark well (modal scrims, rare ink blocks).
 * `ink.*`    = navy text (primary → soft → mute), all ≥4.5:1 on paper.
 * `hairline` = subtle 1px navy borders.
 * The per-trade accent arrives as CSS variables (R G B channels) on a
 * [data-trade] wrapper (see globals.css + lib/trades.ts), tuned for a light
 * canvas — same family as the estimate PDF, so ad → site → PDF feel like one
 * brand. Display headings are Barlow Condensed (industrial, DIN-like).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Themed surfaces — values live in globals.css (:root / [data-theme=dark]) ──
        paper: {
          950: 'rgb(var(--paper-950) / <alpha-value>)',
          900: 'rgb(var(--paper-900) / <alpha-value>)',
          850: 'rgb(var(--paper-850) / <alpha-value>)',
          800: 'rgb(var(--paper-800) / <alpha-value>)',
          750: 'rgb(var(--paper-750) / <alpha-value>)',
          700: 'rgb(var(--paper-700) / <alpha-value>)',
          600: 'rgb(var(--paper-600) / <alpha-value>)',
          DEFAULT: 'rgb(var(--paper-900) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          mute: 'rgb(var(--ink-mute) / <alpha-value>)',
        },
        hairline: {
          DEFAULT: 'var(--hairline)',
          strong: 'var(--hairline-strong)',
        },
        // status colors that flip shade with the theme (600s on paper, 400s on night)
        ok: 'rgb(var(--ok) / <alpha-value>)',
        bad: 'rgb(var(--bad) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)', // ink on an accent fill
          bright: 'rgb(var(--accent-bright) / <alpha-value>)', // accent-colored text on paper
          tint: 'rgb(var(--accent) / 0.12)', // faint accent fill
          deep: 'rgb(var(--accent-deep) / <alpha-value>)', // deeper accent text
          soft: 'rgb(var(--accent-soft) / <alpha-value>)', // light accent tint
        },

        // ── Legacy aliases (estimate preview + older app surfaces) ──────
        cream: { DEFAULT: '#F1EADF', sunken: '#F6F1E8', card: '#FFFFFF', deep: '#ECE3D5' },
        navy: { DEFAULT: '#16263A', soft: '#48586B', muted: '#6B7482', deep: '#0E1A2B' },
        line: '#E8DFD1',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Industrial condensed display face (Jobsite Dark v2) — headings only.
        display: ['var(--font-barlow)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['1.875rem', { lineHeight: '2.2rem', letterSpacing: '-0.02em' }],
        display: ['2.75rem', { lineHeight: '2.95rem', letterSpacing: '-0.03em' }],
        'display-lg': ['3.75rem', { lineHeight: '3.85rem', letterSpacing: '-0.035em' }],
        'display-xl': ['4.75rem', { lineHeight: '4.85rem', letterSpacing: '-0.04em' }],
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem', '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        // themed depth — values live in globals.css per theme
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        // accent shadow for primary CTAs and highlights (accent var is themed)
        accent: '0 8px 22px -10px rgb(var(--accent) / 0.45)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.25), 0 10px 30px -10px rgb(var(--accent) / 0.4)',
        'glow-sm': '0 0 18px -8px rgb(var(--accent) / 0.4)',
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
