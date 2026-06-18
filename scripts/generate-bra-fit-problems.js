// generate-bra-fit-problems.js — generate 5 article pages for the bra fit problem series
const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const TEMPLATE_PATH = path.join(ROOT, 'article/bra-sister-sizes-explained/index.html');
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Series overview (Series Overview: 5 Articles, 20 Bra Fit Problems)
const SERIES_OVERVIEW = `
<section class="hero" style="padding:48px 24px;text-align:center;background:linear-gradient(135deg,#fdf6ef,#f9ece1);border-bottom:1px solid var(--border)">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:inline-block;background:var(--rose-light);color:#5b4636;font-size:0.78rem;font-weight:700;padding:6px 14px;border-radius:50px;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:14px">5-Article Series</div>
    <h1 style="font-size:clamp(1.9rem,4vw,2.6rem);line-height:1.2;margin-bottom:14px;color:var(--heading)">20 Bra Fit Problems — A Complete Diagnostic Series</h1>
    <p style="font-size:1.05rem;color:var(--text-light);max-width:680px;margin:0 auto;line-height:1.6">Straps, cups, band, underwire, and special cases — five articles that cover every common fit problem, with the root cause and the core fix for each.</p>
  </div>
</section>
<article class="article" style="max-width:780px;margin:0 auto;padding:32px 24px">
  <h2>Series Overview</h2>
  <p>This series organizes the 20 most common bra fit problems into 5 articles. Each problem is mapped to a part of the bra (straps, cups, band, underwire &amp; gore) or to a special situation (asymmetry, period, brands). For every issue we identify the root cause, list secondary causes, and give a small set of core fixes that actually work.</p>
  <table class="data-table" style="width:100%;border-collapse:collapse;margin:20px 0">
    <thead>
      <tr style="background:var(--cream)">
        <th style="text-align:left;padding:10px;border:1px solid var(--border);width:80px">Article</th>
        <th style="text-align:left;padding:10px;border:1px solid var(--border)">Focus</th>
        <th style="text-align:left;padding:10px;border:1px solid var(--border)">Problems Covered</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px;border:1px solid var(--border)">1</td>
        <td style="padding:10px;border:1px solid var(--border)"><a href="/article/straps-bra-fit-problems/">Straps</a></td>
        <td style="padding:10px;border:1px solid var(--border)">#01 Slipping &middot; #02 Digging &middot; #20 Neck/Shoulder Pain</td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid var(--border)">2</td>
        <td style="padding:10px;border:1px solid var(--border)"><a href="/article/cups-bra-fit-problems/">Cups</a></td>
        <td style="padding:10px;border:1px solid var(--border)">#04 Gaping &middot; #05 Quad-boob &middot; #06 Side Spillage &middot; #14 Falling Out</td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid var(--border)">3</td>
        <td style="padding:10px;border:1px solid var(--border)"><a href="/article/band-bra-fit-problems/">Band</a></td>
        <td style="padding:10px;border:1px solid var(--border)">#03 Riding Up &middot; #16 Lifting with Arms &middot; #10 Back Bulge &middot; #19 Clasp Failure</td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid var(--border)">4</td>
        <td style="padding:10px;border:1px solid var(--border)"><a href="/article/underwire-gore-bra-fit-problems/">Underwire &amp; Gore</a></td>
        <td style="padding:10px;border:1px solid var(--border)">#07 Digging &middot; #12 Cutting Underside &middot; #08 Floating Gore &middot; #13 Uniboob</td>
      </tr>
      <tr>
        <td style="padding:10px;border:1px solid var(--border)">5</td>
        <td style="padding:10px;border:1px solid var(--border)"><a href="/article/special-bra-fit-problems/">Special Cases</a></td>
        <td style="padding:10px;border:1px solid var(--border)">#09 Asymmetry &middot; #11 Sagging &middot; #15 Period Pain &middot; #17 Brand Variation &middot; #18 Visible Lines</td>
      </tr>
    </tbody>
  </table>
  <p style="background:var(--color-primary-light);border:1px solid var(--color-border);border-radius:var(--radius);padding:18px 22px;margin:24px 0">Use the table above to jump directly to the section that matches your problem. If you are not sure where to start, the most common "hidden" cause is the band — read <a href="/article/band-bra-fit-problems/">Article 3</a> first.</p>
</article>
`;

