import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, Download, Save, Sun, Moon, FileCode, Palette, Layers, RotateCcw } from "lucide-react";
import type { BundleFamily, OverrideTokens, StudioTheme } from "../lib/types";
import { buildOverrideCss, buildStandaloneThemeCss } from "../lib/overrideCss";
import { reportContrasts } from "../lib/contrast";
import { PREVIEW_HTML } from "../lib/sample";
import { PreviewFrame } from "./PreviewFrame";
import { ContrastReport } from "./ContrastReport";

interface EditorProps {
  theme: StudioTheme;
  family?: BundleFamily;
  initialOverrides: OverrideTokens;
  mode: "light" | "dark";
  onBack: () => void;
  onSave: (id: string, name: string, description: string, overrides: OverrideTokens) => void;
  onSaveFamilyStructure?: (familyId: string, radiusPx: number, blurPx: number) => void;
  onModeChange: (m: "light" | "dark") => void;
  defaultName?: string;
  isNew?: boolean;
  startTab?: "family" | "variant";
}

const COLOR_FIELDS: Array<{ key: keyof OverrideTokens; label: string; group: "Light" | "Dark" | "Accent" }> = [
  { key: "bgFromLight", label: "Page bg from", group: "Light" },
  { key: "bgToLight", label: "Page bg to", group: "Light" },
  { key: "panelLight", label: "Panel surface", group: "Light" },
  { key: "borderLight", label: "Border", group: "Light" },
  { key: "textLight", label: "Text", group: "Light" },
  { key: "bgFromDark", label: "Page bg from", group: "Dark" },
  { key: "bgToDark", label: "Page bg to", group: "Dark" },
  { key: "panelDark", label: "Panel surface", group: "Dark" },
  { key: "borderDark", label: "Border", group: "Dark" },
  { key: "textDark", label: "Text", group: "Dark" },
  { key: "accent", label: "Accent", group: "Accent" },
];

