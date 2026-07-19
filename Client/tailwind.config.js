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
          500: '#4a5d4e',
          600: '#3a4b3e',
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
