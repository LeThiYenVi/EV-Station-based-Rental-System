/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
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
