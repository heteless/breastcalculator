// inspect-classes.js - look at how missing classes are used
const fs = require('fs');
const path = require('path');

function listHtml(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'scripts', 'dist', 'dist-dryrun'].includes(e.name)) continue;
      out.push(...listHtml(path.join(dir, e.name)));
    } else if (e.isFile() && e.name === 'index.html') {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const htmlFiles = listHtml(path.resolve(__dirname, '..'));
const targets = ['articles-hero', 'related-links', 'faq-section', 'articles-grid',
                 'comparison-visual', 'rec-card', 'faq-list', 'faq-question'];

for (const t of targets) {
  let count = 0;
  let example = '';
  const re = new RegExp('class="[^"]*' + t + '[^"]*"');
  for (const f of htmlFiles) {
    const c = fs.readFileSync(f, 'utf8');
    const m = c.match(re);
    if (m) {
      count++;
      if (!example) example = m[0];
    }
  }
  console.log(`${t}: ${count} files`);
  if (example) console.log('  e.g.', example.substring(0, 200));
}
