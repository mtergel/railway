const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "primary-50": colors.indigo[50],
        "primary-100": colors.indigo[100],
        "primary-200": colors.indigo[200],
        "primary-300": colors.indigo[300],
        "primary-400": colors.indigo[400],
        "primary-500": colors.indigo[500],
        "primary-600": colors.indigo[600],
        "primary-700": colors.indigo[700],

        default: "var(--color-bg)",
        editor: "var(--color-bg-editor)",
        paper: "var(--color-bg-paper)",
        menu: "var(--color-bg-menu)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
      },
      spacing: {
        400: "400px",
      },
      fontFamily: {
        serif: ["Poppins", "serif"],
      },
      outline: {
        none: ["none"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
