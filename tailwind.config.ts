import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Typography
      fontFamily: {
        // Inter for body
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Cal Sans for display (falls back to Inter if not self-hosting)
        display: ["var(--font-calsans)", "var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        // JetBrains Mono for codes/dates/technical
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Color palette
      colors: {
        primary: {
          DEFAULT: "#1e40af", // Deep Ocean Blue
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f59e0b", // Warm Amber
          foreground: "#0f172a",
        },
        success: {
          DEFAULT: "#059669", // Forest Green
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#ea580c", // Sunset Orange
          foreground: "#0f172a",
        },
        error: {
          DEFAULT: "#dc2626", // Crimson Red
          foreground: "#ffffff",
        },
        // Neutrals (Slate scale)
        slate: {
          25: "#f8fafc",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1f2937",
          900: "#0f172a",
        },
      },
      boxShadow: {
        card: "0 2px 10px rgba(2, 6, 23, 0.06)", // subtle card shadow
      },
      spacing: {
        // 8px grid helpers (optional)
        "1.5": "0.375rem",
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
}
export default config
