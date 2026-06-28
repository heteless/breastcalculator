#!/usr/bin/env node
/**
 * IndexNow v2.0 — "Traffic Amplifier" edition
 * for breastcalculator.com
 * ---------------------------------------------
 * Hard-fixed key: 72df502a4b3a4fcbb6662b9eedd24912
 * Key file:       https://breastcalculator.com/72df502a4b3a4fcbb6662b9eedd24912.txt
 * Endpoint:       https://api.indexnow.org/indexnow
 *
 * ─── v2.0 UPGRADES ─────────────────────────────────────────────────
 * Upgrade 1 — URL Priority Tiers:
 *   Tier 1 (high)   /tools/* + /bra-size-calculator + /breast-volume + /
 *                   → submitted first, immediate
 *   Tier 2 (medium) /compare/* + /article/*
 *                   → submitted second (optional delay via env)
 *   Tier 3 (low)    /guide/* + /faq/*
 *                   → submitted last, batched
 *
 * Upgrade 2 — Critical-Change Detection (only submit on real updates):
 *   Submit only if:
 *     - URL is new (no prior signature)
 *     - Title text changed
 *     - <main> content length diff > 5% of the larger length
 *   Small wording tweaks below 5% are treated as non-critical (skipped).
 *
 * Upgrade 3 — Sitemap + IndexNow Dual Engine:
 *   `npm run indexnow:delta` regenerates sitemap.xml from dist/,
 *   computes delta vs previous snapshot, submits only added/changed
 *   URLs, notifies IndexNow of removed URLs.
 *
 * Upgrade 4 — Index Coverage Tracker:
 *   bing_index_status.json records per-URL submission + index state.
 *   Use `npm run indexnow:coverage` for a report. The `mark` subcommand
 *   is the hook for future Bing Webmaster API polling integration.
 *
 * ─── CORE SAFETY (preserved from v1.0) ─────────────────────────────
 * Safe triggers (only one need be true):
 *   1. New page created   (no prior signature on record)
 *   2. Critical update    (title change OR main content >5% diff)
 *   3. Page deleted       (--deleted flag with a URL)
 *   4. Forced             (--force flag bypasses critical-change detection)
 *
 * URL validation:
 *   - Must belong to breastcalculator.com
 *   - Must be absolute URLs (https://...)
 *   - Duplicates removed
 *   - Max 100 URLs per batch
 *   - Malformed URLs rejected
 *
 * Rate limiting:
 *   - 10 requests/min (sliding window, in-process)
 *   - Batch limit: 100 URLs
 *   - Retry max: 2 attempts (exponential backoff)
 *   - Timeout: 5 seconds per attempt
 *
 * Content signature tracking:
 *   - SHA256(pageTitle + mainContentBody + canonicalURL) + title + mainLength
 *   - Stored in .indexnow-hashes.json (gitignored, upgraded to object form)
 *   - Legacy string-format entries auto-migrated on first run
 *
 * Usage:
 *   node scripts/indexnow.js submit [url1 url2 ...] [--force] [--tier high|medium|low]
 *   node scripts/indexnow.js changed [--tier high|medium|low]
 *                                                    # auto-detect critical changes from dist/
 *   node scripts/indexnow.js delta                   # Upgrade 3: sitemap regen + delta submit
 *   node scripts/indexnow.js coverage                # Upgrade 4: print coverage report
 *   node scripts/indexnow.js mark <url> <status>     # Upgrade 4: manually mark index status
 *   node scripts/indexnow.js verify                  # confirm key file is reachable on the live host
 *   node scripts/indexnow.js --deleted <url>         # notify IndexNow that a URL was removed
 *
 * Examples:
 *   node scripts/indexnow.js submit https://breastcalculator.com/ https://breastcalculator.com/bra-size-calculator/
 *   node scripts/indexnow.js changed --tier high
 *   node scripts/indexnow.js delta
 *   node scripts/indexnow.js --deleted https://breastcalculator.com/old-page/
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

// ─── HARDCODED CONFIG (DO NOT CHANGE) ───────────────────────────────
const KEY = '72df502a4b3a4fcbb6662b9eedd24912';
const HOST = 'breastcalculator.com';
const ENDPOINT_HOST = 'api.indexnow.org';
const ENDPOINT_PATH = '/indexnow';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
// ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const HASH_FILE = path.join(ROOT, '.indexnow-hashes.json');
const STATUS_FILE = path.join(ROOT, 'bing_index_status.json');
const SITEMAP_PREV_FILE = path.join(ROOT, '.indexnow-sitemap-prev.json');

// ─── URL PRIORITY TIERS (Upgrade 1) ─────────────────────────────────
// Tier 1 (high)   /tools/* + homepage  → submitted first, immediate
// Tier 2 (medium) /compare/* /article/* → submitted second
// Tier 3 (low)    /guide/* /faq/*       → submitted last (batched)
//
// Delay semantics: tier ordering alone provides crawl-prioritization hints
// because IndexNow consumes the first URLs of a push with higher priority.
// Optional artificial delay can be enabled via env vars for throttling.
const PRIORITY_MAP = [
  { match: /^\/$/i,                tier: 'high',   label: 'Tier1' },
  { match: /\/tools\//i,           tier: 'high',   label: 'Tier1' },
  { match: /\/bra-size-calculator/i, tier: 'high', label: 'Tier1' },
  { match: /\/breast-volume/i,     tier: 'high',   label: 'Tier1' },
  { match: /\/compare\//i,         tier: 'medium', label: 'Tier2' },
  { match: /\/article\//i,         tier: 'medium', label: 'Tier2' },
  { match: /\/guide\//i,           tier: 'low',    label: 'Tier3' },
  { match: /\/faq\//i,             tier: 'low',    label: 'Tier3' },
];
const DEFAULT_TIER = { tier: 'medium', label: 'Tier2' };
const TIER_ORDER = { high: 0, medium: 1, low: 2 };

function classifyUrl(url) {
  let u;
  try { u = new URL(url); } catch { return DEFAULT_TIER; }
  for (const r of PRIORITY_MAP) {
    if (r.match.test(u.pathname)) return r;
  }
  return DEFAULT_TIER;
}

// Critical-change threshold (Upgrade 2): main content length diff > 5%
const CRITICAL_CHANGE_RATIO = 0.05;

// Rate limit: 10 requests / 60s window
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
// Batch + retry config
const BATCH_LIMIT = 100;
const MAX_RETRIES = 2;
const TIMEOUT_MS = 5000;
// Sliding-window log of recent request timestamps
const recentRequests = [];

// ─── LOGGING ────────────────────────────────────────────────────────
function logSuccess(msg) { console.log(`[IndexNow] SUCCESS: ${msg}`); }
function logFailed(msg)  { console.log(`[IndexNow] FAILED: ${msg}`); }
function logInfo(msg)    { console.log(`[IndexNow] ${msg}`); }

// ─── KEY FILE MANAGEMENT ────────────────────────────────────────────
function ensureKeyFile() {
  // Source root (so it ships with build-dist.js → dist/)
  const rootFile = path.join(ROOT, `${KEY}.txt`);
  if (!fs.existsSync(rootFile) || fs.readFileSync(rootFile, 'utf8').trim() !== KEY) {
    fs.writeFileSync(rootFile, KEY, 'utf8'); // no trailing newline
    logInfo(`Wrote key file at /${path.basename(rootFile)}`);
  }
  // Also drop a copy in dist/ if dist exists, so a partial deploy still serves it
  if (fs.existsSync(DIST)) {
    const distFile = path.join(DIST, `${KEY}.txt`);
    if (!fs.existsSync(distFile) || fs.readFileSync(distFile, 'utf8').trim() !== KEY) {
      fs.writeFileSync(distFile, KEY, 'utf8');
    }
  }
}

// ─── URL VALIDATION ─────────────────────────────────────────────────
function isValidAbsoluteUrl(url) {
  if (typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (u.hostname !== HOST && !u.hostname.endsWith(`.${HOST}`)) return false;
    return true;
  } catch {
    return false;
  }
}

function validateAndDedupe(urls) {
  const seen = new Set();
  const valid = [];
  const rejected = [];
  for (const raw of urls) {
    const url = String(raw).trim();
    if (!url) continue;
    if (!isValidAbsoluteUrl(url)) {
      rejected.push(url);
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);
    valid.push(url);
  }
  return { valid, rejected };
}

// ─── SITEMAP LOADING ────────────────────────────────────────────────
function loadUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP)) return [];
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1].trim());
  return out;
}

// ─── CONTENT HASH TRACKING ──────────────────────────────────────────
function loadHashes() {
  if (!fs.existsSync(HASH_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(HASH_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveHashes(hashes) {
  fs.writeFileSync(HASH_FILE, JSON.stringify(hashes, null, 2), 'utf8');
}

// ─── INDEX COVERAGE TRACKER (Upgrade 4) ─────────────────────────────
// bing_index_status.json tracks per-URL submission + index state.
// Note: actual "indexed" status requires Bing Webmaster API integration
// (not available without API key). The structure is in place; the
// `updateIndexStatus` function is the hook for future Bing API polling.
function loadStatus() {
  if (!fs.existsSync(STATUS_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8')); } catch { return {}; }
}
function saveStatus(s) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(s, null, 2), 'utf8');
}
function recordSubmission(urls) {
  const s = loadStatus();
  const now = new Date().toISOString();
  for (const url of urls) {
    if (!s[url]) {
      s[url] = { firstSubmitted: now, lastSubmitted: now, submitCount: 0, indexStatus: 'submitted' };
    }
    s[url].lastSubmitted = now;
    s[url].submitCount = (s[url].submitCount || 0) + 1;
    s[url].indexStatus = 'submitted';
    s[url].tier = classifyUrl(url).tier;
  }
  saveStatus(s);
}
function recordDeleted(url) {
  const s = loadStatus();
  if (s[url]) {
    s[url].indexStatus = 'deleted';
    s[url].deletedAt = new Date().toISOString();
  } else {
    s[url] = { firstSubmitted: null, lastSubmitted: null, submitCount: 0, indexStatus: 'deleted', deletedAt: new Date().toISOString() };
  }
  saveStatus(s);
}
function updateIndexStatus(url, status) {
  // Hook for future Bing Webmaster API integration.
  // status: 'indexed' | 'not_indexed' | 'ignored' | 'submitted'
  const s = loadStatus();
  if (!s[url]) s[url] = { firstSubmitted: null, lastSubmitted: null, submitCount: 0, indexStatus: status };
  else s[url].indexStatus = status;
  s[url].lastChecked = new Date().toISOString();
  s[url].tier = classifyUrl(url).tier;
  saveStatus(s);
}
function coverageReport() {
  const s = loadStatus();
  const entries = Object.entries(s);
  const byStatus = entries.reduce((acc, [, v]) => {
    const st = v.indexStatus || 'unknown';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});
  const byTier = entries.reduce((acc, [, v]) => {
    const t = v.tier || 'unknown';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  console.log('[IndexNow] Coverage report (bing_index_status.json):');
  console.log(`  Total tracked: ${entries.length}`);
  console.log(`  By status: ${JSON.stringify(byStatus)}`);
  console.log(`  By tier:   ${JSON.stringify(byTier)}`);
  const notIndexed = entries.filter(([, v]) => v.indexStatus !== 'indexed' && v.indexStatus !== 'deleted');
  if (notIndexed.length > 0) {
    console.log(`  Pending / not yet indexed: ${notIndexed.length}`);
    for (const [url, v] of notIndexed.slice(0, 10)) {
      console.log(`    - ${url}  (lastSubmitted: ${v.lastSubmitted || 'n/a'}, status: ${v.indexStatus})`);
    }
    if (notIndexed.length > 10) console.log(`    ... +${notIndexed.length - 10} more`);
  }
}

// ─── SITEMAP DELTA TRACKING (Upgrade 3) ─────────────────────────────
function loadPrevSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PREV_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(SITEMAP_PREV_FILE, 'utf8')); } catch { return null; }
}
function savePrevSitemapUrls(urls) {
  fs.writeFileSync(SITEMAP_PREV_FILE, JSON.stringify(urls, null, 2), 'utf8');
}
function computeSitemapDelta(currentUrls) {
  const prev = loadPrevSitemapUrls();
  if (!prev) {
    // First run: treat all as new
    return { added: currentUrls, removed: [], unchanged: [] };
  }
  const prevSet = new Set(prev);
  const currSet = new Set(currentUrls);
  const added = currentUrls.filter((u) => !prevSet.has(u));
  const removed = prev.filter((u) => !currSet.has(u));
  const unchanged = currentUrls.filter((u) => prevSet.has(u));
  return { added, removed, unchanged };
}

/**
 * Compute a richer page signature for critical-change detection (Upgrade 2).
 * Returns: { hash, title, mainLength, mainSample }
 *   - hash: SHA256 of (title + mainText + canonical) — used for fast equality check
 *   - title: page <title> text (stripped)
 *   - mainLength: character length of <main> text content
 *   - mainSample: first 200 chars of <main> text (for diff sanity check)
 *
 * Replaces the old computePageHash (which only returned a single hash string)
 * so we can apply critical-change rules: title change OR main content >5% diff.
 */
