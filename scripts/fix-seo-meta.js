// SEO Meta Fixer — fixes title/description/twitter:title on 19 pages flagged by audit
// Also adds canonical to 404, noindex to /tools/ redirect, etc.
const fs = require('fs');
const path = require('path');

const ROOT = '.';

// --- Fix 1: DESC_LONG (4 pages) — trim to ≤160 ---
const descLongFixes = {
  'index.html': 'Free, accurate bra size calculator for US, UK & EU sizing. Measure at home in 2 minutes — instant, private results. Mobile, no registration.',
  'bra-size-calculator/index.html': 'Free, accurate bra size calculator for US, UK, EU and AU sizing. Measure at home in 2 minutes — instant, private results. No signup.',
  'bra-size-guide/index.html': 'Complete bra size guide: every band, every cup, fit problems explained, measurement steps, sister sizes, size charts and research. Free.',
  'tools/weight-converter/index.html': 'Free online body weight converter with 6 units: kilograms, pounds, ounces, grams, milligrams, and stones (UK). NIST-traceable. 100% private.'
};

// --- Fix 2: DESC_SHORT (7 pages) — expand to ≥120 ---
const descShortFixes = {
  'specials/index.html': 'Science-backed breast health: D+ cup support, sports bra biomechanics, ptosis prevention, accessory breast tissue, and evidence-based bra fitting guides.',
  'wellness/index.html': 'Post-surgical breast wellness: prosthetic bra guides, sports bras after surgery, and gentle recovery support. Evidence-based, expert-reviewed resources.',
  'specials/accessory-breast-guide/index.html': 'Evidence-based guide to accessory breast tissue: causes, symptoms, diagnosis, and treatment options for axillary (underarm) breast tissue.',
  'specials/buying-guide/index.html': 'How to choose bras for D+ cup sizes. Evidence-based selection guide with fitting checklist, fabric science, and biomechanical support principles.',
  'specials/expansion-evidence/index.html': 'Understanding breast splaying anatomy. Evidence on how targeted bra design and side support correct a splayed or wide-set breast shape.',
  'wellness/prosthetic-bras-guide/index.html': 'A gentle guide to prosthetic bras after mastectomy: what they are, mastectomy bra styles, how to choose, fit tips, and where to find comfort.',
  'wellness/sports-bras-after-surgery/index.html': 'A gentle guide to choosing sports bras after breast surgery. Soft fabrics, front closures, gentle compression, and post-mastectomy sports bra tips.'
};

// --- Fix 3: TITLE_LONG (3 pages) — trim to ≤65 ---
const titleLongFixes = {
  'article/band-bra-fit-problems/index.html': 'Bra Band Problems — Riding Up, Back Bulge & Clasp Fix',
  'article/special-bra-fit-problems/index.html': 'Bra Fit Special Cases — Asymmetry, Sagging & Brands',
  'article/underwire-gore-bra-fit-problems/index.html': 'Underwire & Center Gore Pain — Digging, Floating & Fix'
};

// --- Fix 4: NO_TW_TITLE — copy from og:title (or title) ---
const pagesNeedingTwTitle = [
  'specials/index.html',
  'wellness/index.html',
  'articles/index.html',
  'tools/index.html'
];

// --- Fix 5: NO_CANONICAL on 404 pages + tools redirect ---
// /404/ and /404.html should have noindex but may have no canonical (intentional)
// /tools/ redirect page should have noindex,follow
const noCanonicalFixes = {
  '404/index.html': null, // 404 page — leave without canonical
  '404.html': null, // 404 page — leave without canonical
  'tools/index.html': 'https://breastcalculator.com/tools/breast-volume-calculator/'
};

// --- Helper: replace meta tag content ---
function setMeta(file, attr, value) {
  const c = fs.readFileSync(file, 'utf8');
  // Use specific pattern: <meta name="X" content="..."/>
  const re = new RegExp(`<meta\\s+name="${attr}"\\s+content="[^"]*"\s*/?>`, 'i');
  if (re.test(c)) {
    return { changed: c.replace(re, `<meta name="${attr}" content="${value}"/>`), modified: true };
  }
  // Also try property= variant
  const re2 = new RegExp(`<meta\\s+property="${attr}"\\s+content="[^"]*"\s*/?>`, 'i');
  if (re2.test(c)) {
    return { changed: c.replace(re2, `<meta property="${attr}" content="${value}"/>`), modified: true };
  }
  return { changed: c, modified: false };
}

