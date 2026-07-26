// scripts/fix-classic-header.js
// Ensure the production main.css contains all critical Header rules.
// Some prior build runs dropped !important / min-height rules; this
// script re-asserts the contract that:
//   .classic-navbar            = 64px sticky, no padding-top
//   .classic-navbar .nav-inner = flex-row 64px, no shrinking
//   .nav-categories (mobile)   = display:none below 1024px (drawer only)
//   .nav-toggle (mobile)       = shown below 1024px, hidden at 1024px+
//   .nav-label / .dropdown-menu styled for desktop hover dropdown
//   .navbar (legacy)           = override by classic-navbar

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  path.join(ROOT, 'main.css'),
  path.join(ROOT, 'assets', 'classic-system.css'),
];

// ─── Critical rules to inject (placed AFTER the existing classic-navbar block) ───
const HEADER_PATCH = `
/* ── classic-header patch (auto-injected by fix-classic-header.js) ── */
.classic-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  min-height: 64px !important;
  padding-top: 0 !important;
  background: rgba(255, 249, 245, 0.72);
  border-bottom: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, backdrop-filter 0.2s ease;
  display: flex;
  align-items: center;
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
}
.classic-navbar.is-scrolled {
  background: rgba(255, 249, 245, 0.92);
  border-bottom-color: var(--border);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.classic-navbar .nav-inner {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 64px !important;
  height: 64px;
}
.classic-navbar .nav-top {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
  min-width: 0;
}
.classic-navbar .nav-categories {
  list-style: none;
  margin: 0;
  padding: 0;
  display: none;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-width: 0;
}
.classic-navbar .nav-cta {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}
.classic-navbar .nav-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 14px 12px;
  min-width: 48px;
  min-height: 48px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: background 0.18s ease;
}
.classic-navbar .nav-toggle:hover { background: rgba(220, 180, 165, 0.12); }
.classic-navbar .nav-toggle:active { background: rgba(220, 180, 165, 0.22); }
.classic-navbar .nav-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: #5a4540;
  border-radius: 2px;
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.18s ease;
}
.classic-navbar .nav-toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.classic-navbar .nav-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.classic-navbar .nav-toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.classic-navbar .nav-category { position: relative; flex: 0 0 auto; }
.classic-navbar .nav-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #5a4540;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.18s ease;
}
.classic-navbar .nav-label:hover,
.classic-navbar .nav-label:focus-visible { color: #1f1412; outline: none; }
.classic-navbar .nav-label .arrow {
  display: inline-block;
  font-size: 0.7rem;
  transition: transform 0.2s ease;
  margin-left: 2px;
}
.classic-navbar .nav-category:hover .nav-label .arrow,
.classic-navbar .nav-category:focus-within .nav-label .arrow { transform: rotate(180deg); }
.classic-navbar .dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  min-width: 220px;
  background: #fff;
  border: 1px solid #e7dbd1;
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(61, 44, 42, 0.14);
  padding: 6px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0s linear 0.18s;
  z-index: 110;
}
/* Invisible bridge so hover never breaks while moving from trigger to menu */
.classic-navbar .dropdown-menu::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: transparent;
}
.classic-navbar .nav-category:hover > .dropdown-menu,
.classic-navbar .nav-category:focus-within > .dropdown-menu,
.classic-navbar .nav-category.is-open > .dropdown-menu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0s;
}
.classic-navbar .dropdown-menu a {
  display: block;
  padding: 9px 12px;
  font-size: 0.86rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  color: #2a1f1d;
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
}
.classic-navbar .dropdown-menu a:hover,
.classic-navbar .dropdown-menu a:focus-visible {
  background: rgba(220, 180, 165, 0.18);
  color: #1f1412;
  outline: none;
}
/* Tablet: hide categories, show toggle */
@media (min-width: 768px) and (max-width: 1023.98px) {
  .classic-navbar .nav-categories { display: none !important; }
  .classic-navbar .nav-toggle { display: flex !important; }
  .classic-navbar .nav-cta { display: flex; flex: 0 0 auto; }
}
/* Desktop ≥1024px: show categories, hide toggle */
@media (min-width: 1024px) {
  .classic-navbar .nav-categories { display: flex !important; }
  .classic-navbar .nav-toggle { display: none !important; }
}
/* Mobile <768px: hide categories, show toggle, compact logo */
@media (max-width: 767.98px) {
  .classic-navbar { padding: 0 12px; }
  .classic-navbar .nav-inner { padding: 0 12px; gap: 0.5rem; }
  .classic-navbar .nav-logo { font-size: 1rem; letter-spacing: 0.04em; }
  .classic-navbar .nav-categories { display: none !important; }
  .classic-navbar .nav-toggle { display: flex !important; }
  .classic-navbar .nav-cta a { padding: 7px 12px; font-size: 0.74rem; }
}
/* End of classic-header patch */
`;

let touched = 0;
for (const file of TARGETS) {
  if (!fs.existsSync(file)) continue;
  let css = fs.readFileSync(file, 'utf8');

  // Remove any previous "classic-header patch" block (idempotent)
  css = css.replace(
    /\/\* ── classic-header patch[\s\S]*?End of classic-header patch \*\/\n?/g,
    ''
  );

  // Append fresh patch at end of file
  css = css.replace(/\s*$/, '\n') + HEADER_PATCH + '\n';
  fs.writeFileSync(file, css, 'utf8');
  touched++;
  console.log('[fix-classic-header] patched: ' + path.relative(ROOT, file));
}
console.log('[fix-classic-header] done. ' + touched + ' file(s) updated.');
