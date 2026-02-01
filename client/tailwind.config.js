/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // ✅ THIS fixes your error
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
