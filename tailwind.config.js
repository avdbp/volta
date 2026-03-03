/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        espresso: '#1C0A00',
        cream: '#F5ECD7',
        gold: '#C9A84C',
        dark: '#0D0D0D',
        offwhite: '#FAFAF8',
      },
    },
  },
  plugins: [],
}
