# Waki Foundation

Shared visual foundation for every Waki app, in one repository (merged 2026-10-04 with full history):

| Path | What | Published to |
|---|---|---|
| `tokens/` | waki-themes: theme catalog, family themes, Theme Studio | `themes.wakilabs.dev` (Studio), `cdn.wakilabs.dev/waki-themes/` |
| `packages/shell-web/` | waki-shell: web shell config (`dist/shell.json`) | `cdn.wakilabs.dev/waki-shell/` |
| `cdn/` | wakilabs-cdn: the anonymous artifact origin (landing, headers, installers) | `cdn.wakilabs.dev` |

One workflow (`.github/workflows/deploy-foundation.yml`) builds the theme bundle and Studio, assembles the full CDN site
(`cdn/` plus the freshly built `waki-themes/`), and deploys both Pages projects. Earlier, a themes deploy replaced the CDN with
themes only and dropped the other artifacts until a manual redeploy; assembling the site in one place fixes that.
