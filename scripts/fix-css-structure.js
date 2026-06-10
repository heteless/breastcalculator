const postcss = require('postcss');
const fs = require('fs');
const path = require('path');

/* Apply the fix: insert ':root{' after the first :root block's closing } */
const cssPath = process.argv[2];
let css = fs.readFileSync(cssPath, 'utf8');
const before = css.length;

/* Find the first :root block's end */
const match = css.match(/^:root\{[^}]*\}/);
if (match) {
  const insertPos = match.index + match[0].length;
  css = css.substring(0, insertPos) + ':root{' + css.substring(insertPos);
  console.log('Inserted ":root{" at position', insertPos, '-> new content at that pos:', JSON.stringify(css.substring(insertPos, insertPos + 10)));
}

try {
  postcss.parse(css);
  console.log('postcss OK after fix');
  /* Write back the fixed CSS */
  fs.writeFileSync(cssPath, css);
  console.log('Wrote fixed CSS back. Original size:', before, 'New size:', css.length);
} catch (e) {
  console.log('postcss still fails:', e.message);
}
