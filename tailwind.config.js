/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette sampled from the Entry Point key art: deep navy, forest green, warm wood, gold and paper cream.
        navy: {
          50: '#EEF2F8',
          100: '#DDE5F0',
          200: '#B7C6DE',
          400: '#4A6FA8',
          600: '#1E4A8C',
          DEFAULT: '#163A72',
          800: '#102A55',
          900: '#0E2244',
          950: '#0A1630',
        },
        gold: {
          50: '#FFF8E6',
          100: '#FCEBC0',
          300: '#F7C95A',
          DEFAULT: '#EDA90D',
          600: '#C98A08',
          700: '#9C6A06',
        },
        forest: {
          50: '#EAF4EC',
          100: '#D2E8D7',
          300: '#7FB98E',
          500: '#2E8B4A',
          DEFAULT: '#21733F',
          700: '#1B5E35',
          900: '#0D3B22',
        },
        wood: {
          100: '#F6EAD6',
          200: '#EAD3AE',
          300: '#D8AE76',
          DEFAULT: '#B9803F',
          600: '#8A5528',
          800: '#4A2A14',
        },
        cream: '#F7EEDF',
        paper: '#FAF6EE',
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