function setTitle(file, newTitle) {
  const c = fs.readFileSync(file, 'utf8');
  return c.replace(/<title>[^<]*<\/title>/, `<title>${newTitle}</title>`);
}

function setDescription(file, newDesc) {
  const c = fs.readFileSync(file, 'utf8');
  return c.replace(/<meta name="description" content="[^"]+"\s*\/?>/, `<meta name="description" content="${newDesc}"/>`);
}

function setTwitterTitle(file, newTwTitle) {
  const c = fs.readFileSync(file, 'utf8');
  if (/<meta name="twitter:title" content="[^"]+"\s*\/>/.test(c)) {
    return c.replace(/<meta name="twitter:title" content="[^"]+"\s*\/>/, `<meta name="twitter:title" content="${newTwTitle}"/>`);
  }
  // Insert before </head>
  return c.replace('</head>', `<meta name="twitter:title" content="${newTwTitle}"/>\n</head>`);
}

function setCanonical(file, newCanon) {
  const c = fs.readFileSync(file, 'utf8');
  if (/<link rel="canonical" href="[^"]+"\s*\/>/.test(c)) {
    return c.replace(/<link rel="canonical" href="[^"]+"\s*\/>/, `<link rel="canonical" href="${newCanon}"/>`);
  }
  return c.replace('</head>', `<link rel="canonical" href="${newCanon}"/>\n</head>`);
}

function getTitle(file) {
  const c = fs.readFileSync(file, 'utf8');
  return (c.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
}

function getOgTitle(file) {
  const c = fs.readFileSync(file, 'utf8');
  return (c.match(/<meta property="og:title" content="([^"]+)"/) || [])[1] || '';
}

// === APPLY FIXES ===
let fixed = 0;
const log = [];

function applyFix(file, mutator, label) {
  if (!fs.existsSync(file)) { log.push(`[SKIP] ${label}: ${file} not found`); return; }
  const before = fs.readFileSync(file, 'utf8');
  const after = mutator(file);
  if (before !== after) {
    fs.writeFileSync(file, after, 'utf8');
    log.push(`[OK]   ${label}: ${file}`);
    fixed++;
  } else {
    log.push(`[NOOP] ${label}: ${file}`);
  }
}

// DESC_LONG
for (const [file, desc] of Object.entries(descLongFixes)) {
  applyFix(file, f => setDescription(f, desc), `DESC_LONG→${desc.length}`);
}

// DESC_SHORT
for (const [file, desc] of Object.entries(descShortFixes)) {
  applyFix(file, f => setDescription(f, desc), `DESC_SHORT→${desc.length}`);
}

// TITLE_LONG
for (const [file, title] of Object.entries(titleLongFixes)) {
  applyFix(file, f => setTitle(f, title), `TITLE_LONG→${title.length}`);
}

// NO_TW_TITLE — derive from og:title
for (const file of pagesNeedingTwTitle) {
  if (!fs.existsSync(file)) continue;
  const ogT = getOgTitle(file);
  const t = ogT || getTitle(file);
  if (t) {
    applyFix(file, f => setTwitterTitle(f, t), `TW_TITLE←${t.length}`);
  }
}

// NO_CANONICAL
for (const [file, canon] of Object.entries(noCanonicalFixes)) {
  if (canon === null) {
    log.push(`[SKIP] NO_CANONICAL (intentional 404): ${file}`);
    continue;
  }
  applyFix(file, f => setCanonical(f, canon), `CANONICAL→${canon}`);
}

// Add noindex to /tools/ redirect page (prevent duplicate content)
const toolsIdx = 'tools/index.html';
if (fs.existsSync(toolsIdx)) {
  const c = fs.readFileSync(toolsIdx, 'utf8');
  if (!/<meta name="robots" content="noindex/.test(c)) {
    const after = c.replace(/<meta name="robots" content="[^"]+"/, '<meta name="robots" content="noindex, follow"');
    if (after !== c) {
      fs.writeFileSync(toolsIdx, after, 'utf8');
      log.push(`[OK]   noindex/follow: ${toolsIdx}`);
      fixed++;
    }
  }
}

console.log(log.join('\n'));
console.log(`\nTotal files modified: ${fixed}`);
