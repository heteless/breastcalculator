// Temporary diagnostic — safe to delete.
const fs = require('fs');
const path = require('path');

function inspect(p) {
  const b = fs.readFileSync(p);
  const s = b.toString('utf8');
  console.log('FILE:', p, 'bytes:', b.length);
  const m = s.match(/charset=[^"'>]+/);
  console.log('  meta charset:', m ? m[0] : 'none');
  const i = s.indexOf('you own');
  if (i >= 0) {
    console.log('  "you own" +30 chars (utf8 view):', JSON.stringify(s.substring(i, i + 30)));
    console.log('  bytes:', Array.from(b.slice(i, i + 30)).map(x => x.toString(16).padStart(2, '0')).join(' '));
  }
  const j = s.indexOf('reduces breast movement');
  if (j >= 0) {
    console.log('  "reduces breast" +60 chars (utf8 view):', JSON.stringify(s.substring(j, j + 60)));
    console.log('  bytes:', Array.from(b.slice(j, j + 60)).map(x => x.toString(16).padStart(2, '0')).join(' '));
  }
  const k = s.indexOf('figure-8 pattern');
  if (k >= 0) {
    console.log('  "figure-8 pattern" +40 chars (utf8 view):', JSON.stringify(s.substring(k, k + 40)));
    console.log('  bytes:', Array.from(b.slice(k, k + 40)).map(x => x.toString(16).padStart(2, '0')).join(' '));
  }
}

inspect(path.join(process.cwd(), 'sports-bra-guide', 'index.html'));
