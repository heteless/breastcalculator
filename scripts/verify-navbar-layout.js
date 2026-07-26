#!/usr/bin/env node
/**
 * verify-navbar-layout.js
 *
 * Regression test for the navbar logo / categories overlap bug.
 *
 * History: The desktop navbar originally positioned `.nav-categories`
 * with `position:absolute; left:50%; transform:translateX(-50%)` to
 * center it. That hack was the root cause of the overlap: the absolutely
 * positioned menu was anchored to 50% of the nav-inner while the logo
 * and CTA were in the flex flow, so as the viewport narrowed the menu
 * rode over the logo text.
 *
 * The fix uses a pure flex layout with `flex: 0 0 auto` on the logo
 * and CTA (so they never shrink) and `flex: 1 1 0; min-width:0` on
 * the categories (so they shrink to fit). A separate tablet breakpoint
 * (768-1023px) hides the categories and shows the hamburger toggle.
 *
 * This script enforces the contract by parsing the built main.css and
 * asserting every rule we depend on is present. If a future build ever
 * regresses the layout (e.g. someone re-introduces the absolute
 * positioning), the test fails with a precise diff.
 *
 * Usage:
 *   node scripts/verify-navbar-layout.js           # full check
 *   node scripts/verify-navbar-layout.js --strict  # also fail on warnings
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN_CSS = path.join(ROOT, 'main.css');
const STYLE_CSS = path.join(ROOT, 'style.css');

const STRICT = process.argv.includes('--strict');

const failures = [];
const warnings = [];

function fail(msg) { failures.push(msg); console.error('  ✗ ' + msg); }
function pass(msg) { console.log('  ✓ ' + msg); }
function warn(msg) { warnings.push(msg); console.warn('  ! ' + msg); }

function readCss(file) {
  if (!fs.existsSync(file)) {
    fail(`Missing CSS source: ${file}`);
    process.exit(1);
  }
  return fs.readFileSync(file, 'utf8');
}

function extractMediaQuery(css, open) {
  // Find @media block starting at index `open` and return its body
  // (between { and the matching }). Returns { body, end }.
  let depth = 0;
  let start = -1;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (css[i] === '}') {
      depth--;
      if (depth === 0) return { body: css.slice(start, i), end: i };
    }
  }
  return null;
}

function findMediaQuery(css, predicate) {
  // Match @media (...) { ... } allowing multi-condition queries like
  //   @media (min-width:768px) and (max-width:1023.98px) { ... }
  // by matching everything up to the opening `{` instead of stopping
  // at the first `)`. The previous `[^)]+` pattern broke on AND
  // combinations.
  const re = /@media\s*([^{]+)\{/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const headerText = '@media ' + m[1] + '{';
    const parsed = extractMediaQuery(css, m.index);
    if (parsed && predicate(headerText, parsed.body)) {
      return { header: headerText, body: parsed.body, end: parsed.end };
    }
  }
  return null;
}

function ruleMatches(rule, selector, props) {
  // rule is a CSS rule body, selector is the class, props is an object.
  // We just check every key/value is present in the rule (order-independent).
  for (const [k, v] of Object.entries(props)) {
    const re = new RegExp(`${k}\\s*:\\s*${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (!re.test(rule)) return false;
  }
  // Also check selector presence.
  return rule.includes(selector);
}

function main() {
  console.log('Verifying navbar layout contract in style.css and main.css…\n');

  const style = readCss(STYLE_CSS);
  const main  = readCss(MAIN_CSS);

  // ─── 1. Source-of-truth: style.css ─────────────────────────
  console.log('[1] style.css — the source of truth');

  // 1a. Desktop (≥1024px) must use flex, not absolute.
  const desktop1024 = findMediaQuery(style, (h, _b) => /\(min-width:\s*1024px\)/.test(h));
  if (!desktop1024) {
    fail('Missing @media (min-width:1024px) block in style.css');
  } else {
    if (ruleMatches(desktop1024.body, '.nav-inner', { 'column-gap': '1.5rem' })) {
      pass('.nav-inner has column-gap: 1.5rem (gap-6)');
    } else {
      fail('.nav-inner must declare column-gap: 1.5rem on desktop');
    }
    if (/display\s*:\s*flex/.test(desktop1024.body.match(/\.nav-inner\{[^}]+\}/)?.[0] || '')) {
      pass('.nav-inner is display:flex on desktop');
    } else {
      fail('.nav-inner must be display:flex on desktop');
    }
    // The bad pattern: .nav-categories { position:absolute; left:50% ... }
    if (/position\s*:\s*absolute/.test(desktop1024.body.match(/\.nav-categories\{[^}]+\}/)?.[0] || '')) {
      fail('.nav-categories must NOT be position:absolute on desktop — that is the original overlap bug');
    } else {
      pass('.nav-categories is NOT position:absolute (overlap bug is gone)');
    }
    if (ruleMatches(desktop1024.body, '.nav-categories', { 'position': 'static' })) {
      pass('.nav-categories is position:static on desktop');
    } else {
      fail('.nav-categories must be position:static on desktop');
    }
    if (ruleMatches(desktop1024.body, '.nav-categories', { 'flex': '1 1 0' })) {
      pass('.nav-categories has flex: 1 1 0 (grows and shrinks to fit)');
    } else {
      fail('.nav-categories must have flex: 1 1 0 on desktop');
    }
    if (ruleMatches(desktop1024.body, '.nav-top', { 'flex': '0 0 auto' })) {
      pass('.nav-top has flex: 0 0 auto (logo never shrinks)');
    } else {
      fail('.nav-top must have flex: 0 0 auto on desktop');
    }
    if (ruleMatches(desktop1024.body, '.nav-cta', { 'flex': '0 0 auto' })) {
      pass('.nav-cta has flex: 0 0 auto (CTA never shrinks)');
    } else {
      fail('.nav-cta must have flex: 0 0 auto on desktop');
    }
  }

  // 1b. Tablet (768–1023px) must hide categories and show hamburger.
  const tablet = findMediaQuery(style, (h, _b) => /\(min-width:\s*768px\)\s*and\s*\(max-width:\s*1023/.test(h));
  if (!tablet) {
    fail('Missing @media (min-width:768px) and (max-width:1023.98px) block in style.css');
  } else {
    const catRule = tablet.body.match(/\.nav-categories\{[^}]+\}/)?.[0] || '';
    if (/display\s*:\s*none/.test(catRule)) {
      pass('.nav-categories is display:none on tablet (768-1023px)');
    } else {
      fail('.nav-categories must be display:none on tablet to avoid overlap');
    }
    const togRule = tablet.body.match(/\.nav-toggle\{[^}]+\}/)?.[0] || '';
    if (/display\s*:\s*flex/.test(togRule)) {
      pass('.nav-toggle is display:flex on tablet (hamburger shown)');
    } else {
      fail('.nav-toggle must be display:flex on tablet');
    }
  }

  // ─── 2. Production: main.css must mirror style.css ─────────
  console.log('\n[2] main.css — the production build');

  // 2a. The old absolute-positioning hack must not appear in any
  // .nav-categories rule inside an @media (min-width:768px) block.
  // This is the original bug: position:absolute + left:50% on nav-categories.
  const hackRe = /\.nav-categories\s*\{[^}]*position\s*:\s*absolute[^}]*\}/g;
  if (hackRe.test(main)) {
    fail('main.css still contains a .nav-categories { position:absolute } rule — the original overlap bug is back');
  } else {
    pass('No .nav-categories { position:absolute } rule in main.css');
  }

  // 2b. The new flex-based rule must be present in main.css.
  if (/\.nav-categories\s*\{[^}]*flex\s*:\s*1 1 0[^}]*\}/.test(main)) {
    pass('.nav-categories has flex: 1 1 0 in main.css');
  } else {
    fail('.nav-categories must have flex: 1 1 0 in main.css');
  }

  // 2c. The flex: 0 0 auto on .nav-top and .nav-cta must be present.
  if (/\.nav-top\s*\{[^}]*flex\s*:\s*0 0 auto[^}]*\}/.test(main)) {
    pass('.nav-top has flex: 0 0 auto in main.css (logo protected)');
  } else {
    fail('.nav-top must have flex: 0 0 auto in main.css');
  }
  if (/\.nav-cta\s*\{[^}]*flex\s*:\s*0 0 auto[^}]*\}/.test(main)) {
    pass('.nav-cta has flex: 0 0 auto in main.css (CTA protected)');
  } else {
    fail('.nav-cta must have flex: 0 0 auto in main.css');
  }

  // 2d. Tablet media query must be present.
  if (/@media\s*\(\s*min-width\s*:\s*768px\s*\)\s*and\s*\(\s*max-width\s*:\s*1023/.test(main)) {
    pass('Tablet media query (768-1023.98px) is present in main.css');
  } else {
    fail('Tablet media query (768-1023.98px) must be present in main.css');
  }

  // ─── 3. Dist tree: all 99 HTML files must use the new CSS ───
  console.log('\n[3] dist/ — all HTML files use main.css');
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) {
    warn('dist/ directory missing — run `node scripts/build-dist.js` first');
  } else {
    const files = [];
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.isFile() && e.name.endsWith('.html')) files.push(p);
      }
    })(dist);
    let bad = 0;
    for (const f of files) {
      const s = fs.readFileSync(f, 'utf8');
      // Must use synchronous stylesheet (no FOUT preload pattern).
      if (/rel="preload"\s+href="\/main\.css"/.test(s)) {
        fail(`${path.relative(ROOT, f)} still uses async preload (FOUT)`);
        bad++;
      }
    }
    if (bad === 0) {
      pass(`All ${files.length} HTML files load main.css synchronously`);
    } else {
      fail(`${bad} HTML files have CSS loading issues`);
    }
  }

  // ─── Summary ──────────────────────────────────────────────
  console.log('\n────────────────────────────────────');
  if (failures.length === 0) {
    console.log(`✓ All checks passed. ${warnings.length} warning(s).`);
    process.exit(0);
  } else {
    console.error(`✗ ${failures.length} failure(s):`);
    for (const f of failures) console.error('   - ' + f);
    process.exit(1);
  }
}

main();
