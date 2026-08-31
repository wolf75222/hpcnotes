import { defineTheme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral";

/**
 * HPC Wiki theme: cool neutrals and a scientific blue accent,
 * quieter than MediaWiki, built for long-form reading.
 */
export const hpcTheme = defineTheme({
  name: "hpc",
  extends: neutralTheme,
  color: {
    accent: ["#155EEF", "#60A5FA"],
    neutralStyle: "cool",
    contrast: "standard",
  },
  typography: {
    scale: { base: 16, ratio: 1.2 },
    body: {
      family: "var(--font-hpc-sans)",
      fallbacks: "system-ui, -apple-system, sans-serif",
    },
    heading: {
      family: "var(--font-hpc-sans)",
      fallbacks: "system-ui, -apple-system, sans-serif",
      weight: "semibold",
      weights: { 1: "bold", 2: "bold" },
    },
    code: {
      family: "var(--font-hpc-mono)",
      fallbacks: 'ui-monospace, "SF Mono", Menlo, monospace',
    },
  },
  radius: { base: 4, multiplier: 0.85 },
});
