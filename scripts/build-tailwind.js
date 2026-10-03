// Build utility CSS from the source pages configured in tailwind.config.js.
const { execSync } = require('child_process');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const command = 'npx tailwindcss -i tailwind-input.css -o tailwind-built.css --no-preflight';
console.log(`[build-tailwind] $ ${command}`);
execSync(command, { cwd: ROOT, stdio: 'inherit' });
console.log('[build-tailwind] Done.');
