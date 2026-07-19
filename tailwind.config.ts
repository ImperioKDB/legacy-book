import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FBF6EE",
        surface: "#FFFFFF",
        ink: "#2B2420",
        accent: "#6B2737",
        "accent-soft": "#EFE0DD",
        muted: "#8A7E70",
      },
      fontFamily: {
        heading: ["var(--font-spectral)", "serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      borderRadius: {
        card: "12px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-20px, 30px) scale(1.08)" },
        },
        "drift-slow-reverse": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(25px, -20px) scale(1.05)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
        "drift-slow": "drift-slow 14s ease-in-out infinite",
        "drift-slow-reverse": "drift-slow-reverse 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
