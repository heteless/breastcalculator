#!/usr/bin/env node
/* ==========================================================================
   gen-size-page.js — 尺码指南页面生成器
   --------------------------------------------------------------------------
   读取 bra-size-guide/38c/index.html 作为模板,根据 size 数据 (band, cup)
   替换 size-specific 字段,输出到 bra-size-guide/{band}{cup_toLower()}/index.html

   用法:
     node scripts/gen-size-page.js                    # 生成所有 51 个缺失尺码
     node scripts/gen-size-page.js --band 28 --cup AA # 生成单个尺码
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = 'd:/DevProject/breastcalculator';
const TEMPLATE = path.join(ROOT, 'bra-size-guide/38c/index.html');
const OUTPUT_DIR = path.join(ROOT, 'bra-size-guide');

/* ──────────────────────────────────────────────────────────
   1. 数据表 — Cup volumes, conversions, ranges
   ────────────────────────────────────────────────────────── */
const CUP_VOLUME_ML = {
  'AA': 110, 'A': 175, 'B': 270, 'C': 380, 'D': 510,
  'DD': 660, 'DDD': 820, 'G': 990
};

const CUP_INDEX = { 'AA': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'DD': 5, 'DDD': 6, 'G': 7 };
const CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G'];

/* ──────────────────────────────────────────────────────────
   2. Size category — petite / slim / average / curvy / full-bust / plus-size
   ────────────────────────────────────────────────────────── */
function getCategory(band, cup) {
  const cupIdx = CUP_INDEX[cup];

  /* 1. Plus-size — band 42-44 always plus-size; 40 with D+ cups is plus-size */
  if (band >= 42) return 'plus-size';
  if (band === 40 && cupIdx >= 4) return 'plus-size';

  /* 2. Full-bust — large cups on large bands (36-40 + DDD-G) */
  if (band >= 36 && band <= 40 && cupIdx >= 6) return 'full-bust';
  if (band === 38 && cupIdx === 5) return 'full-bust';
  if (band === 40 && cupIdx === 5) return 'full-bust';

  /* 3. Curvy — large cup on small-medium band, OR large band + DD */
  if (band >= 32 && band <= 36 && cupIdx >= 6) return 'curvy';
  if (band >= 30 && band <= 32 && cupIdx >= 6) return 'curvy';
  if (band >= 36 && band <= 40 && cupIdx === 5) return 'curvy';

  /* 4. Average — 32-36 with A-DD (smaller cup on average frame) */
  if (band >= 32 && band <= 36 && cupIdx >= 1 && cupIdx <= 5) return 'average';

  /* 5. Slim — small-medium frame with B-D */
  if (band <= 32 && cupIdx >= 2 && cupIdx <= 4) return 'slim';
  if (band === 30 && cupIdx === 5) return 'slim';

  /* 6. Petite — small frame with AA-A */
  if (band <= 30 && cupIdx <= 1) return 'petite';
  if (band === 32 && cupIdx === 0) return 'petite';

  /* Default fallback */
  return 'average';
}

/* ──────────────────────────────────────────────────────────
   3. Visual bucket — by cup volume
   ────────────────────────────────────────────────────────── */
function getVolumeBucket(cup) {
  const vol = CUP_VOLUME_ML[cup] || 0;
  if (vol < 200) return 'subtle';
  if (vol < 400) return 'small';
  if (vol < 600) return 'medium';
  if (vol < 800) return 'large';
  return 'full';
}

const VISUAL_DESCRIPTIONS = {
  'subtle': {
    body: 'The bust is barely there — a whisper of volume that follows the natural curve of the ribcage. Shape, not size, defines the silhouette.',
    compare: 'two small lemons',
    projection: 'less than 1 inch',
    isFullText: 'A subtle, barely-there volume. Shape, not size, defines the silhouette.'
  },
  'small': {
    body: 'The bust adds a gentle, defined curve without projecting far from the chest wall. The overall silhouette stays lean and balanced.',
    compare: 'two small apples',
    projection: 'about 1 inch',
    isFullText: 'A defined, modest volume. The overall silhouette stays lean and balanced.'
  },
  'medium': {
    body: 'The bust projects visibly from the chest wall — present and noticeable without overwhelming the frame. A balanced, proportional look.',
    compare: 'two medium apples',
    projection: 'about 2 inches',
    isFullText: 'A present, balanced volume. A proportional look that reads on most frames.'
  },
  'large': {
    body: 'The bust projects noticeably and reads as a clear, defined silhouette. Support and full-coverage engineering become important for all-day comfort.',
    compare: 'two large apples',
    projection: 'about 3 inches',
    isFullText: 'A noticeable, full volume. Wide-set wires and full-coverage engineering help distribute weight.'
  },
  'full': {
    body: 'The bust projects generously from the chest wall. Wide-set wires, reinforced bands, and full-coverage cups are essential for lasting comfort.',
    compare: 'two large grapefruits',
    projection: '3+ inches',
    isFullText: 'A generous, projected volume. Engineering matters more than aesthetics — wide-set wires and reinforced bands are essential.'
  }
};

