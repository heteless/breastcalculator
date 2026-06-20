// gen-wellness.js — generate wellness hub + 12 articles with full layout
const fs = require('fs');
const path = require('path');
const { HUB, ARTICLES } = require('./articles-data.js');
const { NAV, CHROME, FOOTER, SCRIPTS } = require('./_layout-template.js');

const ROOT = path.join(__dirname, '..');
const W = path.join(ROOT, 'wellness');

const HEAD_COMMON = `<meta charset="utf-8"/><meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied','functionality_storage':'granted','security_storage':'granted','wait_for_update':500});gtag('set','url_passthrough',true);</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-5SB8FNFYDV"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5SB8FNFYDV',{'anonymize_ip':true});</script><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="default"/><meta name="apple-mobile-web-app-title" content="Bra Calculator"/><meta name="format-detection" content="telephone=no"/><meta name="theme-color" content="#f4e3d7"/><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet"/><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="shortcut icon" href="/favicon.ico"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png"><link rel="manifest" href="/site.webmanifest"><meta name="msapplication-TileColor" content="#f4e3d7">`;

const HEAD_STYLE = `<style>
/* ===== Wellness Hub & Articles: Shared Styles ===== */
/* Complements /style.css and tailwind-built.css */

:root{
  --bg:#fdf8f5;
  --sand:#e8ddd0;
  --sand-light:#fcf3ec;
  --cream:#fff9f5;
  --text:#3d2c2a;
  --text-light:#7a5f5a;
  --text-muted:#a08882;
  --heading:#2d1e1c;
  --heading-warm:#5a3d38;
  --rose:#dcb4a5;
  --rose-light:#e8c5b9;
  --rose-dark:#c49585;
  --border:#e8d8cf;
  --font-serif:'Playfair Display','SF Pro Display',Georgia,'Times New Roman',serif;
  --font-sans:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--font-sans);color:var(--text);background:var(--bg);line-height:1.6;margin:0;padding:0;-webkit-font-smoothing:antialiased}

/* ===== Hub hero ===== */
.hub-hero{
  background:linear-gradient(135deg,var(--cream) 0%,var(--sand-light) 40%,var(--sand) 100%);
  padding:clamp(48px,9vw,80px) 16px clamp(36px,7vw,56px);
  text-align:center;
  border-bottom:1px solid var(--border);
}
.hub-hero .kicker{
  display:inline-block;
  font-size:.74rem;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--rose-dark);
  background:rgba(255,255,255,.55);
  border:1px solid var(--rose-light);
  padding:5px 12px;
  border-radius:999px;
  margin-bottom:14px;
  font-weight:600;
}
.hub-hero h1{
  font-family:var(--font-serif);
  font-size:clamp(1.7rem,5.2vw,2.7rem);
  line-height:1.2;
  color:var(--heading);
  max-width:780px;
  margin:0 auto 16px;
  letter-spacing:-.01em;
}
.hub-hero .subtitle{
  font-size:clamp(.95rem,2vw,1.06rem);
  color:var(--text-light);
  max-width:680px;
  margin:0 auto 8px;
  line-height:1.65;
}
.hub-hero .meta{
  font-size:.8rem;
  color:var(--text-muted);
  margin-top:10px;
  letter-spacing:.02em;
}

/* ===== Article hero ===== */
.article-hero{
  background:linear-gradient(135deg,var(--cream) 0%,var(--sand-light) 40%,var(--sand) 100%);
  padding:clamp(40px,8vw,56px) 14px clamp(32px,6vw,40px);
  text-align:center;
  border-bottom:1px solid var(--border);
}
.article-hero h1{
  font-family:var(--font-serif);
  font-size:clamp(1.55rem,4.5vw,2.3rem);
  max-width:700px;
  margin:0 auto 14px;
  line-height:1.25;
  color:var(--heading);
  letter-spacing:-.005em;
}
.article-hero .subtitle{
  font-size:clamp(.92rem,1.8vw,1rem);
  color:var(--text-light);
  max-width:560px;
  margin:0 auto 10px;
  line-height:1.65;
}
.article-hero .kicker{
  display:inline-block;
  font-size:.7rem;
  letter-spacing:.16em;
  text-transform:uppercase;
  color:var(--rose-dark);
  background:rgba(255,255,255,.55);
  border:1px solid var(--rose-light);
  padding:4px 11px;
  border-radius:999px;
  margin-bottom:12px;
  font-weight:600;
}
.article-byline{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  align-items:center;
  gap:6px 10px;
  font-size:.82rem;
  color:var(--text-muted);
  max-width:640px;
  margin:14px auto 0;
  padding-top:14px;
  border-top:1px solid rgba(138,109,86,.18);
  line-height:1.5;
}
.article-byline .byline-author strong{color:var(--heading-warm);font-weight:600}
.article-byline .byline-cred{color:var(--text-light);font-style:italic}
.article-byline .byline-sep{color:var(--rose-light);font-weight:700;margin:0 2px}
.article-byline .byline-date{color:var(--text-light)}
.article-byline .byline-updated{color:var(--text-muted);font-style:italic;margin-left:4px}
.article-byline .byline-readtime{
  display:inline-flex;
  align-items:center;
  gap:5px;
  color:var(--rose-dark);
  font-weight:500;
}
@media(max-width:600px){
  .article-byline{font-size:.78rem;gap:4px 8px}
  .article-byline .byline-sep{display:none}
}

/* ===== Wellness article body ===== */
.wellness-article{
  max-width:740px;
  margin:0 auto;
  padding:40px 20px 60px;
  color:var(--text);
  font-size:1rem;
  line-height:1.7;
}
.wellness-article h2{
  margin-top:36px;
  margin-bottom:14px;
  border-bottom:1px solid var(--sand);
  padding-bottom:10px;
  color:var(--heading-warm);
  font-size:1.3rem;
  font-family:var(--font-serif);
  text-align:left;
  line-height:1.35;
  font-weight:600;
  letter-spacing:-.005em;
}
.wellness-article h2:first-of-type{margin-top:8px}
.wellness-article h3{
  margin-top:28px;
  font-size:1.05rem;
  font-family:var(--font-sans);
  font-weight:600;
  margin-bottom:8px;
  color:var(--heading-warm);
  line-height:1.4;
}
.wellness-article p{
  line-height:1.8;
  margin-bottom:16px;
  color:var(--text);
}
.wellness-article a{
  color:var(--heading-warm);
  text-decoration:underline;
  text-decoration-color:var(--rose-light);
  text-underline-offset:3px;
  transition:color .2s ease,text-decoration-color .2s ease;
}
.wellness-article a:hover{
  color:var(--rose-dark);
  text-decoration-color:var(--rose-dark);
}
.wellness-article ul,.wellness-article ol{
  padding-left:1.6em;
  margin-bottom:18px;
  color:var(--text);
}
.wellness-article li{
  margin-bottom:8px;
  font-size:.95rem;
  line-height:1.7;
}
.wellness-article li::marker{color:var(--rose)}
.wellness-article strong{color:var(--heading);font-weight:600}
.wellness-article table{
  width:100%;
  border-collapse:collapse;
  margin:24px 0;
  font-size:.92rem;
  display:block;
  overflow-x:auto;
  -webkit-overflow-scrolling:touch;
}
.wellness-article table th,
.wellness-article table td{
  padding:10px 12px;
  border:1px solid var(--sand);
  text-align:left;
  vertical-align:top;
}
.wellness-article table th{
  background:var(--sand-light);
  font-weight:600;
  color:var(--heading-warm);
}
.wellness-article blockquote{
  border-left:3px solid var(--rose);
  background:var(--sand-light);
  padding:14px 18px;
  margin:20px 0;
  font-style:italic;
  color:var(--text);
  border-radius:0 8px 8px 0;
}

/* ===== Hub section list ===== */
.hub-section{margin-top:40px;padding-top:8px}
.hub-section-head{
  display:flex;
  align-items:baseline;
  gap:10px;
  margin:0 0 12px;
  border-bottom:1px solid var(--sand);
  padding-bottom:10px;
}
.hub-section-head h2{
  margin:0;border:0;padding:0;
  font-family:var(--font-serif);
  color:var(--heading-warm);
  font-size:1.3rem;
  font-weight:600;
  line-height:1.35;
}
.hub-section-head .count{
  font-size:.78rem;
  color:var(--text-muted);
  font-weight:500;
  letter-spacing:.04em;
}
.hub-section p.lead{margin-bottom:14px;color:var(--text-light)}

/* ===== Article-card grid (matches /articles/ pattern) ===== */
.articles-grid{
  display:grid;
  grid-template-columns:1fr;
  gap:18px;
  margin:18px 0 8px;
}
.article-card{
  background:#fff;
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:20px;
  transition:box-shadow 0.3s,transform 0.3s,border-color 0.3s;
  box-shadow:var(--shadow);
}
.article-card:hover{
  box-shadow:var(--shadow-hover);
  transform:translateY(-2px);
  border-color:var(--rose-light);
}
.article-card .article-tag{
  display:inline-block;
  font-size:0.7rem;
  font-weight:600;
  color:var(--rose-dark);
  text-transform:uppercase;
  letter-spacing:0.3px;
  margin-bottom:8px;
}
.article-card h3{
  font-size:1.05rem;
  font-family:var(--font-serif);
  color:var(--heading);
  margin-bottom:8px;
  line-height:1.35;
  font-weight:600;
  letter-spacing:-.005em;
}
.article-card h3 a{
  color:var(--heading);
  text-decoration:none;
}
.article-card h3 a:hover{color:var(--heading-warm)}
.article-card p{
  font-size:0.88rem;
  color:var(--text-light);
  margin-bottom:10px;
  line-height:1.65;
}
.article-card .article-meta{
  font-size:0.75rem;
  color:var(--text-muted);
  letter-spacing:.01em;
}
@media(min-width:768px){
  .articles-grid{grid-template-columns:repeat(2,1fr);gap:20px}
}
@media(min-width:1024px){
  .articles-grid{grid-template-columns:repeat(3,1fr);gap:24px}
}
@media(max-width:767px){
  .article-card{padding:18px}
  .article-card h3{font-size:1rem}
  .article-card p{font-size:0.84rem}
}
.hub-link-list{list-style:none;padding:0;margin:0 0 8px}
.hub-link-list li{margin:0 0 10px;padding:0}
.hub-link-list a{
  display:flex;
  flex-direction:column;
  gap:3px;
  padding:14px 16px;
  background:#fff;
  border:1px solid var(--border);
  border-radius:12px;
  text-decoration:none;
  color:var(--text);
  transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;
}
.hub-link-list a:hover{
  transform:translateY(-1px);
  border-color:var(--rose);
  box-shadow:0 4px 14px rgba(61,44,42,.06);
  text-decoration:none;
}
.hub-link-list a strong{
  color:var(--heading-warm);
  font-weight:600;
  font-size:.98rem;
  line-height:1.4;
}
.hub-link-list a span{
  color:var(--text-muted);
  font-size:.85rem;
  line-height:1.5;
}

/* ===== FAQ ===== */
.faq-section{
  margin-top:48px;
  padding-top:24px;
  border-top:1px solid var(--sand);
}
.faq-section h2{
  font-family:var(--font-serif);
  color:var(--heading-warm);
  font-size:1.3rem;
  margin:0 0 16px;
  font-weight:600;
}
.faq-item{
  background:#fff;
  border:1px solid var(--border);
  border-radius:12px;
  padding:14px 18px;
  margin-bottom:10px;
  transition:border-color .2s ease,box-shadow .2s ease;
}
.faq-item[open]{border-color:var(--rose-light);box-shadow:0 2px 10px rgba(61,44,42,.04)}
.faq-item summary{
  font-weight:600;
  color:var(--heading-warm);
  cursor:pointer;
  list-style:none;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  font-size:.98rem;
  line-height:1.5;
  padding:2px 0;
}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{
  content:'+';
  color:var(--rose-dark);
  font-size:1.2rem;
  font-weight:400;
  transition:transform .2s ease;
  flex-shrink:0;
  width:18px;
  text-align:center;
}
.faq-item[open] summary::after{content:'\u2212'}
.faq-answer{
  margin:10px 0 0;
  color:var(--text);
  line-height:1.7;
  font-size:.95rem;
}

/* ===== Disclaimer ===== */
.disclaimer{
  background:#fff5e6;
  border-left:4px solid #d4a76a;
  padding:14px 18px;
  margin:24px 0;
  border-radius:0 8px 8px 0;
  font-size:.92rem;
  line-height:1.6;
  color:var(--text);
}
.disclaimer p{margin:0}
.disclaimer strong{color:var(--heading-warm)}

/* ===== Reviewed by ===== */
.reviewed-by{
  background:rgba(220,180,165,.08);
  border:1px solid var(--rose-light);
  border-radius:10px;
  padding:12px 16px;
  margin:24px 0;
  font-size:.88rem;
  color:var(--text-light);
  line-height:1.6;
}
.reviewed-by strong{color:var(--heading-warm)}

/* ===== Related section ===== */
.related-section{
  margin-top:48px;
  padding-top:24px;
  border-top:1px solid var(--sand);
}
.related-section h2{
  font-family:var(--font-serif);
  color:var(--heading-warm);
  font-size:1.3rem;
  margin:0 0 16px;
  font-weight:600;
}
.related-grid{
  list-style:none;
  padding:0;
  margin:0 0 20px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:12px;
}
.related-grid li{margin:0;padding:0}
.related-grid a{
  display:flex;
  flex-direction:column;
  gap:4px;
  padding:14px 16px;
  background:#fff;
  border:1px solid var(--border);
  border-radius:12px;
  text-decoration:none;
  color:var(--text);
  transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;
  height:100%;
  box-sizing:border-box;
}
.related-grid a:hover{
  transform:translateY(-1px);
  border-color:var(--rose);
  box-shadow:0 4px 14px rgba(61,44,42,.06);
  text-decoration:none;
}
.related-grid a h3{
  font-family:var(--font-serif);
  font-size:1rem;
  color:var(--heading-warm);
  margin:0;
  line-height:1.35;
  font-weight:600;
}
.related-grid a p{
  font-size:.85rem;
  color:var(--text-muted);
  margin:0;
  line-height:1.5;
}
.back-to-hub{
  display:inline-block;
  margin-top:8px;
  font-size:.9rem;
  color:var(--heading-warm);
  text-decoration:underline;
  text-decoration-color:var(--rose-light);
  text-underline-offset:3px;
}
.back-to-hub:hover{color:var(--rose-dark);text-decoration-color:var(--rose-dark)}

/* ===== Back-to-top button visibility ===== */
#footerBackToTop.scrolled{opacity:1;pointer-events:auto}

/* ===== Mobile responsive tweaks ===== */
@media (max-width:640px){
  .wellness-article{padding:28px 16px 48px}
  .wellness-article h2{font-size:1.18rem;margin-top:32px}
  .wellness-article h3{font-size:1rem}
  .wellness-article p{font-size:.96rem;line-height:1.75}
  .wellness-article li{font-size:.92rem}
  .hub-hero{padding:50px 16px 32px}
  .hub-hero h1{font-size:1.85rem;line-height:1.2}
  .hub-hero .subtitle{font-size:.95rem}
  .article-hero{padding:42px 14px 26px}
  .article-hero h1{font-size:1.7rem}
  .hub-section-head h2{font-size:1.18rem}
  .hub-link-list a{padding:12px 14px}
  .hub-link-list a strong{font-size:.95rem}
  .related-grid{grid-template-columns:1fr;gap:10px}
  .faq-item{padding:12px 14px}
  .faq-item summary{font-size:.93rem}
  .faq-answer{font-size:.9rem}
  .disclaimer{padding:12px 14px;font-size:.88rem}
  .reviewed-by{padding:10px 14px;font-size:.85rem}
}
@media (max-width:380px){
  .hub-hero h1{font-size:1.6rem}
  .article-hero h1{font-size:1.45rem}
  .wellness-article{padding:24px 14px 40px}
}
</style>`;

