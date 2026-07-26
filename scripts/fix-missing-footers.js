// fix-missing-footers.js
// Fix 4 article pages missing the footer, privacy modal, and closing tags.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const TARGETS = [
  'article/d-plus-solutions/index.html',
  'article/back-pain-heavy-breasts-solutions/index.html',
  'article/large-bust-bra-engineering-fabrics/index.html',
  'article/measure-heavy-breasts-dd-plus/index.html',
  'tools/index.html',
];

// Reference page: use a well-formed article page that has the full footer.
const REFERENCE = 'article/why-80-percent-wrong-bra-size/index.html';

// Extract the footer block from <footer ...> through </html>
// Include the leading whitespace/newline for proper indentation.
const refHtml = fs.readFileSync(path.join(ROOT, REFERENCE), 'utf8');
const footerMarker = '<footer class="bg-[#fdf8f5]';
const footerStart = refHtml.lastIndexOf('\n', refHtml.indexOf(footerMarker)) + 1;
if (footerStart === 0 && !refHtml.startsWith(footerMarker)) throw new Error('Could not find footer in reference file');
const footerBlock = refHtml.slice(footerStart);
// footerBlock now contains everything from <footer... through </html>

let touched = 0;
let errors = [];

for (const rel of TARGETS) {
  const filePath = path.join(ROOT, rel);
  let html;
  try {
    html = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    errors.push(rel + ': ' + e.message);
    continue;
  }

  // Check if already has a footer
  if (/<footer\s/.test(html)) {
    console.log('[SKIP] ' + rel + ' — already has footer');
    continue;
  }

  let changed = false;

  // Case 1: page has </body> but no footer — insert before </body>
  if (/<\/body>/.test(html)) {
    // Remove any existing consent-banner script before </body> (we'll re-add it from the block)
    html = html.replace(/\s*<script[^>]*consent-banner\.js[^>]*><\/script>\s*/g, '\n');
    // Remove the </body></html> line — the footerBlock already includes it
    html = html.replace(/\s*<\/body>\s*<\/html>\s*$/, '');
    html = html.trimEnd() + '\n' + footerBlock;
    changed = true;
  }
  // Case 2: no </body> at all — just append
  else {
    html = html.trimEnd() + '\n' + footerBlock;
    changed = true;
  }

  if (changed) {
    try {
      // Also add the inject-contact-and-consent-friendly legal nav
      fs.writeFileSync(filePath, html, 'utf8');
      console.log('[FIX] ' + rel);
      touched++;
    } catch (e) {
      errors.push(rel + ': ' + e.message);
    }
  }
}

console.log('\nFiles fixed: ' + touched);
if (errors.length) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}
