import type { OverrideTokens } from "./types";

// Serialise the studio's override tokens into a CSS layer that the
// preview iframe loads after the base theme. This is the layer that
// makes the editor sliders feel live: every slider tweak is just a
// new copy of this string injected into the iframe.
//
// The override block targets the same class contract every theme
// honours (.glass, .glass-elevated, .glass-bar, .chip, .divider-soft)
// plus body. It uses `!important` rarely; instead it relies on
// stylesheet ordering so it lands after the base CSS.
export function buildOverrideCss(o: OverrideTokens): string {
  return `
/* studio overrides */
body {
  background: linear-gradient(135deg, ${o.bgFromLight} 0%, ${o.bgToLight} 100%) !important;
  background-attachment: fixed !important;
  color: ${o.textLight} !important;
}
html.dark body {
  background: linear-gradient(135deg, ${o.bgFromDark} 0%, ${o.bgToDark} 100%) !important;
  color: ${o.textDark} !important;
}

.glass,
.glass-elevated,
.glass-bar {
  background: ${o.panelLight} !important;
  border-color: ${o.borderLight} !important;
  border-radius: ${o.radiusPx}px !important;
  backdrop-filter: blur(${o.blurPx}px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(${o.blurPx}px) saturate(180%) !important;
}
html.dark .glass,
html.dark .glass-elevated,
html.dark .glass-bar {
  background: ${o.panelDark} !important;
  border-color: ${o.borderDark} !important;
}

.waki-dialog-surface,
.waki-popover-surface,
.waki-overlay-surface,
:where([role="dialog"].surface-1, [role="menu"], [role="listbox"], [role="tooltip"], .popover, .dropdown-menu, .menu-panel),
:where([role="dialog"]) > :where(.glass, .glass-bar, .glass-elevated) {
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, ${o.accent} 5%, transparent), transparent 36%),
    radial-gradient(circle at 94% 12%, color-mix(in srgb, ${o.accent} 4%, transparent), transparent 40%),
    linear-gradient(145deg, rgba(255,255,255,.1), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, ${o.panelLight} 38%, rgba(255,255,255,.96)), color-mix(in srgb, ${o.panelLight} 30%, rgba(255,255,255,.985))) !important;
  background-clip: padding-box !important;
  border-color: color-mix(in srgb, ${o.borderLight} 62%, rgba(15,23,42,.16)) !important;
  color: ${o.textLight} !important;
  box-shadow: 0 28px 76px rgba(15,23,42,.22), inset 0 1px 0 rgba(255,255,255,.28) !important;
  backdrop-filter: blur(${o.blurPx + 8}px) saturate(150%) contrast(1.03) !important;
  -webkit-backdrop-filter: blur(${o.blurPx + 8}px) saturate(150%) contrast(1.03) !important;
}
html.dark .waki-dialog-surface,
html.dark .waki-popover-surface,
html.dark .waki-overlay-surface,
html.dark :where([role="dialog"].surface-1, [role="menu"], [role="listbox"], [role="tooltip"], .popover, .dropdown-menu, .menu-panel),
html.dark :where([role="dialog"]) > :where(.glass, .glass-bar, .glass-elevated) {
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, ${o.accent} 6%, transparent), transparent 36%),
    radial-gradient(circle at 94% 12%, color-mix(in srgb, ${o.textDark} 4%, transparent), transparent 40%),
    linear-gradient(145deg, rgba(255,255,255,.06), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, ${o.panelDark} 38%, rgba(8,13,28,.93)), color-mix(in srgb, ${o.panelDark} 30%, rgba(15,23,42,.97))) !important;
  border-color: color-mix(in srgb, ${o.borderDark} 64%, rgba(255,255,255,.28)) !important;
  color: ${o.textDark} !important;
  box-shadow: 0 34px 90px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.16) !important;
}
.waki-overlay-backdrop {
  background: rgba(15,23,42,.34) !important;
  backdrop-filter: blur(${Math.max(8, Math.round(o.blurPx * 0.7))}px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(${Math.max(8, Math.round(o.blurPx * 0.7))}px) saturate(150%) !important;
}
html.dark .waki-overlay-backdrop {
  background: rgba(2,6,23,.58) !important;
}

.chip {
  background: ${withAlpha(o.accent, 0.12)} !important;
  border-color: ${withAlpha(o.accent, 0.32)} !important;
  color: ${o.accent} !important;
  border-radius: 9999px !important;
}
html.dark .chip {
  background: ${withAlpha(o.accent, 0.18)} !important;
  border-color: ${withAlpha(o.accent, 0.36)} !important;
  color: ${o.textDark} !important;
}

.divider-soft {
  border-color: ${o.borderLight} !important;
}
html.dark .divider-soft {
  border-color: ${o.borderDark} !important;
}

.studio-accent-button {
  background: ${o.accent} !important;
  color: white !important;
  border-radius: ${Math.max(4, o.radiusPx - 4)}px !important;
}
.studio-accent-fg {
  color: ${o.accent} !important;
}
.studio-accent-bg {
  background: ${o.accent} !important;
}
`.trim();
}

