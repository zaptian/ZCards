module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        dm: ["DM Sans", "sans-serif"],
      },
      colors: {
        /* --------------------------------------
         🎨 CLIPBOARD ICON COLORS
        -------------------------------------- */
        clipboard_copy: "#0284c7",

        /* --------------------------------------
         🎨 ICON COLOR SCALE (Brand: #0369a1)
        -------------------------------------- */
        icon: {
          50: "#e0f2fe",
          100: "#bae6fd",
          200: "#7dd3fc",
          300: "#38bdf8",
          400: "#0ea5e9",
          500: "#0284c7",
          600: "#0369a1", // base
          700: "#075985",
          800: "#0c4a6e",
          900: "#082f49",

          bg: "#0369a1", // main button bg
          seleceted: "#eff6ff",
          seleceted_text: "#075985",
          sub_selected: "#e0f2fe",
          sub_navigation_text: "#ffffff",
        },

        icon_dark: {
          50: "#1e3a56",
          100: "#234766",
          200: "#2c5e86",
          300: "#3374a5",
          400: "#3b8bc5",
          500: "#58aee9",
          600: "#7dc7f7", // base equivalent of 600
          700: "#a3ddff",
          800: "#c9ecff",
          900: "#e8f7ff",

          bg: "#2b82c4", // dark primary button background
          selected: "#1a2835", // subtle highlight on dark
          selected_text: "#a3ddff", // bright readable blue text
          sub_selected: "#1f3b52",
          sub_navigation_text: "#e8f7ff",
        },

        /* --------------------------------------
         🎨 BUTTON COLORS
        -------------------------------------- */
        button: {
          primary: {
            DEFAULT: "#0369a1",
            hover: "#0284c7",
            active: "#075985",
            text: "#ffffff",
          },

          secondary: {
            DEFAULT: "#e0f2fe",
            hover: "#bae6fd",
            active: "#7dd3fc",
            text: "#075985",
          },

          ghost: {
            DEFAULT: "transparent",
            hover: "#f0f9ff",
            active: "#e0f2fe",
            text: "#0369a1",
          },

          outline: {
            border: "#0369a1",
            hover: "#e0f2fe",
            active: "#bae6fd",
            text: "#0369a1",
          },

          success: {
            DEFAULT: "#059669",
            hover: "#10b981",
            active: "#047857",
            text: "#ffffff",
          },

          danger: {
            DEFAULT: "#ef4444", // soft red (base)
            100: "#fecaca", // very light red (backgrounds)
            hover: "#f87171", // hover state
            active: "#dc2626", // active / pressed
            text: "#ffffff",
          },
        },

        /* --------------------------------------
         🎨 CARD / PANEL COLORS
        -------------------------------------- */
        card: {
          DEFAULT: "#ffffff",
          sub: "#f8fafc",
          hover: "#f1f5f9",
          border: "#e2e8f0",
          shadow_light: "rgba(0, 0, 0, 0.05)",
          shadow_dark: "rgba(0, 0, 0, 0.10)",
        },

        /* --------------------------------------
          LIGHT THEME – clean, neutral, modern
        -------------------------------------- */
        light: {
          bg: "#ffffff",
          bg_secondary: "#f5f6f7",
          card: "#f9fafb",
          border: "#e2e4e7",
          border_strong: "#cfd3d8",
          text: "#1f2937",
          text_secondary: "#4b5563",
          text_muted: "#6b7280",
          hover: "#f3f4f6",
          active: "#e5e7eb",

          /* New semantic tokens */
          card1: "#ffffff",
          card2: "#f3f4f6",
          card3: "#e5e7eb",
          label1: "#374151",
          label2: "#6b7280",
          text1: "#111827",
          text2: "#4b5563",
        },

        /* --------------------------------------
          DARK THEME – deep, clean, contrast-safe
        -------------------------------------- */
        dark: {
          bg: "#161616",
          bg_secondary: "#1d1e20",
          card: "#242526",
          border: "#3a3b3d",
          border_strong: "#4a4c4f",
          text: "#f1f5f9",
          text_secondary: "#cbd5e1",
          text_muted: "#9ca3af",
          hover: "#2f3133",
          active: "#3a3c3e",

          /* New semantic tokens */
          card1: "#1d1e20",
          card2: "#242526",
          card3: "#2f3133",
          label1: "#e2e8f0",
          label2: "#94a3b8",
          text1: "#f8fafc",
          text2: "#cbd5e1",
        },

        /* ---------------------------------------------------------
          INPUT THEME TOKENS (Light + Dark)
          Fully aligned with your existing color system
        --------------------------------------------------------- */
        input: {
          light: {
            background: "#ffffff", // matches card1 / pure white
            background_hover: "#f3f4f6", // matches hover
            background_active: "#e5e7eb", // matches active
            background_disabled: "#f5f6f7", // matches bg_secondary

            border: "#e2e4e7", // default border
            border_hover: "#cfd3d8", // strong border
            border_focus: "#0369a1", // optional blue focus ring (Tailwind sky-500 style)
            border_disabled: "#e2e4e7",

            text: "#111827", // text1
            text_secondary: "#4b5563", // text2
            placeholder: "#6b7280", // text_muted
            text_disabled: "#6b7280",

            label: "#374151", // label1
            label_secondary: "#6b7280", // label2
            helper: "#4b5563", // text_secondary
          },

          dark: {
            background: "#1d1e20", // card1
            background_hover: "#2f3133", // hover
            background_active: "#3a3c3e", // active
            background_disabled: "#242526", // card

            border: "#3a3b3d", // border
            border_hover: "#4a4c4f", // border_strong
            border_focus: "#0369a1", // same focus blue for accessibility
            border_disabled: "#3a3b3d",

            text: "#f8fafc", // text1
            text_secondary: "#cbd5e1", // text2
            placeholder: "#9ca3af", // text_muted
            text_disabled: "#9ca3af",

            label: "#e2e8f0", // label1
            label_secondary: "#94a3b8", // label2
            helper: "#cbd5e1", // text_secondary
          },
        },
      },
    },
  },
  plugins: [],
};
