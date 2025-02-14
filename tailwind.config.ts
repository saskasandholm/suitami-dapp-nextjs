import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#011829",
        secondary: "#030f1c",
        background: "#000000",
        accent: "#87fafd",
        dark: {
          DEFAULT: "#011829",
          secondary: "#030f1c",
          black: "#000000",
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom, var(--primary-dark), var(--secondary-dark), var(--background-dark))',
        'gradient-accent': 'linear-gradient(135deg, rgba(135, 250, 253, 0.15), rgba(135, 250, 253, 0.05))',
      },
      boxShadow: {
        'accent-glow': '0 0 20px rgba(135, 250, 253, 0.15)',
        'accent-glow-sm': '0 0 10px rgba(135, 250, 253, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
