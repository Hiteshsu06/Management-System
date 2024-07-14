/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        BgColor : "var(--color-BgColor)",
        BgPrimaryColor : "var(--color-BgPrimaryColor)",
        BgSecondaryColor : "var(--color-BgSecondaryColor)",
        BgTertiaryColor : "var(--color-BgTertiaryColor)",
        BorderColor : "var(--color-BorderColor)",
        TextPrimaryColor : "var(--color-TextPrimaryColor)",
        TextSecondaryColor : "var(--color-TextSecondaryColor)",
      }
    }
  },
  plugins: [],
}