/* ──────────────────────────────────────────────────────────
   4. At a glance descriptions — varies by band and cup
   ────────────────────────────────────────────────────────── */
function getAtAGlanceText(band, cup, category) {
  const cupIdx = CUP_INDEX[cup];
  const vol = CUP_VOLUME_ML[cup];

  /* 10 variants by (band-range × cup-range) */
  const isSmall = band <= 32;
  const isLarge = band >= 40;
  const isMid = band >= 34 && band <= 38;
  const isPetiteCup = cupIdx <= 1; /* AA, A */
  const isLargeCup = cupIdx >= 5;  /* DD, DDD, G */

  let sentence = '';
  if (isSmall && isPetiteCup) {
    sentence = 'A subtle, narrow fit on a slim frame. Lighter fabrics and wireless cuts feel best.';
  } else if (isSmall && !isPetiteCup) {
    sentence = 'A defined cup on a slim frame. Look for narrow wires and bands cut for narrower torsos.';
  } else if (isMid && isPetiteCup) {
    sentence = 'A modest volume on an average frame. Smooth, lightweight styles are flattering without bulk.';
  } else if (isMid && !isPetiteCup && !isLargeCup) {
    sentence = 'A balanced, present volume on an average frame. Standard cuts and most styles work well.';
  } else if (isMid && isLargeCup) {
    sentence = 'A full volume on an average frame. Side support and full-coverage cups distribute the weight.';
  } else if (isLarge && isPetiteCup) {
    sentence = 'A modest volume on a fuller frame. Wireless and full-coverage styles prioritize comfort.';
  } else if (isLarge && !isPetiteCup && !isLargeCup) {
    sentence = 'A defined volume on a fuller frame. Wider bands and side-smoothing cuts give the best support.';
  } else {
    sentence = 'A full, present volume on a wider frame. Reinforced bands and wide-set wires are essential.';
  }

  return sentence;
}

/* ──────────────────────────────────────────────────────────
   5. Bra styles — 3 picks per category
   ────────────────────────────────────────────────────────── */
const BRA_STYLES = {
  'petite': [
    { name: 'Bralette', desc: 'Light, wireless comfort — ideal for smaller volumes and everyday wear.' },
    { name: 'Wireless Bra', desc: 'Wire-free, no-pressure fit that follows the natural shape.' },
    { name: 'T-Shirt Bra', desc: 'Seamless cups that disappear under fitted tops.' }
  ],
  'slim': [
    { name: 'T-Shirt Bra', desc: 'Smooth, moulded cups that create a clean line under clothing.' },
    { name: 'Plunge Bra', desc: 'Low center gore works well for lower necklines and narrower frames.' },
    { name: 'Wireless Bra', desc: 'Comfortable all-day wear with sufficient support for moderate volumes.' }
  ],
  'average': [
    { name: 'T-Shirt Bra', desc: 'Seamless, invisible under fitted tops.' },
    { name: 'Plunge Bra', desc: 'Creates natural cleavage for lower necklines.' },
    { name: 'Wireless Bra', desc: 'Comfortable all-day wear with sufficient support.' }
  ],
  'curvy': [
    { name: 'Full-Coverage Bra', desc: 'Wider cups and side support contain and shape a fuller bust.' },
    { name: 'Side-Support Bra', desc: 'Side panels pull the bust forward for a centred, lifted silhouette.' },
    { name: 'Underwire Bra', desc: 'Structured underwire lifts and separates, essential for fuller volumes.' }
  ],
  'full-bust': [
    { name: 'Full-Coverage Bra', desc: 'Maximum containment with wide-set wires and tall side panels.' },
    { name: 'Underwire Bra', desc: 'Reinforced underwire and wide straps lift the bust without strain.' },
    { name: 'Side-Support Bra', desc: 'Side slings centre the bust and prevent outward projection.' }
  ],
  'plus-size': [
    { name: 'Full-Coverage Bra', desc: 'Wide bands and full cups distribute weight across a larger frame.' },
    { name: 'Wireless Support Bra', desc: 'Structured wireless support without underwire pressure.' },
    { name: 'Posture Bra', desc: 'Wide back panels smooth the silhouette under clothing.' }
  ]
};

/* ──────────────────────────────────────────────────────────
   6. Editor-tested brand recommendations
   ────────────────────────────────────────────────────────── */
