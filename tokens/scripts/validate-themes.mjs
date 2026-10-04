#!/usr/bin/env node
/**
 * Validate every theme CSS file against the schema in src/schema.mjs.
 *
 * Run as part of the build (`scripts/build-bundle.mjs` calls this
 * before emitting dist/themes.json) so a theme with missing tokens
 * cannot ship.
 *
 * Exit codes:
 *   0   all themes pass
 *   1   any theme is missing a required selector or root pattern
 *
 * Stand-alone:
 *   node scripts/validate-themes.mjs
 *
 * The validator uses a substring check on the file content. CSS comments
 * are stripped first so a comment that mentions ".btn-primary" doesn't
 * count as a real declaration. Composed selectors (e.g. ".glass:hover",
 * "html.dark .btn-primary") satisfy the requirement for the bare form
 * because the bare selector is a substring of the composed one.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { REQUIRED_SELECTORS, REQUIRED_ROOT_PATTERNS, RECOMMENDED_SELECTORS } from "../src/schema.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(__dirname, "..", "styles");

const SKIP = new Set(["base.css"]);

function stripComments(src) {
  // Strip /* ... */ block comments. CSS has no line comments.
  return src.replace(/\/\*[\s\S]*?\*\//g, "");
}

function validate(filename, src) {
  const stripped = stripComments(src);
  const missing = [];
  for (const selector of REQUIRED_SELECTORS) {
    if (!stripped.includes(selector)) missing.push(selector);
  }
  const missingRoot = [];
  for (const rule of REQUIRED_ROOT_PATTERNS) {
    if (!rule.test(stripped)) missingRoot.push(rule.name);
  }
  const missingRecommended = [];
  for (const selector of RECOMMENDED_SELECTORS) {
    if (!stripped.includes(selector)) missingRecommended.push(selector);
  }
  return { filename, missing, missingRoot, missingRecommended };
}

const files = readdirSync(stylesDir).filter(
  (f) => f.endsWith(".css") && !SKIP.has(f),
);

let failed = 0;
let warned = 0;
const reports = [];

for (const filename of files) {
  const src = readFileSync(resolve(stylesDir, filename), "utf8");
  const r = validate(filename, src);
  reports.push(r);
  if (r.missing.length || r.missingRoot.length) failed += 1;
  if (r.missingRecommended.length) warned += 1;
}

for (const r of reports) {
  if (r.missing.length || r.missingRoot.length) {
    console.error(`[FAIL] styles/${r.filename}`);
    if (r.missing.length) {
      console.error(`         missing required selectors: ${r.missing.join(", ")}`);
    }
    if (r.missingRoot.length) {
      console.error(`         missing required root patterns: ${r.missingRoot.join(", ")}`);
    }
    console.error(`         see SCHEMA.md for the full contract`);
  } else if (r.missingRecommended.length) {
    console.warn(
      `[warn] styles/${r.filename} missing recommended: ${r.missingRecommended.join(", ")}`,
    );
  }
}

if (failed > 0) {
  console.error(
    `\n[validate-themes] FAILED: ${failed} theme(s) missing required tokens. Fix or remove the failing themes before building.`,
  );
  process.exit(1);
}

console.log(
  `[validate-themes] OK: ${files.length} theme(s) cover the required schema${
    warned ? ` (${warned} with recommended-token gaps; warnings logged)` : ""
  }`,
);
