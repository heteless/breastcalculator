// _replace-head-style.js — replace the HEAD_STYLE constant in gen-wellness.js
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'gen-wellness.js');
let content = fs.readFileSync(FILE, 'utf8');

const NEW_HEAD_STYLE = `const HEAD_STYLE = \`<style>
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
.faq-item[open] summary::after{content:'\\u2212'}
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
</style>\`;`;

// Find and replace the HEAD_STYLE line
const re = /const HEAD_STYLE = `[\s\S]*?`;/;
const match = content.match(re);
if (!match) {
  console.error('HEAD_STYLE not found');
  process.exit(1);
}
const updated = content.replace(re, NEW_HEAD_STYLE);
fs.writeFileSync(FILE, updated, 'utf8');
console.log('HEAD_STYLE updated. Old length:', match[0].length, 'New length:', NEW_HEAD_STYLE.length);
