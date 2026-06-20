// Add 3 hub cards to the homepage that link to the 3 new hubs.
// Inject after the existing tool-list section, before the article sections.
const fs = require('fs');
const path = require('path');
const ROOT = 'd:/DevProject/breastcalculator';
const p = path.join(ROOT, 'index.html');
let c = fs.readFileSync(p, 'utf8');

if (c.includes('class="hub-cards"') || c.includes('id="hub-cards"')) {
  console.log('Hub cards already present, skipping.');
  process.exit(0);
}

const HUB_CARDS = `
<section class="hub-cards" id="hub-cards" aria-label="Topical hubs" style="max-width:1100px;margin:2rem auto;padding:0 1.25rem;">
  <h2 style="text-align:center;font-size:1.5rem;margin-bottom:1rem;">Explore the Breast Calculator Hubs</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
    <a href="/bra-size-calculator/" class="hub-card" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:.75rem;background:#fafbfc;text-decoration:none;color:inherit;">
      <h3 style="margin:.25rem 0;font-size:1.15rem;">Bra Size Calculator Hub</h3>
      <p style="margin:.25rem 0;color:#4b5563;font-size:.95rem;">Free, accurate bra sizing in US, UK, EU &amp; AU. Measure at home in 2 minutes.</p>
    </a>
    <a href="/bra-size-guide/" class="hub-card" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:.75rem;background:#fafbfc;text-decoration:none;color:inherit;">
      <h3 style="margin:.25rem 0;font-size:1.15rem;">Bra Size Guide Hub</h3>
      <p style="margin:.25rem 0;color:#4b5563;font-size:.95rem;">Every band, every cup, fit problems explained. 21 size-specific guides + measurement steps.</p>
    </a>
    <a href="/breast-volume/" class="hub-card" style="display:block;padding:1.25rem;border:1px solid #e5e7eb;border-radius:.75rem;background:#fafbfc;text-decoration:none;color:inherit;">
      <h3 style="margin:.25rem 0;font-size:1.15rem;">Breast Volume &amp; Weight Hub</h3>
      <p style="margin:.25rem 0;color:#4b5563;font-size:.95rem;">Estimate anatomy in cc, mL &amp; grams using peer-reviewed formulas.</p>
    </a>
  </div>
</section>
`;

// Insert before the first "More Free Tools" h2 or similar; we look for first <h2
const idx = c.indexOf('<h2');
if (idx > -1) {
  c = c.slice(0, idx) + HUB_CARDS + '\n' + c.slice(idx);
} else {
  c = c.replace('</main>', HUB_CARDS + '\n</main>');
}
fs.writeFileSync(p, c, 'utf8');
console.log('Hub cards injected into index.html');
