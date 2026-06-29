import type { Config } from 'tailwindcss';

/**
 * Crewcraft V3 Clean design tokens (§8).
 * Base palette is beige + navy. The trade accent is injected as CSS variables
 * (R G B channels) on a [data-trade] wrapper — see globals.css and lib/trades.ts —
 * so the same component renders in the contractor's trade color everywhere.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F2EBE0', // page background
          card: '#FBF8F2', // raised surface
          deep: '#E8DECE', // sunken / hover
        },
        navy: {
          DEFAULT: '#16263A', // primary text + dark surfaces
          soft: '#46566A', // secondary text
          muted: '#7C8794', // tertiary / placeholder
        },
        line: '#E2D8C9', // beige divider
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)', // text on an accent fill
          deep: 'rgb(var(--accent-deep) / <alpha-value>)', // accent text on beige
          soft: 'rgb(var(--accent-soft) / <alpha-value>)', // faint accent tint
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 38, 58, 0.04), 0 8px 24px rgba(22, 38, 58, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
