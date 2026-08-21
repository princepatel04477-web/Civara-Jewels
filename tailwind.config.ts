import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF7F0",
        porcelain: "#FFFFFF",
        alabaster: "#F4EDE2",
        pearl: "#E6DFD3",
        gold: "#C9A961",
        brass: "#9E7F3C",
        ink: "#241F1B",
        taupe: "#6E6459",
        civara: {
          ivory: "#FBF7F0",
          cream: "#F4EDE2",
          card: "#FBF7F0",
          dark: "#241F1B",
          darkHover: "#181412",
          text: "#241F1B",
          secondary: "#6E6459",
          muted: "#9E7F3C",
          fine: "#6E6459",
          darkText: "#E6DFD3",
          darkHeading: "#FBF7F0",
          gold: "#C9A961",
          goldDarkBg: "#C9A961",
          goldHover: "#9E7F3C",
          borderLight: "#E6DFD3",
          borderMuted: "#E6DFD3",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-jost)", "Jost", "sans-serif"],
      },
      transitionTimingFunction: {
        quiet: "cubic-bezier(0.22, 1, 0.36, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
