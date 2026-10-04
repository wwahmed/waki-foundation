#!/usr/bin/env node
/**
 * Resolve family/family-themes.mjs into everything the apps read, and check it.
 *
 *   dist/family.json        the five themes: roles, extended roles, scales, web ids, migrations.
 *                           WakiKit (tools/import_family_themes.py) and apps read this.
 *   src/themes/family.mjs   the same data for gen-v2-themes.mjs, which writes styles/waki-family-*.css.
 *
 * Every theme is held, in both modes, to WOV's contrast bar on its scales (body text 7:1, muted,
 * links and buttons 4.5:1, focus rings 3:1) and to the same bar on its named roles, with
 * translucent colours composited over the canvas first. Any failure stops the build.
 *
 * Run: npm run gen:family
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FAMILY_THEMES, MIGRATIONS, REFERENCE, WOV_MIGRATION } from "../family/family-themes.mjs";
import * as C from "./lib/color.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const ROLE_KEYS = ["bg-1", "bg-2", "bg-3", "panel", "panel-2", "panel-3", "bar", "border", "border-2", "text", "muted", "accent", "accent-2", "focus", "shadow"];
export const EXTENDED_KEYS = ["panel-head", "slot", "thumb", "text-2", "dim", "accent-text", "on-accent", "success", "warning", "warning-text", "danger", "info", "progress"];

const P = C.parse;
const hexOf = (css, backdrop) => C.hex(C.over(P(css), backdrop));
const rgba = (hex, a) => { const c = P(hex); return `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${a})`; };
const mixHex = (a, b, t) => C.hex(C.mixColors(P(a), P(b), t));

function resolveScales(spec) {
  const build = (s, ref) => (s.seed ? C.buildScale(s.seed, s.chroma, s.reference ?? ref) : s);
  return { neutral: build(spec.neutral, REFERENCE.neutral), accent: build(spec.accent, REFERENCE.accent) };
}

function inkOn(accent, darkInk) {
  return C.contrast(P("#ffffff"), P(accent)) >= C.contrast(P(darkInk), P(accent)) ? "#ffffff" : darkInk;
}

/** WOV's mapping from scales to named roles (packages/frontend/src/lib/themes.ts, themePalette). */
function rolesFromScales({ neutral: n, accent: a }, dark) {
  if (!dark) {
    return {
      "bg-1": n[50], "bg-2": n[100], "bg-3": "#ffffff", panel: "#ffffff", "panel-2": "#ffffff", "panel-3": n[100],
      bar: "#ffffff", border: n[200], "border-2": n[300], text: n[900], muted: n[500], accent: a[600], "accent-2": n[600],
      focus: rgba(a[500], 0.35), shadow: rgba(n[900], 0.1),
    };
  }
  return {
    "bg-1": n[950], "bg-2": mixHex(n[950], "#000000", 0.25), "bg-3": n[900], panel: n[900], "panel-2": n[800], "panel-3": n[950],
    bar: n[900], border: n[700], "border-2": n[600], text: n[100], muted: n[400], accent: a[400], "accent-2": n[300],
    focus: rgba(a[400], 0.4), shadow: "rgba(0, 0, 0, 0.45)",
  };
}

/** Opaque versions of the roles that matter for contrast: everything over the canvas. */
function opaque(roles, dark) {
  const canvas = C.over(P(roles["bg-1"]), P(dark ? "#000000" : "#ffffff"));
  const o = (k) => hexOf(roles[k], canvas);
  return { bg: C.hex(canvas), panel: o("panel"), panel2: o("panel-2"), text: o("text"), muted: o("muted"), accent: o("accent"), accent2: o("accent-2") };
}