const BRAND_RECOS = {
  'petite': [
    { brand: 'Aerie Sunnie Wireless', kind: 'Wireless', desc: 'Light, soft, and cut for slimmer frames and smaller volumes.' },
    { brand: 'True & Co. Lift Scoop', kind: 'T-Shirt', desc: 'Featherlight moulded cups that disappear under knits and tees.' },
    { brand: 'Negative Underwear', kind: 'Bralette', desc: 'Wire-free, second-skin comfort with refined European styling.' }
  ],
  'slim': [
    { brand: 'ThirdLove Form Fit', kind: 'T-Shirt', desc: 'Half-cup sizing and moulded cups for slim-band fitting.' },
    { brand: 'Natori Feathers', desc: 'Plunge', desc: 'Signature plunge cut with light padding — fits a slim frame beautifully.' },
    { brand: 'Wacoal Basic Contour', kind: 'T-Shirt', desc: 'Reliable, well-cut contouring for everyday wear.' }
  ],
  'average': [
    { brand: 'ThirdLove Classic Fit', kind: 'T-Shirt', desc: 'Half-cup sizing makes the standard range feel custom.' },
    { brand: 'Natori Feathers', kind: 'Plunge', desc: 'Lightweight plunge with moulded cups for a clean line.' },
    { brand: 'Wacoal Basic Contour', kind: 'T-Shirt', desc: 'Time-tested everyday contouring for standard band sizes.' }
  ],
  'curvy': [
    { brand: 'Elomi Cate', kind: 'Full-Coverage', desc: 'Wider wires and full cups engineered for fuller volumes.' },
    { brand: 'Panache Envy', kind: 'Full-Coverage', desc: 'Balanced full-coverage with strong side support.' },
    { brand: 'Curvy Kate Daily Boost', kind: 'Plunge', desc: 'Curvy plunge with side support and a soft band.' }
  ],
  'full-bust': [
    { brand: 'Elomi Cate Full-Coverage', kind: 'Full-Coverage', desc: 'Larger bands needing maximum support and side smoothing.' },
    { brand: 'Goddess Keira Banded Underwire', kind: 'Underwire', desc: 'Full-figure support with soft fabrics and reinforced cups.' },
    { brand: 'Vanity Fair Full-Figure Beauty Back', kind: 'Smoothing', desc: 'Back-smoothing design with 4-way stretch for larger bands.' }
  ],
  'plus-size': [
    { brand: 'Lane Bryant Bliss', kind: 'Full-Coverage', desc: 'Designed for full-figure frames with wide bands and soft cups.' },
    { brand: 'Goddess Adelaide', kind: 'Underwire', desc: 'Reinforced underwire and wide straps for larger band sizes.' },
    { brand: 'Elomi Amelia', kind: 'Side-Support', desc: 'Side-support cups centred for the plus-size bust.' }
  ]
};

/* ──────────────────────────────────────────────────────────
   7. Tips pool — 30 tips; each size picks 6 deterministically
   ────────────────────────────────────────────────────────── */
const TIPS_POOL = [
  'Get professionally fitted at least once a year — weight changes, pregnancy, and aging affect bra size.',
  'If you are between sizes, choose the option that feels most comfortable on the loosest hook.',
  'Replace bras every 6–12 months depending on wear — stretched bands reduce support.',
  'Always fasten new bras on the loosest hook to extend their usable life as the elastic wears.',
  'Mix up bra styles — wearing the same style daily can create pressure points.',
  'The band provides approximately 70% of the support — ensure it sits level all around, never riding up.',
  'Straps should sit comfortably on your shoulders without digging in or slipping off.',
  'The underwire should follow your breast fold without sitting on any breast tissue.',
  'Cup spillage at the top or sides means the cup is too small — go up one cup size.',
  'The band should stay in place when you raise your arms above your head.',
  'You should be able to fit only two fingers under the band — not the whole hand.',
  'Centre gore (the piece between the cups) should lie flat against your sternum.',
  'Breast tissue should fill the entire cup without empty space at the top or sides.',
  'Re-measure every 6–12 months, or after any significant weight change, pregnancy, or surgery.',
  'For fuller volumes, wider straps and side-support cups reduce shoulder strain.',
  'For smaller volumes, lightly padded cups can create a smoother silhouette.',
  'Narrow-set wires and shorter centre gores suit narrower frames and slimmer torsos.',
  'Wide-set wires and taller side panels suit fuller frames and broader torsos.',
  'A sports bra designed for your impact level prevents long-term breast-tissue damage during exercise.',
  'Sleeping in a soft wireless bra is a personal choice — no health benefit, but some prefer the comfort.',
  'Hand-washing extends bra life significantly — even on the delicate cycle, machine washing shortens elasticity.',
  'Air-dry bras flat — never put bras in the dryer, as heat destroys elastic.',
  'Hook the back clasps before pulling the bra on or off to avoid stretching the band.',
  'Don\'t buy a bra based on sister-size alone — try at least three sizes to find the right fit.',
  'For cup volumes of D+, consider a full-coverage style as your everyday go-to for support.',
  'For cup volumes of A–B, bralettes and wireless cuts are a comfortable, supportive option.',
  'Moulded cups hold their shape through clothing — perfect for fitted tops and dresses.',
  'Unlined cups offer a more natural shape but show through lighter fabrics.',
  'Adjust the straps each time you put a bra on — they should never be so tight that they carry the weight.',
  'If the band rides up, it\'s too big — try going down a band size and up a cup size.'
];

