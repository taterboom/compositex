/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-100": "#0c0c0c",
          "base-200": "#131313",
          "base-300": "#191919",
          "base-content": "#fff",
          "--btn-text-case": "captialize",
        },
      },
    ],
  },
}
