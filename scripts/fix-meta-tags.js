// scripts/fix-meta-tags.js
// One-time fixer: rewrite titles (target 50-60 chars) and descriptions
// (target 120-155 chars), injecting the target keywords "Breast health" and
// "breast risk calculate" where natural, on every page flagged by the audit.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://breastcalculator.com';

// Map of file path -> { title, description }
// Note: title and desc are written verbatim into HTML, so & is encoded as &amp;.
// The on-disk HTML length must be 50-60 (title) and 120-155 (desc).
const FIXES = {
  'index.html': {
    title: 'Breast Health &amp; Bra Size Calculator | Free Tool',
    desc: 'Breast health and bra size calculator in one place. Free breast risk calculate tools, fit guides, sister sizes, and wellness articles. No signup.'
  },
  'articles/index.html': {
    title: 'Articles &amp; Bra Health Guides | Breast Calculator',
    desc: 'Free articles on breast health, bra fit, sister sizes, cup volume, and posture. Evidence-based guides for every breast shape and life stage.'
  },
  'article/bra-sister-sizes-explained/index.html': {
    title: 'Bra Sister Sizes Explained: Charts, Math &amp; Fit Tips',
    desc: 'How bra sister sizes work, with charts, math and examples. Find the right sister size when your usual fit is unavailable. Evidence-based fit guide.'
  },
  'article/straps-bra-fit-problems/index.html': {
    title: 'Bra Strap Slipping, Digging &amp; Neck Pain: Fix Guide',
    desc: 'Straps slipping or digging in? The culprit is usually the band, not the strap. Learn the root cause and the fix for chronic shoulder and neck pain.'
  },
  'article/us-vs-uk-bra-sizes/index.html': {
    title: 'US vs UK Bra Sizes: Conversion Chart &amp; Sizing Guide',
    desc: 'Convert US to UK bra sizes with our free chart. Includes EU and AU equivalents, sister size cross-reference, and how to order the right fit online.'
  },
  'best-comfort-bras/index.html': {
    title: 'Most Comfortable Bras of 2026: Expert-Tested Picks',
    desc: 'The most comfortable bras of 2026, expert-tested. Wireless, T-shirt and full-coverage picks reviewed for all-day comfort in every size A to H cup.'
  },
  'bra-buying-guide/index.html': {
    title: 'Bra Buying Guide 2026: Fit, Fabric, Style &amp; Support',
    desc: 'How to buy a bra that fits. Compare fabrics, support levels, cup styles and sizes. Step-by-step bra buying guide for every breast shape and budget.'
  },
  'bra-size-guide/34d/index.html': {
    title: '34D Bra Size Guide: Fit, Sister Sizes &amp; Best Styles',
    desc: '34D bra size guide with measurements, sister sizes, fit tips, and the best 34D bra styles. Compare brands, find your fit, and shop with confidence.'
  },
  'bra-size-guide/compare/index.html': {
    title: 'Compare Bra Sizes Side-by-Side | Charts &amp; Tools',
    desc: 'Compare any two bra sizes with our side-by-side charts, sister-size tables, and calculators. Find your closest fit, fix gaps, and stop guessing sizes.'
  },
  'breast-volume/index.html': {
    title: 'Breast Volume &amp; Weight Calculator: Free cc/mL Tool',
    desc: 'Breast health and risk calculate tools, including a free breast volume and weight calculator. Estimate cc, mL and grams using BREAST-V and Qiao formulas.'
  },
  'privacy/index.html': {
    title: 'Privacy Policy | Breast Health Calculator &amp; Tools',
    desc: 'Our privacy policy: what we collect, how we protect your breast health data, your GDPR and CCPA rights, and how to contact us. Reviewed for clarity.'
  },
  'specials/ptosis-prevention-evidence/index.html': {
    title: 'Ptosis Prevention: Evidence-Based Breast Health Guide',
    desc: 'Can breast ptosis be prevented? An evidence-based breast health review of what causes sagging, what actually helps, and the myths to ignore.'
  },
  'specials/why-d-cup-support/index.html': {
    title: 'Why D+ Cup Breasts Need Real Support | Breast Health',
    desc: 'Why D+ cup breasts need real engineering support, and what most bras get wrong. A breast health perspective on support, posture, and long-term comfort.'
  },
  'terms/index.html': {
    title: 'Terms of Use | Breast Health Calculator &amp; Tools',
    desc: 'Terms of use for our breast health calculators, breast risk calculate tools, bra fit guides and wellness articles. Read before using the site.'
  },
  'tools/breast-volume-calculator/index.html': {
    title: 'Breast Volume Calculator | cc &amp; mL Estimator Free',
    desc: 'Free breast volume calculator and breast risk calculate tool. Estimate volume in cc and mL with the BREAST-V formula and ptosis correction. No signup.'
  },
  'tools/index.html': {
    title: 'Free Breast Health &amp; Risk Calculate Tools | All',
    desc: 'Free breast health and risk calculate tools: volume, weight, ptosis, shape, expansion, and unit converters. Evidence-based, mobile-friendly, no signup.'
  },
  'wellness/breast-self-exam/index.html': {
    title: 'Breast Self-Exam: Step-by-Step Breast Health Guide',
    desc: 'A breast health guide to the breast self-exam. Step-by-step BSE method, what to look for, the current medical consensus, and when to see a doctor.'
  },
  'wellness/compression-vs-support-bras/index.html': {
    title: 'Compression vs Support Bras: How to Pick the Right',
    desc: 'Compression vs support bras: when to wear each, the science of post-surgical compression, and how to choose the right breast health bra for recovery.'
  },
  'wellness/front-vs-back-closure-bras/index.html': {
    title: 'Front vs Back Closure Bras: Comfort &amp; Recovery Guide',
    desc: 'Front vs back closure bras: pros, cons, fit, and which to choose after breast health surgery. Includes a comfort, mobility, and caregiver comparison.'
  },
  'wellness/post-surgery-bra-mistakes/index.html': {
    title: '10 Post-Surgery Bra Mistakes That Slow Healing Down',
    desc: 'Ten post-surgery bra mistakes that slow breast health recovery. What to avoid, why these mistakes are common, and how to fix them for smoother healing.'
  },
  'wellness/sensitive-skin-bra-materials/index.html': {
    title: 'Sensitive-Skin Bra Materials: Fabric Science Guide',
    desc: 'A breast health and fabric science guide to sensitive-skin bra materials. Compare cotton, modal, bamboo, silk and microfiber for post-surgery comfort.'
  },
  'wellness/index.html': {
    title: 'Breast Health &amp; Wellness Hub: Free Recovery Guides',
    desc: 'Free breast health and wellness hub: bra fit, comfort, sports, life-stage changes, post-surgery recovery and risk calculate tools. Evidence-based.'
  },
  'tools/breast-weight-calculator/index.html': {
    title: 'Breast Weight Calculator | Free Grams &amp; Ounces Tool',
    desc: 'Free breast weight calculator for breast health planning. Estimate breast tissue weight in grams, ounces and pounds from band, cup and density.'
  }
};

let fixed = 0;
const log = [];

for (const [rel, { title, desc }] of Object.entries(FIXES)) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { log.push(`[SKIP] missing: ${rel}`); continue; }
  let c = fs.readFileSync(abs, 'utf8');
  const before = c;
  c = c.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  c = c.replace(/<meta name="description" content="[^"]+"\s*\/?>/, `<meta name="description" content="${desc}"/>`);
  if (c !== before) {
    fs.writeFileSync(abs, c, 'utf8');
    fixed++;
    log.push(`[OK] ${rel}  (title=${title.length} desc=${desc.length})`);
  } else {
    log.push(`[NOOP] ${rel}`);
  }
}

console.log(log.join('\n'));
console.log(`\nTotal files updated: ${fixed}`);
