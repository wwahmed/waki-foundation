#!/usr/bin/env node
/**
 * Generate the new theme CSS files (Aurora new variants + all Clean,
 * Editorial, Neon variants) from per-family templates and palette
 * specs. Run on demand:
 *
 *   node scripts/gen-themes.mjs
 *
 * Re-runs are safe: each file is overwritten in place. Hand edits to
 * generated files will be lost, so structural tweaks belong in this
 * script's templates and palette tweaks belong in the PALETTES table.
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(__dirname, "..", "styles");

// ---------------------------------------------------------------------------
// Shared button block. Emitted in every generated theme so the
// SCHEMA.md `.btn-*` contract is honoured. `accent` is the theme's
// brand colour for primary; secondary is theme-tinted; warning + danger
// use universal amber/red so destructive intent reads at a glance.
// `darkText` is the foreground colour used inside the primary button
// in dark mode (typically a near-black so the high-saturation accent
// has high contrast text on top).
// ---------------------------------------------------------------------------
function buttonBlock({ accent, accentHover, accentDark, accentDarkHover, secondaryLightBg, secondaryDarkBg, secondaryLightBorder, secondaryDarkBorder, textLight, textDark, ghostLightBg, ghostLightBorder, ghostDarkBg, ghostDarkBorder, primaryDarkText = "#0a0a0a" }) {
  return `
/* ----- Action buttons (SCHEMA.md required) ------------------------------ */
.btn-primary {
  background: linear-gradient(135deg, ${accent} 0%, ${accentHover} 100%);
  color: #ffffff;
  border: 1px solid ${accentHover};
  box-shadow: 0 4px 14px ${accent}50;
}
.btn-primary:hover {
  background: linear-gradient(135deg, ${accentHover} 0%, ${accentHover} 100%);
  filter: brightness(1.05);
}
html.dark .btn-primary {
  background: linear-gradient(135deg, ${accentDark} 0%, ${accentDarkHover} 100%);
  color: ${primaryDarkText};
  box-shadow: 0 4px 14px ${accentDark}55;
}
html.dark .btn-primary:hover {
  background: linear-gradient(135deg, ${accentDarkHover} 0%, ${accentDarkHover} 100%);
  filter: brightness(1.1);
}

.btn-secondary {
  background: ${secondaryLightBg};
  color: ${textLight};
  border: 1px solid ${secondaryLightBorder};
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}
.btn-secondary:hover {
  filter: brightness(0.97);
}
html.dark .btn-secondary {
  background: ${secondaryDarkBg};
  color: ${textDark};
  border-color: ${secondaryDarkBorder};
}
html.dark .btn-secondary:hover {
  filter: brightness(1.15);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  border: 1px solid rgba(217, 119, 6, 0.55);
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
  border: 1px solid rgba(220, 38, 38, 0.55);
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
  background: ${ghostLightBg};
  border-color: ${ghostLightBorder};
}
html.dark .btn-ghost {
  color: ${textDark};
}
html.dark .btn-ghost:hover {
  background: ${ghostDarkBg};
  border-color: ${ghostDarkBorder};
}

/* ----- Status + success button + input (SCHEMA.md recommended) --------- */
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

// ---------------------------------------------------------------------------
// Aurora new variants (sunrise / ocean / forest). Twilight stays as the
// retained file from v0.3.0; we don't regenerate it here.
// ---------------------------------------------------------------------------

