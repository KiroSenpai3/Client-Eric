/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EPIC BR Brand Colors
        navy: {
          DEFAULT: "#0B1F3A",
          mid: "#112847",
          light: "#1A3A5C",
          faint: "#EEF3F8",
        },
        amber: {
          DEFAULT: "#E8821A",
          light: "#F5A441",
          faint: "#FEF3E8",
        },
        gray: {
          50: "#F7F8FA",
          100: "#EEF0F4",
          200: "#DDE1EA",
          300: "#C8CDD8",
          400: "#A3ABBE",
          500: "#7A8494",
          600: "#5A6375",
          700: "#3D4555",
          800: "#252D3D",
          900: "#141B29",
        },
      },
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 3px rgba(11,31,58,.08)",
        md: "0 4px 16px rgba(11,31,58,.12)",
        lg: "0 8px 32px rgba(11,31,58,.16)",
        xl: "0 16px 48px rgba(11,31,58,.2)",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
