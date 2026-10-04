#!/usr/bin/env node
/**
 * Copies every theme CSS file from waki-themes/styles/ into a consumer
 * app's frontend/src/themes/ directory. Used to push v0.4.x catalog
 * updates into printer-dashboard and brain-v2 without each app
 * waiting on the broader CDN-fetch migration.
 *
 * Usage:
 *   node scripts/sync-to-consumer.mjs <path-to-consumer-frontend-src-themes>
 *
 * Examples:
 *   node scripts/sync-to-consumer.mjs ~/workspaces/printer-dashboard/frontend/src/themes
 *   node scripts/sync-to-consumer.mjs ~/workspaces/brain-v2/frontend/src/themes
 *
 * The script copies all CSS files under styles/ EXCEPT base.css. It
 * does NOT update themeLoader.ts; that's a manual step (the consumer
 * decides which themes to register, in what order, etc.).
 */
import { copyFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesDir = resolve(__dirname, "..", "styles");

const target = process.argv[2];
if (!target) {
  console.error(
    "[sync-to-consumer] missing target. Usage: node scripts/sync-to-consumer.mjs <consumer-frontend-src-themes-dir>",
  );
  process.exit(1);
}

const targetDir = resolve(target.replace(/^~/, process.env.HOME ?? "~"));
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

let count = 0;
for (const file of readdirSync(stylesDir)) {
  if (!file.endsWith(".css")) continue;
  if (file === "base.css") continue;
  copyFileSync(resolve(stylesDir, file), resolve(targetDir, file));
  count += 1;
}

console.log(`[sync-to-consumer] copied ${count} theme CSS file(s) to ${targetDir}`);
console.log(
  `  Reminder: update the consumer's themeLoader.ts with imports / cssMap / AVAILABLE_THEMES entries for any new theme.`,
);
