/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        secondary: "#3b82f6",
        danger: "#ef4444",
        warning: "#f59e0b",
        dark: "#1f2937",
      },
    },
  },
  plugins: [],
};
