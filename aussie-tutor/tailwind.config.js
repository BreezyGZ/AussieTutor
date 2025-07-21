/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'landing': "url('/assets/landing_background.jpg')"
      },
      colors: {
        'at-black': '#020202',
        'at-red': "#BD5D34", // '#C97D60',
        'at-green': '#E4ECCA',
        'at-white': '#F0E7DA',
        'at-yellow': '#FEFEE3'
      },
      fontFamily: {
        workSans: ['Work-Sans', 'sans-serif'],
        beleren: ['Beleren-Bold', 'Arial', 'sans-serif'],
        belerenSmallCaps: ['Beleren-SmallCaps-Bold', 'Arial', 'sans-serif'],
        belerenItalic: ['Beleren-SmallCaps-BoldItalic', 'Arial', 'sans-serif'],
        mplantin: ['MPlantin', 'Arial', 'sans-serif'],
        magic: ['magic-font', 'sans-serif'],
        matrix: ['Matrix-Bold', 'sans-serif'],
        inlander: ['Inlander-Smooth', 'sans-serif'],
       
      },
    },
  },
  plugins: [],
}

