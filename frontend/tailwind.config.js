/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:   "#fdf6e8",
        parch:   "#f5e8c8",
        sand:    "#e8d5a0",
        earth: {
          50:  "#fdf3e0",
          100: "#f7dfa8",
          200: "#edca72",
          300: "#d4a855",
          400: "#b8872e",
          500: "#a0722a",
          600: "#855c1f",
          700: "#6b4a1a",
          800: "#4f3510",
          900: "#3d2a0a",
        },
        spice: {
          50:  "#fff3ee",
          100: "#ffe0d0",
          200: "#ffc0a0",
          300: "#ff9060",
          400: "#e8622a",
          500: "#d14e18",
          600: "#c4431a",
          700: "#a33514",
          800: "#85280f",
          900: "#6b1f0c",
        },
        turmeric: { 400: "#f0c030", 500: "#f0a500", 600: "#d08800" },
        forest:   { 500: "#2d7a4f", 600: "#246040", 700: "#1b4830" },
        saffron:  { 400: "#ff9933", 500: "#ff7f00" },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body:    ['"DM Sans"', "sans-serif"],
        hindi:   ['"Tiro Devanagari Hindi"', "serif"],
      },
      boxShadow: {
        warm:   "0 4px 24px rgba(100,60,10,.13)",
        "warm-lg": "0 8px 48px rgba(100,60,10,.18)",
        card:   "0 2px 12px rgba(0,0,0,.07)",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
      },
    },
  },
  plugins: [],
}