function auroraCss(spec) {
  const { id, name, blobs, light, dark, ribbon } = spec;
  return `/* ============================================================================
 * Theme: ${id} (Aurora family, ${name} variant)
 * ----------------------------------------------------------------------------
 * Tinted glass over a ${spec.story} aurora blob background. Same Aurora
 * family structure as aurora-twilight (20px blur, gradient ribbon
 * border, radial-blob bg) with a ${name.toLowerCase()} colour story.
 * Generated by scripts/gen-themes.mjs.
 * ============================================================================ */

body {
  background:
    radial-gradient(ellipse at 12% 18%, ${blobs.light[0]}, transparent 50%),
    radial-gradient(ellipse at 88% 78%, ${blobs.light[1]}, transparent 50%),
    radial-gradient(ellipse at 50% 110%, ${blobs.light[2]}, transparent 55%),
    linear-gradient(135deg, ${light.bg.from} 0%, ${light.bg.mid} 50%, ${light.bg.to} 100%);
  background-attachment: fixed;
  color: ${light.text};
}
html.dark body {
  background:
    radial-gradient(ellipse at 12% 18%, ${blobs.dark[0]}, transparent 50%),
    radial-gradient(ellipse at 88% 78%, ${blobs.dark[1]}, transparent 50%),
    radial-gradient(ellipse at 50% 110%, ${blobs.dark[2]}, transparent 55%),
    linear-gradient(135deg, ${dark.bg.from} 0%, ${dark.bg.mid} 50%, ${dark.bg.to} 100%);
  background-attachment: fixed;
  color: ${dark.text};
}

.glass {
  position: relative;
  background: ${light.panel} !important;
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border: 1px solid transparent;
  border-radius: 1rem;
  box-shadow: 0 8px 32px ${light.shadow};
  transition: background-color 200ms ease-out, box-shadow 200ms ease-out;
}
html.dark .glass {
  background: ${dark.panel} !important;
  border-color: transparent;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}

.glass-elevated {
  position: relative;
  background: ${light.panelElevated} !important;
  backdrop-filter: blur(24px) saturate(220%);
  -webkit-backdrop-filter: blur(24px) saturate(220%);
  border: 1px solid transparent;
  border-radius: 1rem;
  box-shadow: 0 16px 48px ${light.shadow};
  transition: background-color 200ms ease-out, box-shadow 200ms ease-out;
}
html.dark .glass-elevated {
  background: ${dark.panelElevated} !important;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.6);
}

.glass::before,
.glass-elevated::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    ${ribbon.light[0]} 0%,
    ${ribbon.light[1]} 50%,
    ${ribbon.light[2]} 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
html.dark .glass::before,
html.dark .glass-elevated::before {
  background: linear-gradient(
    135deg,
    ${ribbon.dark[0]} 0%,
    ${ribbon.dark[1]} 50%,
    ${ribbon.dark[2]} 100%
  );
}

.glass:hover {
  background: ${light.panelHover} !important;
  box-shadow: 0 12px 40px ${light.shadowHover};
}
html.dark .glass:hover {
  background: ${dark.panelHover} !important;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.55);
}

.glass-bar {
  background: ${light.bar} !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
html.dark .glass-bar {
  background: ${dark.bar} !important;
}

.chip {
  background: ${light.chipBg};
  border: 1px solid ${light.chipBorder};
  color: ${light.accent};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
html.dark .chip {
  background: ${dark.chipBg};
  border-color: ${dark.chipBorder};
  color: ${dark.accent};
}

.divider-soft {
  border-color: ${light.divider};
}
html.dark .divider-soft {
  border-color: ${dark.divider};
}
${buttonBlock({
  accent: spec.light.accent,
  accentHover: spec.light.accentHover ?? spec.light.accent,
  accentDark: spec.dark.accent,
  accentDarkHover: spec.dark.accentHover ?? spec.dark.accent,
  secondaryLightBg: spec.light.panelElevated,
  secondaryDarkBg: spec.dark.panelElevated,
  secondaryLightBorder: spec.light.chipBorder,
  secondaryDarkBorder: spec.dark.chipBorder,
  textLight: spec.light.text,
  textDark: spec.dark.text,
  ghostLightBg: spec.light.chipBg,
  ghostLightBorder: spec.light.chipBorder,
  ghostDarkBg: spec.dark.chipBg,
  ghostDarkBorder: spec.dark.chipBorder,
})}
`;
}

// ---------------------------------------------------------------------------
// Clean family. Modern minimal, no blur, hairline borders, generous
// whitespace, plain solid surfaces. Linear / Notion / Vercel
// marketing-site aesthetic.
// ---------------------------------------------------------------------------