/** Extended roles for a theme that does not write its own (all but Cobalt). */
function deriveExtended(roles, dark) {
  const o = opaque(roles, dark);
  let accentText = o.accent;
  for (let t = 0.1; C.contrast(P(accentText), P(o.panel)) < 4.5 && t <= 1; t += 0.1) accentText = mixHex(o.accent, o.text, t);
  return {
    "panel-head": dark ? mixHex(o.panel, o.text, 0.05) : mixHex(o.panel, o.accent, 0.1),
    slot: dark ? mixHex(o.panel, o.text, 0.07) : mixHex(o.bg, o.accent, 0.05),
    thumb: dark ? mixHex(o.bg, o.panel, 0.5) : mixHex(o.panel, o.accent, 0.14),
    "text-2": mixHex(o.text, o.muted, 0.45),
    dim: mixHex(o.muted, o.bg, 0.25),
    "accent-text": accentText,
    "on-accent": inkOn(o.accent, dark ? "#0b0b10" : o.text),
    success: dark ? "#6ee7b7" : "#047857",
    warning: dark ? "#fcd34d" : "#b45309",
    "warning-text": dark ? "#fcd34d" : "#b45309",
    danger: dark ? "#fda4af" : "#be123c",
    info: accentText,
    progress: `linear-gradient(90deg, ${o.accent}, ${o.accent2})`,
  };
}

function blobs(theme, roles, dark) {
  if (theme.blobs) return theme.blobs[dark ? "dark" : "light"];
  const o = opaque(roles, dark);
  return dark
    ? [rgba(o.accent, 0.16), rgba(o.accent2, 0.08), "rgba(0, 0, 0, 0)"]
    : [rgba(o.accent, 0.1), rgba(o.accent2, 0.06), "rgba(255, 255, 255, 0)"];
}

// ── Checks ──
function scalePairs({ neutral: n, accent: a }, light, dark) {
  const W = "#ffffff";
  return [
    ["light body n900 on white", n[900], W, 7], ["light body n900 on n50", n[900], n[50], 7],
    ["light body n700 on white", n[700], W, 7], ["light body n700 on n50", n[700], n[50], 7],
    ["light body n800 on n100", n[800], n[100], 7], ["light subtle n600 on white", n[600], W, 4.5],
    ["light muted n500 on white", n[500], W, 4.5], ["light muted n500 on n50", n[500], n[50], 4.5],
    ["light muted n500 on n100", n[500], n[100], 4.5], ["light button white on a600", W, a[600], 4.5],
    ["light button hover white on a700", W, a[700], 4.5], ["light icon tile white on a500", W, a[500], 3],
    ["light link a600 on white", a[600], W, 4.5], ["light link a600 on n100", a[600], n[100], 4.5],
    ["light tint a700 on a50", a[700], a[50], 4.5], ["light tint a700 on a100", a[700], a[100], 4.5],
    ["light focus a500 on white", a[500], W, 3],
    ["light scale text on bg-1", light.text, light["bg-1"], 7], ["light scale muted on panel", light.muted, light.panel, 4.5],
    ["light scale accent on panel", light.accent, light.panel, 4.5],
    ["light scale on-accent on accent", inkOn(light.accent, n[950]), light.accent, 4.5],
    ["dark body n100 on n900", n[100], n[900], 7], ["dark body n200 on n800", n[200], n[800], 7],
    ["dark body n200 on n950", n[200], n[950], 7], ["dark subtle n300 on n800", n[300], n[800], 4.5],
    ["dark muted n400 on n800", n[400], n[800], 4.5], ["dark muted n400 on n900", n[400], n[900], 4.5],
    ["dark muted n400 on n950", n[400], n[950], 4.5], ["dark link a400 on n800", a[400], n[800], 4.5],
    ["dark link a400 on n900", a[400], n[900], 4.5], ["dark tint a300 on a950", a[300], a[950], 4.5],
    ["dark tint a200 on a900", a[200], a[900], 4.5], ["dark button white on a600", W, a[600], 4.5],
    ["dark focus a500 on n900", a[500], n[900], 3],
    ["dark scale text on bg-1", dark.text, dark["bg-1"], 7], ["dark scale muted on panel", dark.muted, dark.panel, 4.5],
    ["dark scale muted on panel-2", dark.muted, dark["panel-2"], 4.5], ["dark scale accent on panel", dark.accent, dark.panel, 4.5],
    ["dark scale on-accent on accent", inkOn(dark.accent, n[950]), dark.accent, 4.5],
  ];
}

