// tools/update_theme.js
// Actualiza tools/template.html con el diseño Linear / Dark SaaS Tech UI + Technical HUD / Blueprint
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
let html = fs.readFileSync(templatePath, 'utf8');

const darkCSS = `<style>
:root {
  /* Linear / Dark SaaS Palette */
  --bg-root: #06080d;
  --bg-subtle: #0b0e17;
  --panel: #0f1322;
  --panel-alt: #151a2d;
  --panel-card: rgba(17, 22, 38, 0.72);
  --panel-glass: rgba(13, 17, 30, 0.85);

  /* High-Contrast Technical Typography Colors */
  --ink: #f8fafc;
  --ink-secondary: #cbd5e1;
  --ink-muted: #94a3b8;
  --ink-dim: #64748b;

  /* Subtle Blueprint Borders & Strokes */
  --border: rgba(255, 255, 255, 0.08);
  --border-subtle: rgba(255, 255, 255, 0.05);
  --border-light: rgba(255, 255, 255, 0.14);
  --border-focus: rgba(0, 240, 255, 0.45);
  --grid-line: rgba(255, 255, 255, 0.032);

  /* High-Contrast Neon Tech Accents */
  --accent-orange: #ff6b2c;
  --accent-orange-glow: rgba(255, 107, 44, 0.28);
  --accent-cyan: #00f0ff;
  --accent-cyan-glow: rgba(0, 240, 255, 0.25);
  --accent-purple: #8b5cf6;
  --accent-purple-glow: rgba(139, 92, 246, 0.28);
  --accent-lime: #10b981;
  --accent-lime-glow: rgba(16, 185, 129, 0.25);
  --accent-amber: #f59e0b;
  --accent-amber-glow: rgba(245, 158, 11, 0.25);
  --accent-red: #ef4444;

  /* Compatibility Aliases */
  --bg: var(--bg-root);
  --border-color: var(--border);
  --accent-yellow: var(--accent-amber);
  --accent-blue: var(--accent-cyan);
  --accent-green: var(--accent-lime);

  /* Radii & Shadows */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --b: 1px solid var(--border);
  --b-thin: 1px solid var(--border-subtle);
  --shadow-hud: 0 8px 32px -4px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
  --shadow-sm: 0 2px 10px -1px rgba(0, 0, 0, 0.4);

  /* Typography */
  --sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* BASE & DIGITAL BLUEPRINT GRID */
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  background-color: var(--bg-root);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.5;
  min-height: 100vh;
  background-image:
    radial-gradient(circle at 50% -80px, rgba(139, 92, 246, 0.16) 0%, transparent 600px),
    radial-gradient(circle at 100% 120px, rgba(0, 240, 255, 0.08) 0%, transparent 450px),
    linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 30px 30px, 30px 30px;
  background-attachment: fixed;
}
body { display: flex; flex-direction: column; overflow-x: hidden; }
a { color: var(--accent-cyan); text-decoration: none; font-weight: 600; transition: color .15s; }
a:hover { color: #fff; text-decoration: underline; }
.tabnum { font-variant-numeric: tabular-nums; font-family: var(--mono); }

/* TOP APPLICATION BAR (DARK SAAS GLASS) */
.app-header {
  background: rgba(9, 11, 18, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 16px;
  height: 60px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
.app-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 20px;
  border-right: 1px solid var(--border);
}
.app-brand .badge {
  background: rgba(0, 240, 255, 0.1);
  color: var(--accent-cyan);
  font-family: var(--mono);
  font-weight: 800;
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: var(--r-sm);
  border: 1px solid rgba(0, 240, 255, 0.35);
  box-shadow: 0 0 14px var(--accent-cyan-glow);
  letter-spacing: .05em;
}
.app-brand .title-wrap {
  display: flex;
  flex-direction: column;
}
.app-brand .main-title {
  font-family: var(--sans);
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1.2;
}
.app-brand .sub-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ink-muted);
  letter-spacing: .02em;
  font-family: var(--mono);
}
.app-meta {
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
}
.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border);
  border-radius: 9999px;
  padding: 4px 11px;
  color: var(--ink-secondary);
  font-family: var(--mono);
  white-space: nowrap;
}
.meta-chip .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-lime);
  box-shadow: 0 0 8px var(--accent-lime-glow);
  animation: pulseNeon 2s infinite;
}
@keyframes pulseNeon {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.85); }
}
.app-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.app-btn {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.76rem;
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--r-sm);
  padding: 7px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all .15s ease;
}
.app-btn:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}
.app-btn.primary {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.25));
  color: #fff;
  border: 1px solid rgba(0, 240, 255, 0.45);
  box-shadow: 0 0 16px var(--accent-cyan-glow);
}
.app-btn.primary:hover {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.35), rgba(139, 92, 246, 0.4));
  border-color: var(--accent-cyan);
  box-shadow: 0 0 22px rgba(0, 240, 255, 0.4);
}

/* WORKBENCH MAIN LAYOUT */
.workbench-body {
  flex: 1;
  display: grid;
  grid-template-columns: 400px 1fr;
  align-items: stretch;
  min-height: calc(100vh - 96px);
}

/* SIDEBAR CONTROLLER DOCK (HUD BLUEPRINT) */
.dock-sidebar {
  background: rgba(10, 13, 22, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 1px;
}
.dock-section {
  padding: 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: transparent;
  position: relative;
}
.dock-title {
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-secondary);
}
.dock-title span {
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 800;
  background: rgba(0, 240, 255, 0.1);
  color: var(--accent-cyan);
  border: 1px solid rgba(0, 240, 255, 0.25);
  padding: 2px 6px;
  border-radius: 4px;
}
.field-group {
  margin-bottom: 12px;
}
.field-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: var(--ink-muted);
  margin-bottom: 6px;
  font-family: var(--mono);
}
.coord-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}
.coord-input-wrap {
  display: flex;
  align-items: center;
  background: rgba(6, 8, 14, 0.7);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 2px 8px;
  transition: all .15s;
}
.coord-input-wrap:focus-within {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 12px var(--accent-cyan-glow);
}
.coord-input-wrap span {
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--ink-dim);
  margin-right: 6px;
}
.coord-input-wrap input {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--ink);
  font-family: var(--mono);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 6px 0;
  outline: none;
}
.btn-calc-main {
  width: 100%;
  padding: 9px;
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(139, 92, 246, 0.18));
  color: var(--ink);
  border: 1px solid rgba(0, 240, 255, 0.35);
  border-radius: var(--r-sm);
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.76rem;
  letter-spacing: .02em;
  cursor: pointer;
  transition: all .15s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.btn-calc-main:hover {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.28), rgba(139, 92, 246, 0.3));
  border-color: var(--accent-cyan);
  box-shadow: 0 0 18px var(--accent-cyan-glow);
  transform: translateY(-1px);
}
.presets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.preset-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  color: var(--ink-secondary);
  font-family: var(--sans);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 6px 4px;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: all .12s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.preset-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-light);
  color: #fff;
  transform: translateY(-1px);
}

/* RELIABILITY CHIPS */
.chips-r {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin-bottom: 8px;
}
.chips-r button {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border);
  color: var(--ink-secondary);
  font-family: var(--mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 6px 0;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: all .12s;
}
.chips-r button:hover:not([aria-pressed="true"]) {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-light);
  color: #fff;
}
.chips-r button[aria-pressed="true"] {
  background: var(--accent-purple);
  color: #fff;
  border-color: var(--accent-purple);
  box-shadow: 0 0 14px var(--accent-purple-glow);
}
.range-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}
.range-wrap input[type=range] {
  width: 100%;
  accent-color: var(--accent-cyan);
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  outline: none;
}
.range-readout {
  display: flex;
  justify-content: space-between;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-sm);
  color: var(--accent-cyan);
}

/* TOGGLES / OPTIONS */
.opt-box {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  padding: 9px 11px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  margin-bottom: 7px;
  cursor: pointer;
  font-size: 0.74rem;
  color: var(--ink-secondary);
  transition: all .15s;
}
.opt-box:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-light);
}
.opt-box input {
  width: 15px;
  height: 15px;
  accent-color: var(--accent-cyan);
  margin-top: 2px;
  flex-shrink: 0;
}
.opt-box b { color: #fff; }

/* STATION INSPECTOR CARD (HUD BLUEPRINT) */
.station-card {
  background: rgba(12, 16, 28, 0.75);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: var(--r-md);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 240, 255, 0.15);
  padding: 14px;
  position: relative;
}
.st-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 8px;
}
.st-badge {
  font-family: var(--mono);
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--accent-cyan);
  text-shadow: 0 0 12px var(--accent-cyan-glow);
}
.st-status {
  font-size: 0.65rem;
  font-weight: 800;
  background: rgba(16, 185, 129, 0.15);
  color: var(--accent-lime);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 2px 7px;
  border-radius: 9999px;
  text-transform: uppercase;
  font-family: var(--mono);
  letter-spacing: .04em;
}
.st-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 0.74rem;
}
.st-item { display: flex; flex-direction: column; }
.st-item .lbl { font-size: 0.65rem; color: var(--ink-dim); text-transform: uppercase; font-family: var(--mono); }
.st-item .val { font-weight: 700; color: #fff; font-family: var(--mono); }

/* HEATMAP SELECTOR GRID */
.heat-mode-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
}
.heat-btn {
  font-family: var(--sans);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--ink-secondary);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  text-align: left;
  cursor: pointer;
  transition: all .12s;
}
.heat-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: var(--border-light);
  color: #fff;
}
.heat-btn.active {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(139, 92, 246, 0.2));
  color: #fff;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 14px var(--accent-cyan-glow);
}

/* RIGHT STAGE / WORKSPACE */
.stage-main {
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow-y: auto;
}

/* TOP KPI STATS DECK (NEON HUD CARDS) */
.kpi-deck {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 18px 20px;
  background: transparent;
  border-bottom: 1px solid var(--border-subtle);
}
.kpi-card {
  background: var(--panel-card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hud);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all .2s ease;
  overflow: hidden;
}
.kpi-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-light);
}
.kpi-card .kpi-tag {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  margin-bottom: 6px;
  color: var(--ink-muted);
  font-family: var(--mono);
}
.kpi-card .kpi-value {
  font-family: var(--sans);
  font-weight: 800;
  font-size: clamp(1.8rem, 2.5vw, 2.3rem);
  line-height: 1.1;
  margin: 2px 0 4px 0;
  letter-spacing: -0.02em;
}
.kpi-card .kpi-sub {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ink-secondary);
  font-family: var(--mono);
}
.kpi-card .kpi-footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.68rem;
  color: var(--ink-dim);
  display: flex;
  justify-content: space-between;
  font-family: var(--mono);
}

/* CARD ACCENTS (NEON GLOW BORDERS) */
.kpi-card.c-red {
  border-top: 2px solid var(--accent-orange);
}
.kpi-card.c-red .kpi-value {
  color: var(--accent-orange);
  text-shadow: 0 0 20px var(--accent-orange-glow);
}
.kpi-card.c-yellow {
  border-top: 2px solid var(--accent-amber);
}
.kpi-card.c-yellow .kpi-value {
  color: var(--accent-amber);
  text-shadow: 0 0 20px var(--accent-amber-glow);
}
.kpi-card.c-blue {
  border-top: 2px solid var(--accent-cyan);
}
.kpi-card.c-blue .kpi-value {
  color: var(--accent-cyan);
  text-shadow: 0 0 20px var(--accent-cyan-glow);
}
.kpi-card.c-dark {
  border-top: 2px solid var(--accent-lime);
}
.kpi-card.c-dark .kpi-value {
  color: var(--accent-lime);
  text-shadow: 0 0 20px var(--accent-lime-glow);
}

/* WORKBENCH NAV TABS (LINEAR / IDE STYLE) */
.stage-tabs {
  display: flex;
  background: rgba(11, 14, 23, 0.5);
  border-bottom: 1px solid var(--border);
  padding: 10px 20px 0 20px;
  gap: 6px;
  overflow-x: auto;
}
.tab-btn {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.76rem;
  color: var(--ink-muted);
  background: transparent;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: var(--r-sm) var(--r-sm) 0 0;
  padding: 8px 14px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all .15s;
}
.tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}
.tab-btn.active {
  color: #fff;
  background: var(--panel);
  border: 1px solid var(--border);
  border-bottom: 1px solid var(--panel);
  position: relative;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}
.tab-btn .tab-count {
  background: rgba(255, 255, 255, 0.08);
  color: var(--ink-secondary);
  padding: 1px 6px;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-family: var(--mono);
}
.tab-btn.active .tab-count {
  background: rgba(0, 240, 255, 0.15);
  color: var(--accent-cyan);
  border: 1px solid rgba(0, 240, 255, 0.3);
}

/* TAB PANELS CONTAINER */
.stage-content {
  flex: 1;
  padding: 20px;
}
.tab-pane { display: none; }
.tab-pane.active { display: block; animation: fadeIn .2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

/* TAB 1: MAP VIEW */
.map-container {
  border: 1px solid var(--border-light);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hud);
  background: #090c14;
  position: relative;
  overflow: hidden;
}
#map {
  height: 540px;
  width: 100%;
  background: #090c14;
}

/* FLOATING HUD WIDGETS OVER MAP */
.thermal-legend {
  position: absolute;
  bottom: 26px;
  right: 14px;
  z-index: 999;
  background: rgba(9, 12, 22, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--r-md);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  padding: 11px 14px;
  font-size: 0.72rem;
  min-width: 250px;
  max-width: 310px;
  transition: all .15s ease;
  pointer-events: auto;
}
.thermal-legend-title {
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.74rem;
  text-transform: uppercase;
  margin-bottom: 7px;
  letter-spacing: .02em;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
}
.thermal-bar {
  height: 12px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 6px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}
.thermal-labels {
  display: flex;
  justify-content: space-between;
  font-weight: 800;
  font-size: 0.7rem;
  color: var(--ink-secondary);
  font-family: var(--mono);
}

.map-floating-panel {
  position: absolute;
  bottom: 14px;
  left: 14px;
  z-index: 1000;
  background: rgba(9, 12, 22, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--r-md);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  padding: 10px 14px;
  max-width: 270px;
  font-size: 0.72rem;
}
.map-floating-panel h4 {
  font-family: var(--sans);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 7px;
  color: #fff;
  letter-spacing: .03em;
}
.map-legend {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: 600;
  color: var(--ink-secondary);
}
.legend-item { display: flex; align-items: center; gap: 8px; }
.pin-icon { width: 11px; height: 11px; border-radius: 50%; }
.pin-project { background: var(--accent-orange); border: 1px solid #fff; box-shadow: 0 0 8px var(--accent-orange); }
.pin-active-st { background: var(--accent-cyan); border: 1px solid #fff; box-shadow: 0 0 8px var(--accent-cyan); }
.pin-other-st { background: rgba(255, 255, 255, 0.3); border: 1px solid rgba(255, 255, 255, 0.6); }

/* LEAFLET CONTROLS IN DARK HUD */
.leaflet-control-layers {
  border: 1px solid var(--border-light)!important;
  border-radius: var(--r-md)!important;
  box-shadow: var(--shadow-hud)!important;
  background: rgba(9, 12, 22, 0.92)!important;
  backdrop-filter: blur(16px)!important;
  -webkit-backdrop-filter: blur(16px)!important;
  font-family: var(--sans)!important;
  font-size: 0.73rem!important;
  font-weight: 600!important;
  color: var(--ink-secondary)!important;
  padding: 10px 14px!important;
}
.leaflet-control-layers-base label,
.leaflet-control-layers-overlays label {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  margin-bottom: 5px;
  color: var(--ink-secondary);
  transition: color .12s;
}
.leaflet-control-layers-base label:hover,
.leaflet-control-layers-overlays label:hover {
  color: #fff;
}
.leaflet-control-layers input {
  accent-color: var(--accent-cyan);
}
.leaflet-bar {
  border: 1px solid var(--border-light)!important;
  border-radius: var(--r-sm)!important;
  overflow: hidden;
  box-shadow: var(--shadow-sm)!important;
}
.leaflet-bar a {
  background: rgba(9, 12, 22, 0.9)!important;
  color: var(--ink)!important;
  border-bottom: 1px solid var(--border)!important;
  font-weight: 700!important;
  transition: all .12s;
}
.leaflet-bar a:hover {
  background: rgba(255, 255, 255, 0.15)!important;
  color: var(--accent-cyan)!important;
}

/* TAB 2: CALCULATION STEPS (BLUEPRINT CODE CARDS) */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.step-card {
  background: var(--panel-card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hud);
  padding: 16px;
  position: relative;
  transition: all .2s;
}
.step-card:hover {
  border-color: var(--border-light);
  transform: translateY(-2px);
}
.step-card h3 {
  font-family: var(--sans);
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}
.step-card .num {
  font-family: var(--mono);
  font-size: 0.7rem;
  font-weight: 800;
  background: rgba(0, 240, 255, 0.12);
  color: var(--accent-cyan);
  border: 1px solid rgba(0, 240, 255, 0.28);
  padding: 2px 7px;
  border-radius: 4px;
}
.eq-block {
  background: #060810;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-sm);
  padding: 10px 12px;
  font-family: var(--mono);
  font-size: 0.74rem;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #38bdf8;
  margin-top: 8px;
}
.eq-block b {
  color: var(--accent-orange);
  text-shadow: 0 0 10px var(--accent-orange-glow);
}

/* TAB 3: CHARTS (DARK TECH HUD) */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.chart-box {
  background: var(--panel-card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hud);
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 420px;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 8px;
}
.chart-header h3 {
  font-family: var(--sans);
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
}
.chart-canvas-wrap {
  flex: 1;
  position: relative;
  min-height: 0;
}

/* TAB 4: ANNUAL DATA TABLE */
.table-panel {
  background: var(--panel-card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hud);
  padding: 16px;
}
.table-scroll {
  max-height: 480px;
  overflow: auto;
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-sm);
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  font-family: var(--mono);
}
th, td {
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 12px;
  text-align: right;
}
th {
  background: #090c16;
  color: var(--ink-secondary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.7rem;
  position: sticky;
  top: 0;
  z-index: 5;
  letter-spacing: .03em;
}
td:first-child, th:first-child { text-align: left; }
tbody tr:hover td { background: rgba(0, 240, 255, 0.05); color: #fff; }
tr.extreme-row td { background: rgba(255, 107, 44, 0.12); color: var(--accent-orange); font-weight: 700; }

/* TAB 5: VERIFICATION SUITE */
.verif-box {
  background: var(--panel-card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hud);
  padding: 16px;
}
.badge-pass {
  background: rgba(16, 185, 129, 0.15);
  color: var(--accent-lime);
  border: 1px solid rgba(16, 185, 129, 0.35);
  font-weight: 800;
  padding: 3px 9px;
  border-radius: var(--r-sm);
  display: inline-block;
  box-shadow: 0 0 10px var(--accent-lime-glow);
}
.badge-fail {
  background: rgba(239, 68, 68, 0.15);
  color: var(--accent-red);
  border: 1px solid rgba(239, 68, 68, 0.35);
  font-weight: 800;
  padding: 3px 9px;
  border-radius: var(--r-sm);
  display: inline-block;
}

/* TAB 6: ABOUT / METHODOLOGY */
.about-box {
  background: var(--panel-card);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-hud);
  padding: 24px;
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--ink-secondary);
}
.about-box h3 {
  font-family: var(--sans);
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
  margin: 16px 0 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 6px;
}
.about-box h3:first-child { margin-top: 0; }
.about-box p { margin-bottom: 10px; }
.about-box ul { margin: 0 0 14px 24px; }
.about-box li { margin-bottom: 4px; }

/* TOAST NOTIFICATION */
#toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  background: rgba(9, 12, 22, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: #fff;
  border: 1px solid var(--accent-cyan);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px var(--accent-cyan-glow);
  padding: 10px 18px;
  border-radius: var(--r-sm);
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.8rem;
  display: none;
}

/* BOTTOM STATUS BAR (HUD INSTRUMENTATION) */
.workbench-statusbar {
  background: rgba(7, 9, 15, 0.92);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--border);
  color: var(--ink-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  font-size: 0.7rem;
  font-family: var(--mono);
}
.sb-group { display: flex; align-items: center; gap: 16px; }
.sb-item { display: flex; align-items: center; gap: 6px; }
.sb-label { color: var(--ink-dim); text-transform: uppercase; }
.sb-val { font-weight: 700; color: #fff; }

/* RESPONSIVE BREAKPOINTS */
@media (max-width: 1150px) {
  .workbench-body { grid-template-columns: 1fr; }
  .dock-sidebar { border-right: none; border-bottom: 1px solid var(--border); }
  .kpi-deck { grid-template-columns: 1fr 1fr; }
  .steps-grid { grid-template-columns: 1fr; }
  .charts-grid { grid-template-columns: 1fr; }
}
@media (max-width: 650px) {
  .app-header { grid-template-columns: 1fr; height: auto; padding: 10px; gap: 8px; }
  .app-brand { border-right: none; padding-right: 0; }
  .app-actions { border-top: 1px solid var(--border); padding-top: 8px; }
  .kpi-deck { grid-template-columns: 1fr; }
  .chips-r { grid-template-columns: repeat(5, 1fr); }
  .presets-grid { grid-template-columns: 1fr 1fr; }
}
@media print {
  .app-header, .dock-sidebar, .stage-tabs, .workbench-statusbar, .app-actions { display: none!important; }
  .workbench-body { display: block; }
  .tab-pane { display: block!important; margin-bottom: 20px; page-break-inside: avoid; }
}
</style>`;

