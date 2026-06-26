const fs = require('fs');
const s = fs.readFileSync('style.css', 'utf8');
const keys = ['tool-closing', 'tool-cta', 'tool-cta-btn', 'hero-left', 'footnotes-section', 'footnotes-list', 'specials-sub', 'nav-categories', 'nav-cta'];
keys.forEach(k => {
  const re = new RegExp('\\.' + k + '[^{}]*\\{[^}]*\\}', 'g');
  const ms = [...s.matchAll(re)];
  console.log('=== ' + k + ' (' + ms.length + ' matches) ===');
  ms.forEach(m => console.log('  ' + m[0]));
});
