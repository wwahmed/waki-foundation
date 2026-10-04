# CHANGELOG-LIVE.md

Running log of in-flight changes since the last cut release. Tip
moves up; entries are append-only with newest at the top.

## v0.4.x (in flight, post-2026-04-30)

### Schema + completeness

- [`b83e2c2`](https://github.com/wwahmed/waki-themes/commit/b83e2c2) Promoted the recommended-token set to required: `.btn-success`, `.status-success/warning/error/info`, `.input`. All 20 themes now declare them; validator logs `OK: 20 theme(s) cover the required schema` with zero warnings. Bundle size grew 124.8 KB to 167.1 KB.

### Studio polish

- [`b83e2c2`](https://github.com/wwahmed/waki-themes/commit/b83e2c2) **Reset button** in the editor restores the variant's seed values without leaving the screen.
- Keyboard shortcuts in the editor: **Esc** -> back, **Cmd/Ctrl-S** -> save (variant or family-structure depending on active tab).

### Studio UX

- [`b5a4980`](https://github.com/wwahmed/waki-themes/commit/b5a4980) Studio gains:
  - **Clone-from-variant** in the variant gallery. Source variant's palette seeds a new custom theme inside the same family.
  - **Import-from-JSON** dialog (header button). Accepts the canonical `Download JSON` shape OR a partial `OverrideTokens` object. Missing keys fall back to defaults with a hint listing the filled keys.
  - **Contrast suggestions**: per-pair fix hints surface in the WCAG panel when a ratio fails AA. Different copy for accent-on-panel vs text-on-bg vs text-on-panel mismatches.
  - **AccessGate** (defense-in-depth): compiled-in passphrase via `VITE_STUDIO_PASSPHRASE`. SessionStorage unlock. Cloudflare Access at the hostname stays the primary gate; this is the in-app backup.

### Deployment plumbing

- [`b5a4980`](https://github.com/wwahmed/waki-themes/commit/b5a4980) `scripts/build-cdn.mjs` now mirrors `dist/themes.json` to `~/workspaces/wakilabs-cdn/waki-themes/{themes.json,dist/themes.json}` per the foundation-hosting-migration plan. The wakilabs-cdn Pages project picks up the bundle on its next deploy.
- [`b5a4980`](https://github.com/wwahmed/waki-themes/commit/b5a4980) `app/wrangler.toml`: Cloudflare Pages config for the Studio project.
- [`b5a4980`](https://github.com/wwahmed/waki-themes/commit/b5a4980) `scripts/deploy-studio.sh`: one-shot wrangler deploy for the Studio Pages project. Runs once `CLOUDFLARE_API_TOKEN` is set.

### Consumer migration

- [`printer-dashboard@3066cb5`](https://github.com/wwahmed/printer-dashboard/commit/3066cb5): `themeLoader.ts` defaults to `glass-plus`. Stored localStorage values that name a dropped v0.4.0 id auto-migrate to `glass-plus` on read, with the storage rewritten in place. Local CSS files for the dropped ids stay (no breakage); the full catalog refresh ships separately.
- [`brain-v2@f30d29f`](https://github.com/wwahmed/brain-v2/commit/f30d29f): same migration mirrored.

## v0.4.0 (2026-04-30)

Cut release. Curated 5x4 catalog (20 themes), token schema + build-time validation, urgent Frosted Glass button-style fix. Full notes in [CHANGELOG.md](CHANGELOG.md).

[`98e5319`](https://github.com/wwahmed/waki-themes/commit/98e5319) on waki-themes,
[`25f0676`](https://github.com/wwahmed/printer-dashboard/commit/25f0676) on printer-dashboard,
[`7585612`](https://github.com/wwahmed/brain-v2/commit/7585612) on brain-v2.

## Pending (overnight queue)

- ~~Cloudflare Pages projects + DNS~~ **DONE 2026-04-30**. Both `themes.wakilabs.dev` and `cdn.wakilabs.dev` resolve and return 200 via Cloudflare proxy. CDN `pkgVersion 0.4.0`, 20 themes, 5 families verified live.
- **TODO: Cloudflare Access policy on `themes.wakilabs.dev`**. Manual Zero Trust dashboard step (token scopes don't cover Access app creation). Steps:
  1. Cloudflare dashboard -> Zero Trust -> Access -> Applications -> Add application
  2. Self-hosted, name `Theme Studio`, domain `themes.wakilabs.dev`
  3. Policy: include emails matching the family-Gmail allowlist (same as Memso: `wwahmed@gmail.com`, `salmac145@gmail.com`)
  4. Identity provider: Google (already configured for waki-brain OAuth)
  5. Session duration: 24h
  Until this is on, the in-app `AccessGate` (passphrase via `VITE_STUDIO_PASSPHRASE`) is the only gate. Set the env var in the waki-themes-studio Pages project (Settings -> Environment variables -> Production) to a shared passphrase. Empty env var = gate disabled = anonymous-readable Studio.
- Recommended-token coverage (`.btn-success`, `.status-*`, `.input`) across the 20 themes; validator currently warns, doesn't block. (Note: v0.4.1 `b83e2c2` already promoted these to required and updated all 20 themes; this line is stale.)
- Full consumer catalog refresh: drop the local CSS files for dropped ids in printer-dashboard + brain-v2; sync the new aurora/clean/editorial/neon CSS files in.
- Studio in-app Google OAuth flow (Cloudflare Access at the hostname is the primary gate; in-app flow is fine-grained UX).
