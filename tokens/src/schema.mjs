// ============================================================================
// waki-themes / schema.mjs
// ----------------------------------------------------------------------------
// The canonical token contract every theme CSS file MUST honour. Build-time
// validation (see scripts/validate-themes.mjs) parses each themed CSS file
// and fails the build if any selector here is missing.
//
// This file is the single source of truth for "what does a theme have to
// provide". When a consumer needs a new token / class to render correctly,
// add it here AND update each themed CSS file to declare it. The validator
// then refuses to ship themes that don't.
//
// Rationale: the v0.4.0 Frosted Glass production bug had buttons rendering
// with no background because every consumer-button was styled by hard-coded
// Tailwind classes (bg-sky-600 etc.) that the theme had no control over.
// Adding `.btn-*` selectors to the contract pulls button styling INTO the
// theme system so each theme can pick its own button palette and so missing
// coverage fails the build instead of leaking into production.
// ============================================================================

// REQUIRED selectors. Every theme CSS in styles/ (except base.css) must
// declare each of these. The validator checks for the literal selector
// substring; matched/composed forms (e.g. `.glass-elevated:hover`) count.
export const REQUIRED_SELECTORS = [
  // Surface contract (existing).
  ".glass",
  ".glass-elevated",
  ".glass-bar",
  ".chip",
  ".divider-soft",

  // Action button contract (new in v0.4.0). Every theme must define how
  // the four primary button intents render. See SCHEMA.md for semantics.
  ".btn-primary",
  ".btn-secondary",
  ".btn-warning",
  ".btn-danger",
  ".btn-ghost",

  // Status + form contract (promoted from recommended in v0.4.1 once
  // every theme covered them).
  ".btn-success",
  ".status-success",
  ".status-warning",
  ".status-error",
  ".status-info",
  ".input",
];

// REQUIRED root rules. Every theme must paint the page body in both
// modes. The default convention is light-canonical (`body { ... }` for
// light, `html.dark body { ... }` for dark), but dark-canonical themes
// like Neon paint dark in `body { ... }` and light in
// `html.light body { ... }`. Both shapes count.
export const REQUIRED_ROOT_PATTERNS = [
  { name: "body rule", test: (src) => /^body\b/m.test(src) },
  {
    name: "mode-flip rule (html.dark body or html.light body)",
    test: (src) => /^html\.dark body\b/m.test(src) || /^html\.light body\b/m.test(src),
  },
];

// SELECTORS we recommend but don't fail on. Useful for completeness
// checks. Empty as of v0.4.1; everything previously here was promoted
// to REQUIRED. Future tokens (.toast, .tooltip, etc.) land here first
// and get promoted once every theme covers them.
export const RECOMMENDED_SELECTORS = [];
