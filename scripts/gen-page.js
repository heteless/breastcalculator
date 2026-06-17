// Generate a new page from a template
// Usage: node gen-page.js <output-path> <config-json>
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';

const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const template = fs.readFileSync(path.join(ROOT, 'best-comfort-bras/index.html'), 'utf8');

// Extract base URL (e.g., /guide/no-underwire-bras/) for canonical/og
const urlPath = config.url_path; // e.g., "/guide/no-underwire-bras/"
const url = 'https://breastcalculator.com' + urlPath.replace(/\/+$/, '') + '/';

// Title 50-60 chars
const title = config.title;
const desc = config.description;
const h1 = config.h1;
const breadcrumb = config.breadcrumb; // array of {name, url}
const mainContent = config.main_content; // full article HTML
const sidebar = config.sidebar || '';
const faqs = config.faqs || []; // [{q, a}, ...]

// Build meta block
const kw = config.keywords || '';
const ogTitle = config.og_title || title;

// Build article + breadcrumb + Schema
const articleOpen = `<article class="article">`;
const articleClose = `</article>`;
const articleHTML = `${articleOpen}<h1>${h1}</h1>${mainContent}${articleClose}`;

// Breadcrumb JSON-LD
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumb.map((b, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: b.name,
    item: 'https://breastcalculator.com' + b.url
  }))
};

// Article JSON-LD
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: h1,
  description: desc,
  image: 'https://breastcalculator.com/images/og-default.jpg',
  datePublished: '2026-06-10T00:00:00Z',
  dateModified: '2026-06-17T00:00:00Z',
  author: { '@type': 'Person', name: 'Breast Calculator Team' },
  publisher: {
    '@type': 'Organization',
    name: 'Breast Calculator',
    logo: { '@type': 'ImageObject', url: 'https://breastcalculator.com/favicon.svg' }
  }
};

// FAQ JSON-LD
let faqJsonLd = '';
if (faqs.length > 0) {
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  faqJsonLd = `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

const articleScript = `<script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>`;
const breadcrumbScript = `<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>`;

// Replace head metadata
let out = template;

// Title
out = out.replace(/<title>[^<]+<\/title>/, `<title>${title}</title>`);

// Meta description
out = out.replace(/<meta name="description" content="[^"]+"\/>/, `<meta name="description" content="${desc}"/>`);

// Keywords
out = out.replace(/<meta name="keywords" content="[^"]+"\/>/, `<meta name="keywords" content="${kw}"/>`);

// Canonical
out = out.replace(/<link rel="canonical" href="[^"]+"\/>/, `<link rel="canonical" href="${url}"/>`);

// Hreflang
out = out.replace(/<link rel="alternate" hreflang="en" href="[^"]+"\/>/g, `<link rel="alternate" hreflang="en" href="${url}"/>`);
out = out.replace(/<link rel="alternate" hreflang="x-default" href="[^"]+"\/>/g, `<link rel="alternate" hreflang="x-default" href="${url}"/>`);

// OG/Twitter
out = out.replace(/<meta property="og:title" content="[^"]+"\/>/, `<meta property="og:title" content="${ogTitle.replace(/&/g, '&amp;')}"/>`);
out = out.replace(/<meta property="og:description" content="[^"]+"\/>/, `<meta property="og:description" content="${desc.replace(/&/g, '&amp;')}"/>`);
out = out.replace(/<meta property="og:url" content="[^"]+"\/>/, `<meta property="og:url" content="${url}"/>`);
out = out.replace(/<meta name="twitter:title" content="[^"]+"\/>/, `<meta name="twitter:title" content="${ogTitle.replace(/&/g, '&amp;')}"/>`);
out = out.replace(/<meta name="twitter:description" content="[^"]+"\/>/, `<meta name="twitter:description" content="${desc.replace(/&/g, '&amp;')}"/>`);

// Remove the old Article/Breadcrumb schema in head
out = out.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"Article"[\s\S]*?<\/script>/, '');

// Add FAQ schema after the WebSite schema
out = out.replace(/(<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"WebSite"[\s\S]*?<\/script>)/, `$1${faqJsonLd}`);

// Replace article body (from <article class="article"> to </article>)
out = out.replace(/<article class="article">[\s\S]*?<\/article>/, articleHTML);

// Insert BreadcrumbList schema + Article schema at start of <main>
out = out.replace(/<main>/, `<main>${articleScript}${breadcrumbScript}`);

// Write
const outPath = path.join(ROOT, config.output_path);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote:', config.output_path, '(', out.length, 'bytes )');

// Word count
const text = out.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log('Approx words:', text.split(' ').length);
