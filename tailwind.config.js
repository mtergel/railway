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

      typography(theme) {
        return {
          DEFAULT: {
            css: {
              color: theme("colors.text-primary"),
              code: { color: theme("colors.text-secondary") },
              "ul > li::before": { backgroundColor: theme("colors.gray.700") },
              "a code": { color: theme("colors.text-secondary") },
              pre: {
                color: theme("colors.text-secondary"),
                backgroundColor: theme("colors.paper"),
              },
            },
          },
          dark: {
            css: {
              color: theme("colors.text-primary"),
              '[class~="lead"]': { color: theme("colors.gray.400") },
              a: { color: theme("colors.gray.100") },
              strong: { color: theme("colors.gray.100") },
              "ul > li::before": { backgroundColor: theme("colors.gray.200") },
              hr: { borderColor: theme("colors.gray.800") },
              blockquote: {
                color: theme("colors.gray.100"),
                borderLeftColor: theme("colors.primary.400"),
              },
              h1: { color: theme("colors.gray.100") },
              h2: { color: theme("colors.gray.100") },
              h3: { color: theme("colors.gray.100") },
              h4: { color: theme("colors.gray.100") },
              code: { color: theme("colors.gray.100") },
              "a code": { color: theme("colors.gray.100") },
              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.paper"),
              },
              thead: {
                color: theme("colors.gray.100"),
                borderBottomColor: theme("colors.gray.700"),
              },
              "tbody tr": { borderBottomColor: theme("colors.gray.800") },
            },
          },
        };
      },
    },
  },
  variants: {
    extend: {
      typography: ["dark"],
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