function cleanCss(spec) {
  const { id, name, light, dark, accent } = spec;
  return `/* ============================================================================
 * Theme: ${id} (Clean family, ${name} variant)
 * ----------------------------------------------------------------------------
 * Modern minimal. Whitespace-heavy, hairline borders, no blur, no
 * animation. Plays the panel-vs-canvas contrast for structure.
 * Linear / Notion / Vercel marketing-site aesthetic.
 * Generated by scripts/gen-themes.mjs.
 * ============================================================================ */

body {
  background: ${light.bg};
  color: ${light.text};
}
html.dark body {
  background: ${dark.bg};
  color: ${dark.text};
}

.glass,
.glass-elevated {
  background: ${light.panel};
  border: 1px solid ${light.border};
  border-radius: 8px;
  box-shadow: 0 1px 2px ${light.shadow};
  transition: box-shadow 150ms ease-out;
}
html.dark .glass,
html.dark .glass-elevated {
  background: ${dark.panel};
  border-color: ${dark.border};
  box-shadow: 0 1px 2px ${dark.shadow};
}
.glass-elevated {
  box-shadow: 0 4px 12px ${light.shadow};
}
html.dark .glass-elevated {
  box-shadow: 0 4px 12px ${dark.shadow};
}
.glass:hover,
.glass-elevated:hover {
  box-shadow: 0 4px 16px ${light.shadowHover};
}
html.dark .glass:hover,
html.dark .glass-elevated:hover {
  box-shadow: 0 4px 16px ${dark.shadowHover};
}

.glass-bar {
  background: ${light.bar};
  border-bottom: 1px solid ${light.border};
}
html.dark .glass-bar {
  background: ${dark.bar};
  border-bottom-color: ${dark.border};
}

.chip {
  background: ${light.chipBg};
  border: 1px solid ${light.border};
  color: ${accent};
  border-radius: 9999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.7rem;
  font-weight: 600;
}
html.dark .chip {
  background: ${dark.chipBg};
  border-color: ${dark.border};
  color: ${dark.accent ?? accent};
}

.divider-soft {
  border-color: ${light.border};
}
html.dark .divider-soft {
  border-color: ${dark.border};
}
${buttonBlock({
  accent,
  accentHover: spec.accentHover ?? accent,
  accentDark: dark.accent ?? accent,
  accentDarkHover: spec.accentDarkHover ?? dark.accent ?? accent,
  secondaryLightBg: light.chipBg,
  secondaryDarkBg: dark.chipBg,
  secondaryLightBorder: light.borderEmphasis ?? light.border,
  secondaryDarkBorder: dark.borderEmphasis ?? dark.border,
  textLight: light.text,
  textDark: dark.text,
  ghostLightBg: light.chipBg,
  ghostLightBorder: light.border,
  ghostDarkBg: dark.chipBg,
  ghostDarkBorder: dark.border,
})}
`;
}

// ---------------------------------------------------------------------------
// Editorial family. Refined typography, hairline borders, paper feel.
// Stripe / Substack / Mirror aesthetic. Heading-vs-body font contrast
// is deliberately not enforced here since consumers control their own
// font stack; we lean on letter-spacing + weight contrast instead.
// ---------------------------------------------------------------------------

function editorialCss(spec) {
  const { id, name, light, dark, accent } = spec;
  return `/* ============================================================================
 * Theme: ${id} (Editorial family, ${name} variant)
 * ----------------------------------------------------------------------------
 * Refined publication feel. Hairline borders, paper-like surface,
 * generous line-height, letter-spacing on display text. Stripe /
 * Substack / Mirror aesthetic.
 * Generated by scripts/gen-themes.mjs.
 * ============================================================================ */

body {
  background: ${light.bg};
  color: ${light.text};
  letter-spacing: -0.01em;
}
html.dark body {
  background: ${dark.bg};
  color: ${dark.text};
}

.glass,
.glass-elevated {
  background: ${light.panel};
  border: 1px solid ${light.border};
  border-radius: 4px;
  box-shadow: none;
}
html.dark .glass,
html.dark .glass-elevated {
  background: ${dark.panel};
  border-color: ${dark.border};
}
.glass-elevated {
  border-width: 1px;
  box-shadow: 0 1px 0 ${light.borderEmphasis};
}
html.dark .glass-elevated {
  box-shadow: 0 1px 0 ${dark.borderEmphasis};
}

.glass-bar {
  background: ${light.bar};
  border-bottom: 1px solid ${light.border};
}
html.dark .glass-bar {
  background: ${dark.bar};
  border-bottom-color: ${dark.border};
}

.chip {
  background: transparent;
  border: 1px solid ${light.border};
  color: ${accent};
  border-radius: 2px;
  padding: 0.15rem 0.55rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
html.dark .chip {
  border-color: ${dark.border};
  color: ${dark.accent ?? accent};
}

.divider-soft {
  border-color: ${light.border};
}
html.dark .divider-soft {
  border-color: ${dark.border};
}
${buttonBlock({
  accent,
  accentHover: spec.accentHover ?? accent,
  accentDark: dark.accent ?? accent,
  accentDarkHover: spec.accentDarkHover ?? dark.accent ?? accent,
  secondaryLightBg: "#ffffff",
  secondaryDarkBg: dark.panel,
  secondaryLightBorder: light.border,
  secondaryDarkBorder: dark.border,
  textLight: light.text,
  textDark: dark.text,
  ghostLightBg: "rgba(0, 0, 0, 0.04)",
  ghostLightBorder: light.border,
  ghostDarkBg: "rgba(255, 255, 255, 0.04)",
  ghostDarkBorder: dark.border,
})}
`;
}