const HEAD_TAIL = `<script src="https://cdn.tailwindcss.com/3.4.17"></script><script>tailwind.config={corePlugins:{preflight:false},theme:{extend:{colors:{brand:{bg:'#fdf8f5',text:'#8b7355',hover:'#6b5344',border:'#e8ddd0',highlight:'#7a6455'}}}}}</script><link rel="stylesheet" href="/style.css?v=5d9d59d0"/><link rel="stylesheet" href="/tailwind-built.css"/><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7388117485013143" crossorigin="anonymous"></script><script src="/script.js?v=dea173b4" defer></script>`;

function headFor({ title, description, ogTitle, canonical, ogDesc, keywords }) {
  return `<!DOCTYPE html><html lang="en"><head>${HEAD_COMMON}<title>${title}</title><meta name="description" content="${description}"/><meta name="robots" content="index,follow"/>${keywords ? `<meta name="keywords" content="${keywords}"/>` : ''}<meta property="og:title" content="${ogTitle}"/><meta property="og:image" content="https://breastcalculator.com/images/og-default.jpg"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:url" content="${canonical}"/><meta property="og:site_name" content="Breast Calculator"/><meta property="og:description" content="${ogDesc || description}"/><meta property="og:type" content="article"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${ogTitle}"/><meta name="twitter:description" content="${ogDesc || description}"/><meta name="twitter:image" content="https://breastcalculator.com/images/og-default.jpg"/>${HEAD_STYLE}${HEAD_TAIL}<link rel="canonical" href="${canonical}"/><link rel="alternate" hreflang="en" href="${canonical}"/><link rel="alternate" hreflang="x-default" href="${canonical}"/></head>`;
}

