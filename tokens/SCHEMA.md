# Theme schema (v0.4.0)

The canonical contract every theme CSS file in `styles/` must honour. Build-time validation enforces it: a theme that misses any required selector fails `npm run build` with a clear error before `dist/themes.json` is regenerated.

The schema source of truth is [`src/schema.mjs`](src/schema.mjs). The validator that enforces it is [`scripts/validate-themes.mjs`](scripts/validate-themes.mjs).

## Why this exists

Pre-v0.4.0 the theme contract was implicit: a theme had to define `.glass`, `.glass-elevated`, `.glass-bar`, `.chip`, `.divider-soft`. Anything else (buttons, status colours, inputs) was the consumer's problem and got styled by hard-coded Tailwind classes that the theme could not influence.

Production bug ([CHANGELOG v0.4.0](CHANGELOG.md)): the Frosted Glass theme rendered Pause and Stop buttons with no visible chrome on `manager.3dbypixel.com/dashboard` because the theme had no say in button rendering. A schema with build-time validation pulls those tokens INTO the theme system and refuses to ship themes with incomplete coverage.

## Required selectors

Every theme CSS file MUST declare each of these. The validator parses each file and fails the build if any are missing. Composed forms (`.btn-primary:hover`, `html.dark .btn-primary`) count as declarations.

### Surface contract (existing)

| Selector | What it styles | Notes |
|---|---|---|
| `.glass` | Cards, panels, sidebars, list items | The everyday surface |
| `.glass-elevated` | Detail panes, modals, raised surfaces | Sits visually above `.glass` |
| `.glass-bar` | Sticky headers, bottom nav, breadcrumbs | Often higher saturation / more blur |
| `.chip` | Inline pills, tag chips | Compact label |
| `.divider-soft` | Hairline dividers between rows | Border-color is the only required prop |

### Action button contract (new in v0.4.0)

| Selector | Intent | Visual cue |
|---|---|---|
| `.btn-primary` | Confirm-positive actions | Brand accent fill, white text |
| `.btn-secondary` | Neutral / cancel-positive | Muted panel, theme text |
| `.btn-warning` | Cautious actions (Stop, Pause) | Amber fill |
| `.btn-danger` | Destructive actions (Delete) | Red fill |
| `.btn-ghost` | Low-prominence actions (Cancel in dialogs) | Transparent, subtle hover |
| `.btn-success` | Positive confirm (promoted to required in v0.4.1) | Green fill |

Themes load AFTER waki-shell's `utilities.css` in the cascade, so equal-specificity rules in the theme override the consumer's defaults without `!important`.

### Status badge / toast contract (promoted to required in v0.4.1)

| Selector | Intent |
|---|---|
| `.status-success` | Success notice |
| `.status-warning` | Caution notice |
| `.status-error` | Failure notice |
| `.status-info` | Informational notice |

### Form contract (promoted to required in v0.4.1)

| Selector | Intent |
|---|---|
| `.input` | Form text inputs (focus ring uses theme accent) |

### Required root rules

Every theme must paint:
- `body` (light-mode page background and text colour OR dark-canonical such as Neon)
- `html.dark body` OR `html.light body` (the mode-flip rule, whichever is the non-canonical mode for the theme)

### Recommended (warned, not blocked)

The recommended list is currently empty as of v0.4.1. Future tokens (`.toast`, `.tooltip`, etc.) land here first and get promoted to required once every theme covers them.

## Validation

`npm run build` runs `scripts/validate-themes.mjs` first. The validator:

1. Reads `src/schema.mjs` for the required-selector list
2. Reads each `styles/*.css` (except `base.css`)
3. For each theme, checks that every required selector appears at least once
4. Logs warnings for missing recommended selectors
5. Exits with a non-zero status on any required-selector miss; bundle build aborts

Run the validator manually:

```bash
node scripts/validate-themes.mjs
```

## Adding a new required selector

When a consumer needs a new token / class to render correctly across themes:

1. Add the selector to `REQUIRED_SELECTORS` in `src/schema.mjs`
2. Add a row to the table above in this file
3. Add the selector + sensible defaults to every theme CSS file in `styles/` (or extend `scripts/gen-themes.mjs` for the generated themes)
4. Run `node scripts/validate-themes.mjs` to confirm coverage
5. Update [CHANGELOG.md](CHANGELOG.md) so consumers know to expect the new tokens

The validator refuses to ship until every theme covers the new selector, so the pattern that caused the v0.4.0 bug cannot recur.

## Cross-coordination with waki-shell

Future state: `waki-shell` components consume theme tokens through CSS custom properties (`var(--btn-primary-bg, #6366f1)`) rather than hard-coded Tailwind utility classes. When that lands, the schema will gain a `REQUIRED_VARIABLES` list alongside the current `REQUIRED_SELECTORS`, and the validator will check both. Tracked in [foundation-hosting-migration](https://github.com/wwahmed/waki-homelab/blob/main/projects/foundation-hosting-migration.md).
