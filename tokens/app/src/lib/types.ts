// Shape of dist/themes.json. Mirrors scripts/build-bundle.mjs output.
//
// The flat `themes` map is the original contract every existing
// consumer (printer-dashboard, brain-v2, waki-shell) reads. Each entry
// now carries `family` / `variantSlot` cross-references but the legacy
// fields (name, description, vibe, css) are unchanged.
//
// The new `families` map is additive. The studio uses it for the
// two-step Family then Variant picker. Future consumers can adopt the
// grouped shape on their own timeline.
export interface ThemeBundleEntry {
  name: string;
  description: string;
  vibe: string;
  css: string;
  family?: string | null;
  familyName?: string | null;
  variantSlot?: string | null;
  variantName?: string | null;
}

export interface PaletteHints {
  bgFrom: string;
  bgTo: string;
  panel: string;
  border: string;
  text: string;
  accent: string;
}

export interface FamilyStructure {
  radius: number;
  blur: number;
  shadow: string;
  surface: string;
  iconography: string;
  density: string;
}

export interface BundleVariant {
  slot: string;
  themeId: string;
  name: string;
  description: string;
  palette: { light: PaletteHints; dark: PaletteHints };
}

export interface BundleFamily {
  name: string;
  description: string;
  structure: FamilyStructure;
  variants: BundleVariant[];
}

export interface ThemeBundle {
  schemaVersion: number;
  pkgVersion: string;
  gitSha: string;
  builtAt: string;
  base: string;
  themes: Record<string, ThemeBundleEntry>;
  families?: Record<string, BundleFamily>;
}

// Family-level structure tokens. When edited, these propagate to every
// variant in the family (the studio just rebuilds each variant's
// override CSS with the new family-shared values).
export interface FamilyOverrideTokens {
  radiusPx: number;
  blurPx: number;
}

// Studio-side overlay tokens. Applied as a layer of CSS rules on top
// of the base theme CSS to let the user tweak high-impact knobs
// without forking the underlying stylesheet. See
// lib/overrideCss.ts for how these get serialised.
//
// Note radiusPx + blurPx live here AND in FamilyOverrideTokens. When
// editing inside the family-level tab, they're driven from the family
// override and applied uniformly. When editing inside the variant-level
// tab, they can drift per-variant if the user wants to override the
// family default.
export interface OverrideTokens {
  // Page background gradient stops (light + dark variants).
  bgFromLight: string;
  bgToLight: string;
  bgFromDark: string;
  bgToDark: string;
  // Panel surface fill (rgba allowed). Light + dark.
  panelLight: string;
  panelDark: string;
  // Border colour on panels.
  borderLight: string;
  borderDark: string;
  // Text colour on body. Light + dark.
  textLight: string;
  textDark: string;
  // Accent colour. Used for the chip outline + the primary button.
  accent: string;
  // Numeric tokens.
  radiusPx: number;
  blurPx: number;
}

export interface StudioTheme {
  id: string;
  name: string;
  description: string;
  vibe: string;
  // The base CSS the studio renders. For built-in themes this is the
  // string from dist/themes.json. For user-created themes this is the
  // generated overlay CSS (since they have no hand-authored base).
  baseCss: string;
  // True if this is a hand-authored theme shipped in the repo. False
  // for themes the user invented in the studio session.
  builtIn: boolean;
  // Optional starting overrides for user-created themes.
  overrides?: OverrideTokens;
  // Family / variant cross-references. Null on user-created themes
  // until they're explicitly placed in a family.
  familyId?: string | null;
  familyName?: string | null;
  variantSlot?: string | null;
  variantName?: string | null;
}
