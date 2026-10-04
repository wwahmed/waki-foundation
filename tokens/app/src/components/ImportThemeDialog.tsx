import { useState } from "react";
import { Upload, X } from "lucide-react";
import type { OverrideTokens } from "../lib/types";
import { DEFAULT_OVERRIDES } from "../lib/defaults";

interface ImportThemeDialogProps {
  onClose: () => void;
  onImport: (name: string, description: string, overrides: OverrideTokens) => void;
}

// Imports a theme from the JSON shape that the editor's "Download
// JSON" button emits, OR from a partial overrides payload (just the
// 12-key OverrideTokens object). Either way the user lands in the
// editor with the imported tokens prefilled.
//
// Validation is deliberately loose: missing keys fall back to
// DEFAULT_OVERRIDES. We tell the user which keys we filled in so
// they can adjust if needed.
export function ImportThemeDialog({ onClose, onImport }: ImportThemeDialogProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const handleImport = () => {
    setError(null);
    setHint(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
      return;
    }
    if (!parsed || typeof parsed !== "object") {
      setError("Expected a JSON object");
      return;
    }

    const obj = parsed as Record<string, unknown>;
    const candidate = (obj.overrides ?? obj) as Record<string, unknown>;

    const tokens: OverrideTokens = { ...DEFAULT_OVERRIDES };
    const filled: string[] = [];
    const supplied: string[] = [];

    for (const key of Object.keys(DEFAULT_OVERRIDES) as Array<keyof OverrideTokens>) {
      if (key in candidate) {
        const value = candidate[key];
        if (typeof value === "string" || typeof value === "number") {
          (tokens[key] as string | number) = value;
          supplied.push(key);
          continue;
        }
      }
      filled.push(key);
    }

    if (supplied.length === 0) {
      setError(
        "No recognised tokens in the JSON. Expected keys like bgFromLight, accent, radiusPx, etc. (see Download JSON for the canonical shape).",
      );
      return;
    }

    if (filled.length > 0) {
      setHint(
        `Filled ${filled.length} missing token${filled.length === 1 ? "" : "s"} from defaults: ${filled.slice(0, 5).join(", ")}${filled.length > 5 ? "..." : ""}`,
      );
    }

    const name = (typeof obj.name === "string" && obj.name) || "Imported theme";
    const description =
      (typeof obj.description === "string" && obj.description) || "Imported from JSON";

    onImport(name, description, tokens);
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    setText(text);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="studio-panel max-w-xl w-full p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import theme from JSON
          </h2>
          <button onClick={onClose} className="studio-button text-xs px-2 py-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs opacity-70 mb-3">
          Paste the JSON from a Download JSON export, or pick a <code>.theme.json</code> file.
          Missing tokens fall back to defaults.
        </p>

        <input
          type="file"
          accept="application/json,.json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
          className="block text-xs mb-3"
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          spellCheck={false}
          placeholder='{ "name": "...", "overrides": { "accent": "#6366f1", ... } }'
          className="w-full font-mono text-xs rounded-lg p-3 border border-violet-500/30 bg-white/40 dark:bg-slate-900/50 outline-none focus:border-violet-500"
        />

        {error && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 text-xs text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {hint && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400">
            {hint}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="studio-button text-xs">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!text.trim()}
            className="studio-button studio-button-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import + edit
          </button>
        </div>
      </div>
    </div>
  );
}
