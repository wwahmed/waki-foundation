#!/usr/bin/env node
/**
 * Generate the Waki theme catalog.
 *
 * The catalog is organized as material families plus hue variants:
 *   Waki Glass - Prism
 *   Waki Glass - Opal
 *
 * Variants inside a family intentionally share geometry, motion, density,
 * blur, and shadow behavior. The variant name is the hue/colorway.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const stylesDir = resolve(repoRoot, "styles");
const familiesFile = resolve(repoRoot, "src", "themes", "families.mjs");

const materials = {
  glass: {
    id: "glass",
    name: "Waki Glass",
    description: "Luminous translucent app chrome with crisp layered depth. Best for polished dashboards and creative tools.",
    structure: {
      radius: 14,
      blur: 30,
      shadow: "luminous-glass",
      surface: "translucent",
      iconography: "regular",
      density: "comfortable",
    },
    tokens: {
      radius: 14,
      blur: 30,
      density: "0.58rem 0.88rem",
      hover: "-4px",
      elevatedHover: "-5px",
      navShift: "2px",
      borderWidth: "1px",
      saturation: "175%",
      elevatedSaturation: "195%",
      sidebarBlend: "82%",
      mainBlend: "58%",
      mobileExtra: 2,
      buttonRadius: "8px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 22px 62px var(--waki-shadow), 0 0 28px color-mix(in srgb, var(--waki-accent) 12%, transparent), inset 0 1px 0 rgba(255,255,255,.32), inset 0 -1px 0 rgba(255,255,255,.06)",
      elevatedShadow: "0 36px 96px var(--waki-shadow), 0 0 38px color-mix(in srgb, var(--waki-accent-2) 12%, transparent), inset 0 1px 0 rgba(255,255,255,.36), inset 0 -16px 30px color-mix(in srgb, var(--waki-accent) 5%, transparent)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.34), inset 0 0 0 1px rgba(255,255,255,.08), 0 12px 34px rgba(0,0,0,.09)",
      bodyOverlay: "radial-gradient(circle at 20% 16%, color-mix(in srgb, var(--waki-accent) 9%, transparent), transparent 30%), radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--waki-accent-2) 7%, transparent), transparent 32%), linear-gradient(118deg, transparent 0 30%, color-mix(in srgb, white 8%, transparent) 42%, transparent 56%),",
      extraCss: `
.glass,
.glass-elevated,
.glass-bar,
.shell-main,
.mobile-card,
.theme-switcher {
  overflow: hidden;
  isolation: isolate;
}
.glass > *,
.glass-elevated > *,
.glass-bar > *,
.shell-main > *,
.mobile-card > *,
.theme-switcher > * {
  position: relative;
  z-index: 1;
}
.glass::before,
.glass-elevated::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 0;
  background:
    linear-gradient(135deg, rgba(255,255,255,.4), rgba(255,255,255,.08) 18%, transparent 44%),
    linear-gradient(315deg, color-mix(in srgb, var(--waki-accent-2) 10%, transparent), transparent 46%);
  opacity: .72;
  pointer-events: none;
}
.glass::after,
.glass-elevated::after,
.glass-bar::after {
  content: "";
  position: absolute;
  inset: -40% -22%;
  z-index: 0;
  border-radius: inherit;
  background:
    radial-gradient(ellipse at 26% 8%, rgba(255,255,255,.42), transparent 28%),
    linear-gradient(106deg, transparent 22%, rgba(255,255,255,.24) 38%, transparent 48% 100%);
  mix-blend-mode: screen;
  opacity: .28;
  transform: translateX(-12%) rotate(-4deg);
  transition: opacity 180ms ease, transform 220ms ease;
  pointer-events: none;
}
.glass:hover::after,
.glass-elevated:hover::after {
  opacity: .44;
  transform: translateX(0) rotate(-4deg);
}
.glass,
.glass-elevated,
.glass-bar {
  border-color: color-mix(in srgb, var(--waki-border) 62%, white);
}
.glass-bar,
.glass-elevated {
  border-top: 1px solid color-mix(in srgb, white 58%, var(--waki-border));
  box-shadow: var(--waki-elevated-shadow-stack), inset 0 1px 0 rgba(255,255,255,.34);
}
.panel-nested {
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--waki-panel-2) 54%, transparent), color-mix(in srgb, var(--waki-panel-3) 42%, transparent));
  border-color: color-mix(in srgb, var(--waki-border-2) 58%, white);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24), inset 0 -12px 24px color-mix(in srgb, var(--waki-accent) 4%, transparent), 0 12px 28px color-mix(in srgb, var(--waki-shadow) 34%, transparent);
}
.chip,
.status-success,
.status-warning,
.status-error,
.status-info {
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 10%, transparent);
  border-color: color-mix(in srgb, currentColor 22%, transparent);
}
.btn-primary {
  background: linear-gradient(135deg, color-mix(in srgb, var(--waki-accent) 84%, white), color-mix(in srgb, var(--waki-accent-2) 78%, #1f2937));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--waki-accent) 24%, transparent);
}
.btn-warning {
  background: linear-gradient(135deg, #d97706, #b45309);
  box-shadow: 0 10px 22px rgba(180, 83, 9, 0.2);
}
.btn-danger {
  background: linear-gradient(135deg, #e11d48, #b91c1c);
  box-shadow: 0 10px 22px rgba(185, 28, 28, 0.2);
}
.btn-success {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 10px 22px rgba(4, 120, 87, 0.18);
}
`,
    },
    variants: [
      colorway("prism", "Prism", "Indigo and teal glass for polished product dashboards.", {
        light: palette("#f3f7fb", "#eef2f7", "#ffffff", "#4f46e5", "#0f766e", "#102033", "#52657d", "rgba(255,255,255,.66)", "rgba(255,255,255,.82)", "rgba(242,246,252,.78)", "rgba(79,70,229,.18)", "rgba(15,118,110,.18)", "rgba(67,56,202,.13)", "rgba(79,70,229,.12)", "rgba(15,118,110,.1)", "rgba(100,116,139,.08)"),
        dark: palette("#080d1c", "#111a2d", "#071923", "#a5b4fc", "#5eead4", "#eef7ff", "#a9bad1", "rgba(79,70,229,.12)", "rgba(14,24,58,.76)", "rgba(10,30,49,.74)", "rgba(94,234,212,.2)", "rgba(165,180,252,.18)", "rgba(0,0,0,.45)", "rgba(129,140,248,.14)", "rgba(94,234,212,.1)", "rgba(100,116,139,.1)"),
      }),
      colorway("opal", "Opal", "Teal and slate glass for calm operations tools.", {
        light: palette("#f0faf8", "#f5f8fb", "#ffffff", "#0f766e", "#0284c7", "#07333a", "#52676d", "rgba(255,255,255,.68)", "rgba(255,255,255,.82)", "rgba(236,248,246,.78)", "rgba(15,118,110,.2)", "rgba(2,132,199,.16)", "rgba(13,148,136,.13)", "rgba(15,118,110,.12)", "rgba(2,132,199,.08)", "rgba(100,116,139,.08)"),
        dark: palette("#03191d", "#082832", "#05231f", "#5eead4", "#7dd3fc", "#dffcf8", "#9accc7", "rgba(45,212,191,.1)", "rgba(6,43,52,.78)", "rgba(5,54,43,.7)", "rgba(153,246,228,.2)", "rgba(125,211,252,.16)", "rgba(0,0,0,.44)", "rgba(94,234,212,.14)", "rgba(56,189,248,.1)", "rgba(100,116,139,.1)"),
      }),
      colorway("civic", "Civic", "Cobalt and amber glass for operational dashboards.", {
        light: palette("#eef4ff", "#fff8ea", "#f8fbff", "#2563eb", "#d97706", "#12213d", "#56667c", "rgba(255,255,255,.68)", "rgba(255,255,255,.84)", "rgba(238,244,255,.76)", "rgba(37,99,235,.22)", "rgba(251,191,36,.28)", "rgba(30,64,175,.16)", "rgba(37,99,235,.2)", "rgba(251,191,36,.18)", "rgba(14,165,233,.12)"),
        dark: palette("#061329", "#24180a", "#071b2b", "#60a5fa", "#fbbf24", "#edf4ff", "#b6c4d9", "rgba(37,99,235,.14)", "rgba(10,27,57,.78)", "rgba(33,25,13,.74)", "rgba(251,191,36,.26)", "rgba(96,165,250,.24)", "rgba(0,0,0,.45)", "rgba(96,165,250,.26)", "rgba(251,191,36,.22)", "rgba(14,165,233,.18)"),
      }),
      colorway("obsidian", "Obsidian", "Charcoal glass with restrained ruby and copper accents.", {
        light: palette("#f8f4f3", "#f6f7f9", "#ffffff", "#be123c", "#b45309", "#221316", "#73575c", "rgba(255,255,255,.72)", "rgba(255,255,255,.86)", "rgba(248,242,241,.78)", "rgba(190,18,60,.18)", "rgba(180,83,9,.16)", "rgba(136,19,55,.12)", "rgba(190,18,60,.1)", "rgba(180,83,9,.08)", "rgba(15,23,42,.08)"),
        dark: palette("#050607", "#1c1210", "#121017", "#fda4af", "#fdba74", "#fff3f2", "#d4aaa8", "rgba(255,255,255,.07)", "rgba(28,20,22,.82)", "rgba(34,24,20,.76)", "rgba(251,113,133,.22)", "rgba(253,186,116,.16)", "rgba(0,0,0,.52)", "rgba(251,113,133,.12)", "rgba(249,115,22,.1)", "rgba(100,116,139,.1)"),
      }),
    ],
  },

  frost: {
    id: "frost",
    name: "Waki Frost",
    description: "Soft high-blur frosted panes with misty depth and gentle hover shimmer.",
    structure: {
      radius: 16,
      blur: 42,
      shadow: "mist-depth",
      surface: "frosted",
      iconography: "regular",
      density: "comfortable",
    },
    tokens: {
      radius: 16,
      blur: 42,
      density: "0.64rem 0.95rem",
      hover: "-3px",
      elevatedHover: "-4px",
      navShift: "1px",
      borderWidth: "1px",
      saturation: "185%",
      elevatedSaturation: "205%",
      sidebarBlend: "78%",
      mainBlend: "58%",
      mobileExtra: 4,
      buttonRadius: "10px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 20px 58px var(--waki-shadow), inset 0 0 32px color-mix(in srgb, white 8%, transparent), inset 0 1px 0 rgba(255,255,255,.38)",
      elevatedShadow: "0 32px 86px var(--waki-shadow), inset 0 0 42px color-mix(in srgb, var(--waki-accent-2) 7%, transparent), inset 0 1px 0 rgba(255,255,255,.42), 0 0 24px color-mix(in srgb, var(--waki-accent) 8%, transparent)",
      panelInset: "inset 0 1px 22px color-mix(in srgb, white 12%, transparent), inset 0 -16px 30px color-mix(in srgb, var(--waki-accent) 4%, transparent), 0 10px 26px rgba(0,0,0,.07)",
      bodyOverlay: "radial-gradient(circle at 18% 10%, color-mix(in srgb, white 12%, transparent), transparent 24%), radial-gradient(circle at 72% 18%, color-mix(in srgb, var(--waki-accent-2) 8%, transparent), transparent 34%), linear-gradient(112deg, transparent 0 32%, color-mix(in srgb, white 10%, transparent) 44%, transparent 58%),",
      extraCss: `
.glass,
.glass-elevated,
.glass-bar,
.shell-main,
.mobile-card,
.theme-switcher {
  overflow: hidden;
  isolation: isolate;
}
.glass > *,
.glass-elevated > *,
.glass-bar > *,
.shell-main > *,
.mobile-card > *,
.theme-switcher > * {
  position: relative;
  z-index: 1;
}
.glass,
.glass-elevated,
.glass-bar,
.mobile-card {
  background:
    linear-gradient(145deg, color-mix(in srgb, white 10%, transparent), transparent 36%),
    radial-gradient(circle at 18% 8%, color-mix(in srgb, white 18%, transparent), transparent 32%),
    linear-gradient(145deg, color-mix(in srgb, var(--waki-panel-2) 62%, transparent), color-mix(in srgb, var(--waki-panel-3) 50%, transparent));
  border-color: color-mix(in srgb, var(--waki-border) 54%, white);
  box-shadow: var(--waki-shadow-stack), inset 0 1px 0 rgba(255,255,255,.42), inset 0 0 0 1px rgba(255,255,255,.08);
}
.glass::before,
.glass-elevated::before,
.glass-bar::before {
  content: "";
  position: absolute;
  inset: 1px;
  z-index: 0;
  border-radius: inherit;
  background:
    radial-gradient(circle at 18% 0%, rgba(255,255,255,.38), transparent 26%),
    linear-gradient(108deg, transparent 18%, rgba(255,255,255,.18) 38%, transparent 54%);
  filter: blur(.2px);
  opacity: .42;
  pointer-events: none;
}
.glass::after,
.glass-elevated::after,
.glass-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255,255,255,.22), transparent 32% 70%, rgba(255,255,255,.08));
  opacity: .34;
  pointer-events: none;
}
.glass-elevated {
  outline: 1px solid color-mix(in srgb, white 30%, transparent);
  outline-offset: -6px;
}
.panel-nested {
  background: color-mix(in srgb, var(--waki-panel-3) 44%, transparent);
  border-color: color-mix(in srgb, var(--waki-border-2) 62%, white);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3), inset 0 0 24px color-mix(in srgb, white 10%, transparent), 0 10px 24px color-mix(in srgb, var(--waki-shadow) 34%, transparent);
}
.chip,
.status-success,
.status-warning,
.status-error,
.status-info {
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  border-color: color-mix(in srgb, currentColor 22%, transparent);
}
.btn-primary {
  background: linear-gradient(135deg, color-mix(in srgb, var(--waki-accent) 82%, white), color-mix(in srgb, var(--waki-accent-2) 76%, #1f2937));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--waki-accent) 22%, transparent);
}
.btn-warning {
  background: linear-gradient(135deg, #d97706, #b45309);
  box-shadow: 0 10px 22px rgba(180, 83, 9, 0.18);
}
.btn-danger {
  background: linear-gradient(135deg, #e11d48, #b91c1c);
  box-shadow: 0 10px 22px rgba(185, 28, 28, 0.18);
}
.btn-success {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 10px 22px rgba(4, 120, 87, 0.16);
}
`,
    },
    variants: [
      colorway("arctic", "Arctic", "Blue-white frost for focused utility apps.", {
        light: palette("#eef8ff", "#f8fcff", "#e7f5ff", "#0284c7", "#7dd3fc", "#082f49", "#557085", "rgba(255,255,255,.68)", "rgba(255,255,255,.84)", "rgba(232,246,255,.8)", "rgba(14,165,233,.22)", "rgba(125,211,252,.28)", "rgba(2,132,199,.16)", "rgba(14,165,233,.2)", "rgba(125,211,252,.18)", "rgba(186,230,253,.16)"),
        dark: palette("#041623", "#082f49", "#061e32", "#7dd3fc", "#38bdf8", "#e0f7ff", "#a8cbe0", "rgba(14,165,233,.14)", "rgba(8,47,73,.78)", "rgba(6,30,50,.76)", "rgba(125,211,252,.28)", "rgba(56,189,248,.24)", "rgba(0,0,0,.46)", "rgba(56,189,248,.26)", "rgba(125,211,252,.18)", "rgba(14,165,233,.14)"),
      }),
      colorway("rose", "Rose", "Muted rose frost for polished editorial workflows.", {
        light: palette("#fbf5f7", "#f8f3ef", "#ffffff", "#be123c", "#9f6b76", "#3a1d27", "#725c64", "rgba(255,255,255,.72)", "rgba(255,255,255,.86)", "rgba(249,242,244,.8)", "rgba(190,18,60,.16)", "rgba(159,107,118,.18)", "rgba(190,18,60,.1)", "rgba(190,18,60,.09)", "rgba(159,107,118,.08)", "rgba(120,113,108,.08)"),
        dark: palette("#1b0b12", "#2a1620", "#221018", "#fda4af", "#d6a5ad", "#fff1f5", "#d4b8c0", "rgba(244,63,94,.1)", "rgba(44,22,31,.78)", "rgba(38,20,28,.74)", "rgba(251,113,133,.2)", "rgba(214,165,173,.16)", "rgba(0,0,0,.48)", "rgba(251,113,133,.12)", "rgba(214,165,173,.08)", "rgba(120,113,108,.1)"),
      }),
      colorway("mint", "Mint", "Calm green frost for finance, wellness, and notes.", {
        light: palette("#f2faf5", "#eef8f6", "#ffffff", "#0f766e", "#047857", "#0b3224", "#557064", "rgba(255,255,255,.72)", "rgba(255,255,255,.86)", "rgba(239,248,244,.8)", "rgba(15,118,110,.18)", "rgba(4,120,87,.16)", "rgba(21,128,61,.1)", "rgba(15,118,110,.1)", "rgba(4,120,87,.08)", "rgba(100,116,139,.08)"),
        dark: palette("#03170d", "#10261f", "#082226", "#86efac", "#5eead4", "#e9fff2", "#acd5bc", "rgba(34,197,94,.1)", "rgba(13,52,31,.78)", "rgba(6,48,52,.72)", "rgba(134,239,172,.2)", "rgba(94,234,212,.16)", "rgba(0,0,0,.44)", "rgba(134,239,172,.12)", "rgba(45,212,191,.1)", "rgba(100,116,139,.1)"),
      }),
      colorway("violet", "Violet", "Restrained violet frost for AI and knowledge work.", {
        light: palette("#f5f3fb", "#f7f5fa", "#ffffff", "#6d28d9", "#64748b", "#25163a", "#665c75", "rgba(255,255,255,.7)", "rgba(255,255,255,.86)", "rgba(246,243,252,.8)", "rgba(109,40,217,.18)", "rgba(148,163,184,.18)", "rgba(109,40,217,.1)", "rgba(109,40,217,.09)", "rgba(148,163,184,.08)", "rgba(100,116,139,.08)"),
        dark: palette("#10091f", "#241832", "#171325", "#c4b5fd", "#cbd5e1", "#fbf1ff", "#cbbdd7", "rgba(109,40,217,.11)", "rgba(29,16,58,.78)", "rgba(39,30,54,.74)", "rgba(196,181,253,.2)", "rgba(148,163,184,.16)", "rgba(0,0,0,.48)", "rgba(196,181,253,.12)", "rgba(148,163,184,.08)", "rgba(100,116,139,.1)"),
      }),
    ],
  },

  academic: {
    id: "academic",
    name: "Waki Academic",
    description: "Clean research surfaces with restrained borders, modern typography, and calm knowledge-work color.",
    structure: {
      radius: 8,
      blur: 0,
      shadow: "research-hairline",
      surface: "knowledge-panel",
      iconography: "thin",
      density: "spacious",
    },
    tokens: {
      radius: 8,
      blur: 0,
      density: "0.55rem 0.78rem",
      hover: "-1px",
      elevatedHover: "-1px",
      navShift: "0px",
      borderWidth: "1px",
      saturation: "100%",
      elevatedSaturation: "100%",
      sidebarBlend: "96%",
      mainBlend: "90%",
      mobileExtra: 0,
      buttonRadius: "6px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 2px 10px var(--waki-shadow)",
      elevatedShadow: "0 8px 24px var(--waki-shadow)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.55)",
      bodyOverlay: "radial-gradient(circle at 14% 8%, color-mix(in srgb, var(--waki-accent) 6%, transparent), transparent 28%), radial-gradient(circle at 86% 10%, color-mix(in srgb, var(--waki-accent-2) 5%, transparent), transparent 26%),",
      extraCss: `
.glass,
.glass-elevated,
.glass-bar,
.shell-main,
.mobile-card {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.glass {
  background: var(--waki-panel);
}
.glass-elevated,
.mobile-card {
  background: linear-gradient(145deg, var(--waki-panel-2), var(--waki-panel-3));
}
.chip {
  border-radius: 6px;
  letter-spacing: 0;
}
.status-success,
.status-warning,
.status-error,
.status-info {
  border-radius: 6px;
}
`,
    },
    variants: [
      colorway("ivory", "Ivory", "Clean ivory research surfaces with ink-blue accents.", {
        light: palette("#f8fafc", "#f3f6fb", "#ffffff", "#2563eb", "#64748b", "#111827", "#5b6472", "#ffffff", "#fbfdff", "#f1f5f9", "#d3dce8", "#aab7c7", "rgba(15,23,42,.08)", "rgba(37,99,235,.07)", "rgba(100,116,139,.05)", "rgba(148,163,184,.04)"),
        dark: palette("#0e1420", "#182234", "#101827", "#93c5fd", "#cbd5e1", "#f3f7fb", "#b9c4d2", "#172033", "#101827", "#202b3c", "#3b4b63", "#64748b", "rgba(0,0,0,.34)", "rgba(147,197,253,.13)", "rgba(148,163,184,.08)", "rgba(71,85,105,.08)"),
      }),
      colorway("oxford", "Oxford", "Deep blue knowledge-work surfaces for serious research tools.", {
        light: palette("#f7fbff", "#edf4ff", "#ffffff", "#1e40af", "#0f766e", "#102033", "#516176", "#ffffff", "#f8fbff", "#eef4ff", "#bfcee5", "#8fb2d9", "rgba(30,64,175,.11)", "rgba(30,64,175,.08)", "rgba(15,118,110,.05)", "rgba(148,163,184,.05)"),
        dark: palette("#07111f", "#0d1b31", "#091524", "#93c5fd", "#5eead4", "#e7f0ff", "#a9bdd4", "#111d31", "#0b1728", "#17243a", "#315076", "#24706a", "rgba(0,0,0,.36)", "rgba(96,165,250,.16)", "rgba(94,234,212,.1)", "rgba(148,163,184,.08)"),
      }),
      colorway("slate", "Slate", "Cool gray reference surfaces for documentation and specs.", {
        light: palette("#f8fafc", "#eef2f7", "#ffffff", "#475569", "#0ea5e9", "#111827", "#5b6573", "#ffffff", "#f8fafc", "#f1f5f9", "#cbd5e1", "#94a3b8", "rgba(15,23,42,.09)", "rgba(71,85,105,.08)", "rgba(14,165,233,.05)", "rgba(148,163,184,.05)"),
        dark: palette("#111419", "#232a35", "#161d27", "#cbd5e1", "#38bdf8", "#f3f7fb", "#b8c2cf", "#1d232d", "#151b24", "#262e3a", "#475569", "#12556f", "rgba(0,0,0,.4)", "rgba(148,163,184,.12)", "rgba(56,189,248,.1)", "rgba(71,85,105,.08)"),
      }),
      colorway("sepia", "Sepia", "Warm neutral study mode with restrained amber accents.", {
        light: palette("#faf8f5", "#f2eee8", "#ffffff", "#a16207", "#64748b", "#27231d", "#6a6258", "#ffffff", "#fbfaf8", "#f4f1ec", "#d8d0c6", "#b8aa9a", "rgba(39,35,29,.08)", "rgba(161,98,7,.06)", "rgba(100,116,139,.05)", "rgba(120,113,108,.04)"),
        dark: palette("#141312", "#25221e", "#1a1815", "#fbbf24", "#cbd5e1", "#f8f4ee", "#c9c0b5", "#211f1c", "#191714", "#2c2924", "#5f574d", "#8b7d6d", "rgba(0,0,0,.36)", "rgba(251,191,36,.1)", "rgba(148,163,184,.08)", "rgba(120,113,108,.08)"),
      }),
    ],
  },

  desktop: {
    id: "desktop",
    name: "Waki Desktop",
    description: "Dense native-app surfaces with compact controls, firm borders, and low-glare depth.",
    structure: {
      radius: 10,
      blur: 12,
      shadow: "compact-native",
      surface: "solid-translucent",
      iconography: "regular",
      density: "compact",
    },
    tokens: {
      radius: 10,
      blur: 12,
      density: "0.46rem 0.7rem",
      hover: "-1px",
      elevatedHover: "-1px",
      navShift: "0px",
      borderWidth: "1px",
      saturation: "125%",
      elevatedSaturation: "135%",
      sidebarBlend: "94%",
      mainBlend: "78%",
      mobileExtra: 0,
      buttonRadius: "7px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 8px 22px var(--waki-shadow)",
      elevatedShadow: "0 16px 38px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.12)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.12)",
      bodyOverlay: "",
      extraCss: `
.glass,
.glass-elevated,
.shell-main,
.mobile-card {
  backdrop-filter: blur(calc(var(--waki-blur) * .72)) saturate(125%);
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) * .72)) saturate(125%);
}
.nav-item.active,
.glass-bar {
  box-shadow: inset 3px 0 0 color-mix(in srgb, var(--waki-accent-2) 65%, transparent);
}
`,
    },
    variants: [
      colorway("graphite", "Graphite", "Graphite desktop chrome with electric blue focus.", {
        light: palette("#f4f6f8", "#e8edf3", "#ffffff", "#2563eb", "#0891b2", "#111827", "#5b6573", "rgba(255,255,255,.82)", "rgba(255,255,255,.92)", "rgba(241,245,249,.86)", "rgba(71,85,105,.22)", "rgba(37,99,235,.22)", "rgba(15,23,42,.12)", "rgba(37,99,235,.12)", "rgba(71,85,105,.1)", "rgba(14,165,233,.1)"),
        dark: palette("#111419", "#232a35", "#161d27", "#38bdf8", "#93c5fd", "#f3f7fb", "#b8c2cf", "rgba(45,52,64,.74)", "rgba(29,35,45,.9)", "rgba(38,46,58,.86)", "rgba(125,211,252,.24)", "rgba(148,163,184,.2)", "rgba(0,0,0,.46)", "rgba(56,189,248,.18)", "rgba(148,163,184,.1)", "rgba(59,130,246,.14)"),
      }),
      colorway("cobalt", "Cobalt", "Cobalt desktop shell for product and admin apps.", {
        light: palette("#eef5ff", "#f8fbff", "#ffffff", "#1d4ed8", "#0ea5e9", "#10213f", "#52657d", "rgba(255,255,255,.84)", "rgba(255,255,255,.94)", "rgba(239,246,255,.88)", "rgba(59,130,246,.2)", "rgba(14,165,233,.22)", "rgba(37,99,235,.12)", "rgba(14,165,233,.18)", "rgba(37,99,235,.12)", "rgba(45,212,191,.1)"),
        dark: palette("#07111f", "#092a3f", "#061d32", "#38bdf8", "#60a5fa", "#e7f7ff", "#aac6d8", "rgba(14,165,233,.12)", "rgba(9,32,54,.82)", "rgba(7,42,63,.76)", "rgba(56,189,248,.27)", "rgba(96,165,250,.22)", "rgba(0,0,0,.44)", "rgba(56,189,248,.23)", "rgba(96,165,250,.18)", "rgba(45,212,191,.14)"),
      }),
      colorway("nova", "Nova", "Violet command-center chrome with luminous accents.", {
        light: palette("#f4f0ff", "#fff4fb", "#f9f7ff", "#9333ea", "#db2777", "#241239", "#6a5878", "rgba(255,255,255,.78)", "rgba(255,255,255,.9)", "rgba(250,245,255,.82)", "rgba(147,51,234,.24)", "rgba(236,72,153,.22)", "rgba(88,28,135,.16)", "rgba(147,51,234,.2)", "rgba(236,72,153,.16)", "rgba(99,102,241,.12)"),
        dark: palette("#10091f", "#2c1235", "#171036", "#d946ef", "#f472b6", "#fbf1ff", "#cfb8da", "rgba(147,51,234,.16)", "rgba(29,16,58,.78)", "rgba(47,18,61,.74)", "rgba(244,114,182,.28)", "rgba(196,181,253,.23)", "rgba(0,0,0,.48)", "rgba(217,70,239,.24)", "rgba(244,114,182,.2)", "rgba(129,140,248,.16)"),
      }),
      colorway("olive", "Olive", "Muted green desktop shell for workbench and maker tools.", {
        light: palette("#f4f7ed", "#eef5e8", "#ffffff", "#4d7c0f", "#0f766e", "#1f2a12", "#5f6f4a", "rgba(255,255,255,.82)", "rgba(255,255,255,.92)", "rgba(241,248,232,.86)", "rgba(101,163,13,.22)", "rgba(15,118,110,.2)", "rgba(77,124,15,.12)", "rgba(101,163,13,.14)", "rgba(15,118,110,.1)", "rgba(132,204,22,.1)"),
        dark: palette("#0e1608", "#1b2912", "#111f15", "#a3e635", "#5eead4", "#efffd8", "#bfd2a1", "rgba(101,163,13,.14)", "rgba(25,43,18,.84)", "rgba(18,38,22,.76)", "rgba(163,230,53,.24)", "rgba(94,234,212,.18)", "rgba(0,0,0,.44)", "rgba(163,230,53,.18)", "rgba(45,212,191,.12)", "rgba(132,204,22,.12)"),
      }),
    ],
  },

  professional: {
    id: "professional",
    name: "Waki Professional",
    description: "Contemporary corporate surfaces with crisp hierarchy, restrained depth, and executive-grade colorways.",
    structure: {
      radius: 12,
      blur: 8,
      shadow: "executive-subtle",
      surface: "crisp-translucent",
      iconography: "regular",
      density: "business",
    },
    tokens: {
      radius: 12,
      blur: 8,
      density: "0.52rem 0.8rem",
      hover: "-1px",
      elevatedHover: "-2px",
      navShift: "0px",
      borderWidth: "1px",
      saturation: "118%",
      elevatedSaturation: "126%",
      sidebarBlend: "96%",
      mainBlend: "84%",
      mobileExtra: 0,
      buttonRadius: "8px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 10px 28px var(--waki-shadow)",
      elevatedShadow: "0 20px 46px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.16)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.14)",
      bodyOverlay: "",
      extraCss: `
.glass,
.glass-elevated,
.shell-main,
.mobile-card {
  backdrop-filter: blur(calc(var(--waki-blur) * .72)) saturate(118%);
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) * .72)) saturate(118%);
}
.glass-bar,
.glass-elevated {
  border-top: 1px solid color-mix(in srgb, var(--waki-accent) 34%, var(--waki-border));
}
.chip {
  border-radius: 7px;
  font-weight: 800;
}
.nav-item.active {
  box-shadow: inset 2px 0 0 var(--waki-accent);
}
`,
    },
    variants: [
      colorway("boardroom", "Boardroom", "Navy, steel, and white for executive dashboards.", {
        light: palette("#f6f8fb", "#edf2f7", "#ffffff", "#1d4ed8", "#334155", "#111827", "#5b6675", "rgba(255,255,255,.86)", "rgba(255,255,255,.95)", "rgba(243,247,252,.9)", "rgba(71,85,105,.2)", "rgba(29,78,216,.2)", "rgba(15,23,42,.11)", "rgba(29,78,216,.1)", "rgba(51,65,85,.08)", "rgba(148,163,184,.08)"),
        dark: palette("#0b1220", "#111827", "#0f172a", "#93c5fd", "#cbd5e1", "#f3f7fb", "#bac6d4", "rgba(30,41,59,.78)", "rgba(15,23,42,.92)", "rgba(30,41,59,.84)", "rgba(96,165,250,.24)", "rgba(148,163,184,.2)", "rgba(0,0,0,.46)", "rgba(96,165,250,.18)", "rgba(148,163,184,.1)", "rgba(30,41,59,.16)"),
      }),
      colorway("meridian", "Meridian", "Blue-gray corporate SaaS surfaces with a clean cyan signal.", {
        light: palette("#f7fbff", "#eef6fb", "#ffffff", "#0369a1", "#0f766e", "#0f2333", "#526977", "rgba(255,255,255,.86)", "rgba(255,255,255,.95)", "rgba(240,249,255,.9)", "rgba(14,116,144,.18)", "rgba(15,118,110,.2)", "rgba(8,47,73,.1)", "rgba(14,116,144,.12)", "rgba(15,118,110,.08)", "rgba(125,211,252,.08)"),
        dark: palette("#06131c", "#0c2430", "#081c27", "#38bdf8", "#5eead4", "#e7f7ff", "#a9c8d6", "rgba(14,54,70,.78)", "rgba(8,35,50,.9)", "rgba(12,48,62,.84)", "rgba(56,189,248,.24)", "rgba(94,234,212,.18)", "rgba(0,0,0,.44)", "rgba(56,189,248,.2)", "rgba(94,234,212,.1)", "rgba(14,116,144,.14)"),
      }),
      colorway("sterling", "Sterling", "Neutral graphite with a discreet violet accent for premium tools.", {
        light: palette("#f8f8fa", "#eff1f5", "#ffffff", "#6d28d9", "#475569", "#18181b", "#60636d", "rgba(255,255,255,.86)", "rgba(255,255,255,.95)", "rgba(244,244,245,.9)", "rgba(82,82,91,.18)", "rgba(109,40,217,.18)", "rgba(24,24,27,.1)", "rgba(109,40,217,.1)", "rgba(71,85,105,.08)", "rgba(168,85,247,.06)"),
        dark: palette("#101014", "#1b1c22", "#15161c", "#a78bfa", "#cbd5e1", "#f4f4f5", "#c0c3cc", "rgba(39,39,46,.78)", "rgba(24,24,27,.9)", "rgba(47,47,56,.82)", "rgba(167,139,250,.24)", "rgba(148,163,184,.18)", "rgba(0,0,0,.44)", "rgba(167,139,250,.16)", "rgba(148,163,184,.1)", "rgba(71,85,105,.14)"),
      }),
      colorway("capital", "Capital", "Slate and deep green for finance, ops, and business intelligence.", {
        light: palette("#f7faf8", "#edf5f0", "#ffffff", "#047857", "#0f766e", "#10231b", "#52675e", "rgba(255,255,255,.86)", "rgba(255,255,255,.95)", "rgba(240,253,244,.88)", "rgba(5,150,105,.2)", "rgba(15,118,110,.2)", "rgba(6,78,59,.11)", "rgba(5,150,105,.12)", "rgba(15,118,110,.08)", "rgba(34,197,94,.08)"),
        dark: palette("#07150f", "#10231a", "#0b1b15", "#34d399", "#5eead4", "#ecfdf5", "#acd0bf", "rgba(13,54,37,.78)", "rgba(8,39,28,.9)", "rgba(16,67,47,.82)", "rgba(52,211,153,.24)", "rgba(94,234,212,.18)", "rgba(0,0,0,.44)", "rgba(52,211,153,.18)", "rgba(94,234,212,.1)", "rgba(16,185,129,.14)"),
      }),
    ],
  },

  corporate: {
    id: "corporate",
    name: "Waki Corporate",
    description: "Enterprise-grade product surfaces: measured contrast, exact spacing, solid panels, and conservative executive polish.",
    structure: {
      radius: 8,
      blur: 0,
      shadow: "corporate-layer",
      surface: "solid-enterprise",
      iconography: "regular",
      density: "efficient",
    },
    tokens: {
      radius: 8,
      blur: 0,
      density: "0.48rem 0.74rem",
      hover: "-1px",
      elevatedHover: "-1px",
      navShift: "0px",
      borderWidth: "1px",
      saturation: "100%",
      elevatedSaturation: "100%",
      sidebarBlend: "100%",
      mainBlend: "94%",
      mobileExtra: 0,
      buttonRadius: "6px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 6px 18px var(--waki-shadow)",
      elevatedShadow: "0 14px 34px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.14)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.1)",
      bodyOverlay: "",
      extraCss: `
.glass,
.glass-elevated,
.glass-bar,
.shell-main,
.mobile-card {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.glass-bar {
  border-bottom: 1px solid var(--waki-border);
}
.panel-nested {
  box-shadow: none;
}
.chip {
  border-radius: 6px;
  font-weight: 750;
}
`,
    },
    variants: [
      colorway("atlas", "Atlas", "Global enterprise blue-gray for serious SaaS products.", {
        light: palette("#f8fafc", "#eef2f6", "#ffffff", "#1d4ed8", "#475569", "#111827", "#5f6b7a", "#ffffff", "#f8fafc", "#f1f5f9", "#cbd5e1", "#94a3b8", "rgba(15,23,42,.1)", "rgba(29,78,216,.08)", "rgba(71,85,105,.06)", "rgba(148,163,184,.05)"),
        dark: palette("#0f172a", "#172033", "#111827", "#93c5fd", "#cbd5e1", "#f8fafc", "#b8c4d2", "#1e293b", "#111827", "#243044", "#475569", "#64748b", "rgba(0,0,0,.38)", "rgba(96,165,250,.14)", "rgba(148,163,184,.08)", "rgba(30,41,59,.1)"),
      }),
      colorway("ledger", "Ledger", "Graphite and green for finance, accounting, and BI.", {
        light: palette("#f8faf9", "#eef4f1", "#ffffff", "#047857", "#334155", "#10231b", "#5c6b63", "#ffffff", "#f8faf9", "#f0f7f3", "#cbd8d1", "#94a3b8", "rgba(6,78,59,.1)", "rgba(5,150,105,.08)", "rgba(51,65,85,.06)", "rgba(34,197,94,.05)"),
        dark: palette("#0b1511", "#14231d", "#101b17", "#34d399", "#cbd5e1", "#ecfdf5", "#b5cabe", "#1a2b24", "#0f1f1a", "#20372d", "#3f5f50", "#64748b", "rgba(0,0,0,.38)", "rgba(52,211,153,.14)", "rgba(148,163,184,.08)", "rgba(5,150,105,.12)"),
      }),
      colorway("summit", "Summit", "Warm charcoal and restrained amber for leadership tools.", {
        light: palette("#faf9f7", "#f0ede8", "#ffffff", "#b45309", "#44403c", "#1c1917", "#6a625c", "#ffffff", "#fafaf9", "#f5f2ed", "#d6d3d1", "#a8a29e", "rgba(68,64,60,.1)", "rgba(180,83,9,.08)", "rgba(68,64,60,.06)", "rgba(245,158,11,.05)"),
        dark: palette("#171412", "#28231f", "#1c1917", "#fbbf24", "#d6d3d1", "#fafaf9", "#c9c0b8", "#292524", "#1c1917", "#332d28", "#57534e", "#78716c", "rgba(0,0,0,.4)", "rgba(251,191,36,.14)", "rgba(214,211,209,.08)", "rgba(146,64,14,.12)"),
      }),
      colorway("harbor", "Harbor", "Steel blue and slate for operational platforms.", {
        light: palette("#f7fbfd", "#edf5f8", "#ffffff", "#0f766e", "#0369a1", "#102a33", "#536b75", "#ffffff", "#f8fcfd", "#eef8fa", "#c6d8de", "#90b7c4", "rgba(8,47,73,.1)", "rgba(15,118,110,.08)", "rgba(3,105,161,.06)", "rgba(125,211,252,.05)"),
        dark: palette("#07151a", "#102630", "#0b1c24", "#5eead4", "#7dd3fc", "#e7fbff", "#a8ccd3", "#17313a", "#0d222b", "#1b3b45", "#35616d", "#3b82a0", "rgba(0,0,0,.4)", "rgba(94,234,212,.14)", "rgba(125,211,252,.1)", "rgba(14,116,144,.12)"),
      }),
    ],
  },

  frostedPro: {
    id: "frosted-pro",
    name: "Waki Frosted Pro",
    description: "Professional frosted glass with restrained sheen, premium shadows, and a polished boardroom feel.",
    structure: {
      radius: 12,
      blur: 28,
      shadow: "professional-frost",
      surface: "frosted-executive",
      iconography: "regular",
      density: "business",
    },
    tokens: {
      radius: 12,
      blur: 28,
      density: "0.56rem 0.84rem",
      hover: "-2px",
      elevatedHover: "-3px",
      navShift: "1px",
      borderWidth: "1px",
      saturation: "165%",
      elevatedSaturation: "180%",
      sidebarBlend: "84%",
      mainBlend: "64%",
      mobileExtra: 2,
      buttonRadius: "8px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 22px 56px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(255,255,255,.08)",
      elevatedShadow: "0 32px 82px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.34), inset 0 -16px 30px color-mix(in srgb, var(--waki-accent) 4%, transparent), 0 0 26px color-mix(in srgb, var(--waki-accent) 8%, transparent)",
      panelInset: "inset 0 1px 24px color-mix(in srgb, white 14%, transparent), inset 0 0 0 1px rgba(255,255,255,.08), 0 12px 30px rgba(0,0,0,.08)",
      bodyOverlay: "radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--waki-accent) 5%, transparent), transparent 32%), radial-gradient(circle at 86% 10%, color-mix(in srgb, white 10%, transparent), transparent 26%), linear-gradient(118deg, transparent 0 38%, color-mix(in srgb, white 7%, transparent) 50%, transparent 64%),",
      extraCss: `
.glass,
.glass-elevated,
.glass-bar,
.shell-main,
.mobile-card,
.theme-switcher {
  overflow: hidden;
  isolation: isolate;
}
.glass > *,
.glass-elevated > *,
.glass-bar > *,
.shell-main > *,
.mobile-card > *,
.theme-switcher > * {
  position: relative;
  z-index: 1;
}
.glass::before,
.glass-elevated::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  z-index: 0;
  background:
    linear-gradient(135deg, rgba(255,255,255,.32), rgba(255,255,255,.08) 24%, transparent 48%),
    linear-gradient(315deg, color-mix(in srgb, var(--waki-accent-2) 10%, transparent), transparent 50%);
  opacity: .62;
  pointer-events: none;
}
.glass::after,
.glass-elevated::after,
.glass-bar::after {
  content: "";
  position: absolute;
  inset: -28% -18%;
  z-index: 0;
  border-radius: inherit;
  background: linear-gradient(108deg, transparent 24%, rgba(255,255,255,.16) 42%, transparent 56%);
  mix-blend-mode: screen;
  opacity: .24;
  pointer-events: none;
}
.glass,
.glass-elevated,
.glass-bar {
  border-color: color-mix(in srgb, var(--waki-border) 58%, white);
}
.panel-nested {
  background: color-mix(in srgb, var(--waki-panel-3) 54%, transparent);
  border-color: color-mix(in srgb, var(--waki-border-2) 68%, white);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.26), inset 0 0 20px color-mix(in srgb, white 8%, transparent), 0 10px 24px color-mix(in srgb, var(--waki-shadow) 34%, transparent);
}
.chip {
  border-radius: 7px;
}
.status-success,
.status-warning,
.status-error,
.status-info {
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  border-color: color-mix(in srgb, currentColor 20%, transparent);
}
.btn-primary {
  background: linear-gradient(135deg, color-mix(in srgb, var(--waki-accent) 80%, white), color-mix(in srgb, var(--waki-accent-2) 72%, #111827));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--waki-accent) 20%, transparent);
}
.btn-warning {
  background: linear-gradient(135deg, #d97706, #92400e);
  box-shadow: 0 8px 20px rgba(146, 64, 14, 0.16);
}
.btn-danger {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  box-shadow: 0 8px 20px rgba(153, 27, 27, 0.16);
}
.btn-success {
  background: linear-gradient(135deg, #059669, #065f46);
  box-shadow: 0 8px 20px rgba(6, 95, 70, 0.14);
}
`,
    },
    variants: [
      colorway("platinum", "Platinum", "Silver frost with blue executive accents.", {
        light: palette("#f6f8fb", "#eef3f8", "#ffffff", "#2563eb", "#64748b", "#111827", "#5d6878", "rgba(255,255,255,.68)", "rgba(255,255,255,.84)", "rgba(241,245,249,.78)", "rgba(148,163,184,.24)", "rgba(37,99,235,.2)", "rgba(15,23,42,.13)", "rgba(37,99,235,.12)", "rgba(148,163,184,.1)", "rgba(203,213,225,.08)"),
        dark: palette("#0d121c", "#1a2330", "#101827", "#93c5fd", "#cbd5e1", "#f4f8fc", "#b9c5d4", "rgba(51,65,85,.66)", "rgba(24,34,49,.82)", "rgba(39,51,69,.78)", "rgba(147,197,253,.24)", "rgba(148,163,184,.2)", "rgba(0,0,0,.46)", "rgba(96,165,250,.18)", "rgba(148,163,184,.1)", "rgba(71,85,105,.14)"),
      }),
      colorway("azure", "Azure", "Crisp blue frosted glass for professional SaaS.", {
        light: palette("#f0f7fc", "#f7fbff", "#ffffff", "#0369a1", "#64748b", "#0c2233", "#52687a", "rgba(255,255,255,.7)", "rgba(255,255,255,.84)", "rgba(241,246,251,.78)", "rgba(14,116,144,.18)", "rgba(100,116,139,.18)", "rgba(8,47,73,.1)", "rgba(14,116,144,.09)", "rgba(100,116,139,.08)", "rgba(125,211,252,.06)"),
        dark: palette("#07131f", "#102338", "#0a1b2d", "#7dd3fc", "#94a3b8", "#e7f7ff", "#a8c5d8", "rgba(14,55,82,.62)", "rgba(11,36,61,.82)", "rgba(18,55,82,.76)", "rgba(125,211,252,.2)", "rgba(148,163,184,.16)", "rgba(0,0,0,.46)", "rgba(56,189,248,.1)", "rgba(148,163,184,.08)", "rgba(14,116,144,.1)"),
      }),
      colorway("jade", "Jade", "Green-tinted executive frost for finance and ops.", {
        light: palette("#f0fbf6", "#f8fffb", "#ffffff", "#059669", "#0f766e", "#0d2b20", "#536b61", "rgba(255,255,255,.68)", "rgba(255,255,255,.84)", "rgba(236,253,245,.78)", "rgba(16,185,129,.22)", "rgba(15,118,110,.2)", "rgba(6,95,70,.13)", "rgba(16,185,129,.14)", "rgba(15,118,110,.1)", "rgba(94,234,212,.08)"),
        dark: palette("#071711", "#102a20", "#0b2018", "#34d399", "#5eead4", "#ecfdf5", "#abcfc0", "rgba(16,74,53,.66)", "rgba(10,48,35,.82)", "rgba(18,76,54,.78)", "rgba(52,211,153,.24)", "rgba(94,234,212,.18)", "rgba(0,0,0,.46)", "rgba(52,211,153,.18)", "rgba(94,234,212,.1)", "rgba(16,185,129,.14)"),
      }),
      colorway("amethyst", "Amethyst", "Subtle violet frost for premium internal tools.", {
        light: palette("#f6f4fb", "#fbfaff", "#ffffff", "#6d28d9", "#64748b", "#21163a", "#625b70", "rgba(255,255,255,.7)", "rgba(255,255,255,.84)", "rgba(245,243,255,.78)", "rgba(109,40,217,.16)", "rgba(148,163,184,.18)", "rgba(76,29,149,.1)", "rgba(109,40,217,.08)", "rgba(148,163,184,.08)", "rgba(196,181,253,.06)"),
        dark: palette("#120e1f", "#211b31", "#171325", "#c4b5fd", "#cbd5e1", "#f5f3ff", "#c5bed5", "rgba(55,48,82,.62)", "rgba(32,27,51,.82)", "rgba(55,48,76,.74)", "rgba(196,181,253,.2)", "rgba(148,163,184,.16)", "rgba(0,0,0,.46)", "rgba(196,181,253,.1)", "rgba(148,163,184,.08)", "rgba(124,58,237,.08)"),
      }),
    ],
  },

  system: {
    id: "system",
    name: "System",
    description: "Native-inspired desktop themes that echo current macOS and Windows app conventions.",
    structure: {
      radius: 10,
      blur: 14,
      shadow: "native-window",
      surface: "system-material",
      iconography: "regular",
      density: "desktop",
    },
    tokens: {
      radius: 10,
      blur: 14,
      density: "0.5rem 0.76rem",
      hover: "-1px",
      elevatedHover: "-2px",
      navShift: "0px",
      borderWidth: "1px",
      saturation: "135%",
      elevatedSaturation: "145%",
      sidebarBlend: "92%",
      mainBlend: "78%",
      mobileExtra: 0,
      buttonRadius: "8px",
      fontBody: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 14px 36px var(--waki-shadow)",
      elevatedShadow: "0 24px 58px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.18)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.16)",
      bodyOverlay: "",
      extraCss: "",
    },
    variants: [
      colorway("mac", "Mac", "macOS-style sidebar translucency, unified toolbar, system blue, and soft window depth.", {
        light: palette("#f5f5f7", "#eceef2", "#ffffff", "#007aff", "#5e5ce6", "#1d1d1f", "#6e6e73", "rgba(255,255,255,.66)", "rgba(255,255,255,.82)", "rgba(246,246,248,.78)", "rgba(60,60,67,.18)", "rgba(0,122,255,.22)", "rgba(0,0,0,.14)", "rgba(0,122,255,.08)", "rgba(94,92,230,.06)", "rgba(142,142,147,.06)"),
        dark: palette("#1c1c1e", "#2c2c2e", "#111113", "#0a84ff", "#bf5af2", "#f5f5f7", "#aeaeb2", "rgba(58,58,60,.62)", "rgba(44,44,46,.82)", "rgba(72,72,74,.72)", "rgba(99,99,102,.35)", "rgba(10,132,255,.28)", "rgba(0,0,0,.48)", "rgba(10,132,255,.14)", "rgba(191,90,242,.1)", "rgba(99,99,102,.12)"),
      }, {
        radius: 12,
        blur: 20,
        density: "0.5rem 0.78rem",
        hover: "-1px",
        elevatedHover: "-2px",
        saturation: "170%",
        elevatedSaturation: "190%",
        sidebarBlend: "86%",
        mainBlend: "70%",
        buttonRadius: "9px",
        fontBody: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif",
        fontDisplay: "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Helvetica Neue\", Arial, sans-serif",
        shadow: "0 18px 46px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.16)",
        elevatedShadow: "0 28px 70px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.28)",
        panelInset: "inset 0 1px 18px color-mix(in srgb, white 8%, transparent), 0 8px 20px rgba(0,0,0,.05)",
        extraCss: `
.glass-bar {
  min-height: 44px;
  border-bottom: 1px solid color-mix(in srgb, var(--waki-border) 72%, transparent);
}
.glass-bar::before {
  content: "";
  position: absolute;
  left: 13px;
  top: 13px;
  width: 38px;
  height: 11px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 5px 5px, #ff5f57 0 5px, transparent 5.5px),
    radial-gradient(circle at 19px 5px, #ffbd2e 0 5px, transparent 5.5px),
    radial-gradient(circle at 33px 5px, #28c840 0 5px, transparent 5.5px);
  pointer-events: none;
}
.shell-sidebar {
  border-right: 1px solid color-mix(in srgb, var(--waki-border) 70%, transparent);
}
.btn-primary {
  border-radius: 8px;
}
`,
      }),
      colorway("windows", "Windows", "Windows 11-style Mica/Acrylic feel with Segoe UI, rounded command surfaces, and Fluent blue.", {
        light: palette("#f3f6fb", "#eef3f8", "#ffffff", "#0067c0", "#2563eb", "#1a1a1a", "#5f646b", "rgba(255,255,255,.78)", "rgba(255,255,255,.92)", "rgba(243,246,250,.86)", "rgba(120,120,120,.2)", "rgba(0,103,192,.24)", "rgba(0,0,0,.12)", "rgba(0,103,192,.1)", "rgba(37,99,235,.07)", "rgba(148,163,184,.08)"),
        dark: palette("#202020", "#1b1b1b", "#111111", "#60cdff", "#0078d4", "#f3f3f3", "#c8c8c8", "rgba(45,45,45,.82)", "rgba(32,32,32,.92)", "rgba(51,51,51,.86)", "rgba(117,117,117,.28)", "rgba(96,205,255,.25)", "rgba(0,0,0,.46)", "rgba(96,205,255,.16)", "rgba(0,120,212,.1)", "rgba(117,117,117,.12)"),
      }, {
        radius: 8,
        blur: 10,
        density: "0.48rem 0.76rem",
        hover: "-1px",
        elevatedHover: "-1px",
        saturation: "125%",
        elevatedSaturation: "140%",
        sidebarBlend: "94%",
        mainBlend: "82%",
        buttonRadius: "6px",
        fontBody: "\"Segoe UI Variable Text\", \"Segoe UI\", ui-sans-serif, system-ui, sans-serif",
        fontDisplay: "\"Segoe UI Variable Display\", \"Segoe UI\", ui-sans-serif, system-ui, sans-serif",
        shadow: "0 8px 22px var(--waki-shadow)",
        elevatedShadow: "0 18px 42px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.12)",
        panelInset: "inset 0 1px 0 rgba(255,255,255,.1)",
        bodyOverlay: "linear-gradient(135deg, color-mix(in srgb, var(--waki-accent) 4%, transparent), transparent 42%),",
        extraCss: `
.glass-bar {
  border-bottom: 1px solid var(--waki-border);
}
.glass,
.glass-elevated,
.shell-main,
.mobile-card {
  backdrop-filter: blur(calc(var(--waki-blur) * .8)) saturate(125%);
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) * .8)) saturate(125%);
}
.nav-item.active {
  box-shadow: inset 3px 0 0 var(--waki-accent);
}
.chip {
  border-radius: 4px;
}
`,
      }),
    ],
  },

  mobile: {
    id: "mobile",
    name: "Waki Mobile",
    description: "Polished touch surfaces with clear hierarchy for professional mobile apps.",
    structure: {
      radius: 20,
      blur: 24,
      shadow: "soft-touch",
      surface: "rounded-glass",
      iconography: "regular",
      density: "touch",
    },
    tokens: {
      radius: 20,
      blur: 24,
      density: "0.72rem 1.05rem",
      hover: "-3px",
      elevatedHover: "-4px",
      navShift: "0px",
      borderWidth: "1px",
      saturation: "145%",
      elevatedSaturation: "160%",
      sidebarBlend: "88%",
      mainBlend: "72%",
      mobileExtra: 6,
      buttonRadius: "12px",
      fontBody: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 20px 56px var(--waki-shadow)",
      elevatedShadow: "0 30px 86px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.24)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.22), 0 12px 30px rgba(0,0,0,.08)",
      bodyOverlay: "radial-gradient(circle at 70% 18%, color-mix(in srgb, var(--waki-accent) 5%, transparent), transparent 30%),",
      extraCss: `
.mobile-card {
  transform: translateY(-1px);
}
.theme-switcher {
  border-radius: 16px;
}
`,
    },
    variants: [
      colorway("orchid", "Plum", "Muted plum mobile surfaces for premium productivity apps.", {
        light: palette("#f7f6fa", "#f2f4f8", "#ffffff", "#5b3f7a", "#475569", "#2c2434", "#6b6472", "rgba(255,255,255,.76)", "rgba(255,255,255,.9)", "rgba(246,244,249,.78)", "rgba(91,63,122,.16)", "rgba(71,85,105,.16)", "rgba(91,63,122,.1)", "rgba(91,63,122,.08)", "rgba(71,85,105,.08)", "rgba(148,163,184,.08)"),
        dark: palette("#15121b", "#221c2d", "#111827", "#b9a7d2", "#94a3b8", "#f6f0ff", "#cbc1d5", "rgba(91,63,122,.12)", "rgba(36,27,53,.78)", "rgba(26,31,45,.74)", "rgba(185,167,210,.18)", "rgba(148,163,184,.16)", "rgba(0,0,0,.46)", "rgba(185,167,210,.1)", "rgba(148,163,184,.08)", "rgba(71,85,105,.1)"),
      }),
      colorway("mint", "Mint", "Professional green mobile theme with readable dark mode.", {
        light: palette("#f2faf5", "#eef8f6", "#ffffff", "#0f766e", "#047857", "#0b3224", "#557064", "rgba(255,255,255,.74)", "rgba(255,255,255,.9)", "rgba(239,248,244,.78)", "rgba(15,118,110,.18)", "rgba(4,120,87,.16)", "rgba(21,128,61,.1)", "rgba(15,118,110,.09)", "rgba(4,120,87,.08)", "rgba(100,116,139,.08)"),
        dark: palette("#03170d", "#10261f", "#05272b", "#86efac", "#5eead4", "#e9fff2", "#acd5bc", "rgba(34,197,94,.1)", "rgba(13,52,31,.78)", "rgba(6,48,52,.72)", "rgba(134,239,172,.2)", "rgba(94,234,212,.16)", "rgba(0,0,0,.44)", "rgba(134,239,172,.1)", "rgba(45,212,191,.08)", "rgba(100,116,139,.1)"),
      }),
      colorway("sunrise", "Sunrise", "Warm neutral mobile surfaces for planning and service apps.", {
        light: palette("#faf7f2", "#f8f3ef", "#ffffff", "#b45309", "#64748b", "#3a2515", "#75675c", "rgba(255,255,255,.78)", "rgba(255,255,255,.92)", "rgba(248,243,237,.84)", "rgba(180,83,9,.18)", "rgba(100,116,139,.16)", "rgba(146,64,14,.1)", "rgba(180,83,9,.08)", "rgba(100,116,139,.08)", "rgba(148,163,184,.08)"),
        dark: palette("#17120e", "#2a211b", "#211b18", "#fdba74", "#cbd5e1", "#fff2df", "#d7c3ad", "rgba(251,146,60,.1)", "rgba(43,34,27,.8)", "rgba(40,31,27,.74)", "rgba(253,186,116,.2)", "rgba(148,163,184,.16)", "rgba(0,0,0,.46)", "rgba(251,146,60,.1)", "rgba(148,163,184,.08)", "rgba(120,113,108,.1)"),
      }),
      colorway("ocean", "Ocean", "Blue-green touch surfaces for field and logistics apps.", {
        light: palette("#f0f8fb", "#eef8f6", "#ffffff", "#0369a1", "#0f766e", "#073349", "#527282", "rgba(255,255,255,.74)", "rgba(255,255,255,.9)", "rgba(234,247,250,.8)", "rgba(14,116,144,.18)", "rgba(15,118,110,.18)", "rgba(2,132,199,.1)", "rgba(14,116,144,.09)", "rgba(15,118,110,.08)", "rgba(125,211,252,.08)"),
        dark: palette("#031923", "#082d3a", "#052b33", "#7dd3fc", "#5eead4", "#e5fbff", "#abd2d8", "rgba(14,165,233,.1)", "rgba(8,50,66,.78)", "rgba(6,43,51,.72)", "rgba(125,211,252,.2)", "rgba(94,234,212,.16)", "rgba(0,0,0,.44)", "rgba(103,232,249,.1)", "rgba(45,212,191,.08)", "rgba(14,165,233,.1)"),
      }),
    ],
  },

  command: {
    id: "command",
    name: "Waki Command",
    description: "Sharp technical surfaces with restrained signal color and terminal-like focus.",
    structure: {
      radius: 8,
      blur: 6,
      shadow: "signal-glow",
      surface: "dark-tooling",
      iconography: "regular",
      density: "compact",
    },
    tokens: {
      radius: 8,
      blur: 6,
      density: "0.48rem 0.72rem",
      hover: "-1px",
      elevatedHover: "-2px",
      navShift: "2px",
      borderWidth: "1px",
      saturation: "115%",
      elevatedSaturation: "125%",
      sidebarBlend: "92%",
      mainBlend: "78%",
      mobileExtra: 0,
      buttonRadius: "5px",
      fontBody: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "\"SF Mono\", \"Cascadia Code\", \"Roboto Mono\", ui-monospace, monospace",
      shadow: "0 14px 34px var(--waki-shadow), 0 0 16px color-mix(in srgb, var(--waki-accent) 8%, transparent)",
      elevatedShadow: "0 22px 56px var(--waki-shadow), 0 0 22px color-mix(in srgb, var(--waki-accent-2) 8%, transparent)",
      panelInset: "inset 0 1px 0 color-mix(in srgb, var(--waki-accent) 10%, transparent)",
      bodyOverlay: "linear-gradient(90deg, color-mix(in srgb, var(--waki-accent) 4%, transparent) 1px, transparent 1px), linear-gradient(0deg, color-mix(in srgb, var(--waki-accent) 3%, transparent) 1px, transparent 1px),",
      extraCss: `
body {
  background-size: auto, 28px 28px, 28px 28px, auto, auto, auto, auto;
}
.glass,
.glass-elevated,
.glass-bar {
  border-color: color-mix(in srgb, var(--waki-accent) 36%, var(--waki-border));
}
.chip {
  border-radius: 5px;
  font-family: var(--waki-font-display);
  text-transform: uppercase;
}
`,
    },
    variants: [
      colorway("cyan", "Cyan", "Blue command surfaces for developer tools.", {
        light: palette("#f8fbfd", "#eef6fa", "#ffffff", "#0e7490", "#2563eb", "#0b2330", "#526b77", "rgba(255,255,255,.86)", "rgba(255,255,255,.94)", "rgba(241,248,251,.86)", "rgba(14,116,144,.18)", "rgba(37,99,235,.16)", "rgba(8,145,178,.1)", "rgba(14,116,144,.08)", "rgba(37,99,235,.06)", "rgba(100,116,139,.06)"),
        dark: palette("#041014", "#071820", "#07131c", "#67e8f9", "#93c5fd", "#dffaff", "#a8d5df", "rgba(6,182,212,.08)", "rgba(7,24,32,.86)", "rgba(9,31,45,.8)", "#164e63", "rgba(96,165,250,.16)", "rgba(0,0,0,.52)", "rgba(6,182,212,.1)", "rgba(96,165,250,.08)", "rgba(100,116,139,.08)"),
      }),
      colorway("lime", "Lime", "Olive signal tools for monitoring and automation.", {
        light: palette("#fafcf7", "#f3f7ed", "#ffffff", "#4d7c0f", "#0f766e", "#1d2b0f", "#63724e", "rgba(255,255,255,.86)", "rgba(255,255,255,.94)", "rgba(247,250,241,.86)", "rgba(101,163,13,.18)", "rgba(15,118,110,.16)", "rgba(101,163,13,.1)", "rgba(101,163,13,.08)", "rgba(15,118,110,.06)", "rgba(100,116,139,.06)"),
        dark: palette("#0c1404", "#121d08", "#0e1806", "#bef264", "#86efac", "#ecfccb", "#bed993", "rgba(132,204,22,.08)", "rgba(18,29,8,.86)", "rgba(23,38,11,.8)", "#3f6212", "rgba(34,197,94,.16)", "rgba(0,0,0,.52)", "rgba(132,204,22,.1)", "rgba(34,197,94,.08)", "rgba(100,116,139,.08)"),
      }),
      colorway("magenta", "Burgundy", "Restrained burgundy command surfaces for technical creative apps.", {
        light: palette("#faf7f8", "#f5f2f4", "#ffffff", "#7f1d1d", "#475569", "#2f171a", "#705d61", "rgba(255,255,255,.86)", "rgba(255,255,255,.94)", "rgba(248,244,245,.86)", "rgba(127,29,29,.18)", "rgba(71,85,105,.16)", "rgba(127,29,29,.1)", "rgba(127,29,29,.08)", "rgba(71,85,105,.06)", "rgba(100,116,139,.06)"),
        dark: palette("#150b0d", "#211113", "#181116", "#fca5a5", "#cbd5e1", "#fee2e2", "#d5b8bb", "rgba(127,29,29,.1)", "rgba(33,18,20,.86)", "rgba(31,22,28,.8)", "#7f1d1d", "rgba(148,163,184,.16)", "rgba(0,0,0,.52)", "rgba(252,165,165,.1)", "rgba(148,163,184,.08)", "rgba(100,116,139,.08)"),
      }),
      colorway("amber", "Amber", "Restrained amber terminal warmth for ops tools.", {
        light: palette("#faf7f0", "#f7f2ea", "#ffffff", "#b45309", "#475569", "#351c09", "#755c43", "rgba(255,255,255,.86)", "rgba(255,255,255,.94)", "rgba(250,245,237,.86)", "rgba(180,83,9,.18)", "rgba(71,85,105,.16)", "rgba(146,64,14,.1)", "rgba(180,83,9,.08)", "rgba(71,85,105,.06)", "rgba(100,116,139,.06)"),
        dark: palette("#190b05", "#24130a", "#1d0d07", "#fdba74", "#cbd5e1", "#ffedd5", "#d7b89c", "rgba(249,115,22,.08)", "rgba(36,16,8,.86)", "rgba(42,19,9,.8)", "#7c2d12", "rgba(148,163,184,.16)", "rgba(0,0,0,.52)", "rgba(249,115,22,.1)", "rgba(148,163,184,.08)", "rgba(100,116,139,.08)"),
      }),
    ],
  },
  studio: {
    id: "studio",
    name: "Waki Studio",
    description: "Solid, calm work surfaces with IBM Plex type and compact rows, for production dashboards that run all day.",
    structure: {
      radius: 12,
      blur: 0,
      shadow: "flat-soft",
      surface: "solid",
      iconography: "regular",
      density: "compact",
    },
    tokens: {
      radius: 12,
      blur: 0,
      density: "0.5rem 0.78rem",
      hover: "0px",
      elevatedHover: "-1px",
      navShift: "0px",
      borderWidth: "1px",
      saturation: "100%",
      elevatedSaturation: "100%",
      sidebarBlend: "100%",
      mainBlend: "100%",
      mobileExtra: 0,
      buttonRadius: "6px",
      fontBody: "\"IBM Plex Sans\", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      fontDisplay: "\"IBM Plex Sans\", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      shadow: "0 8px 24px var(--waki-shadow)",
      elevatedShadow: "0 16px 40px var(--waki-shadow), inset 0 1px 0 rgba(255,255,255,.04)",
      panelInset: "inset 0 1px 0 rgba(255,255,255,.04)",
      bodyOverlay: "",
      extraCss: `
.glass,
.glass-elevated,
.glass-bar,
.shell-main,
.mobile-card {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
code,
kbd,
pre {
  font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
progress::-webkit-progress-value {
  background: linear-gradient(90deg, var(--waki-accent), var(--waki-accent-2));
}
`,
    },
    variants: [
      // Manager 3dByPixel's Cobalt, value for value: page, card, sidebar panel, card header.
      colorway("cobalt", "Cobalt", "Cobalt and indigo on midnight navy; crisp white and periwinkle in light mode. From Manager 3dByPixel.", {
        light: palette("#ffffff", "#f4f7fe", "#ffffff", "#1746d8", "#5b2fd6", "#0f1732", "#4a5480", "#fdfdff", "#e6ecfa", "#d6e0f8", "rgba(20,32,80,.16)", "rgba(20,32,80,.2)", "rgba(15,23,50,.1)", "rgba(23,70,216,.05)", "rgba(91,47,214,.04)", "rgba(230,236,250,0)"),
        dark: palette("#080b14", "#0c1122", "#0a0e1b", "#7fa5ff", "#a98cff", "#e6e9f7", "#949dc0", "#161c34", "#101528", "#1a2140", "rgba(255,255,255,.08)", "rgba(255,255,255,.15)", "rgba(0,0,0,.5)", "rgba(127,165,255,.06)", "rgba(169,140,255,.05)", "rgba(10,14,27,0)"),
      }, {}, { exactLight: true }),
    ],
  },
};

function palette(bg1, bg2, bg3, accent, accent2, text, muted, panel, panel2, panel3, border, border2, shadow, blob1, blob2, blob3) {
  return { bg1, bg2, bg3, accent, accent2, text, muted, panel, panel2, panel3, border, border2, shadow, blob1, blob2, blob3 };
}

function colorway(slot, name, description, modes, tokens = {}, options = {}) {
  return {
    slot,
    name,
    description,
    modes: {
      ...modes,
      // Light palettes are tinted towards the accents unless a colorway is reproduced exactly
      // from an app that already ships it (options.exactLight).
      light: options.exactLight ? modes.light : nonWhiteLightPalette(modes.light),
    },
    tokens,
  };
}

function mix(primary, primaryPercent, secondary) {
  return `color-mix(in srgb, ${primary} ${primaryPercent}%, ${secondary})`;
}

function nonWhiteLightPalette(p) {
  const panel = mix(p.panel, 70, p.bg1);
  const panel2 = mix(p.panel2, 76, p.bg2);
  const panel3Base = mix(p.panel3, 74, p.bg1);

  return {
    ...p,
    bg1: mix(p.bg1, 88, p.accent),
    bg2: mix(p.bg2, 88, p.accent2),
    bg3: mix(p.bg3, 76, p.bg1),
    panel,
    panel2,
    panel3: mix(panel3Base, 92, p.accent),
    border: mix(p.border, 82, p.accent),
    border2: mix(p.border2, 78, p.accent2),
    shadow: mix(p.shadow, 84, p.accent),
    blob1: mix(p.blob1, 82, p.accent),
    blob2: mix(p.blob2, 82, p.accent2),
    blob3: mix(p.blob3, 86, p.bg2),
  };
}

function modeVars(mode, variant) {
  const p = variant.modes[mode];
  const overlaySolid = mode === "dark" ? "rgba(8,13,28,.93)" : "rgba(255,255,255,.96)";
  const overlaySolidStrong = mode === "dark" ? "rgba(15,23,42,.97)" : "rgba(255,255,255,.985)";
  const overlayLine = mode === "dark" ? "rgba(255,255,255,.28)" : "rgba(15,23,42,.16)";
  const overlayBackdrop = mode === "dark" ? "rgba(2,6,23,.58)" : "rgba(15,23,42,.34)";
  const overlayShadow = mode === "dark"
    ? "0 34px 90px rgba(0,0,0,.62), 0 0 0 1px rgba(255,255,255,.04)"
    : "0 28px 76px rgba(15,23,42,.22), 0 0 0 1px rgba(255,255,255,.4)";
  return `
  --waki-bg-1: ${p.bg1};
  --waki-bg-2: ${p.bg2};
  --waki-bg-3: ${p.bg3};
  --waki-blob-1: ${p.blob1};
  --waki-blob-2: ${p.blob2};
  --waki-blob-3: ${p.blob3};
  --waki-panel: ${p.panel};
  --waki-panel-2: ${p.panel2};
  --waki-panel-3: ${p.panel3};
  --waki-bar: ${p.panel2};
  --waki-border: ${p.border};
  --waki-border-2: ${p.border2};
  --waki-text: ${p.text};
  --waki-muted: ${p.muted};
  --waki-accent: ${p.accent};
  --waki-accent-2: ${p.accent2};
  --waki-focus: color-mix(in srgb, ${p.accent} 24%, transparent);
  --waki-shadow: ${p.shadow};
  --waki-overlay-panel: color-mix(in srgb, ${p.panel2} 38%, ${overlaySolid});
  --waki-overlay-panel-strong: color-mix(in srgb, ${p.panel3} 30%, ${overlaySolidStrong});
  --waki-overlay-border: color-mix(in srgb, ${p.border2} 64%, ${overlayLine});
  --waki-overlay-backdrop: ${overlayBackdrop};
  --waki-overlay-shadow: ${overlayShadow};`;
}

function themeId(family, variant) {
  return `waki-${family.id}-${variant.slot}`;
}

function cssForTheme(family, variant) {
  const t = { ...family.tokens, ...(variant.tokens ?? {}) };
  const id = themeId(family, variant);
  return `/* ============================================================================
 * Theme: ${id} (${family.name} - ${variant.name})
 * ----------------------------------------------------------------------------
 * Material family: ${family.name}
 * Hue variant: ${variant.name}
 * Generated by scripts/gen-v2-themes.mjs.
 * ============================================================================ */

