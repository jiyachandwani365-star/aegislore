import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))"
        },
        elevated: {
          DEFAULT: "hsl(var(--elevated))",
          foreground: "hsl(var(--elevated-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        brand: ["var(--font-cinzel)", "serif"]
      },
      fontSize: {
        "display-lg": ["4.5rem", { lineHeight: "1", fontWeight: "650", letterSpacing: "0" }],
        "display-md": ["3.5rem", { lineHeight: "1.05", fontWeight: "650", letterSpacing: "0" }],
        "heading-lg": ["2rem", { lineHeight: "1.2", fontWeight: "620", letterSpacing: "0" }],
        "heading-md": ["1.5rem", { lineHeight: "1.25", fontWeight: "620", letterSpacing: "0" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75", letterSpacing: "0" }],
        "body": ["1rem", { lineHeight: "1.625", letterSpacing: "0" }],
        "caption": ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0" }]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "fade-in": "fade-in 0.28s ease-out both"
      }
    }
  },
  plugins: [animate]
};

export default config;