// 1. Reemplazar bloque <style>...</style>
html = html.replace(/<style>[\s\S]*?<\/style>/, darkCSS);

// 2. Actualizar tile layers y mapa para incluir Esri Dark Gray Base como capa principal por defecto
const oldLayersTarget = /const esriTopo = L\.tileLayer\([\s\S]*?const baseMaps = {[\s\S]*?};[\s\S]*?const map = L\.map\('map', {[\s\S]*?layers: \[esriTopo\][\s\S]*?}\)\.setView\(\[18\.75, -70\.2\], 8\);/;

const newLayersReplacement = `const esriDark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 16,
  attribution: '© Esri, HERE, Garmin'
});
const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '© Esri, Maxar, Earthstar Geographics'
});
const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '© Esri, USGS, NOAA'
});
const esriStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '© Esri, HERE, Garmin, USGS'
});
const esriLight = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 16,
  attribution: '© Esri, HERE, Garmin'
});
const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: '© OpenTopoMap contributors'
});

const baseMaps = {
  "🌌 Plano Técnico Oscuro (HUD)": esriDark,
  "🛰️ Satélite de Alta Resolución": esriSat,
  "🚗 Calles & Topografía (Esri)": esriTopo,
  "🛣️ Red Vial Detallada": esriStreet,
  "⚪ Plano Claro Minimalista": esriLight,
  "🏔️ Relieve OpenTopoMap": openTopo
};

const map = L.map('map', {
  zoomControl: true,
  layers: [esriDark]
}).setView([18.75, -70.2], 8);`;

if (oldLayersTarget.test(html)) {
  html = html.replace(oldLayersTarget, newLayersReplacement);
  console.log('OK: Reemplazado base layers con esriDark por defecto.');
} else {
  console.warn('Advertencia: No se encontró patrón exacto de capas base.');
}

// 3. Actualizar iconos del mapa a estilo HUD Neón
const oldIconsTarget = /const icoSt = L\.divIcon\([\s\S]*?const icoSel = L\.divIcon\([\s\S]*?const icoPin = L\.divIcon\([\s\S]*?\);[\s\S]*?const link = L\.polyline\(\[\], { color: '#000', weight: 3, dashArray: '6 6' }\);/;

const newIconsReplacement = `const icoSt = L.divIcon({ className: '', html: '<span style="display:block;width:12px;height:12px;border-radius:50%;border:2px solid #00f0ff;background:rgba(0,240,255,0.4);box-shadow:0 0 8px #00f0ff"></span>', iconSize: [12, 12], iconAnchor: [6, 6] });
const icoSel = L.divIcon({ className: '', html: '<span style="display:block;width:16px;height:16px;border-radius:50%;border:2px solid #ff6b2c;background:#ff6b2c;box-shadow:0 0 16px #ff6b2c"></span>', iconSize: [16, 16], iconAnchor: [8, 8] });
const icoPin = L.divIcon({ className: '', html: '<div style="width:24px;height:24px;position:relative;display:flex;align-items:center;justify-content:center"><span style="position:absolute;width:24px;height:24px;border:2px dashed #00f0ff;border-radius:50%"></span><span style="display:block;width:10px;height:10px;background:#ff6b2c;border:2px solid #fff;border-radius:2px;transform:rotate(45deg);box-shadow:0 0 10px #ff6b2c"></span></div>', iconSize: [24, 24], iconAnchor: [12, 12] });
const link = L.polyline([], { color: '#00f0ff', weight: 2.5, dashArray: '4 6', opacity: 0.85 });`;

if (oldIconsTarget.test(html)) {
  html = html.replace(oldIconsTarget, newIconsReplacement);
  console.log('OK: Iconos y enlace vectorial actualizados a estilo HUD Neón.');
} else {
  console.warn('Advertencia: No se encontró patrón de iconos.');
}

// 4. Actualizar configuración de Chart.js a Dark HUD
const oldChartCfgTarget = /Chart\.defaults\.font\.family = "'JetBrains Mono', monospace";[\s\S]*?Chart\.defaults\.font\.weight = 700;[\s\S]*?Chart\.defaults\.color = '#000';[\s\S]*?Chart\.defaults\.borderColor = '#000';[\s\S]*?const gridOpt = { color: 'rgba\(0,0,0,\.15\)', lineWidth: 1 };/;

const newChartCfgReplacement = `Chart.defaults.font.family = "'JetBrains Mono', monospace";
Chart.defaults.font.weight = 600;
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';
const gridOpt = { color: 'rgba(255,255,255,0.06)', lineWidth: 1 };`;

if (oldChartCfgTarget.test(html)) {
  html = html.replace(oldChartCfgTarget, newChartCfgReplacement);
  console.log('OK: Configuración de Chart.js actualizada a Dark HUD.');
}

// 5. Actualizar datasets de Chart.js con colores de alto contraste neón
const oldDatasetsTarget = /chDist\.data\.datasets = \[[\s\S]*?chDist\.update\(\);[\s\S]*?chYear\.data\.labels = s\.years;[\s\S]*?chYear\.data\.datasets = \[[\s\S]*?chYear\.update\(\);/;

const newDatasetsReplacement = `chDist.data.datasets = [
    { label: 'Hist. T máx. prom. 7 días', data: histStep(r.t7), borderColor: '#ff6b2c', backgroundColor: 'rgba(255,107,44,0.3)', fill: 'origin', borderWidth: 2, pointRadius: 0, tension: 0 },
    { label: 'Hist. T mín. anual', data: histStep(r.tmin), borderColor: '#00f0ff', backgroundColor: 'rgba(0,240,255,0.25)', fill: 'origin', borderWidth: 2, pointRadius: 0, tension: 0 },
    { label: 'Normal T máx. (Gauss)', data: pdfPts(r.T_air_max, r.sigma_air_max), borderColor: '#ff6b2c', borderWidth: 3, pointRadius: 0, fill: false },
    { label: 'Normal T mín. (Gauss)', data: pdfPts(r.T_air_min, r.sigma_air_min), borderColor: '#00f0ff', borderDash: [6, 4], borderWidth: 3, pointRadius: 0, fill: false }
  ];
  chDist.update();

  chYear.data.labels = s.years;
  chYear.data.datasets = [
    { label: 'T máx. prom. 7 días (°C)', data: r.t7, backgroundColor: 'rgba(255,107,44,0.85)', borderColor: '#ff6b2c', borderWidth: 1.5, borderRadius: 4 },
    { label: 'T mín. anual (°C)', data: r.tmin, backgroundColor: 'rgba(0,240,255,0.75)', borderColor: '#00f0ff', borderWidth: 1.5, borderRadius: 4 }
  ];
  chYear.update();`;

if (oldDatasetsTarget.test(html)) {
  html = html.replace(oldDatasetsTarget, newDatasetsReplacement);
  console.log('OK: Datasets de Chart.js actualizados a paleta Neón.');
}

fs.writeFileSync(templatePath, html, 'utf8');
console.log('OK: tools/template.html guardado con éxito.');