:root {
  --waki-radius: ${t.radius}px;
  --waki-radius-sm: ${Math.max(4, t.radius - 8)}px;
  --waki-radius-lg: ${t.radius + 8}px;
  --waki-blur: ${t.blur}px;
  --waki-density: ${t.density};
  --waki-hover-y: ${t.hover};
  --waki-elevated-hover-y: ${t.elevatedHover};
  --waki-nav-shift: ${t.navShift};
  --waki-shadow-stack: ${t.shadow};
  --waki-elevated-shadow-stack: ${t.elevatedShadow};
  --waki-inset-shadow: ${t.panelInset};
  --waki-glass-saturation: ${t.saturation};
  --waki-elevated-saturation: ${t.elevatedSaturation};
  --waki-sidebar-blend: ${t.sidebarBlend};
  --waki-main-blend: ${t.mainBlend};
  --waki-border-width: ${t.borderWidth};
  --waki-button-radius: ${t.buttonRadius};
  --waki-mobile-extra-radius: ${t.mobileExtra}px;
  --waki-font-body: ${t.fontBody};
  --waki-font-display: ${t.fontDisplay};${modeVars("light", variant)}
}
html.dark {
${modeVars("dark", variant)}
}

body {
  background:
    ${t.bodyOverlay}
    radial-gradient(circle at 8% 10%, var(--waki-blob-1), transparent 32%),
    radial-gradient(circle at 92% 4%, var(--waki-blob-2), transparent 30%),
    radial-gradient(circle at 50% 110%, var(--waki-blob-3), transparent 45%),
    linear-gradient(135deg, var(--waki-bg-1) 0%, var(--waki-bg-2) 48%, var(--waki-bg-3) 100%);
  background-attachment: fixed;
  color: var(--waki-text);
  font-family: var(--waki-font-body);
}
html.dark body {
  color: var(--waki-text);
}
h1,
h2,
h3,
.theme-title {
  font-family: var(--waki-font-display);
}

