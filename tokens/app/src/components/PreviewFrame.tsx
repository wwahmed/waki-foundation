import { useEffect, useRef } from "react";

interface PreviewFrameProps {
  baseCss: string;
  overrideCss?: string;
  html: string;
  mode: "light" | "dark";
  scale?: number;
  className?: string;
  ariaLabel?: string;
}

// Renders preview HTML inside a sandboxed iframe with the requested
// theme CSS injected. Using an iframe means each theme's body /
// global rules don't fight the studio chrome's own styles. The body
// gets html.dark / html.light to flip the theme variant.
//
// The `scale` prop is for the gallery: render the preview at full
// resolution then visually shrink it via CSS transform so the
// miniature looks crisp instead of pixelated.
export function PreviewFrame({
  baseCss,
  overrideCss,
  html,
  mode,
  scale,
  className,
  ariaLabel,
}: PreviewFrameProps) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!doctype html>
<html class="${mode}">
  <head>
    <meta charset="utf-8" />
    <style>${baseCss}</style>
    ${overrideCss ? `<style>${overrideCss}</style>` : ""}
  </head>
  <body>${html}</body>
</html>`);
    doc.close();
  }, [baseCss, overrideCss, html, mode]);

  if (scale && scale !== 1) {
    return (
      <div
        className={className}
        style={{ position: "relative", overflow: "hidden" }}
      >
        <iframe
          ref={ref}
          aria-label={ariaLabel}
          style={{
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
          title={ariaLabel ?? "theme preview"}
          sandbox="allow-same-origin"
        />
      </div>
    );
  }

  return (
    <iframe
      ref={ref}
      aria-label={ariaLabel}
      className={className}
      style={{ border: 0, width: "100%", height: "100%" }}
      title={ariaLabel ?? "theme preview"}
      sandbox="allow-same-origin"
    />
  );
}
