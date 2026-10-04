/**
 * Colour math for the family generator: parse the CSS colours the themes use (hex, rgb/rgba,
 * `transparent`, nested `color-mix(in srgb, …)`), composite translucent colours over a backdrop,
 * WCAG contrast, and OKLab/OKLCH for building even 11-step scales (the way WOV built its own).
 */

const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));

/** { r, g, b, a } with channels 0..1. */
export function parse(css) {
  const s = String(css).trim().toLowerCase();
  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = h.replace(/./g, (c) => c + c);
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  if (s.startsWith("rgb")) {
    const parts = s.slice(s.indexOf("(") + 1, s.lastIndexOf(")")).split(/[\s,/]+/).filter(Boolean);
    const ch = (v) => (v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v) / 255);
    const a = parts[3] === undefined ? 1 : parts[3].endsWith("%") ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    return { r: ch(parts[0]), g: ch(parts[1]), b: ch(parts[2]), a };
  }
  if (s.startsWith("color-mix(")) {
    const inner = s.slice("color-mix(".length, s.lastIndexOf(")"));
    const args = splitTop(inner);
    // args[0] is "in srgb"
    const [c1, p1] = colorAndPercent(args[1]);
    const [c2, p2] = colorAndPercent(args[2]);
    let w1 = p1, w2 = p2;
    if (w1 == null && w2 == null) { w1 = 0.5; w2 = 0.5; }
    else if (w1 == null) w1 = 1 - w2;
    else if (w2 == null) w2 = 1 - w1;
    return mixColors(parse(c1), parse(c2), w2 / (w1 + w2));
  }
  throw new Error(`unparsable colour: ${css}`);
}

function splitTop(text) {
  const out = []; let depth = 0, cur = "";
  for (const c of text) {
    if (c === "(") depth++;
    if (c === ")") depth--;
    if (c === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function colorAndPercent(part) {
  const m = part.match(/^(.*?)(?:\s+(\d+(?:\.\d+)?)%)?$/);
  return [m[1].trim(), m[2] === undefined ? null : parseFloat(m[2]) / 100];
}

/** CSS color-mix in srgb (premultiplied); t is the share of b. */
export function mixColors(a, b, t) {
  const alpha = a.a * (1 - t) + b.a * t;
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const ch = (k) => (a[k] * a.a * (1 - t) + b[k] * b.a * t) / alpha;
  return { r: ch("r"), g: ch("g"), b: ch("b"), a: alpha };
}

/** A translucent colour painted over an opaque backdrop. */
export function over(top, backdrop) {
  const a = top.a;
  return { r: top.r * a + backdrop.r * (1 - a), g: top.g * a + backdrop.g * (1 - a), b: top.b * a + backdrop.b * (1 - a), a: 1 };
}

export function hex({ r, g, b }) {
  return "#" + [r, g, b].map((c) => Math.round(clamp(c) * 255).toString(16).padStart(2, "0")).join("");
}

export function luminance(c) {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
}

export function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// ── OKLab / OKLCH ──
function toLinear(v) { return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }
function fromLinear(v) { return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055; }

export function toOklch(c) {
  const r = toLinear(c.r), g = toLinear(c.g), b = toLinear(c.b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: (Math.atan2(B, A) * 180) / Math.PI };
}

export function fromOklch({ L, C, H }) {
  const A = C * Math.cos((H * Math.PI) / 180), B = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return { r: fromLinear(r), g: fromLinear(g), b: fromLinear(b), a: 1, inGamut: [r, g, b].every((v) => v >= -1e-4 && v <= 1 + 1e-4) };
}

/** One colour of hue H and chroma C at the given WCAG luminance (chroma reduced to stay in gamut). */
export function atLuminance(H, C, target) {
  for (let chroma = C; chroma >= 0; chroma -= 0.004) {
    let lo = 0, hi = 1, best = null;
    for (let i = 0; i < 40; i++) {
      const L = (lo + hi) / 2;
      const c = fromOklch({ L, C: chroma, H });
      const y = luminance({ r: clamp(c.r), g: clamp(c.g), b: clamp(c.b) });
      if (y < target) lo = L; else hi = L;
      best = c;
    }
    if (best.inGamut) return { r: clamp(best.r), g: clamp(best.g), b: clamp(best.b), a: 1 };
  }
  return atLuminance(H, 0, target);
}

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** An 11-step scale: fixed hue, a chroma curve that peaks mid-ramp, and each step's luminance
 *  taken from a reference scale (WOV's tuned Slate), so every generated scale has the same rhythm. */
export function buildScale(seedCss, peakChroma, referenceScale) {
  const H = toOklch(parse(seedCss)).H;
  const out = {};
  STEPS.forEach((step, i) => {
    const t = i / (STEPS.length - 1);
    const curve = Math.sin(Math.PI * Math.min(1, 0.15 + t * 0.85)) * 0.85 + 0.15;
    const target = luminance(parse(referenceScale[step]));
    out[step] = hex(atLuminance(H, peakChroma * curve, target));
  });
  return out;
}
