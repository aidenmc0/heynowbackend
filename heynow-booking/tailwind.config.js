/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#faf9f6', // Warm White
          100: '#f5f2eb', // Rice Paper
          200: '#e8e0d5', // Sand Beige
          300: '#d4c4b0', // Latte
          800: '#5c5042', // Soft Brown
          900: '#3e362e', // Dark Earth
        },
        forest: {
          500: '#4a5d4e', // Forest Green
          600: '#3a4b3e', // Deep Forest
        },
        mist: {
          100: '#f0f2f0', // Mist Gray
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
