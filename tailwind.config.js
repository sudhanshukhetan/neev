/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8FAFC',
        card: '#FFFFFF',
        line: '#E2E8F0',
        ink: '#0F172A',
        muted: '#64748B',
        terracotta: {
          DEFAULT: '#EA580C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          600: '#EA580C',
          700: '#C2410C',
        },
        emerald: {
          DEFAULT: '#059669',
          50: '#ECFDF5',
          600: '#059669',
          700: '#047857',
        },
        crimson: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          600: '#DC2626',
          700: '#B91C1C',
        },
        amber: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          600: '#D97706',
          700: '#B45309',
        },
        slate: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.015em',
        'widest': '0.15em',
        'sheet': '0.08em',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(15,23,42,0.04)',
        'panel': 'inset 0 0 0 1px #E2E8F0',
        'none': 'none',
      },
      borderRadius: {
        DEFAULT: '2px',
        'sm': '1px',
        'md': '2px',
        'lg': '2px',
        'xl': '2px',
        '2xl': '2px',
      },
    },
  },
  plugins: [],
};
