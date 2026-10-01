#!/usr/bin/env node
/**
 * Site Audit Script - Scan for SEO & quality issues.
 * Detects: missing meta tags, duplicate titles, broken links, thin content, etc.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'dist-dryrun', '_dbg', 'scripts',
  '.git', '.wrangler', '.backup', '.cache', 'reports', 'screenshots',
]);

const issues = { errors: [], warnings: [], notices: [] };

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

function analyzeFile(file, relPath) {
  const src = fs.readFileSync(file, 'utf8');
  const url = relPath.replace(/\\/g, '/').replace(/index\.html$/, '/');

  // 1. Missing title
  const titleMatch = src.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!titleMatch) {
    issues.errors.push({ type: 'Missing Title', url, detail: 'No <title> tag found' });
  } else {
    const title = titleMatch[1].trim();
    // Title too long
    if (title.length > 60) {
      issues.warnings.push({ type: 'Title Too Long', url, detail: `${title.length} chars (max 60)` });
    }
    // Title too short
    if (title.length < 20) {
      issues.warnings.push({ type: 'Title Too Short', url, detail: `${title.length} chars (min 20)` });
    }
    // Duplicate titles (check later)
  }

  // 2. Missing meta description
  if (!src.includes('<meta name="description"')) {
    issues.warnings.push({ type: 'Missing Meta Description', url, detail: 'No <meta name="description"> found' });
  }

  // 3. Missing Open Graph
  if (!src.includes('property="og:title"')) {
    issues.warnings.push({ type: 'Missing OG Title', url, detail: 'No og:title meta tag' });
  }
  if (!src.includes('property="og:image"')) {
    issues.warnings.push({ type: 'Missing OG Image', url, detail: 'No og:image meta tag' });
  }

  // 4. Missing canonical
  if (!src.includes('<link rel="canonical"')) {
    issues.warnings.push({ type: 'Missing Canonical', url, detail: 'No canonical URL' });
  }

  // 5. Missing H1
  if (!src.match(/<h1[^>]*>/i)) {
    issues.errors.push({ type: 'Missing H1', url, detail: 'No <h1> tag found' });
  }

  // 6. Duplicate H1
  const h1Count = (src.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count > 1) {
    issues.warnings.push({ type: 'Multiple H1 Tags', url, detail: `${h1Count} <h1> tags found` });
  }

  // 7. Thin content (< 500 chars of text)
  const textContent = src.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (textContent.length < 500) {
    issues.warnings.push({ type: 'Thin Content', url, detail: `${textContent.length} chars of text` });
  }

  // 8. Images without alt
  const imgMatches = src.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  imgMatches.forEach(img => {
    if (!img.match(/alt\s*=/i) && !img.match(/aria-hidden/i)) {
      missingAlt++;
    }
  });
  if (missingAlt > 0) {
    issues.warnings.push({ type: 'Images Missing Alt', url, detail: `${missingAlt} images without alt text` });
  }

  // 9. Broken internal links
  const linkMatches = src.match(/href="([^"]+)"/gi) || [];
  linkMatches.forEach(m => {
    const href = m.replace(/href=/i, '').replace(/"/g, '').trim();
    if (href.startsWith('/') && !href.includes('#') && !href.includes('http')) {
      const targetFile = path.join(ROOT, href.replace(/^\//, ''), 'index.html');
      if (!fs.existsSync(targetFile) && href !== '/404/' && !href.endsWith('/404')) {
        // Check if it's a valid path
        const altFile = path.join(ROOT, href.replace(/^\//, '') + '.html');
        if (!fs.existsSync(altFile)) {
          issues.warnings.push({ type: 'Possible Broken Link', url, detail: `href="${href}" may be broken` });
        }
      }
    }
  });

  // 10. Noindex pages that should be indexed
  if (src.includes('noindex') && !url.includes('404')) {
    issues.errors.push({ type: 'Unintentional Noindex', url, detail: 'Page has noindex but is not 404' });
  }

  // 11. Duplicate title check (will be done globally)
}

function checkDuplicateTitles(files) {
  const titles = {};
  files.forEach(file => {
    const relPath = path.relative(ROOT, file);
    const src = fs.readFileSync(file, 'utf8');
    const titleMatch = src.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      if (!titles[title]) titles[title] = [];
      titles[title].push(relPath);
    }
  });
  Object.entries(titles).forEach(([title, paths]) => {
    if (paths.length > 1) {
      paths.forEach(p => {
        const url = p.replace(/\\/g, '/').replace(/index\.html$/, '/');
        issues.warnings.push({ type: 'Duplicate Title', url, detail: `Title "${title.slice(0, 40)}..." shared by ${paths.length} pages` });
      });
    }
  });
}

// Main
const files = walk(ROOT, []);
console.log(`[audit] Scanning ${files.length} HTML files...`);

files.forEach(file => {
  const relPath = path.relative(ROOT, file);
  analyzeFile(file, relPath);
});

checkDuplicateTitles(files);

// Summary
console.log('\n=== AUDIT SUMMARY ===');
console.log(`Errors:   ${issues.errors.length}`);
console.log(`Warnings: ${issues.warnings.length}`);
console.log(`Notices:  ${issues.notices.length}`);
console.log(`Total:    ${issues.errors.length + issues.warnings.length + issues.notices.length}`);

console.log('\n--- ERRORS ---');
issues.errors.forEach(e => console.log(`[${e.type}] ${e.url} - ${e.detail}`));

console.log('\n--- WARNINGS (top 20) ---');
issues.warnings.slice(0, 20).forEach(w => console.log(`[${w.type}] ${w.url} - ${w.detail}`));

// Save JSON
fs.writeFileSync(path.join(ROOT, '_dbg', 'audit-results.json'), JSON.stringify(issues, null, 2), 'utf8');
console.log('\n[audit] Results saved to _dbg/audit-results.json');
