/** Sidebar layout defaults. Currently unused by printer-dashboard
 *  (mobile-first with top header + bottom tabs). Kept here so apps
 *  that DO want a desktop sidebar inherit the same dimensions and
 *  treatment. */
export const sidebar = {
  /** Default fixed width at md+. */
  widthTw: "md:w-56",
  widthPx: 224,
  /** Hidden below md (mobile gets the bottom tab nav instead). */
  hideBelow: "md",
  /** Sidebar collapses on lg+ if a consumer toggles it; v1 doesn't
   *  ship a collapse affordance, but the slot is reserved. */
  collapsibleAt: "lg",
  footerControls: {
    /** Web/dashboard apps can use expanded labeled rows. */
    webDefaultVariant: "expanded-list",
    /** Native/dense apps should fold shell controls into a compact strip. */
    nativeDefaultVariant: "folded-strip",
    /** Collapsed rails stack the same controls vertically. */
    collapsedVariant: "folded-stack",
    iconButtonPx: 36,
    requireTooltipText: true,
  },
} as const;
