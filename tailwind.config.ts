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
        // ── Paper system (light) ────────────────────────────────────────
        paper: {
          950: '#101B2C', // the one dark well: modal scrims, ink blocks
          900: '#F2EBE0', // page canvas — estimate-paper beige (matches the PDF)
          850: '#E9E0D0', // sunken sections
          800: '#FCFAF5', // card / surface (warm white)
          750: '#F5EFE4', // surface hover
          700: '#EAE1D1', // raised chips
          600: '#D8CBB5', // strong border / pressed
          DEFAULT: '#F2EBE0',
        },
        ink: {
          DEFAULT: '#16263A', // primary text — navy ink
          soft: '#41526B', // secondary text
          mute: '#5E6F89', // tertiary / meta (≥4.5:1 on paper-900)
        },
        hairline: {
          DEFAULT: 'rgba(22,38,58,0.12)',
          strong: 'rgba(22,38,58,0.22)',
        },
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
        // paper depth: soft navy shadows, like a sheet lifted off the desk
        card: '0 1px 2px rgba(22,38,58,0.05), 0 10px 28px -16px rgba(22,38,58,0.18)',
        lift: '0 2px 4px rgba(22,38,58,0.06), 0 26px 52px -22px rgba(22,38,58,0.28)',
        // accent shadow for primary CTAs and highlights
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
