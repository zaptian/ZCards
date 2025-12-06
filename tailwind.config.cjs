module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // LIGHT THEME COLORS
        light: {
          bg: "#ffffff",
          border: "#DADCE0",
          card: "#f8f9fa",
          text: "#111827",
          primary: "#2563eb",
          secondary: "#7c3aed",
          border: "#e5e7eb",
        },

        icon: {
          bg: "#0369a1",
          seleceted: "#eff6ff",
          seleceted_text: "#334155",
          sub_selected: "#e0f2fe",
          sub_navigation_text: "#ffffff",
        },

        // DARK THEME COLORS
        dark: {
          bg: "#212121",
          card: "#1e293b",
          text: "#f1f5f9",
          primary: "#3b82f6",
          secondary: "#a855f7",
          border: "#DADCE0",
        },
      },
    },
  },
  plugins: [],
};
