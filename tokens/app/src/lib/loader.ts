import type { ThemeBundle, StudioTheme } from "./types";

// Where the studio looks for the canonical bundle. Two-stage:
//   1. Try the same-origin URL (works locally and on the GH Pages
//      site once a copy is shipped under /waki-themes/themes.json).
//   2. Fallback to raw.githubusercontent.com on main. This is the
//      source of truth for cross-app consumption and it gives the
//      studio a graceful degrade path if the local copy is stale.
const BASE = import.meta.env.BASE_URL ?? "/";
const LOCAL_URL = `${BASE.replace(/\/$/, "")}/themes.json`;
const REMOTE_URL = "https://raw.githubusercontent.com/wwahmed/waki-themes/main/dist/themes.json";

export async function loadBundle(): Promise<ThemeBundle> {
  try {
    const r = await fetch(LOCAL_URL, { cache: "no-cache" });
    if (r.ok) return (await r.json()) as ThemeBundle;
  } catch {
    /* fall through */
  }
  const r = await fetch(REMOTE_URL, { cache: "no-cache" });
  if (!r.ok) throw new Error(`Failed to load themes bundle (HTTP ${r.status})`);
  return (await r.json()) as ThemeBundle;
}

export function bundleToStudioThemes(b: ThemeBundle): StudioTheme[] {
  return Object.entries(b.themes).map(([id, t]) => ({
    id,
    name: t.name,
    description: t.description,
    vibe: t.vibe,
    baseCss: b.base + "\n" + t.css,
    builtIn: true,
    familyId: t.family ?? null,
    familyName: t.familyName ?? null,
    variantSlot: t.variantSlot ?? null,
    variantName: t.variantName ?? null,
  }));
}
