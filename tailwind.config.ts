import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens:{
        "emini": "300",
        "mini": "420px",
        "esm": "480px",
        "slg":"900px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bp_primary: "#0a66c2",
      },
      animation: {
        "spin-slow": "spin-slow 1s infinite steps(12)",
      },
      keyframes: {
        "spin-slow": {
          "100%": { transform: "rotate(1turn)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
