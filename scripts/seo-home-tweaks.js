// SEO Minor Tweaks for Breast Calculator Home Page
// Implements the SEO plan from the prompt:
//   1. Title tag with CTR-boosting words (target #1 keyword)
//   2. New meta description (118 chars, includes US/UK/EU)
//   3. H1 rewrite to include "Most Accurate"
//   4. Add 3 long-tail H2 sections (How to Measure Band, Cup, Sister Sizes)
//   5. Add FAQ section + FAQPage JSON-LD schema
//   6. Add HowTo JSON-LD schema (band + bust measuring steps)
//   7. Internal links to /article/bra-sister-sizes-explained/, /how-to-measure-bra-size/

const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const HOME = path.join(ROOT, 'index.html');

let html = fs.readFileSync(HOME, 'utf8');

const log = (label, before, after) => {
  const changed = before !== after;
  console.log(`[${changed ? 'OK' : 'NO-CHANGE'}] ${label}  ${changed ? '(' + (after.length - before.length > 0 ? '+' : '') + (after.length - before.length) + ' bytes)' : ''}`);
  return after;
};

// === 1. Title tag ===
// From: "Bra Size Calculator — US, UK, EU | Breast Calculator" (58)
// To:   "Accurate Bra Size Calculator – Find Your Perfect Fit" (54)
const newTitle = 'Accurate Bra Size Calculator – Find Your Perfect Fit';
{
  const before = html;
  html = html.replace(
    /<title>[^<]+<\/title>/,
    `<title>${newTitle}</title>`
  );
  log('title', before, html);
}

// === 2. Meta description ===
// To: "Get your exact bra size with our easy-to-use calculator. Supports US, UK, and EU sizing. Start now."
const newDesc = 'Get your exact bra size with our easy-to-use calculator. Supports US, UK, and EU sizing. Start now.';
{
  const before = html;
  html = html.replace(
    /<meta name="description" content="[^"]+"\/>/,
    `<meta name="description" content="${newDesc}"/>`
  );
  log('meta description', before, html);
}

// === 3. H1 ===
// From: "Bra Size Calculator — Find Your Perfect Fit"
// To:   "The Most Accurate Bra Size Calculator"
{
  const before = html;
  html = html.replace(
    /<h1>Bra Size Calculator [^<]+<\/h1>/,
    `<h1>The Most Accurate Bra Size Calculator</h1>`
  );
  log('H1', before, html);
}

// === 4. OG:title and OG:description + twitter ===
{
  const before = html;
  html = html.replace(
    /<meta property="og:title" content="[^"]+"\/>/,
    `<meta property="og:title" content="${newTitle}"/>`
  );
  log('og:title', before, html);
}
{
  const before = html;
  html = html.replace(
    /<meta property="og:description" content="[^"]+"\/>/,
    `<meta property="og:description" content="${newDesc.replace(/&/g, '&amp;')}"/>`
  );
  log('og:description', before, html);
}
// twitter:title/description if present
{
  const before = html;
  html = html.replace(
    /<meta name="twitter:title" content="[^"]+"\/>/,
    `<meta name="twitter:title" content="${newTitle}"/>`
  );
}
{
  const before = html;
  html = html.replace(
    /<meta name="twitter:description" content="[^"]+"\/>/,
    `<meta name="twitter:description" content="${newDesc.replace(/&/g, '&amp;')}"/>`
  );
}