// ---------------------------------------------------------------------------
// Neon family. Dark base + one or two vibrant accent colours, sharp
// corners, glow shadows, monospace-leaning chips. Vercel / Replicate /
// GitHub-CLI aesthetic.
// ---------------------------------------------------------------------------

function neonCss(spec) {
  const { id, name, accent, secondary, dark } = spec;
  return `/* ============================================================================
 * Theme: ${id} (Neon family, ${name} variant)
 * ----------------------------------------------------------------------------
 * Dark base with a vibrant ${name.toLowerCase()} accent. Sharp 6px corners,
 * glow shadows on accents, mono-feel chips. Light mode is a high-
 * contrast inverted variant; dark is the canonical view. Vercel /
 * Replicate dev-tool aesthetic.
 * Generated by scripts/gen-themes.mjs.
 * ============================================================================ */

body {
  background:
    radial-gradient(circle at 12% 0%, ${accent}20, transparent 34%),
    radial-gradient(circle at 88% 100%, ${(secondary ?? accent)}18, transparent 36%),
    ${dark.bg};
  color: ${dark.text};
}
html.light body {
  background: #fafafa;
  color: #0a0a0a;
}

.glass,
.glass-elevated {
  background: ${dark.panel};
  border: 1px solid ${dark.border};
  border-radius: 6px;
  box-shadow: 0 0 0 1px ${dark.shadow};
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}
html.light .glass,
html.light .glass-elevated {
  background: #ffffff;
  border-color: #e5e5e5;
}
.glass:hover {
  border-color: ${accent};
  box-shadow: 0 0 0 1px ${accent}, 0 0 16px ${accent}30;
}
html.light .glass:hover {
  border-color: ${accent};
  box-shadow: 0 0 0 1px ${accent}, 0 0 16px ${accent}40;
}
.glass-elevated {
  background: ${dark.panelElevated};
  border-color: ${dark.borderStrong};
}
html.light .glass-elevated {
  border-color: #d4d4d4;
}

.glass-bar {
  background: ${dark.bar};
  border-bottom: 1px solid ${accent}30;
}
html.light .glass-bar {
  background: #fafafa;
  border-bottom-color: ${accent}50;
}

.chip {
  background: ${accent}15;
  border: 1px solid ${accent}50;
  color: ${accent};
  border-radius: 4px;
  padding: 0.15rem 0.55rem;
  font-size: 0.65rem;
  font-weight: 600;
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
html.light .chip {
  background: ${accent}10;
  border-color: ${accent}40;
}

.divider-soft {
  border-color: ${dark.border};
}
html.light .divider-soft {
  border-color: #e5e5e5;
}

${secondary ? `/* secondary accent picks up where ${accent} leaves off, so two-tone
   buttons and dual-state visuals can lean on a coherent pair */
.studio-accent-fg.alt {
  color: ${secondary};
}` : ""}

/* ----- Action buttons (SCHEMA.md required) ------------------------------ */
/* Neon-family buttons: sharp 6px corners, accent fill on primary, dark
 * panel on secondary, universal amber/red on warning/danger so destructive
 * intent reads at a glance even on a saturated dark canvas. */
.btn-primary {
  background: ${accent};
  color: #0a0a0a;
  border: 1px solid ${accent};
  border-radius: 6px;
  box-shadow: 0 0 16px ${accent}50;
  font-weight: 700;
}
.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 24px ${accent}80;
}

.btn-secondary {
  background: ${dark.secondary};
  color: ${dark.text};
  border: 1px solid ${dark.borderStrong};
  border-radius: 6px;
}
.btn-secondary:hover {
  border-color: ${accent};
  color: ${accent};
}
html.light .btn-secondary {
  background: #ffffff;
  color: #0a0a0a;
  border-color: #e5e5e5;
}
html.light .btn-secondary:hover {
  border-color: ${accent};
}

.btn-warning {
  background: #d97706;
  color: #ffffff;
  border: 1px solid #b45309;
  border-radius: 6px;
  box-shadow: 0 0 16px rgba(217, 119, 6, 0.45);
  font-weight: 700;
}
.btn-warning:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 24px rgba(217, 119, 6, 0.7);
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
  border: 1px solid #991b1b;
  border-radius: 6px;
  box-shadow: 0 0 16px rgba(220, 38, 38, 0.45);
  font-weight: 700;
}
.btn-danger:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 24px rgba(220, 38, 38, 0.7);
}

.btn-ghost {
  background: transparent;
  color: ${dark.text};
  border: 1px solid transparent;
  border-radius: 6px;
}
.btn-ghost:hover {
  background: ${accent}15;
  border-color: ${accent}50;
  color: ${accent};
}
html.light .btn-ghost {
  color: #0a0a0a;
}
html.light .btn-ghost:hover {
  background: ${accent}10;
}

/* ----- Status + success + input (SCHEMA.md recommended) ---------------- */
.btn-success {
  background: #10b981;
  color: #022c22;
  border: 1px solid #10b981;
  border-radius: 6px;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
  font-weight: 700;
}
.btn-success:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.7);
}

.status-success {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid #10b98180;
  border-radius: 4px;
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
html.light .status-success {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.status-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid #f59e0b80;
  border-radius: 4px;
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
html.light .status-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #b45309;
}

.status-error {
  background: rgba(220, 38, 38, 0.15);
  color: #f87171;
  border: 1px solid #dc262680;
  border-radius: 4px;
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
html.light .status-error {
  background: rgba(220, 38, 38, 0.1);
  color: #b91c1c;
}

.status-info {
  background: ${accent}15;
  color: ${accent};
  border: 1px solid ${accent}50;
  border-radius: 4px;
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
html.light .status-info {
  background: ${accent}10;
}

.input {
  background: ${dark.input};
  color: ${dark.text};
  border: 1px solid ${dark.borderStrong};
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
  outline: none;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}
.input:focus {
  border-color: ${accent};
  box-shadow: 0 0 0 1px ${accent}, 0 0 12px ${accent}40;
}
html.light .input {
  background: #ffffff;
  color: #0a0a0a;
  border-color: #d4d4d4;
}
`;
}

