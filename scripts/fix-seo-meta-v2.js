// SEO Meta Fixer v2 — handles both <meta .../> and <meta ...> formats
const fs = require('fs');

function setDescription(file, newDesc) {
  if (!fs.existsSync(file)) return false;
  const c = fs.readFileSync(file, 'utf8');
  // Match both <meta name="description" content="..."> and <meta name="description" content="..."/>
  const re = /<meta name="description"\s+content="[^"]*"\s*\/?>/i;
  if (!re.test(c)) return false;
  fs.writeFileSync(file, c.replace(re, `<meta name="description" content="${newDesc}"/>`), 'utf8');
  return true;
}

function setTitle(file, newTitle) {
  if (!fs.existsSync(file)) return false;
  const c = fs.readFileSync(file, 'utf8');
  if (!/<title>[^<]*<\/title>/.test(c)) return false;
  fs.writeFileSync(file, c.replace(/<title>[^<]*<\/title>/, `<title>${newTitle}</title>`), 'utf8');
  return true;
}

function setTwitterTitle(file, newTwTitle) {
  if (!fs.existsSync(file)) return false;
  const c = fs.readFileSync(file, 'utf8');
  if (/<meta name="twitter:title"\s+content="[^"]*"\s*\/?>/i.test(c)) {
    return fs.writeFileSync(file, c.replace(/<meta name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${newTwTitle}"/>`), 'utf8'), true;
  }
  return false;
}

function getOgTitle(file) {
  const c = fs.readFileSync(file, 'utf8');
  return (c.match(/<meta property="og:title" content="([^"]+)"/) || [])[1] || '';
}
function getTitle(file) {
  const c = fs.readFileSync(file, 'utf8');
  return (c.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
}

// --- Fix DESC_LONG (4 pages) ---
const descLongFixes = {
  'index.html': 'Free, accurate bra size calculator for US, UK & EU sizing. Measure at home in 2 minutes — instant, private results. Mobile, no registration.',
  'bra-size-calculator/index.html': 'Free, accurate bra size calculator for US, UK, EU and AU sizing. Measure at home in 2 minutes — instant, private results. No signup.',
  'bra-size-guide/index.html': 'Complete bra size guide: every band, every cup, fit problems explained, measurement steps, sister sizes, size charts and research. Free.',
  'tools/weight-converter/index.html': 'Free online body weight converter: kilograms, pounds, ounces, grams, milligrams, and UK stones. NIST-traceable, no signup, 100% private.'
};

// --- Fix DESC_SHORT (7 pages) ---
const descShortFixes = {
  'specials/index.html': 'Science-backed breast health: D+ cup support, sports bra biomechanics, ptosis prevention, accessory breast tissue, and evidence-based bra fitting guides.',
  'wellness/index.html': 'Post-surgical breast wellness: prosthetic bra guides, sports bras after surgery, and gentle recovery support. Evidence-based, expert-reviewed resources.',
  'specials/accessory-breast-guide/index.html': 'Evidence-based guide to accessory breast tissue: causes, symptoms, diagnosis, and treatment options for axillary (underarm) breast tissue.',
  'specials/buying-guide/index.html': 'How to choose bras for D+ cup sizes. Evidence-based selection guide with fitting checklist, fabric science, and biomechanical support principles.',
  'specials/expansion-evidence/index.html': 'Understanding breast splaying anatomy. Evidence on how targeted bra design and side support correct a splayed or wide-set breast shape.',
  'wellness/prosthetic-bras-guide/index.html': 'A gentle guide to prosthetic bras after mastectomy: what they are, mastectomy bra styles, how to choose, fit tips, and where to find comfort.',
  'wellness/sports-bras-after-surgery/index.html': 'A gentle guide to choosing sports bras after breast surgery. Soft fabrics, front closures, gentle compression, and post-mastectomy sports bra tips.'
};

let log = [];
let fixed = 0;

for (const [file, desc] of Object.entries(descLongFixes)) {
  if (setDescription(file, desc)) { log.push(`[OK] DESC_LONG→${desc.length}: ${file}`); fixed++; }
  else { log.push(`[SKIP] DESC_LONG: ${file}`); }
}
for (const [file, desc] of Object.entries(descShortFixes)) {
  if (setDescription(file, desc)) { log.push(`[OK] DESC_SHORT→${desc.length}: ${file}`); fixed++; }
  else { log.push(`[SKIP] DESC_SHORT: ${file}`); }
}

console.log(log.join('\n'));
console.log(`\nTotal files modified: ${fixed}`);
