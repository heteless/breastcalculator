// Inject a "Related Reading" block into every /tools/<name>/index.html
// Block sits before </article> or before the footer.
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const TOOLS_DIR = path.join(ROOT, 'tools');

// Hub map: each tool → its primary hub URL and cluster siblings
const HUB_MAP = {
  'breast-volume-calculator': { hub: '/breast-volume/', hubName: 'Breast Volume & Weight Hub' },
  'breast-weight-calculator': { hub: '/breast-volume/', hubName: 'Breast Volume & Weight Hub' },
  'breast-ptosis-calculator': { hub: '/breast-volume/', hubName: 'Breast Volume & Weight Hub' },
  'breast-shape-calculator':  { hub: '/bra-size-calculator/', hubName: 'Bra Size Calculator' },
  'breast-expansion-calculator': { hub: '/breast-volume/', hubName: 'Breast Volume & Weight Hub' },
  'length-converter': { hub: '/bra-size-calculator/', hubName: 'Bra Size Calculator' },
  'weight-converter': { hub: '/breast-volume/', hubName: 'Breast Volume & Weight Hub' }
};

const WIDGET = (hub, hubName) => `
<aside class="related-reading" aria-label="Related reading" style="margin-top:2rem;padding:1.25rem 1.5rem;background:#fafbfc;border:1px solid #e5e7eb;border-radius:.75rem;">
  <h2 style="font-size:1.1rem;margin:0 0 .5rem;">Related Reading</h2>
  <ul style="margin:0;padding-left:1.25rem;line-height:1.7;">
    <li><a href="${hub}">${hubName}</a> &mdash; the pillar guide for this topic.</li>
    <li><a href="/bra-size-calculator/">Bra Size Calculator (Free, Accurate, Instant)</a></li>
    <li><a href="/bra-size-guide/">The Complete Bra Size Guide</a></li>
    <li><a href="/article/us-vs-uk-bra-sizes/">US vs UK Bra Sizes &mdash; What&rsquo;s the Difference?</a></li>
    <li><a href="/article/bra-sister-sizes-explained/">Bra Sister Sizes Explained</a></li>
  </ul>
</aside>
`;

const dirs = fs.readdirSync(TOOLS_DIR).filter(d => fs.statSync(path.join(TOOLS_DIR, d)).isDirectory());
let updated = 0, skipped = 0;
for (const name of dirs) {
  const p = path.join(TOOLS_DIR, name, 'index.html');
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes('class="related-reading"') || c.includes('Related Reading</h2>')) {
    skipped++; continue;
  }
  const hub = HUB_MAP[name];
  if (!hub) { skipped++; continue; }
  const block = WIDGET(hub.hub, hub.hubName);
  // Insert before the first <footer> or before </article> if no footer
  let inserted = false;
  if (c.includes('<footer')) {
    c = c.replace('<footer', block + '\n<footer');
    inserted = true;
  } else if (c.includes('</article>')) {
    c = c.replace('</article>', block + '\n</article>');
    inserted = true;
  } else if (c.includes('</main>')) {
    c = c.replace('</main>', block + '\n</main>');
    inserted = true;
  } else if (c.includes('</body>')) {
    c = c.replace('</body>', block + '\n</body>');
    inserted = true;
  }
  if (inserted) {
    fs.writeFileSync(p, c, 'utf8');
    updated++;
    console.log(`OK    tools/${name}/index.html  →  linked to ${hub.hub}`);
  } else {
    skipped++;
  }
}
console.log(`\nUpdated: ${updated}    Skipped: ${skipped}`);
