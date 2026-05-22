import type { ComponentType, ReactNode } from "react";

import { Tooltip, type TooltipSide } from "./Tooltip";

export type ShellFooterControlsVariant = "expanded-list" | "folded-strip" | "folded-stack";

export interface ShellFooterAction {
  id: string;
  label: string;
  /** Required for icon-only variants. Falls back to label for expanded rows. */
  tooltip?: string;
  subtitle?: string;
  icon: ComponentType<{ className?: string }>;
  onSelect: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
}

export interface ShellFooterControlsProps {
  actions: ReadonlyArray<ShellFooterAction>;
  /** Actions aligned to the far edge in folded-strip, commonly sidebar pin. */
  trailingActions?: ReadonlyArray<ShellFooterAction>;
  variant?: ShellFooterControlsVariant;
  tooltipSide?: TooltipSide;
  ariaLabel?: string;
  className?: string;
}

/** Shell/admin controls for sidebars.
 *
 * Use `expanded-list` for web dashboards where labeled footer rows
 * have enough room. Use `folded-strip` for dense/native expanded
 * sidebars where Appearance/Profile/Pin should stay quieter than
 * primary navigation. Use `folded-stack` for collapsed rails.
 */
export function ShellFooterControls({
  actions,
  trailingActions = [],
  variant = "expanded-list",
  tooltipSide = "top",
  ariaLabel = "Shell controls",
  className = "",
}: ShellFooterControlsProps) {
  const allActions = [...actions, ...trailingActions];

  if (variant === "expanded-list") {
    return (
      <nav className={`space-y-1 ${className}`} aria-label={ariaLabel}>
        {allActions.map((action) => (
          <ExpandedFooterAction key={action.id} action={action} tooltipSide={tooltipSide} />
        ))}
      </nav>
    );
  }

  if (variant === "folded-stack") {
    return (
      <nav className={`flex flex-col items-center gap-2 ${className}`} aria-label={ariaLabel}>
        {allActions.map((action) => (
          <FoldedFooterAction key={action.id} action={action} tooltipSide="right" />
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={`flex items-center gap-2 rounded-2xl border border-slate-300/60 bg-white/35 p-2 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/35 ${className}`}
      aria-label={ariaLabel}
    >
      {actions.map((action) => (
        <FoldedFooterAction key={action.id} action={action} tooltipSide={tooltipSide} />
      ))}

      {trailingActions.length > 0 && <div className="min-w-0 flex-1" aria-hidden="true" />}

      {trailingActions.map((action) => (
        <FoldedFooterAction key={action.id} action={action} tooltipSide={tooltipSide} />
      ))}
    </nav>
  );
}

function ExpandedFooterAction({
  action,
  tooltipSide,
}: {
  action: ShellFooterAction;
  tooltipSide: TooltipSide;
}) {
  const Icon = action.icon;
  const tooltip = action.tooltip ?? action.label;

  return (
    <Tooltip content={tooltip} side={tooltipSide}>
      <button
        type="button"
        onClick={action.onSelect}
        disabled={action.disabled}
        aria-label={action.label}
        aria-pressed={action.active || undefined}
        title={tooltip}
        className={`flex min-h-11 w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left transition disabled:pointer-events-none disabled:opacity-45 ${
          action.active
            ? "bg-sky-500/12 text-sky-700 ring-1 ring-sky-500/25 dark:text-sky-300"
            : "text-slate-800 hover:bg-slate-950/5 dark:text-slate-100 dark:hover:bg-white/7"
        }`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold leading-tight">{action.label}</span>
          {action.subtitle && (
            <span className="mt-0.5 block truncate text-xs font-medium text-slate-500 dark:text-slate-400">
              {action.subtitle}
            </span>
          )}
        </span>
        {action.badge && <span className="shrink-0">{action.badge}</span>}
      </button>
    </Tooltip>
  );
}

function FoldedFooterAction({
  action,
  tooltipSide,
}: {
  action: ShellFooterAction;
  tooltipSide: TooltipSide;
}) {
  const Icon = action.icon;
  const tooltip = action.tooltip ?? action.label;

  return (
    <Tooltip content={tooltip} side={tooltipSide}>
      <button
        type="button"
        onClick={action.onSelect}
        disabled={action.disabled}
        aria-label={action.label}
        aria-pressed={action.active || undefined}
        title={tooltip}
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition disabled:pointer-events-none disabled:opacity-45 ${
          action.active
            ? "bg-sky-500/14 text-sky-700 ring-1 ring-sky-500/30 dark:text-sky-300"
            : "bg-slate-950/5 text-slate-800 hover:bg-slate-950/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10"
        }`}
      >
        <Icon className="h-4.5 w-4.5" />
      </button>
    </Tooltip>
  );
}
