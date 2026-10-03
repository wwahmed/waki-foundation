# waki-themes

Shared theme catalog for Waki apps. The repo publishes a versioned bundle of CSS themes plus a private Theme Studio for browsing, previewing, and editing them.

## Current Catalog

The v1.3.0 catalog is organized by **material family** first and **hue variant** second. Variants inside a family usually share the same geometry, blur, density, typography, shadows, and hover behavior; the suffix tells you the colorway. The `System` family intentionally lets Mac and Windows differ structurally to better echo native OS conventions.

| Family | Variants |
|---|---|
| Waki Glass | Prism, Opal, Civic, Obsidian |
| Waki Frost | Arctic, Rose, Mint, Violet |
| Waki Academic | Ivory, Oxford, Slate, Sepia |
| Waki Desktop | Graphite, Cobalt, Nova, Olive |
| Waki Professional | Boardroom, Meridian, Sterling, Capital |
| Waki Corporate | Atlas, Ledger, Summit, Harbor |
| Waki Frosted Pro | Platinum, Azure, Jade, Amethyst |
| System | Mac, Windows |
| Waki Mobile | Plum, Mint, Sunrise, Ocean |
| Waki Command | Cyan, Lime, Burgundy, Amber |
| Waki Studio | Cobalt |

Theme ids follow the same pattern: `waki-glass-prism`, `waki-academic-ivory`, `waki-command-cyan`, and so on.

This is a breaking catalog cleanup. Older ids such as `glass-v2`, `frosted-glass`, `editorial-academic`, and `v2-*` are no longer in the published bundle; downstream apps should migrate to the new `waki-*` ids.

## Surfaces

| Surface | URL | Access | Purpose |
|---|---|---|---|
| Theme Studio | `https://themes.wakilabs.dev` | Google-OAuth gated, family allowlist | Browse, preview, edit, create themes |
| Foundation CDN | `https://cdn.wakilabs.dev/waki-themes/themes.json` | Anonymous read | Consumer apps fetch the theme bundle |

## Theme Studio

Studio source lives in [app/](app/). It demonstrates the themes against shell-like UI: navigation, toolbar chrome, nested panels, forms, status badges, action buttons, and mobile surfaces.

The picker is intentionally material-first:

1. Pick a family for the app personality.
2. Pick a hue variant inside that family.
3. Toggle light/dark mode and preview the full shell.

The preview includes the shared compact **Look** switcher pattern that Waki apps should reuse.

## Bundle Shape

Canonical bundle URL:

```text
https://cdn.wakilabs.dev/waki-themes/themes.json
```

Schema:

```json
{
  "schemaVersion": 1,
  "pkgVersion": "1.2.4",
  "gitSha": "...",
  "builtAt": "...",
  "base": "...",
  "themes": {
    "waki-glass-prism": {
      "name": "Waki Glass Prism",
      "description": "...",
      "vibe": "glass",
      "css": "...",
      "family": "glass",
      "familyName": "Waki Glass",
      "variantSlot": "prism",
      "variantName": "Prism"
    }
  },
  "families": {
    "glass": {
      "name": "Waki Glass",
      "description": "...",
      "structure": { "radius": 20, "blur": 26, "shadow": "...", "surface": "...", "iconography": "...", "density": "..." },
      "variants": [{ "slot": "prism", "themeId": "waki-glass-prism", "palette": { "light": {}, "dark": {} } }]
    }
  }
}
```

## Local Commands

```bash
cd ~/workspaces/waki-themes
npm run gen:v2       # generates src/themes/families.mjs + styles/waki-*.css
npm run build        # validates and writes dist/themes.json
npm run studio:build # builds bundle + Theme Studio
cd app && npm run dev
```

## Deploy

Production hostnames `themes.wakilabs.dev` and `cdn.wakilabs.dev` are served by Cloudflare Pages. CI deploys on pushes to `main`; manual deploy details live in [docs/DEPLOY.md](docs/DEPLOY.md).

## Contract

Every theme must satisfy the selectors in [SCHEMA.md](SCHEMA.md): core glass surfaces, shell surfaces, action buttons, status badges, and inputs. The validator runs before every bundle build so incomplete themes cannot ship.
