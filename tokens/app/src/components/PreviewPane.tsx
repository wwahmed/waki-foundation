import { Copy, Download, Edit3, Eye, Info, Moon, SlidersHorizontal, Sun } from "lucide-react";
import { MINIATURE_HTML, PREVIEW_HTML } from "../lib/sample";
import { PreviewFrame } from "./PreviewFrame";
import type { StudioTheme } from "../lib/types";

interface PreviewPaneProps {
  theme: StudioTheme;
  themes: StudioTheme[];
  mode: "light" | "dark";
  onEdit: () => void;
  onModeChange: (m: "light" | "dark") => void;
  onThemeChange: (id: string) => void;
}

export function PreviewPane({
  theme,
  themes,
  mode,
  onEdit,
  onModeChange,
  onThemeChange,
}: PreviewPaneProps) {
  const copyEmbed = async () => {
    const snippet = `<link rel="stylesheet" href="https://raw.githubusercontent.com/wwahmed/waki-themes/main/styles/base.css" />
<link rel="stylesheet" href="https://raw.githubusercontent.com/wwahmed/waki-themes/main/styles/${theme.id}.css" />`;
    await navigator.clipboard.writeText(snippet);
  };

  const downloadCss = () => {
    const blob = new Blob([theme.baseCss], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${theme.id}.css`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  return (
    <div className="theme-viewer">
      <div className="theme-viewer-top">
        <section className="viewer-meta-panel" aria-label="Theme metadata">
          <div className="viewer-section-label">
            <Info className="w-3.5 h-3.5" />
            Theme metadata
          </div>
          <div className="viewer-title-row">
            <h2>{theme.name}</h2>
            <span className="studio-chip">{theme.vibe}</span>
            {!theme.builtIn && <span className="studio-chip">custom</span>}
          </div>
          <p className="viewer-description">{theme.description}</p>
          <div className="viewer-meta-grid">
            <MetaItem label="Family" value={theme.familyName ?? theme.vibe} />
            <MetaItem label="Variant" value={theme.variantName ?? "Custom"} />
            <MetaItem label="Theme ID" value={theme.id} />
          </div>
        </section>

        <section className="viewer-control-panel" aria-label="Viewer controls">
          <div className="viewer-section-label">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Viewer controls
          </div>
          <LookSwitch
            theme={theme}
            themes={themes}
            mode={mode}
            onThemeChange={onThemeChange}
            onModeChange={onModeChange}
          />
          <div className="viewer-action-row">
            <button onClick={copyEmbed} className="studio-button text-xs" title="Copy embed snippet">
              <Copy className="w-3.5 h-3.5" />
              Embed
            </button>
            <button
              onClick={downloadCss}
              className="studio-button text-xs"
              title="Download theme CSS"
            >
              <Download className="w-3.5 h-3.5" />
              CSS
            </button>
            <button onClick={onEdit} className="studio-button studio-button-primary text-xs">
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </section>
      </div>

      <section className="viewer-preview-panel" aria-label="Preview content">
        <div className="viewer-preview-toolbar">
          <div>
            <div className="viewer-section-label">
              <Eye className="w-3.5 h-3.5" />
              Preview content
            </div>
            <p>{theme.name} rendered in the shared Waki sample app.</p>
          </div>
          <span className="viewer-mode-pill">{mode === "dark" ? "Dark" : "Light"} mode</span>
        </div>
        <PreviewFrame
          baseCss={theme.baseCss}
          html={PREVIEW_HTML}
          mode={mode}
          className="viewer-preview-frame"
          ariaLabel={`Live preview of ${theme.name}`}
        />
      </section>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="viewer-meta-item">
      <span>{label}</span>
      <strong title={value}>{value}</strong>
    </div>
  );
}

function LookSwitch({
  theme,
  themes,
  mode,
  onThemeChange,
  onModeChange,
}: {
  theme: StudioTheme;
  themes: StudioTheme[];
  mode: "light" | "dark";
  onThemeChange: (id: string) => void;
  onModeChange: (m: "light" | "dark") => void;
}) {
  return (
    <div className="look-switch">
      <div className="look-switch-preview" aria-hidden="true">
        <PreviewFrame
          baseCss={theme.baseCss}
          html={MINIATURE_HTML}
          mode={mode}
          scale={0.2}
          ariaLabel={`${theme.name} miniature`}
        />
      </div>
      <label className="look-switch-select">
        <span>Theme</span>
        <select value={theme.id} onChange={(event) => onThemeChange(event.target.value)}>
          {themes.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name}
            </option>
          ))}
        </select>
      </label>
      <div className="look-mode" aria-label="Color mode">
        <button
          onClick={() => onModeChange("light")}
          className={mode === "light" ? "active" : ""}
          aria-label="Use light mode"
          title="Light"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onModeChange("dark")}
          className={mode === "dark" ? "active" : ""}
          aria-label="Use dark mode"
          title="Dark"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