// ---------------------------------------------------------------------------
// Palette specs. Each entry produces one CSS file in styles/.
// ---------------------------------------------------------------------------

const AURORA_VARIANTS = [
  {
    id: "aurora-sunrise",
    name: "Sunrise",
    story: "gold-peach-pink",
    blobs: {
      light: ["rgba(251, 191, 36, 0.22)", "rgba(251, 146, 60, 0.20)", "rgba(236, 72, 153, 0.16)"],
      dark: ["rgba(251, 191, 36, 0.28)", "rgba(251, 146, 60, 0.26)", "rgba(236, 72, 153, 0.20)"],
    },
    ribbon: {
      light: ["rgba(251, 191, 36, 0.6)", "rgba(251, 146, 60, 0.55)", "rgba(236, 72, 153, 0.6)"],
      dark: ["rgba(252, 211, 77, 0.5)", "rgba(253, 186, 116, 0.45)", "rgba(244, 114, 182, 0.5)"],
    },
    light: {
      bg: { from: "#fff7ed", mid: "#fff1f2", to: "#fef3c7" },
      panel: "rgba(251, 191, 36, 0.08)",
      panelElevated: "rgba(255, 255, 255, 0.65)",
      panelHover: "rgba(251, 191, 36, 0.14)",
      bar: "rgba(255, 255, 255, 0.55)",
      text: "#451a03",
      accent: "#ea580c",
      chipBg: "rgba(251, 146, 60, 0.1)",
      chipBorder: "rgba(251, 146, 60, 0.26)",
      shadow: "rgba(120, 53, 15, 0.15)",
      shadowHover: "rgba(120, 53, 15, 0.22)",
      divider: "rgba(120, 53, 15, 0.12)",
    },
    dark: {
      bg: { from: "#1a0d05", mid: "#2a1410", to: "#1a0e0a" },
      panel: "rgba(251, 191, 36, 0.08)",
      panelElevated: "rgba(251, 146, 60, 0.12)",
      panelHover: "rgba(251, 191, 36, 0.14)",
      bar: "rgba(26, 13, 5, 0.7)",
      text: "#fed7aa",
      accent: "#fb923c",
      chipBg: "rgba(251, 146, 60, 0.1)",
      chipBorder: "rgba(251, 146, 60, 0.24)",
      divider: "rgba(253, 186, 116, 0.15)",
    },
  },
  {
    id: "aurora-ocean",
    name: "Ocean",
    story: "teal-sky-blue",
    blobs: {
      light: ["rgba(20, 184, 166, 0.18)", "rgba(14, 165, 233, 0.18)", "rgba(59, 130, 246, 0.14)"],
      dark: ["rgba(20, 184, 166, 0.26)", "rgba(14, 165, 233, 0.28)", "rgba(59, 130, 246, 0.22)"],
    },
    ribbon: {
      light: ["rgba(20, 184, 166, 0.55)", "rgba(14, 165, 233, 0.55)", "rgba(59, 130, 246, 0.55)"],
      dark: ["rgba(45, 212, 191, 0.45)", "rgba(56, 189, 248, 0.45)", "rgba(96, 165, 250, 0.45)"],
    },
    light: {
      bg: { from: "#f0fdfa", mid: "#f0f9ff", to: "#eff6ff" },
      panel: "rgba(14, 165, 233, 0.08)",
      panelElevated: "rgba(255, 255, 255, 0.65)",
      panelHover: "rgba(14, 165, 233, 0.14)",
      bar: "rgba(255, 255, 255, 0.6)",
      text: "#082f49",
      accent: "#0284c7",
      chipBg: "rgba(14, 165, 233, 0.1)",
      chipBorder: "rgba(14, 165, 233, 0.28)",
      shadow: "rgba(7, 89, 133, 0.15)",
      shadowHover: "rgba(7, 89, 133, 0.22)",
      divider: "rgba(7, 89, 133, 0.12)",
    },
    dark: {
      bg: { from: "#021818", mid: "#061a30", to: "#07142a" },
      panel: "rgba(14, 165, 233, 0.08)",
      panelElevated: "rgba(56, 189, 248, 0.12)",
      panelHover: "rgba(14, 165, 233, 0.14)",
      bar: "rgba(2, 24, 24, 0.7)",
      text: "#e0f2fe",
      accent: "#38bdf8",
      chipBg: "rgba(56, 189, 248, 0.1)",
      chipBorder: "rgba(56, 189, 248, 0.24)",
      divider: "rgba(56, 189, 248, 0.15)",
    },
  },
  {
    id: "aurora-forest",
    name: "Forest",
    story: "emerald-lime-teal",
    blobs: {
      light: ["rgba(16, 185, 129, 0.18)", "rgba(132, 204, 22, 0.18)", "rgba(20, 184, 166, 0.14)"],
      dark: ["rgba(16, 185, 129, 0.26)", "rgba(132, 204, 22, 0.22)", "rgba(20, 184, 166, 0.22)"],
    },
    ribbon: {
      light: ["rgba(16, 185, 129, 0.55)", "rgba(132, 204, 22, 0.5)", "rgba(20, 184, 166, 0.55)"],
      dark: ["rgba(52, 211, 153, 0.45)", "rgba(163, 230, 53, 0.4)", "rgba(45, 212, 191, 0.45)"],
    },
    light: {
      bg: { from: "#ecfdf5", mid: "#f7fee7", to: "#f0fdfa" },
      panel: "rgba(16, 185, 129, 0.08)",
      panelElevated: "rgba(255, 255, 255, 0.65)",
      panelHover: "rgba(16, 185, 129, 0.14)",
      bar: "rgba(255, 255, 255, 0.6)",
      text: "#064e3b",
      accent: "#059669",
      chipBg: "rgba(16, 185, 129, 0.1)",
      chipBorder: "rgba(16, 185, 129, 0.28)",
      shadow: "rgba(6, 78, 59, 0.15)",
      shadowHover: "rgba(6, 78, 59, 0.22)",
      divider: "rgba(6, 78, 59, 0.12)",
    },
    dark: {
      bg: { from: "#02180e", mid: "#0a1908", to: "#021818" },
      panel: "rgba(16, 185, 129, 0.08)",
      panelElevated: "rgba(52, 211, 153, 0.12)",
      panelHover: "rgba(16, 185, 129, 0.14)",
      bar: "rgba(2, 24, 14, 0.7)",
      text: "#d1fae5",
      accent: "#34d399",
      chipBg: "rgba(52, 211, 153, 0.1)",
      chipBorder: "rgba(52, 211, 153, 0.24)",
      divider: "rgba(52, 211, 153, 0.15)",
    },
  },
];

