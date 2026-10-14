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
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          300: '#FCD34D',
          DEFAULT: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        paper: '#F9FAFB',
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,31,77,0.06), 0 8px 24px -12px rgba(15,31,77,0.18)',
        coin: '0 4px 0 #B45309',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        bob: 'bob 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
