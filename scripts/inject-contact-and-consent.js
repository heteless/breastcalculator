// inject-contact-and-consent.js
// One-shot script: for every *.html in the project (excluding dist/scripts/etc.),
// 1) Insert a Contact link into the footer legal nav (between About and Privacy Policy)
// 2) Inject <script src="/assets/consent-banner.js" defer></script> before </body>
// Safe to re-run: it detects existing entries and skips them.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', 'dist-dryrun', 'scripts', '.git', '.github', '.well-known', 'images']);
const CONTACT_LINK = '<a class="hover:text-[#6b5344] hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline" href="/contact/">\n                Contact\n              </a>';
const CONTACT_LINK_FLAT = '<a class="hover:text-[#6b5344] hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline" href="/contact/">\n          Contact\n        </a>';
const CONSENT_SCRIPT = '<script src="/assets/consent-banner.js?v=20260721" defer></script>';

function listHtml(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (EXCLUDE_DIRS.has(e.name)) continue;
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...listHtml(full));
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

let touched = 0;
let contactInserted = 0;
let bannerInserted = 0;
let skipped = 0;
const errors = [];

for (const file of listHtml(ROOT)) {
  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch (e) {
    errors.push(file + ': ' + e.message);
    continue;
  }
  let orig = html;
  let changed = false;

  // 1) Contact link in footer legal nav.
  //    The footer pattern always groups the legal links under <nav class="footer-legal..."> with
  //    About / Privacy Policy / Terms of Use entries. We insert Contact right after About.
  if (!/href="\/contact\/"/.test(html)) {
    const aboutRe = /<nav class="footer-legal[\s\S]*?<\/nav>/;
    const aboutMatch = html.match(aboutRe);
    if (aboutMatch) {
      const block = aboutMatch[0];
      // Try to find About link with newlines (root index.html style)
      const aboutA = '<a class="hover:text-[#6b5344] hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline" href="/about/">\n                About\n              </a>';
      const aboutAFlat = '<a class="hover:text-[#6b5344] hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline" href="/about/">\n          About\n        </a>';
      let newBlock = null;
      if (block.indexOf(aboutA) !== -1) {
        newBlock = block.replace(
          aboutA,
          aboutA + '\n              ' + CONTACT_LINK.replace(/^\s+/, '').replace(/\n\s*/g, '\n              ')
        );
      } else if (block.indexOf(aboutAFlat) !== -1) {
        newBlock = block.replace(
          aboutAFlat,
          aboutAFlat + '\n          ' + CONTACT_LINK_FLAT.replace(/^\s+/, '').replace(/\n\s*/g, '\n          ')
        );
      } else {
        // Fallback: insert before the Privacy Policy line
        const ppRe = /<a [^>]*href="\/privacy\/"[^>]*>\s*Privacy Policy\s*<\/a>/;
        const ppMatch = block.match(ppRe);
        if (ppMatch) {
          newBlock = block.replace(
            ppMatch[0],
            '<a class="hover:text-[#6b5344] hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline" href="/contact/">\n                Contact\n              </a>\n              ' + ppMatch[0]
          );
        }
      }
      if (newBlock) {
        html = html.replace(block, newBlock);
        contactInserted++;
        changed = true;
      }
    }
  } else {
    skipped++;
  }

  // 2) Inject consent banner script right before </body>, unless already present.
  if (!/consent-banner\.js/.test(html)) {
    if (/<\/body>/.test(html)) {
      html = html.replace('</body>', '  ' + CONSENT_SCRIPT + '\n</body>');
      bannerInserted++;
      changed = true;
    }
  }

  if (changed && html !== orig) {
    try {
      fs.writeFileSync(file, html, 'utf8');
      touched++;
    } catch (e) {
      errors.push(file + ': ' + e.message);
    }
  }
}

console.log('Files modified: ' + touched);
console.log('Contact links inserted: ' + contactInserted);
console.log('Consent banner scripts inserted: ' + bannerInserted);
console.log('Files already having /contact/: ' + skipped);
if (errors.length) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}