.glass,
.glass-elevated,
.glass-bar,
.shell-main,
.mobile-card {
  position: relative;
}
.glass {
  background: var(--waki-panel);
  border: var(--waki-border-width) solid var(--waki-border);
  border-radius: var(--waki-radius);
  color: var(--waki-text);
  box-shadow: var(--waki-shadow-stack), var(--waki-inset-shadow);
  backdrop-filter: blur(var(--waki-blur)) saturate(var(--waki-glass-saturation));
  -webkit-backdrop-filter: blur(var(--waki-blur)) saturate(var(--waki-glass-saturation));
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease;
}
.glass:hover {
  transform: translateY(var(--waki-hover-y));
  border-color: var(--waki-border-2);
}
.glass-elevated {
  background: linear-gradient(145deg, var(--waki-panel-2), var(--waki-panel-3));
  border: var(--waki-border-width) solid var(--waki-border-2);
  border-radius: var(--waki-radius-lg);
  color: var(--waki-text);
  box-shadow: var(--waki-elevated-shadow-stack);
  backdrop-filter: blur(calc(var(--waki-blur) + 4px)) saturate(var(--waki-elevated-saturation));
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) + 4px)) saturate(var(--waki-elevated-saturation));
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}
.glass-elevated:hover {
  transform: translateY(var(--waki-elevated-hover-y));
}
.glass-bar {
  background: var(--waki-bar);
  border: var(--waki-border-width) solid var(--waki-border);
  border-radius: var(--waki-radius);
  color: var(--waki-text);
  box-shadow: 0 16px 40px var(--waki-shadow);
  backdrop-filter: blur(calc(var(--waki-blur) + 2px)) saturate(var(--waki-glass-saturation));
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) + 2px)) saturate(var(--waki-glass-saturation));
}
.panel-nested {
  background: color-mix(in srgb, var(--waki-panel-3) 78%, transparent);
  border: var(--waki-border-width) solid color-mix(in srgb, var(--waki-border-2) 78%, transparent);
  border-radius: var(--waki-radius-sm);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 12%, transparent), 0 8px 20px color-mix(in srgb, var(--waki-shadow) 48%, transparent);
}

