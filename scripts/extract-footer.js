// extract-footer.js - extract footer HTML for inspection
const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const m = c.match(/<footer[\s\S]*?<\/footer>/);
if (m) {
  const f = m[0];
  // Pretty print: insert line breaks
  const pretty = f.replace(/></g, '>\n<');
  fs.writeFileSync('footer.html', pretty);
  console.log('written footer.html, length:', f.length);
}