function rolePairs(mode, roles, ext) {
  const dark = mode === "dark";
  const o = opaque(roles, dark);
  return [
    [`${mode} text on canvas`, o.text, o.bg, 7], [`${mode} text on panel`, o.text, o.panel, 7],
    [`${mode} text on panel-2`, o.text, o.panel2, 4.5],
    [`${mode} muted on canvas`, o.muted, o.bg, 4.5], [`${mode} muted on panel`, o.muted, o.panel, 4.5],
    [`${mode} muted on panel-2`, o.muted, o.panel2, 4.5],
    [`${mode} accent on panel (icons, focus)`, o.accent, o.panel, 3],
    [`${mode} accent-text on panel`, ext["accent-text"], o.panel, 4.5],
    [`${mode} on-accent on accent`, ext["on-accent"], o.accent, 4.5],
    [`${mode} text-2 on panel`, ext["text-2"], o.panel, 4.5], [`${mode} dim on panel`, ext.dim, o.panel, 3],
    [`${mode} success on panel`, ext.success, o.panel, 4.5], [`${mode} warning-text on panel`, ext["warning-text"], o.panel, 4.5],
    [`${mode} danger on panel`, ext.danger, o.panel, 4.5], [`${mode} info on panel`, ext.info, o.panel, 4.5],
  ];
}

function monotonic(scale) {
  return C.STEPS.slice(1).every((s, i) => C.luminance(P(scale[s])) < C.luminance(P(scale[C.STEPS[i]])));
}

// ── Resolve ──
const failures = [];
const themes = FAMILY_THEMES.map((t) => {
  const scales = resolveScales(t.scales);
  const roles = t.roles === "fromScales" ? { light: rolesFromScales(scales, false), dark: rolesFromScales(scales, true) } : t.roles;
  for (const mode of ["light", "dark"]) {
    for (const k of ROLE_KEYS) if (!(k in roles[mode])) failures.push(`${t.id} ${mode} is missing role ${k}`);
  }
  const extended = t.extended ?? { light: deriveExtended(roles.light, false), dark: deriveExtended(roles.dark, true) };
  for (const [label, scale] of [["neutral", scales.neutral], ["accent", scales.accent]]) {
    if (!monotonic(scale)) failures.push(`${t.id} ${label} scale has a step that is not darker than the one before`);
  }
  const scaleRoles = { light: rolesFromScales(scales, false), dark: rolesFromScales(scales, true) };
  const pairs = [...scalePairs(scales, scaleRoles.light, scaleRoles.dark), ...rolePairs("light", roles.light, extended.light), ...rolePairs("dark", roles.dark, extended.dark)];
  for (const [label, fg, bg, min] of pairs) {
    const ratio = C.contrast(P(fg), P(bg));
    if (ratio >= min) continue;
    const line = `${t.id}: ${label} ${ratio.toFixed(2)} < ${min}`;
    if ((t.exceptions ?? []).includes(label)) console.warn(`[gen-family] accepted exception: ${line}`);
    else failures.push(line);
  }
  return {
    id: t.id,
    webId: `waki-family-${t.id}`,
    name: t.name,
    description: t.description,
    structure: t.structure,
    fonts: t.fonts ?? null,
    roles,
    extended,
    blobs: { light: blobs(t, roles.light, false), dark: blobs(t, roles.dark, true) },
    scales,
    migratesFrom: MIGRATIONS[t.id] ?? [],
  };
});

if (failures.length) {
  console.error(`[gen-family] ${failures.length} contrast or shape failure(s):\n  ${failures.join("\n  ")}`);
  process.exit(1);
}

const pkg = JSON.parse((await import("node:fs")).readFileSync(resolve(root, "package.json"), "utf8"));
const family = {
  schemaVersion: 1,
  pkgVersion: pkg.version,
  defaultId: "mac",
  roleKeys: ROLE_KEYS,
  extendedKeys: EXTENDED_KEYS,
  themes,
  wovMigration: WOV_MIGRATION,
};

mkdirSync(resolve(root, "dist"), { recursive: true });
writeFileSync(resolve(root, "dist", "family.json"), JSON.stringify(family, null, 2) + "\n");
writeFileSync(
  resolve(root, "src", "themes", "family.mjs"),
  `// Generated by scripts/gen-family.mjs from family/family-themes.mjs. Do not edit.\nexport const FAMILY = ${JSON.stringify(family, null, 2)};\n`,
);
console.log(`[gen-family] ${themes.length} family themes resolved; contrast bar met in light and dark`);
