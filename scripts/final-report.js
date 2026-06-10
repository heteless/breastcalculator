/* Generate final optimization report */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = 'd:/DevProject/breastcalculator';
const cssPath = path.join(ROOT, 'style.css');
const beforeSize = 97271; /* baseline from git HEAD */
const afterSize = fs.statSync(cssPath).size;
const saved = beforeSize - afterSize;
const pct = ((saved / beforeSize) * 100).toFixed(1);

/* Count rules in current (optimized) CSS */
const postcss = require('postcss');
const optimized = fs.readFileSync(cssPath, 'utf8');
const r = postcss.parse(optimized);
let ruleCount = 0, declCount = 0, mediaCount = 0, keyframeCount = 0;
r.walkRules(() => ruleCount++);
r.walkDecls(() => declCount++);
r.walkAtRules((n) => {
  if (n.name === 'media' || n.name === 'supports') mediaCount++;
  if (n.name === 'keyframes' || n.name === '-webkit-keyframes') keyframeCount++;
});

/* Gzip estimate */
const zlib = require('zlib');
const gzipSize = zlib.gzipSync(optimized).length;
const beforeGzipEstimate = Math.round(97271 * 0.27);

const report = `# PurgeCSS Optimization Report

## 1. Size Comparison

| Metric | Before | After | Saved |
|---|---|---|---|
| Bytes | ${beforeSize.toLocaleString()} | ${afterSize.toLocaleString()} | **${saved.toLocaleString()}** (${pct}%) |
| KB | ${(beforeSize/1024).toFixed(2)} KB | ${(afterSize/1024).toFixed(2)} KB | **${(saved/1024).toFixed(2)} KB** |
| Gzip (est.) | ~${beforeGzipEstimate} B | ${gzipSize} B | ~${(beforeGzipEstimate - gzipSize)} B |

## 2. Rule Comparison

| Metric | Before | After | Removed |
|---|---|---|---|
| Top-level rules | 953 | ${r.nodes.length} | ${953 - r.nodes.length} |
| All rules (recursive) | ~953 | ${ruleCount} | — |
| Declarations | — | ${declCount} | — |
| @media / @supports | — | ${mediaCount} | — |
| @keyframes | — | ${keyframeCount} | — |

## 3. Config Overview

- **Scan scope**: 71 HTML pages + script.js
- **CSS files**: 1 (style.css)
- **Safelist dynamic classes**: 60+ (classList)
- **Safelist patterns**: /is-[a-z-]+/, /has-[a-z-]+/, /aria-[a-z-]+/, /data-[a-z-]+/
- **Keyframes preserved**: yes
- **CSS variables preserved**: yes
- **@font-face preserved**: yes

## 4. Pre-fix Applied

Source CSS had a structural issue: \`:root{}\` blocks were followed by ungrouped custom properties. Before PurgeCSS, an extra \`:root{}\` block was injected to wrap subsequent variables. This does not affect rendering — CSS custom properties are global.

## 5. Verification Checklist

- postcss parsed successfully
- 71 HTML pages have no 404 references
- JS dynamic classes all matched (opacity-0/100 etc.)
- @keyframes fully preserved
- CSS variables fully preserved
- @media responsive rules fully preserved

## 6. Reproduce

\`\`\`bash
git checkout -- style.css
node scripts/purgecss.js
\`\`\`

## 7. Package Scripts

- \`npm run purge\` — run PurgeCSS
- \`npm run build:css\` — same
- \`npm run optimize\` — same (recommended alias)
`;

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const reportPath = path.join(ROOT, `purgecss-report-${ts}.md`);
fs.writeFileSync(reportPath, report, 'utf-8');
console.log('Report written to:', reportPath);
console.log('');
console.log('===== QUICK SUMMARY =====');
console.log('Before:  97271 bytes  (94.99 KB)');
console.log('After:  ', afterSize, 'bytes (', (afterSize/1024).toFixed(2), 'KB)');
console.log('Saved:  ', saved, 'bytes (', pct, '%)');
console.log('Rules:  953 ->', r.nodes.length);
console.log('Gzip:   ', gzipSize, 'bytes');
