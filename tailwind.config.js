/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // BSAid palette: primary green (actions, progress, CTAs), navy (titles, navigation), white and light gray
        // surfaces, gold (stars, rewards, achievements) and orange (helper icons, minor accents).
        navy: {
          50: '#EEF3FB',
          100: '#DCE5F5',
          200: '#B5C6E6',
          400: '#4A6BB0',
          600: '#1E4389',
          DEFAULT: '#0F2D63',
          800: '#0C2551',
          900: '#0A1F44',
          950: '#071530',
        },
        forest: {
          50: '#E8F6EB',
          100: '#CDEBD3',
          300: '#7CCB8B',
          500: '#2E9E44',
          DEFAULT: '#2E9E44',
          700: '#23803A',
          900: '#14532A',
        },
        // Correct-answer greens follow the primary green too.
        emerald: {
          50: '#E8F6EB',
          100: '#CDEBD3',
          400: '#45B35A',
          500: '#2E9E44',
          600: '#23803A',
          700: '#1D6E31',
        },
        gold: {
          50: '#FFF8E1',
          100: '#FFECB3',
          300: '#FFD54F',
          DEFAULT: '#FFC107',
          600: '#E0A800',
          700: '#A67C00',
        },
        // Orange: helper icons and minor accents.
        wood: {
          100: '#FEF1DC',
          200: '#FCE0B3',
          300: '#F9C46B',
          DEFAULT: '#F5A623',
          600: '#C77F0A',
          800: '#7A4D05',
        },
        cream: '#F5F7FA', // light gray for secondary cards
        paper: '#FFFFFF',
      },
      fontFamily: {
        pixel: ['"Helvetica Now Display"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['"Helvetica Now Display"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(14px)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.6)', opacity: '0.5' },
        },
        nudge: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
        },
        grid: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '0 64px' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rise: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        floatup: {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '20%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-22px)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        bob: 'bob 3s steps(6) infinite',
        drift: 'drift 6s steps(8) infinite',
        blink: 'blink 1s step-end infinite',
        twinkle: 'twinkle 1.6s steps(4) infinite',
        nudge: 'nudge 0.8s steps(2) infinite',
        grid: 'grid 2s linear infinite',
        pop: 'pop 0.18s steps(3) both',
        rise: 'rise 0.35s ease-out both',
        fade: 'fade 0.25s ease-out both',
        shake: 'shake 0.4s ease-in-out',
        float: 'float 3.5s ease-in-out infinite',
        floatup: 'floatup 1.1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