.chip,
.status-success,
.status-warning,
.status-error,
.status-info {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  padding: 0.22rem 0.62rem;
  font-size: 0.72rem;
  font-weight: 750;
  line-height: 1;
}
.chip {
  background: color-mix(in srgb, var(--waki-accent) 13%, transparent);
  border: 1px solid color-mix(in srgb, var(--waki-accent) 36%, transparent);
  color: var(--waki-accent);
}
.chip:hover {
  background: color-mix(in srgb, var(--waki-accent) 20%, transparent);
}
.divider-soft {
  border-color: var(--waki-border);
}

.btn-primary,
.btn-secondary,
.btn-warning,
.btn-danger,
.btn-ghost,
.btn-success {
  border-radius: var(--waki-button-radius);
  padding: var(--waki-density);
  font: inherit;
  font-size: 0.86rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}
.btn-primary {
  background: linear-gradient(135deg, var(--waki-accent), var(--waki-accent-2));
  color: #ffffff;
  border: 1px solid color-mix(in srgb, var(--waki-accent) 70%, white);
  box-shadow: 0 14px 32px color-mix(in srgb, var(--waki-accent) 36%, transparent);
}
.btn-primary:hover,
.btn-success:hover {
  transform: translateY(-1px);
  filter: brightness(1.06) saturate(1.05);
}
.btn-secondary {
  background: var(--waki-panel-2);
  color: var(--waki-text);
  border: 1px solid var(--waki-border-2);
}
.btn-secondary:hover,
.btn-ghost:hover {
  transform: translateY(-1px);
  border-color: var(--waki-accent);
  box-shadow: 0 10px 24px var(--waki-shadow);
}
.btn-ghost {
  background: transparent;
  color: var(--waki-text);
  border: 1px solid transparent;
}
.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff7ed;
  border: 1px solid rgba(217, 119, 6, 0.58);
  box-shadow: 0 12px 30px rgba(217, 119, 6, 0.26);
}
.btn-danger {
  background: linear-gradient(135deg, #f43f5e, #dc2626);
  color: #fff1f2;
  border: 1px solid rgba(220, 38, 38, 0.58);
  box-shadow: 0 12px 30px rgba(220, 38, 38, 0.26);
}
.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ecfdf5;
  border: 1px solid rgba(5, 150, 105, 0.58);
  box-shadow: 0 12px 30px rgba(5, 150, 105, 0.24);
}

