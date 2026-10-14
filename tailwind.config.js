/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF2FB',
          100: '#DCE4F7',
          200: '#B4C4EC',
          400: '#4B6BC4',
          600: '#2546A0',
          DEFAULT: '#1E3A8A',
          800: '#172E6E',
          900: '#0F1F4D',
          950: '#0A0F2C',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          300: '#FCD34D',
          DEFAULT: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Arcade accents taken from the warm sunset palette of the reference poster
        ember: {
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          DEFAULT: '#FB923C',
          600: '#EA580C',
          800: '#9A3412',
        },
        crimson: {
          DEFAULT: '#E11D48',
          700: '#B91C1C',
          900: '#7F1D1D',
        },
        cream: '#FFF4DE',
        paper: '#F9FAFB',
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
      },
    },
  },
  plugins: [],
};
