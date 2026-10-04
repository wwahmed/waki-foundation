import { useMemo } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Layers3, Plus, Sparkles, Trash2 } from "lucide-react";
import type { BundleFamily, StudioTheme } from "../lib/types";

interface FamilyGalleryProps {
  families: Record<string, BundleFamily>;
  customThemes: StudioTheme[];
  mode: "light" | "dark";
  onPickFamily: (familyId: string) => void;
  onPickCustom: (id: string) => void;
  onNewTheme: () => void;
  onDeleteCustom: (id: string) => void;
}

// Step 1 of the picker. Each family gets one large card showing a
// representative variant's preview plus the variant count. Click into
// it to open the variant gallery for that family.
//
// Custom (session-created) themes get their own row at the top; they
// don't slot into the built-in family taxonomy unless explicitly
// promoted by hand.
export function FamilyGallery({
  families,
  customThemes,
  mode,
  onPickFamily,
  onPickCustom,
  onNewTheme,
  onDeleteCustom,
}: FamilyGalleryProps) {
  const familyEntries = useMemo(
    () =>
      Object.entries(families).map(([id, family]) => ({ id, family })),
    [families],
  );
  const signatureFamilies = familyEntries.filter(({ id }) =>
    ["system", "professional", "corporate", "frosted-pro", "glass", "academic", "frost"].includes(id),
  );

  return (
    <div className="flex flex-col gap-7">
      <section className="catalog-hero">
        <div className="catalog-hero-copy">
          <span className="studio-chip">Foundation catalog</span>
          <h1>Pick the app personality, then inspect the details.</h1>
          <p>
            Waki themes are organized by material first and hue second. Choose
            the surface language, then pick the colorway that fits the app.
          </p>
        </div>
        <div className="catalog-hero-actions">
          <button onClick={() => onPickFamily("glass")} className="studio-button studio-button-primary">
            <Sparkles className="w-4 h-4" />
            Explore glass
          </button>
          <button onClick={onNewTheme} className="studio-button">
            <Plus className="w-4 h-4" />
            New theme
          </button>
        </div>
      </section>

      {signatureFamilies.length > 0 && (
        <section className="catalog-section">
          <SectionHeader
            eyebrow="Signature"
            title="Material families"
            description="Each family owns its shape, depth, density, blur, hover behavior, and typography. Variants inside the family are hue choices."
          />
          <div className="catalog-v2-strip">
            {signatureFamilies.map(({ id, family }) => {
              const variant = family.variants[0];
              return variant ? (
              <button
                key={id}
                onClick={() => onPickFamily(id)}
                className="theme-decision-card"
              >
                <PaletteBand palette={variant.palette} mode={mode} />
                <div className="theme-decision-copy">
                  <h3>{family.name}</h3>
                  <p>{family.description}</p>
                </div>
              </button>
              ) : null;
            })}
          </div>
        </section>
      )}

      {customThemes.length > 0 && (
        <section className="catalog-section">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold">Your custom themes</h2>
              <p className="text-xs opacity-65">
                Saved in this browser session. Export or commit to make them permanent.
              </p>
            </div>
            <button onClick={onNewTheme} className="studio-button studio-button-primary">
              <Plus className="w-4 h-4" />
              New theme
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {customThemes.map((t) => (
              <div key={t.id} className="relative group">
                <button
                  onClick={() => onPickCustom(t.id)}
                  className="w-full rounded-2xl overflow-hidden ring-1 ring-violet-500/15 hover:ring-violet-500/40 transition-all text-left"
                >
                  <div className="custom-theme-surface">
                    <span className="absolute top-2 left-2 studio-chip">custom</span>
                  </div>
                  <div className="studio-panel rounded-none border-x-0 border-b-0 px-3 py-2">
                    <div className="font-semibold text-sm truncate">{t.name}</div>
                    <div className="text-[11px] opacity-65 truncate">{t.description}</div>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${t.name}" from this session?`)) {
                      onDeleteCustom(t.id);
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  title="Delete this custom theme"
                  aria-label={`Delete ${t.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="catalog-section">
        <SectionHeader
          eyebrow="All families"
          title="Browse by structure"
          description="Families group themes by behavior: glass treatment, density, shape language, and shadow system."
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {familyEntries.map(({ id, family }) => (
            <button
              key={id}
              onClick={() => onPickFamily(id)}
              className="family-decision-card"
            >
              <div className="family-icon">
                <Layers3 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3>{family.name}</h3>
                  <span>{family.variants.length} looks</span>
                </div>
                <p>{family.description}</p>
                <div className="family-swatch-row">
                  {family.variants.slice(0, 6).map((v) => (
                    <i
                      key={v.slot}
                      style={{
                        background: `linear-gradient(135deg, ${v.palette[mode].bgFrom}, ${v.palette[mode].accent}, ${v.palette[mode].bgTo})`,
                      }}
                      title={v.name}
                    />
                  ))}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-45" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="catalog-section-header">
      <div>
        <div className="catalog-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function PaletteBand({
  palette,
  mode,
}: {
  palette: BundleFamily["variants"][number]["palette"];
  mode: "light" | "dark";
}) {
  const p = palette[mode];
  return (
    <div
      className="palette-band"
      style={{
        background: `linear-gradient(135deg, ${p.bgFrom}, ${p.panel}, ${p.accent}, ${p.bgTo})`,
        borderColor: p.border,
      }}
    >
      <span style={{ background: p.accent }} />
      <span style={{ background: p.text }} />
    </div>
  );
}
