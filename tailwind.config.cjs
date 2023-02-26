/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-100": "#0c0c0c",
          "base-200": "#161616",
          "base-300": "#212121",
          "base-content": "#fff",
          "--btn-text-case": "captialize",
        },
      },
    ],
  },
}
