const fs = require('fs');

// Check tools/index.html structure
const toolsIdx = fs.readFileSync('tools/index.html', 'utf8');
console.log('=== tools/index.html ===');
console.log('Length:', toolsIdx.length);
const canonM = toolsIdx.match(/<link[^>]*canonical[^>]*>/);
console.log('Canonical:', canonM ? canonM[0] : '(none)');
const titleM = toolsIdx.match(/<title>([^<]+)<\/title>/);
console.log('Title:', titleM ? titleM[1] : '(none)');
console.log('Has </head>:', toolsIdx.includes('</head>'));

// Check tools/weight-converter/index.html
const wc = fs.readFileSync('tools/weight-converter/index.html', 'utf8');
console.log('\n=== tools/weight-converter/index.html ===');
const descM = wc.match(/<meta[^>]*name="description"[^>]*>/);
console.log('Description tag:', descM ? descM[0] : '(none)');
const canonM2 = wc.match(/<link[^>]*canonical[^>]*>/);
console.log('Canonical:', canonM2 ? canonM2[0] : '(none)');