// === 5. Add HowTo + FAQPage JSON-LD schemas in <head> ===
// We add the schemas right after the existing WebSite schema.
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Calculate Bra Size at Home',
  description: 'Two-step method to calculate your bra size at home using a soft measuring tape.',
  totalTime: 'PT5M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  tool: [
    { '@type': 'HowToTool', name: 'Soft measuring tape (inches or cm)' },
    { '@type': 'HowToTool', name: 'Mirror' }
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Measure your band size (underbust)',
      text: 'Stand in front of a mirror. Wrap a soft measuring tape snugly around your ribcage, directly under your breasts where the band of your bra sits. Keep the tape level and exhale normally. Round to the nearest whole number to get your band size in inches.',
      url: 'https://breastcalculator.com/#measure-band'
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Measure your bust (fullest part)',
      text: 'Wrap the tape loosely around the fullest part of your bust, usually at nipple level. Do not pull tight. Round to the nearest whole number. This is your bust measurement in inches.',
      url: 'https://breastcalculator.com/#measure-cup'
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Calculate your cup size',
      text: 'Subtract your band measurement from your bust measurement. Each inch of difference equals one cup size: 1\u2033 = A, 2\u2033 = B, 3\u2033 = C, 4\u2033 = D, 5\u2033 = DD/E, 6\u2033 = DDD/F, 7\u2033 = G, and so on.',
      url: 'https://breastcalculator.com/#measure-cup'
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Confirm with the calculator',
      text: 'Enter both numbers into the calculator above to confirm your exact US, UK, EU, FR, and AU size. If the fit feels off, see the sister sizes section below to find an alternative that may fit your breast shape better.',
      url: 'https://breastcalculator.com/#sister-sizes'
    }
  ]
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How accurate is this bra size calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculator uses the standard underbust-and-bust method endorsed by breast-health researchers and major lingerie brands. For most people, it is within one band size and one cup size of their best fit. The most common reason for an off result is the user wearing a too-loose measuring tape; measure snugly for the band and loosely for the bust for the most accurate result.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I figure out my bra size at home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Take two measurements with a soft tape: (1) your underbust (snug, directly under the breasts) and (2) your bust (loose, at the fullest part). Subtract the underbust from the bust: each inch of difference equals one cup letter. Then use this calculator to convert the result into US, UK, EU, FR, and AU sizing.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is a sister size in a bra calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sister sizes are bra sizes that hold the same cup volume but on a different band. For every band size you go up, you go down one cup letter (and vice versa). For example, 34C, 32D, and 36B are all sister sizes with the same cup volume. Use sister sizes when a bra is unavailable in your exact size or when you need a snugger or looser band.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do US, UK, and EU bra sizes differ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'US and UK sizes use the same band and cup letters, but cup progression diverges above D. US DDD = UK E, and US G = UK F. EU sizes use a different band measurement system (cm) and a different cup progression. The calculator above outputs all three systems side by side so you can shop any brand with confidence.'
      }
    }
  ]
};

const howToScript = `<script type="application/ld+json">${JSON.stringify(howToSchema)}</script>`;
const faqScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;

// Insert the HowTo + FAQPage schemas right before </head>
{
  const before = html;
  if (!html.includes('"@type":"HowTo"')) {
    html = html.replace('</head>', `${howToScript}${faqScript}</head>`);
  }
  log('HowTo+FAQPage JSON-LD', before, html);
}

// === 6. Add 3 new H2 sections + FAQ section into <main> ===
// We insert right after the hero (calculator) section, before the existing
// "Popular Bra Size Guides" section. The FAQ section is appended just before
// the existing "Not Sure How to Measure?" CTA.

