// Generate the new breast-volume hub page using the existing gen-page.js
const { execSync } = require('child_process');
execSync('node scripts/gen-page.js --config .tmp-gen/breast-volume-hub.json', { stdio: 'inherit' });
console.log('Done: breast-volume/index.html generated');
