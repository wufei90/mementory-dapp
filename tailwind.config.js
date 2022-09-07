/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{html,js,ts,jsx,tsx}",
    "./src/components/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "575px",
      md: "768px",
      lg: "1025px",
      xl: "1202px",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        "bg-1": "#f7fafe",
        primary: "#9f93d9",
        accent: "#4177d5",
        "txt-color": "#4d5b75",
        "title-color": "#444444",
        "subtitle-color": "#8e92a5",
        "border-color": "#e7e9ec",
      },
      width: {
        main: "1000px",
        feed: "470px",
        form: "320px",
      },
      maxWidth: {
        main: "1000px",
        feed: "470px",
        form: "320px",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
