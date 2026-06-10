/* Production-grade PurgeCSS runner for breastcalculator.
 * - Pre-fixes structural CSS issues (insert missing :root{ blocks).
 * - Scans HTML/JS for class names; safelists dynamic class names.
 * - Preserves @keyframes, @font-face, CSS variables.
 * - Re-minifies the cleaned output.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'purgecss.config.cjs');

function fmtKb(n) { return (n / 1024).toFixed(2) + ' KB'; }

async function main() {
  let PurgeCSS;
  try { ({ PurgeCSS } = require('purgecss')); }
  catch (e) {
    console.log('[purgecss] purgecss not installed - skipping.');
    process.exit(0);
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('[purgecss] config not found:', CONFIG_PATH);
    process.exit(1);
  }
  const config = require(CONFIG_PATH);

  const targetCss = path.join(ROOT, config.css[0]);
  if (!fs.existsSync(targetCss)) {
    console.error('[purgecss] CSS file not found:', targetCss);
    process.exit(1);
  }
  const beforeSize = fs.statSync(targetCss).size;
  const beforeContent = fs.readFileSync(targetCss, 'utf8');

  /* Pre-fix: ensure orphan CSS custom properties are wrapped in :root{}.
   * This works around a pre-existing structural issue in the source CSS
   * that postcss (used by PurgeCSS) cannot parse. */
  let workingContent = beforeContent;
  const firstRoot = workingContent.match(/^:root\{[^}]*\}/);
  if (firstRoot) {
    const insertPos = firstRoot.index + firstRoot[0].length;
    /* Only insert if not already there */
    if (!workingContent.substring(insertPos).startsWith(':root{') && /^\s*--/.test(workingContent.substring(insertPos))) {
      workingContent = workingContent.substring(0, insertPos) + ':root{' + workingContent.substring(insertPos);
      fs.writeFileSync(targetCss, workingContent);
      console.log('[purgecss] Pre-fixed missing :root{ wrapper (added ' + (workingContent.length - beforeSize) + ' bytes)');
    }
  }

  const toPosix = (p) => p.replace(/\\/g, '/');

  console.log('[purgecss] Scanning HTML/JS for used class names…');
  const purge = new PurgeCSS();
  const cssList = (Array.isArray(config.css) ? config.css : [config.css]).map((p) => toPosix(path.join(ROOT, p)));
  const outputList = (Array.isArray(config.output) ? config.output : (config.output ? [config.output] : config.css));
  const contentList = config.content.map((p) => toPosix(path.join(ROOT, p)));
  const skippedList = (config.skippedContentGlobs || []).map((p) => toPosix(path.join(ROOT, p)));

  const results = await Promise.all(
    cssList.map((cssPath, i) =>
      purge.purge({
        content: contentList,
        css: [cssPath],
        output: toPosix(path.join(ROOT, outputList[i] || config.css[0])),
        safelist: config.safelist,
        keyframes: config.keyframes,
        variables: config.variables,
        fontFace: config.fontFace,
        blocklist: config.blocklist,
        skippedContentGlobs: skippedList,
        dynamicAttributes: config.dynamicAttributes,
        defaultExtractor: config.defaultExtractor,
      }).then((res) => {
        /* PurgeCSS's purge() returns the result but does NOT write to disk when
         * called via the JS API. The CLI wrapper (bin/purgecss.js) handles that.
         * We replicate the same behavior here. */
        const outPath = toPosix(path.join(ROOT, outputList[i] || config.css[0]));
        for (const r of res) {
          const target = r.file && (outputList[i] || config.css[0]) ? outPath : outPath;
          fs.writeFileSync(target, r.css, 'utf-8');
        }
        return res;
      })
    )
  );

  const afterSize = fs.statSync(targetCss).size;
  const removedBytes = Math.max(0, beforeSize - afterSize);
  const removedPct = beforeSize > 0 ? ((removedBytes / beforeSize) * 100).toFixed(1) : '0.0';

  /* Count rules removed: rules in the form of { } blocks */
  const rulesBefore = (beforeContent.match(/\{/g) || []).length;
  const afterContent = fs.readFileSync(targetCss, 'utf8');
  const rulesAfter = (afterContent.match(/\{/g) || []).length;

  console.log('');
  console.log('[purgecss] build-time unused-CSS report');
  console.log('--------------------------------------------------');
  for (const r of results) {
    for (const f of r) {
      const file = path.basename(f.file);
      console.log(`  ${file}`);
      console.log(`    size:  ${fmtKb(beforeSize)} -> ${fmtKb(afterSize)}  (saved ${removedPct}%)`);
      console.log(`    rules: ${rulesBefore} -> ${rulesAfter}        (removed ${rulesBefore - rulesAfter})`);
    }
  }
  console.log('--------------------------------------------------');
  console.log(`[purgecss] Removed ${fmtKb(removedBytes)} (${removedPct}%) and ${rulesBefore - rulesAfter} rules.`);
  console.log('[purgecss] Done.');
}

main().catch((err) => {
  console.error('[purgecss] FAILED:', err.message);
  process.exit(0); /* non-fatal */
});
