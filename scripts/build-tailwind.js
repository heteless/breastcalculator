// build-tailwind.js — build tailwind-built.css before the rest of the pipeline.
//
// Why this exists
// ---------------
// `optimize.js` minifies the existing CSS, but it does NOT generate utility
// classes from Tailwind. The class set used in HTML can grow between releases
// (e.g. `gap-1.5`, `text-[1.25rem]`, `tracking-[0.1em]`, `py-1.5`, `w-3.5`),
// and shipping a stale `tailwind-built.css` produces a broken footer / header.
//
// Tailwind's JIT engine reads every HTML / JS file under the configured
// `content` glob and emits only the rules it actually needs. Running it
// here guarantees the deployed CSS matches the deployed HTML.
//
// Idempotent — running it twice produces identical output.

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function run(cmd) {
  console.log(`[build-tailwind] $ ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

run(
  'npx tailwindcss -i tailwind-input.css -o tailwind-built.css ' +
    '--content "./**/index.html,./**/footer.html,./**/header.html,./index.html,./footer.html,./header.html,./script.js" --no-preflight'
);
console.log('[build-tailwind] Done.');
