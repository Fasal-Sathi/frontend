/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        govGreen: "#138808",
        govSaffron: "#FF9933",
        govBlue: "#000080",
        ink: "#333333"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "Inter", "sans-serif"]
      },
      boxShadow: {
        gov: "0 10px 30px rgba(0,0,0,.08)"
      }
    }
  },
  plugins: []
};
