import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        ink: "#0a0a0a",
        secondary: "#525252",
        tertiary: "#737373",
        rule: "#e5e5e5",
        accent: "#b8543a",
        codebg: "#fafafa",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        prose: "680px",
        page: "1100px",
      },
      fontSize: {
        meta: ["13px", { lineHeight: "1.4", letterSpacing: "0.04em" }],
      },
      letterSpacing: {
        tightish: "-0.01em",
      },
    },
  },
  plugins: [],
};

export default config;
