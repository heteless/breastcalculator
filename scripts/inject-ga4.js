#!/usr/bin/env node
/**
 * Sitemap-driven GA4 injector.
 *
 *  - Parses sitemap.xml to obtain the canonical public URL list.
 *  - Maps each URL to its local index.html under ROOT.
 *  - Idempotently inserts the standard gtag.js block at the very top
 *    of <head>, with full Google Consent Mode v2 defaults.
 *  - Reports coverage: injected / already present / missing source.
 *
 * Usage:
 *   node scripts/inject-ga4.js              # inject on pages that don't have it
 *   node scripts/inject-ga4.js --check      # audit only, no writes
 *   node scripts/inject-ga4.js --upgrade    # forcibly replace existing GA4 with the latest snippet
 *   node scripts/inject-ga4.js --upgrade --check   # audit upgrade coverage without writing
 */

const fs = require('fs');
const path = require('path');
const urlMod = require('url');

const ROOT = path.resolve(__dirname, '..');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const HOST = 'breastcalculator.com';
const MEASUREMENT_ID = 'G-5SB8FNFYDV';

// Skip the .well-known / API-catalog / robots / llms.txt / etc. (no <head>)
const SKIP_URL_PATTERNS = [
  /\/\.well-known\//,
  /\/api-catalog$/,
  /\/llms\.txt$/,
  /\/security\.txt$/,
];

// Canonical GA4 + Consent Mode v2 snippet (English, no auto-page_view issues).
// The order matters: dataLayer push + consent default FIRST, then async gtag loader.
const GA4_SNIPPET = `
  <!-- Google tag (gtag.js) - GA4 ${MEASUREMENT_ID} -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted',
      'wait_for_update': 500
    });
    gtag('set', 'url_passthrough', true);
    gtag('js', new Date());
    gtag('config', '${MEASUREMENT_ID}', { 'anonymize_ip': true });
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"></script>
  <!-- End Google tag -->`;

function loadSitemapUrls() {
  if (!fs.existsSync(SITEMAP)) {
    throw new Error(`sitemap.xml not found at ${SITEMAP}`);
  }
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  const re = /<loc>([^<]+)<\/loc>/g;
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
  if (p.endsWith('/')) p = p + 'index.html';
  else p = p + '/index.html';
  return path.join(ROOT, p);
}

function stripExistingGA4(html) {
  // Remove any <script>...</script> block (and any inline leading/trailing whitespace)
  // that references our MEASUREMENT_ID.
  // This is robust against greedy regex and string-literal false positives.
  const re = /<script\b[^>]*>[\s\S]*?G-5SB8FNFYDV[\s\S]*?<\/script>\s*/g;
  return html.replace(re, '');
}

function injectGA4(html, upgrade = false) {
  // Idempotency: detect existing GA4 by Measurement ID token
  // (unless --upgrade is passed, in which case we always replace)
  if (!upgrade && html.includes(`gtag/js?id=${MEASUREMENT_ID}`)) return { html, changed: false };

  // For upgrade mode: strip any existing GA4 block first
  if (upgrade) {
    html = stripExistingGA4(html);
  }

  // 1) Try to insert right after <head>
  const headMatch = html.match(/<head[^>]*>/i);
  if (headMatch) {
    const idx = headMatch.index + headMatch[0].length;
    const newHtml = html.slice(0, idx) + GA4_SNIPPET + html.slice(idx);
    return { html: newHtml, changed: true };
  }
  // 2) Fallback: insert before <html ...> opener (rare, but safe)
  const htmlMatch = html.match(/<html[^>]*>/i);
  if (htmlMatch) {
    const idx = htmlMatch.index + htmlMatch[0].length;
    const newHtml = html.slice(0, idx) + '<head>' + GA4_SNIPPET + '</head>' + html.slice(idx);
    return { html: newHtml, changed: true };
  }
  return { html, changed: false, error: 'no <head> or <html> tag found' };
}

function main() {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has('--check') || args.has('--audit');
  const upgrade = args.has('--upgrade') || args.has('--force');

  const urls = loadSitemapUrls();
  console.log(`[GA4] Sitemap: ${urls.length} public URLs`);

  let injected = 0;
  let already = 0;
  let missing = 0;
  let errors = 0;
  const report = { injected: [], already: [], missing: [], errors: [] };

  for (const u of urls) {
    const href = u.pathname;
    if (SKIP_URL_PATTERNS.some((re) => re.test(href))) {
      // skip silently (these are non-HTML endpoints)
      continue;
    }
    const file = urlToLocalPath(u);
    if (!fs.existsSync(file)) {
      missing++;
      report.missing.push(href);
      continue;
    }
    const orig = fs.readFileSync(file, 'utf8');
    const { html, changed, error } = injectGA4(orig, upgrade);
    if (error) {
      errors++;
      report.errors.push({ url: href, error });
      continue;
    }
    if (changed) {
      if (!checkOnly) fs.writeFileSync(file, html, 'utf8');
      injected++;
      report.injected.push(href);
    } else {
      already++;
      report.already.push(href);
    }
  }

  console.log('──────────────────────────────');
  console.log(`[GA4] ${checkOnly ? 'AUDIT (no writes)' : 'INJECT'}${upgrade ? ' + UPGRADE' : ''} complete`);
  console.log(`[GA4] Injected (new):  ${injected}`);
  console.log(`[GA4] Already present: ${already}`);
  console.log(`[GA4] Missing source:  ${missing}`);
  console.log(`[GA4] Errors:          ${errors}`);
  console.log('──────────────────────────────');

  if (report.missing.length) {
    console.log('\n[GA4] MISSING files (sitemap lists them but no index.html on disk):');
    report.missing.forEach((h) => console.log('  - ' + h));
  }
  if (report.errors.length) {
    console.log('\n[GA4] ERRORS:');
    report.errors.forEach((e) => console.log(`  - ${e.url}: ${e.error}`));
  }

  if (missing > 0 || errors > 0) process.exitCode = 1;
}

main();