/* ──────────────────────────────────────────────────────────
   8. FAQ templates
   ────────────────────────────────────────────────────────── */
function buildFAQs(band, cup, category, sister1, sister2, vol) {
  const volText = `${vol} mL`;
  const isEdgeCup = cup === 'AA' || cup === 'G';
  const edgeSisterNote = isEdgeCup
    ? ` (note: ${band}${cup} is at the edge of the cup range, so the second related size is approximate)`
    : '';

  return [
    {
      q: `What does a ${band}${cup} look like?`,
      a: `${VISUAL_DESCRIPTIONS[getVolumeBucket(cup)].isFullText} To visualize, think of ${VISUAL_DESCRIPTIONS[getVolumeBucket(cup)].compare} — a ${category === 'petite' ? 'modest' : category === 'plus-size' ? 'generous' : 'balanced'} look that suits a ${band}-inch frame. Breast shape — round, teardrop, slender, or tubular — can make the same ${band}${cup} look very different from person to person. Use our Breast Shape Calculator to identify your specific shape.`
    },
    {
      q: `What are the sister sizes of ${band}${cup}?`,
      a: `The sister sizes of ${band}${cup} are ${sister1} and ${sister2}${edgeSisterNote}. ${sister1} — if the band feels too tight on ${band}${cup}, try this sister size: go up one band size and down one cup size for the same approximate cup volume (${volText}) with a looser band. ${sister2} — a related size that may also work if your usual ${band}${cup} is out of stock or the fit is close-but-not-perfect. Sister sizes share approximately the same cup volume but with different band lengths.`
    },
    {
      q: `What type of bra is best for ${band}${cup}?`,
      a: `The best bra types for ${band}${cup} are: ${BRA_STYLES[category].map(s => `${s.name} — ${s.desc.replace(/\.$/, '')}`).join('; ')}. The ideal style also depends on your breast shape and the outfits you wear. If you have a teardrop shape or concerns about support, prioritize fuller-coverage styles. For everyday versatility with ${band}${cup}, start with a well-fitted T-shirt bra and build your collection from there.`
    }
  ];
}

/* ──────────────────────────────────────────────────────────
   9. Compare links — 4 most relevant comparisons
   ────────────────────────────────────────────────────────── */
function buildCompareLinks(cup) {
  const cupIdx = CUP_INDEX[cup];
  const links = [];
  /* Adjacent cups comparison (use existing comparison pages) */
  if (cupIdx >= 2) {
    const prev = CUPS[cupIdx - 1];
    const slug1 = prev === 'A' ? 'b-cup-vs-c-cup' : prev === 'B' ? 'b-cup-vs-c-cup' : prev === 'C' ? 'c-cup-vs-d-cup' : prev === 'D' ? 'd-cup-vs-dd-cup' : prev === 'DD' ? 'd-cup-vs-dd-cup' : prev === 'DDD' ? 'dd-cup-vs-ddd-cup' : '';
    if (slug1) links.push({ slug: slug1, title: `${prev} Cup vs ${cup} Cup`, desc: `See the visual difference between ${prev} cup and ${cup} cup.` });
  }
  if (cupIdx <= 5 && cupIdx < CUPS.length - 1) {
    const next = CUPS[cupIdx + 1];
    const slug2 = next === 'B' ? 'b-cup-vs-c-cup' : next === 'C' ? 'b-cup-vs-c-cup' : next === 'D' ? 'c-cup-vs-d-cup' : next === 'DD' ? 'd-cup-vs-dd-cup' : next === 'DDD' ? 'dd-cup-vs-ddd-cup' : '';
    if (slug2 && !links.find(l => l.slug === slug2)) {
      links.push({ slug: slug2, title: `${cup} Cup vs ${next} Cup`, desc: `See the visual difference between ${cup} cup and ${next} cup.` });
    }
  }
  /* Pad to 4 with standard comparison links */
  const standards = [
    { slug: 'b-cup-vs-c-cup', title: 'B Cup vs C Cup', desc: 'See the visual difference between these cup sizes.' },
    { slug: 'c-cup-vs-d-cup', title: 'C Cup vs D Cup', desc: 'See the visual difference between these cup sizes.' },
    { slug: 'd-cup-vs-dd-cup', title: 'D Cup vs DD Cup', desc: 'See the visual difference between these cup sizes.' },
    { slug: 'dd-cup-vs-ddd-cup', title: 'DD Cup vs DDD Cup', desc: 'See the visual difference between these cup sizes.' },
    { slug: 'breast-size-chart', title: 'Visual Size Chart', desc: 'See cup sizes 28A–44H+ side-by-side across US, UK, EU, and JP with pictures.' },
    { slug: 'wireless-vs-wired-bra', title: 'Wireless vs Wired Bra', desc: 'Compare comfort, support, and shaping across bra constructions.' }
  ];
  for (const s of standards) {
    if (links.length >= 4) break;
    if (!links.find(l => l.slug === s.slug)) links.push(s);
  }

  return links.slice(0, 4);
}