function computePageSignature(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  // Map URL → dist path
  let p = u.pathname;
  if (p === '/' || p === '') p = '/index.html';
  else if (p.endsWith('/')) p = p + 'index.html';
  else if (!p.endsWith('.html')) p = p + '/index.html';
  const filePath = path.join(DIST, p);
  if (!fs.existsSync(filePath)) return null;

  const html = fs.readFileSync(filePath, 'utf8');
  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
  // Canonical
  const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const canonical = canonMatch ? canonMatch[1].trim() : '';
  // Main content
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let mainText = '';
  if (mainMatch) {
    mainText = mainMatch[1]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const composite = `${title}\n${mainText}\n${canonical}`;
  const hash = crypto.createHash('sha256').update(composite).digest('hex');
  return {
    hash,
    title,
    mainLength: mainText.length,
    mainSample: mainText.slice(0, 200),
  };
}

/**
 * Critical-change detection (Upgrade 2).
 * A URL is considered "critical-changed" if any of:
 *   - It's new (no prior signature on record)
 *   - Title text changed
 *   - main content length diff > 5% of the larger of the two lengths
 *
 * Small wording tweaks below the 5% threshold are treated as non-critical
 * and skipped — this filters noise (whitespace, minor edits) from real
 * SEO-relevant updates (FAQ rewrites, calculator formula changes, price
 * block updates, etc.).
 *
 * The signature store is upgraded from a flat hash string to a richer
 * object. Old string entries are migrated on first read.
 *
 * Returns: { changed: string[], skipped: string[] }
 * Also persists the new signature store when `persist` is true.
 */
function detectCriticalChanges(urls, { persist = true } = {}) {
  const prev = loadHashes();
  const next = {};
  const changed = [];
  const skipped = [];

  for (const url of urls) {
    const sig = computePageSignature(url);
    if (!sig) {
      logInfo(`skip (no dist file): ${url}`);
      continue;
    }
    next[url] = sig;
    const prevRaw = prev[url];

    // Migrate legacy string-format entries: treat as unknown signature
    // (forces one-time re-submit, then store upgrades to object form)
    if (typeof prevRaw === 'string') {
      changed.push(url);
      continue;
    }
    if (!prevRaw) {
      // New page → critical
      changed.push(url);
      continue;
    }

    // Title change → critical
    if (prevRaw.title !== sig.title) {
      changed.push(url);
      continue;
    }

    // Main content length diff > 5% (critical-change threshold)
    const prevLen = prevRaw.mainLength || 0;
    const maxLen = Math.max(prevLen, sig.mainLength);
    const diff = Math.abs(prevLen - sig.mainLength);
    const ratio = maxLen > 0 ? diff / maxLen : (diff > 0 ? 1 : 0);
    if (ratio > CRITICAL_CHANGE_RATIO) {
      changed.push(url);
      continue;
    }

    // Below threshold + same title → non-critical, skip
    // (hash may still differ due to tiny edits, but we don't submit)
    skipped.push(url);
  }

  if (persist) {
    // Preserve signatures for URLs no longer in the input set
    const merged = { ...prev, ...next };
    saveHashes(merged);
  }
  return { changed, skipped };
}

// ─── RATE LIMITING ──────────────────────────────────────────────────
function rateLimitWait() {
  const now = Date.now();
  // Drop timestamps older than the window
  while (recentRequests.length > 0 && now - recentRequests[0] >= RATE_LIMIT_WINDOW_MS) {
    recentRequests.shift();
  }
  if (recentRequests.length < RATE_LIMIT_MAX) return 0;
  const waitMs = RATE_LIMIT_WINDOW_MS - (now - recentRequests[0]) + 10;
  return waitMs > 0 ? waitMs : 0;
}

function recordRequest() {
  recentRequests.push(Date.now());
}

// ─── HTTP POST WITH TIMEOUT + RETRY ─────────────────────────────────
function postJson(body) {
  return new Promise((resolve) => {
    const data = Buffer.from(JSON.stringify(body));
    const req = https.request(
      {
        host: ENDPOINT_HOST,
        port: 443,
        method: 'POST',
        path: ENDPOINT_PATH,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': data.length,
          'Host': ENDPOINT_HOST,
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () => resolve({ status: res.statusCode, body: chunks }));
      }
    );
    req.on('error', (e) => resolve({ status: 0, body: e.message }));
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy(new Error('timeout'));
    });
    req.write(data);
    req.end();
  });
}

