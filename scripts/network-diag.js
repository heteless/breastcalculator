// scripts/network-diag.js
//
// Targeted latency diagnosis: probes a small set of representative
// URLs many times to expose jitter and outliers. Used to separate
// "true edge cache miss" from "client-network jitter" — the
// stability-probe's single-shot TTFB can be inflated by a single
// bad sample on a long-distance RTT.

const { performance } = require('perf_hooks');

const BASE = 'https://breastcalculator.com';
const ROUNDS = 5;
const TARGETS = [
  '/',
  '/about/',
  '/tools/',
  '/bra-size-calculator/',
  '/bra-size-guide/',
  '/sitemap.xml',
  '/robots.txt',
  '/main.css',
  '/common.js',
];

async function probe(url) {
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 10000);
  const t0 = performance.now();
  try {
    const r = await fetch(url, { signal: ctl.signal, cache: 'no-store' });
    const ttfb = performance.now() - t0;
    const headers = {};
    r.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    return { status: r.status, ttfb, cache: headers['cf-cache-status'] || '?' };
  } catch (e) {
    return { error: e.message, ttfb: performance.now() - t0 };
  } finally {
    clearTimeout(to);
  }
}

(async () => {
  console.log('NETWORK DIAGNOSIS');
  console.log('=================');
  console.log(`base:    ${BASE}`);
  console.log(`rounds:  ${ROUNDS} per URL (no-store, fresh TCP each time)`);
  console.log('');

  const summary = [];
  for (const path of TARGETS) {
    const url = BASE + path;
    const samples = [];
    for (let i = 0; i < ROUNDS; i++) samples.push(await probe(url));
    const ok = samples.filter((s) => !s.error && s.status === 200);
    const ttfbs = ok.map((s) => s.ttfb).sort((a, b) => a - b);
    const p50 = ttfbs[Math.floor(ttfbs.length / 2)] || 0;
    const p95 = ttfbs[Math.floor(ttfbs.length * 0.95)] || ttfbs[ttfbs.length - 1] || 0;
    const max = ttfbs[ttfbs.length - 1] || 0;
    const min = ttfbs[0] || 0;
    const cacheModes = [...new Set(samples.map((s) => s.cache).filter(Boolean))];
    summary.push({ path, ok: ok.length, total: samples.length, min, p50, p95, max, cacheModes });
    console.log(
      `  ${path.padEnd(40)} ${ok.length}/${samples.length}  min=${min.toFixed(0).padStart(5)}ms  p50=${p50.toFixed(0).padStart(5)}ms  p95=${p95.toFixed(0).padStart(5)}ms  max=${max.toFixed(0).padStart(5)}ms  cache=[${cacheModes.join(',')}]`,
    );
  }
  console.log('');
  console.log('Note: cache=undefined means header not exposed by CDN/Worker;');
  console.log('      a no-store probe is always a cache MISS, so the timings');
  console.log('      above represent the worst-case cold path.');
})();
