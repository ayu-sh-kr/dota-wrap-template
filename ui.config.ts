export const uiConfig = {
  meta: {
    name: "dota-wrap-template",
    appType: "minimal dota-wrap web app",
    stylingEngine: "tailwind-v4-css-first",
    defaultMode: "light",
    designTone: "cool monochrome interface with restrained red and purple accents",
  },
  typography: {
    fontFamily: {
      sans: ["\"DM Sans\"", "\"Helvetica Neue\"", "Helvetica", "Arial", "sans-serif"],
      mono: ["\"Roboto Mono\"", "\"SFMono-Regular\"", "\"IBM Plex Mono\"", "\"Liberation Mono\"", "monospace"],
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  theme: {
    colors: {
      light: {
        canvas: "#f8fafc",
        surface: "#ffffff",
        ink: "#0e1116",
        headerText: "#0e1116",
        muted: "#2a2d33",
        line: "#cbd5e1",
        focus: "#9333ea",
      },
      dark: {
        canvas: "#0e1116",
        surface: "#1c1f24",
        ink: "#f5f5f5",
        headerText: "#f5f5f5",
        muted: "#cbd5e1",
        line: "#2a2d33",
        focus: "#c084fc",
      },
    },
  },
  tailwind: {
    cssThemeFile: "./src/theme.css",
    utilityMapping: {
      backgrounds: ["bg-canvas", "bg-surface"],
      text: ["text-ink", "text-muted", "text-header-text"],
      borders: ["border-line"],
      typography: ["font-sans", "font-mono"],
    },
    rules: [
      "Prefer semantic token utilities over arbitrary color values.",
      "Keep the page monochrome unless a component needs emphasis.",
      "Use focus-visible states instead of removing outlines.",
    ],
  },
} as const;

export type UIConfig = typeof uiConfig;
