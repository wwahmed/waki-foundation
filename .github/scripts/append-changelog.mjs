#!/usr/bin/env node
// Append-changelog: parses the latest commit message for a `Changelog:`
// block, prepends a structured entry to the deployed-side changelog, and
// writes the result back into `dist/` so the next wrangler deploy ships it.
//
// Design choices:
// - Source of truth for the changelog history is the LIVE deployed JSON
//   (e.g. https://app.memso.ai/changelog.json), not anything committed
//   to git. This avoids commit-back loops and keeps deploys idempotent.
// - If the live URL 404s (first run, or fresh deploy clobbered it) we
//   start from an empty array; nothing is lost going forward.
// - If the commit message has no `Changelog:` block, we skip silently
//   so housekeeping commits don't pollute the user-facing changelog.
// - Re-running on the same commit is idempotent: we don't add a new
//   entry if the latest entry already references the same commit_sha.
//
// Required env vars (set in the workflow step that calls this script):
//   COMMIT_MSG          full commit message (multi-line)
//   COMMIT_SHA          the deploy's commit sha (e.g. ${{ github.sha }})
//   CHANGELOG_LIVE_URL  e.g. https://app.memso.ai/changelog.json
//   CHANGELOG_DIST_PATH e.g. frontend/dist/changelog.json
// Optional:
//   PACKAGE_JSON_PATH   path to the package.json whose `version` we use;
//                       falls back to commit short-sha if absent.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const env = process.env;
const msg = env.COMMIT_MSG || "";
const sha = env.COMMIT_SHA || "";
const liveUrl = env.CHANGELOG_LIVE_URL || "";
const distPath = env.CHANGELOG_DIST_PATH || "";
const pkgPath = env.PACKAGE_JSON_PATH || "";

if (!sha || !distPath) {
  console.log("[changelog] missing COMMIT_SHA or CHANGELOG_DIST_PATH; skipping");
  process.exit(0);
}

// Parse the `Changelog:` block out of the commit message. Format expected:
//
//   Changelog:
//   label: short user-visible headline
//   description: one-line description of what changed and why it matters
//
// The block ends at the first blank line or non-key:value line.
function parseBlock(message) {
  const lines = message.split(/\r?\n/);
  let inBlock = false;
  const fields = {};
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (line.trim() === "Changelog:") {
      inBlock = true;
      continue;
    }
    if (!inBlock) continue;
    if (line.trim() === "") break;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.+)$/);
    if (!m) break;
    fields[m[1].toLowerCase()] = m[2].trim();
  }
  return fields;
}

const fields = parseBlock(msg);
const hasNewEntry = !!(fields.label && fields.description);

// Always fetch the live changelog FIRST. We need it whether or not this
// commit adds a new entry, so that no-block commits (the common case)
// preserve existing history in the new dist instead of wiping it.
let existing = [];
if (liveUrl) {
  try {
    const res = await fetch(liveUrl, { redirect: "follow" });
    if (res.ok) {
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      // CF Pages serves SPA fallback HTML for missing JSON paths with
      // content-type: application/json; sniff the body to be safe.
      const text = await res.text();
      if (text.trimStart().startsWith("[")) {
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) existing = data;
          else console.log("[changelog] live URL parsed but non-array; starting fresh");
        } catch (e) {
          console.log(`[changelog] live URL not valid JSON (${e.message}); starting fresh`);
        }
      } else {
        console.log("[changelog] live URL body looks like HTML (SPA fallback); starting fresh");
      }
    } else if (res.status !== 404) {
      console.log(`[changelog] live URL HTTP ${res.status}; starting fresh`);
    }
  } catch (e) {
    console.log(`[changelog] fetch live failed (${e.message}); starting fresh`);
  }
}

let next = existing;

if (hasNewEntry) {
  let version = sha.slice(0, 7);
  if (pkgPath) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      if (pkg.version && typeof pkg.version === "string") version = pkg.version;
    } catch (e) {
      console.log(`[changelog] could not read ${pkgPath}: ${e.message}`);
    }
  }

  const entry = {
    version,
    label: fields.label,
    description: fields.description,
    commit_sha: sha,
    deployed_at: new Date().toISOString(),
  };

  if (existing[0] && existing[0].commit_sha === entry.commit_sha) {
    console.log(`[changelog] entry for ${entry.commit_sha.slice(0, 7)} already at top; preserving as-is`);
  } else {
    next = [entry, ...existing];
    console.log(`[changelog] appended: "${entry.label}" (version=${version} sha=${sha.slice(0, 7)})`);
  }
} else {
  console.log("[changelog] no Changelog block in commit; preserving existing entries");
}

// Always write to dist. If `next` is empty AND the file would not exist
// otherwise, the SPA fetches return 404 (or SPA fallback). If the file
// has prior entries, those are now preserved across this deploy.
mkdirSync(dirname(distPath), { recursive: true });
writeFileSync(distPath, JSON.stringify(next, null, 2) + "\n");
console.log(`[changelog] dist written: ${distPath} (${next.length} entries)`);
