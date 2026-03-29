import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base:     "#0d1117",
        surface:  "#161b22",
        elevated: "#21262d",
        border:   "#30363d",
        primary:  "#e6edf3",
        muted:    "#8b949e",
        gold:     "#e6a817",
        teal:     "#2dd4bf",
        coral:    "#f87171",
        violet:   "#a78bfa",
      },
      fontFamily: {
        mono:  ["IBM Plex Mono", "monospace"],
        sans:  ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
