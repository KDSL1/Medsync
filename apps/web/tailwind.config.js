/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
        },
        healthcare: {
          emerald: '#10b981',
          teal: '#0d9488',
          sky: '#0284c7',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      }
    },
  },
  plugins: [],
}
