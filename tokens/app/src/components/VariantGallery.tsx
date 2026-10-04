import { ArrowLeft, Copy } from "lucide-react";
import type { BundleFamily, StudioTheme } from "../lib/types";

interface VariantGalleryProps {
  family: BundleFamily;
  familyId: string;
  themesById: Record<string, StudioTheme>;
  mode: "light" | "dark";
  onBack: () => void;
  onPick: (themeId: string) => void;
  onEdit: (themeId: string) => void;
  onEditFamily: () => void;
  onClone: (themeId: string) => void;
}

// Step 2 of the picker. Variants of the chosen family, each shown as
// a ThemeMiniature reusing the same component the original Gallery
// used. Click a tile to open the preview pane; hover to reveal Edit.
export function VariantGallery({
  family,
  themesById,
  mode,
  onBack,
  onPick,
  onEdit,
  onEditFamily,
  onClone,
}: VariantGalleryProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <button onClick={onBack} className="studio-button text-xs mt-0.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Families
          </button>
          <div>
            <h1 className="text-2xl font-extrabold">{family.name}</h1>
            <p className="text-sm opacity-70 max-w-2xl">{family.description}</p>
          </div>
        </div>
        <button onClick={onEditFamily} className="studio-button text-xs">
          Edit family structure
        </button>
      </div>

      <div className="studio-panel p-3 flex flex-wrap gap-3 text-xs">
        <FamilyStat label="Radius" value={`${family.structure.radius}px`} />
        <FamilyStat label="Blur" value={`${family.structure.blur}px`} />
        <FamilyStat label="Shadow" value={family.structure.shadow} />
        <FamilyStat label="Surface" value={family.structure.surface} />
        <FamilyStat label="Iconography" value={family.structure.iconography} />
        <FamilyStat label="Density" value={family.structure.density} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {family.variants.map((v) => {
          const theme = themesById[v.themeId];
          if (!theme) return null;
          return (
            <div key={v.themeId} className="relative group">
              <button
                onClick={() => onPick(v.themeId)}
                className="variant-decision-card"
              >
                <div
                  className="variant-material-swatch"
                  style={{
                    background: `radial-gradient(circle at 12% 18%, ${v.palette[mode].panel}, transparent 30%), linear-gradient(135deg, ${v.palette[mode].bgFrom}, ${v.palette[mode].accent}, ${v.palette[mode].bgTo})`,
                    borderColor: v.palette[mode].border,
                  }}
                >
                  <span style={{ background: v.palette[mode].panel, borderColor: v.palette[mode].border }} />
                  <span style={{ background: v.palette[mode].accent }} />
                  <i style={{ background: v.palette[mode].text }} />
                </div>
                <div className="variant-decision-copy">
                  <h3>{theme.name}</h3>
                  <p>{theme.description}</p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(v.themeId);
                }}
                className="absolute top-2 left-2 studio-button text-[10px] px-1.5 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                title={`Edit ${v.name}`}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClone(v.themeId);
                }}
                className="absolute top-2 right-2 studio-button text-[10px] px-1.5 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                title={`Clone ${v.name} as a new variant`}
              >
                <Copy className="w-3 h-3" />
                Clone
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FamilyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2.5 py-1 rounded-lg bg-violet-500/8">
      <span className="opacity-60 mr-1.5">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
