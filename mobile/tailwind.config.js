/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        secondary: {
          DEFAULT: '#D946EF',
          500: '#D946EF',
          600: '#C026D3',
        },
        background: {
          DEFAULT: '#0f0a1a',
          card: '#1a1a2e',
          elevated: '#242438',
        },
        // Group colors
        work: '#6366F1',
        family: '#EC4899',
        friends: '#10B981',
        acquaintances: '#F59E0B',
        // Mood colors
        calm: '#60A5FA',
        anxious: '#F472B6',
        frustrated: '#F87171',
        hopeful: '#34D399',
        tired: '#A78BFA',
        motivated: '#FBBF24',
        uncertain: '#94A3B8',
        confident: '#2DD4BF',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
