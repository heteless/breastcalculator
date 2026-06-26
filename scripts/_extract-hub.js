// Extract exact hub-cards HTML for precise editing.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const start = home.indexOf('<section class="hub-cards"');
// Find the matching closing </section> for the hub-cards section (handle nesting)
let depth = 1;
let idx = start + 1;
while (depth > 0 && idx < home.length) {
  const nextOpen = home.indexOf('<section', idx);
  const nextClose = home.indexOf('</section>', idx);
  if (nextClose === -1) break;
  if (nextOpen !== -1 && nextOpen < nextClose) {
    depth++;
    idx = nextOpen + 1;
  } else {
    depth--;
    idx = nextClose + '</section>'.length;
  }
}
const hubHtml = home.substring(start, idx);
console.log('=== EXACT hub-cards HTML (length: ' + hubHtml.length + ') ===');
console.log(hubHtml);
console.log('\n=== char positions ===');
console.log('start index:', start);
console.log('end index:', idx);
