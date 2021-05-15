module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bg: {
          default: "var(--color-bg)",
          editor: "var(--color-bg-editor)",
        },
      },
      fontFamily: {
        serif: ["Poppins", "serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
