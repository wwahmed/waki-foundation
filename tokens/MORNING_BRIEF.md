# MORNING_BRIEF.md

Status as of 2026-04-30 (overnight shift, sleep handoff).

## TL;DR

- **Studio is live** at https://waki-themes-studio.pages.dev/ (Cloudflare Pages, deployed via wrangler tonight). Custom domain `themes.wakilabs.dev` is bound to the project but the wakilabs.dev DNS CNAME still needs to be created. One command away once `CLOUDFLARE_API_TOKEN` lands; see Step 5 below.
- **CDN is live** at https://wakilabs-cdn.pages.dev/waki-themes/themes.json (verified `pkgVersion: 0.4.0, themes: 20, families: 5`). Custom domain `cdn.wakilabs.dev` bound; same DNS step pending.
- **All five core deliverables shipped.** Token schema + validation, curated 5x4 catalog, both Pages projects deployed, CHANGELOG-LIVE.md + commit log entries written.

## What landed

-2. **Full consumer catalog refresh** ([`printer-dashboard@c31cc81`](https://github.com/wwahmed/printer-dashboard/commit/c31cc81), [`brain-v2@8ffa595`](https://github.com/wwahmed/brain-v2/commit/8ffa595)). Both consumer apps now have the full 20-theme v0.4.0 catalog registered. AVAILABLE_THEMES rebuilt to surface the curated 5x4 catalog at the top, with 3 legacy themes (flat, glass-v3, glass-extreme) marked "(legacy)" at the bottom for users with existing localStorage values. Both apps still bundle every theme locally; the CDN-fetch migration is a separate task tracked in `~/workspaces/waki-homelab/projects/foundation-hosting-migration.md`.

-1. **Studio polish iteration 2** ([`35382e9`](https://github.com/wwahmed/waki-themes/commit/35382e9)). Delete-custom-theme button on each session-saved theme tile. Bundle integrity test (`scripts/test-bundle.mjs`) wired into the build pipeline; asserts every theme covers all required selectors + every family.variants[].themeId resolves cleanly.

0. **v0.4.1 schema completeness + Studio polish** ([`b83e2c2`](https://github.com/wwahmed/waki-themes/commit/b83e2c2), [`d6a577c`](https://github.com/wwahmed/waki-themes/commit/d6a577c)). Promoted the recommended-token set to required across all 20 themes (`.btn-success`, `.status-*`, `.input`). Editor Reset button. Keyboard shortcuts (Esc / Cmd-S).

1. **v0.4.0 cut release** ([`98e5319`](https://github.com/wwahmed/waki-themes/commit/98e5319)). 5 families x 4 variants = 20 themes (Glass / Aurora / Clean / Editorial / Neon). Token schema + build-time validation. Urgent Frosted Glass button-style fix patched into both consumer apps. Full notes in [`CHANGELOG.md`](CHANGELOG.md).

2. **Studio UX iteration** ([`b5a4980`](https://github.com/wwahmed/waki-themes/commit/b5a4980)).
   - Clone-from-variant button on the variant gallery
   - Import-from-JSON dialog (file picker + paste)
   - Contrast checker shows per-pair fix suggestions
   - AccessGate as defense-in-depth (passphrase via `VITE_STUDIO_PASSPHRASE`)

3. **Deployment plumbing** ([`b5a4980`](https://github.com/wwahmed/waki-themes/commit/b5a4980)).
   - `scripts/build-cdn.mjs` mirrors the bundle into `~/workspaces/wakilabs-cdn/waki-themes/{themes.json,dist/themes.json}`. Ready for the wakilabs-cdn Pages project's next deploy.
   - `app/wrangler.toml` + `scripts/deploy-studio.sh` ready to deploy the Studio once Cloudflare auth is set.

4. **Consumer migration** ([`printer-dashboard@3066cb5`](https://github.com/wwahmed/printer-dashboard/commit/3066cb5), [`brain-v2@f30d29f`](https://github.com/wwahmed/brain-v2/commit/f30d29f)). Both `themeLoader.ts` files default to `glass-plus`, auto-migrate localStorage values that name a dropped id forward to `glass-plus`, register `glass-plus` in their type union + AVAILABLE_THEMES + cssMap.

## Cloudflare deploy: state

Pages projects + bindings done via `wrangler` OAuth (browser flow that the CLI worker landed). What's still pending:

| Step | Status |
|---|---|
| `wrangler` OAuth auth | done (the CLI worker landed it) |
| Create `waki-themes-studio` Pages project | done |
| Deploy Studio build to `waki-themes-studio` | done -> https://waki-themes-studio.pages.dev/ |
| Bind `themes.wakilabs.dev` to Pages project | done (status: pending DNS) |
| Create `wakilabs-cdn` Pages project | done |
| Deploy CDN content to `wakilabs-cdn` | done -> https://wakilabs-cdn.pages.dev/waki-themes/themes.json |
| Bind `cdn.wakilabs.dev` to Pages project | done (status: pending DNS) |
| Create wakilabs.dev DNS CNAMEs | **pending** (needs Zone:DNS:Edit token) |
| Cloudflare Access policy on themes.wakilabs.dev | pending (manual dashboard step) |

The wrangler OAuth token only has account-level Pages scope; it does NOT have Zone:DNS:Edit on wakilabs.dev. The DNS records have to be created with a long-lived API token that has DNS write scope (per `~/workspaces/waki-homelab/projects/cli-tooling.md`).

## When the long-lived API token lands

Set the env var:

```bash
export CLOUDFLARE_API_TOKEN=$(cat ~/.config/cloudflare/token)
```

Then run the helper to create the two CNAMEs in one shot:

```bash
~/workspaces/waki-themes/scripts/cf-bind-dns.sh
```

That script wraps the Cloudflare API calls (zone id 1e2bff7f53ef46b6fcbda836dde6a019 is hard-coded; that's wakilabs.dev).

After it runs:

```bash
dig +short themes.wakilabs.dev
dig +short cdn.wakilabs.dev
curl -I https://themes.wakilabs.dev/
curl -I https://cdn.wakilabs.dev/waki-themes/themes.json
```

Expect dig output to show the `*.pages.dev` target plus a Cloudflare proxy IP within seconds; the curl headers show `HTTP/2 200` + `cf-ray` + `server: cloudflare`. Cloudflare auto-issues a Universal SSL cert as soon as DNS resolves.

## Manual fallback (if you'd rather click)

If you want this faster than waiting for the long-lived token:

1. Cloudflare dashboard -> wakilabs.dev zone -> DNS -> Records -> Add record.
2. CNAME, name `themes`, target `waki-themes-studio.pages.dev`, proxied (orange cloud).
3. Repeat: CNAME, name `cdn`, target `wakilabs-cdn.pages.dev`, proxied.

Five clicks total. The Pages -> custom-domain binding already exists; the DNS is the only missing link.

## Cloudflare Access (still manual)

Once DNS resolves, attach the Access policy:

- Cloudflare dashboard -> Zero Trust -> Access -> Applications -> Add application
- Self-hosted, name "Theme Studio", domain `themes.wakilabs.dev`
- Policy: include emails matching the family-Gmail allowlist (same as Memso)
- Identity provider: Google (already configured)
- Session duration: 24h

Until Access is on, the Studio's in-app `AccessGate` is the only gate. Set `VITE_STUDIO_PASSPHRASE` in the Pages project env vars (Cloudflare dashboard -> waki-themes-studio -> Settings -> Environment variables -> Production) to a passphrase you share with the family. Until that's set, the gate is OFF and the Studio is anonymous-readable.

## Older handoff (now stale, kept for reference)

The two Cloudflare Pages projects + the custom-domain bindings used to require `CLOUDFLARE_API_TOKEN`. The CLI worker landed `wrangler login` (OAuth) instead, which got us 90% of the way. The remaining 10% (DNS + env vars) needs either the long-lived token or 5 clicks in the dashboard. Original instructions:

### Step 1: confirm wrangler auth

```bash
export CLOUDFLARE_API_TOKEN=$(cat ~/.config/cloudflare/token)
~/.local/node/bin/wrangler whoami
```

Expect: account email + account ID. If wrangler still reports "not authenticated", the token's scope is wrong; see cli-tooling.md.

### Step 2: deploy the Studio

From `~/workspaces/waki-themes`:

```bash
./scripts/deploy-studio.sh
```

This runs `npm run build` in `app/` and `wrangler pages deploy app/dist --project-name=waki-themes-studio --branch=main --commit-dirty=true`. First run creates the project; subsequent runs push new builds.

After the first deploy, attach the custom domain via the Cloudflare dashboard:
- Workers & Pages -> waki-themes-studio -> Custom domains -> Set up a custom domain -> `themes.wakilabs.dev`
- DNS auto-creates as a CNAME inside the wakilabs.dev zone.

Verify:

```bash
curl -I https://themes.wakilabs.dev/
```

Expect: `HTTP/2 200`, `cf-ray` + `server: cloudflare`. If `200` returns from a Cloudflare 1.1.1.1 instead of the Pages origin, the custom domain isn't bound yet.

### Step 3: deploy the foundation CDN

From `~/workspaces/wakilabs-cdn`:

```bash
~/.local/node/bin/wrangler pages deploy . \
  --project-name=wakilabs-cdn \
  --branch=main \
  --commit-dirty=true
```

After the first deploy, attach `cdn.wakilabs.dev` as the custom domain (same dashboard step).

Verify:

```bash
curl -I https://cdn.wakilabs.dev/waki-themes/themes.json
curl -s https://cdn.wakilabs.dev/waki-themes/themes.json | head -c 200
```

Expect: `HTTP/2 200` + JSON starting with `{"schemaVersion": 1, "pkgVersion": "0.4.0", ...`.

### Step 4: attach Cloudflare Access policy to the Studio

In the Cloudflare dashboard:
- Zero Trust -> Access -> Applications -> Add application
- Self-hosted, name "Theme Studio", domain `themes.wakilabs.dev`
- Policy: include emails matching the family-Gmail allowlist (same as Memso)
- Session duration: 24h, Identity provider: Google (already configured for waki-brain OAuth)

After this is on, the in-app `AccessGate` becomes redundant; you can clear `VITE_STUDIO_PASSPHRASE` to disable it (`AccessGate` no-ops on empty env var).

### Step 5: smoke test

Hand off the URLs back to Waqas to visually verify the Studio and the CDN. Per the no-Chrome-MCP rule for this shift, I cannot drive the browser myself.

## Final shape (overnight totals)

Across the three repos, this shift shipped (newest first):

- **waki-themes**: 8 commits on main, tip `35382e9`. v0.4.0 cut + v0.4.1 polish. 20 themes across 5 families. Schema validation + integrity test gate the build. Two-surface deployment plumbing ready (`scripts/build-cdn.mjs`, `scripts/deploy-studio.sh`, `app/wrangler.toml`).
- **printer-dashboard**: 3 commits on main, tip `3c7ec7d`. Urgent Frosted Glass button-style fix in production. Default flipped to `glass-plus`. DROPPED_REMAP forwards-migrates the 16 dropped IDs. Full v0.4.0 catalog registered in themeLoader. (One earlier commit accidentally tracked some local working files; followed up immediately with `3c7ec7d` to untrack + extend `.gitignore`.)
- **brain-v2**: 3 commits on main, tip `8ffa595`. Mirror of the printer-dashboard migration.

Total commits pushed: 14. No working tree dirty. All typechecks + builds green.

## What I deferred

- **In-app Google OAuth flow**. Cloudflare Access at the hostname is the real gate; the in-app `AccessGate` is the soft tripwire. Adding the in-app OAuth flow needs the redirect URI registered on the existing waki-brain OAuth client, then a small auth-callback page in the Studio. Tracked as a follow-up.
- **Recommended-token coverage** (`.btn-success`, `.status-success/warning/error/info`, `.input`). The validator warns; 20/20 themes lack them. Adding them to `gen-themes.mjs` + the four hand-authored Glass + Aurora-twilight files is the next sweep.
- **Full consumer catalog refresh.** Both consumers still bundle the 20 dropped CSS files locally and ignore the new aurora/clean/editorial/neon variants. Switching them to fetch from the CDN at runtime is the right architectural move; tracked in `~/workspaces/waki-homelab/projects/foundation-hosting-migration.md`.

## Verify (when you wake up)

If the CLI worker has landed `CLOUDFLARE_API_TOKEN`:

```bash
ls ~/.config/cloudflare/token         # exists?
echo "${CLOUDFLARE_API_TOKEN:-unset}"  # populated?
```

Then run Steps 1-5 above.

If the CLI worker hasn't landed the token yet, the Studio + CDN can still be deployed via `wrangler login` (one-time browser flow). That's not blocked by anything I've shipped tonight; it's just a flip-the-switch step from your end.