const CLEAN_VARIANTS = [
  {
    id: "clean-light",
    name: "Light",
    accent: "#0f172a",
    light: {
      bg: "#ffffff",
      text: "#0f172a",
      panel: "#ffffff",
      bar: "#ffffff",
      border: "#e5e7eb",
      borderEmphasis: "#d1d5db",
      chipBg: "#f9fafb",
      shadow: "rgba(15, 23, 42, 0.04)",
      shadowHover: "rgba(15, 23, 42, 0.08)",
    },
    dark: {
      bg: "#050505",
      text: "#fafafa",
      panel: "#111111",
      bar: "#050505",
      border: "#2a2a2a",
      borderEmphasis: "#525252",
      chipBg: "#191919",
      shadow: "rgba(0, 0, 0, 0.36)",
      shadowHover: "rgba(0, 0, 0, 0.58)",
      accent: "#ffffff",
    },
  },
  {
    id: "clean-dim",
    name: "Dim",
    accent: "#3b82f6",
    light: {
      bg: "#f8fafc",
      text: "#1e293b",
      panel: "#ffffff",
      bar: "#f8fafc",
      border: "#e2e8f0",
      borderEmphasis: "#cbd5e1",
      chipBg: "#f1f5f9",
      shadow: "rgba(30, 41, 59, 0.05)",
      shadowHover: "rgba(30, 41, 59, 0.1)",
    },
    dark: {
      bg: "#0a1020",
      text: "#dbeafe",
      panel: "#131c33",
      bar: "#0a1020",
      border: "#29395f",
      borderEmphasis: "#405985",
      chipBg: "#17223d",
      shadow: "rgba(4, 10, 28, 0.55)",
      shadowHover: "rgba(4, 10, 28, 0.75)",
      accent: "#7dd3fc",
    },
  },
  {
    id: "clean-warm",
    name: "Warm",
    accent: "#b45309",
    light: {
      bg: "#fafaf9",
      text: "#292524",
      panel: "#ffffff",
      bar: "#fafaf9",
      border: "#e7e5e4",
      borderEmphasis: "#d6d3d1",
      chipBg: "#f5f5f4",
      shadow: "rgba(41, 37, 36, 0.05)",
      shadowHover: "rgba(41, 37, 36, 0.1)",
    },
    dark: {
      bg: "#21130c",
      text: "#f8dfc6",
      panel: "#302016",
      bar: "#21130c",
      border: "#6b3f21",
      borderEmphasis: "#9a5a2e",
      chipBg: "#3a271c",
      shadow: "rgba(22, 8, 3, 0.55)",
      shadowHover: "rgba(22, 8, 3, 0.75)",
      accent: "#f59e0b",
    },
  },
  {
    id: "clean-cool",
    name: "Cool",
    accent: "#0891b2",
    light: {
      bg: "#f0f9ff",
      text: "#0c4a6e",
      panel: "#ffffff",
      bar: "#f0f9ff",
      border: "#e0f2fe",
      borderEmphasis: "#bae6fd",
      chipBg: "#f0f9ff",
      shadow: "rgba(12, 74, 110, 0.06)",
      shadowHover: "rgba(12, 74, 110, 0.12)",
    },
    dark: {
      bg: "#061823",
      text: "#cffafe",
      panel: "#0c2733",
      bar: "#061823",
      border: "#145066",
      borderEmphasis: "#1e7490",
      chipBg: "#0f3240",
      shadow: "rgba(3, 18, 28, 0.55)",
      shadowHover: "rgba(3, 18, 28, 0.75)",
      accent: "#22d3ee",
    },
  },
];

