# Theme Inheritance Audit

Date: 2026-05-16

This audit checks how `waki-themes`, `waki-shell`, and the current child apps line up with the Wakilabs conventions in `~/workspaces/waki-homelab/projects/wakilabs-conventions.md`.

## Baseline

The convention is a two-tier foundation model:

- Authoring surface: gated Studio at `<thing>.wakilabs.dev`.
- Runtime artifacts: anonymous CDN at `cdn.wakilabs.dev/<thing>/<artifact>`.

`waki-themes` is already the reference implementation: `themes.wakilabs.dev` for Studio and `cdn.wakilabs.dev/waki-themes/themes.json` for consumers.

`waki-shell` is partially there: it publishes `dist/shell.json` on raw GitHub today, with `cdn.wakilabs.dev/waki-shell/shell.json` and `shell.wakilabs.dev` documented as targets.

## Parent Contract

`waki-themes` currently owns:

- Visual theme CSS for `.glass`, `.glass-elevated`, `.glass-bar`, `.chip`, `.divider-soft`.
- Action/state/form selectors: `.btn-*`, `.status-*`, `.input`.
- Bundle metadata: `themes` flat map plus `families` grouped map.

`waki-shell` currently owns:

- React shell components and hooks.
- Layer-1 config in `shell.json`.
- Tailwind component utilities such as `.surface-*`, `.text-*`, `.card`, `.btn-*`, `.input`, `.field`, `.select`, `.switch`.

The two parents overlap on `.btn-*` and `.input`, and that overlap is intentional: shell provides the baseline class shape, themes provide the final visual treatment.

## Gaps Found

1. `waki-shell` surface/text classes are not theme-controlled yet.

   The theme schema covers buttons, status, inputs, and glass surfaces, but not `waki-shell` classes like `.surface-page`, `.surface-1`, `.surface-2`, `.text-strong`, `.text-muted`, `.card`, `.card-elevated`, `.field`, `.select`, `.switch`, or `.input-group`. Any child app built mostly with shell utilities can still look slate-ish even after switching `waki-themes`.

2. Consumers do not share one theme-loader behavior.

   `printer-dashboard`, `brain-v2`, `waki-brain`, and `wakilabs-landing` each have their own `themeLoader.ts` with similar but not identical logic: storage keys differ, fallback chains differ, retired-theme remaps differ, and only `waki-brain` has runtime bundle override logic.

3. CDN-first consumption is inconsistent.

   `wakilabs-landing` reads the catalog from the CDN for preview, but bundles only a subset for actual application. `waki-brain` syncs from raw GitHub first, with a backend proxy fallback. `printer-dashboard` and `brain-v2` vendor CSS and require manual sync. The convention says canonical consumers should prefer `cdn.wakilabs.dev`.

4. The child catalog shapes are drifting.

   `printer-dashboard` is aligned with the curated 20-theme catalog. `brain-v2` keeps the curated catalog plus legacy CSS. `waki-brain` still exposes the old pre-v0.4 theme list even though it can apply upstream CSS overrides for matching IDs. `wakilabs-landing` exposes only eight bundled themes, including legacy IDs.

5. `waki-shell` has not completed the foundation CDN migration.

   It has the raw GitHub artifact and documented target path, but no `build-cdn` mirror into `~/workspaces/wakilabs-cdn/waki-shell/` yet. That keeps shell behind the same parent-child pattern that themes already uses.

## Recommended Fix Order

1. Add a theme-variable bridge between `waki-themes` and `waki-shell`.

   Add CSS custom properties to each theme for the shared shell vocabulary:
   `--waki-surface-page`, `--waki-surface-1`, `--waki-surface-2`, `--waki-surface-muted`, `--waki-border-line`, `--waki-text-strong`, `--waki-text-body`, `--waki-text-muted`, `--waki-accent`, and intent colors.

   Then update `waki-shell/src/styles/utilities.css` and `forms.css` so shell utilities use those variables with Tailwind-colored fallbacks. This keeps old consumers safe while letting new themes actually affect shell-built surfaces.

2. Add `REQUIRED_VARIABLES` validation in `waki-themes`.

   Keep selector validation, but also require the shared variables. That prevents a future theme from styling cards/buttons while forgetting shell surfaces.

3. Promote a shared theme client.

   Put a small source helper in `waki-shell` or `waki-themes` that handles:
   CDN-first bundle fetch, raw GitHub fallback, cache TTL, localStorage key prefixing, retired-ID remaps, style tag injection, and grouped catalog metadata.

   Child apps should configure it rather than each owning a custom loader.

4. Finish `waki-shell` CDN publishing.

   Mirror `dist/shell.json` and `dist/hostnames.json` into `~/workspaces/wakilabs-cdn/waki-shell/`, publish at `cdn.wakilabs.dev/waki-shell/shell.json`, then update docs and consumers away from raw GitHub as the primary source.

5. Move consumers to the same inheritance tiers.

   Recommended steady state:

   - First paint: bundled fallback CSS for the default theme only.
   - Runtime: CDN bundle fills the full catalog and overrides stale CSS.
   - Selection UI: render from `families` metadata, not hand-maintained arrays.
   - App-specific choice: only default theme, storage prefix, and allowed families/variants.

## Per-Consumer Notes

`printer-dashboard`

- Best aligned today: curated 20-theme catalog vendored locally.
- Gap: no CDN runtime override, so theme fixes need manual CSS sync or a rebuild.

`brain-v2`

- Has curated 20 plus legacy CSS for compatibility.
- Gap: no CDN runtime override; loader still carries legacy imports and remaps inside the app.

`waki-brain`

- Has runtime override infrastructure, but the exposed theme list is still the old pre-v0.4 catalog.
- Gap: raw GitHub is tried before CDN, and new curated IDs cannot be selected unless the local `VisualTheme` union and picker are updated.

`wakilabs-landing`

- Reads the CDN catalog for preview, but only applies eight bundled themes.
- Gap: the landing/dashboard can show all themes but cannot apply most of them to itself.

`waki-shell`

- Strong component/config parent, but not yet a full visual-token parent-child partner with `waki-themes`.
- Gap: hard-coded Tailwind colors still own several common shell surfaces unless theme CSS happens to override the exact same class.