.status-success {
  background: rgba(16, 185, 129, 0.14);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.34);
}
html.dark .status-success {
  color: #6ee7b7;
}
.status-warning {
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.34);
}
html.dark .status-warning {
  color: #fcd34d;
}
.status-error {
  background: rgba(244, 63, 94, 0.14);
  color: #be123c;
  border: 1px solid rgba(244, 63, 94, 0.34);
}
html.dark .status-error {
  color: #fda4af;
}
.status-info {
  background: color-mix(in srgb, var(--waki-accent-2) 14%, transparent);
  color: var(--waki-accent-2);
  border: 1px solid color-mix(in srgb, var(--waki-accent-2) 38%, transparent);
}

.input {
  background: var(--waki-panel-2);
  color: var(--waki-text);
  border: 1px solid var(--waki-border);
  border-radius: var(--waki-radius-sm);
  padding: 0.58rem 0.72rem;
  font: inherit;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}
.input:focus {
  border-color: var(--waki-accent);
  box-shadow: 0 0 0 4px var(--waki-focus);
}
.input::placeholder {
  color: var(--waki-muted);
}

.shell-sidebar {
  background: color-mix(in srgb, var(--waki-panel-2) var(--waki-sidebar-blend), transparent);
  border-right: 1px solid var(--waki-border);
  backdrop-filter: blur(calc(var(--waki-blur) + 2px)) saturate(var(--waki-glass-saturation));
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) + 2px)) saturate(var(--waki-glass-saturation));
}
.shell-main {
  background: color-mix(in srgb, var(--waki-panel) var(--waki-main-blend), transparent);
  border: 1px solid var(--waki-border);
  border-radius: var(--waki-radius-lg);
  box-shadow: 0 22px 68px var(--waki-shadow);
}
.nav-item {
  color: var(--waki-muted);
  border-radius: var(--waki-radius-sm);
  transition: color 160ms ease, background-color 160ms ease, transform 160ms ease;
}
.nav-item:hover,
.nav-item.active {
  color: var(--waki-text);
  background: color-mix(in srgb, var(--waki-accent) 14%, transparent);
  transform: translateX(var(--waki-nav-shift));
}
.mobile-card {
  background: linear-gradient(145deg, var(--waki-panel-2), var(--waki-panel-3));
  border: 1px solid var(--waki-border-2);
  border-radius: calc(var(--waki-radius-lg) + var(--waki-mobile-extra-radius));
  box-shadow: 0 24px 70px var(--waki-shadow);
}
.theme-switcher {
  background: var(--waki-panel-2);
  border: 1px solid var(--waki-border-2);
  border-radius: 999px;
  box-shadow: 0 18px 42px var(--waki-shadow);
  backdrop-filter: blur(var(--waki-blur)) saturate(var(--waki-glass-saturation));
  -webkit-backdrop-filter: blur(var(--waki-blur)) saturate(var(--waki-glass-saturation));
}
.theme-swatch {
  background: linear-gradient(135deg, var(--waki-bg-1), var(--waki-accent), var(--waki-accent-2));
}
.theme-switcher .active {
  background: linear-gradient(135deg, var(--waki-accent), var(--waki-accent-2));
  color: #ffffff;
}

