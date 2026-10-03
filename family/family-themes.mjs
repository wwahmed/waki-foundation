/**
 * The Waki family themes: the one place they are written down.
 *
 * Every Waki app offers exactly these five, native and web:
 *
 *   mac        Mac         macOS-native neutral with the system blue      (WakiKit's Mac, as before)
 *   boardroom  Boardroom   cool blue-grey, clear blue; WOV's tuned Slate  (scales from WOV, unchanged)
 *   graphite   Graphite    warm stone and paper, deep amber; WOV's Paper (scales from WOV, unchanged)
 *   civic      Civic       navy glass with an amber glow; Waki AI Service (pack waki-glass-civic values)
 *   cobalt     Cobalt      midnight navy, cobalt and indigo; Manager      (Manager's cobalt.css values)
 *
 * Each theme has:
 *   roles     the 15 named colours per mode the Mac apps use (WakiKit WakiPaletteSource), written out
 *             (`roles`) or derived from the scales with WOV's mapping (`roles: "fromScales"`);
 *   scales    two 11-step ramps (neutral, accent) for scale-based apps such as WOV, given exactly or
 *             built from a seed colour on WOV Slate's luminance rhythm;
 *   extended  roles Manager needs beyond the 15 (card header, slot, thumbnail, status colours…),
 *             written out for Cobalt and derived for the rest;
 *   structure the waki-themes material/variant whose geometry, blur and shadows the web CSS borrows.
 *
 * scripts/gen-family.mjs resolves all of this into dist/family.json (read by WakiKit's importer and
 * by apps), src/themes/family.mjs (read by gen-v2 to write styles/waki-family-*.css), and checks
 * every theme against WOV's contrast bar in both modes. Edit here, then `npm run gen:family`.
 */

/** WOV's three tuned themes (WakiOutlookViewer packages/frontend/src/lib/themes.ts), verbatim. */
const WOV = {
  slate: {
    neutral: { 50: "#f3f7fa", 100: "#eef2f7", 200: "#e0e7ef", 300: "#c7d1de", 400: "#a7b5c8", 500: "#5b6d86", 600: "#4b5f7d", 700: "#3d5273", 800: "#324663", 900: "#243550", 950: "#142640" },
    accent: { 50: "#ecf6fe", 100: "#d8edff", 200: "#b4dcfe", 300: "#86cafe", 400: "#64bcfe", 500: "#0a90e3", 600: "#0571bd", 700: "#005ca4", 800: "#094a89", 900: "#103c6b", 950: "#102e52" },
  },
  graphite: {
    neutral: { 50: "#f5f5f7", 100: "#eeeef1", 200: "#e2e3e6", 300: "#cecfd3", 400: "#a2a2a9", 500: "#6a6971", 600: "#53535a", 700: "#3d3c42", 800: "#29292d", 900: "#1c1c1f", 950: "#141417" },
    accent: { 50: "#edf4ff", 100: "#dceafe", 200: "#bbd8fe", 300: "#95c2fb", 400: "#6ea6f1", 500: "#4a87dd", 600: "#3068b8", 700: "#27559b", 800: "#28487f", 900: "#1f3861", 950: "#172846" },
  },
  paper: {
    neutral: { 50: "#f7f4f0", 100: "#f1ede8", 200: "#e5e0da", 300: "#d3cdc5", 400: "#a9a19b", 500: "#706963", 600: "#59524e", 700: "#423d3a", 800: "#2d2a27", 900: "#201d1b", 950: "#171514" },
    accent: { 50: "#fef2e1", 100: "#ffe3c1", 200: "#fec88c", 300: "#f4a85b", 400: "#ea913c", 500: "#d0701a", 600: "#aa4f02", 700: "#8d3f0e", 800: "#75391b", 900: "#5d2f19", 950: "#422214" },
  },
};

/** The luminance rhythm generated scales follow (WOV Slate). */
export const REFERENCE = WOV.slate;

