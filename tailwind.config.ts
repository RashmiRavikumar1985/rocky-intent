import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        molten: {
          DEFAULT: "hsl(var(--molten-orange))",
          50: "hsl(18, 100%, 95%)",
          100: "hsl(18, 100%, 85%)",
          200: "hsl(18, 100%, 75%)",
          300: "hsl(18, 100%, 65%)",
          400: "hsl(18, 100%, 55%)",
          500: "hsl(18, 100%, 50%)",
          600: "hsl(18, 100%, 45%)",
          700: "hsl(18, 100%, 35%)",
          800: "hsl(18, 100%, 25%)",
          900: "hsl(18, 100%, 15%)",
        },
        neural: {
          DEFAULT: "hsl(var(--neural-violet))",
          50: "hsl(263, 70%, 95%)",
          100: "hsl(263, 70%, 85%)",
          200: "hsl(263, 70%, 75%)",
          300: "hsl(263, 70%, 65%)",
          400: "hsl(263, 70%, 55%)",
          500: "hsl(263, 70%, 50%)",
          600: "hsl(263, 70%, 40%)",
          700: "hsl(263, 70%, 30%)",
          800: "hsl(263, 70%, 20%)",
          900: "hsl(263, 70%, 10%)",
        },
        space: {
          DEFAULT: "hsl(var(--deep-space))",
          light: "hsl(240, 10%, 12%)",
          dark: "hsl(240, 10%, 2%)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(18, 100%, 50%, 0.3), 0 0 40px hsl(18, 100%, 50%, 0.2)",
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(18, 100%, 50%, 0.5), 0 0 80px hsl(18, 100%, 50%, 0.3)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotateY(0deg)" },
          "50%": { transform: "translateY(-20px) rotateY(5deg)" },
        },
        "vein-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "vein-pulse": "vein-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-molten": "linear-gradient(135deg, hsl(18, 100%, 50%) 0%, hsl(25, 100%, 55%) 50%, hsl(263, 70%, 50%) 100%)",
        "gradient-space": "linear-gradient(180deg, hsl(240, 10%, 4%) 0%, hsl(240, 15%, 8%) 50%, hsl(263, 20%, 10%) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
