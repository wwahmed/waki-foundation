> **Superseded (v2.0.0):** the catalog is now the five Waki family themes; see README › Current Catalog and `family/family-themes.mjs`. The notes below describe the retired catalog.

# Theme curation (v0.4.0, 2026-04-30)

Curation directive from Waqas: tighten the catalog to 5 families x 4 variants (20 themes), drawn from common modern professional theme trends. Replaces the prior flat list of 21 only-superficially-different themes.

## Final catalog

| # | Family | Variant | Flat ID | Origin |
|---|---|---|---|---|
| 1 | Glass | Default | `glass-v2` | retained from v0.3.0 |
| 2 | Glass | Plus | `glass-plus` | retained from v0.3.0 (universal default) |
| 3 | Glass | Lite | `glass-v1` | retained from v0.3.0 |
| 4 | Glass | Frosted | `frosted-glass` | retained from v0.3.0 |
| 5 | Aurora | Twilight | `aurora-twilight` | renamed from `glass-v3` |
| 6 | Aurora | Sunrise | `aurora-sunrise` | new |
| 7 | Aurora | Ocean | `aurora-ocean` | new |
| 8 | Aurora | Forest | `aurora-forest` | new |
| 9 | Clean | Light | `clean-light` | new |
| 10 | Clean | Dim | `clean-dim` | new |
| 11 | Clean | Warm | `clean-warm` | new |
| 12 | Clean | Cool | `clean-cool` | new |
| 13 | Editorial | Academic | `editorial-academic` | new |
| 14 | Editorial | Noir | `editorial-noir` | new |
| 15 | Editorial | Warm | `editorial-warm` | new |
| 16 | Editorial | Technical | `editorial-technical` | new |
| 17 | Neon | Cyan | `neon-cyan` | new |
| 18 | Neon | Pink | `neon-pink` | new |
| 19 | Neon | Lime | `neon-lime` | new |
| 20 | Neon | Plasma | `neon-plasma` | new |

## Families

### 1. Glass

Glassmorphism. Layered translucent panels with backdrop blur. Apple iOS / macOS Big Sur, Windows 11. Origin theme of the project; retained in full.

Structure: `radius 14px`, `blur 14px`, `surface translucent`, `shadow soft-glow`, `iconography regular`, `density comfortable`. Drift animation on body bg, fractal-noise grain overlay, `::after` light glint on each card.

### 2. Aurora

Vibrant gradient accents with multi-stop radial-gradient blobs, gradient-ribbon `::before` mask borders, heavier blur. Stripe marketing-page style. Coherent enough to be its own family rather than a Glass variant: 16px radius (vs Glass's 14), 22px blur (vs Glass's 14), saturate 200% (vs 180%), gradient-ribbon border (vs solid translucent border), radial blob bg (vs linear-gradient bg).

Structure: `radius 16px`, `blur 22px`, `surface tinted-translucent`, `shadow aurora-glow`, `iconography regular`, `density comfortable`. Three-blob radial gradient bg, gradient-mask border via `::before`.

### 3. Clean

Modern minimal, whitespace-heavy, restrained. Linear / Notion / Vercel marketing-site style. NEW family. No blur, generous padding, hairline borders, plain solid surfaces.

Structure: `radius 8px`, `blur 0`, `surface solid-white`, `shadow subtle`, `iconography regular`, `density spacious`. No animation.

### 4. Editorial

Refined typography, thin borders, premium-publication feel. Stripe / Substack / Mirror style. NEW family. Plays on contrast between display headings and body. Thin hairlines, paper-feel surface, generous line-height.

Structure: `radius 4px`, `blur 0`, `surface paper`, `shadow hairline`, `iconography thin`, `density comfortable`. Heading fonts use serif/display contrast where the consumer's font stack supports it.

### 5. Neon

Dark base + vibrant accent colour, dev-tool aesthetic. Vercel / Replicate / GitHub-CLI style. NEW family. Sharp corners, glowing accents, monospace-leaning chips, solid black panels.

Structure: `radius 6px`, `blur 0`, `surface dark-solid`, `shadow glow`, `iconography regular`, `density compact`. Dark-mode is the canonical view; light-mode is a high-contrast inverted variant rather than a separate design.

## Aurora vs Glass: why a separate family

| Token | Glass | Aurora |
|---|---|---|
| `border-radius` | 14px | 16px |
| `backdrop-filter` blur | 14-18px | 20-24px |
| `backdrop-filter` saturate | 180% | 200-220% |
| Background | Single linear-gradient + drift | Multi-stop radial-gradient blobs over linear |
| Border | Solid 1px semi-transparent | Gradient ribbon via `::before` mask-composite |
| Surface tint | Whitish or family-tinted | Always violet/aurora-tinted |

The radial-blob bg + gradient-ribbon border + heavier blur form a coherent structural identity that variants of it can swap palettes within (sunrise / ocean / forest / twilight) without breaking.

## What's dropped

16 themes removed. CSS files, META entries, family registry slots all deleted.

`flat`, `slate-modern`, `nord`, `arctic`, `neumorphism`, `lavender`, `emerald`, `rose-gold`, `copper`, `neon`, `midnight`, `ocean`, `sunset`, `forest`, `sakura`, `glass-extreme`.

(`glass-v3` is renamed to `aurora-twilight`, not dropped.)

Consumers that pinned to any dropped flat ID are remapped to `glass-plus` (the universal default) in their respective theme loaders. See [CHANGELOG.md](CHANGELOG.md) for the per-consumer migration.

## Why this shape

- **5 x 4 = 20** is the right cardinality for a curated catalog. Each family is small enough that a user can hold all four variants in their head, and each variant must justify itself against three siblings rather than disappear into a flat list of 21.
- **Two families inherit, three are new.** Glass and Aurora come from the existing repo; Clean, Editorial, Neon are reasonable picks for "common professional theme trends" that the existing flat list didn't cover well.
- **Glass-Plus stays the universal default**, both because consumers already pin to it and because its violet wash reads as the brand's identity colour.

## Schema impact

`dist/themes.json` keeps both shapes (`themes` flat map + `families` grouped map). `schemaVersion` stays at 1 since the field set is unchanged. `pkgVersion` bumps to 0.4.0 to signal the breaking content change. Cache-aware consumers refetch on the version bump.
