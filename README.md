# wakilabs-cdn

Anonymous publishing point for foundation artifacts. Served from `cdn.wakilabs.dev` via Cloudflare Pages.

## Why this exists separately from the Studios

Theme Studio, Shell Studio, and any future foundation control plane are auth-gated apps that live under `themes.wakilabs.dev`, `shell.wakilabs.dev`, etc. Consumer apps fetching artifact JSON should not pay an auth round-trip and should not share an origin with anything that has cookies. `cdn.wakilabs.dev` is that anonymous, cacheable, cookie-free origin.

## Layout

```
/                    static landing card (this stub)
/waki-themes/        theme bundles + dist (populated by waki-themes build)
/waki-shell/         shell bundles + dist (populated by waki-shell build)
```

## Caching

`_headers` sets:

- `Access-Control-Allow-Origin: *` everywhere (consumer apps can fetch from any origin).
- `Cache-Control: public, max-age=300, s-maxage=86400, stale-while-revalidate=604800` on artifact paths. Browsers refetch every 5 minutes; Cloudflare edge holds for a day; week-long SWR keeps consumers up while a new build propagates.
- Short-cache on the landing page so updates to this README-style content land quickly.

## Deploy

Direct via wrangler once authenticated:

```sh
wrangler pages deploy . --project-name=wakilabs-cdn --branch=main --commit-dirty=true
```

The Pages project is created the first time you deploy; subsequent deploys push to the same project.

## Custom domain

After the first deploy, `cdn.wakilabs.dev` is bound to the Pages project. The DNS is a CNAME at `cdn` -> `wakilabs-cdn.pages.dev`, proxied. See `~/workspaces/waki-homelab/projects/cli-tooling.md` for the curl command.
