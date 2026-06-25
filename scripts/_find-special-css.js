// Search for special-sub and specials-sub in style.css and tailwind-built.css
const fs = require('fs');
const path = require('path');

for (const f of ['style.css', 'tailwind-built.css', 'tailwind-input.css']) {
  const s = fs.readFileSync(path.join(process.cwd(), f), 'utf8');
  const matches = [];
  const patterns = ['special-sub', 'specials-sub', 'special-article', 'wellness-article', 'article-body'];
  for (const p of patterns) {
    const re = new RegExp(`\\.${p}[^{]*\\{[^}]*\\}`, 'g');
    let m;
    while ((m = re.exec(s)) !== null) {
      matches.push({ class: p, rule: m[0] });
    }
  }
  console.log(`\n=== ${f} ===`);
  for (const m of matches) {
    console.log(`  .${m.class}: ${m.rule.substring(0, 200)}`);
  }
  if (matches.length === 0) console.log('  (no matches)');
}