function breadcrumb(items) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items })}</script>`;
}

function breadcrumbItems(slug, name) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://breastcalculator.com/' }];
  if (slug) {
    items.push({ '@type': 'ListItem', position: 2, name: 'Wellness & Recovery', item: 'https://breastcalculator.com/wellness/' });
    items.push({ '@type': 'ListItem', position: 3, name, item: `https://breastcalculator.com/wellness/${slug}/` });
  } else {
    items.push({ '@type': 'ListItem', position: 2, name: 'Wellness & Recovery', item: 'https://breastcalculator.com/wellness/' });
  }
  return items;
}

function articleSchema({ slug, title, description, ogTitle, author, publishedDate, updatedDate }) {
  const pubDate = publishedDate ? `${publishedDate}T00:00:00Z` : '2026-06-10T00:00:00Z';
  const modDate = updatedDate ? `${updatedDate}T00:00:00Z` : pubDate;
  const authorObj = author && author.name
    ? { '@type': 'Person', name: author.name, description: author.credentials ? `${author.name}, ${author.credentials}` : undefined }
    : { '@type': 'Organization', name: 'Breast Calculator Team' };
  if (authorObj.description === undefined) delete authorObj.description;
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: ogTitle.replace(/&mdash;/g, '-').replace(/&amp;/g, '&'), description, url: `https://breastcalculator.com/wellness/${slug}/`, image: 'https://breastcalculator.com/images/og-default.jpg', datePublished: pubDate, dateModified: modDate, author: authorObj, publisher: { '@type': 'Organization', name: 'Breast Calculator', logo: { '@type': 'ImageObject', url: 'https://breastcalculator.com/favicon.svg' } } })}</script>`;
}

function collectionSchema({ description, name }) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name, description, url: 'https://breastcalculator.com/wellness/', isPartOf: { '@type': 'WebSite', name: 'Breast Calculator', url: 'https://breastcalculator.com/' } })}</script>`;
}

