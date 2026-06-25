// Search for footnotes and article-ref styles in style.css
const fs = require('fs');
const path = require('path');

const s = fs.readFileSync(path.join(process.cwd(), 'style.css'), 'utf8');
const patterns = ['footnotes-section', 'footnotes-list', 'article-ref'];
for (const p of patterns) {
  const re = new RegExp(`\\.${p}[^{]*\\{[^}]*\\}`, 'g');
  let m;
  console.log(`\n=== .${p} ===`);
  while ((m = re.exec(s)) !== null) {
    console.log(`  ${m[0].substring(0, 250)}`);
  }
}
