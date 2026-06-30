import type { Config } from 'tailwindcss';

/**
 * Crewcraft design tokens. Warm brand identity (beige canvas, navy ink) lifted
 * with crisp white surfaces, layered shadows (Z-depth), and the per-trade accent
 * injected as CSS variables (R G B channels) on a [data-trade] wrapper — see
 * globals.css and lib/trades.ts.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F1EADF', // page canvas
          sunken: '#F6F1E8', // inset wells
          card: '#FFFFFF', // elevated surface
          deep: '#ECE3D5', // hover / pressed
        },
        navy: {
          DEFAULT: '#16263A', // primary ink
          soft: '#48586B', // secondary text
          muted: '#6B7482', // tertiary / meta (4.5:1 on white)
          deep: '#0E1A2B', // the single dark spotlight band
        },
        line: '#E8DFD1', // hairline divider
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)', // text on an accent fill
          deep: 'rgb(var(--accent-deep) / <alpha-value>)', // accent text on light bg
          soft: 'rgb(var(--accent-soft) / <alpha-value>)', // faint accent tint
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // tightened display sizes for stronger hierarchy
        'display-sm': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        display: ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.025em' }],
        'display-lg': ['3.25rem', { lineHeight: '3.4rem', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(16, 32, 52, 0.05)',
        card: '0 1px 2px rgba(16, 32, 52, 0.04), 0 8px 20px -6px rgba(16, 32, 52, 0.10)',
        lift: '0 2px 6px rgba(16, 32, 52, 0.06), 0 18px 36px -12px rgba(16, 32, 52, 0.18)',
        accent: '0 8px 24px -8px rgb(var(--accent) / 0.45)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
