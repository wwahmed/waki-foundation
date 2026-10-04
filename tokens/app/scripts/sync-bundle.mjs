#!/usr/bin/env node
/**
 * Mirror dist/themes.json from the repo root into app/public so Vite
 * serves it under /themes.json AND /dist/themes.json. The studio's
 * loader checks the same-origin URL first, then falls back to the
 * raw.githubusercontent.com source. Two URLs are written so the
 * Cloudflare-hosted build serves the bundle at both:
 *
 *   https://themes.3dbypixel.com/themes.json
 *   https://themes.3dbypixel.com/dist/themes.json
 *
 * which preserves the dist/themes.json contract for consumers that
 * have hard-coded the /dist/ path.
 *
 * Run automatically before `vite` and `vite build`.
 */
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, "..");
const repoRoot = resolve(appDir, "..");
const src = resolve(repoRoot, "dist", "themes.json");

if (!existsSync(src)) {
  console.warn(`[sync-bundle] dist/themes.json missing; running build-bundle.mjs first`);
  execFileSync("node", [resolve(repoRoot, "scripts", "build-bundle.mjs")], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

if (!existsSync(src)) {
  console.error("[sync-bundle] dist/themes.json still missing after build attempt; abort");
  process.exit(1);
}

const publicDir = resolve(appDir, "public");
const distSubDir = resolve(publicDir, "dist");
mkdirSync(distSubDir, { recursive: true });

const dest1 = resolve(publicDir, "themes.json");
const dest2 = resolve(distSubDir, "themes.json");
copyFileSync(src, dest1);
copyFileSync(src, dest2);

// Inject a tiny build-info.json next to the bundle so the studio can
// surface its own build sha alongside the bundle's.
const buildInfo = {
  studioBuiltAt: new Date().toISOString(),
  bundleSize: readFileSync(src).length,
};
writeFileSync(resolve(publicDir, "build-info.json"), JSON.stringify(buildInfo, null, 2));

console.log(`[sync-bundle] copied ${src} -> public/themes.json + public/dist/themes.json`);
