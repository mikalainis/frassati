import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0B1420",
        slate2: "#101C2B",
        card: "#13202F",
        parchment: "#EDE7DB",
        bone: "#F5F1E8",
        ink: "#1C2530",
        gold: "#C99A3C",
        goldpale: "#E4C77E",
        mist: "#9FB0C1"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      letterSpacing: { eyebrow: "0.22em" }
    }
  },
  plugins: []
};
export default config;
