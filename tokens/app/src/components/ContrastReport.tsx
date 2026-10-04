import { AlertTriangle, Check } from "lucide-react";
import type { ContrastReport as Report } from "../lib/contrast";

export function ContrastReport({ reports }: { reports: Report[] }) {
  return (
    <div className="space-y-1.5">
      {reports.map((r) => {
        const ok = r.aaNormal;
        return (
          <div
            key={r.pair}
            className={`rounded-lg px-3 py-2 text-xs ${
              ok ? "bg-emerald-500/10" : "bg-amber-500/10"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {ok ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                )}
                <span className="truncate font-medium">{r.pair}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`font-mono ${
                    ok
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {r.ratio.toFixed(2)}:1
                </span>
                <span className="opacity-60 text-[10px]">
                  {r.aaNormal ? "AA" : r.aaLarge ? "AA large" : "fail"}
                </span>
              </div>
            </div>
            {r.suggest && (
              <p className="mt-1 text-[10.5px] leading-snug opacity-75">{r.suggest}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
