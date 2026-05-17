/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#C9A84C',
        'gold-light': '#DFBF66',
        'deep': '#1A0A00',
        'deep-accent': '#261200',
        'cream': '#F5F1E6',
        'wine': '#6B1F2A',
        'ivory': '#FAF6F0',
      },
      fontFamily: {
        serif: ["'Playfair Display'", 'serif'],
        sans: ["'Outfit'", 'sans-serif'],
      }
    },
  },
  plugins: [],
}
