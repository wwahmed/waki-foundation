#!/usr/bin/env node
/**
 * Lightweight integrity test for dist/themes.json. Runs after the
 * bundle is built and asserts the invariants consumers depend on:
 *
 *  - schemaVersion is a number
 *  - pkgVersion is a non-empty string
 *  - base CSS is non-empty
 *  - every theme has the SCHEMA-required selectors in its CSS
 *  - every theme's family/familyName/variantSlot/variantName fields
 *    cross-resolve via the families map
 *  - every family.variants[].themeId is a valid key in themes
 *  - the themes flat map and the families variants set are equal
 *
 * Exit non-zero on any failure with a clear error.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { REQUIRED_SELECTORS, REQUIRED_ROOT_PATTERNS } from "../src/schema.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const bundle = JSON.parse(
  readFileSync(resolve(repoRoot, "dist", "themes.json"), "utf8"),
);

const errors = [];
function assert(cond, msg) {
  if (!cond) errors.push(msg);
}

assert(typeof bundle.schemaVersion === "number", "schemaVersion not a number");
assert(typeof bundle.pkgVersion === "string" && bundle.pkgVersion.length > 0, "pkgVersion missing");
assert(typeof bundle.base === "string" && bundle.base.length > 0, "base CSS missing");
assert(bundle.themes && typeof bundle.themes === "object", "themes map missing");
assert(bundle.families && typeof bundle.families === "object", "families map missing");

const themesIds = new Set(Object.keys(bundle.themes ?? {}));
const variantThemeIds = new Set();

for (const [familyId, family] of Object.entries(bundle.families ?? {})) {
  assert(typeof family.name === "string", `family ${familyId} missing name`);
  assert(family.structure, `family ${familyId} missing structure`);
  assert(Array.isArray(family.variants), `family ${familyId} variants not an array`);
  for (const v of family.variants) {
    assert(typeof v.themeId === "string", `family ${familyId} variant missing themeId`);
    assert(themesIds.has(v.themeId), `family ${familyId} variant ${v.themeId} not in themes map`);
    variantThemeIds.add(v.themeId);
  }
}

for (const id of themesIds) {
  const aliasOf = bundle.themes[id].aliasOf;
  if (aliasOf) {
    // A retired id served as a family theme (waki-themes 2.0).
    assert(variantThemeIds.has(aliasOf), `alias ${id} points at ${aliasOf}, which no family lists`);
    continue;
  }
  assert(variantThemeIds.has(id), `theme ${id} is in themes map but no family lists it`);
}
assert(Array.isArray(bundle.family?.themes) && bundle.family.themes.length === 5, "the bundle lists the five family themes");
for (const t of bundle.family?.themes ?? []) assert(themesIds.has(t.id), `family theme ${t.id} not in themes map`);

for (const [id, t] of Object.entries(bundle.themes ?? {})) {
  assert(typeof t.css === "string" && t.css.length > 0, `theme ${id} has empty css`);
  for (const selector of REQUIRED_SELECTORS) {
    assert(
      t.css.includes(selector),
      `theme ${id} missing required selector ${selector}`,
    );
  }
  for (const rule of REQUIRED_ROOT_PATTERNS) {
    assert(rule.test(t.css), `theme ${id} missing required root pattern (${rule.name})`);
  }
  assert(typeof t.family === "string", `theme ${id} missing family field`);
  assert(typeof t.variantSlot === "string", `theme ${id} missing variantSlot field`);
}

if (errors.length > 0) {
  console.error(`[test-bundle] FAILED: ${errors.length} integrity violation(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `[test-bundle] OK: ${themesIds.size} themes, ${
    Object.keys(bundle.families).length
  } families, all invariants hold`,
);
