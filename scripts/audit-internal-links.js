// scripts/audit-internal-links.js
// Walk every HTML file, extract internal hrefs, resolve to file paths,
// and report any that don't resolve to a 200-status page (no index.html)
// and aren't covered by a 301 redirect in _redirects.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['.git', 'node_modules', 'dist', 'dist-dryrun', '.wrangler', '.vscode', '.tmp-gen']);
const SKIP_FILES = new Set(['footer.html', 'header.html', '404.html', '404/index.html', 'header-wellness-popup.html']);

// Load _redirects rules (Cloudflare Pages format) so we can treat covered paths as resolved.
const REDIRECTS_PATH = path.join(ROOT, '_redirects');
const REDIRECT_RULES = []; // [{from, to, status}]
if (fs.existsSync(REDIRECTS_PATH)) {
  for (const line of fs.readFileSync(REDIRECTS_PATH, 'utf8').split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const m = s.match(/^(\S+)\s+(\S+)\s+(\d{3})\s*$/);
    if (!m) continue;
    REDIRECT_RULES.push({ from: m[1], to: m[2], status: m[3] });
  }
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith('.html')) {
      const rel = path.relative(ROOT, p).replace(/\\/g, '/');
      if (SKIP_FILES.has(rel)) continue;
      out.push(p);
    }
  }
  return out;
}

function relUrl(abs) {
  let r = abs.replace(/\\/g, '/').replace(/^d:\/DevProject\/breastcalculator\//i, '');
  if (r === 'index.html') return '/';
  if (r.endsWith('/index.html')) return '/' + r.slice(0, -('/index.html'.length)) + '/';
  return '/' + r;
}

function fileExistsForUrlPath(urlPath) {
  // urlPath is the href (e.g. /foo/, /foo, /foo.html, foo.html)
  // Strip fragment and query.
  const cleanPath = urlPath.split('#')[0].split('?')[0];
  if (!cleanPath) return true; // anchors only

  // External link (http/https/mailto/tel) — skip
  if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(cleanPath)) return true;

  // Normalize: ensure leading /
  let p = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;

  // Build the candidate file paths
  const candidates = [];
  if (p === '/' || p === '') {
    candidates.push('index.html');
  } else {
    // strip leading slash
    let rel = p.replace(/^\//, '');
    // try as directory + index.html
    if (rel.endsWith('/')) {
      candidates.push(rel + 'index.html');
    } else {
      // /foo/ -> foo/index.html
      candidates.push(rel + '/index.html');
      // /foo -> foo/index.html
      candidates.push(rel + '/index.html');
      // /foo.html -> foo.html
      candidates.push(rel);
      // /foo (no slash, no html) -> foo/index.html
      if (!rel.endsWith('.html')) candidates.push(rel + '/index.html');
    }
  }

  for (const c of candidates) {
    if (fs.existsSync(path.join(ROOT, c))) return true;
  }
  return false;
}

function isCoveredByRedirect(urlPath) {
  // urlPath e.g. /foo/ or /foo
  for (const r of REDIRECT_RULES) {
    if (r.status !== '301' && r.status !== '302') continue;
    if (r.from === urlPath) return r.to;
    if (r.from + '/' === urlPath) return r.to;
    if (r.from === urlPath.replace(/\/$/, '')) return r.to;
  }
  return null;
}

const files = walk(ROOT);
console.log('AUDITING', files.length, 'HTML files for internal link integrity\n');

let totalChecked = 0;
let totalBroken = 0;
const broken = []; // [{from, href, reason}]

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const fromUrl = relUrl(f);
  const hrefs = Array.from(c.matchAll(/href="([^"]+)"/g)).map(m => m[1]);

  for (const href of hrefs) {
    if (!href) continue;
    // Skip pure anchors
    if (href.startsWith('#')) continue;
    // Skip external, mailto, tel, javascript
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    // Skip data URIs
    if (href.startsWith('data:')) continue;

    // Resolve relative to current page if not root-relative
    let absoluteHref;
    if (href.startsWith('/')) {
      absoluteHref = href;
    } else {
      // e.g. "foo.html" or "../foo"
      // In URL semantics, a trailing-slash URL is a directory; dirname() of a
      // posix path strips a trailing slash differently than URL semantics.
      // Use the URL itself as the base directory if it already ends with /.
      let baseDir = fromUrl.endsWith('/') ? fromUrl : fromUrl.replace(/[^/]*$/, '');
      absoluteHref = path.posix.normalize(baseDir + href);
    }

    totalChecked++;
    if (fileExistsForUrlPath(absoluteHref)) continue;
    const redirectTarget = isCoveredByRedirect(absoluteHref);
    if (redirectTarget) continue;
    totalBroken++;
    broken.push({ from: fromUrl, href: absoluteHref, raw: href });
  }
}

console.log(`Internal links checked: ${totalChecked}`);
console.log(`Broken:                 ${totalBroken}\n`);

if (broken.length > 0) {
  console.log('=== BROKEN INTERNAL LINKS ===\n');
  // Group by href to surface most common offenders
  const byHref = {};
  for (const b of broken) {
    byHref[b.href] = (byHref[b.href] || []);
    byHref[b.href].push(b.from);
  }
  for (const [href, froms] of Object.entries(byHref).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${href}  (referenced from ${froms.length} page${froms.length > 1 ? 's' : ''})`);
    if (froms.length <= 5) {
      for (const fr of froms) console.log(`      <- ${fr}`);
    } else {
      for (const fr of froms.slice(0, 3)) console.log(`      <- ${fr}`);
      console.log(`      ... and ${froms.length - 3} more`);
    }
  }
}

// Write CSV
const csv = ['from,href,raw'];
for (const b of broken) {
  csv.push([b.from, b.href, b.raw].map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','));
}
fs.writeFileSync('.internal-links-audit.csv', csv.join('\n'), 'utf8');
console.log(`\nWrote .internal-links-audit.csv (${broken.length} broken)`);
