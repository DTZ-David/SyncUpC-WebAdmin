/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50:  '#C8FF70',
          100: '#DCFCE7',
          200: '#81C618',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#B9FF50', // verde principal
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        neutral: {
          50:  '#EEEEEE',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        semantic: {
          success: '#22C55E',
          warning: '#F59E0B',
          error:   '#EF4444',
          info:    '#3B82F6',
        },
        background: {
          primary: '#F5FFD9', // mezcla blanco + verde 10% ≈ (calculado de tu función)
          secondary: '#F8FCF9',
          accent: '#F0FDF4',
        },
        font: {
          nunitoBoldTime: '#61605F',
        },
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
