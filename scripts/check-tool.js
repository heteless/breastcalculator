// Quick inspection of the tool page structure
const fs = require('fs');
const c = fs.readFileSync('tools/breast-volume-calculator/index.html', 'utf8');
const h1 = c.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
console.log('H1 found:', h1 ? 'YES' : 'NO');
if (h1) console.log('  text:', h1[1].substring(0, 100));
console.log('title:', (c.match(/<title>([^<]+)<\/title>/) || [])[1]);
console.log('desc:', (c.match(/<meta name="description" content="([^"]+)"/) || [])[1]?.substring(0, 80));
console.log('canon:', (c.match(/<link rel="canonical" href="([^"]+)"/) || [])[1]);
console.log('og:title:', (c.match(/<meta property="og:title" content="([^"]+)"/) || [])[1]);
console.log('h1 raw (first 3):');
const allH1 = c.match(/<h1[^>]*>[\s\S]*?<\/h1>/g) || [];
for (const h of allH1.slice(0, 3)) console.log('  ' + h.substring(0, 150));
