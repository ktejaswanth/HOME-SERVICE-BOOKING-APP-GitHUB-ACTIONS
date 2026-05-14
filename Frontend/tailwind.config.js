/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1b6fb',
          400: '#6d8bf7',
          500: '#435ef1',
          600: '#2c3fe6',
          700: '#2330ca',
          800: '#2129a3',
          900: '#1f2782',
          950: '#12164d',
        },
      },
    },
  },
  plugins: [],
}