const ARTICLES = [
  {
    slug: 'straps-bra-fit-problems',
    title: 'Bra Strap Problems — Slipping, Digging & Neck Pain | Fix Guide',
    description: 'Straps hurt or slip? The real culprit is usually the band. Learn the root cause and the fix for slipping, digging, and chronic shoulder pain.',
    h1: 'Article 1 — Straps: The Real Culprit Is Usually the Band',
    lead: 'Straps are designed to carry only 10–20% of breast weight. When they hurt or slip, the band is almost always at fault.',
    body: `
<h2>1.1 Straps Constantly Falling Off (#01)</h2>
<p><strong>Root cause:</strong> Cups too large → no tension to anchor the strap against the shoulder.</p>
<p><strong>Secondary causes:</strong> Narrow or sloping shoulders; wide-set strap placement.</p>
<p><strong>Core fixes:</strong> Try one cup size smaller. If still slipping, switch to a racerback, J-hook, or centre-pull style.</p>

<h2>1.2 Straps Digging Into Shoulders / Red Grooves (#02)</h2>
<p><strong>Root cause:</strong> Band too loose → straps carry almost all breast weight.</p>
<p><strong>Other causes:</strong> Straps too narrow for breast volume; worn-out elastic.</p>
<p><strong>Core fixes:</strong> Go down a band size (sister-size up in the cup). Choose wider, cushioned straps or longline styles.</p>

<h2>1.3 Chronic Shoulder, Neck &amp; Upper Back Pain (#20)</h2>
<p><strong>Root cause:</strong> Same as above — straps overloaded, shoulder muscles chronically compensate.</p>
<p><strong>Core fixes:</strong> Correct band size (tighter) + wider straps + proper cup volume. If pain radiates or causes numbness, seek medical advice.</p>

<div style="background:var(--color-primary-light);border:1px solid var(--color-border);border-radius:var(--radius);padding:20px 24px;margin:28px 0"><strong>Bottom line:</strong> Solve strap problems by fixing the band first, not by tightening straps. See <a href="/article/band-bra-fit-problems/">Article 3 — The Band: Your Real Foundation</a>.</div>
`,
    tag: 'Bra Fitting Guide',
    readTime: '4 min read',
    next: { slug: 'cups-bra-fit-problems', title: 'Article 2 — Cups' }
  },
  {
    slug: 'cups-bra-fit-problems',
    title: 'Bra Cup Problems — Gaping, Quad-Boob, Spillage | Fix Guide',
    description: 'Gaping, quad-boob, side spillage, falling out? Cup problems are about matching volume and shape to the right cut. Learn the root cause and fix.',
    h1: 'Article 2 — Cups: Size, Shape, and Spillage',
    lead: 'Most cup problems come from wrong volume or wrong shape for your breast type.',
    body: `
<h2>2.1 Gaping, Wrinkled, or Collapsed Cups (#04)</h2>
<p><strong>Root causes:</strong> Cup volume > actual tissue; breast shape is full-on-bottom or teardrop; closed upper cup.</p>
<p><strong>Core fixes:</strong> Try one cup size smaller. Switch to a balconette, demi, or half-cup style. Molded T-shirt bras work well for shallow shapes.</p>

<h2>2.2 Quad-Boob / Top Spillage (#05)</h2>
<p><strong>Root cause:</strong> Cup too small (most common). Also temporary hormonal swelling.</p>
<p><strong>Core fixes:</strong> Go up one or two cup sizes. Choose seamed or full-coverage styles that encapsulate rather than compress. Keep a larger wireless bra for period days.</p>

<h2>2.3 Side Spillage / Armpit Bulge (#06)</h2>
<p><strong>Root cause:</strong> Cup too narrow → breast tissue pushed sideways. Weak side wings.</p>
<p><strong>Core fixes:</strong> Go up one cup. Look for "high-wing" or "side-support" construction. Always scoop and swoop when putting on a bra.</p>

<h2>2.4 Falling Out When Leaning Forward (#14)</h2>
<p><strong>Root cause:</strong> Cups too shallow, too small, or wrong shape.</p>
<p><strong>Core fixes:</strong> Go up one cup and choose full-coverage or balconette with strong side panels. For projected breasts, look for deeper cup styles.</p>

<div style="background:var(--color-primary-light);border:1px solid var(--color-border);border-radius:var(--radius);padding:20px 24px;margin:28px 0"><strong>Bottom line:</strong> Cup problems are rarely about "being too big" or "too small" — they are about matching your breast volume and shape to the right cut. Continue to <a href="/article/band-bra-fit-problems/">Article 3 — The Band</a>.</div>
`,
    tag: 'Bra Fitting Guide',
    readTime: '5 min read',
    next: { slug: 'band-bra-fit-problems', title: 'Article 3 — The Band' }
  },
  {
    slug: 'band-bra-fit-problems',
    title: 'Bra Band Problems — Riding Up, Back Bulge, Clasp Failure | Fix Guide',
    description: 'Band rides up, lifts with arms, shows back bulge, or the clasp pops open? The band carries 80–90% of support. Learn how to fix the foundation.',
    h1: 'Article 3 — The Band: Your Real Foundation',
    lead: 'The band provides 80–90% of all support. If it fails, everything else fails.',
    body: `
<h2>3.1 Band Riding Up the Back (#03)</h2>
<p><strong>Root cause:</strong> Band too loose — cannot stay horizontal.</p>
<p><strong>Core fixes:</strong> Go down one band size (sister-size up in the cup). New bras must be worn on the loosest hook. Retire bras that are already on the tightest hook.</p>

<h2>3.2 Bra Rises When Raising Arms (#16)</h2>
<p><strong>Root cause:</strong> Band too loose; insufficient back anchorage.</p>
<p><strong>Core fixes:</strong> Size down in the band. Longline styles provide more stability. Always do the "lift test" — the band must not move when you raise both arms.</p>

<h2>3.3 Back Bulge That Appears Only with a Bra (#10)</h2>
<p><strong>Root cause:</strong> Narrow, tight band pushes soft back tissue upward/outward — it is displacement, not fat.</p>
<p><strong>Core fixes:</strong> Choose wider, taller back panels with smooth fabrics. Longline or leotard-back designs reduce bulging.</p>

<h2>3.4 Clasp Keeps Coming Undone (#19)</h2>
<p><strong>Root cause:</strong> Band too loose → clasp fights constant tension and warps open.</p>
<p><strong>Core fixes:</strong> Size down in the band. Always fasten clasps before washing, use a lingerie bag, or hand-wash to protect hooks.</p>

<div style="background:var(--color-primary-light);border:1px solid var(--color-border);border-radius:var(--radius);padding:20px 24px;margin:28px 0"><strong>Bottom line:</strong> A properly fitted band stays level all day, never moves when you lift your arms, and carries almost all the weight — leaving straps to do only light work. Continue to <a href="/article/underwire-gore-bra-fit-problems/">Article 4 — Underwire &amp; Center Gore</a>.</div>
`,
    tag: 'Bra Fitting Guide',
    readTime: '5 min read',
    next: { slug: 'underwire-gore-bra-fit-problems', title: 'Article 4 — Underwire & Gore' }
  },
  {
    slug: 'underwire-gore-bra-fit-problems',
    title: 'Underwire & Center Gore Pain — Digging, Floating, Uniboob | Fix Guide',
    description: 'Underwire digging in, cutting the underside, floating gore, or uniboob in sports bras? Underwire pain is never normal. Learn what it tells you.',
    h1: 'Article 4 — Underwire & Center Gore: Pain Signals',
    lead: 'Underwire pain is never normal. It always tells you something about size or shape.',
    body: `
<h2>4.1 Underwire Digging Into Ribcage or Armpit (#07)</h2>
<p><strong>Root cause:</strong> Cup too small — wire sits on breast tissue, not on the chest wall. Wire too narrow for breast root.</p>
<p><strong>Core fixes:</strong> Go up 1–2 cup sizes so the wire drops into the inframammary fold. Try brands with wider wires. If no underwire feels comfortable, switch to wireless.</p>

<h2>4.2 Underwire Cutting the Underside of the Breast (#12)</h2>
<p><strong>Root cause:</strong> Cup too small → wire cannot reach the natural crease. Or band too tight → pulling wire upward.</p>
<p><strong>Core fixes:</strong> Go up one cup size. Check that the wire rests exactly in the inframammary fold after scooping.</p>

<h2>4.3 Center Gore Floating Off the Sternum (#08)</h2>
<p><strong>Root causes:</strong> Cup too small (pulling gore forward) or band too loose (weak anchor). Close-set breasts can also push the gore up.</p>
<p><strong>Core fixes:</strong> Go up one cup first (works in ~70% of cases). If not, go down a band. For close-set breasts, switch to plunge or low-gore styles.</p>

<h2>4.4 Uniboob / Monoboob in Sports Bras (#13)</h2>
<p><strong>Root cause:</strong> Compression-only bras squash both breasts together.</p>
<p><strong>Core fixes:</strong> Switch to encapsulation sports bras (individual cups). For C/D+ cup sizes, choose underwired encapsulation. Combination (compression + encapsulation) styles are best for high-impact activity.</p>

<div style="background:var(--color-primary-light);border:1px solid var(--color-border);border-radius:var(--radius);padding:20px 24px;margin:28px 0"><strong>Bottom line:</strong> Underwire should never hurt. If it does, the cup is too small, the wire is too narrow, or the band is too loose — fix those, and the pain disappears. Continue to <a href="/article/special-bra-fit-problems/">Article 5 — Special Cases</a>.</div>
`,
    tag: 'Bra Fitting Guide',
    readTime: '5 min read',
    next: { slug: 'special-bra-fit-problems', title: 'Article 5 — Special Cases' }
  },
  {
    slug: 'special-bra-fit-problems',
    title: 'Bra Fit Special Cases — Asymmetry, Sagging, Period, Brands | Fix Guide',
    description: 'Asymmetry, sagging, period pain, brand variation, and visible lines — fit issues that are not about a single size number. How to handle them.',
    h1: 'Article 5 — Special Situations: Asymmetry, Period, Brands, and More',
    lead: 'Some fit issues are not about a single size — they are about your body, your cycle, or your wardrobe.',
    body: `
<h2>5.1 Asymmetric Breasts (#09)</h2>
<p><strong>Root cause:</strong> Most women have at least a small (5–10%) difference between breasts. When the gap is larger, the larger breast often dictates the cup size.</p>
<p><strong>Core fixes:</strong> Fit to the larger breast, then use a removable pad or silicone enhancer in the smaller side. Some brands sell bras in "cup-mismatched" sizes (e.g. 34C/D) — worth trying for visible asymmetry.</p>

<h2>5.2 Sagging / Pendulous Shape (#11)</h2>
<p><strong>Root cause:</strong> Loss of skin elasticity from aging, pregnancy, weight loss, or genetics. Sagging is not a fit failure — it is anatomy.</p>
<p><strong>Core fixes:</strong> Choose a bra with strong side support and a firm band to lift tissue back into the cup. Full-coverage styles and seamed cups reshape better than molded T-shirt bras. The lift test still applies.</p>

<h2>5.3 Period &amp; Hormonal Swelling (#15)</h2>
<p><strong>Root cause:</strong> Cyclical water retention can add up to one full cup size for 3–5 days per cycle. Wearing a fixed cup the whole month guarantees discomfort for part of it.</p>
<p><strong>Core fixes:</strong> Keep a "period bra" one cup size larger with a stretch lace cup. Soft wireless styles in modal or cotton are ideal for the high-sensitivity days.</p>

<h2>5.4 Brand-to-Brand Size Variation (#17)</h2>
<p><strong>Root cause:</strong> No enforced standard. A "34C" in one brand can be a "32D" in another — cup volume is consistent only within a brand family.</p>
<p><strong>Core fixes:</strong> Always re-measure when switching brands. Use the brand's own size chart rather than trusting the size label. Keep a small "fit journal" (3 lines per bra) — what worked, what didn't, what to try next time.</p>

<h2>5.5 Visible Lines Under Clothing (#18)</h2>
<p><strong>Root cause:</strong> Cup seams, lace edges, embroidery, and contrast trims show through thin fabric. A perfect fit can still look "off" if the fabric is wrong.</p>
<p><strong>Core fixes:</strong> Choose seamless, laser-cut, or bonded cups for thin knits. Match nude undergarments to your skin tone rather than to the outer garment. Use a smoothing camisole under sheer tops.</p>

<div style="background:var(--color-primary-light);border:1px solid var(--color-border);border-radius:var(--radius);padding:20px 24px;margin:28px 0"><strong>Bottom line:</strong> A bra that fits is not only a number — it is a match between your body, your cycle, your wardrobe, and the brand. Re-fit every 6–12 months and after any major life change (pregnancy, weight change, surgery). Use our <a href="/bra-size-calculator/">bra size calculator</a> as a starting point, then verify the fit with the <a href="/article/how-to-tell-if-bra-fits/">5-sign fit test</a>.</div>
`,
    tag: 'Bra Fitting Guide',
    readTime: '6 min read',
    next: null
  }
];

