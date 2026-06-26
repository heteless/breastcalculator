const fs = require('fs');
const s = fs.readFileSync('style.css', 'utf8');

function find(name, len = 250) {
  let i = s.indexOf(name);
  while (i >= 0) {
    console.log(`=== ${name} at ${i} ===`);
    console.log(s.substring(i, i + len));
    console.log('---');
    i = s.indexOf(name, i + 1);
  }
}

find('.nav-categories');
find('.nav-category::after');
find('.nav-category:');
find('.tool-hero');
find('.tool-closing');
find('.tool-ref');