const EDITORIAL_VARIANTS = [
  {
    id: "editorial-academic",
    name: "Academic",
    accent: "#1d4ed8",
    light: {
      bg: "#fafaf9",
      text: "#1c1917",
      panel: "#ffffff",
      bar: "#fafaf9",
      border: "#d6d3d1",
      borderEmphasis: "#a8a29e",
    },
    dark: {
      bg: "#101624",
      text: "#eef2ff",
      panel: "#182033",
      bar: "#101624",
      border: "#3b4b6a",
      borderEmphasis: "#60769f",
      accent: "#93c5fd",
    },
  },
  {
    id: "editorial-noir",
    name: "Noir",
    accent: "#dc2626",
    light: {
      bg: "#f5f5f4",
      text: "#0a0a0a",
      panel: "#fafaf9",
      bar: "#f5f5f4",
      border: "#262626",
      borderEmphasis: "#404040",
    },
    dark: {
      bg: "#050303",
      text: "#fff1f2",
      panel: "#12090a",
      bar: "#050303",
      border: "#3f171c",
      borderEmphasis: "#7f1d1d",
      accent: "#fca5a5",
    },
  },
  {
    id: "editorial-warm",
    name: "Warm",
    accent: "#b45309",
    light: {
      bg: "#fff7ed",
      text: "#451a03",
      panel: "#ffffff",
      bar: "#fff7ed",
      border: "#fed7aa",
      borderEmphasis: "#fdba74",
    },
    dark: {
      bg: "#241207",
      text: "#ffedd5",
      panel: "#321d0f",
      bar: "#241207",
      border: "#7c3f12",
      borderEmphasis: "#b45309",
      accent: "#fdba74",
    },
  },
  {
    id: "editorial-technical",
    name: "Technical",
    accent: "#475569",
    light: {
      bg: "#f8fafc",
      text: "#0f172a",
      panel: "#ffffff",
      bar: "#f8fafc",
      border: "#cbd5e1",
      borderEmphasis: "#94a3b8",
    },
    dark: {
      bg: "#06111f",
      text: "#dbeafe",
      panel: "#0b1b2f",
      bar: "#06111f",
      border: "#1d4a6d",
      borderEmphasis: "#2f7ea5",
      accent: "#67e8f9",
    },
  },
];

