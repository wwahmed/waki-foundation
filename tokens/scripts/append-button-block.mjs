#!/usr/bin/env node
/**
 * One-shot patcher: appends a theme-appropriate `.btn-*` block to each
 * hand-authored Glass / Aurora theme that hasn't received the v0.4.0
 * button contract yet.
 *
 * Run once. Subsequent edits to the button block belong in the source
 * CSS file directly; this script's job is the initial backfill.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(__dirname, "..", "styles");

function buttonBlock({ accentLight, accentLightHover, accentDarkSurface, accentDarkSurfaceHover, secondaryLightBg, secondaryDarkBg, secondaryLightBorder, secondaryDarkBorder, textLight, textDark, ghostHoverBgLight, ghostHoverBorderLight, ghostHoverBgDark, ghostHoverBorderDark }) {
  return `
/* ----- Action buttons --------------------------------------------------- */
/* Required by SCHEMA.md (v0.4.0). Theme CSS loads after waki-shell
 * utilities.css so equal-specificity rules win without !important. */
.btn-primary {
  background: linear-gradient(135deg, ${accentLight} 0%, ${accentLightHover} 100%);
  color: #ffffff;
  border: 1px solid ${accentLightHover}80;
  box-shadow: 0 4px 14px ${accentLight}50;
}
.btn-primary:hover {
  background: linear-gradient(135deg, ${accentLightHover} 0%, ${accentLightHover} 100%);
}
html.dark .btn-primary {
  background: linear-gradient(135deg, ${accentDarkSurface} 0%, ${accentDarkSurfaceHover} 100%);
  color: #0a0e1a;
  box-shadow: 0 4px 14px ${accentDarkSurface}55;
}
html.dark .btn-primary:hover {
  background: linear-gradient(135deg, ${accentDarkSurfaceHover} 0%, ${accentDarkSurfaceHover} 100%);
}

.btn-secondary {
  background: ${secondaryLightBg};
  color: ${textLight};
  border: 1px solid ${secondaryLightBorder};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}
.btn-secondary:hover {
  background: ${secondaryLightBg};
  filter: brightness(1.05);
  border-color: ${secondaryLightBorder};
}
html.dark .btn-secondary {
  background: ${secondaryDarkBg};
  color: ${textDark};
  border-color: ${secondaryDarkBorder};
}
html.dark .btn-secondary:hover {
  background: ${secondaryDarkBg};
  filter: brightness(1.15);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  border: 1px solid rgba(217, 119, 6, 0.5);
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
}
.btn-warning:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}
html.dark .btn-warning {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1a0f00;
  box-shadow: 0 4px 14px rgba(251, 191, 36, 0.35);
}
html.dark .btn-warning:hover {
  background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  border: 1px solid rgba(220, 38, 38, 0.5);
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
}
.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}
html.dark .btn-danger {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  color: #1a0000;
  box-shadow: 0 4px 14px rgba(248, 113, 113, 0.35);
}
html.dark .btn-danger:hover {
  background: linear-gradient(135deg, #fca5a5 0%, #f87171 100%);
}

.btn-ghost {
  background: transparent;
  color: ${textLight};
  border: 1px solid transparent;
}
.btn-ghost:hover {
  background: ${ghostHoverBgLight};
  border-color: ${ghostHoverBorderLight};
}
html.dark .btn-ghost {
  color: ${textDark};
}
html.dark .btn-ghost:hover {
  background: ${ghostHoverBgDark};
  border-color: ${ghostHoverBorderDark};
}
`;
}

const PATCHES = {
  "glass-v1.css": buttonBlock({
    accentLight: "#8b5cf6",
    accentLightHover: "#7c3aed",
    accentDarkSurface: "#a78bfa",
    accentDarkSurfaceHover: "#8b5cf6",
    secondaryLightBg: "rgba(255, 255, 255, 0.7)",
    secondaryDarkBg: "rgba(255, 255, 255, 0.08)",
    secondaryLightBorder: "rgba(15, 23, 42, 0.12)",
    secondaryDarkBorder: "rgba(255, 255, 255, 0.14)",
    textLight: "#0f172a",
    textDark: "#f1f5f9",
    ghostHoverBgLight: "rgba(139, 92, 246, 0.08)",
    ghostHoverBorderLight: "rgba(139, 92, 246, 0.18)",
    ghostHoverBgDark: "rgba(139, 92, 246, 0.14)",
    ghostHoverBorderDark: "rgba(139, 92, 246, 0.24)",
  }),
  "glass-v2.css": buttonBlock({
    accentLight: "#6366f1",
    accentLightHover: "#4f46e5",
    accentDarkSurface: "#818cf8",
    accentDarkSurfaceHover: "#6366f1",
    secondaryLightBg: "rgba(255, 255, 255, 0.78)",
    secondaryDarkBg: "rgba(255, 255, 255, 0.08)",
    secondaryLightBorder: "rgba(15, 23, 42, 0.1)",
    secondaryDarkBorder: "rgba(255, 255, 255, 0.14)",
    textLight: "#0f172a",
    textDark: "#f1f5f9",
    ghostHoverBgLight: "rgba(99, 102, 241, 0.08)",
    ghostHoverBorderLight: "rgba(99, 102, 241, 0.2)",
    ghostHoverBgDark: "rgba(99, 102, 241, 0.14)",
    ghostHoverBorderDark: "rgba(99, 102, 241, 0.26)",
  }),
  "aurora-twilight.css": buttonBlock({
    accentLight: "#8b5cf6",
    accentLightHover: "#7c3aed",
    accentDarkSurface: "#a78bfa",
    accentDarkSurfaceHover: "#8b5cf6",
    secondaryLightBg: "rgba(168, 85, 247, 0.1)",
    secondaryDarkBg: "rgba(167, 139, 250, 0.12)",
    secondaryLightBorder: "rgba(168, 85, 247, 0.3)",
    secondaryDarkBorder: "rgba(167, 139, 250, 0.3)",
    textLight: "#1e1b4b",
    textDark: "#ede9fe",
    ghostHoverBgLight: "rgba(168, 85, 247, 0.08)",
    ghostHoverBorderLight: "rgba(168, 85, 247, 0.2)",
    ghostHoverBgDark: "rgba(167, 139, 250, 0.12)",
    ghostHoverBorderDark: "rgba(167, 139, 250, 0.24)",
  }),
};

for (const [filename, block] of Object.entries(PATCHES)) {
  const path = resolve(stylesDir, filename);
  const current = readFileSync(path, "utf8");
  if (current.includes(".btn-primary")) {
    console.log(`[skip] ${filename} already has .btn-primary`);
    continue;
  }
  // Insert before the trailing @media (prefers-reduced-motion) block if
  // present; otherwise append at end.
  let updated;
  const motionMatch = current.match(/(@media \(prefers-reduced-motion: reduce\)[\s\S]*$)/);
  if (motionMatch) {
    updated = current.replace(motionMatch[1], `${block}\n${motionMatch[1]}`);
  } else {
    updated = current + block + "\n";
  }
  writeFileSync(path, updated);
  console.log(`[patch] ${filename}`);
}
