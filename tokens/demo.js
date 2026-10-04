/* ============================================================================
 * waki-themes / demo.js
 * ----------------------------------------------------------------------------
 * Theme switcher logic for the WakiMail demo page.
 * - swap stylesheets to flip themes (flat / glass-v1 / glass-v2)
 * - flip the html.dark class to toggle light/dark mode
 * - persist both choices in localStorage so a refresh keeps the look
 * - simple "click an email row to select it" interaction so the demo
 *   feels alive without dragging in a framework
 * ============================================================================ */

const THEMES = [
  "flat", "glass-v1", "glass-v2", "glass-v3", "glass-extreme", "frosted-glass",
  "neumorphism", "neon",
  "ocean", "sunset", "forest", "arctic", "lavender", "rose-gold",
  "midnight", "copper", "emerald", "sakura", "slate-modern", "nord",
];
const MODES = ["light", "dark"];
const STORAGE_THEME = "waki-theme";
const STORAGE_MODE = "waki-mode";

/** Update the <link id="theme-css"> href so the chosen stylesheet loads.
 *  Browsers transition smoothly between rule sets without a flash —
 *  borders/shadows/blur cross-fade as the new file applies. */
function setTheme(theme) {
  if (!THEMES.includes(theme)) return;
  const link = document.getElementById("theme-css");
  if (!link) return;
  link.href = `styles/${theme}.css`;
  try { localStorage.setItem(STORAGE_THEME, theme); } catch {}
  document.querySelectorAll("[data-theme]").forEach((b) => {
    b.classList.toggle("active", b.dataset.theme === theme);
  });
}

function setMode(mode) {
  if (!MODES.includes(mode)) return;
  const html = document.documentElement;
  if (mode === "dark") {
    html.classList.add("dark");
    html.classList.remove("light");
  } else {
    html.classList.add("light");
    html.classList.remove("dark");
  }
  try { localStorage.setItem(STORAGE_MODE, mode); } catch {}
  document.querySelectorAll("[data-mode]").forEach((b) => {
    b.classList.toggle("active", b.dataset.mode === mode);
  });
}

/** Read saved choices (defaulting to glass-v2 + dark) and apply them
 *  before wiring up listeners. The inline script in index.html
 *  pre-applies the dark/light class, so we just sync our state to
 *  match. */
function bootstrap() {
  let theme = "glass-v2";
  let mode = "dark";
  try {
    const t = localStorage.getItem(STORAGE_THEME);
    const m = localStorage.getItem(STORAGE_MODE);
    if (THEMES.includes(t)) theme = t;
    if (MODES.includes(m)) mode = m;
  } catch {}
  setTheme(theme);
  setMode(mode);

  // Wire up switcher buttons
  document.querySelectorAll("[data-theme]").forEach((b) => {
    b.addEventListener("click", () => setTheme(b.dataset.theme));
  });
  document.querySelectorAll("[data-mode]").forEach((b) => {
    b.addEventListener("click", () => setMode(b.dataset.mode));
  });

  // Email row → detail pane wiring. Each .email-row carries data-* fields
  // for the detail pane to read, so adding a new email just means adding
  // another row in the HTML — no JS change needed.
  document.querySelectorAll(".email-row").forEach((row) => {
    row.addEventListener("click", () => {
      document
        .querySelectorAll(".email-row")
        .forEach((r) => r.classList.remove("selected"));
      row.classList.add("selected");
      const detail = document.getElementById("email-detail");
      if (!detail) return;
      detail.querySelector("[data-detail-from]").textContent = row.dataset.from || "";
      detail.querySelector("[data-detail-subject]").textContent = row.dataset.subject || "";
      detail.querySelector("[data-detail-time]").textContent = row.dataset.time || "";
      detail.querySelector("[data-detail-body]").textContent = row.dataset.body || "";
      const initials = (row.dataset.from || "?")
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      detail.querySelector("[data-detail-initials]").textContent = initials;
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
