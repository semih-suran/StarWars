/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "sw-yellow": "#FFE81F",
        "sw-black": "#1c1c1c",
      },
    },
  },
  plugins: [],
};
