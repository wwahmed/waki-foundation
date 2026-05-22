import type { ComponentType, ReactNode } from "react";

export type LookSwitcherMode = "system" | "light" | "dark";
export type LookSwitcherVariant = "compact" | "panel";

export interface LookSwitcherTheme {
  id: string;
  name: string;
  description?: string;
  familyName?: string;
  variantName?: string;
}

export interface LookSwitcherIcons {
  Moon: ComponentType<{ className?: string }>;
  Sun: ComponentType<{ className?: string }>;
  Monitor?: ComponentType<{ className?: string }>;
}

export interface LookSwitcherProps {
  themes: ReadonlyArray<LookSwitcherTheme>;
  activeThemeId: string;
  mode: LookSwitcherMode;
  onThemeChange: (themeId: string) => void;
  onModeChange: (mode: LookSwitcherMode) => void;
  icons: LookSwitcherIcons;
  preview?: ReactNode;
  renderThemePreview?: (theme: LookSwitcherTheme) => ReactNode;
  label?: string;
  status?: ReactNode;
  variant?: LookSwitcherVariant;
  onRefresh?: () => void;
  refreshLabel?: string;
  className?: string;
}

const MODE_OPTIONS: ReadonlyArray<{ id: LookSwitcherMode; label: string; subtitle: string }> = [
  { id: "system", label: "System", subtitle: "Follow device" },
  { id: "light", label: "Light", subtitle: "Always light" },
  { id: "dark", label: "Dark", subtitle: "Always dark" },
];

/** Theme + mode switcher for app rails, headers, and settings panes.
 *  The host owns theme loading and optional preview rendering; waki-shell
 *  owns the control shape, accessibility, and mode actions. */
export function LookSwitcher({
  themes,
  activeThemeId,
  mode,
  onThemeChange,
  onModeChange,
  icons,
  preview,
  renderThemePreview,
  label = "Look",
  status,
  variant = "compact",
  onRefresh,
  refreshLabel = "Refresh themes",
  className = "",
}: LookSwitcherProps) {
  const { Moon, Sun, Monitor } = icons;
  const activeMode = MODE_OPTIONS.find((item) => item.id === mode) ?? MODE_OPTIONS[0];

  if (variant === "panel") {
    return (
      <div
        className={`glass-elevated flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-300/70 bg-white/80 text-slate-950 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-950/80 dark:text-slate-100 ${className}`}
      >
        <div className="flex items-start gap-3 border-b border-slate-300/70 px-5 py-4 dark:border-slate-700/70">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Theme
            </div>
            <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {label}
            </div>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="btn-ghost inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-semibold"
            >
              {refreshLabel}
            </button>
          )}
        </div>

        <div className="max-h-[26rem] overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
              const active = theme.id === activeThemeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onThemeChange(theme.id)}
                  aria-pressed={active}
                  className={`group flex min-w-0 flex-col gap-2 rounded-2xl border p-2.5 text-left transition ${
                    active
                      ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/15 ring-2 ring-sky-400/25"
                      : "border-slate-300/70 bg-white/35 hover:border-slate-400 dark:border-slate-700/70 dark:bg-slate-900/35 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="h-20 overflow-hidden rounded-xl border border-slate-300/70 bg-slate-100 dark:border-slate-700/70 dark:bg-slate-900">
                    {renderThemePreview ? renderThemePreview(theme) : <DefaultThemePreview />}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
                      {theme.name}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {theme.variantName ?? theme.familyName ?? theme.description ?? theme.id}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-300/70 px-5 py-4 dark:border-slate-700/70">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Appearance
              </div>
              <div className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {activeMode.subtitle}
              </div>
            </div>
            <ModeSegmentedControl
              mode={mode}
              onModeChange={onModeChange}
              Moon={Moon}
              Sun={Sun}
              Monitor={Monitor}
            />
          </div>
          {status && <div className="mt-3 truncate text-xs text-slate-500 dark:text-slate-400">{status}</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-slate-300/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/60 ${className}`}
    >
      {preview && (
        <div
          className="h-7 w-10 overflow-hidden rounded-full border border-slate-300/70 dark:border-slate-700/70"
          aria-hidden="true"
        >
          {preview}
        </div>
      )}
      <label className="inline-flex items-center gap-1.5 pl-1 text-xs font-bold">
        <span className="opacity-65">{label}</span>
        <select
          value={activeThemeId}
          onChange={(event) => onThemeChange(event.target.value)}
          className="max-w-[11rem] appearance-none bg-transparent font-bold text-inherit outline-none"
          aria-label={label}
        >
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </label>
      <ModeSegmentedControl
        mode={mode}
        onModeChange={onModeChange}
        Moon={Moon}
        Sun={Sun}
        Monitor={Monitor}
        compact
      />
    </div>
  );
}

function ModeSegmentedControl({
  mode,
  onModeChange,
  Moon,
  Sun,
  Monitor,
  compact = false,
}: {
  mode: LookSwitcherMode;
  onModeChange: (mode: LookSwitcherMode) => void;
  Moon: ComponentType<{ className?: string }>;
  Sun: ComponentType<{ className?: string }>;
  Monitor?: ComponentType<{ className?: string }>;
  compact?: boolean;
}) {
  return (
    <div
      className="inline-flex rounded-full bg-slate-200/70 p-0.5 dark:bg-slate-800/80"
      aria-label="Color mode"
    >
      {MODE_OPTIONS.map((option) => {
        const Icon = option.id === "system" ? Monitor : option.id === "light" ? Sun : Moon;
        const selected = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onModeChange(option.id)}
            aria-label={`Use ${option.label.toLowerCase()} mode`}
            aria-pressed={selected}
            className={`inline-flex items-center justify-center rounded-full font-semibold transition-colors ${
              compact ? "h-7 w-7" : "h-9 min-w-12 px-3"
            } ${
              selected
                ? "bg-white text-slate-950 shadow-sm dark:bg-sky-500 dark:text-white"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : <span className="text-[10px]">{option.label.slice(0, 1)}</span>}
            {!compact && <span className="ml-1.5 text-xs">{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

function DefaultThemePreview() {
  return (
    <div className="flex h-full gap-2 bg-gradient-to-br from-slate-100 to-slate-200 p-2 dark:from-slate-950 dark:to-slate-800">
      <div className="w-8 rounded-lg bg-white/80 shadow-sm dark:bg-slate-800">
        <div className="mx-auto mt-2 h-2 w-2 rounded-full bg-sky-500" />
        <div className="mx-auto mt-2 h-1 w-4 rounded-full bg-slate-300 dark:bg-slate-600" />
        <div className="mx-auto mt-1.5 h-1 w-4 rounded-full bg-slate-300/70 dark:bg-slate-600/70" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex-1 rounded-lg bg-white/85 p-2 shadow-sm dark:bg-slate-800">
          <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="mt-2 h-1.5 w-8 rounded-full bg-sky-500/80" />
        </div>
        <div className="grid h-4 grid-cols-3 gap-1">
          <div className="rounded bg-sky-500/80" />
          <div className="rounded bg-white/80 dark:bg-slate-800" />
          <div className="rounded bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
