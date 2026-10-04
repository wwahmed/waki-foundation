# Deployment

Three artifacts ship from this repo:

1. **`dist/themes.json`** - the consumer bundle that printer-dashboard, brain-v2, and waki-shell consumers fetch at runtime. Auto-rebuilt by the existing `build-bundle.yml` GH Action on push to main.
2. **Theme Studio** - the React app under `app/` deployed to Cloudflare Pages at https://themes.wakilabs.dev (Google-OAuth gated, family allowlist).
3. **Foundation CDN** - the same `dist/themes.json` republished at https://cdn.wakilabs.dev/waki-themes/themes.json (anonymous read, edge-cached). Future foundation projects publish under the same `cdn.wakilabs.dev/<project>/` convention.

The pipelines do not interfere. The studio's Cloudflare build copies a snapshot of `dist/themes.json` for self-contained hosting; the CDN republishes the canonical bundle without modification; the GH-raw URL keeps serving for backward compat.

## Two-surface architecture

Authoring tools (the Studio) live behind auth so only the family allowlist can edit. Published artifacts (the bundle) are anonymous so every consumer app can fetch them without credentials. The split mirrors the broader wakilabs.dev pattern:

- `<thing>.wakilabs.dev` - gated authoring / dashboard for foundation `<thing>`
- `cdn.wakilabs.dev/<thing>/<artifact>` - the public artifact `<thing>` produces

For waki-themes today, that resolves to:

- `themes.wakilabs.dev` -> Studio (gated)
- `cdn.wakilabs.dev/waki-themes/themes.json` -> bundle (anonymous)

Future waki-shell will mirror: `shell.wakilabs.dev` (gated dashboard if any) + `cdn.wakilabs.dev/waki-shell/shell.json`.

## Cloudflare Pages: two projects, one repo

Per Waqas's "Option A" decision: keep one source repo, run two Cloudflare Pages projects pointing at it. Each project picks a different output directory.

### Project 1: Theme Studio

Connect once in the Cloudflare dashboard. Settings recorded in [`.cloudflare-pages.toml`](../.cloudflare-pages.toml) for re-create.

- **Project name**: `waki-themes-studio`
- **Production branch**: `main`
- **Build command**: `cd app && npm install && npm run build`
- **Build output directory**: `app/dist`
- **Root directory**: `/`
- **Custom domain**: `themes.wakilabs.dev`
- **Access policy**: **Cloudflare Access -> One-time PIN or Google OAuth, family-Gmail allowlist**. Configure in the Cloudflare Access dashboard, attaching to the `themes.wakilabs.dev` hostname. Until Access is configured, the Studio is technically anonymous; see the OAuth gate section below for the in-app fallback.

### Project 2: Foundation CDN

Connect once. Build command repackages the existing `dist/themes.json` for the CDN's directory layout.

- **Project name**: `wakilabs-cdn`
- **Production branch**: `main`
- **Build command**: `node scripts/build-bundle.mjs && node scripts/build-cdn.mjs`
- **Build output directory**: `dist/cdn`
- **Root directory**: `/`
- **Custom domain**: `cdn.wakilabs.dev`
- **Access policy**: Anonymous; `_headers` config sets `Cache-Control: public, max-age=300, stale-while-revalidate=86400` and `Access-Control-Allow-Origin: *`.

`scripts/build-cdn.mjs` is a small shaper that copies `dist/themes.json` to `dist/cdn/waki-themes/themes.json` (and writes a `_headers` + `_redirects` for Cloudflare Pages).

## OAuth gate on the Studio

Two layers of gating, defence in depth:

1. **Cloudflare Access** at the hostname level. Every request to `themes.wakilabs.dev` is intercepted at the edge and challenged against the Access policy. This is the primary gate; it works even if the Studio's app-level auth fails open.
2. **In-app Google OAuth** inside the Studio for finer-grained UX (per-user preferences, attribution on saved themes). Reuses the waki-brain Google Cloud OAuth client; the redirect URI for `https://themes.wakilabs.dev/auth/callback` needs to be added to the client's authorised redirect URIs.

Family allowlist is the same Gmail list used across the family of apps.

Status: Cloudflare Access is the immediate gate (configurable from the dashboard once the Pages project is up); the in-app OAuth flow is deferred to a follow-up commit since it requires the redirect-URI registration on the Google Cloud OAuth client.

## Build behaviour

`app/scripts/sync-bundle.mjs` runs before the studio's `vite build`. It copies the repo-root `dist/themes.json` into `app/public/themes.json` and `app/public/dist/themes.json` so both URLs resolve on the deployed site:

- https://themes.wakilabs.dev/ - studio SPA
- https://themes.wakilabs.dev/themes.json - same bundle (self-contained for the Studio's loader)
- https://themes.wakilabs.dev/dist/themes.json - same bundle, `/dist/` path preserved
- https://themes.wakilabs.dev/build-info.json - studio build metadata

Production CDN URLs:

- https://cdn.wakilabs.dev/waki-themes/themes.json - canonical for consumers post-v0.4.0
- (legacy) https://raw.githubusercontent.com/wwahmed/waki-themes/main/dist/themes.json - still works during the migration window

`app/public/_headers` sets cache + CORS for the bundle. `app/public/_redirects` enables SPA fallback for unknown routes.

## Local development

```bash
cd app
npm install
npm run dev   # http://localhost:5173/
```

The dev script auto-runs `sync-bundle` first, so the studio finds `themes.json` at the same-origin URL it would in production.

## Migration window

During the migration window, three URLs serve the same bundle:

| Surface | URL | Status |
|---|---|---|
| GitHub raw | `https://raw.githubusercontent.com/wwahmed/waki-themes/main/dist/themes.json` | active, current consumers |
| Cloudflare Studio host | `https://themes.wakilabs.dev/dist/themes.json` | active, alongside |
| Foundation CDN | `https://cdn.wakilabs.dev/waki-themes/themes.json` | new canonical, post-v0.4.0 |

Future plan: flip consumers to the CDN, then deprecate the GH-raw path. Tracked in `~/workspaces/waki-homelab/projects/foundation-hosting-migration.md`.
