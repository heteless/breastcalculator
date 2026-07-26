// scripts/rebuild-everything.js
// Idempotent: re-runs every step of the build pipeline in the correct order.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function run(label) {
  console.log('\n── ' + label + ' ──');
  try {
    execSync('node ' + path.join(ROOT, 'scripts', label + '.js'), { stdio: 'inherit', cwd: ROOT });
  } catch (e) {
    console.error('FAILED: ' + label);
    process.exit(1);
  }
}

const steps = [
  'fix-classic-header',  // 1. inject header patch into classic-system.css + main.css
  'build-css',           // 2. combine all CSS into main.css
  'fix-classic-header',  // 3. re-inject the patch (overwritten by build-css)
  'purgecss',            // 4. remove unused selectors
  'fix-classic-header',  // 5. re-inject the patch (overwritten by purgecss? actually purgecss only touches style.css and bra-calculator.css, but be safe)
  'build-dist',          // 6. copy everything to dist/
];

for (const s of steps) run(s);
console.log('\n✔ build complete');
