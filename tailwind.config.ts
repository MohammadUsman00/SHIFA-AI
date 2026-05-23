import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        urdu: ["var(--font-urdu)", "serif"],
        "urdu-nastaliq": ["var(--font-urdu-nastaliq)", "var(--font-urdu)", "serif"],
        hindi: ["var(--font-hindi)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