.waki-dialog-surface,
.waki-popover-surface,
.waki-overlay-surface,
:where([role="dialog"].surface-1, [role="menu"], [role="listbox"], [role="tooltip"], .popover, .dropdown-menu, .menu-panel),
:where([role="dialog"]) > :where(.glass, .glass-bar, .glass-elevated) {
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--waki-accent) 5%, transparent), transparent 36%),
    radial-gradient(circle at 94% 12%, color-mix(in srgb, var(--waki-accent-2) 4%, transparent), transparent 40%),
    linear-gradient(145deg, color-mix(in srgb, white 10%, transparent), transparent 34%),
    linear-gradient(145deg, var(--waki-overlay-panel), var(--waki-overlay-panel-strong)) !important;
  background-clip: padding-box;
  border: var(--waki-border-width) solid var(--waki-overlay-border) !important;
  color: var(--waki-text);
  box-shadow: var(--waki-overlay-shadow), inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(255,255,255,.08) !important;
  backdrop-filter: blur(calc(var(--waki-blur) + 8px)) saturate(150%) contrast(1.03) !important;
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) + 8px)) saturate(150%) contrast(1.03) !important;
}
html.dark .waki-dialog-surface,
html.dark .waki-popover-surface,
html.dark .waki-overlay-surface,
html.dark :where([role="dialog"].surface-1, [role="menu"], [role="listbox"], [role="tooltip"], .popover, .dropdown-menu, .menu-panel),
html.dark :where([role="dialog"]) > :where(.glass, .glass-bar, .glass-elevated) {
  box-shadow: var(--waki-overlay-shadow), inset 0 1px 0 rgba(255,255,255,.16), inset 0 -1px 0 rgba(255,255,255,.04) !important;
}
.waki-overlay-backdrop {
  background: var(--waki-overlay-backdrop) !important;
  backdrop-filter: blur(calc(var(--waki-blur) * .7)) saturate(150%) !important;
  -webkit-backdrop-filter: blur(calc(var(--waki-blur) * .7)) saturate(150%) !important;
}

