/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37',
          light: '#E6C65C',
          dark: '#B3901F',
        },
        secondary: {
          DEFAULT: '#121212',
          light: '#232323',
          dark: '#000000',
        },
        accent: {
          DEFAULT: '#F1C40F',
          dark: '#D4AC0D',
        },
        success: {
          DEFAULT: '#2ECC71',
          dark: '#27AE60',
        },
        warning: {
          DEFAULT: '#F39C12',
          dark: '#E67E22',
        },
        error: {
          DEFAULT: '#E74C3C',
          dark: '#C0392B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.7))',
      },
    },
  },
  plugins: [],
};