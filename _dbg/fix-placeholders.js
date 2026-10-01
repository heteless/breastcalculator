#!/usr/bin/env node
/**
 * Bulk-fix placeholder-img blocks across the source tree.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'dist-dryrun', '_dbg', 'scripts',
  '.git', '.wrangler', '.backup', '.cache', 'reports', 'screenshots',
]);

const SVG_PLACEHOLDER = `
          <div class="placeholder-img" role="img" aria-label="Illustration placeholder">
            <svg viewBox="0 0 400 240" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" style="background:var(--sand-light);border-radius:var(--radius);border:1px dashed var(--border);display:block">
              <rect width="400" height="240" fill="none"/>
              <circle cx="200" cy="90" r="32" fill="none" stroke="var(--border)" stroke-width="2"/>
              <path d="M140 180 Q200 120 260 180" fill="none" stroke="var(--border)" stroke-width="2"/>
              <text x="200" y="220" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="system-ui">Illustration · {{caption}}</text>
            </svg>
          </div>`;

const RE_BLOCK = /<div class="placeholder-img"[^>]*>[\s\S]*?\[Image Placeholder:[\s\S]*?\][\s\S]*?<\/div>/gi;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.html')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

let changed = 0, skipped = 0;
for (const file of walk(ROOT, [])) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('[Image Placeholder:')) {
    if (/placeholder-img/.test(src)) skipped++;
    continue;
  }
  const out = src.replace(RE_BLOCK, (match) => {
    const captionMatch = match.match(/\[Image Placeholder:\s*([\s\S]*?)\]/i);
    const caption = captionMatch ? captionMatch[1].trim().slice(0, 40) : 'Illustration';
    return SVG_PLACEHOLDER.replace('{{caption}}', caption);
  });
  if (out !== src) {
    fs.writeFileSync(file, out, 'utf8');
    changed++;
  }
}
console.log(`[placeholders] fixed: ${changed}, already-clean: ${skipped}`);
