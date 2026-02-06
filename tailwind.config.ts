import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soyol: {
          DEFAULT: "#FF7900",
          light: "#ffb366",
          dark: "#e66d00",
        },
        dark: {
          DEFAULT: "#111111",
          light: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui"],
      },
      animation: {
        skeleton: "skeleton 1.5s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        skeleton: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 121, 0, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 121, 0, 0.8)" },
        },
      },
    },
  },
  plugins: [
    // Scrollbar hide utility
    function ({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};

export default config;
