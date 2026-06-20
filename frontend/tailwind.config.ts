import type { Config } from 'tailwindcss';

// Brand palette anchored on Pantone 13-2016 TCX "Pink Cherub".
// `cherub` is the hero pink; `blush` and `petal` are softer/sharper variants
// used for sections and accents.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cherub: {
          DEFAULT: '#F8C8D2',
          50: '#FDF3F6',
          100: '#FBE5EB',
          200: '#F8C8D2',
          300: '#F4B6C2',
          400: '#EFA0B0',
          500: '#E78198',
          600: '#D45F7A',
          700: '#A8425E',
          800: '#7A2D44',
          900: '#4F1B2C',
        },
        ink: {
          DEFAULT: '#1F1014',
          soft: '#3A1C25',
          muted: '#7A6068',
        },
        cream: '#FFF9F8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -20px rgba(167, 60, 90, 0.35)',
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease forwards',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
