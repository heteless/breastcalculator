const fs = require('fs');
const c = fs.readFileSync('d:/DevProject/breastcalculator/style.css', 'utf8');

// Find CSS rules for specific classes
const classes = ['.article-hero', '.hero', '.hub-hero', '.tool-hero', '.wellness-article', '.container', '.subtitle'];
for (const cls of classes) {
  const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Find rules that contain this class as the only one in selector, or in comma list
  const re = new RegExp(`[^}]*${escaped}[^}]*\\}`, 'g');
  const matches = c.match(re);
  if (matches) {
    console.log(`\n=== ${cls} ===`);
    matches.slice(0, 5).forEach(m => console.log(m));
  } else {
    console.log(`\n=== ${cls} (NOT FOUND) ===`);
  }
}
