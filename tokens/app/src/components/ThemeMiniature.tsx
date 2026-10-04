import { PreviewFrame } from "./PreviewFrame";
import { MINIATURE_HTML } from "../lib/sample";
import type { StudioTheme } from "../lib/types";

interface ThemeMiniatureProps {
  theme: StudioTheme;
  mode: "light" | "dark";
  active?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
}

// One tile in the gallery. The preview is a real iframe rendering the
// theme CSS; we scale it down so the miniature reads crisply without
// rasterisation artefacts.
export function ThemeMiniature({ theme, mode, active, onClick, onEdit }: ThemeMiniatureProps) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all cursor-pointer ${
        active ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-transparent" : "ring-1 ring-violet-500/10 hover:ring-violet-500/40"
      }`}
      onClick={onClick}
    >
      <div className="aspect-[4/3] w-full bg-slate-50 dark:bg-slate-900 relative">
        <PreviewFrame
          baseCss={theme.baseCss}
          html={MINIATURE_HTML}
          mode={mode}
          scale={0.7}
          ariaLabel={`Preview of ${theme.name}`}
        />
        {!theme.builtIn && (
          <span className="absolute top-2 left-2 studio-chip">custom</span>
        )}
      </div>
      <div className="studio-panel rounded-none border-x-0 border-b-0 px-3 py-2 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm truncate">{theme.name}</div>
          <div className="text-[11px] opacity-65 truncate">{theme.description}</div>
        </div>
        {onEdit && (
          <button
            className="studio-button text-xs px-2 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
