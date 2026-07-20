import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C47A5E",
        heading: "#513125",
        body: "#807673",
        cream: "#FEFAF6",
        creamLight: "#FEF1E5",
        dark: "#21130D",
        secondary: "#AD6C53",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        script: ["var(--font-alex-brush)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
