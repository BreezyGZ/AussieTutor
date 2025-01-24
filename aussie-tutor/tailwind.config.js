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
      },
      fontFamily: {
        beleren: ['Beleren-Bold', 'Arial', 'sans-serif'],
        belerenSmallCaps: ['Beleren-SmallCaps-Bold', 'Arial', 'sans-serif'],
        belerenItalic: ['Beleren-SmallCaps-BoldItalic', 'Arial', 'sans-serif'],
        mplantin: ['MPlantin', 'Arial', 'sans-serif'],
        magic: ['magic-font', 'sans-serif'],
        matrix: ['Matrix-Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

