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
        background: {
          DEFAULT: "var(--background)",
          surface: "var(--background-surface)",
          elevated: "var(--background-elevated)",
        },
        card: {
          DEFAULT: "var(--card)",
          hover: "var(--card-hover)",
          subtle: "var(--card-subtle)",
        },
        cyan: {
          DEFAULT: "#00f2fe",
          glow: "rgba(0, 242, 254, 0.25)",
          subtle: "var(--cyan-subtle)",
          400: "#00d2eb",
          500: "#00f2fe",
          600: "#00b4cc",
        },
        mint: {
          DEFAULT: "#00f5a0",
          glow: "rgba(0, 245, 160, 0.25)",
          subtle: "var(--mint-subtle)",
          400: "#34d399",
          500: "#00f5a0",
          600: "#10b981",
        },
        border: {
          subtle: "var(--border-subtle)",
          light: "var(--border-light)",
          accent: "var(--border-accent)",
          mint: "var(--border-mint)",
        },
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "-apple-system", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        xs: "6px",
        sm: "10px",
        md: "14px",
        lg: "18px",
        xl: "24px",
      },
      boxShadow: {
        "cyan-glow": "0 0 25px rgba(0, 242, 254, 0.2)",
        "mint-glow": "0 0 25px rgba(0, 245, 160, 0.2)",
        "card-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
