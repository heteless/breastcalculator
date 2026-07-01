#!/usr/bin/env node
/**
 * Sitemap-driven AdSense injector.
 *
 *  - Parses sitemap.xml to obtain the canonical public URL list.
 *  - Maps each URL to its local index.html under ROOT.
 *  - Idempotently inserts the AdSense <script async> tag into <head>.
 *  - Reports coverage: injected / already present / missing source.
 *
 * The AdSense snippet is placed AFTER the GA4 snippet (which sets
 * consent defaults) so that AdSense can read `ad_storage`/`ad_user_data`
 * consent signals and respect user choices without personalizing.
 *
 * Usage:
 *   node scripts/inject-adsense.js              # inject on pages that don't have it
 *   node scripts/inject-adsense.js --check      # audit only, no writes
 *   node scripts/inject-adsense.js --upgrade    # forcibly replace existing AdSense block
 *   node scripts/inject-adsense.js --upgrade --check   # audit upgrade coverage
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const HOST = 'breastcalculator.com';
const PUB_ID = 'ca-pub-7388117485013143';

// Skip non-canonical / partial HTML files that have no <head>
const SKIP_FILENAMES = new Set(['404.html', 'footer.html', 'header-wellness-popup.html']);

// Canonical AdSense snippet — matches the exact format shown by AdSense UI.
// The `crossorigin="anonymous"` attribute is required by AdSense.
const ADSENSE_SNIPPET = `
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}" crossorigin="anonymous"></script>`;

function loadSitemapUrls() {
  if (!fs.existsSync(SITEMAP)) {
    throw new Error(`sitemap.xml not found at ${SITEMAP}`);
  }
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  // Namespace-tolerant: matches both <loc> and <ns0:loc>, <sitemap:loc>, etc.
  const re = /<[a-zA-Z0-9_]*:?loc[^>]*>([^<]+)<\/[a-zA-Z0-9_]*:?loc>/g;
  const out = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    try {
      const u = new URL(m[1].trim());
      if (u.hostname === HOST) out.push(u);
    } catch (_) {
      // skip invalid
    }
  }
  return out;
}

function urlToLocalPath(u) {
  // https://breastcalculator.com/article/foo/  ->  ./article/foo/index.html
  // https://breastcalculator.com/             ->  ./index.html
  let p = u.pathname;
  if (p === '/' || p === '') p = '/index.html';
  else if (p.endsWith('/')) p = p + 'index.html';
  else p = p + '/index.html';
  return path.join(ROOT, p);
}

function hasAdSense(html) {
  // Match any adsbygoogle loader that references OUR publisher id
  return html.includes(`client=${PUB_ID}`);
}

function stripExistingAdSense(html) {
  // Remove the AdSense <script async src=...adsbygoogle.js?client=ca-pub-...> line,
  // allowing for the previous comment + leading whitespace and trailing newline.
  const re = /^[ \t]*<script\b[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>\s*\r?\n/gm;
  return html.replace(re, '');
}

function injectAdSense(html, upgrade = false) {
  if (!upgrade && hasAdSense(html)) return { html, changed: false };
  if (upgrade) html = stripExistingAdSense(html);

  // Best position: just before </head>, so gtag.js has fully loaded and
  // pushed consent signals to dataLayer BEFORE AdSense boots. This is
  // required for Consent Mode v2 to gate personalized ad serving.
  const headClose = html.match(/<\/head>/i);
  if (headClose) {
    const idx = headClose.index;
    return { html: html.slice(0, idx) + ADSENSE_SNIPPET + html.slice(idx), changed: true };
  }

  // Fallback: insert right after <head>
  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const idx = headMatch.index + headMatch[0].length;
    return { html: html.slice(0, idx) + ADSENSE_SNIPPET + html.slice(idx), changed: true };
  }

  const htmlMatch = html.match(/<html[^>]*>/i);
  if (htmlMatch) {
    const idx = htmlMatch.index + htmlMatch[0].length;
    return { html: html.slice(0, idx) + '<head>' + ADSENSE_SNIPPET + '</head>' + html.slice(idx), changed: true };
  }
  return { html, changed: false, error: 'no <head> or <html> tag found' };
}

function main() {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has('--check') || args.has('--audit');
  const upgrade = args.has('--upgrade') || args.has('--force');

  const urls = loadSitemapUrls();
  console.log(`[AdSense] Sitemap: ${urls.length} public URLs`);

  let injected = 0;
  let alreadyOk = 0;
  let missing = 0;
  const errors = [];

  for (const u of urls) {
    const localPath = urlToLocalPath(u);
    if (SKIP_FILENAMES.has(path.basename(localPath))) {
      // Defensive: skip any 404 / partials even if sitemap somehow lists them
      continue;
    }
    if (!fs.existsSync(localPath)) {
      missing++;
      console.warn(`[AdSense] [missing source] ${u.pathname} -> ${path.relative(ROOT, localPath)}`);
      continue;
    }
    const original = fs.readFileSync(localPath, 'utf8');
    const { html, changed, error } = injectAdSense(original, upgrade);
    if (error) {
      errors.push(`${path.relative(ROOT, localPath)}: ${error}`);
      continue;
    }
    if (!changed) {
      alreadyOk++;
      continue;
    }
    if (checkOnly) {
      injected++;
      continue;
    }
    fs.writeFileSync(localPath, html, 'utf8');
    injected++;
  }

  console.log(`[AdSense] Coverage:`);
  console.log(`  injected:        ${injected}`);
  console.log(`  already present: ${alreadyOk}`);
  console.log(`  missing source:  ${missing}`);
  if (errors.length) {
    console.log(`[AdSense] Errors:`);
    errors.forEach(e => console.log(`  - ${e}`));
  }
  if (checkOnly) {
    console.log(checkOnly ? '[AdSense] --check mode: no files written' : '');
  } else {
    console.log(`[AdSense] Done. ${injected} file(s) written.`);
  }
}

main();
