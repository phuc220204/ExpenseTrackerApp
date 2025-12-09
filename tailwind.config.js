import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        sans: ["Open Sans", "sans-serif"],
      },
      colors: {
        primary: {
          500: "#2563EB",
          600: "#1D4ED8",
        },
        accent: {
          500: "#F59E0B",
          600: "#D97706",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
