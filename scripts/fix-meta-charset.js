// fix-meta-charset.js — restore <meta charset="utf-8"/> to HTML files
// whose charset attribute was stripped by the legacy optimizer. The
// optimizer used to delete `charset="utf-8"` from <meta> tags, leaving
// an empty <meta/>. Without a charset declaration browsers default to
// ISO-8859-1 / Windows-1252 and render non-ASCII characters such as
// the ▾ dropdown arrow as garbled mojibake ("â–¾").
//
// Strategy:
//   1. Walk every index.html in the project (excluding node_modules,
//      .git, scripts, dist, dist-dryrun).
//   2. If the file already has a valid `<meta charset="utf-8">` (case
//      insensitive, any quote style), leave it alone.
//   3. Otherwise, replace any empty <meta/> that immediately follows
//      the <meta http-equiv="Cache-Control" ...> tag with
//      <meta charset="utf-8"/>. If no empty meta exists, insert a
//      fresh <meta charset="utf-8"/> right after <head>.
//   4. Write the file back in UTF-8.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'dist', 'dist-dryrun', '.wrangler']);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.isFile() && entry.name === 'index.html') yield p;
  }
}

const CHARSET_RE = /<meta\s+charset\s*=\s*["'][a-zA-Z0-9-]+["']\s*\/?>/i;

function fixCharset(html) {
  if (CHARSET_RE.test(html)) {
    return { html, changed: false, reason: 'already-has-charset' };
  }

  // Case A: empty <meta/> placeholder where charset was stripped
  const emptyMetaRe = /(<meta\s+http-equiv=["']Cache-Control["'][^>]*\/?>)(\s*<meta\s*\/?>)/i;
  if (emptyMetaRe.test(html)) {
    const fixed = html.replace(emptyMetaRe, '$1<meta charset="utf-8"/>');
    return { html: fixed, changed: true, reason: 'replaced-empty-meta' };
  }

  // Case B: no meta at all, insert right after <head>
  const headRe = /(<head[^>]*>)/i;
  if (headRe.test(html)) {
    const fixed = html.replace(headRe, '$1<meta charset="utf-8"/>');
    return { html: fixed, changed: true, reason: 'inserted-after-head' };
  }

  return { html, changed: false, reason: 'no-head-tag' };
}

let totalFiles = 0;
let totalChanged = 0;
const reasons = {};
for (const file of walk(ROOT)) {
  totalFiles++;
  const original = fs.readFileSync(file, 'utf8');
  const { html, changed, reason } = fixCharset(original);
  reasons[reason] = (reasons[reason] || 0) + 1;
  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    totalChanged++;
  }
}

console.log(`[fix-meta-charset] Scanned ${totalFiles} HTML files`);
console.log(`[fix-meta-charset] Updated ${totalChanged} file(s)`);
for (const [reason, count] of Object.entries(reasons)) {
  console.log(`  ${reason.padEnd(24)} ${count}`);
}
