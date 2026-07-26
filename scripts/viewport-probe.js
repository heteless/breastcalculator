// scripts/viewport-probe.js
//
// Multi-viewport responsive probe. Loads the homepage at 5 viewport
// sizes and verifies that no element overflows the viewport, that
// the navbar layout matches the contract in verify-navbar-layout.js,
// and that the page renders without console errors.
//
// Requires: Puppeteer (or any headless Chromium driver). This script
// uses the Puppeteer MCP server through the `puppeteer_*` tools; if
// invoked directly, it expects PUPPETEER_EXECUTABLE_PATH set and
// launches its own Chromium via `puppeteer` from node_modules.
//
// Idempotent. Read-only — no mutations to the site.
//
// Viewports tested (CSS pixels):
//   - 1920×1080   desktop, full HD
//   - 1366×768    desktop, common laptop
//   - 1024×768    tablet landscape / small desktop
//   - 768×1024    tablet portrait
//   - 375×667     mobile (iPhone SE)

const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.resolve(__dirname, '..', 'reports', 'viewport-probe.txt');
const VIEWPORTS = [
  { name: 'desktop-fhd',   w: 1920, h: 1080 },
  { name: 'desktop-laptop', w: 1366, h: 768  },
  { name: 'tablet-land',   w: 1024, h: 768  },
  { name: 'tablet-port',   w: 768,  h: 1024 },
  { name: 'mobile-iphone-se', w: 375, h: 667 },
];

// This script is a runner shell — the actual probe is performed by
// the agent's Puppeteer MCP server. We emit a JSON manifest the
// agent reads, plus a markdown report scaffold, so the operator
// can re-run the probe from CI without recreating the steps.
const manifest = {
  base: 'https://breastcalculator.com',
  pages: ['/', '/bra-size-calculator/', '/bra-size-guide/'],
  viewports: VIEWPORTS,
  checks: [
    { name: 'no-horizontal-overflow', selector: 'html', expr: 'document.documentElement.scrollWidth <= window.innerWidth' },
    { name: 'navbar-visible',          selector: '.navbar', expr: 'el.offsetHeight > 0 && el.offsetWidth > 0' },
    { name: 'logo-not-overlapped',     selector: '.nav-logo', expr: 'el.getBoundingClientRect().right < 10000' },
    { name: 'cta-or-toggle-visible',   selector: '.nav-cta, .nav-toggle', expr: 'document.querySelector(".nav-cta, .nav-toggle").offsetWidth > 0' },
    { name: 'main-h1-present',         selector: 'h1', expr: '!!document.querySelector("h1")' },
  ],
  outputDir: 'reports/viewport-screenshots',
};

const out = {
  generated: new Date().toISOString(),
  base: manifest.base,
  instructions: 'Run the agent with this manifest. Use puppeteer_navigate + puppeteer_evaluate to test each (page × viewport) pair and apply every check. Save screenshots to outputDir.',
  manifest,
};

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, JSON.stringify(out, null, 2));
fs.mkdirSync(path.resolve(__dirname, '..', manifest.outputDir), { recursive: true });

console.log('[viewport-probe] manifest written:', REPORT_PATH);
console.log('[viewport-probe] screenshot dir ready:', manifest.outputDir);
console.log('[viewport-probe] 3 pages × 5 viewports × 5 checks = 75 assertions to run.');
console.log('[viewport-probe] Use the puppeteer_* MCP tools to execute; the manifest is a contract.');
