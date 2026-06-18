// Add byline to the 2 new SEO cluster articles
//   1. us-vs-uk-bra-sizes
//   2. why-80-percent-wrong-bra-size
// Format: "Reviewed by the Breast Calculator Editorial Team · Published June 18, 2026 · X min read"
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';

const ARTICLES = [
  { slug: 'us-vs-uk-bra-sizes',           readTime: '6 min read' },
  { slug: 'why-80-percent-wrong-bra-size', readTime: '7 min read' },
];

const PUBLISHED_ISO = '2026-06-18';
const PUBLISHED_HUMAN = 'June 18, 2026';

function buildByline(readTime) {
  return (
    `<p class="byline" style="font-size:0.85rem;color:var(--text-light);margin:0 0 24px 0;padding-bottom:16px;border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center">` +
      `<span>Reviewed by the <span itemprop="author">Breast Calculator Editorial Team</span></span>` +
      `<span aria-hidden="true">·</span>` +
      `<span>Published <time datetime="${PUBLISHED_ISO}" itemprop="datePublished">${PUBLISHED_HUMAN}</time></span>` +
      `<span aria-hidden="true">·</span>` +
      `<span>${readTime}</span>` +
    `</p>`
  );
}

function injectByline(html, byline) {
  // The gen-page.js template uses:
  //   <article class="article">  (no inline style)
  // Insert byline after the opening tag.
  const openTag = '<article class="article">';
  if (!html.includes(openTag)) {
    throw new Error('Could not find expected <article class="article"> opening tag');
  }
  if (html.includes('class="byline"')) {
    return { html, changed: false };
  }
  return { html: html.replace(openTag, openTag + byline), changed: true };
}

for (const a of ARTICLES) {
  const p = path.join(ROOT, `article/${a.slug}/index.html`);
  if (!fs.existsSync(p)) {
    console.log('SKIP  ' + a.slug + '  (missing)');
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const byline = buildByline(a.readTime);
  const r = injectByline(html, byline);
  if (r.changed) {
    fs.writeFileSync(p, r.html, 'utf8');
    console.log('OK    ' + a.slug + '  (' + a.readTime + ')');
  } else {
    console.log('NOOP  ' + a.slug + '  (byline already present)');
  }
}
