const fs = require('fs');
const files = ['expansion-evidence', 'accessory-breast-guide', 'why-d-cup-support', 'ptosis-prevention-evidence', 'sports-bra-science', 'buying-guide'];
files.forEach(f => {
  try {
    const s = fs.readFileSync('specials/' + f + '/index.html', 'utf8');
    const m = s.match(/<header[^>]*class="[^"]*"[^>]*>/);
    console.log(f + ': ' + (m ? m[0] : 'NO HEADER'));
  } catch (e) {
    console.log(f + ': ' + e.message);
  }
});