// Robust hex / rgb / rgba parser that returns an "rgba(r, g, b, a)"
// string with the requested alpha. Any unparseable input falls back
// to the original colour so the user sees something rather than a
// silent CSS failure.
export function withAlpha(color: string, alpha: number): string {
  const c = color.trim();
  // Hex with optional alpha.
  const hexMatch = /^#([0-9a-fA-F]{3,8})$/.exec(c);
  if (hexMatch) {
    const h = hexMatch[1];
    let r = 0, g = 0, b = 0;
    if (h.length === 3 || h.length === 4) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else if (h.length === 6 || h.length === 8) {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // rgb()/rgba() form.
  const rgbMatch = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/.exec(c);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  }
  return c;
}

// Build a complete standalone CSS file representing a user-saved
// theme. Used both for "Save as new theme" and "Export CSS".
export function buildStandaloneThemeCss(o: OverrideTokens, name: string): string {
  return `/* ============================================================================
 * waki-themes / generated theme
 * ----------------------------------------------------------------------------
 * Authored in Theme Studio. Implements the .glass / .glass-elevated /
 * .glass-bar / .chip / .divider-soft contract every consumer expects.
 *
 * Theme name: ${name}
 * Generated:  ${new Date().toISOString()}
 * ============================================================================ */

body {
  background: linear-gradient(135deg, ${o.bgFromLight} 0%, ${o.bgToLight} 100%);
  background-attachment: fixed;
  color: ${o.textLight};
}
html.dark body {
  background: linear-gradient(135deg, ${o.bgFromDark} 0%, ${o.bgToDark} 100%);
  color: ${o.textDark};
}

.glass {
  background: ${o.panelLight};
  border: 1px solid ${o.borderLight};
  border-radius: ${o.radiusPx}px;
  backdrop-filter: blur(${o.blurPx}px) saturate(180%);
  -webkit-backdrop-filter: blur(${o.blurPx}px) saturate(180%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  transition: background-color 200ms ease-out, box-shadow 200ms ease-out;
}
html.dark .glass {
  background: ${o.panelDark};
  border-color: ${o.borderDark};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-elevated {
  background: ${o.panelLight};
  border: 1px solid ${o.borderLight};
  border-radius: ${o.radiusPx}px;
  backdrop-filter: blur(${o.blurPx + 4}px) saturate(200%);
  -webkit-backdrop-filter: blur(${o.blurPx + 4}px) saturate(200%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}
html.dark .glass-elevated {
  background: ${o.panelDark};
  border-color: ${o.borderDark};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.36);
}

.waki-dialog-surface,
.waki-popover-surface,
.waki-overlay-surface,
:where([role="dialog"].surface-1, [role="menu"], [role="listbox"], [role="tooltip"], .popover, .dropdown-menu, .menu-panel),
:where([role="dialog"]) > :where(.glass, .glass-bar, .glass-elevated) {
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, ${o.accent} 5%, transparent), transparent 36%),
    radial-gradient(circle at 94% 12%, color-mix(in srgb, ${o.accent} 4%, transparent), transparent 40%),
    linear-gradient(145deg, rgba(255,255,255,.1), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, ${o.panelLight} 38%, rgba(255,255,255,.96)), color-mix(in srgb, ${o.panelLight} 30%, rgba(255,255,255,.985)));
  background-clip: padding-box;
  border: 1px solid color-mix(in srgb, ${o.borderLight} 62%, rgba(15,23,42,.16));
  color: ${o.textLight};
  box-shadow: 0 28px 76px rgba(15,23,42,.22), inset 0 1px 0 rgba(255,255,255,.28);
  backdrop-filter: blur(${o.blurPx + 8}px) saturate(150%) contrast(1.03);
  -webkit-backdrop-filter: blur(${o.blurPx + 8}px) saturate(150%) contrast(1.03);
}
html.dark .waki-dialog-surface,
html.dark .waki-popover-surface,
html.dark .waki-overlay-surface,
html.dark :where([role="dialog"].surface-1, [role="menu"], [role="listbox"], [role="tooltip"], .popover, .dropdown-menu, .menu-panel),
html.dark :where([role="dialog"]) > :where(.glass, .glass-bar, .glass-elevated) {
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, ${o.accent} 6%, transparent), transparent 36%),
    radial-gradient(circle at 94% 12%, color-mix(in srgb, ${o.textDark} 4%, transparent), transparent 40%),
    linear-gradient(145deg, rgba(255,255,255,.06), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, ${o.panelDark} 38%, rgba(8,13,28,.93)), color-mix(in srgb, ${o.panelDark} 30%, rgba(15,23,42,.97)));
  border-color: color-mix(in srgb, ${o.borderDark} 64%, rgba(255,255,255,.28));
  color: ${o.textDark};
  box-shadow: 0 34px 90px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.16);
}
.waki-overlay-backdrop {
  background: rgba(15,23,42,.34);
  backdrop-filter: blur(${Math.max(8, Math.round(o.blurPx * 0.7))}px) saturate(150%);
  -webkit-backdrop-filter: blur(${Math.max(8, Math.round(o.blurPx * 0.7))}px) saturate(150%);
}
html.dark .waki-overlay-backdrop {
  background: rgba(2,6,23,.58);
}

.glass-bar {
  background: ${o.panelLight};
  backdrop-filter: blur(${o.blurPx + 6}px) saturate(180%);
  -webkit-backdrop-filter: blur(${o.blurPx + 6}px) saturate(180%);
  border-bottom: 1px solid ${o.borderLight};
}
html.dark .glass-bar {
  background: ${o.panelDark};
  border-bottom-color: ${o.borderDark};
}

.chip {
  background: ${withAlpha(o.accent, 0.12)};
  border: 1px solid ${withAlpha(o.accent, 0.32)};
  color: ${o.accent};
  border-radius: 9999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.7rem;
  font-weight: 600;
}
html.dark .chip {
  background: ${withAlpha(o.accent, 0.18)};
  border-color: ${withAlpha(o.accent, 0.36)};
  color: ${o.textDark};
}

.divider-soft {
  border-color: ${o.borderLight};
}
html.dark .divider-soft {
  border-color: ${o.borderDark};
}
`;
}