/* ──────────────────────────────────────────────────────────
   10. Sister size calculation
   ────────────────────────────────────────────────────────── */
function getSisterSizes(band, cup) {
  const cupIdx = CUP_INDEX[cup];
  const result = [];

  /* Up-sister: band-2, cup+1 */
  if (band - 2 >= 28 && cupIdx + 1 < CUPS.length) {
    result.push({
      label: (band - 2) + CUPS[cupIdx + 1],
      desc: 'Looser band, same cup volume'
    });
  }

  /* Down-sister: band+2, cup-1 */
  if (band + 2 <= 44 && cupIdx - 1 >= 0) {
    result.push({
      label: (band + 2) + CUPS[cupIdx - 1],
      desc: 'Snugger band, same cup volume'
    });
  }

  /* For AA, only down-sister exists; for G, only up-sister exists */
  /* If only one, just provide that one */
  return result.length > 0 ? result : [];
}

/* ──────────────────────────────────────────────────────────
   10b. Sister size with both, even if out-of-catalog (use nearest)
   ────────────────────────────────────────────────────────── */
function getSisterSizesRobust(band, cup) {
  const result = getSisterSizes(band, cup);
  if (result.length === 2) return result;

  const cupIdx = CUP_INDEX[cup];

  /* Edge: AA — only down-sister possible */
  if (cup === 'AA') {
    return [
      { label: (band + 2) + 'A', desc: 'Looser band, same cup volume' },
      { label: (band + 4) + 'B', desc: 'Two bands up, two cups up — related size' }
    ];
  }
  /* Edge: G — only up-sister possible */
  if (cup === 'G') {
    return [
      { label: (band - 2) + 'DDD', desc: 'Snugger band, same cup volume' },
      { label: (band - 4) + 'DD', desc: 'Two bands down, two cups down — related size' }
    ];
  }
  /* Edge: smallest band (28) — only up-sister exists */
  if (band === 28) {
    return [
      { label: (band + 2) + CUPS[cupIdx - 1], desc: 'Looser band, same cup volume' },
      { label: (band + 4) + CUPS[cupIdx - 2], desc: 'Two bands up — related size' }
    ];
  }
  /* Edge: largest band (44) — only down-sister exists */
  if (band === 44) {
    return [
      { label: (band - 2) + CUPS[cupIdx + 1], desc: 'Snugger band, same cup volume' },
      { label: (band - 4) + CUPS[cupIdx + 2], desc: 'Two bands down — related size' }
    ];
  }
  return result;
}

/* ──────────────────────────────────────────────────────────
   11. Tips selection — deterministic by hash(band+cup)
   ────────────────────────────────────────────────────────── */
function pickTips(band, cup) {
  const key = band + cup;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) & 0xFFFFFFFF;
  const start = Math.abs(hash) % TIPS_POOL.length;
  const picked = [];
  for (let i = 0; i < 6; i++) {
    picked.push(TIPS_POOL[(start + i * 7) % TIPS_POOL.length]);
  }
  return picked;
}

/* ──────────────────────────────────────────────────────────
   12. Build page content
   ────────────────────────────────────────────────────────── */
function buildPage(band, cup) {
  const slug = String(band) + cup.toLowerCase();
  const displaySize = String(band) + cup;
  const category = getCategory(band, cup);
  const volBucket = getVolumeBucket(cup);
  const vol = CUP_VOLUME_ML[cup];
  const sisters = getSisterSizesRobust(band, cup);
  const sister1 = sisters[0].label;
  const sister2 = sisters[1].label;
  const bust = band + (CUP_INDEX[cup] + 1);
  const underbustCm = Math.round(band * 2.54);
  const bustCm = Math.round(bust * 2.54);
  const styles = BRA_STYLES[category];
  const brands = BRAND_RECOS[category];
  const atAGlance = getAtAGlanceText(band, cup, category);
  const visual = VISUAL_DESCRIPTIONS[volBucket];
  const tips = pickTips(band, cup);
  const faqs = buildFAQs(band, cup, category, sister1, sister2, vol);
  const compareLinks = buildCompareLinks(cup);

  /* Sibling nav — prev/next within the same band */
  const cupIdx = CUP_INDEX[cup];
  const prevCup = cupIdx > 0 ? CUPS[cupIdx - 1] : null;
  const nextCup = cupIdx < CUPS.length - 1 ? CUPS[cupIdx + 1] : null;
  const prevSlug = prevCup ? `/bra-size-guide/${band}${prevCup.toLowerCase()}/` : null;
  const nextSlug = nextCup ? `/bra-size-guide/${band}${nextCup.toLowerCase()}/` : null;

  return {
    slug, displaySize, band, cup, category, vol, sisters, sister1, sister2,
    bust, underbustCm, bustCm, styles, brands, atAGlance, visual, tips, faqs, compareLinks,
    prevSlug, nextSlug
  };
}