function faqSchema(qa) {
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}</script>`;
}

const DISC = `<aside class="disclaimer" role="note" aria-label="Medical disclaimer"><p><strong>Medical Disclaimer:</strong> This article is for general educational purposes only and does not constitute medical advice. Recovery timelines, bra recommendations, and post-surgical care vary by individual procedure, healing response, and surgeon guidance. Always follow the specific instructions provided by your surgical team and consult a qualified healthcare provider before changing bras, compression levels, or post-operative routines.</p></aside>`;

function faqHtml(qa) {
  return `<section class="faq-section" aria-labelledby="faqTitle"><h2 id="faqTitle">Frequently Asked Questions</h2>${qa.map(({ q, a }) => `<details class="faq-item"><summary>${q}</summary><p class="faq-answer">${a}</p></details>`).join('')}</section>`;
}

function relatedHtml(slugs) {
  return `<section class="related-section" aria-labelledby="relatedTitle"><h2 id="relatedTitle">Related Wellness Articles</h2><ul class="related-grid">${slugs.map(({ slug, title, blurb }) => `<li><a href="/wellness/${slug}/"><h3>${title}</h3><p>${blurb}</p></a></li>`).join('')}</ul><a class="back-to-hub" href="/wellness/">&larr; Back to the Wellness &amp; Recovery Hub</a></section>`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function bylineHtml({ author, publishedDate, updatedDate, readingTime }) {
  if (!author && !publishedDate && !readingTime) return '';
  const parts = [];
  if (author && author.name) {
    const cred = author.credentials ? `, ${author.credentials}` : '';
    parts.push(`<span class="byline-author">Reviewed by <strong>${author.name}</strong>${cred}</span>`);
  }
  if (publishedDate && updatedDate && updatedDate !== publishedDate) {
    parts.push(`<span class="byline-date">Updated ${formatDate(updatedDate)}</span>`);
  } else if (publishedDate) {
    parts.push(`<span class="byline-date">${formatDate(publishedDate)}</span>`);
  }
  if (readingTime) {
    parts.push(`<span class="byline-readtime">${readingTime} min read</span>`);
  }
  return `<div class="article-byline">${parts.join(' <span class="byline-sep">&middot;</span> ')}</div>`;
}

function heroHtml({ h1, subtitle, isHub, byline }) {
  const cls = isHub ? 'hub-hero' : 'article-hero';
  return `<header class="${cls}"><div class="container"><h1>${h1}</h1>${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}${byline || ''}</div></header>`;
}

function page({ slug, title, description, ogTitle, h1, intro, body, faq, related, isHub, schemaType = 'Article', author, publishedDate, updatedDate, readingTime }) {
  const canonical = slug ? `https://breastcalculator.com/wellness/${slug}/` : 'https://breastcalculator.com/wellness/';
  const keywords = isHub ? 'breast health, breast wellness, bra fit, bra comfort, sports bra, breast volume, ptosis, post-surgery bra, mastectomy bra, recovery timeline' : `${title.toLowerCase().split(' ').slice(0, 8).join(' ')}, breast surgery recovery, post-surgery bra`;
  const head = headFor({ title, description, ogTitle, canonical, keywords });
  const bcScript = breadcrumb(breadcrumbItems(slug, h1.replace(/&amp;/g, '&')));
  const extraScript = isHub ? collectionSchema({ description, name: 'Breast Health & Wellness Hub' }) : articleSchema({ slug, title, description, ogTitle, author, publishedDate, updatedDate });
  const faqScript = faq && faq.length ? faqSchema(faq) : '';
  const byline = isHub ? '' : bylineHtml({ author, publishedDate, updatedDate, readingTime });
  const hero = heroHtml({ h1, subtitle: intro, isHub, byline });
  const articleContent = isHub
    ? `<main><div class="container"><article class="wellness-article">${body}${faq && faq.length ? faqHtml(faq) : ''}${relatedHtml(related)}</article></div></main>`
    : `<main><div class="container"><article class="wellness-article">${DISC}${body.replace(/<h2 /g, '<h2 ')}${faq && faq.length ? faqHtml(faq) : ''}${relatedHtml(related)}</article></div></main>`;
  return head + bcScript + extraScript + faqScript + '<body>' + NAV + CHROME + hero + articleContent + FOOTER + SCRIPTS + '</body></html>';
}

// Generate HUB first
if (HUB) {
  fs.mkdirSync(W, { recursive: true });
  const hubHtml = page({
    slug: '',
    title: HUB.title,
    description: HUB.description,
    ogTitle: HUB.ogTitle,
    h1: HUB.h1,
    intro: HUB.intro,
    body: HUB.body || '',
    faq: HUB.faq || [],
    related: HUB.related || [],
    isHub: true,
    schemaType: 'CollectionPage'
  });
  fs.writeFileSync(path.join(W, 'index.html'), hubHtml, 'utf8');
  console.log(`[OK] /wellness/index.html (HUB, ${hubHtml.length} bytes)`);
}

// Generate all 12 articles
let count = 0;
for (const a of ARTICLES || []) {
  const dir = path.join(W, a.dir);
  fs.mkdirSync(dir, { recursive: true });
  const html = page({ ...a, isHub: false });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  count++;
  console.log(`[OK] /wellness/${a.dir}/index.html (${a.title.length} chars title, ${html.length} bytes)`);
}

console.log(`\nTotal: ${count} articles + 1 HUB generated`);
