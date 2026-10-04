import { useEffect, useMemo, useState } from "react";
import { Github, Moon, Palette, Sun, Upload } from "lucide-react";
import { loadBundle, bundleToStudioThemes } from "./lib/loader";
import type { OverrideTokens, StudioTheme, ThemeBundle } from "./lib/types";
import { FamilyGallery } from "./components/FamilyGallery";
import { VariantGallery } from "./components/VariantGallery";
import { PreviewPane } from "./components/PreviewPane";
import { Editor } from "./components/Editor";
import { ImportThemeDialog } from "./components/ImportThemeDialog";
import { DEFAULT_OVERRIDES, getOverridesForTheme } from "./lib/defaults";
import { buildStandaloneThemeCss } from "./lib/overrideCss";

type Screen =
  | { kind: "families" }
  | { kind: "variants"; familyId: string }
  | { kind: "preview"; id: string }
  | { kind: "edit"; id: string; isNew: boolean; tab: "family" | "variant" };

const MODE_KEY = "studio:mode";
const SESSION_THEMES_KEY = "studio:session-themes";
const FAMILY_OVERRIDES_KEY = "studio:family-overrides";

interface FamilyOverride {
  radiusPx: number;
  blurPx: number;
}

export function App() {
  const [bundle, setBundle] = useState<ThemeBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionThemes, setSessionThemes] = useState<StudioTheme[]>(() => {
    try {
      const raw = localStorage.getItem(SESSION_THEMES_KEY);
      if (raw) return JSON.parse(raw) as StudioTheme[];
    } catch {
      /* ignore */
    }
    return [];
  });
  const [familyOverrides, setFamilyOverrides] = useState<Record<string, FamilyOverride>>(
    () => {
      try {
        const raw = localStorage.getItem(FAMILY_OVERRIDES_KEY);
        if (raw) return JSON.parse(raw) as Record<string, FamilyOverride>;
      } catch {
        /* ignore */
      }
      return {};
    },
  );
  const [screen, setScreen] = useState<Screen>({ kind: "families" });
  const [importOpen, setImportOpen] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    loadBundle()
      .then((b) => {
        if (!cancelled) setBundle(b);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(SESSION_THEMES_KEY, JSON.stringify(sessionThemes));
  }, [sessionThemes]);

  useEffect(() => {
    localStorage.setItem(FAMILY_OVERRIDES_KEY, JSON.stringify(familyOverrides));
  }, [familyOverrides]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [screen]);

  const builtInThemes = useMemo(
    () => (bundle ? bundleToStudioThemes(bundle) : []),
    [bundle],
  );
  const allThemes = useMemo(
    () => [...sessionThemes, ...builtInThemes],
    [sessionThemes, builtInThemes],
  );
  const themesById = useMemo(() => {
    const out: Record<string, StudioTheme> = {};
    for (const t of allThemes) out[t.id] = t;
    return out;
  }, [allThemes]);

  const findTheme = (id: string): StudioTheme | undefined => themesById[id];

  const handleSaveTheme = (
    id: string,
    name: string,
    description: string,
    overrides: OverrideTokens,
  ) => {
    const baseExisting = builtInThemes.find((t) => t.id === id);
    const baseCss = baseExisting
      ? baseExisting.baseCss
      : (bundle?.base ?? "") + "\n" + buildStandaloneThemeCss(overrides, name);

    const next: StudioTheme = {
      id,
      name,
      description,
      vibe: baseExisting?.vibe ?? "custom",
      baseCss,
      builtIn: false,
      overrides,
      familyId: baseExisting?.familyId ?? null,
      familyName: baseExisting?.familyName ?? null,
      variantSlot: baseExisting?.variantSlot ?? null,
      variantName: baseExisting?.variantName ?? null,
    };
    setSessionThemes((prev) => {
      const without = prev.filter((t) => t.id !== id);
      return [next, ...without];
    });
  };

  const handleNewTheme = () => {
    const id = `untitled-${Date.now().toString(36)}`;
    const blank: StudioTheme = {
      id,
      name: "Untitled",
      description: "A blank theme starting from defaults",
      vibe: "custom",
      baseCss: bundle?.base ?? "",
      builtIn: false,
      overrides: DEFAULT_OVERRIDES,
      familyId: null,
      familyName: null,
      variantSlot: null,
      variantName: null,
    };
    setSessionThemes((prev) => [blank, ...prev]);
    setScreen({ kind: "edit", id, isNew: true, tab: "variant" });
  };

  // Clone-from: stamp a new variant inside the same family using the
  // source variant's palette as the seed. The result lives in
  // sessionThemes (not a built-in) and inherits the source family's
  // structure tokens automatically.
  const handleCloneVariant = (sourceThemeId: string) => {
    const source = themesById[sourceThemeId];
    if (!source) return;
    const id = `clone-${source.id}-${Date.now().toString(36)}`;
    const clone: StudioTheme = {
      id,
      name: `${source.name} clone`,
      description: source.description,
      vibe: source.vibe,
      baseCss: source.baseCss,
      builtIn: false,
      overrides: source.overrides ?? getOverridesForTheme(source.id),
      familyId: source.familyId ?? null,
      familyName: source.familyName ?? null,
      variantSlot: source.variantSlot ? `${source.variantSlot}-clone` : null,
      variantName: source.variantName ? `${source.variantName} clone` : null,
    };
    setSessionThemes((prev) => [clone, ...prev]);
    setScreen({ kind: "edit", id, isNew: true, tab: "variant" });
  };

  const handleImportTheme = (
    name: string,
    description: string,
    overrides: OverrideTokens,
  ) => {
    const id = `imported-${Date.now().toString(36)}`;
    const imported: StudioTheme = {
      id,
      name,
      description,
      vibe: "custom",
      baseCss: bundle?.base ?? "",
      builtIn: false,
      overrides,
      familyId: null,
      familyName: null,
      variantSlot: null,
      variantName: null,
    };
    setSessionThemes((prev) => [imported, ...prev]);
    setImportOpen(false);
    setScreen({ kind: "edit", id, isNew: true, tab: "variant" });
  };

  const handleSaveFamilyStructure = (familyId: string, radiusPx: number, blurPx: number) => {
    setFamilyOverrides((prev) => ({ ...prev, [familyId]: { radiusPx, blurPx } }));
  };

  const handleDeleteCustom = (id: string) => {
    setSessionThemes((prev) => prev.filter((t) => t.id !== id));
    if (screen.kind === "preview" && screen.id === id) {
      setScreen({ kind: "families" });
    }
    if (screen.kind === "edit" && screen.id === id) {
      setScreen({ kind: "families" });
    }
  };

  if (error) {
    return (
      <div className="studio-bg min-h-screen flex items-center justify-center p-6">
        <div className="studio-panel p-8 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Could not load themes</h1>
          <p className="text-sm opacity-75 mb-4">{error}</p>
          <p className="text-xs opacity-65">
            Make sure dist/themes.json is committed and reachable. The studio falls back to
            raw.githubusercontent.com if the local copy isn't found.
          </p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="studio-bg min-h-screen flex items-center justify-center">
        <div className="studio-panel p-8">
          <p className="text-sm opacity-75">Loading themes bundle...</p>
        </div>
      </div>
    );
  }

  const families = bundle.families ?? {};
  const familyCount = Object.keys(families).length;

  const headerMeta = (
    <div className="text-xs opacity-65 hidden md:flex items-center gap-2">
      <span>v{bundle.pkgVersion}</span>
      <span>·</span>
      <span className="font-mono">{bundle.gitSha.slice(0, 7)}</span>
      <span>·</span>
      <span>{familyCount} families</span>
      <span>·</span>
      <span>{Object.keys(bundle.themes).length} variants</span>
      {sessionThemes.length > 0 && (
        <>
          <span>·</span>
          <span>{sessionThemes.length} custom</span>
        </>
      )}
    </div>
  );

  // Compose the editor's initial slider positions. Precedence (highest
  // first):
  //   1. family-tab + saved family override -> use the saved family values
  //   2. family-tab + no saved override     -> use family.structure defaults
  //   3. variant-tab + saved family override -> blend family radius/blur
  //      onto the variant's tuned palette so per-variant edits start from
  //      the same structural ground the family edit set
  //   4. variant-tab + no override           -> variant's tuned palette
  const computeInitialOverrides = (
    theme: StudioTheme,
    tab: "family" | "variant",
  ): OverrideTokens => {
    const variantOverride = theme.overrides ?? getOverridesForTheme(theme.id);
    const familyId = theme.familyId;
    const familyDef = familyId ? families[familyId] : undefined;

    if (tab === "family" && familyDef) {
      const saved = familyId ? familyOverrides[familyId] : undefined;
      return {
        ...variantOverride,
        radiusPx: saved ? saved.radiusPx : familyDef.structure.radius,
        blurPx: saved ? saved.blurPx : familyDef.structure.blur,
      };
    }

    if (familyId && familyOverrides[familyId]) {
      const fam = familyOverrides[familyId];
      return { ...variantOverride, radiusPx: fam.radiusPx, blurPx: fam.blurPx };
    }
    return variantOverride;
  };

  return (
    <div className="studio-bg min-h-screen flex flex-col">
      <header className="studio-bar sticky top-0 z-20 px-4 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => setScreen({ kind: "families" })}
          className="flex items-center gap-2.5 group min-w-0"
          aria-label="Theme Studio home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-extrabold flex-shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <div className="font-bold text-sm leading-tight">Theme Studio</div>
            <div className="text-[11px] opacity-65 leading-tight">waki-themes</div>
          </div>
        </button>

        {headerMeta}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setImportOpen(true)}
            className="studio-button text-xs"
            aria-label="Import theme from JSON"
            title="Import theme from JSON"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className="studio-button text-xs"
            aria-label="Toggle dark mode"
          >
            {mode === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden sm:inline">{mode === "light" ? "Dark" : "Light"}</span>
          </button>
          <a
            href="https://github.com/wwahmed/waki-themes"
            target="_blank"
            rel="noopener noreferrer"
            className="studio-button text-xs"
            aria-label="GitHub repository"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {importOpen && (
        <ImportThemeDialog
          onClose={() => setImportOpen(false)}
          onImport={handleImportTheme}
        />
      )}

      <main className="flex-1 px-4 py-4 max-w-[1400px] w-full mx-auto">
        {screen.kind === "families" && (
          <FamilyGallery
            families={families}
            customThemes={sessionThemes}
            mode={mode}
            onPickFamily={(id) => setScreen({ kind: "variants", familyId: id })}
            onPickCustom={(id) => setScreen({ kind: "preview", id })}
            onNewTheme={handleNewTheme}
            onDeleteCustom={handleDeleteCustom}
          />
        )}

        {screen.kind === "variants" && (() => {
          const family = families[screen.familyId];
          if (!family) {
            return (
              <div className="studio-panel p-6">
                Family not found.{" "}
                <button className="studio-button" onClick={() => setScreen({ kind: "families" })}>
                  Back
                </button>
              </div>
            );
          }
          return (
            <VariantGallery
              family={family}
              familyId={screen.familyId}
              themesById={themesById}
              mode={mode}
              onBack={() => setScreen({ kind: "families" })}
              onPick={(id) => setScreen({ kind: "preview", id })}
              onEdit={(id) => setScreen({ kind: "edit", id, isNew: false, tab: "variant" })}
              onEditFamily={() => {
                const first = family.variants[0]?.themeId;
                if (first) setScreen({ kind: "edit", id: first, isNew: false, tab: "family" });
              }}
              onClone={handleCloneVariant}
            />
          );
        })()}

        {screen.kind === "preview" && (() => {
          const theme = findTheme(screen.id);
          if (!theme) {
            return (
              <div className="studio-panel p-6">
                Theme not found.{" "}
                <button className="studio-button" onClick={() => setScreen({ kind: "families" })}>
                  Back
                </button>
              </div>
            );
          }
          const backTarget: Screen = theme.familyId
            ? { kind: "variants", familyId: theme.familyId }
            : { kind: "families" };
          return (
            <div className="space-y-3">
              <button onClick={() => setScreen(backTarget)} className="studio-button text-xs">
                ← Back
              </button>
              <PreviewPane
                theme={theme}
                themes={allThemes}
                mode={mode}
                onEdit={() =>
                  setScreen({ kind: "edit", id: theme.id, isNew: false, tab: "variant" })
                }
                onModeChange={setMode}
                onThemeChange={(id) => setScreen({ kind: "preview", id })}
              />
            </div>
          );
        })()}

        {screen.kind === "edit" && (() => {
          const theme = findTheme(screen.id);
          if (!theme) {
            return (
              <div className="studio-panel p-6">
                Theme not found.{" "}
                <button className="studio-button" onClick={() => setScreen({ kind: "families" })}>
                  Back
                </button>
              </div>
            );
          }
          const family = theme.familyId ? families[theme.familyId] : undefined;
          const initialOverrides = computeInitialOverrides(theme, screen.tab);
          return (
            <Editor
              theme={theme}
              family={family}
              initialOverrides={initialOverrides}
              mode={mode}
              isNew={screen.isNew}
              startTab={screen.tab}
              defaultName={screen.isNew ? theme.name : undefined}
              onModeChange={setMode}
              onBack={() =>
                setScreen(
                  theme.familyId
                    ? { kind: "variants", familyId: theme.familyId }
                    : { kind: "families" },
                )
              }
              onSave={handleSaveTheme}
              onSaveFamilyStructure={handleSaveFamilyStructure}
            />
          );
        })()}
      </main>

      <footer className="px-4 py-3 text-center text-[11px] opacity-65">
        Theme Studio · MIT · built on waki-themes ·{" "}
        <a href="https://github.com/wwahmed/waki-themes" className="underline">
          source
        </a>
      </footer>
    </div>
  );
}
