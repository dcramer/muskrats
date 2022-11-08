/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      poppins: "'Poppins', sans-serif;",
    },
    extend: {
      colors: {
        gray: "#8b98a5",
      },
    },
  },
  plugins: [],
};
