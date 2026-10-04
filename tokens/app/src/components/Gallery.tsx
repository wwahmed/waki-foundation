import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { ThemeMiniature } from "./ThemeMiniature";
import type { StudioTheme } from "../lib/types";

interface GalleryProps {
  themes: StudioTheme[];
  mode: "light" | "dark";
  activeId: string | null;
  onPick: (id: string) => void;
  onEdit: (id: string) => void;
  onNewTheme: () => void;
}

export function Gallery({ themes, mode, activeId, onPick, onEdit, onNewTheme }: GalleryProps) {
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState<string>("all");

  const vibes = useMemo(() => {
    const s = new Set<string>();
    themes.forEach((t) => s.add(t.vibe));
    return ["all", ...Array.from(s).sort()];
  }, [themes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return themes.filter((t) => {
      if (vibe !== "all" && t.vibe !== vibe) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });
  }, [themes, query, vibe]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="Search themes by name, description, id"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="studio-input pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {vibes.map((v) => (
            <button
              key={v}
              onClick={() => setVibe(v)}
              className={`studio-button text-xs ${
                vibe === v ? "studio-button-primary" : ""
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button onClick={onNewTheme} className="studio-button studio-button-primary">
          <Plus className="w-4 h-4" />
          New theme
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((t) => (
          <ThemeMiniature
            key={t.id}
            theme={t}
            mode={mode}
            active={activeId === t.id}
            onClick={() => onPick(t.id)}
            onEdit={() => onEdit(t.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="studio-panel p-8 text-center opacity-70">
          No themes match the current filter.
        </div>
      )}
    </div>
  );
}