async function postWithRetry(body) {
  let lastErr = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = 500 * Math.pow(2, attempt - 1); // 500ms, 1000ms
      await new Promise((r) => setTimeout(r, backoff));
      logInfo(`retry attempt ${attempt}/${MAX_RETRIES}`);
    }
    const wait = rateLimitWait();
    if (wait > 0) {
      logInfo(`rate limit: waiting ${Math.round(wait / 1000)}s`);
      await new Promise((r) => setTimeout(r, wait));
    }
    recordRequest();
    const res = await postJson(body);
    // 200 = OK, 202 = Accepted (both success)
    if (res.status === 200 || res.status === 202) {
      return { ok: true, status: res.status, body: res.body };
    }
    // 422 = validation error; do not retry
    if (res.status === 422) {
      return { ok: false, status: 422, body: res.body };
    }
    // 429 = rate limited by upstream; backoff and retry
    // 400/403/5xx = retry up to MAX_RETRIES
    lastErr = { status: res.status, body: res.body };
  }
  return { ok: false, status: lastErr ? lastErr.status : 0, body: lastErr ? lastErr.body : 'unknown' };
}

// ─── SUBMIT ORCHESTRATION (Tier-aware, Upgrade 1) ───────────────────
async function submit(urls, { force = false, tier: tierFilter = null } = {}) {
  ensureKeyFile();

  if (urls.length === 0) {
    urls = loadUrlsFromSitemap();
    logInfo(`No URLs provided; using ${urls.length} URLs from sitemap.xml`);
  }
  if (urls.length === 0) {
    logFailed('nothing to submit');
    return;
  }

  // Validate + dedupe
  const { valid, rejected } = validateAndDedupe(urls);
  if (rejected.length > 0) {
    logInfo(`Rejected ${rejected.length} invalid URL(s): ${rejected.slice(0, 3).join(', ')}${rejected.length > 3 ? '…' : ''}`);
  }
  if (valid.length === 0) {
    logFailed('no valid URLs after validation');
    return;
  }

  // Critical-change detection (Upgrade 2). Bypassed by --force.
  let toSubmit = valid;
  if (!force) {
    const { changed, skipped } = detectCriticalChanges(valid, { persist: true });
    logInfo(`Critical-change check: ${changed.length} critical, ${skipped.length} non-critical (skipped)`);
    toSubmit = changed;
  }
  if (toSubmit.length === 0) {
    logSuccess('0 URLs submitted (no critical changes)');
    return;
  }

  // Tier classification (Upgrade 1)
  const buckets = { high: [], medium: [], low: [] };
  for (const url of toSubmit) {
    const c = classifyUrl(url);
    if (tierFilter && c.tier !== tierFilter) continue;
    (buckets[c.tier] || buckets.medium).push(url);
  }
  const tierSummary =
    `Tier1(high)=${buckets.high.length} ` +
    `Tier2(medium)=${buckets.medium.length} ` +
    `Tier3(low)=${buckets.low.length}`;
  logInfo(`Tier classification: ${tierSummary}`);
  if (tierFilter) logInfo(`Filtering to tier="${tierFilter}" only`);

  const totalFiltered = buckets.high.length + buckets.medium.length + buckets.low.length;
  if (totalFiltered === 0) {
    logFailed(`0 URLs matched tier filter "${tierFilter}"`);
    return;
  }

  // Per-batch submission helper. Each tier is sent as one or more
  // separate POST requests so the search engine sees clearly separated
  // priority groups (Tier 1 first, Tier 3 last).
  const submitBatch = async (batch, label) => {
    let totalOk = 0;
    for (let i = 0; i < batch.length; i += BATCH_LIMIT) {
      const slice = batch.slice(i, i + BATCH_LIMIT);
      const body = {
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: slice,
      };
      const res = await postWithRetry(body);
      const batchNum = Math.floor(i / BATCH_LIMIT) + 1;
      if (res.ok) {
        logSuccess(`[${label}] batch ${batchNum}: ${slice.length} URLs (HTTP ${res.status})`);
        totalOk += slice.length;
        recordSubmission(slice); // Upgrade 4: coverage tracker
      } else {
        logFailed(`[${label}] batch ${batchNum}: HTTP ${res.status} ${String(res.body).slice(0, 200)}`);
      }
    }
    return totalOk;
  };

  let totalOk = 0;

  // Tier 1 (high): immediate — tools + calculators + homepage
  if (buckets.high.length > 0) {
    logInfo(`Submitting Tier 1 (high priority, immediate): ${buckets.high.length} URL(s)`);
    totalOk += await submitBatch(buckets.high, 'Tier1');
  }

  // Tier 2 (medium): submitted next, no artificial delay by default.
  // Set INDEXNOW_TIER2_DELAY_MS env var to throttle (e.g., 60000 for 1min).
  if (buckets.medium.length > 0) {
    const delayMs = parseInt(process.env.INDEXNOW_TIER2_DELAY_MS || '0', 10);
    if (delayMs > 0) {
      logInfo(`Tier 2: delaying ${delayMs}ms before submission`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
    logInfo(`Submitting Tier 2 (medium priority): ${buckets.medium.length} URL(s)`);
    totalOk += await submitBatch(buckets.medium, 'Tier2');
  }

  // Tier 3 (low): submitted last — guide/faq, batched into as few requests as possible.
  if (buckets.low.length > 0) {
    const delayMs = parseInt(process.env.INDEXNOW_TIER3_DELAY_MS || '0', 10);
    if (delayMs > 0) {
      logInfo(`Tier 3: delaying ${delayMs}ms before submission`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
    logInfo(`Submitting Tier 3 (low priority, batched): ${buckets.low.length} URL(s)`);
    totalOk += await submitBatch(buckets.low, 'Tier3');
  }

  if (totalOk > 0) {
    logSuccess(`${totalOk}/${totalFiltered} URLs submitted`);
  } else {
    logFailed('0 URLs submitted (all batches failed)');
  }
}

// ─── DELETED URL NOTIFICATION ───────────────────────────────────────
async function notifyDeleted(url) {
  ensureKeyFile();
  if (!isValidAbsoluteUrl(url)) {
    logFailed(`invalid URL: ${url}`);
    return;
  }
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: [url],
  };
  const res = await postWithRetry(body);
  if (res.ok) {
    logSuccess(`deleted notification sent (HTTP ${res.status}): ${url}`);
    // Remove from hash store
    const hashes = loadHashes();
    if (hashes[url]) {
      delete hashes[url];
      saveHashes(hashes);
    }
    // Upgrade 4: mark in coverage tracker
    recordDeleted(url);
  } else {
    logFailed(`deleted notification HTTP ${res.status}: ${String(res.body).slice(0, 200)}`);
  }
}

// ─── SITEMAP + INDEXNOW DOUBLE ENGINE (Upgrade 3) ───────────────────
// Regenerates sitemap.xml from dist/, computes delta vs the previous
// sitemap snapshot, then submits only the added/changed URLs and notifies
// IndexNow of removed URLs. This is the IndexNow + Sitemap dual-engine
// entry point: call after `npm run build` produces fresh dist/.
async function submitDelta() {
  ensureKeyFile();

  if (!fs.existsSync(DIST)) {
    logFailed(`dist/ not found. Run \`npm run build\` first.`);
    process.exit(1);
  }

  // Step 1: regenerate sitemap.xml from dist/ (Upgrade 3)
  logInfo('Step 1: regenerating sitemap.xml from dist/ ...');
  const { execFileSync } = require('child_process');
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'generate-sitemap.js')], { stdio: 'inherit' });
  } catch (e) {
    logFailed(`sitemap regeneration failed: ${e.message}`);
    process.exit(1);
  }

  // Step 2: load current sitemap URLs + compute delta vs previous snapshot
  const currentUrls = loadUrlsFromSitemap();
  if (currentUrls.length === 0) {
    logFailed('sitemap.xml contains no URLs');
    process.exit(1);
  }
  logInfo(`Step 2: loaded ${currentUrls.length} URLs from sitemap.xml`);

  const delta = computeSitemapDelta(currentUrls);
  logInfo(
    `Delta: +${delta.added.length} added, -${delta.removed.length} removed, =${delta.unchanged.length} unchanged`
  );

  // Step 3: notify IndexNow of removed URLs
  if (delta.removed.length > 0) {
    logInfo(`Step 3a: notifying IndexNow of ${delta.removed.length} removed URL(s)`);
    for (const url of delta.removed) {
      await notifyDeleted(url);
    }
  } else {
    logInfo('Step 3a: no removed URLs to notify');
  }

  // Step 4: submit added URLs through tier-aware critical-change pipeline
  // (added URLs are always "new" → critical-change detection will pass them all)
  // For unchanged URLs, also run critical-change detection in case content
  // was edited without sitemap changes (e.g. FAQ rewrite, price block update).
  logInfo('Step 4: running critical-change detection on current sitemap URLs');
  await submit(currentUrls, { force: false });

  // Step 5: persist current sitemap snapshot for next delta run
  savePrevSitemapUrls(currentUrls);
  logInfo('Step 5: saved sitemap snapshot for next delta run');

  // Step 6: print coverage report
  logInfo('Step 6: coverage report');
  coverageReport();
}

