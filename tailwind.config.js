/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        blush: '#CFA6A0',
        ivory: '#FDF8F6',
        charcoal: '#3A3A3A',
        taupe: '#d6bfb7',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
