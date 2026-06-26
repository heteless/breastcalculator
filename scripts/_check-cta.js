const fs = require('fs');
const files = ['breast-expansion-calculator', 'breast-ptosis-calculator', 'length-converter', 'weight-converter'];
files.forEach(f => {
  const s = fs.readFileSync('tools/' + f + '/index.html', 'utf8');
  const m = s.match(/<div[^>]*class="[^"]*tool-(?:closing|cta)[^"]*"[^>]*>[\s\S]*?<\/div>/);
  console.log('=== ' + f + ' ===');
  console.log(m ? m[0] : 'NONE');
  console.log();
});
