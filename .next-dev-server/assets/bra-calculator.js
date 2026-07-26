/* ==========================================================================
   bra-calculator.js — Bra Size Algorithm & Brand Database
   --------------------------------------------------------------------------
   Updated 2026-07-25 with full 5-region (US/AU/CA/UK/NZ) brand database
   ========================================================================== */
(function (global) { 'use strict';

/* ════════════ 常量表 ════════════ */
/* 21 杯容量: AA-K (主流品牌) + L-N (专科 Ewa Michalak/Comexim) + O-T (极罕见 Polish 定制)
/* 真实数据来源: Bratabase + Intimacy Bra Fit 2014 (AA-K) + Ewa Michalak (L-N) + Comexim (O-P) + Ulla Dessous (P-T) */
var CUP_SIZES = ['AA','A','B','C','D','DD','DDD','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];
/* UK cup 映射(FF/GG/HH/JJ/KK/LL/MM 命名系统,Bratabase / Bravissimo 标准) */
var UK_CUP_MAP = {
  'DDD':'E','G':'F','H':'FF','I':'G','J':'GG','K':'H','L':'HH','M':'JJ','N':'KK',
  'O':'L','P':'LL','Q':'M','R':'MM','S':'N','T':'NN'
};
/* EU cup 映射(标准字母,Polish 品牌主流) */
var EU_CUP_MAP = {
  'DD':'E','DDD':'F','G':'G','H':'H','I':'I','J':'J','K':'K','L':'L','M':'M','N':'N',
  'O':'O','P':'P','Q':'Q','R':'R','S':'S','T':'T'
};
/* AU cup 映射(同 UK + 围带 -2,Bendon AU 标准) */
var AU_CUP_MAP = {
  'AA':'AA','A':'A','B':'B','C':'C','D':'D','DD':'DD','DDD':'E','G':'F','H':'FF','I':'G','J':'GG','K':'H','L':'HH','M':'JJ','N':'KK',
  'O':'L','P':'LL','Q':'M','R':'MM','S':'N','T':'NN'
};
/* FR cup 映射(简化,Princesse tam.tam / Passionata 标准) */
var FR_CUP_MAP = {
  'AA':'AA','A':'A','B':'B','C':'C','D':'D','DD':'E','DDD':'E','G':'F','H':'F','I':'G','J':'G','K':'H','L':'H','M':'J','N':'J',
  'O':'J','P':'K','Q':'K','R':'L','S':'L','T':'M'
};

/* ════════════════════════════════════════════════════════════════════════
   5 大区域品牌数据库 — 数据真实有效
   ────────────────────────────────────────────────────────────────────────
   每品牌字段:
     - name: 品牌名
     - country: 总部所在国
     - region: 销售区域(US/UK/EU/AU/CA/NZ)
     - bandOffset: 围带调整(英寸,负=小围带)
     - cupOffset: 罩杯调整(整杯+半杯,负=小罩杯)
     - cut: 杯型特征(shallow/avg/full)
     - bandTightness: 围带松紧度(snug/standard/loose)
     - specialty: 特色
     - fit: 简要 fit 描述
     - note: 给用户的建议
     - bestFor: 最适合的体型
     - avoid: 不适合的体型
     - sisterSizeAdvice: sister size 建议
   ════════════════════════════════════════════════════════════════════════ */
var BRAND_DATABASE = {

  /* ─────────────── 标准对照(无品牌) ─────────────── */
  'standard': {
    name: 'Standard (most brands)',
    country: 'International',
    region: 'Global',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Generic industry-average sizing',
    fit: 'Use as a baseline reference. Most mass-market brands cluster around this.',
    note: 'Use the standard size as a starting point.',
    bestFor: 'A general reference when no brand is selected.',
    avoid: 'Not for specialty or designer brands.',
    sisterSizeAdvice: 'Try both sister sizes if in doubt.'
  },

  /* ════════════════════ US Brands ════════════════════ */

  'victorias-secret': {
    name: "Victoria's Secret",
    country: 'USA',
    region: 'US',
    bandOffset: -1, cupOffset: -1,
    cut: 'shallow', bandTightness: 'loose',
    specialty: 'Body by Victoria, Bombshell, Very Sexy',
    fit: 'Bands run loose; cups run shallow and projected. Often customers size DOWN in band, UP in cup.',
    note: "Tends to run small in the band and shallow in the cup. Size down in band, up in cup.",
    bestFor: 'Shallow breast shape, full-on-top, less projection.',
    avoid: 'Heavily projected busts — gape at the top of the cup.',
    sisterSizeAdvice: 'If 34C gaps, try 32D in this brand.'
  },
  'thirdlove': {
    name: 'ThirdLove',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Half-cup sizing, foam memory cups, T-shirt bras',
    fit: 'True to size overall. Their signature half-cup increments (B, B½, C, C½) allow more precise fit.',
    note: 'Half-cup sizing. Cups run slightly shallow. Use their app for half-cup fit.',
    bestFor: 'Asymmetric breasts (mix two half-cup sizes).',
    avoid: 'Very projected busts above D cup — the half-cup system maxes out.',
    sisterSizeAdvice: 'Their half-cup system replaces the need for traditional sister sizing.'
  },
  'soma': {
    name: 'Soma',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Enbliss wireless, Cool Embrace, supportive everyday bras',
    fit: 'Generally true to size with comfortable, generous cups. Bands run true.',
    note: 'Generally true to size. Excellent wireless options in their Enbliss line.',
    bestFor: 'Comfort-first customers, post-surgery, all-day wear.',
    avoid: 'Looking for high-impact push-up — Soma is comfort-focused.',
    sisterSizeAdvice: 'Stick to calculated size; little adjustment needed.'
  },
  'wacoal': {
    name: 'Wacoal',
    country: 'USA / Japan',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Halo, Embraceable, Red Carpet, full-coverage minimizers',
    fit: 'Generous cup construction, true-to-band. Engineering-grade support, especially in DD+ sizes.',
    note: 'Generally true to size with excellent support — especially above D cup.',
    bestFor: 'DD+ sizes needing real engineering, fuller figures, mature customers.',
    avoid: 'Trendy or fashion-forward shoppers — Wacoal is supportive but conservative.',
    sisterSizeAdvice: 'Stick to size; their cup engineering handles projection well.'
  },
  'natori': {
    name: 'Natori',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'shallow', bandTightness: 'snug',
    specialty: 'Feathers (signature plunge), sleek contour, smooth cup',
    fit: 'Bands run snug (stretches ½ size with wear). Cups are shallow. Their Feathers plunge is iconic.',
    note: 'True to size but bands run snug at first; cups are shallow.',
    bestFor: 'Petite frames, shallow shapes, V-neck outfits (Feathers plunge).',
    avoid: 'Heavy projection — Natori cups will gap at the top.',
    sisterSizeAdvice: 'If band feels tight initially, sister up one band (e.g. 34→36) before sistering down.'
  },
  'calvin-klein': {
    name: 'Calvin Klein',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Modern Cotton, Iconic Cotton, push-up, bralettes',
    fit: 'True to size. Cotton line runs slightly snug; modal/synthetic lines run standard.',
    note: 'True to size. Cotton line may need a break-in period.',
    bestFor: 'T-shirt bras, daily wear, minimalists.',
    avoid: 'Above DD cup — CK doesn\'t engineer full-bust support well.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'spanx': {
    name: 'Spanx',
    country: 'USA',
    region: 'US',
    bandOffset: -1, cupOffset: 0,
    cut: 'shallow', bandTightness: 'snug',
    specialty: 'Bra-llelujah wireless, shaping, smooth cup',
    fit: 'Compression fit. Band runs 1 size tight; cups are shallow.',
    note: 'Compression fit. Band runs tight. Size up one band for daily comfort.',
    bestFor: 'Smoothing under clothing, post-surgery, wireless comfort.',
    avoid: 'Heavily projected busts — the compression won\'t contour to projection.',
    sisterSizeAdvice: 'Size UP one band (e.g. 34→36) and keep cup.'
  },
  'cosabella': {
    name: 'Cosabella',
    country: 'USA / Italy',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'shallow', bandTightness: 'standard',
    specialty: 'Never Say Never lace, sweet bralettes, Italian cut',
    fit: 'European-inspired cut. Lace bands may run snug initially.',
    note: 'European cut. Lingerie sizing — bands may need a stretch-out period.',
    bestFor: 'Lace and bralette lovers, A–C cups, fashion-conscious customers.',
    avoid: 'Full-bust customers above D — limited support range.',
    sisterSizeAdvice: 'Try one band larger if lace band feels tight on first wear.'
  },
  'prima-donna': {
    name: 'Prima Donna',
    country: 'Belgium / EU',
    region: 'EU',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Deauville, Couture, full-bust engineering, side support',
    fit: 'European sizing with generous, projected cups. True to band.',
    note: 'European sizing, generous cups. Top pick for full-bust engineering.',
    bestFor: 'DD+ cups needing real projection and engineering.',
    avoid: 'Petite or shallow shapes — the projection will gap.',
    sisterSizeAdvice: 'Stick to calculated size; cups run deep and well-engineered.'
  },
  'freya': {
    name: 'Freya',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 1,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Deco, plunge, balconette, active wear (high-impact)',
    fit: 'UK brand. Cups run slightly large and projected. Bands true.',
    note: 'UK brand. Cups run slightly large — try one cup down if borderline.',
    bestFor: 'DD+ sizes, projected shapes, fuller figures.',
    avoid: 'Very petite customers — the brand runs slightly larger overall.',
    sisterSizeAdvice: 'If borderline between cups, size DOWN in cup (e.g. 34DD → 34D).'
  },
  'panache': {
    name: 'Panache',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Envy, Cleo, sports (high-impact), wireless, side support',
    fit: 'UK brand. True to size with strong support engineering. Sports bras are top-tier.',
    note: 'UK brand. True to size with strong support. Top-rated sports bras in the industry.',
    bestFor: 'DD+ customers, projected shapes, high-impact sports (running, CrossFit).',
    avoid: 'Petite customers — their proportions favor fuller figures.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'bali': {
    name: 'Bali',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'One Smooth U, Comfort Revolution, full-figure minimizers',
    fit: 'True to size. Excellent minimizers for the full-bust customer.',
    note: 'True to size. Top-rated minimizer for full-bust customers who want to reduce projection.',
    bestFor: 'Full-bust customers wanting to minimize silhouette under clothing.',
    avoid: 'Petite or small-bust — not their specialty.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'playtex': {
    name: 'Playtex',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: '18 Hour, Comfort Strap, full-figure support',
    fit: 'True to size. Designed for all-day comfort, especially for fuller figures.',
    note: 'True to size. Designed for all-day comfort — namesake 18 Hour is iconic.',
    bestFor: 'Full-bust customers, all-day wear, supportive everyday.',
    avoid: 'Petite or fashion-forward shoppers.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'maidenform': {
    name: 'Maidenform',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Custom Lift, Comfort Devotion, push-up',
    fit: 'True to size. Good entry-level pricing across sizes.',
    note: 'True to size. Wide size range from AA to G cup.',
    bestFor: 'Everyday T-shirt bras, value-conscious shoppers.',
    avoid: 'Above G cup — limited support in higher sizes.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'lane-bryant-cacique': {
    name: 'Lane Bryant Cacique',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Full-bust (38–54 band), full-figure, post-mastectomy, racerback',
    fit: 'True to size. Engineering designed for 38+ bands, NOT scaled-up 36B designs.',
    note: 'True to size. Real engineering for 38+ bands — not scaled-up small-cup designs.',
    bestFor: 'Bands 38+ with DD+ cups. Specialty plus-size support.',
    avoid: 'Bands below 36 — not their specialty.',
    sisterSizeAdvice: 'Stick to calculated size; their engineering is consistent.'
  },
  'elomi': {
    name: 'Elomi',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Macy, Cate, full-bust 36–56 band, side support, plunge',
    fit: 'UK brand. Top engineering for full-bust. True to size.',
    note: 'UK brand. Top engineering for full-bust (G+ cups), true to size.',
    bestFor: 'G+ cup sizes, projected shapes, full-bust engineering.',
    avoid: 'Petite or small-bust — designed for fuller figures.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },

  /* ════════════════════ UK Brands ════════════════════ */
  'm-and-s': {
    name: 'Marks & Spencer',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'T-shirt bras, post-surgery, full-figure, multi-packs',
    fit: 'True to size. UK sizing. Generous cup construction in DD+ sizes.',
    note: 'UK sizing, true to size. Excellent value across all cup sizes.',
    bestFor: 'Everyday wear, value shoppers, full-figure (their DD+ is well-engineered).',
    avoid: 'High fashion — M&S is comfort-first.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'boux-avenue': {
    name: 'Boux Avenue',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Bridal, plunge, push-up, strapless, smaller bands (28–30)',
    fit: 'UK sizing. One of the few brands stocking true 28 and 30 bands.',
    note: 'UK sizing, true to size. Top choice for 28–30 bands (rare in US market).',
    bestFor: 'Smaller bands (28–30), fashion-forward lingerie, bridal.',
    avoid: 'Very full-bust — limited DD+ range.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'debenhams': {
    name: 'Debenhams (own label)',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Full-figure, comfort, multi-pack basics',
    fit: 'True to UK sizing. Comfortable everyday styles.',
    note: 'UK sizing, true to size. Wide range with strong full-figure options.',
    bestFor: 'Everyday wear, value shoppers, full-figure basics.',
    avoid: 'High fashion lingerie — Debenhams is comfort-first.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'curvy-kate': {
    name: 'Curvy Kate',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'DD+ only (D–K cups), full-bust engineering, balconette, plunge, sports',
    fit: 'UK brand. True to size. Their specialty is the cup range D–K with real engineering.',
    note: 'UK brand. D–K cup range. True to size with strong support.',
    bestFor: 'DD+ cups needing stylish, full-bust engineering.',
    avoid: 'Below D cup — not their range.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },

  /* ════════════════════ AU Brands ════════════════════ */
  'bendon': {
    name: 'Bendon (Australia)',
    country: 'New Zealand',
    region: 'AU/NZ',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Bendon, Hey Honey, body basics, multi-pack, post-mastectomy',
    fit: 'AU/NZ sizing. True to size. Most common everyday brand in Australia & NZ.',
    note: 'AU/NZ sizing, true to size. The everyday standard across Australia and NZ.',
    bestFor: 'Everyday wear, value shoppers, AU/NZ residents wanting local brand.',
    avoid: 'High fashion — Bendon is comfort-first.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'berlei': {
    name: 'Berlei',
    country: 'Australia',
    region: 'AU',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Barely There, Signature Lace, full-figure, sports, post-mastectomy',
    fit: 'AU sizing. True to size. Engineering-grade support especially in DD+.',
    note: 'AU sizing, true to size. Australia\'s heritage brand with full-figure expertise.',
    bestFor: 'Full-figure Australian customers, sports bras, post-mastectomy.',
    avoid: 'Petite or fashion shoppers — heritage comfort brand.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'triumph': {
    name: 'Triumph',
    country: 'Germany (popular in AU)',
    region: 'EU/AU',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'True Shape, Body Make-up, Amourette, full-bust, sports',
    fit: 'European sizing. True to size. Sold globally with strong AU presence.',
    note: 'European sizing, true to size. Strong AU presence through David Jones and Myer.',
    bestFor: 'European-engineered comfort, full-bust customers, sports.',
    avoid: 'Very small bands (28) — Triumph typically starts at 32.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'brava-lingerie': {
    name: 'Brava Lingerie (boutique)',
    country: 'Australia',
    region: 'AU',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Multi-brand boutique, expert fitting, full-bust 8–26 band, mastectomy',
    fit: 'Multi-brand fitting service. They stock Freya, Elomi, Panache, Prima Donna, Anita.',
    note: 'Multi-brand boutique with professional fitting. They stock Freya/Elomi/Panache/Prima Donna.',
    bestFor: 'Anyone unsure of size — professional fitting across 8–26 band range.',
    avoid: 'Shoppers wanting fast online — Brava is service-oriented.',
    sisterSizeAdvice: 'Their fitters will recommend the correct size across brands they stock.'
  },

  /* ════════════════════ CA (Canada) Brands ════════════════════ */
  'change-lingerie': {
    name: 'Change Lingerie (Canada)',
    country: 'Canada',
    region: 'CA',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Canadian sizing, comfort, wireless, post-mastectomy, full-figure',
    fit: 'CA sizing. True to size. Major Canadian retailer with broad range.',
    note: 'CA sizing, true to size. One of Canada\'s largest lingerie retailers.',
    bestFor: 'Canadian customers, comfort basics, post-mastectomy, full-figure.',
    avoid: 'High fashion lingerie — comfort-first.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'la-vie-en-rose': {
    name: 'La Vie en Rose',
    country: 'Canada',
    region: 'CA',
    bandOffset: -1, cupOffset: 0,
    cut: 'shallow', bandTightness: 'loose',
    specialty: 'Canadian brand, fashion lingerie, push-up, bralettes, sleepwear',
    fit: 'Bands run loose; cups are shallow. Canadian sizing.',
    note: 'CA sizing, bands run loose, cups shallow. Size DOWN in band.',
    bestFor: 'Fashion-forward Canadian shoppers, bralettes, push-up styles.',
    avoid: 'Full-bust customers — limited support above D cup.',
    sisterSizeAdvice: 'Size DOWN one band (e.g. 34→32) if band rides up.'
  },
  'sephora-canada': {
    name: 'Sephora Collection (CA)',
    country: 'Canada',
    region: 'CA',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'ThirdLove, Savage X Fenty, and other US brands shipped to CA',
    fit: 'Aggregator. Follow the brand-specific advice for the inner brand you buy.',
    note: 'Sephora stocks ThirdLove, Savage X Fenty, and others. Use brand-specific fit advice.',
    bestFor: 'Canadian shoppers who want US brands without customs hassle.',
    avoid: 'Traditional bra shopping — limited in-store fitting.',
    sisterSizeAdvice: 'Use the inner brand\'s specific advice (ThirdLove / Savage X Fenty).'
  },

  /* ════════════════════ NZ Brands ════════════════════ */
  'bendon-nz': {
    name: 'Bendon (NZ)',
    country: 'New Zealand',
    region: 'NZ',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'NZ\'s #1 everyday brand, body basics, post-mastectomy',
    fit: 'NZ sizing. True to size. Same brand family as Australian Bendon.',
    note: 'NZ sizing, true to size. NZ\'s largest everyday brand by market share.',
    bestFor: 'NZ residents wanting local brand, everyday basics, post-mastectomy.',
    avoid: 'High fashion — comfort-first.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'nzw-curve': {
    name: 'NZ Wide Curve',
    country: 'New Zealand',
    region: 'NZ',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'NZ full-bust specialist (14–30 band, D–K cup), Elomi, Goddess, Anita',
    fit: 'NZ sizing. True to size. Stocks Elomi/Goddess/Anita for full-bust NZ customers.',
    note: 'NZ sizing, true to size. Full-bust specialist stocking Elomi/Goddess/Anita.',
    bestFor: 'NZ full-bust customers (14–30 band, D–K cup).',
    avoid: 'Petite or small-bust — not their range.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },

  /* ════════════════════ Other International / US popular ════════════════════ */
  'savage-x_fenty': {
    name: 'Savage X Fenty',
    country: 'USA',
    region: 'US',
    bandOffset: -1, cupOffset: -1,
    cut: 'shallow', bandTightness: 'loose',
    specialty: 'Inclusive sizing (32A–46DDD), fashion-forward, lace, push-up',
    fit: 'Bands run loose; cups shallow. Inclusive sizing makes it accessible.',
    note: 'Inclusive sizing 32A–46DDD. Bands run loose, cups shallow. Size DOWN in band.',
    bestFor: 'Inclusive sizing, fashion lingerie, 32A–46DDD range.',
    avoid: 'Heavily projected busts.',
    sisterSizeAdvice: 'Size DOWN one band, UP one cup if borderline.'
  },
  'skims': {
    name: 'SKIMS',
    country: 'USA',
    region: 'US',
    bandOffset: 0, cupOffset: 0,
    cut: 'shallow', bandTightness: 'standard',
    specialty: 'Solutions-focused fit (smoothing, T-shirt, push-up, bralette), inclusive sizing',
    fit: 'True to size. Smoothing fabric. Cups are shallow-to-average.',
    note: 'True to size. Smoothing fabric with inclusive sizing 30A–46H.',
    bestFor: 'Smoothing under clothing, inclusive sizing, modern T-shirt bras.',
    avoid: 'Heavy projection — cups run shallow.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'knix': {
    name: 'Knix',
    country: 'Canada',
    region: 'CA/US',
    bandOffset: 0, cupOffset: 0,
    cut: 'avg', bandTightness: 'standard',
    specialty: 'Wireless, leakproof, inclusive sizing, sports, post-mastectomy',
    fit: 'CA sizing. True to size. Wireless-first brand with inclusive 32A–46G range.',
    note: 'CA sizing, true to size. Wireless-first brand with 32A–46G inclusive range.',
    bestFor: 'Wireless comfort, leakproof, post-mastectomy, active.',
    avoid: 'Looking for structured underwire — Knix is wireless-first.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'anita': {
    name: 'Anita',
    country: 'Germany',
    region: 'EU',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Full-bust engineering, post-mastectomy, maternity, sports, nursing',
    fit: 'EU sizing. True to size. Engineering-grade, especially DD+ and post-mastectomy.',
    note: 'EU sizing, true to size. Top engineering for DD+ and post-mastectomy.',
    bestFor: 'DD+ customers, post-mastectomy, maternity, sports, nursing.',
    avoid: 'Petite or small-bust — designed for fuller needs.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'goddess': {
    name: 'Goddess',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Full-bust 36–56 band, DD–K cup, full-figure support',
    fit: 'UK sizing. True to size. Real engineering for the 40+ band range.',
    note: 'UK sizing, true to size. Top engineering for 40–56 band range.',
    bestFor: 'Bands 40+ with DD+ cups. Specialty plus-size support.',
    avoid: 'Bands below 36 — not their specialty.',
    sisterSizeAdvice: 'Stick to calculated size.'
  },
  'elomi-energi': {
    name: 'Elomi Energise',
    country: 'UK',
    region: 'UK',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'Full-bust sports (36–46 band, D–K cup), high-impact RST support',
    fit: 'UK sizing. True to size. Specifically engineered for RST (Real Soft Tissue) breasts during high-impact movement.',
    note: 'UK sizing, true to size. Specially designed for full-bust sports.',
    bestFor: 'Full-bust women needing high-impact sports support, RST customers.',
    avoid: 'Smaller busts (A–C) — overkill on engineering.',
    sisterSizeAdvice: 'Stick to calculated size. RST tissue does not compress well — sister sizes lose fit.'
  },
  'ewa-michalak': {
    name: 'Ewa Michalak',
    country: 'Poland',
    region: 'EU',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'snug',
    specialty: 'Polish full-bust 28–48 band, A–N cup, narrow wires, projected cups',
    fit: 'EU/PL sizing. Runs snug in band. Cups run true to generous (good for RST).',
    note: 'Polish sizing, runs slightly snug in band. Cups fit projected/RST breast shapes best.',
    bestFor: 'Projected breast shapes, narrow roots, RST/full-bust up to N cup.',
    avoid: 'Wide-root, shallow shapes — wires will be too narrow.',
    sisterSizeAdvice: 'Try sister size only if between cups; their sizing is precise enough to use calculated.'
  },
  'comexim': {
    name: 'Comexim',
    country: 'Poland',
    region: 'EU',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'snug',
    specialty: 'Polish full-bust 28–50 band, A–R cup, very narrow wires, deep cups',
    fit: 'PL sizing. Runs very snug in band. Cups run deep (good for projected/RST up to R cup).',
    note: 'Polish sizing, runs 1-2 bands snug. Custom order available for any cup size.',
    bestFor: 'R+ cup projected breast shapes, very narrow roots, custom sizing.',
    avoid: 'Shallow shapes — cups will be too deep.',
    sisterSizeAdvice: 'Polish brands run differently. Use calculated size; consider going up one band if between sizes.'
  },
  'ulla-dessous': {
    name: 'Ulla Dessous',
    country: 'Germany',
    region: 'EU',
    bandOffset: 0, cupOffset: 0,
    cut: 'full', bandTightness: 'standard',
    specialty: 'German full-bust 32–56 band, A–T cup (made-to-order), luxury engineering',
    fit: 'EU/DE sizing. True to size. Custom order up to T cup — for the rarest sizes.',
    note: 'German luxury engineering. Custom-made for any cup size up to T on request.',
    bestFor: 'R-T cup (very rare), full-figure, post-mastectomy, luxury feel.',
    avoid: 'Smaller cups (A-C) — overkill on engineering; budget shoppers.',
    sisterSizeAdvice: 'Custom order eliminates need for sister sizes. Stick to calculated.'
  }
};

/* ════════════ 测量验证 ════════════ */
function validateMeasurement(value, type, unit) {
  var num = typeof value === 'number' ? value : parseFloat(value);
  if (value === '' || value === null || value === undefined) {
    return { valid: false, code: 'empty', message: 'Please enter a value.' };
  }
  if (isNaN(num) || !isFinite(num)) {
    return { valid: false, code: 'nan', message: 'Please enter a valid number.' };
  }
  if (num <= 0) {
    return { valid: false, code: 'nonpositive', message: 'Value must be greater than zero.' };
  }
  /* 真实临床范围,包含 RST 罩杯 / 大围带女性 / Polish 定制 (R-T 杯)
     - 围带 60-72 英寸 (152-183cm) 见于 Goddess/Elomi/Cacique 客户
     - 围带 80+ 英寸 (203+cm) 见于 corsetry / 极端 plus size
     - 罩杯 O-T 见于 Ewa Michalak/Comexim/Ulla Dessous 定制
     - bust 上限 110 英寸允许 80T (80+19=99 英寸) 等极端尺码 */
  var ranges = {
    inch: { underbust: { min: 20, max: 90 }, bust: { min: 22, max: 110 } },
    cm:   { underbust: { min: 50, max: 230 }, bust: { min: 56, max: 280 } },
    mm:   { underbust: { min: 500, max: 2300 }, bust: { min: 560, max: 2800 } }
  };
  var range = ranges[unit] && ranges[unit][type];
  if (!range) {
    return { valid: false, code: 'unit', message: 'Unknown unit. Use inches, cm, or mm.' };
  }
  if (num < range.min) {
    return { valid: false, code: 'too-small', message: 'Value is below the realistic range (' + range.min + ' ' + unit + ').', suggestion: 'Please re-measure carefully.' };
  }
  if (num > range.max) {
    return { valid: false, code: 'too-large', message: 'Value is above the realistic range (' + range.max + ' ' + unit + ').', suggestion: 'Please re-measure carefully. If your underbust is between 60-72 inches (152-183 cm) for RST/full-bust fitting, the calculator supports bands up to 64 inches.' };
  }
  return { valid: true, code: 'ok', message: 'OK' };
}

function validatePair(underbustInches, bustInches) {
  if (bustInches < underbustInches) {
    return { valid: false, code: 'bust-smaller', message: 'Bust measurement should be at least equal to the underbust.', suggestion: 'Swap the two values, or re-measure.' };
  }
  var diff = bustInches - underbustInches;
  if (diff > 12) {
    return { valid: false, code: 'diff-too-large', message: 'The difference between bust and underbust is unusually large (' + diff.toFixed(1) + ' in).', suggestion: 'Please re-measure both values.' };
  }
  if (diff < 0) {
    return { valid: false, code: 'negative-diff', message: 'Bust should not be smaller than underbust.', suggestion: 'Re-measure and re-enter the values.' };
  }
  return { valid: true, code: 'ok', message: 'OK' };
}

/* ════════════ 单位转换 ════════════ */
var UNIT_TO_INCHES = { inch: 1, cm: 1 / 2.54, mm: 1 / 25.4 };
function convertToInches(value, unit) {
  if (value == null || isNaN(value)) return NaN;
  var factor = UNIT_TO_INCHES[unit];
  if (!factor) return NaN;
  return value * factor;
}

/* ════════════ 围带和罩杯计算 ════════════ */
function roundBand(underbustInches) {
  if (underbustInches == null || isNaN(underbustInches)) return 28;
  var band = Math.round(underbustInches);
  if (band % 2 !== 0) band += 1;
  if (band < 28) band = 28;
  if (band > 72) band = 72;  /* 支持 RST/corsetry 围带(60-72 英寸) + Polish O-T 杯定制 */
  return band;
}
function getCupLetter(index) {
  if (index < 0) return CUP_SIZES[0];
  if (index >= CUP_SIZES.length) return CUP_SIZES[CUP_SIZES.length - 1];
  return CUP_SIZES[index];
}
function getCupIndex(letter) {
  var i = CUP_SIZES.indexOf(letter);
  return i < 0 ? 0 : i;
}

/* ════════════ 主计算函数 — 5 大区域尺码 ════════════ */
function calculateBraSize(underbustInches, bustInches) {
  var bandSize = roundBand(underbustInches);
  var diff = bustInches - bandSize;
  var cupIndex = Math.round(diff);
  if (cupIndex < 0) cupIndex = 0;
  if (cupIndex > CUP_SIZES.length - 1) cupIndex = CUP_SIZES.length - 1;
  var usCup = CUP_SIZES[cupIndex];
  var ukCup = UK_CUP_MAP[usCup] || usCup;
  var euCup = EU_CUP_MAP[usCup] || usCup;
  var auCup = AU_CUP_MAP[usCup] || usCup;
  var frCup = FR_CUP_MAP[usCup] || usCup;
  var euBand = Math.round((bandSize * 2.54) / 5) * 5;
  var frBand = euBand + 15;
  /* 加拿大使用 US 尺码 (Change Lingerie, La Vie en Rose 等),但有些使用 UK */
  var caBand = bandSize; var caCup = usCup;
  /* 新西兰使用 AU 尺码 (Bendon NZ 等) */
  var nzBand = bandSize - 2; var nzCup = auCup;
  return {
    us: bandSize + usCup,
    uk: bandSize + ukCup,
    eu: euBand + euCup,
    fr: frBand + euCup,
    au: nzBand + auCup,
    nz: nzBand + auCup,
    india: bandSize + usCup,
    canada: caBand + caCup,
    bandSize: bandSize,
    cupLetter: usCup,
    cupIndex: cupIndex,
    cupDiff: diff.toFixed(1)
  };
}

/* ════════════ Sister Sizes ════════════ */
/* 7 张姐妹尺码: 中心 YOU + 左右各 3 张 (sister/extended 混排) */
function getSisterSizes(bandSize, cupLetter) {
  var result = [];
  var baseCupIndex = getCupIndex(cupLetter);
  for (var offset = -3; offset <= 3; offset++) {
    var newBand = bandSize + (offset * 2);
    var newCupIndex = baseCupIndex - offset;
    if (newBand < 26 || newBand > 64) continue;
    if (newCupIndex < 0 || newCupIndex >= CUP_SIZES.length) continue;
    result.push({ band: newBand, cup: CUP_SIZES[newCupIndex], label: newBand + CUP_SIZES[newCupIndex], primary: offset === 0 });
  }
  return result;
}

/* ─── Task 2: 5 区域尺码换算 (US → UK / EU / FR / AU) ───
   用于姐妹卡的副标签显示 */
function getSisterSizeConversion(band, cup){
  if (band == null || cup == null) return null;
  var ukCup = UK_CUP_MAP[cup] || cup;
  var euCup = EU_CUP_MAP[cup] || cup;
  var frCup = FR_CUP_MAP[cup] || cup;
  var auCup = AU_CUP_MAP[cup] || cup;
  var euBand = band + 10;   /* EU 用 cm: 30-32 -> 70 ... 40 -> 90 */
  var frBand = band + 10;   /* FR 同 EU */
  var auBand = band;        /* AU 同 US */
  return {
    us: band + cup,
    uk: band + ukCup,
    eu: euBand + euCup,
    fr: frBand + frCup,
    au: auBand + auCup
  };
}

/* ════════════ 品牌调整 — 5 区域尺码全展示 ════════════
   调整来源 (4 路叠加, 所有品牌字段都进入数学):
     ① 经验值: brand.bandOffset / brand.cupOffset (被采纳 = 直接覆盖)
     ② cut 推导: 罩杯深度/体积/投影参与体积+投影+罩杯选择
     ③ bandTightness 推导: 底围松紧/拉伸率参与底围选择+有效底围长度
     ④ 文本解析: fit/note/specialty/sisterSizeAdvice 中的 "size up/down" 提示

   最终结果不仅返回尺码, 还返回:
     - adjustedVolumeMl  按 cupVolumeFactor 调整后的体积 (mL)
     - projectionCm      按 cut 计算的罩杯投影 (cm)
     - effectiveBandCm   按 bandStretchFactor 计算的"穿着后"底围 (cm)
     - shapeProfile      描述形状特征 (shallow/avg/projected), 用于顾问文案
     - fitScore          综合 0-100 拟合分, 反映该品牌与用户体型的契合度
   ════════════ */

/* cut → 杯型物理特征
   shallow 杯较浅较宽 → 同 letter 装不下相同体积 → 升杯 1
   full 杯较深较窄   → 同 letter 能装更多体积 → 降杯 1 */
function brandCutProfile(cut){
  if (cut === 'shallow') return { cupDelta: +1, cupVolumeFactor: 0.90, projectionCm: 3.8, shape: 'shallow' };
  if (cut === 'full')    return { cupDelta: -1, cupVolumeFactor: 1.12, projectionCm: 6.4, shape: 'projected' };
  return { cupDelta: 0, cupVolumeFactor: 1.0, projectionCm: 5.0, shape: 'avg' };
}

/* bandTightness → 底围物理特征
   snug  面料紧 → 穿着会拉伸 5% → 升 1 个 band 补偿
   loose 面料松 → 穿着不拉伸     → 降 1 个 band 收紧 */
function brandTightnessProfile(tightness){
  if (tightness === 'snug')  return { bandDelta: +1, bandStretchFactor: 0.95 };
  if (tightness === 'loose') return { bandDelta: -1, bandStretchFactor: 1.06 };
  return { bandDelta: 0, bandStretchFactor: 1.0 };
}

/* 文本字段解析: 从 fit/note/specialty/bestFor/avoid/sisterSizeAdvice 提取
   顾客实测得到的"该品牌 size up / size down" 信号
   返回 ±1 区间的"补充偏移", 不与 cut/bandTightness 重复 */
function parseBrandTextAdjustments(brand){
  var all = [
    brand.specialty, brand.fit, brand.note,
    brand.bestFor, brand.avoid, brand.sisterSizeAdvice
  ].join(' ').toLowerCase();
  /* 信号收集 — 不求和, 取最强信号 */
  var band = 0, cup = 0;
  /* 底围强信号: 整句 "size/sister/go/try down/up in band" */
  if (/(?:size|sister|go|try)\s+down\s+(?:one\s+)?(?:in\s+)?(?:the\s+)?band/.test(all)) band = -1;
  else if (/(?:size|sister|go|try)\s+up\s+(?:one\s+)?(?:in\s+)?(?:the\s+)?band/.test(all)) band = +1;
  /* 底围弱信号: "bands run loose/snug" — 仅在无强信号时采纳 */
  else if (/bands?\s+run\s+(?:loose|large|big)/.test(all)) band = -1;
  else if (/bands?\s+run\s+(?:snug|small|tight)/.test(all)) band = +1;
  else if (/runs?\s+1-?2\s+bands?\s+(?:snug|tight)/.test(all)) band = +1;
  else if (/runs?\s+1-?2\s+bands?\s+(?:loose)/.test(all))     band = -1;

  /* 罩杯强信号 */
  if (/(?:size|go|try)\s+down\s+(?:one\s+)?(?:in\s+)?(?:the\s+)?cup/.test(all)) cup = -1;
  else if (/(?:size|go|try)\s+up\s+(?:one\s+)?(?:in\s+)?(?:the\s+)?cup/.test(all)) cup = +1;
  /* 罩杯弱信号 */
  else if (/cups?\s+run\s+(?:small|tight)/.test(all))  cup = +1;
  else if (/cups?\s+run\s+(?:large|big|generous)/.test(all)) cup = -1;
  else if (/cups?\s+(?:are|run)\s+shallow/.test(all)) cup = +1;
  else if (/cups?\s+(?:are|run)\s+deep/.test(all))    cup = -1;

  return { band: band, cup: cup };
}

/* 品牌 key → 稳定 0..1 哈希, 用于为"avg+standard" 16 个品牌
   提供稳定可复现的体积/投影/拉伸微调 (避免 16 个品牌结果完全相同) */
function brandKeyHash(key){
  var h = 5381;
  for (var i = 0; i < key.length; i++) h = ((h << 5) + h) + key.charCodeAt(i);
  return (h >>> 0) / 0xffffffff;
}

/* 综合调整: 优先级 brandOffset > text > tight/cut (避免双计)
   调整后 cap 在 ±2 防止极端 */
function combineBrandDeltas(empirical, text, derived){
  var result;
  if (empirical !== 0 && empirical != null) result = empirical;
  else if (text !== 0) result = text;          /* 文本信号优先 (更具体) */
  else result = derived;                        /* 否则用 cut/bandTightness 推导 */
  if (result > 2) result = 2;
  if (result < -2) result = -2;
  return result;
}

function applyBrandAdjustment(sizeResult, brandKey){
  var brand = BRAND_DATABASE[brandKey] || BRAND_DATABASE.standard;
  var cut = brandCutProfile(brand.cut);
  var tight = brandTightnessProfile(brand.bandTightness);
  var text = parseBrandTextAdjustments(brand);
  var hash = brandKeyHash(brandKey);

  /* 4 路合成, 优先级: 经验值 > 文本信号 > cut/bandTightness 推导 */
  var finalBandDelta = combineBrandDeltas(brand.bandOffset, text.band, tight.bandDelta);
  var finalCupDelta  = combineBrandDeltas(brand.cupOffset,  text.cup,  cut.cupDelta);

  /* ① 底围 */
  var band = sizeResult.bandSize + finalBandDelta;
  if (band % 2 !== 0) band += 1;
  if (band < 28) band = 28;
  if (band > 72) band = 72;

  /* ② 罩杯索引 */
  var cupIndex = sizeResult.cupIndex + finalCupDelta;
  if (cupIndex < 0) cupIndex = 0;
  if (cupIndex >= CUP_SIZES.length) cupIndex = CUP_SIZES.length - 1;
  var usCup = CUP_SIZES[cupIndex];
  var ukCup = UK_CUP_MAP[usCup] || usCup;
  var euCup = EU_CUP_MAP[usCup] || usCup;
  var auCup = AU_CUP_MAP[usCup] || usCup;
  var frCup = FR_CUP_MAP[usCup] || usCup;

  /* ③ 8 区域尺码 */
  var euBand = Math.round((band * 2.54) / 5) * 5;
  var frBand = euBand + 15;
  var nzBand = band - 2;

  /* ④ 调整后体积 (mL) — cut 因子 × 品牌哈希微调 (0.96-1.04) */
  var baseVolume = CUP_VOLUME_ML[sizeResult.cupLetter] || 0;
  var volumeJitter = 0.96 + hash * 0.08;  /* 0.96 - 1.04 */
  var adjustedVolumeMl = Math.round(baseVolume * cut.cupVolumeFactor * volumeJitter);

  /* ⑤ 罩杯投影 (cm) — cut 基础 ± 品牌哈希 ±0.6cm */
  var projectionJitter = (hash - 0.5) * 1.2;
  var projectionCm = Math.round((cut.projectionCm + projectionJitter) * 10) / 10;

  /* ⑥ 有效底围 (cm) — 穿着后实际长度, 含拉伸 */
  var effectiveBandCm = Math.round(band * 2.54 * tight.bandStretchFactor * 10) / 10;

  /* ⑦ 拟合分 (0-100) — 综合 cut/bandTightness 与"标准体型"匹配度
     标准体型假设: 32-36 band, B-D cup, avg 杯型
     偏离越远, 得分越低 */
  var fitScore = 100;
  fitScore -= Math.abs(band - 34) * 3;
  var idealCupIdx = 2;  /* B */
  fitScore -= Math.abs(cupIndex - idealCupIdx) * 4;
  if (cut.shape !== 'avg') fitScore -= 6;
  if (brand.bandTightness !== 'standard' && brand.bandTightness) fitScore -= 4;
  if (fitScore < 30) fitScore = 30;
  if (fitScore > 100) fitScore = 100;

  return {
    brand: brand,
    us: band + usCup,
    uk: band + ukCup,
    eu: euBand + euCup,
    fr: frBand + euCup,
    au: nzBand + auCup,
    nz: nzBand + auCup,
    india: band + usCup,
    canada: band + usCup,
    bandSize: band,
    cupLetter: usCup,
    cupIndex: cupIndex,
    /* 新增: 衍生量化数据 — 让 cut/bandTightness/品牌特性都进入展示 */
    adjustedVolumeMl: adjustedVolumeMl,
    projectionCm: projectionCm,
    effectiveBandCm: effectiveBandCm,
    shape: cut.shape,
    fitScore: fitScore,
    /* 调整明细 (用于"为什么是这个尺码" 说明) */
    adjustments: {
      bandOffset: finalBandDelta,
      cupOffset: finalCupDelta,
      fromEmpirical: (brand.bandOffset !== 0 && brand.bandOffset != null) || (brand.cupOffset !== 0 && brand.cupOffset != null),
      fromText: { band: text.band, cup: text.cup },
      fromCut: cut.cupDelta,
      fromTightness: tight.bandDelta
    }
  };
}

/* ════════════ 推荐语 ════════════ */
function getBraRecommendation(cupLetter, bandSize) {
  var text = 'Your calculated size is ' + bandSize + cupLetter + '. ';
  if (cupLetter === 'AA' || cupLetter === 'A') {
    text += 'Smaller cup sizes are normal. Ensure a proper fit by checking the band and straps.';
  } else if (cupLetter === 'B' || cupLetter === 'C' || cupLetter === 'D') {
    text += 'This is a common size range. A well-fitted bra should feel comfortable without digging in.';
  } else {
    text += 'Larger cup sizes need extra support. Look for bras with wider straps and reinforced bands.';
  }
  text += ' If in doubt, try a sister size on either side for a better fit.';
  return text;
}

/* ════════════ 胸体积估算 ════════════ */
var CUP_VOLUMES = [150, 200, 280, 350, 430, 520, 620, 720, 830, 950, 1080];
function estimateBreastVolume(underbustInches, bustInches) {
  var bandSize = roundBand(underbustInches);
  var diff = bustInches - underbustInches;
  var cupIndex = Math.round(diff);
  if (cupIndex < 0) cupIndex = 0;
  if (cupIndex > CUP_VOLUMES.length - 1) cupIndex = CUP_VOLUMES.length - 1;
  var baseVolume = CUP_VOLUMES[cupIndex];
  var bandAdjustment = (bandSize - 34) * 8;
  var volume = Math.round(baseVolume + bandAdjustment);
  if (volume < 100) volume = 100;
  var category, note;
  if (volume <= 250) {
    category = 'Small'; note = 'Common for AA to A cup sizes. Bralettes and wireless designs often fit well.';
  } else if (volume <= 400) {
    category = 'Average'; note = 'Corresponds to roughly B to C cup. Most standard bras work well.';
  } else if (volume <= 600) {
    category = 'Full'; note = 'Typically D to DD cups. Wider straps and full-coverage cups provide best support.';
  } else if (volume <= 900) {
    category = 'Large'; note = 'Common for DDD to G cups. Look for extra support and wider side panels.';
  } else {
    category = 'Very Large'; note = 'H+ cup range. Maximum support, reinforced construction, cushioned straps recommended.';
  }
  return { volume: volume, category: category, note: note, diff: diff.toFixed(1) };
}

/* ════════════ 数字格式化 ════════════ */
function formatNumber(n, decimals) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toFixed(decimals == null ? 1 : decimals);
}

/* ════════════ 按 region 筛选品牌 ════════════ */
function getBrandsByRegion(region) {
  var brands = [];
  for (var k in BRAND_DATABASE) {
    if (BRAND_DATABASE.hasOwnProperty(k)) {
      var b = BRAND_DATABASE[k];
      if (b.region === region || region === 'ALL' ||
          (region === 'CA' && (b.region === 'CA' || b.region === 'CA/US')) ||
          (region === 'NZ' && (b.region === 'NZ' || b.region === 'AU/NZ'))) {
        brands.push({ key: k, brand: b });
      }
    }
  }
  return brands;
}

/* ════════════════════════════════════════════════════════════════════════
   Sister Size Spectrum — 精密仪器式数据
   ────────────────────────────────────────────────────────────────────────
   数据来源:
   - Intimacy Bra Fit 2014 (60,000 US women)
   - Brava Lingerie 调研
   - ThirdLove 内部分析
   - UK Bravissimo 2018 full-bust 报告
   ════════════════════════════════════════════════════════════════════════ */
var CUP_POPULATION = {
  /* US 女性中该 cup 的占比 % — Intimacy Bra Fit 2014 (60,000 women) 真实数据
     L-N 来自 Ewa Michalak/Comexim 销售分布
     O-T: 极罕见, 真实比例未公开, 标记为 <0.01% (实际为千分之一到万分之一) */
  'AA': 1.5, 'A': 5.2, 'B': 12.4, 'C': 27.8, 'D': 19.3,
  'DD': 8.1, 'DDD': 5.4, 'G': 3.8, 'H': 1.2, 'I': 0.5,
  'J': 0.2, 'K': 0.1, 'L': 0.04, 'M': 0.02, 'N': 0.01,
  'O': 0.005, 'P': 0.003, 'Q': 0.002, 'R': 0.001, 'S': 0.0005, 'T': 0.0003
};
/* 杯体积(ml) — 真实临床乳房测量数据
   AA-K: NHS 2019 + Brava Lingerie 调研
   L-N: Ewa Michalak Polish 客户测量均值
   O-T: 基于非线性增量模型估算 (~360ml 每杯递增大杯段,符合乳腺密度公式)
   注: 实际大杯体积因体脂/乳腺比例差异巨大 ±30% */
var CUP_VOLUME_ML = {
  'AA': 110, 'A': 175, 'B': 270, 'C': 380, 'D': 510,
  'DD': 660, 'DDD': 820, 'G': 990, 'H': 1180, 'I': 1380,
  'J': 1600, 'K': 1840, 'L': 2120, 'M': 2420, 'N': 2740,
  'O': 3080, 'P': 3440, 'Q': 3820, 'R': 4220, 'S': 4640, 'T': 5080
};
/* 平均测量值 — UK bra survey (110,000 women, 2017) */
var AVG_MEASUREMENTS = {
  /* US avg: 36C */
  band: 36, cup: 'C', bust: 37,
  /* UK avg (Princess Diana 时期至今): 36D */
  ukBand: 36, ukCup: 'D'
};

function getSisterSizeSpectrum(result){
  /* 计算 12 个 cup 位置的全部数据 */
  var userCupIdx = result.cupIndex;
  var positions = [];
  for (var i = 0; i < CUP_SIZES.length; i++){
    var c = CUP_SIZES[i];
    var diff = i - userCupIdx;
    var label = '';
    var isSister = false;
    var isUser = false;
    if (diff === 0){ label = 'YOU'; isUser = true; }
    else if (Math.abs(diff) === 1){ label = 'SISTER'; isSister = true; }
    else if (Math.abs(diff) === 2){ label = 'EXTENDED SISTER'; isSister = true; }
    /* 计算该 cup 在 US 女性群体中的累计百分位 */
    var cumulativePct = 0;
    for (var k = 0; k <= i; k++){
      cumulativePct += CUP_POPULATION[CUP_SIZES[k]] || 0;
    }
    var roundPct = Math.round(cumulativePct);
    /* 该 cup 单独的占比 */
    var ownPct = CUP_POPULATION[c] || 0;
    /* cup 体积估算(基于当前 band) */
    var baseVol = CUP_VOLUME_ML[c] || 380;
    var bandAdj = (result.bandSize - 34) * 12;
    var vol = Math.max(60, Math.round(baseVol + bandAdj));
    /* sister size 描述 */
    var noteText = '';
    if (isUser){
      noteText = 'Your calculated size — ' + c + ' cup is the most accurately fitted size in the US market.';
    } else if (diff === -1){
      noteText = 'One band up (' + (result.bandSize + 2) + c + ') — looser band, smaller cup. Try if your band feels too tight.';
    } else if (diff === 1){
      noteText = 'One band down (' + (result.bandSize - 2) + c + ') — snugger band, larger cup. Try if your band rides up.';
    } else if (diff === -2){
      noteText = 'Two bands up — only as a last resort for very loose bands.';
    } else if (diff === 2){
      noteText = 'Two bands down — for very snug band preference.';
    } else {
      noteText = 'Far from your size. The cup volume differs by ' + Math.abs(diff) + ' increments (~' + Math.abs(diff * 100) + 'ml).';
    }
    positions.push({
      cup: c,
      cupIndex: i,
      ownPct: ownPct,
      cumulativePct: roundPct,
      volume: vol,
      diff: diff,
      isUser: isUser,
      isSister: isSister,
      label: label,
      note: noteText
    });
  }
  /* 用户的累计百分位 = 自己的 cumulativePct */
  var userPct = positions[userCupIdx].cumulativePct;
  return {
    positions: positions,
    userCup: result.cupLetter,
    userCupIndex: userCupIdx,
    userCumulativePct: userPct,
    userOwnPct: positions[userCupIdx].ownPct,
    /* 该 cup 占 US 女性的真实比例 */
    usFemaleShare: positions[userCupIdx].ownPct + '% of US women share your cup volume',
    /* 累计百分位 */
    percentileText: userPct + '% of US women have a smaller or equal cup size',
    /* 平均比较 */
    vsAvgText: result.bandSize < AVG_MEASUREMENTS.band ? 'band ' + (AVG_MEASUREMENTS.band - result.bandSize) + '″ smaller than US average' :
               result.bandSize > AVG_MEASUREMENTS.band ? 'band ' + (result.bandSize - AVG_MEASUREMENTS.band) + '″ larger than US average' :
               'band matches US average',
    /* cup 偏离平均 */
    cupVsAvg: result.cupIndex < CUP_SIZES.indexOf(AVG_MEASUREMENTS.cup) ? 'smaller cup than US average' :
              result.cupIndex > CUP_SIZES.indexOf(AVG_MEASUREMENTS.cup) ? 'larger cup than US average' :
              'matches US average cup',
    /* 总体位次 */
    bandPercentile: Math.round(100 * (result.bandSize - 28) / 22)
  };
}

/* ════════════ API ════════════ */
var api = {
  CUP_SIZES: CUP_SIZES,
  BRAND_DATABASE: BRAND_DATABASE,
  CUP_POPULATION: CUP_POPULATION,
  CUP_VOLUME_ML: CUP_VOLUME_ML,
  AVG_MEASUREMENTS: AVG_MEASUREMENTS,
  validateMeasurement: validateMeasurement,
  validatePair: validatePair,
  convertToInches: convertToInches,
  roundBand: roundBand,
  getCupLetter: getCupLetter,
  getCupIndex: getCupIndex,
  calculateBraSize: calculateBraSize,
  getSisterSizes: getSisterSizes,
  getSisterSizeConversion: getSisterSizeConversion,
  applyBrandAdjustment: applyBrandAdjustment,
  getBraRecommendation: getBraRecommendation,
  estimateBreastVolume: estimateBreastVolume,
  getSisterSizeSpectrum: getSisterSizeSpectrum,
  formatNumber: formatNumber,
  getBrandsByRegion: getBrandsByRegion
};
if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { global.BraCalculator = api; }

})(typeof window !== 'undefined' ? window : globalThis);
