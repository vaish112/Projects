const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Oswald", "sans-serif"],
        body: ["Ubuntu", "sans-serif"]
      },
      colors: {
        primary: colors.sky["600"],
        secondary: colors.gray["600"],
        error: colors.red["600"]
      }
    }
  },
  plugins: []
};
