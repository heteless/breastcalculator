#!/usr/bin/env node
/**
 * IndexNow integration.
 * - Generates a stable API key at .indexnow-key (random hex, 32 chars).
 * - Writes the key file at the site root as <key>.txt so IndexNow can verify ownership.
 * - Submits a URL list to https://api.indexnow.org/IndexNow.
 *
 * Usage:
 *   node scripts/indexnow.js submit [url1 url2 ...]   # submit explicit URLs (or all from sitemap)
 *   node scripts/indexnow.js key                       # (re)generate key file only
 *   node scripts/indexnow.js verify                    # confirm key file is reachable on the live host
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const KEY_FILE = path.join(ROOT, '.indexnow-key');
const HOST = 'breastcalculator.com';
const ENDPOINT = 'api.indexnow.org';
const SITEMAP = path.join(ROOT, 'sitemap.xml');

function getOrCreateKey() {
  if (fs.existsSync(KEY_FILE)) {
    return fs.readFileSync(KEY_FILE, 'utf8').trim();
  }
  const key = crypto.randomBytes(16).toString('hex'); // 32 hex chars
  fs.writeFileSync(KEY_FILE, key + '\n', 'utf8');
  console.log(`[IndexNow] Generated new key in ${path.relative(ROOT, KEY_FILE)}`);
  return key;
}

function writeKeyTxtFile(key) {
  // The key must be served at https://<host>/<key>.txt
  const target = path.join(ROOT, `${key}.txt`);
  if (fs.existsSync(target) && fs.readFileSync(target, 'utf8').trim() === key) {
    return target;
  }
  fs.writeFileSync(target, key, 'utf8');
  console.log(`[IndexNow] Wrote key file: /${path.basename(target)}`);
  return target;
}

function loadUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP)) return [];
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1].trim());
  return out;
}

function postJson(pathname, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body));
    const req = https.request(
      {
        host: ENDPOINT,
        port: 443,
        method: 'POST',
        path: pathname,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': data.length,
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: chunks })
        );
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function submit(urls) {
  const key = getOrCreateKey();
  writeKeyTxtFile(key);

  if (urls.length === 0) {
    urls = loadUrlsFromSitemap();
    console.log(`[IndexNow] No URLs provided; using ${urls.length} URLs from sitemap.xml`);
  }
  if (urls.length === 0) {
    console.log('[IndexNow] Nothing to submit.');
    return;
  }

  // IndexNow supports up to 10,000 URLs per request, but to keep payloads small
  // and surface useful errors, batch at 10,000.
  const BATCH = 10000;
  let totalOk = 0;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const body = {
      host: HOST,
      key,
      keyLocation: `https://${HOST}/${key}.txt`,
      urlList: batch,
    };
    const res = await postJson('/IndexNow', body);
    console.log(
      `[IndexNow] batch ${i / BATCH + 1}: ${batch.length} URLs -> HTTP ${res.status} ${
        res.status >= 200 && res.status < 300 ? 'OK' : res.body.slice(0, 200)
      }`
    );
    if (res.status >= 200 && res.status < 300) totalOk += batch.length;
  }
  console.log(`[IndexNow] Submitted: ${totalOk}/${urls.length} URLs`);
}

/**
 * Verify that the public key file is reachable at https://<host>/<key>.txt
 * and that the body matches the local key. Returns a Promise<boolean>.
 */
function verifyKeyReachable(key) {
  const url = `https://${HOST}/${key}.txt`;
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        const ok = res.statusCode === 200 && body.trim() === key;
        console.log(
          `[IndexNow] GET ${url} -> HTTP ${res.statusCode}  body="${body.trim()}"  ${ok ? 'OK' : 'MISMATCH'}`
        );
        resolve(ok);
      });
    });
    req.on('error', (e) => {
      console.log(`[IndexNow] GET ${url} -> ERROR ${e.message}`);
      resolve(false);
    });
    req.setTimeout(15000, () => {
      console.log(`[IndexNow] GET ${url} -> TIMEOUT`);
      req.destroy();
      resolve(false);
    });
  });
}

(async () => {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'submit';
  if (cmd === 'key') {
    const k = getOrCreateKey();
    writeKeyTxtFile(k);
    console.log('Key:', k);
    return;
  }
  if (cmd === 'verify') {
    const k = getOrCreateKey();
    writeKeyTxtFile(k);
    const ok = await verifyKeyReachable(k);
    process.exit(ok ? 0 : 1);
  }
  if (cmd !== 'submit') {
    console.error('Unknown command. Use: submit [urls...] | key | verify');
    process.exit(2);
  }
  const urls = args.slice(1);
  await submit(urls);
})();
