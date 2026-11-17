import { defineTheme, extendTheme } from "@hyper-elements/react";

/**
 * The Aegean theme: cream paper, deep olive ink, terracotta and gold.
 * One theme for the whole kit — the email, the page, the print invitation
 * and the social card all draw their colours, fonts and button styles
 * from here.
 */
export const aegeanTheme = defineTheme({
  colors: {
    background: "#FAF6EF",
    foreground: "#22301F",
    primary: "#C96F4A",
    primaryForeground: "#FFF8F0",
    accent: "#B08D4F",
    olive: "#5A6B3C",
    oliveDark: "#22301F",
    muted: "#7C8A6E",
    border: "#E4DCC8",
    card: "#FFFFFF",
  },
  fonts: {
    body: "-apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    heading: "Georgia, 'Times New Roman', serif",
  },
  fontSizes: {
    body: 16,
    small: 13,
    large: 20,
  },
  lineHeights: {
    body: 1.6,
    heading: 1.2,
  },
  elements: {
    Heading: {
      by: {
        level: {
          1: { fontSize: 40, lineHeight: 1.15, mobile: { fontSize: 32 } },
          2: { fontSize: 28, lineHeight: 1.25, mobile: { fontSize: 24 } },
          3: { fontSize: 20, lineHeight: 1.3 },
        },
      },
    },
    Button: {
      borderRadius: 999,
      padding: [14, 32],
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      hover: { backgroundColor: "#B25A38" },
      variants: {
        primary: {
          backgroundColor: "{colors.primary}",
          color: "{colors.primaryForeground}",
        },
        outline: {
          backgroundColor: "transparent",
          color: "{colors.primary}",
          border: { width: 2, style: "solid", color: "{colors.primary}" },
          hover: { backgroundColor: "{colors.primary}", color: "{colors.primaryForeground}" },
        },
      },
    },
  },
  styles: {
    card: {
      backgroundColor: "{colors.card}",
      padding: 28,
      gap: 12,
      borderRadius: 12,
      border: { width: 1, style: "solid", color: "{colors.border}" },
    },
    kicker: {
      fontSize: 12,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontWeight: 700,
      color: "{colors.olive}",
    },
    band: {
      backgroundColor: "rgba(90, 107, 60, 0.08)",
      padding: 32,
      gap: 16,
      borderRadius: 12,
    },
  },
  formats: {
    // Email clients handle translucent fills unevenly, so in email the
    // translucent olive band becomes its solid tint instead.
    email: {
      styles: {
        band: { backgroundColor: "#EFF1E6" },
      },
    },
  },
});

declare module "@hyper-elements/react" {
  interface Register {
    theme: typeof aegeanTheme;
  }
}

/**
 * The print cut: bone paper, and the Noto fonts (given as files to
 * renderPdf) in place of the email-safe Georgia/system stacks.
 */
export const printTheme = extendTheme(aegeanTheme, {
  colors: { background: "#F6F0E2" },
  fonts: {
    body: "'Noto Sans', sans-serif",
    heading: "'Noto Serif', Georgia, serif",
  },
});

/** The social card cut: the same Noto fonts, on the cream palette. */
export const canvasTheme = extendTheme(aegeanTheme, {
  fonts: {
    body: "'Noto Sans', sans-serif",
    heading: "'Noto Serif', Georgia, serif",
  },
});
