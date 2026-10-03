# waki-themes

Shared theme catalog for Waki apps. The repo publishes a versioned bundle of CSS themes plus a private Theme Studio for browsing, previewing, and editing them.

## Current Catalog

Since v2.0.0 the catalog is just the **five Waki family themes**, the set every Waki app offers:

| Theme | Id | Look | Structure it borrows |
|---|---|---|---|
| Mac | `waki-family-mac` | macOS neutral, system blue | System (Mac translucency) |
| Boardroom | `waki-family-boardroom` | cool blue-grey, clear blue (WOV's Slate) | Professional |
| Graphite | `waki-family-graphite` | warm stone and paper, deep amber (WOV's Paper) | Desktop |
| Civic | `waki-family-civic` | navy glass with an amber glow (Waki AI Service) | **Glass** (the glass theme) |
| Cobalt | `waki-family-cobalt` | midnight navy, cobalt and indigo (Manager 3dByPixel) | Studio (solid, IBM Plex) |

The 39 earlier catalog themes (Glass, Frost, Academic, Desktop, Professional, Corporate, Frosted Pro,
System, Mobile, Command, Studio) are retired. Their ids still answer: each is served as an alias of
the nearest family theme (`aliasOf` in the bundle; the mapping is `RETIRED_IDS` in
`family/family-themes.mjs`), and no picker lists them.

## The Waki family themes

Every Waki app, native and web, offers the same five themes: **Mac, Boardroom, Graphite, Civic,
Cobalt**. They are written down once, in [`family/family-themes.mjs`](family/family-themes.mjs):
the 15 named colour roles per mode the Mac apps use, extended roles (card header, slot, thumbnail,
secondary and dim text, accent text, text on accent, success, warning, danger, info, progress), and
two 11-step scales (neutral, accent) for scale-based apps.

- Boardroom and Graphite are WOV's tuned Slate and Paper scales, unchanged; Mac keeps the macOS
  values; Civic is Waki AI Service's glass; Cobalt is Manager 3dByPixel's palette.
- `npm run gen:family` resolves them, checks every theme in both modes against WOV's contrast bar
  (body text 7:1; muted, links, buttons and status text 4.5:1; focus and icons 3:1) and writes
  `dist/family.json` (published at `https://cdn.wakilabs.dev/waki-themes/family.json`).
- `npm run gen:v2` then writes `styles/waki-family-<id>.css`; each borrows the geometry, blur and
  shadows of the theme it came from. The bundle lists them, in order, under `family`.
- WakiKit imports them with `tools/import_family_themes.py`; web apps list `bundle.family.themes`
  instead of the whole catalog; WOV can take `scales` straight into its Tailwind remap.

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
