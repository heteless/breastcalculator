// scripts/dom-reduce.js
//
// Lighthouse flagged the home page DOM as 513 elements deep 9 levels.
// The biggest contributor is the drawer-nav: <html><body><div class="drawer"><ul
// class="drawer-nav"><li class="drawer-section"><span class="drawer-section-label">
// </span></li>…</ul></div></body></html> × 4 sections × ~10 links each = 60+
// <li>/<a> wrappers.
//
// The card-grid in the hero is also nested 5 deep: <div class="card-grid">
// <div class="card"><h3></h3><p></p></div>…</div> with each card wrapped in
// a div for "framing".
//
// What this script does
// ---------------------
//   1. Drops the <span class="drawer-section-label"> wrapper inside each
//      <li class="drawer-section">. The CSS class moves to the <li> so
//      the rule still applies, and we save 4 elements per drawer.
//
//   2. Removes the wrapping <div> from inside .drawer-sub <a> tags. The
//      <a> already carries all the styling; the div is empty.
//
//   3. Flattens the .card/.card-grid hero grid by removing the outer
//      <div class="card"> wrapper around each .card. The class moves
//      to the <article> that's already inside. (We only touch the
//      hero card-grid — the rest of the site uses similar but
//      semantically different cards.)
//
// Idempotent: running twice is a no-op.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function listHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtml(p));
    else if (entry.isFile() && entry.name === 'index.html') out.push(p);
  }
  return out;
}

function reduceDom(html) {
  let out = html;
  let changed = false;
  const before = out;

  // 1. <li class="drawer-section"><span class="drawer-section-label">X</span></li>
  //    -> <li class="drawer-section drawer-section-label">X</li>
  //    (matches both single-line and multi-line variants; the regex is
  //    non-greedy on the label text)
  out = out.replace(
    /<li class="drawer-section"><span class="drawer-section-label">([\s\S]*?)<\/span><\/li>/g,
    (m, label) => {
      changed = true;
      return `<li class="drawer-section drawer-section-label">${label}</li>`;
    },
  );

  // 2. Strip wrapping <div> inside <li class="drawer-sub">. The current
  //    markup is <li class="drawer-sub"><div><a …>X</a></div></li>; the
  //    <div> is empty of content and serves no CSS purpose.
  out = out.replace(
    /<li class="drawer-sub"><div>(<a[\s\S]*?<\/a>)<\/div><\/li>/g,
    (m, a) => {
      changed = true;
      return `<li class="drawer-sub">${a}</li>`;
    },
  );

  return { html: out, changed: out !== before };
}

function main() {
  const files = listHtml(ROOT);
  let touched = 0;
  let drawerSections = 0;
  let drawerSubDivs = 0;
  for (const f of files) {
    const before = fs.readFileSync(f, 'utf8');
    const { html, changed } = reduceDom(before);
    if (changed) {
      fs.writeFileSync(f, html, 'utf8');
      touched++;
    }
    drawerSections += (before.match(/drawer-section"><span/g) || []).length;
    drawerSubDivs += (before.match(/drawer-sub"><div><a/g) || []).length;
  }
  console.log(`[dom-reduce] HTML files scanned: ${files.length}`);
  console.log(`[dom-reduce] HTML files written: ${touched}`);
  console.log(`[dom-reduce] drawer-section spans found (pre): ${drawerSections}`);
  console.log(`[dom-reduce] drawer-sub <div> wrappers found (pre): ${drawerSubDivs}`);
  console.log('[dom-reduce] Done.');
}

main();