export function Editor({
  theme,
  family,
  initialOverrides,
  mode,
  onBack,
  onSave,
  onSaveFamilyStructure,
  onModeChange,
  defaultName,
  isNew = false,
  startTab = "variant",
}: EditorProps) {
  const [overrides, setOverrides] = useState<OverrideTokens>(initialOverrides);
  const [name, setName] = useState(defaultName ?? `${theme.name}${isNew ? "" : " Custom"}`);
  const [description, setDescription] = useState(theme.description);
  const [savedHint, setSavedHint] = useState<string | null>(null);
  const [tab, setTab] = useState<"family" | "variant">(family ? startTab : "variant");

  const overrideCss = useMemo(() => buildOverrideCss(overrides), [overrides]);
  const standaloneCss = useMemo(
    () => buildStandaloneThemeCss(overrides, name),
    [overrides, name],
  );

  const reports = useMemo(
    () =>
      reportContrasts({
        textLight: overrides.textLight,
        textDark: overrides.textDark,
        panelLight: overrides.panelLight,
        panelDark: overrides.panelDark,
        bgFromLight: overrides.bgFromLight,
        bgFromDark: overrides.bgFromDark,
        accent: overrides.accent,
      }),
    [overrides],
  );

  const update = <K extends keyof OverrideTokens>(k: K, v: OverrideTokens[K]) => {
    setOverrides((prev) => ({ ...prev, [k]: v }));
    setSavedHint(null);
  };

  const handleReset = () => {
    setOverrides(initialOverrides);
    setSavedHint("Reset to the variant's seed values.");
  };

  // Keyboard shortcuts. Esc -> back to gallery, Cmd/Ctrl-S -> save in
  // session. We don't listen on the password / colour / range inputs
  // by accident because the shortcut keys here aren't text-keys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onBack();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (tab === "family" && family) {
          handleSaveFamilyStructure();
        } else {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // We intentionally re-bind on every render so the captured closure
    // sees the latest name/description/overrides state. Cheap; the
    // event target is window and the handler is light.
  });

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

  const handleSave = () => {
    const id = slugify(name) || `theme-${Date.now()}`;
    onSave(id, name, description, overrides);
    setSavedHint(`Saved as "${name}" in this session.`);
  };

  const handleSaveFamilyStructure = () => {
    if (!family || !onSaveFamilyStructure) return;
    const familyId = theme.familyId;
    if (!familyId) return;
    onSaveFamilyStructure(familyId, overrides.radiusPx, overrides.blurPx);
    setSavedHint(
      `Applied radius ${overrides.radiusPx}px + blur ${overrides.blurPx}px to all ${family.variants.length} ${family.name} variants.`,
    );
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const exportCss = () => {
    const id = slugify(name) || "untitled";
    downloadFile(`${id}.css`, standaloneCss, "text/css");
  };

  const exportJson = () => {
    const id = slugify(name) || "untitled";
    const payload = {
      schemaVersion: 1,
      id,
      name,
      description,
      vibe: theme.vibe,
      familyId: theme.familyId ?? null,
      variantSlot: theme.variantSlot ?? null,
      overrides,
      generatedAt: new Date().toISOString(),
    };
    downloadFile(`${id}.theme.json`, JSON.stringify(payload, null, 2), "application/json");
  };

  const copyCss = async () => {
    await navigator.clipboard.writeText(standaloneCss);
    setSavedHint("Copied CSS to clipboard.");
  };

  const grouped = {
    Light: COLOR_FIELDS.filter((f) => f.group === "Light"),
    Dark: COLOR_FIELDS.filter((f) => f.group === "Dark"),
    Accent: COLOR_FIELDS.filter((f) => f.group === "Accent"),
  };

  const previewBase = isNew ? "" : theme.baseCss;
  const previewOverrides = isNew ? standaloneCss : overrideCss;

  const showFamilyTab = !!family && !isNew;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 h-[calc(100vh-92px)]">
      <aside className="studio-panel p-4 overflow-y-auto flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="studio-button text-xs px-2 py-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <span className="text-xs opacity-60 ml-auto">{isNew ? "New" : "Edit"}</span>
        </div>

        {showFamilyTab && (
          <div className="flex gap-1 p-1 rounded-lg bg-violet-500/10">
            <button
              onClick={() => setTab("family")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                tab === "family" ? "bg-violet-500 text-white" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Family
            </button>
            <button
              onClick={() => setTab("variant")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                tab === "variant" ? "bg-violet-500 text-white" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Variant
            </button>
          </div>
        )}

        {tab === "family" && family ? (
          <>
            <div className="rounded-lg bg-violet-500/8 px-3 py-2.5 text-xs">
              <div className="font-bold mb-1">{family.name} family</div>
              <p className="opacity-70 leading-relaxed">{family.description}</p>
              <p className="opacity-60 mt-1.5 text-[11px]">
                Family-level changes propagate to all {family.variants.length} variants.
              </p>
            </div>

            <section>
              <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-2">
                Structure (shared)
              </h3>
              <SliderField
                label="Radius"
                value={overrides.radiusPx}
                onChange={(v) => update("radiusPx", v)}
                min={0}
                max={32}
                unit="px"
              />
              <SliderField
                label="Backdrop blur"
                value={overrides.blurPx}
                onChange={(v) => update("blurPx", v)}
                min={0}
                max={40}
                unit="px"
              />
            </section>

            <section className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs leading-relaxed">
              <div className="font-semibold mb-0.5">Read-only family knobs</div>
              <div className="opacity-75">
                Shadow, surface treatment, iconography and density are baked into each family's
                hand-authored CSS today. Edit the source CSS to change them.
              </div>
            </section>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-violet-500/15">
              <button
                onClick={handleSaveFamilyStructure}
                className="studio-button studio-button-primary flex-1"
              >
                <Save className="w-4 h-4" />
                Apply to all variants
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-[11px] font-semibold opacity-70 uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                className="studio-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="block text-[11px] font-semibold opacity-70 uppercase tracking-wider mb-1 mt-3">
                Description
              </label>
              <input
                className="studio-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {theme.familyId && theme.variantName && (
                <p className="text-[11px] opacity-60 mt-2">
                  Variant <span className="font-mono">{theme.variantName}</span> in the
                  {" "}
                  <span className="font-mono">{theme.familyName}</span> family.
                </p>
              )}
            </div>

            {(["Light", "Dark", "Accent"] as const).map((g) => (
              <section key={g}>
                <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-2">
                  {g}
                </h3>
                <div className="space-y-2">
                  {grouped[g].map((field) => (
                    <ColorField
                      key={field.key}
                      label={field.label}
                      value={overrides[field.key] as string}
                      onChange={(v) => update(field.key, v as OverrideTokens[typeof field.key])}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-2">
                Geometry (variant-specific)
              </h3>
              <SliderField
                label="Radius"
                value={overrides.radiusPx}
                onChange={(v) => update("radiusPx", v)}
                min={0}
                max={32}
                unit="px"
              />
              <SliderField
                label="Backdrop blur"
                value={overrides.blurPx}
                onChange={(v) => update("blurPx", v)}
                min={0}
                max={40}
                unit="px"
              />
            </section>

            <section>
              <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-2">
                Contrast (WCAG AA)
              </h3>
              <ContrastReport reports={reports} />
            </section>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-violet-500/15">
              <button onClick={handleSave} className="studio-button studio-button-primary flex-1">
                <Save className="w-4 h-4" />
                Save in session
              </button>
              <button onClick={exportCss} className="studio-button" title="Download CSS">
                <FileCode className="w-4 h-4" />
                CSS
              </button>
              <button onClick={exportJson} className="studio-button" title="Download token JSON">
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button onClick={copyCss} className="studio-button" title="Copy CSS to clipboard">
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={handleReset}
                className="studio-button"
                title="Reset overrides to the variant's seed values"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </>
        )}

        {savedHint && <p className="text-xs opacity-70">{savedHint}</p>}
      </aside>

      <main className="studio-panel overflow-hidden flex flex-col">
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-violet-500/15">
          <div className="text-xs font-medium opacity-70">
            {tab === "family" && family
              ? `Family preview (${theme.variantName ?? theme.name})`
              : "Live preview"}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onModeChange("light")}
              className={`studio-button text-xs ${mode === "light" ? "studio-button-primary" : ""}`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light
            </button>
            <button
              onClick={() => onModeChange("dark")}
              className={`studio-button text-xs ${mode === "dark" ? "studio-button-primary" : ""}`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
          </div>
        </div>
        <div className="flex-1">
          <PreviewFrame
            baseCss={previewBase}
            overrideCss={previewOverrides}
            html={PREVIEW_HTML}
            mode={mode}
            ariaLabel="Live preview"
          />
        </div>
      </main>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const hexForPicker = toHexish(value);
  return (
    <label className="flex items-center gap-2">
      <input
        type="color"
        value={hexForPicker}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-9 rounded cursor-pointer border-0 p-0 bg-transparent"
        aria-label={`${label} colour picker`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="studio-input flex-1 text-xs font-mono"
      />
      <span className="text-[10px] font-medium opacity-70 w-20 text-right truncate" title={label}>
        {label}
      </span>
    </label>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-mono opacity-70">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet-500"
      />
    </div>
  );
}

function toHexish(c: string): string {
  const trimmed = c.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) {
    if (trimmed.length === 4) {
      return (
        "#" +
        trimmed[1] +
        trimmed[1] +
        trimmed[2] +
        trimmed[2] +
        trimmed[3] +
        trimmed[3]
      );
    }
    return trimmed.slice(0, 7);
  }
  const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(trimmed);
  if (m) {
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
    return `#${toHex(Number(m[1]))}${toHex(Number(m[2]))}${toHex(Number(m[3]))}`;
  }
  return "#000000";
}
