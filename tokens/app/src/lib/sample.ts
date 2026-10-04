// HTML strings used inside iframes for theme preview. The preview is
// intentionally calm: one shell, clear surface tiers, and no recursive
// panels inside panels unless the tier is being demonstrated directly.

export const MINIATURE_HTML = `
<div style="min-height:100vh;padding:12px;">
  <div class="glass-bar" style="height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;border-radius:12px;font-size:10px;font-weight:850;">
    <span>Waki</span>
    <span class="theme-swatch" style="width:34px;height:12px;border-radius:999px;display:inline-block;"></span>
  </div>
  <div class="glass" style="margin-top:10px;padding:11px;font-size:11px;">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
      <strong>Surface</strong>
      <span class="chip" style="font-size:9px;padding:3px 7px;">look</span>
    </div>
    <div style="height:7px;width:76%;border-radius:999px;background:currentColor;opacity:.34;margin-top:10px;"></div>
    <div style="height:7px;width:48%;border-radius:999px;background:currentColor;opacity:.18;margin-top:6px;"></div>
    <button class="btn-primary" style="margin-top:10px;padding:5px 10px;font-size:10px;">Open</button>
  </div>
</div>
`;

export const PREVIEW_HTML = `
<div style="min-height:100vh;display:flex;flex-direction:column;">
  <header class="glass-bar" style="position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 18px;">
    <div style="display:flex;align-items:center;gap:12px;min-width:0;">
      <div class="theme-swatch" style="width:34px;height:34px;border-radius:12px;box-shadow:0 10px 26px rgba(0,0,0,.18);flex:0 0 auto;"></div>
      <div style="min-width:0;">
        <div style="font-size:14px;font-weight:900;line-height:1.1;">Waki Shell</div>
        <div style="font-size:11px;opacity:.66;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">theme inspection surface</div>
      </div>
    </div>

    <div class="theme-switcher" style="display:flex;align-items:center;gap:4px;padding:4px;">
      <span style="font-size:11px;font-weight:800;padding:0 8px;opacity:.74;">Look</span>
      <span class="theme-swatch" style="width:24px;height:24px;border-radius:999px;display:inline-block;"></span>
      <button class="active" style="border:0;border-radius:999px;padding:6px 10px;font:inherit;font-size:11px;font-weight:800;">Theme</button>
      <button style="border:0;background:transparent;color:inherit;border-radius:999px;padding:6px 9px;font:inherit;font-size:11px;font-weight:800;opacity:.72;">Dark</button>
    </div>
  </header>

  <main style="display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px;padding:18px;flex:1;">
    <aside class="shell-sidebar" style="border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:12px;">
      <div>
        <div style="font-size:11px;font-weight:800;opacity:.66;text-transform:uppercase;">Workspace</div>
        <div style="font-size:18px;font-weight:900;margin-top:4px;">Recorder Lab</div>
      </div>
      <nav style="display:flex;flex-direction:column;gap:6px;">
        <div class="nav-item active" style="padding:10px 11px;font-weight:800;">Overview</div>
        <div class="nav-item" style="padding:10px 11px;font-weight:800;">Sessions</div>
        <div class="nav-item" style="padding:10px 11px;font-weight:800;">Artifacts</div>
        <div class="nav-item" style="padding:10px 11px;font-weight:800;">Settings</div>
      </nav>
      <div style="margin-top:auto;display:flex;gap:6px;flex-wrap:wrap;">
        <span class="status-success">online</span>
        <span class="status-info">v2</span>
      </div>
    </aside>

    <section class="shell-main" style="padding:18px;display:flex;flex-direction:column;gap:16px;min-width:0;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap;">
        <div>
          <div class="chip">today</div>
          <h1 style="font-size:30px;line-height:1.04;margin:10px 0 6px 0;font-weight:950;letter-spacing:0;">Theme preview</h1>
          <p style="margin:0;max-width:62ch;line-height:1.55;opacity:.76;">A focused shell for checking color, depth, hover language, controls, and mobile surfaces without visual clutter.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn-secondary">Schedule</button>
          <button class="btn-primary">Start session</button>
        </div>
      </div>

      <section style="display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:12px;">
        <div class="glass" style="padding:14px;">
          <div style="font-size:11px;font-weight:800;opacity:.64;text-transform:uppercase;">Base surface</div>
          <div style="font-size:26px;font-weight:950;margin-top:5px;">128</div>
          <span class="status-success">clear</span>
        </div>
        <div class="glass" style="padding:14px;">
          <div style="font-size:11px;font-weight:800;opacity:.64;text-transform:uppercase;">Hover lift</div>
          <div style="font-size:26px;font-weight:950;margin-top:5px;">12</div>
          <span class="status-warning">active</span>
        </div>
        <div class="glass" style="padding:14px;">
          <div style="font-size:11px;font-weight:800;opacity:.64;text-transform:uppercase;">Controls</div>
          <div style="font-size:26px;font-weight:950;margin-top:5px;">74%</div>
          <span class="status-info">ready</span>
        </div>
        <div class="glass" style="padding:14px;">
          <div style="font-size:11px;font-weight:800;opacity:.64;text-transform:uppercase;">Warning</div>
          <div style="font-size:26px;font-weight:950;margin-top:5px;">2</div>
          <span class="status-error">review</span>
        </div>
      </section>

      <section style="display:grid;grid-template-columns:minmax(0,1fr) minmax(290px,.58fr);gap:14px;">
        <div class="glass-elevated" style="padding:16px;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
            <h2 style="font-size:16px;margin:0;font-weight:950;">Surface tiers</h2>
            <span class="chip">elevated</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:14px;">
            <div class="glass" style="padding:12px;">
              <strong style="font-size:13px;">Panel</strong>
              <p style="font-size:12px;line-height:1.4;opacity:.68;margin:6px 0 0;">General app content.</p>
            </div>
            <div class="panel-nested" style="padding:12px;">
              <strong style="font-size:13px;">Inset</strong>
              <p style="font-size:12px;line-height:1.4;opacity:.68;margin:6px 0 0;">Nested detail only.</p>
            </div>
            <div class="mobile-card" style="padding:12px;">
              <strong style="font-size:13px;">Mobile</strong>
              <p style="font-size:12px;line-height:1.4;opacity:.68;margin:6px 0 0;">Companion surface.</p>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn-primary">Primary</button>
            <button class="btn-secondary">Secondary</button>
            <button class="btn-ghost">Ghost</button>
            <button class="btn-warning">Warning</button>
            <button class="btn-danger">Danger</button>
          </div>
        </div>

        <div class="glass" style="padding:16px;">
          <h2 style="font-size:16px;margin:0 0 12px 0;font-weight:950;">Form check</h2>
          <label style="display:block;font-size:12px;font-weight:800;opacity:.68;margin-bottom:5px;">Project</label>
          <input class="input" value="WakiRecorder" style="width:100%;margin-bottom:10px;" />
          <label style="display:block;font-size:12px;font-weight:800;opacity:.68;margin-bottom:5px;">Mode</label>
          <select class="input" style="width:100%;margin-bottom:12px;">
            <option>High fidelity</option>
            <option>Fast notes</option>
            <option>Meeting mode</option>
          </select>
          <button class="btn-success" style="width:100%;">Approve</button>
        </div>
      </section>

      <section class="glass-elevated" style="padding:16px;display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.55fr);gap:14px;align-items:stretch;">
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
            <h2 style="font-size:16px;margin:0;font-weight:950;">Overlay readability</h2>
            <span class="chip">dialog + menu</span>
          </div>
          <div style="position:relative;min-height:210px;border-radius:18px;overflow:hidden;padding:18px;background:
            radial-gradient(circle at 18% 16%, var(--waki-accent), transparent 30%),
            radial-gradient(circle at 82% 20%, var(--waki-accent-2), transparent 32%),
            repeating-linear-gradient(135deg, color-mix(in srgb, var(--waki-text) 12%, transparent) 0 8px, transparent 8px 18px),
            linear-gradient(135deg, var(--waki-bg-1), var(--waki-bg-2), var(--waki-bg-3));">
            <div class="surface-1 waki-dialog-surface" role="dialog" aria-modal="true" style="max-width:360px;padding:16px;border-radius:16px;">
              <div style="font-size:15px;font-weight:950;margin-bottom:4px;">Confirm publish</div>
              <p style="font-size:12px;line-height:1.45;margin:0 0 12px;opacity:.78;">This panel should keep the lighting from behind, but text and controls must stay crisp.</p>
              <div style="display:flex;gap:8px;justify-content:flex-end;">
                <button class="btn-secondary" style="padding:7px 10px;font-size:12px;">Cancel</button>
                <button class="btn-primary" style="padding:7px 10px;font-size:12px;">Publish</button>
              </div>
            </div>
          </div>
        </div>
        <div class="waki-popover-surface" role="menu" style="align-self:center;padding:10px;border-radius:14px;">
          <div style="font-size:11px;font-weight:850;opacity:.66;text-transform:uppercase;padding:6px 8px;">Quick actions</div>
          <div class="nav-item active" style="padding:10px 9px;font-weight:800;">Open settings</div>
          <div class="nav-item" style="padding:10px 9px;font-weight:800;">Duplicate theme</div>
          <div class="nav-item" style="padding:10px 9px;font-weight:800;">Export tokens</div>
          <div style="height:1px;background:var(--waki-border);margin:6px 2px;"></div>
          <div style="padding:9px;color:#dc2626;font-weight:850;">Archive</div>
        </div>
      </section>
    </section>
  </main>
</div>

<style>
@media (max-width: 900px) {
  main { grid-template-columns: 1fr !important; }
  aside { flex-direction: row !important; overflow-x: auto; }
  section[style*="grid-template-columns:repeat(4"] { grid-template-columns: repeat(2, minmax(130px, 1fr)) !important; }
  section[style*="290px"] { grid-template-columns: 1fr !important; }
  section[style*="260px"] { grid-template-columns: 1fr !important; }
}
@media (max-width: 560px) {
  header { align-items:flex-start !important; flex-direction:column !important; }
  section[style*="grid-template-columns:repeat(4"], section[style*="repeat(3"] { grid-template-columns: 1fr !important; }
}
</style>
`;
