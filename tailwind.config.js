/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E11D74",
          light: "#FDE2EE",
          dark: "#B3135A",
        },
        secondary: "#7C3AED",
        gold: {
          light: "#FCE7A1",
          DEFAULT: "#D4AF37",
          dark: "#B8860B",
        },
        ivory: "#FAF6F8",
        plum: "#1F1124",
        mauve: "#736077",
      },
      fontFamily: {
        sans: ["'Outfit'", "sans-serif"],
        heading: ["'Outfit'", "sans-serif"],
        body: ["'Outfit'", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #E11D74 0%, #7C3AED 100%)",
        "gradient-hero": "linear-gradient(135deg, #FDE2EE 0%, #EDE9FE 50%, #FAF6F8 100%)",
        "gradient-gold": "linear-gradient(135deg, #FCE7A1 0%, #D4AF37 50%, #B8860B 100%)",
        "gradient-cta": "linear-gradient(90deg, #FF6A88 0%, #E11D74 50%, #A21CAF 100%)",
        "gradient-dark": "linear-gradient(180deg, #1F1124 0%, #0F0812 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(225,29,116,0.25)",
        glow: "0 0 35px rgba(225,29,116,0.3)",
        "gold-glow": "0 0 25px rgba(212,175,55,0.35)",
        card: "0 4px 20px -2px rgba(31,17,36,0.05), 0 2px 6px -1px rgba(31,17,36,0.03)",
        "card-hover": "0 25px 40px -10px rgba(225,29,116,0.18), 0 10px 20px -5px rgba(31,17,36,0.06)",
        float: "0 20px 35px -5px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