${t.extraCss}

@media (max-width: 760px) {
  .shell-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--waki-border);
  }
  .shell-main {
    border-radius: var(--waki-radius);
  }
}
`;
}

function familyModuleSource() {
  const families = {};
  for (const family of Object.values(materials)) {
    families[family.id] = {
      name: family.name,
      description: family.description,
      structure: family.structure,
      variants: family.variants.map((variant) => ({
        slot: variant.slot,
        themeId: themeId(family, variant),
        name: variant.name,
        description: variant.description,
        palette: {
          light: paletteHints(variant.modes.light),
          dark: paletteHints(variant.modes.dark),
        },
      })),
    };
  }

  return `// ============================================================================
// waki-themes / families.mjs
// ----------------------------------------------------------------------------
// Generated by scripts/gen-v2-themes.mjs.
// Material families define structure. Variants define hue/colorway.
// ============================================================================

export const FAMILIES = ${JSON.stringify(families, null, 2)};

export const VARIANT_BY_THEME_ID = (() => {
  const out = {};
  for (const [familyId, family] of Object.entries(FAMILIES)) {
    for (const variant of family.variants) {
      out[variant.themeId] = {
        familyId,
        familyName: family.name,
        slot: variant.slot,
        variantName: variant.name,
      };
    }
  }
  return out;
})();
`;
}

function paletteHints(p) {
  return {
    bgFrom: p.bg1,
    bgTo: p.bg2,
    panel: p.panel,
    border: p.border,
    text: p.text,
    accent: p.accent,
  };
}

mkdirSync(stylesDir, { recursive: true });
for (const family of Object.values(materials)) {
  for (const variant of family.variants) {
    const id = themeId(family, variant);
    writeFileSync(resolve(stylesDir, `${id}.css`), cssForTheme(family, variant));
    console.log(`[gen-catalog] styles/${id}.css`);
  }
}
writeFileSync(familiesFile, familyModuleSource());
console.log(`[ok] generated ${Object.values(materials).reduce((sum, family) => sum + family.variants.length, 0)} themes across ${Object.keys(materials).length} families`);
