#!/usr/bin/env node
/**
 * Generate the Waki theme catalog: the five Waki family themes (waki-themes 2.0).
 *
 * The materials below are kept only as the structure (geometry, blur, shadows, extra CSS) the
 * family themes borrow: system/mac, professional/boardroom, desktop/graphite, glass/civic and
 * studio/cobalt. Colours come from family/family-themes.mjs. The catalog's other themes were
 * retired; their ids are served as aliases of a family theme (RETIRED_IDS).
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
import { FAMILY } from "../src/themes/family.mjs";

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
      colorway("civic", "Civic", "Cobalt and amber glass for operational dashboards.", {
        light: palette("#eef4ff", "#fff8ea", "#f8fbff", "#2563eb", "#d97706", "#12213d", "#56667c", "rgba(255,255,255,.68)", "rgba(255,255,255,.84)", "rgba(238,244,255,.76)", "rgba(37,99,235,.22)", "rgba(251,191,36,.28)", "rgba(30,64,175,.16)", "rgba(37,99,235,.2)", "rgba(251,191,36,.18)", "rgba(14,165,233,.12)"),
        dark: palette("#061329", "#24180a", "#071b2b", "#60a5fa", "#fbbf24", "#edf4ff", "#b6c4d9", "rgba(37,99,235,.14)", "rgba(10,27,57,.78)", "rgba(33,25,13,.74)", "rgba(251,191,36,.26)", "rgba(96,165,250,.24)", "rgba(0,0,0,.45)", "rgba(96,165,250,.26)", "rgba(251,191,36,.22)", "rgba(14,165,233,.18)"),
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
  --waki-bar: ${p.bar ?? p.panel2};
  --waki-border: ${p.border};
  --waki-border-2: ${p.border2};
  --waki-text: ${p.text};
  --waki-muted: ${p.muted};
  --waki-accent: ${p.accent};
  --waki-accent-2: ${p.accent2};
  --waki-focus: ${p.focus ?? `color-mix(in srgb, ${p.accent} 24%, transparent)`};
  --waki-shadow: ${p.shadow};
  --waki-overlay-panel: color-mix(in srgb, ${p.panel2} 38%, ${overlaySolid});
  --waki-overlay-panel-strong: color-mix(in srgb, ${p.panel3} 30%, ${overlaySolidStrong});
  --waki-overlay-border: color-mix(in srgb, ${p.border2} 64%, ${overlayLine});
  --waki-overlay-backdrop: ${overlayBackdrop};
  --waki-overlay-shadow: ${overlayShadow};${extendedVars(p.extended)}`;
}

/** The family themes' extra roles (card header, slot, thumbnail, status colours…). */
function extendedVars(extended) {
  if (!extended) return "";
  return Object.entries(extended).map(([key, value]) => `\n  --waki-${key}: ${value};`).join("");
}

/** The Waki family: the five themes every Waki app offers (family/family-themes.mjs, resolved by
 *  gen-family.mjs). Each borrows the geometry, blur and shadows of the material and variant it came
 *  from, and paints with the family palette. */
function familyMaterial() {
  return {
    id: "family",
    name: "Waki Family",
    description: "The five themes every Waki app offers, the same in the Mac apps and the web apps.",
    structure: materials.professional.structure,
    tokens: materials.professional.tokens,
    variants: FAMILY.themes.map((theme) => {
      const material = materials[theme.structure.material];
      const source = material.variants.find((v) => v.slot === theme.structure.variant) ?? {};
      const extraCss = [material.tokens.extraCss, source.tokens?.extraCss].filter(Boolean).join("\n");
      const palette = (mode) => {
        const r = theme.roles[mode];
        const [blob1, blob2, blob3] = theme.blobs[mode];
        return {
          bg1: r["bg-1"], bg2: r["bg-2"], bg3: r["bg-3"], accent: r.accent, accent2: r["accent-2"], text: r.text, muted: r.muted,
          panel: r.panel, panel2: r["panel-2"], panel3: r["panel-3"], border: r.border, border2: r["border-2"], shadow: r.shadow,
          bar: r.bar, focus: r.focus, blob1, blob2, blob3, extended: theme.extended[mode],
        };
      };
      return {
        slot: theme.id,
        name: theme.name,
        description: theme.description,
        modes: { light: palette("light"), dark: palette("dark") },
        tokens: { ...material.tokens, ...(source.tokens ?? {}), extraCss },
      };
    }),
  };
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
  for (const family of [familyMaterial()]) {
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
for (const family of [familyMaterial()]) {
  for (const variant of family.variants) {
    const id = themeId(family, variant);
    writeFileSync(resolve(stylesDir, `${id}.css`), cssForTheme(family, variant));
    console.log(`[gen-catalog] styles/${id}.css`);
  }
}
writeFileSync(familiesFile, familyModuleSource());
console.log(`[ok] generated the ${FAMILY.themes.length} Waki family themes`);
