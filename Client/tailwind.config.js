/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./src/booking/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#faf9f6',
          100: '#f5f2eb',
          200: '#e8e0d5',
          300: '#d4c4b0',
          800: '#5c5042',
          900: '#3e362e',
        },
        forest: {
          50: '#faf6f0',
          100: '#f0e8da',
          200: '#e0d0b8',
          300: '#c9ae87',
          400: '#b08f5e',
          500: '#8b6f47',
          600: '#6d5537',
          700: '#4f3e28',
          800: '#362a1b',
          900: '#1f1810',
        },
        mist: {
          100: '#f0f2f0',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
