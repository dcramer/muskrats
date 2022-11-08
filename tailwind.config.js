/** @type {import('tailwindcss').Config} */
const { colors: defaultColors } = require("tailwindcss/defaultTheme");

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
        ...defaultColors,

        black: "#15202B",
        gray: "#8b98a5",
      },
    },
  },
  plugins: [],
};