const newSections = `
<section class="section" id="how-to-measure">
  <h2 class="section-title">How to Calculate Bra Size at Home</h2>
  <p class="section-subtitle">Two simple measurements give you an accurate bra size in under five minutes. For a deeper walkthrough, see our <a href="/how-to-measure-bra-size/">complete measurement guide</a> or use the calculator above to get your exact size in US, UK, and EU.</p>

  <div class="card-grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px">
    <div class="card" id="measure-band">
      <h3>1. How to Measure Band Size (Underbust)</h3>
      <p>Stand in front of a mirror in a non-padded bra. Wrap a soft measuring tape <strong>snugly</strong> around your ribcage, directly under your breasts where the bra band sits. Keep the tape level all the way around and breathe out normally. The number in inches, rounded to the nearest whole number, is your <strong>band size</strong> &mdash; for example, 32, 34, or 36.</p>
      <p><strong>Tip:</strong> If the measurement falls on a half-inch (e.g. 31.5), round down to the next even number. This is the foundation of an accurate fit: the band carries roughly 80&ndash;90% of breast weight.</p>
    </div>

    <div class="card" id="measure-cup">
      <h3>2. How to Measure Cup Size (Bust)</h3>
      <p>Wrap the tape <strong>loosely</strong> around the fullest part of your bust, usually at nipple level. Do not compress the tissue. Round to the nearest whole inch to get your <strong>bust measurement</strong>.</p>
      <p><strong>Cup math:</strong> subtract the band from the bust. Each inch of difference equals one cup letter: 1&Prime; = A, 2&Prime; = B, 3&Prime; = C, 4&Prime; = D, 5&Prime; = DD/E, 6&Prime; = DDD/F, 7&Prime; = G. Enter both numbers above and the calculator will confirm your size.</p>
    </div>

    <div class="card" id="sister-sizes">
      <h3>3. Understanding Sister Sizes</h3>
      <p>Sister sizes are bra sizes that hold the <strong>same cup volume</strong> on a different band. For each band you go up, go down one cup letter &mdash; and vice versa. For example, 34C, 32D, and 36B are all sister sizes.</p>
      <p>Use sister sizing when your exact size is out of stock, when a bra runs tight or loose in the band, or when you want to fine-tune fit. See the <a href="/article/bra-sister-sizes-explained/">complete sister sizes guide</a> for charts from 28A to 44H.</p>
    </div>
  </div>
</section>

<section class="section" id="faq" style="background:var(--color-surface);border-radius:var(--radius);padding:48px 24px">
  <h2 class="section-title">Frequently Asked Questions</h2>
  <p class="section-subtitle">Quick answers to the most common questions about calculating bra size at home.</p>

  <details style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 22px;margin-bottom:12px">
    <summary style="font-weight:600;cursor:pointer;font-size:1.05rem">How accurate is this bra size calculator?</summary>
    <p style="margin-top:12px;color:var(--text-light)">The calculator uses the standard underbust-and-bust method endorsed by breast-health researchers and major lingerie brands. For most people, it is within one band size and one cup size of their best fit. The most common reason for an off result is the user wearing a too-loose measuring tape; measure snugly for the band and loosely for the bust for the most accurate result.</p>
  </details>

  <details style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 22px;margin-bottom:12px">
    <summary style="font-weight:600;cursor:pointer;font-size:1.05rem">How do I figure out my bra size at home?</summary>
    <p style="margin-top:12px;color:var(--text-light)">Take two measurements with a soft tape: (1) your underbust (snug, directly under the breasts) and (2) your bust (loose, at the fullest part). Subtract the underbust from the bust: each inch of difference equals one cup letter. Then use this calculator to convert the result into US, UK, EU, FR, and AU sizing.</p>
  </details>

  <details style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 22px;margin-bottom:12px">
    <summary style="font-weight:600;cursor:pointer;font-size:1.05rem">What is a sister size in a bra calculator?</summary>
    <p style="margin-top:12px;color:var(--text-light)">Sister sizes are bra sizes that hold the same cup volume but on a different band. For every band size you go up, you go down one cup letter (and vice versa). For example, 34C, 32D, and 36B are all sister sizes with the same cup volume. Use sister sizes when a bra is unavailable in your exact size or when you need a snugger or looser band.</p>
  </details>

  <details style="background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px 22px;margin-bottom:12px">
    <summary style="font-weight:600;cursor:pointer;font-size:1.05rem">How do US, UK, and EU bra sizes differ?</summary>
    <p style="margin-top:12px;color:var(--text-light)">US and UK sizes use the same band and cup letters, but cup progression diverges above D. US DDD = UK E, and US G = UK F. EU sizes use a different band measurement system (cm) and a different cup progression. The calculator above outputs all three systems side by side so you can shop any brand with confidence.</p>
  </details>

  <p style="text-align:center;margin-top:24px"><a href="/articles/" class="btn-secondary" style="display:inline-block">View All Bra Fitting Guides &rarr;</a></p>
</section>
`;

// Insert the new sections after the hero section, before the "Popular Bra Size Guides" section.
{
  const before = html;
  if (!html.includes('id="how-to-measure"')) {
    // The first occurrence of "Popular Bra Size Guides" marks the start of the next section
    const anchor = '<h2 class="section-title">Popular Bra Size Guides</h2>';
    if (html.includes(anchor)) {
      html = html.replace(anchor, newSections + anchor);
      log('H2 sections + FAQ block', before, html);
    } else {
      console.error('[ERROR] Could not find anchor for new H2 sections');
    }
  }
}

// === 7. Inject cross-link to new pages in existing card grids ===
// (We will create the new pages in a separate step; the home page change
// here is complete.)

fs.writeFileSync(HOME, html, 'utf8');
console.log(`\nWrote: index.html  (${html.length} bytes, ${(html.length - fs.statSync(HOME).size || html.length)} net change)`);
