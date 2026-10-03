#!/usr/bin/env node
/**
 * Repackages dist/themes.json for the Foundation CDN at
 * cdn.wakilabs.dev/waki-themes/.
 *
 * Two output trees:
 *
 *   1. Local: `dist/cdn/waki-themes/`. Self-contained, used by anyone
 *      who deploys waki-themes' own repo as a Cloudflare Pages site.
 *
 *   2. Foundation workspace: `~/workspaces/wakilabs-cdn/waki-themes/`,
 *      which the wakilabs-cdn Pages project deploys from. Skipped
 *      gracefully if the workspace doesn't exist (e.g. CI runners).
 *      This is the canonical path per
 *      `~/workspaces/waki-homelab/projects/foundation-hosting-migration.md`.
 *
 * Routes served at cdn.wakilabs.dev (post-deploy):
 *   /waki-themes/themes.json        - shorthand path for new consumers
 *   /waki-themes/dist/themes.json   - matches local /dist/ layout, kept
 *                                     for parity with the GH-raw URL
 *
 * Run after build-bundle.mjs:
 *   node scripts/build-bundle.mjs && node scripts/build-cdn.mjs
 */
import { copyFileSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const src = resolve(repoRoot, "dist", "themes.json");
if (!existsSync(src)) {
  console.error("[build-cdn] dist/themes.json missing; run build-bundle.mjs first");
  process.exit(1);
}

// Output A: dist/cdn/waki-themes/ (self-contained for the repo's own
// Pages project).
const cdnDir = resolve(repoRoot, "dist", "cdn");
const themesDir = resolve(cdnDir, "waki-themes");
mkdirSync(themesDir, { recursive: true });

copyFileSync(src, resolve(themesDir, "themes.json"));

// Mirror the bundle into the /dist/ subpath too so consumers can pin
// to `/waki-themes/dist/themes.json`. Lets the GH-raw URL pattern
// flip cleanly to the CDN URL by changing the host.
const distSubDir = resolve(themesDir, "dist");
mkdirSync(distSubDir, { recursive: true });
copyFileSync(src, resolve(distSubDir, "themes.json"));

// The family themes in full (roles, extended roles, scales) for apps that build their own CSS or
// native palettes from them: https://cdn.wakilabs.dev/waki-themes/family.json
const familySrc = resolve(repoRoot, "dist", "family.json");
if (existsSync(familySrc)) {
  copyFileSync(familySrc, resolve(themesDir, "family.json"));
  copyFileSync(familySrc, resolve(distSubDir, "family.json"));
}

// Output B: ~/workspaces/wakilabs-cdn/waki-themes/. The wakilabs-cdn
// Pages project's deploy command is `wrangler pages deploy
// ~/workspaces/wakilabs-cdn ...`, so emitting here makes the bundle
// part of the next cdn.wakilabs.dev deploy automatically.
const cdnWorkspace = resolve(homedir(), "workspaces", "wakilabs-cdn", "waki-themes");
if (existsSync(resolve(cdnWorkspace, ".."))) {
  mkdirSync(cdnWorkspace, { recursive: true });
  mkdirSync(resolve(cdnWorkspace, "dist"), { recursive: true });
  copyFileSync(src, resolve(cdnWorkspace, "themes.json"));
  copyFileSync(src, resolve(cdnWorkspace, "dist", "themes.json"));
  if (existsSync(familySrc)) copyFileSync(familySrc, resolve(cdnWorkspace, "family.json"));
  console.log(
    `[build-cdn] mirrored to ${cdnWorkspace}/{themes.json, dist/themes.json}`,
  );
} else {
  console.log(
    `[build-cdn] skipping wakilabs-cdn workspace mirror (not found at ${cdnWorkspace})`,
  );
}

// Cloudflare Pages headers + redirects. Caches the bundle for 5
// minutes at the edge (cheap to invalidate, safe for the 6-hour
// consumer refresh cadence). CORS open so any consumer origin can
// fetch.
writeFileSync(
  resolve(cdnDir, "_headers"),
  `/waki-themes/themes.json
  Cache-Control: public, max-age=300, stale-while-revalidate=86400
  Access-Control-Allow-Origin: *
  Content-Type: application/json; charset=utf-8

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`,
);

// Tiny landing page at the CDN root so cdn.wakilabs.dev/ doesn't 404.
const bundle = JSON.parse(readFileSync(src, "utf8"));
writeFileSync(
  resolve(cdnDir, "index.html"),
  `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>wakilabs CDN</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:4rem auto;padding:0 1rem;color:#0f172a;line-height:1.55}code{background:#f1f5f9;padding:.1em .4em;border-radius:4px;font-size:.9em}a{color:#6366f1;text-decoration:none;border-bottom:1px solid currentColor}</style></head>
<body>
<h1>cdn.wakilabs.dev</h1>
<p>Public artifact endpoint for foundation projects. Anonymous read, edge-cached.</p>
<h2>Routes</h2>
<ul>
<li><a href="/waki-themes/themes.json"><code>/waki-themes/themes.json</code></a> - waki-themes bundle (v${bundle.pkgVersion}, ${Object.keys(bundle.themes).length} themes)</li>
</ul>
<p>See <a href="https://github.com/wwahmed/waki-themes">github.com/wwahmed/waki-themes</a> for the source and the Theme Studio (gated) at <a href="https://themes.wakilabs.dev">themes.wakilabs.dev</a>.</p>
</body></html>`,
);

console.log(`[build-cdn] wrote dist/cdn/waki-themes/themes.json + headers + landing page`);
