#!/usr/bin/env node
/**
 * Build dist/themes.json: a versioned bundle of every theme CSS in
 * styles/, plus a manifest of theme metadata. Consuming apps fetch
 * this URL on boot:
 *
 *   https://raw.githubusercontent.com/wwahmed/waki-themes/main/dist/themes.json
 *
 * Cache it locally, refresh periodically (default 6h), and apply the
 * latest version. The shape mirrors what frontend/src/lib/themeLoader
 * expects so consumers can map id -> css directly.
 *
 * Run:    node scripts/build-bundle.mjs
 * Output: dist/themes.json
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FAMILIES, VARIANT_BY_THEME_ID } from "../src/themes/families.mjs";
import { FAMILY } from "../src/themes/family.mjs";
import { RETIRED_IDS } from "../family/family-themes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// Schema validation must pass before we emit a bundle. A failing
// validator throws and the build aborts with a non-zero exit code.
console.log("[build-bundle] running schema validation...");
execFileSync("node", [resolve(__dirname, "validate-themes.mjs")], {
  cwd: repoRoot,
  stdio: "inherit",
});

function gitSha() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

function pkgVersion() {
  try {
    const pkg = JSON.parse(readFileSync(resolve(repoRoot, "package.json"), "utf8"));
    return typeof pkg.version === "string" ? pkg.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}

// id -> { name, description, vibe }. Derived from FAMILIES so the META
// table can't drift out of sync with the family registry. `vibe` is the
// familyId for built-in themes.
//
// To add a new theme, add it to src/themes/families.mjs and the META
// table is regenerated automatically.
const META = {};
for (const [familyId, family] of Object.entries(FAMILIES)) {
  for (const variant of family.variants) {
    META[variant.themeId] = {
      name: `${family.name} ${variant.name}`,
      description: variant.description,
      vibe: familyId,
    };
  }
}

const stylesDir = resolve(repoRoot, "styles");
const baseCss = readFileSync(resolve(stylesDir, "base.css"), "utf8");

const themes = {};
for (const id of Object.keys(META)) {
  const filePath = resolve(stylesDir, `${id}.css`);
  try {
    const variantInfo = VARIANT_BY_THEME_ID[id];
    themes[id] = {
      ...META[id],
      css: readFileSync(filePath, "utf8"),
      // Each flat theme entry now carries family/variant cross-references
      // alongside its existing fields. Field set is additive: existing
      // consumers that read `name` / `description` / `vibe` / `css` keep
      // working; new consumers can read `family` / `variantSlot` to render
      // the grouped picker.
      family: variantInfo ? variantInfo.familyId : null,
      familyName: variantInfo ? variantInfo.familyName : null,
      variantSlot: variantInfo ? variantInfo.slot : null,
      variantName: variantInfo ? variantInfo.variantName : null,
    };
  } catch (err) {
    console.warn(`[skip] ${id}: ${err.message}`);
  }
}

// Build the grouped shape: families[familyId] -> { name, description,
// structure, variants: [...] }. Each variant references its flat themeId so
// the studio + future consumers can resolve a variant to its CSS without
// duplicating it in this section.
// Retired catalog ids answer with the family theme they map onto (same CSS, `aliasOf` set), so an
// app that still asks for one gets a family look. They are in no family, so pickers built from
// `families` or `family` never list them.
for (const [retiredId, familyId] of Object.entries(RETIRED_IDS)) {
  const target = `waki-family-${familyId}`;
  if (themes[target]) themes[retiredId] = { ...themes[target], aliasOf: target };
}

const families = {};
for (const [familyId, family] of Object.entries(FAMILIES)) {
  const variants = family.variants
    .filter((v) => themes[v.themeId])
    .map((v) => ({
      slot: v.slot,
      themeId: v.themeId,
      name: v.name,
      description: v.description,
      palette: v.palette,
    }));
  if (!variants.length) continue;
  families[familyId] = {
    name: family.name,
    description: family.description,
    structure: family.structure,
    variants,
  };
}

// schemaVersion stays 1 because the existing fields are unchanged. Any
// consumer can detect the new grouping by checking for the presence of
// `families` in the bundle. pkgVersion in package.json bumps on each
// schema-additive change so cache-aware consumers can refresh when the
// new fields land.
const bundle = {
  schemaVersion: 1,
  pkgVersion: pkgVersion(),
  gitSha: gitSha(),
  builtAt: new Date().toISOString(),
  base: baseCss,
  themes,
  families,
  // The five themes every Waki app offers, in order. Web apps list these instead of the whole
  // catalog; `nativeId` is WakiKit's id for the same theme. Full roles, scales and extended roles
  // are in dist/family.json.
  family: {
    defaultId: FAMILY.defaultId,
    themes: FAMILY.themes.map((t) => ({
      id: t.webId,
      nativeId: t.id,
      name: t.name,
      description: t.description,
      // Older ids (exact) and words (matched inside an id) that map onto this theme.
      migratesFrom: t.migratesFrom,
    })),
  },
};

const out = resolve(repoRoot, "dist", "themes.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(bundle, null, 2));
console.log(
  `[ok] wrote ${out} (${Object.keys(themes).length} themes across ${Object.keys(families).length} families, ${(JSON.stringify(bundle).length / 1024).toFixed(1)} KB)`,
);

// Integrity test on the freshly written bundle. A failure here means
// the catalog or CSS contract drifted; aborts the build so a broken
// bundle doesn't ship.
console.log("[build-bundle] running bundle integrity test...");
execFileSync("node", [resolve(__dirname, "test-bundle.mjs")], {
  cwd: repoRoot,
  stdio: "inherit",
});
