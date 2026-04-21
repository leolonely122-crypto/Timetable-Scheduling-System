/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'soft': '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
        'soft-dark': '20px 20px 60px #1a2333, -20px -20px 60px #222f45',
      }
    },
  },
  plugins: [],
}
