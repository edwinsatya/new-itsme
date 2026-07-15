import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--bg)",
        ink: "var(--ink)",
        cyan: "var(--cyan)",
        magenta: "var(--magenta)",
        line: "var(--line)",
      },
      fontFamily: {
        // `.font-display` is a custom class in globals.css (adds uppercase + leading)
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        jp: ["var(--font-jp)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
