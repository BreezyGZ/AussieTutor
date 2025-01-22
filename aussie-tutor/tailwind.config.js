/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'at-black': '#020202',
        'at-red': '#DA443A',
        'at-green': '#E4ECCA',
        'at-white': '#F0E7DA',
        'at-yellow': '#FEFEE3'
      }
    },
  },
  plugins: [],
}