const NEON_VARIANTS = [
  {
    id: "neon-cyan",
    name: "Cyan",
    accent: "#06b6d4",
    secondary: "#a78bfa",
    dark: {
      bg: "#041014",
      text: "#dffaff",
      panel: "#071820",
      panelElevated: "#0b202b",
      bar: "#041014",
      border: "#124655",
      borderStrong: "#1f7185",
      shadow: "rgba(0, 0, 0, 0.5)",
      secondary: "#0b202b",
      input: "#06161d",
    },
  },
  {
    id: "neon-pink",
    name: "Pink",
    accent: "#ec4899",
    secondary: "#06b6d4",
    dark: {
      bg: "#160812",
      text: "#ffe4f1",
      panel: "#210d1b",
      panelElevated: "#2a1122",
      bar: "#160812",
      border: "#6d1d46",
      borderStrong: "#9d2f68",
      shadow: "rgba(0, 0, 0, 0.5)",
      secondary: "#2a1122",
      input: "#1d0a17",
    },
  },
  {
    id: "neon-lime",
    name: "Lime",
    accent: "#84cc16",
    secondary: "#06b6d4",
    dark: {
      bg: "#0c1404",
      text: "#ecfccb",
      panel: "#121d08",
      panelElevated: "#17260a",
      bar: "#0c1404",
      border: "#3f6212",
      borderStrong: "#65a30d",
      shadow: "rgba(0, 0, 0, 0.5)",
      secondary: "#17260a",
      input: "#101a07",
    },
  },
  {
    id: "neon-plasma",
    name: "Plasma",
    accent: "#f97316",
    secondary: "#ec4899",
    dark: {
      bg: "#190b05",
      text: "#ffedd5",
      panel: "#241008",
      panelElevated: "#30150a",
      bar: "#190b05",
      border: "#7c2d12",
      borderStrong: "#c2410c",
      shadow: "rgba(0, 0, 0, 0.5)",
      secondary: "#30150a",
      input: "#201008",
    },
  },
];

// ---------------------------------------------------------------------------
// Run.
// ---------------------------------------------------------------------------

const all = [
  ...AURORA_VARIANTS.map((s) => ({ filename: `${s.id}.css`, css: auroraCss(s) })),
  ...CLEAN_VARIANTS.map((s) => ({ filename: `${s.id}.css`, css: cleanCss(s) })),
  ...EDITORIAL_VARIANTS.map((s) => ({ filename: `${s.id}.css`, css: editorialCss(s) })),
  ...NEON_VARIANTS.map((s) => ({ filename: `${s.id}.css`, css: neonCss(s) })),
];

for (const { filename, css } of all) {
  writeFileSync(resolve(stylesDir, filename), css);
  console.log(`[gen] styles/${filename}`);
}
console.log(`[ok] generated ${all.length} theme CSS files`);
