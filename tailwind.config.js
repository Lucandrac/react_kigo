/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': 'rgba(24, 24, 1)',
        'white': 'rgba(245, 245, 245, 1)',
      }
    },
  },
  plugins: [],
}

