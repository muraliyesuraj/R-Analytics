/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: "#121824",
          panel: "#1e293b",
        },
        accent: "#10b981",
        roulette: {
          red: "#ef4444",
          black: "#1e293b",
        },
        text: {
          main: "#f8fafc",
          muted: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};
