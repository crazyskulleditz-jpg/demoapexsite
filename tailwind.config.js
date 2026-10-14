/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#0284c7',
        'cyan-accent': '#06b6d4',
        'sunset-amber': '#f59e0b',
        'ceramic-white': '#f8fafc',
        'navy-slate': '#0f172a',
      },
      boxShadow: {
        'clean-sky': '0 10px 30px -5px rgba(2, 132, 199, 0.15)',
        'clean-card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'amber-highlight': '0 4px 20px -2px rgba(245, 158, 11, 0.25)',
      }
    },
  },
  plugins: [],
}