export const FAMILY_THEMES = [
  {
    id: "mac",
    name: "Mac",
    description: "Neutral surfaces and the macOS system blue. Feels at home next to every other Mac app.",
    structure: { material: "system", variant: "mac" },
    roles: {
      light: {
        "bg-1": "#f5f5f7", "bg-2": "#eceef2", "bg-3": "#ffffff",
        panel: "rgba(255,255,255,.72)", "panel-2": "rgba(255,255,255,.92)", "panel-3": "#f2f2f7",
        bar: "rgba(255,255,255,.86)", border: "rgba(60,60,67,.16)", "border-2": "rgba(0,122,255,.35)",
        text: "#1d1d1f", muted: "#6e6e73", accent: "#007aff", "accent-2": "#5e5ce6",
        focus: "rgba(0,122,255,.28)", shadow: "rgba(0,0,0,.12)",
      },
      dark: {
        "bg-1": "#1c1c1e", "bg-2": "#141416", "bg-3": "#232326",
        panel: "rgba(44,44,46,.72)", "panel-2": "rgba(58,58,60,.85)", "panel-3": "#2c2c2e",
        bar: "rgba(28,28,30,.9)", border: "rgba(84,84,88,.55)", "border-2": "rgba(10,132,255,.45)",
        text: "#f5f5f7", muted: "#a1a1a6", accent: "#0a84ff", "accent-2": "#5e5ce6",
        focus: "rgba(10,132,255,.32)", shadow: "rgba(0,0,0,.5)",
      },
    },
    // WOV's Graphite (neutral grey) folds into Mac: its neutral ramp is Mac's greys.
    // Its accent ramp follows WOV Graphite's rhythm, which was tuned against these greys.
    scales: { neutral: WOV.graphite.neutral, accent: { seed: "#007aff", chroma: 0.2, reference: WOV.graphite.accent } },
    // White on the macOS system blue is macOS's own control pairing (4.2:1); kept for fidelity.
    // Text on the accent in web apps uses on-accent on the darker accent-text where it matters.
    exceptions: ["light on-accent on accent"],
  },
  {
    id: "boardroom",
    name: "Boardroom",
    description: "Cool blue-grey with a clear blue accent. The Waki professional look.",
    structure: { material: "professional", variant: "boardroom" },
    roles: "fromScales",
    scales: WOV.slate,
  },
  {
    id: "graphite",
    name: "Graphite",
    description: "Warm stone and paper tones with a deep amber accent. Easy on the eyes.",
    structure: { material: "desktop", variant: "graphite" },
    roles: "fromScales",
    scales: WOV.paper,
  },
  {
    id: "civic",
    name: "Civic",
    description: "Navy glass with an amber glow. Waki AI Service's look.",
    structure: { material: "glass", variant: "civic" },
    roles: {
      light: {
        "bg-1": "color-mix(in srgb, #eef4ff 88%, #2563eb)", "bg-2": "color-mix(in srgb, #fff8ea 88%, #d97706)",
        "bg-3": "color-mix(in srgb, #f8fbff 76%, #eef4ff)",
        panel: "color-mix(in srgb, rgba(255,255,255,.68) 70%, #eef4ff)",
        "panel-2": "color-mix(in srgb, rgba(255,255,255,.84) 76%, #fff8ea)",
        "panel-3": "color-mix(in srgb, #eef4ff 92%, #2563eb)",
        bar: "color-mix(in srgb, rgba(255,255,255,.84) 76%, #fff8ea)",
        border: "color-mix(in srgb, rgba(37,99,235,.22) 82%, #2563eb)",
        "border-2": "color-mix(in srgb, rgba(251,191,36,.28) 78%, #d97706)",
        text: "#12213d", muted: "#56667c", accent: "#2563eb", "accent-2": "#d97706",
        focus: "rgba(37,99,235,.24)", shadow: "color-mix(in srgb, rgba(30,64,175,.16) 84%, #2563eb)",
      },
      dark: {
        "bg-1": "#061329", "bg-2": "#24180a", "bg-3": "#071b2b",
        panel: "rgba(37,99,235,.14)", "panel-2": "rgba(10,27,57,.78)", "panel-3": "rgba(33,25,13,.74)",
        bar: "rgba(10,27,57,.78)", border: "rgba(251,191,36,.26)", "border-2": "rgba(96,165,250,.24)",
        text: "#edf4ff", muted: "#b6c4d9", accent: "#60a5fa", "accent-2": "#fbbf24",
        focus: "rgba(96,165,250,.24)", shadow: "rgba(0,0,0,.45)",
      },
    },
    scales: { neutral: { seed: "#0a1b39", chroma: 0.06 }, accent: { seed: "#2563eb", chroma: 0.19 } },
    blobs: {
      light: ["rgba(37,99,235,.12)", "rgba(217,119,6,.1)", "rgba(96,165,250,.08)"],
      dark: ["rgba(37,99,235,.24)", "rgba(251,191,36,.12)", "rgba(15,118,110,.1)"],
    },
  },
  {
    id: "cobalt",
    name: "Cobalt",
    description: "Midnight navy with cobalt and indigo. Manager 3dByPixel's look.",
    structure: { material: "studio", variant: "cobalt" },
    roles: {
      light: {
        "bg-1": "#ffffff", "bg-2": "#f4f7fe", "bg-3": "#ffffff",
        panel: "#fdfdff", "panel-2": "#e6ecfa", "panel-3": "#d6e0f8",
        bar: "#e6ecfa", border: "rgba(20,32,80,.16)", "border-2": "rgba(20,32,80,.2)",
        text: "#0f1732", muted: "#4a5480", accent: "#1746d8", "accent-2": "#5b2fd6",
        focus: "rgba(23,70,216,.24)", shadow: "rgba(15,23,50,.1)",
      },
      dark: {
        "bg-1": "#080b14", "bg-2": "#0c1122", "bg-3": "#0a0e1b",
        panel: "#161c34", "panel-2": "#101528", "panel-3": "#1a2140",
        bar: "#101528", border: "rgba(255,255,255,.08)", "border-2": "rgba(255,255,255,.15)",
        text: "#e6e9f7", muted: "#949dc0", accent: "#7fa5ff", "accent-2": "#a98cff",
        focus: "rgba(127,165,255,.24)", shadow: "rgba(0,0,0,.5)",
      },
    },
    // Manager's own tokens (apps/manager/frontend/src/theme/cobalt.css), value for value, except two
    // light-mode colours that failed as text on its white cards: danger #f0768a (2.9:1) and teal
    // info #0a86c4 (4.0:1), darkened to pass 4.5:1.
    extended: {
      light: {
        "panel-head": "#d6e0f8", slot: "#eef3fe", thumb: "#d5ddf4", "text-2": "#333d63", dim: "#6a749c",
        "accent-text": "#1235a6", "on-accent": "#ffffff", success: "#047857", warning: "#c07a08",
        "warning-text": "#8f5b06", danger: "#c0354f", info: "#0877b2",
        progress: "linear-gradient(90deg, #1746d8, #5b2fd6)",
      },
      dark: {
        "panel-head": "#1a2140", slot: "#1c2344", thumb: "#0e1322", "text-2": "#b4bcda", dim: "#727b9e",
        "accent-text": "#a8c0ff", "on-accent": "#12131a", success: "#6ee7b7", warning: "#f0b84f",
        "warning-text": "#f0b84f", danger: "#f0768a", info: "#4fb8f0",
        progress: "linear-gradient(90deg, #7fa5ff, #a98cff)",
      },
    },
    scales: { neutral: { seed: "#161c34", chroma: 0.05 }, accent: { seed: "#1746d8", chroma: 0.2 } },
    fonts: { body: "\"IBM Plex Sans\"", mono: "\"IBM Plex Mono\"" },
  },
];

/** The old ids each family theme replaces, for apps migrating a stored choice. */
export const MIGRATIONS = {
  mac: ["mac", "waki-system-mac", "waki-system-windows"],
  boardroom: ["boardroom", "waki-professional-boardroom", "professional", "corporate"],
  graphite: ["graphite", "waki-desktop-graphite", "academic", "command"],
  civic: ["civic", "waki-glass-civic", "glass"],
  cobalt: ["cobalt", "waki-studio-cobalt", "studio"],
};

/** WOV's own three ids: Slate and Paper become Boardroom and Graphite unchanged; WOV's grey
 *  Graphite folds into Mac. (WOV's "graphite" is not the family Graphite.) */
export const WOV_MIGRATION = { slate: "boardroom", paper: "graphite", graphite: "mac" };
