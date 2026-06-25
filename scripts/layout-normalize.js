// scripts/layout-normalize.js
//
// Senior QA layout pass: enforces the unified max-w-4xl container contract
// described in the layout bug report. Purely structural — no text or
// component logic changes.
//
// What this script does
// ---------------------
//   1. Strips the redundant inline `style="max-width:56rem;margin:2rem auto;
//      padding:0 1rem"` from .related-guides / .all-calculators /
//      .explore-resources sections. The CSS rule already enforces max-w-4xl
//      mx-auto on these classes, so the inline style is dead weight that can
//      override the container-reset rule and cause the section to break out
//      of the unified grid. (75 occurrences across 48 files.)
//
//   2. Flattens the nested <div class="container"> inside
//      <section class="footnotes-section">. The outer .container already
//      provides max-w-4xl + mx-auto + px, so the inner one doubles padding
//      and can misalign the References list. (11 files.)
//
//   3. Flattens the nested back-button <div class="container" style="text-
//      align:center;..."> by dropping the `class="container"` token. The
//      inline text-align/padding style is preserved; only the redundant
//      container class is removed so the outer container governs width.
//      (13 files.)
//
// All transforms are regex-based and idempotent: running twice is a no-op.
// Operates on SOURCE html files (article/, tools/, wellness/, specials/,
// compare/, guide/, bra-size-guide/, and root pages) — never on dist/.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Directories whose index.html files are page templates (not assets).
const SCAN_DIRS = [
  'article',
  'tools',
  'wellness',
  'specials',
  'compare',
  'guide',
  'bra-size-guide',
  'how-to-measure-bra-size',
  'bra-buying-guide',
  'sports-bra-guide',
  'best-comfort-bras',
  'best-wireless-bras',
  'about',
  'privacy',
  'terms',
  'articles',
];

function listHtml(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtml(p));
    else if (entry.isFile() && entry.name === 'index.html') out.push(p);
  }
  return out;
}

function normalize(html) {
  let out = html;
  const stats = {
    inlineMaxw: 0,
    footnotesNested: 0,
    backBtnContainer: 0,
  };

  // 1. Strip redundant inline max-width:56rem style on the three section
  //    classes. Matches the exact inline string used across the templates;
  //    removing it lets the CSS class rule govern width consistently.
  out = out.replace(
    / style="max-width:56rem;margin:2rem auto;padding:0 1rem"/g,
    () => {
      stats.inlineMaxw++;
      return '';
    },
  );

  // 2. Flatten nested .container inside .footnotes-section.
  //    <section class="footnotes-section"><div class="container">X</div></section>
  //    -> <section class="footnotes-section">X</section>
  //    The footnotes content (h2 + ol.footnotes-list) contains no nested
  //    divs, so non-greedy match up to the first </div> is safe.
  out = out.replace(
    /<section class="footnotes-section"><div class="container">([\s\S]*?)<\/div><\/section>/g,
    (m, inner) => {
      stats.footnotesNested++;
      return `<section class="footnotes-section">${inner}</section>`;
    },
  );

  // 3. Flatten the nested back-button container div by removing only the
  //    `class="container" ` token (inline style preserved).
  out = out.replace(
    /<div class="container" style="text-align:center;padding:24px 0 40px">/g,
    (m) => {
      stats.backBtnContainer++;
      return '<div style="text-align:center;padding:24px 0 40px">';
    },
  );

  return { html: out, stats };
}

function main() {
  const files = [];
  for (const sub of SCAN_DIRS) {
    files.push(...listHtml(path.join(ROOT, sub)));
  }
  // Also include root index.html.
  const rootIdx = path.join(ROOT, 'index.html');
  if (fs.existsSync(rootIdx)) files.push(rootIdx);

  let touched = 0;
  const totals = { inlineMaxw: 0, footnotesNested: 0, backBtnContainer: 0 };
  for (const f of files) {
    const before = fs.readFileSync(f, 'utf8');
    const { html, stats } = normalize(before);
    const changed = html !== before;
    if (changed) {
      fs.writeFileSync(f, html, 'utf8');
      touched++;
    }
    totals.inlineMaxw += stats.inlineMaxw;
    totals.footnotesNested += stats.footnotesNested;
    totals.backBtnContainer += stats.backBtnContainer;
  }
  console.log(`[layout-normalize] HTML files scanned: ${files.length}`);
  console.log(`[layout-normalize] HTML files written: ${touched}`);
  console.log(`[layout-normalize] inline max-w stripped: ${totals.inlineMaxw}`);
  console.log(`[layout-normalize] footnotes nested containers flattened: ${totals.footnotesNested}`);
  console.log(`[layout-normalize] back-button containers flattened: ${totals.backBtnContainer}`);
  console.log('[layout-normalize] Done.');
}

main();
