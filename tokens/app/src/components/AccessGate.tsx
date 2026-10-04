import { useEffect, useState, type ReactNode } from "react";
import { Lock, Palette } from "lucide-react";

interface AccessGateProps {
  children: ReactNode;
}

// Defense-in-depth gate that runs in the browser before the studio
// renders. The PRIMARY gate is Cloudflare Access at the hostname
// (configured in the Cloudflare dashboard against themes.wakilabs.dev).
// This is a backup so that until Access is wired up, the studio is
// not anonymous-readable.
//
// Mechanism: a passphrase compiled into the bundle at build time via
// VITE_STUDIO_PASSPHRASE. If the env var is unset, the gate is OFF
// (development convenience and a sane fallback). Successful entry is
// stored in sessionStorage so a refresh during the session doesn't
// re-prompt. localStorage is deliberately avoided so a closed tab
// re-prompts on reopen.
//
// This is not real auth (a determined attacker can sniff the bundle
// for the passphrase or bypass via DevTools). Cloudflare Access is
// the real gate; this is a soft tripwire while Access is being set
// up.
//
// Status: when Cloudflare Access lands, set VITE_STUDIO_PASSPHRASE to
// empty string so this gate becomes a no-op and the only gate is
// Access at the edge.
export function AccessGate({ children }: AccessGateProps) {
  const required = import.meta.env.VITE_STUDIO_PASSPHRASE as string | undefined;
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (!required) return true;
    return sessionStorage.getItem("studio:unlocked") === "1";
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!required) setUnlocked(true);
  }, [required]);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === required) {
      sessionStorage.setItem("studio:unlocked", "1");
      setUnlocked(true);
    } else {
      setError("Wrong passphrase");
    }
  };

  return (
    <div className="studio-bg min-h-screen flex items-center justify-center p-6">
      <div className="studio-panel w-full max-w-md p-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Theme Studio</h1>
            <p className="text-xs opacity-65 leading-tight">waki-themes</p>
          </div>
        </div>

        <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-lg bg-violet-500/10 text-xs">
          <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">
            Authoring is gated to the family allowlist. Cloudflare Access on the
            hostname is the primary gate; this passphrase is the in-app backup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-[11px] font-semibold uppercase tracking-wider opacity-70 mb-1">
              Passphrase
            </span>
            <input
              type="password"
              autoFocus
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              className="studio-input"
              placeholder="enter studio passphrase"
            />
          </label>
          {error && (
            <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={!input.trim()}
            className="studio-button studio-button-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Unlock
          </button>
        </form>

        <p className="text-[10.5px] opacity-55 leading-snug mt-5">
          The published theme bundle is anonymous at{" "}
          <code className="text-[10px]">cdn.wakilabs.dev/waki-themes/themes.json</code>.
          Only the editor is gated.
        </p>
      </div>
    </div>
  );
}