// ─── KEY FILE VERIFICATION ──────────────────────────────────────────
function verifyKeyReachable() {
  const url = KEY_LOCATION;
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        const ok = res.statusCode === 200 && body.trim() === KEY;
        logInfo(`GET ${url} -> HTTP ${res.statusCode} body="${body.trim()}" ${ok ? 'OK' : 'MISMATCH'}`);
        resolve(ok);
      });
    });
    req.on('error', (e) => {
      logFailed(`GET ${url} -> ERROR ${e.message}`);
      resolve(false);
    });
    req.setTimeout(15_000, () => {
      logFailed(`GET ${url} -> TIMEOUT`);
      req.destroy();
      resolve(false);
    });
  });
}

// ─── CLI ────────────────────────────────────────────────────────────
// Guard: only run as a script (not when require()'d for testing).
if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);

    if (args[0] === '--deleted') {
      const url = args[1];
      if (!url) {
        console.error('Usage: node scripts/indexnow.js --deleted <url>');
        process.exit(2);
      }
      await notifyDeleted(url);
      return;
    }

    if (args[0] === 'verify') {
      ensureKeyFile();
      const ok = await verifyKeyReachable();
      process.exit(ok ? 0 : 1);
      return;
    }

    // Upgrade 4: coverage report
    if (args[0] === 'coverage') {
      coverageReport();
      return;
    }

    // Upgrade 4: mark a URL's index status manually
    // Usage: node scripts/indexnow.js mark <url> <indexed|not_indexed|ignored>
    if (args[0] === 'mark') {
      const url = args[1];
      const status = args[2];
      if (!url || !status) {
        console.error('Usage: node scripts/indexnow.js mark <url> <indexed|not_indexed|ignored>');
        process.exit(2);
      }
      updateIndexStatus(url, status);
      logSuccess(`marked ${url} → ${status}`);
      return;
    }

    // Upgrade 3: sitemap + IndexNow dual-engine delta submission
    if (args[0] === 'delta') {
      await submitDelta();
      return;
    }

    // Upgrade 1: print tier classification for all sitemap URLs (debug, no submit)
    if (args[0] === 'tiers') {
      const urls = loadUrlsFromSitemap();
      if (urls.length === 0) {
        logFailed('no URLs in sitemap.xml');
        process.exit(1);
      }
      const buckets = { high: [], medium: [], low: [] };
      for (const url of urls) {
        const c = classifyUrl(url);
        (buckets[c.tier] || buckets.medium).push(url);
      }
      console.log(`[IndexNow] Tier classification for ${urls.length} sitemap URLs:`);
      for (const tier of ['high', 'medium', 'low']) {
        const list = buckets[tier];
        console.log(`\n  Tier "${tier}" (${list.length} URLs):`);
        for (const url of list) console.log(`    - ${url}`);
      }
      return;
    }

    if (args[0] === 'changed') {
      // Auto-detect: pull URLs from sitemap, run critical-change diff, submit only changed ones
      const urls = loadUrlsFromSitemap();
      if (urls.length === 0) {
        logFailed('no URLs in sitemap.xml');
        process.exit(1);
      }
      // Optional --tier filter
      const tierIdx = args.indexOf('--tier');
      const tierFilter = tierIdx >= 0 ? args[tierIdx + 1] : null;
      await submit(urls, { force: false, tier: tierFilter });
      return;
    }

    // Default: submit [urls...]
    // Flags: --force (bypass critical-change detection), --tier <high|medium|low>
    const force = args.includes('--force');
    const tierIdx = args.indexOf('--tier');
    const tierFilter = tierIdx >= 0 ? args[tierIdx + 1] : null;
    // Drop subcommand keyword 'submit' + flags + their values
    const urls = args.filter((a, i) => {
      if (a === 'submit') return false;
      if (a.startsWith('--')) return false;
      // Skip the value following --tier
      if (i > 0 && args[i - 1] === '--tier') return false;
      return true;
    });
    await submit(urls, { force, tier: tierFilter });
  })();
}
