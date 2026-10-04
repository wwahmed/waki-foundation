// WCAG AA contrast checker. Conservative: surfaces a warning if any
// text/background pair is below 4.5:1 (normal text) or 3:1 (large
// text). Never blocks save; only nudges.

function parseToRgb(color: string): [number, number, number] | null {
  const c = color.trim();
  const hex = /^#([0-9a-fA-F]{3,8})$/.exec(c);
  if (hex) {
    const h = hex[1];
    if (h.length === 3 || h.length === 4) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16),
      ];
    }
    if (h.length === 6 || h.length === 8) {
      return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
      ];
    }
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

// Compose an rgba foreground over an opaque rgb background. The CSS
// engine does this for us at paint time; we replicate it here so the
// contrast number reflects what the user actually sees.
function compositeOver(
  fg: [number, number, number, number],
  bg: [number, number, number],
): [number, number, number] {
  const [r1, g1, b1, a] = fg;
  const [r2, g2, b2] = bg;
  return [
    Math.round(r1 * a + r2 * (1 - a)),
    Math.round(g1 * a + g2 * (1 - a)),
    Math.round(b1 * a + b2 * (1 - a)),
  ];
}

function parseAlphaColor(color: string): [number, number, number, number] | null {
  const c = color.trim();
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/.exec(c);
  if (rgba) {
    return [
      Number(rgba[1]),
      Number(rgba[2]),
      Number(rgba[3]),
      rgba[4] === undefined ? 1 : Number(rgba[4]),
    ];
  }
  const rgb = parseToRgb(c);
  if (rgb) return [rgb[0], rgb[1], rgb[2], 1];
  return null;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const norm = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * norm(r) + 0.7152 * norm(g) + 0.0722 * norm(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const f = parseAlphaColor(fg);
  const b = parseToRgb(bg);
  if (!f || !b) return 0;
  const composed = f[3] >= 0.999 ? [f[0], f[1], f[2]] as [number, number, number] : compositeOver(f, b);
  const l1 = relativeLuminance(composed);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface ContrastReport {
  pair: string;
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  // Free-form hint for the user when the pair fails AA. Surfaces in
  // the editor's WCAG panel so a glance tells them what to nudge.
  suggest?: string;
}

// For the bg, we approximate the panel surface as the panel colour
// composited over the first gradient stop. This gives a closer match
// to what the user actually sees than checking against the bare
// gradient stop.
export function reportContrasts(opts: {
  textLight: string;
  textDark: string;
  panelLight: string;
  panelDark: string;
  bgFromLight: string;
  bgFromDark: string;
  accent: string;
}): ContrastReport[] {
  const composedPanelLight = composeAlphaOnHex(opts.panelLight, opts.bgFromLight);
  const composedPanelDark = composeAlphaOnHex(opts.panelDark, opts.bgFromDark);

  const ratios: { pair: string; ratio: number }[] = [
    {
      pair: "Light: text on panel",
      ratio: contrastRatio(opts.textLight, composedPanelLight),
    },
    {
      pair: "Dark: text on panel",
      ratio: contrastRatio(opts.textDark, composedPanelDark),
    },
    {
      pair: "Light: text on page bg",
      ratio: contrastRatio(opts.textLight, opts.bgFromLight),
    },
    {
      pair: "Dark: text on page bg",
      ratio: contrastRatio(opts.textDark, opts.bgFromDark),
    },
    {
      pair: "Accent on panel (light)",
      ratio: contrastRatio(opts.accent, composedPanelLight),
    },
    {
      pair: "Accent on panel (dark)",
      ratio: contrastRatio(opts.accent, composedPanelDark),
    },
  ];

  return ratios.map((r) => {
    const pass = r.ratio >= 4.5;
    const aaLarge = r.ratio >= 3;
    let suggest: string | undefined;
    if (!pass) {
      if (r.pair.startsWith("Accent")) {
        suggest = aaLarge
          ? "OK for large text only. For body text on accent backgrounds, deepen the accent hue (e.g. 600 -> 700) or lighten the panel."
          : "Accent reads as decorative only at this contrast. Use a darker accent or higher panel contrast for legibility.";
      } else if (r.pair.includes("text on panel")) {
        suggest = aaLarge
          ? "Headings only. For body copy, deepen the text color or raise the panel opacity."
          : "Body text won't pass WCAG. Try a darker text color or a more opaque panel.";
      } else {
        suggest = aaLarge
          ? "Headings only at this ratio."
          : "Increase the bg / text gap; either darken the text or lighten the bg.";
      }
    }
    return {
      pair: r.pair,
      ratio: Number(r.ratio.toFixed(2)),
      aaNormal: pass,
      aaLarge,
      suggest,
    };
  });
}

function composeAlphaOnHex(maybeAlphaColor: string, hexBg: string): string {
  const fg = parseAlphaColor(maybeAlphaColor);
  const bg = parseToRgb(hexBg);
  if (!fg || !bg) return hexBg;
  if (fg[3] >= 0.999) return rgbToHex([fg[0], fg[1], fg[2]]);
  return rgbToHex(compositeOver(fg, bg));
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