/* ──────────────────────────────────────────────────────────
   13. Render HTML — read template, replace size-specific blocks
   ────────────────────────────────────────────────────────── */
function renderHTML(template, data) {
  let out = template;

  /* Slug used everywhere */
  const SLUG = data.slug;          /* 28aa, 30g, 32ddd */
  const SLUG_UP = data.displaySize; /* 28AA, 30G, 32DDD */
  const URL = `https://breastcalculator.com/bra-size-guide/${SLUG}/`;

  /* Head: title, description, keywords, canonical, og, twitter */
  out = out.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>\n      ${data.displaySize} Bra Size Guide: Measurements, Sister Sizes &amp; Best Bras\n    </title>`
  );
  out = out.replace(
    /<meta name="description" content="[^"]+"\/>/,
    `<meta name="description" content="Everything you need to know about ${data.displaySize} bra size. See how it looks, find your sister sizes, and discover the best bras for your shape."/>`
  );
  out = out.replace(
    /<meta name="keywords" content="[^"]+"\/>/,
    `<meta name="keywords" content="breast calculator, bra size calculator, bra fitting, cup size, breast measurement, ${data.displaySize} bra size, ${data.displaySize} bra, ${data.displaySize} bra size guide, ${data.displaySize} cup, bra size guide"/>`
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]+"\/>/,
    `<link rel="canonical" href="${URL}"/>`
  );
  out = out.replace(
    /<link rel="alternate" hreflang="en" href="[^"]+"\/>/g,
    `<link rel="alternate" hreflang="en" href="${URL}"/>`
  );
  out = out.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]+"\/>/g,
    `<link rel="alternate" hreflang="x-default" href="${URL}"/>`
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]+"\/>/,
    `<meta property="og:title" content="${data.displaySize} Bra Size Guide: Measurements, Sister Sizes &amp; Best Bras"/>`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]+"\/>/,
    `<meta property="og:description" content="Everything you need to know about ${data.displaySize} bra size. See how it looks, find your sister sizes, and discover the best bras for your shape."/>`
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]+"\/>/,
    `<meta property="og:url" content="${URL}"/>`
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]+"\/>/,
    `<meta name="twitter:title" content="${data.displaySize} Bra Size Guide: Measurements, Sister Sizes &amp; Best Bras"/>`
  );
  out = out.replace(
    /<meta name="twitter:description" content="[^"]+"\/>/,
    `<meta name="twitter:description" content="Everything you need to know about ${data.displaySize} bra size. See how it looks, find your sister sizes, and discover the best bras for your shape."/>`
  );

  /* H1 + intro */
  out = out.replace(
    /<h1 class="text-center">\s*38C Bra Size Guide:[\s\S]*?<\/h1>/,
    `<h1 class="text-center">\n          ${data.displaySize} Bra Size Guide: Measurements, Sister Sizes &amp; Best Bras\n        </h1>`
  );
  out = out.replace(
    /<p>\s*Everything you need to know about the 38C bra size[\s\S]*?<\/p>/,
    `<p>\n          Everything you need to know about the ${data.displaySize} bra size — from how it looks to the most comfortable bra styles for your shape.\n        </p>`
  );

  /* Section: At a Glance */
  out = out.replace(
    /<section class="guide-section">\s*<h2>\s*38C at a Glance\s*<\/h2>[\s\S]*?<\/section>/,
    `<section class="guide-section">\n          <h2>\n            ${data.displaySize} at a Glance\n          </h2>\n          <p>\n            ${data.atAGlance} This is a\n            <strong>\n              ${data.category}\n            </strong>\n            size. Understanding your ${data.displaySize} measurements helps you choose bras that fit comfortably and flatter your figure.\n          </p>\n          <div class="guide-grid">\n            <div class="guide-card">\n              <h4>\n                Measurements\n              </h4>\n              <div class="table-wrap">\n                <table class="data-table">\n                  <tbody>\n                    <tr>\n                      <th>\n                        Underbust\n                      </th>\n                      <td>\n                        ${data.band}&quot; (${data.underbustCm} cm)\n                      </td>\n                    </tr>\n                    <tr>\n                      <th>\n                        Bust\n                      </th>\n                      <td>\n                        ${data.bust}&quot; (${data.bustCm} cm)\n                      </td>\n                    </tr>\n                    <tr>\n                      <th>\n                        Cup Volume\n                      </th>\n                      <td>\n                        ${data.vol} mL\n                      </td>\n                    </tr>\n                    <tr>\n                      <th>\n                        Category\n                      </th>\n                      <td>\n                        ${data.category}\n                      </td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n            </div>\n            <div class="guide-card">\n              <h4>\n                Sister Sizes\n              </h4>\n              <div class="table-wrap">\n                <table class="data-table">\n                  <tbody>\n                    <tr>\n                      <th>\n                        ${data.sisters[0].label}\n                      </th>\n                      <td>\n                        ${data.sisters[0].desc}\n                      </td>\n                    </tr>\n                    <tr>\n                      <th>\n                        ${data.sisters[1].label}\n                      </th>\n                      <td>\n                        ${data.sisters[1].desc}\n                      </td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n            </div>\n          </div>\n        </section>`
  );

  /* Section: What Does It Look Like */
  out = out.replace(
    /<section class="guide-section">\s*<h2>\s*What Does a 38C Look Like\?\s*<\/h2>[\s\S]*?<\/section>/,
    `<section class="guide-section">\n          <h2>\n            What Does a ${data.displaySize} Look Like?\n          </h2>\n          <div class="placeholder-img">\n            [Image Placeholder: Person wearing a well-fitted ${data.displaySize} bra, shown from front and side angles with a neutral, relaxed posture.]\n          </div>\n          <p>\n            ${data.visual.body}\n          </p>\n          <p>\n            To help visualize:\n            <strong>\n              Think of ${data.visual.compare} — a ${data.category === 'petite' ? 'subtle' : data.category === 'plus-size' ? 'generous' : 'balanced'} look on a ${data.band}-inch frame.\n            </strong>\n          </p>\n          <p>\n            On a ${data.band}-inch underbust, the bust projects approximately ${data.visual.projection} from the chest wall. Breast shape — round, teardrop, slender, or tubular — can dramatically change how ${data.displaySize} looks on different bodies. Use our\n            <a href="/tools/breast-shape-calculator/">\n              Breast Shape Calculator\n            </a>\n            to identify your specific shape and learn how it affects fit.\n          </p>\n        </section>`
  );

  /* Section: Best Bra Styles */
  let styleCards = data.styles.map(s =>
    `          <div class="rec-card">\n            <h3>\n              ${s.name}\n            </h3>\n            <p>\n              ${s.desc}\n            </p>\n          </div>`
  ).join('\n');

  let brandCards = data.brands.map(b =>
    `          <div class="rec-card">\n            <h3>\n              ${b.brand} (${b.kind})\n            </h3>\n            <p>\n              ${b.desc}\n            </p>\n            <a href="#affiliate-${b.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" class="affiliate-link">\n              [Affiliate Link: ${b.brand}]\n            </a>\n          </div>`
  ).join('\n');

  out = out.replace(
    /<section class="guide-section">\s*<h2>\s*Best Bra Styles for 38C\s*<\/h2>[\s\S]*?<\/section>/,
    `<section class="guide-section">\n          <h2>\n            Best Bra Styles for ${data.displaySize}\n          </h2>\n          <p>\n            Based on the ${data.displaySize} profile, here are the bra styles we recommend for comfort, support, and a flattering silhouette:\n          </p>\n${styleCards}\n          <h3 style="margin-top:32px">\n            Editor-Tested Bra Recommendations for ${data.displaySize}\n          </h3>\n${brandCards}\n        </section>`
  );

  /* Section: Tips */
  let tipItems = data.tips.map(t => `            <li>\n              ${t}\n            </li>`).join('\n');
  out = out.replace(
    /<section class="guide-section">\s*<h2>\s*Tips for Wearing 38C\s*<\/h2>[\s\S]*?<\/section>/,
    `<section class="guide-section">\n          <h2>\n            Tips for Wearing ${data.displaySize}\n          </h2>\n          <ul>\n${tipItems}\n          </ul>\n        </section>`
  );

  /* Section: Compare with Other Sizes */
  let compareCards = data.compareLinks.map(c => {
    const url = `/bra-size-guide/compare/${c.slug}/`;
    return `            <a class="card" href="${url}">\n              <h3>\n                ${c.title}\n              </h3>\n              <p>\n                ${c.desc}\n              </p>\n            </a>`;
  }).join('\n');

  out = out.replace(
    /<section class="guide-section">\s*<h2>\s*38C vs Other Sizes\s*<\/h2>[\s\S]*?<\/section>/,
    `<section class="guide-section">\n          <h2>\n            ${data.displaySize} vs Other Sizes\n          </h2>\n          <p>\n            If you are between sizes or curious how ${data.displaySize} compares, explore our visual comparison guides:\n          </p>\n          <div class="card-grid" style="margin-top:16px">\n${compareCards}\n          </div>\n        </section>`
  );

  /* Sibling nav */
  let prevLink = data.prevSlug ? `<a href="${data.prevSlug}">\n            ← ${data.band}${CUPS[CUP_INDEX[data.cup] - 1]} Guide\n          </a>` : '';
  let nextLink = data.nextSlug ? `<a href="${data.nextSlug}">\n            ${data.band}${CUPS[CUP_INDEX[data.cup] + 1]} Guide →\n          </a>` : '';
  out = out.replace(
    /<nav class="sibling-nav">[\s\S]*?<\/nav>/,
    `<nav class="sibling-nav">\n        ${prevLink}\n        ${nextLink}\n      </nav>`
  );

  /* FAQ */
  let faqJsonMainEntity = data.faqs.map(f => `            {\n              "@type": "Question",\n              "name": ${JSON.stringify(f.q)},\n              "acceptedAnswer": {\n                "@type": "Answer",\n                "text": ${JSON.stringify(f.a)}\n              }\n            }`).join(',\n');
  out = out.replace(
    /"mainEntity": \[[\s\S]*?\]\s*\n\s*\}/,
    `"mainEntity": [\n${faqJsonMainEntity}\n          ]\n        }`
  );
  out = out.replace(
    /<h2>\s*Frequently Asked Questions\s*<\/h2>[\s\S]*?<\/section>/,
    `<h2>\n            Frequently Asked Questions\n          </h2>\n          <div class="faq-list">\n            <details class="faq-item">\n              <summary class="faq-question">\n                ${data.faqs[0].q}\n              </summary>\n              <div class="faq-answer">\n                ${data.faqs[0].a}\n              </div>\n            </details>\n            <details class="faq-item">\n              <summary class="faq-question">\n                ${data.faqs[1].q}\n              </summary>\n              <div class="faq-answer">\n                ${data.faqs[1].a}\n              </div>\n            </details>\n            <details class="faq-item">\n              <summary class="faq-question">\n                ${data.faqs[2].q}\n              </summary>\n              <div class="faq-answer">\n                ${data.faqs[2].a}\n              </div>\n            </details>\n          </div>\n        </section>`
  );

  /* Update FAQ questions inside <details> (replace any leftover 38C) */
  out = out.replace(/What does a 38C look like\?/g, data.faqs[0].q);
  out = out.replace(/What are the sister sizes of 38C\?/g, data.faqs[1].q);
  out = out.replace(/What type of bra is best for 38C\?/g, data.faqs[2].q);

  /* FAQ answers: replace the inline 38C answer text */
  out = out.replace(
    /<div class="faq-answer">\s*The bust feels present but not overwhelming[\s\S]*?<\/div>\s*<\/details>\s*<details class="faq-item">\s*<summary class="faq-question">\s*What are the sister sizes of 38C\?\s*<\/summary>\s*<div class="faq-answer">[\s\S]*?<\/div>\s*<\/details>\s*<details class="faq-item">\s*<summary class="faq-question">\s*What type of bra is best for 38C\?\s*<\/summary>\s*<div class="faq-answer">[\s\S]*?<\/div>\s*<\/details>/,
    `<div class="faq-answer">\n                ${data.faqs[0].a}\n              </div>\n            </details>\n            <details class="faq-item">\n              <summary class="faq-question">\n                ${data.faqs[1].q}\n              </summary>\n              <div class="faq-answer">\n                ${data.faqs[1].a}\n              </div>\n            </details>\n            <details class="faq-item">\n              <summary class="faq-question">\n                ${data.faqs[2].q}\n              </summary>\n              <div class="faq-answer">\n                ${data.faqs[2].a}\n              </div>\n            </details>`
  );

  return out;
}

/* ──────────────────────────────────────────────────────────
   14. List existing pages (to skip them)
   ────────────────────────────────────────────────────────── */
function getExistingSlugs() {
  const dir = path.join(ROOT, 'bra-size-guide');
  return fs.readdirSync(dir)
    .filter(f => /^\d+[a-z]+$/.test(f) || /^h-cup$/.test(f));
}

/* ──────────────────────────────────────────────────────────
   15. Main
   ────────────────────────────────────────────────────────── */
function main() {
  const args = process.argv.slice(2);
  let onlyBand = null, onlyCup = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--band') onlyBand = parseInt(args[++i], 10);
    if (args[i] === '--cup') onlyCup = args[++i];
  }

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const existing = new Set(getExistingSlugs());

  const bands = [28, 30, 32, 34, 36, 38, 40, 42, 44];
  const cups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G'];

  let count = 0, skipped = 0;
  for (const band of bands) {
    for (const cup of cups) {
      if (onlyBand && onlyBand !== band) continue;
      if (onlyCup && onlyCup !== cup) continue;

      const slug = String(band) + cup.toLowerCase();
      if (existing.has(slug)) {
        skipped++;
        continue;
      }

      const data = buildPage(band, cup);
      const html = renderHTML(template, data);
      const outDir = path.join(OUTPUT_DIR, slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
      count++;
      console.log(`✓ ${slug}/index.html  (${html.length} bytes)`);
    }
  }
  console.log(`\nDone: ${count} pages generated, ${skipped} skipped (already exist)`);
}

main();
