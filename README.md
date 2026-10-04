# Waki Foundation

Shared visual foundation for every Waki app, in one repository (merged 2026-10-04 with full history):

| Path | What | Published to |
|---|---|---|
| `tokens/` | waki-themes: theme catalog, family themes, Theme Studio | `themes.wakilabs.dev` (Studio), `cdn.wakilabs.dev/waki-themes/` |
| `packages/shell-web/` | waki-shell: web shell config (`dist/shell.json`) | `cdn.wakilabs.dev/waki-shell/` |
| `cdn/` | wakilabs-cdn: the anonymous artifact origin (landing, headers, installers) | `cdn.wakilabs.dev` |

One workflow (`.github/workflows/deploy-foundation.yml`) builds the theme bundle and Studio, assembles the CDN site
(`cdn/` plus the freshly built `waki-themes/`), and deploys both Pages projects. Before the merge, each themes deploy replaced
the whole CDN, so `waki-ai-service/` and `waki-shell/` from the old wakilabs-cdn repo had silently stopped being served.
They are still excluded (the workflow says how to re-enable them) so the merge changes nothing clients receive.
