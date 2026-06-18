// Add byline to the 5 new "20 Bra Fit Problems" articles
// Format: "Reviewed by the Breast Calculator Editorial Team · Published June 17, 2026 · X min read"
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';

const ARTICLES = [
  { slug: 'straps-bra-fit-problems',          readTime: '4 min read' },
  { slug: 'cups-bra-fit-problems',            readTime: '5 min read' },
  { slug: 'band-bra-fit-problems',            readTime: '5 min read' },
  { slug: 'underwire-gore-bra-fit-problems',  readTime: '5 min read' },
  { slug: 'special-bra-fit-problems',         readTime: '6 min read' },
];

const PUBLISHED_ISO = '2026-06-17';
const PUBLISHED_HUMAN = 'June 17, 2026';

function buildByline(readTime) {
  // Use the same visual language as the .article-meta cards on /articles/ :
  //   "Reviewed by our editorial team · X min read"
  // We add: author (with schema.org Person microdata), published date (time element),
  // and read time. The bar is subtle and sits above the first H2.
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
  // Insert the byline immediately after the opening <article ...> tag.
  // All 5 new articles use the same opening pattern:
  //   <article class="article" style="max-width:780px;margin:0 auto;padding:32px 24px">
  const openTag = '<article class="article" style="max-width:780px;margin:0 auto;padding:32px 24px">';
  if (!html.includes(openTag)) {
    throw new Error('Could not find expected <article> opening tag');
  }
  // Avoid double-injection
  if (html.includes('class="byline"')) {
    return { html, changed: false };
  }
  return {
    html: html.replace(openTag, openTag + byline),
    changed: true,
  };
}

let totalChanged = 0;
for (const a of ARTICLES) {
  const byline = buildByline(a.readTime);
  for (const base of ['article', 'dist/article']) {
    const file = path.join(ROOT, base, a.slug, 'index.html');
    if (!fs.existsSync(file)) {
      console.warn(`[skip] ${file} not found`);
      continue;
    }
    const original = fs.readFileSync(file, 'utf8');
    const { html, changed } = injectByline(original, byline);
    if (changed) {
      fs.writeFileSync(file, html, 'utf8');
      const delta = html.length - original.length;
      console.log(`[${changed ? 'updated' : 'skipped'}] ${file}  (+${delta} bytes)`);
      totalChanged++;
    } else {
      console.log(`[skipped] ${file}  (byline already present)`);
    }
  }
}

console.log(`\nDone. ${totalChanged} file(s) updated.`);
