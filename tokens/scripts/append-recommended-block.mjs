#!/usr/bin/env node
/**
 * One-shot patcher: appends the recommended-token block (.btn-success,
 * .status-*, .input) to the 5 hand-authored themes. Generated themes
 * already get this block from gen-themes.mjs.
 *
 * Run once. Subsequent edits to these tokens belong in the source CSS
 * directly.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(__dirname, "..", "styles");

function block({ accent, accentHover, accentDark, secondaryLightBg, secondaryDarkBg, secondaryLightBorder, secondaryDarkBorder, textLight, textDark }) {
  return `
/* ----- Status + success + input (SCHEMA.md recommended) ---------------- */
.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: 1px solid rgba(5, 150, 105, 0.55);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}
.btn-success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}
html.dark .btn-success {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: #022c22;
  box-shadow: 0 4px 14px rgba(52, 211, 153, 0.35);
}

.status-success {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
  border: 1px solid rgba(16, 185, 129, 0.32);
}
html.dark .status-success {
  background: rgba(52, 211, 153, 0.16);
  color: #6ee7b7;
  border-color: rgba(52, 211, 153, 0.36);
}

.status-warning {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.32);
}
html.dark .status-warning {
  background: rgba(251, 191, 36, 0.16);
  color: #fcd34d;
  border-color: rgba(251, 191, 36, 0.36);
}

.status-error {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
  border: 1px solid rgba(239, 68, 68, 0.32);
}
html.dark .status-error {
  background: rgba(248, 113, 113, 0.16);
  color: #fca5a5;
  border-color: rgba(248, 113, 113, 0.36);
}

.status-info {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
  border: 1px solid rgba(59, 130, 246, 0.32);
}
html.dark .status-info {
  background: rgba(96, 165, 250, 0.16);
  color: #93c5fd;
  border-color: rgba(96, 165, 250, 0.36);
}

.input {
  background: ${secondaryLightBg};
  color: ${textLight};
  border: 1px solid ${secondaryLightBorder};
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}
.input:focus {
  border-color: ${accent};
  box-shadow: 0 0 0 3px ${accent}25;
}
html.dark .input {
  background: ${secondaryDarkBg};
  color: ${textDark};
  border-color: ${secondaryDarkBorder};
}
html.dark .input:focus {
  border-color: ${accentDark};
  box-shadow: 0 0 0 3px ${accentDark}30;
}
`;
}

const PATCHES = {
  "glass-plus.css": block({
    accent: "#a855f7",
    accentHover: "#7c3aed",
    accentDark: "#c084fc",
    secondaryLightBg: "rgba(243, 235, 255, 0.78)",
    secondaryDarkBg: "rgba(168, 85, 247, 0.16)",
    secondaryLightBorder: "rgba(168, 85, 247, 0.32)",
    secondaryDarkBorder: "rgba(168, 85, 247, 0.32)",
    textLight: "#0f172a",
    textDark: "#f1f5f9",
  }),
  "glass-v1.css": block({
    accent: "#8b5cf6",
    accentHover: "#7c3aed",
    accentDark: "#a78bfa",
    secondaryLightBg: "rgba(255, 255, 255, 0.7)",
    secondaryDarkBg: "rgba(255, 255, 255, 0.08)",
    secondaryLightBorder: "rgba(15, 23, 42, 0.12)",
    secondaryDarkBorder: "rgba(255, 255, 255, 0.14)",
    textLight: "#0f172a",
    textDark: "#f1f5f9",
  }),
  "glass-v2.css": block({
    accent: "#6366f1",
    accentHover: "#4f46e5",
    accentDark: "#818cf8",
    secondaryLightBg: "rgba(255, 255, 255, 0.78)",
    secondaryDarkBg: "rgba(255, 255, 255, 0.08)",
    secondaryLightBorder: "rgba(15, 23, 42, 0.1)",
    secondaryDarkBorder: "rgba(255, 255, 255, 0.14)",
    textLight: "#0f172a",
    textDark: "#f1f5f9",
  }),
  "frosted-glass.css": block({
    accent: "#06b6d4",
    accentHover: "#0891b2",
    accentDark: "#22d3ee",
    secondaryLightBg: "rgba(220, 245, 245, 0.7)",
    secondaryDarkBg: "rgba(0, 200, 200, 0.14)",
    secondaryLightBorder: "rgba(0, 200, 200, 0.35)",
    secondaryDarkBorder: "rgba(0, 220, 220, 0.3)",
    textLight: "#0b1f2a",
    textDark: "#e6f4f1",
  }),
  "aurora-twilight.css": block({
    accent: "#8b5cf6",
    accentHover: "#7c3aed",
    accentDark: "#a78bfa",
    secondaryLightBg: "rgba(168, 85, 247, 0.1)",
    secondaryDarkBg: "rgba(167, 139, 250, 0.12)",
    secondaryLightBorder: "rgba(168, 85, 247, 0.3)",
    secondaryDarkBorder: "rgba(167, 139, 250, 0.3)",
    textLight: "#1e1b4b",
    textDark: "#ede9fe",
  }),
};

for (const [filename, css] of Object.entries(PATCHES)) {
  const path = resolve(stylesDir, filename);
  const current = readFileSync(path, "utf8");
  if (current.includes(".btn-success")) {
    console.log(`[skip] ${filename} already has .btn-success`);
    continue;
  }
  let updated;
  const motionMatch = current.match(/(@media \(prefers-reduced-motion: reduce\)[\s\S]*$)/);
  if (motionMatch) {
    updated = current.replace(motionMatch[1], `${css}\n${motionMatch[1]}`);
  } else {
    updated = current + css + "\n";
  }
  writeFileSync(path, updated);
  console.log(`[patch] ${filename}`);
}