function buildArticle(article) {
  // Build full HTML by replacing the parts of the template
  const url = `https://breastcalculator.com/article/${article.slug}/`;

  // Hero + Lead + Body
  const heroAndBody = `
<section class="hero" style="padding:48px 24px;text-align:center;background:linear-gradient(135deg,#fdf6ef,#f9ece1);border-bottom:1px solid var(--border)">
  <div style="max-width:780px;margin:0 auto">
    <div style="display:inline-block;background:var(--rose-light);color:#5b4636;font-size:0.78rem;font-weight:700;padding:6px 14px;border-radius:50px;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:14px">${article.tag}</div>
    <h1 style="font-size:clamp(1.9rem,4vw,2.5rem);line-height:1.25;margin-bottom:14px;color:var(--heading)">${article.h1}</h1>
    <p style="font-size:1.02rem;color:var(--text-light);max-width:680px;margin:0 auto;line-height:1.6">${article.lead}</p>
  </div>
</section>
<article class="article" style="max-width:780px;margin:0 auto;padding:32px 24px">
  ${article.body}
  ${article.next ? `<div style="margin-top:32px;padding:18px 22px;border:1px solid var(--border);border-radius:var(--radius);background:var(--cream)"><strong>Next in the series:</strong> <a href="/article/${article.next.slug}/">${article.next.title}</a></div>` : `<div style="margin-top:32px;padding:18px 22px;border:1px solid var(--border);border-radius:var(--radius);background:var(--cream)"><strong>End of series.</strong> Return to the <a href="/articles/">All Articles</a> hub for more guides, or run the <a href="/bra-size-calculator/">bra size calculator</a> as a starting point.</div>`}
</article>
`;

  // Build new HTML: replace from <section class="hero"> to </article> with heroAndBody
  let html = template;
  // Find the existing hero section
  const heroStart = html.indexOf('<section class="hero">');
  if (heroStart === -1) throw new Error('Hero section not found in template');
  // Find the closing </article> tag of the main content
  const articleEnd = html.indexOf('</article>', heroStart);
  if (articleEnd === -1) throw new Error('Article end not found in template');
  const endIdx = articleEnd + '</article>'.length;
  html = html.substring(0, heroStart) + heroAndBody + html.substring(endIdx);

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${article.title}</title>`);
  // Replace description
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${article.description}"`);
  // Replace canonical
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  // Replace og:url
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  // Replace og:title
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${article.title}"`);
  // Replace og:description
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${article.description}"`);
  // Replace twitter:title
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${article.title}"`);
  // Replace twitter:description
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${article.description}"`);
  // Replace Article schema (JSON-LD)
  const articleSchema = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${article.h1.replace(/&/g, '&amp;').replace(/"/g, '\\"')}","description":"${article.description.replace(/"/g, '\\"')}","image":"https://breastcalculator.com/images/og-default.jpg","datePublished":"2026-06-17T08:00:00Z","dateModified":"2026-06-17T08:00:00Z","author":{"@type":"Person","name":"Breast Calculator Team"},"publisher":{"@type":"Organization","name":"Breast Calculator","logo":{"@type":"ImageObject","url":"https://breastcalculator.com/favicon.svg"}}}</script>`;
  html = html.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"Article"[\s\S]*?}<\/script>/, articleSchema);
  // Replace BreadcrumbList schema
  const breadcrumbSchema = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://breastcalculator.com/"},{"@type":"ListItem","position":2,"name":"Articles","item":"https://breastcalculator.com/articles/"},{"@type":"ListItem","position":3,"name":"${article.h1.replace(/&/g, '&amp;').replace(/"/g, '\\"')}","item":"${url}"}]}</script>`;
  html = html.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList"[\s\S]*?}<\/script>/, breadcrumbSchema);

  return html;
}

let count = 0;
for (const article of ARTICLES) {
  const html = buildArticle(article);
  const dir = path.join(ROOT, 'article', article.slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('Created: article/' + article.slug + '/index.html (' + html.length + ' bytes)');
  count++;
}
console.log('\nTotal: ' + count + ' articles created');
