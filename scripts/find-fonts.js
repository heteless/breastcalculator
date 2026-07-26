const fs = require('fs');
const c = fs.readFileSync('D:/DevProject/breastcalculator/style.css', 'utf8');
const re = /--font-(?:serif|sans|display)|font-family:\s*[^;]*serif|font-family:\s*[^;]*display|Playfair|Cormorant|EB Garamond|Crimson|'Lora'|Cormorant|Inter\s|Source\s+Serif|@import|googleapis/g;
let m, count = 0;
while ((m = re.exec(c)) !== null && count < 12) {
  const start = Math.max(0, m.index - 30);
  const end = Math.min(c.length, m.index + 200);
  console.log('--- "' + m[0] + '" ---');
  console.log(c.slice(start, end));
  console.log();
  count++;
}
console.log('Total:', count);
