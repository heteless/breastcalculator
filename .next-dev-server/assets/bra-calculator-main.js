/* ==========================================================================
   bra-calculator-main.js — 简洁、可靠的 Calculator 核心
   --------------------------------------------------------------------------
   - 文档级 click/submit 委托 — 总是能捕获按钮
   - 不依赖 form 已被 "enhance" 过
   - 计算逻辑直接调用 window.BraCalculator
   - 总是显示 celebration 卡片
   ========================================================================== */
(function (){'use strict';

var BC = (typeof window !== 'undefined' && window.BraCalculator) || null;
if (!BC){console.warn('[bc-main] BraCalculator not loaded');return;}

function $(sel, ctx){return (ctx || document).querySelector(sel);}
function $$(sel, ctx){return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));}

/* ──────────────────────────────────────────────────────────
   优雅状态指示器 — 不暴露任何后端细节
   ────────────────────────────────────────────────────────── */
function setStatus(type, message, subMessage){
  var el = document.getElementById('bc-debug');
  if (!el) return;
  if (message == null){
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  el.hidden = false;
  var iconMap = { ready: '✓', success: '✓', error: '!', loading: '·' };
  var icon = iconMap[type] || '✓';
  var sub = subMessage ? '<span class="bc-debug-sub">' + subMessage + '</span>' : '';
  el.className = 'bc-debug bc-debug-' + type;
  el.innerHTML =
    '<span class="bc-debug-mark" aria-hidden="true">' + icon + '</span>' +
    '<span class="bc-debug-body">' +
      '<span class="bc-debug-msg">' + message + '</span>' +
      sub +
    '</span>';
}

function getFormFromContext(el){
  while (el && el !== document.body){
    if (el.tagName === 'FORM') return el;
    el = el.parentElement;
  }
  return null;
}

function readForm(form){
  var ub = $('input[name="underbust"],#underbust', form);
  var b  = $('input[name="bust"],#bust', form);
  var u  = $('select#unit,select[name="unit"]', form);
  if (!ub || !b) return null;
  return {
    ub: parseFloat(ub.value),
    bust: parseFloat(b.value),
    unit: (u && u.value) || 'inches',
    ubEl: ub, bEl: b, uEl: u
  };
}

function unitKey(s){return s === 'inches' || s === 'inch' ? 'inch' : (s === 'centimeters' || s === 'cm') ? 'cm' : (s === 'millimeters' || s === 'mm') ? 'mm' : 'inch';}

function getResultEl(form){
  return $('#size-result', form.parentElement) || $('.calc-result', form.parentElement) || $('[data-result]', form.parentElement);
}

function getSisterContainer(form){
  return $('[data-sister-sizes]', form.parentElement);
}

function getBrandResult(form){
  return $('[data-brand-result]', form.parentElement);
}

function getBrandSelect(form){
  return $('select#brand', form) || $('select#brand', form.parentElement) || document.getElementById('brand');
}

function populateBrandSelect(){
  if (typeof BC === 'undefined' || !BC.BRAND_DATABASE) return;
  var sel = document.getElementById('brand');
  if (!sel) return;
  if (sel.dataset.bcPopulated === '1') return;
  sel.dataset.bcPopulated = '1';
  /* 按 region 分组 */
  var groups = {
    'US': { label: '🇺🇸 United States', items: [] },
    'UK': { label: '🇬🇧 United Kingdom', items: [] },
    'EU': { label: '🇪🇺 Europe (EU)', items: [] },
    'AU': { label: '🇦🇺 Australia', items: [] },
    'NZ': { label: '🇳🇿 New Zealand', items: [] },
    'CA': { label: '🇨🇦 Canada', items: [] }
  };
  var keys = Object.keys(BC.BRAND_DATABASE);
  for (var i = 0; i < keys.length; i++){
    var k = keys[i];
    if (k === 'standard') continue;
    var b = BC.BRAND_DATABASE[k];
    var g = b.region;
    if (g === 'CA/US') g = 'CA';
    if (g === 'AU/NZ') g = 'AU';
    if (!groups[g]) g = 'US';
    groups[g].items.push({ key: k, brand: b });
  }
  /* 排序:按品牌名字 */
  for (var gk in groups){
    if (groups[gk].items){
      groups[gk].items.sort(function(a, b){
        return a.brand.name.localeCompare(b.brand.name);
      });
    }
  }
  /* 清空后插入分组 */
  sel.innerHTML = '';
  var defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '— Select a brand for tailored fit —';
  sel.appendChild(defaultOpt);
  var groupOrder = ['US','UK','EU','AU','NZ','CA'];
  for (var oi = 0; oi < groupOrder.length; oi++){
    var gname = groupOrder[oi];
    var g = groups[gname];
    if (!g || !g.items || g.items.length === 0) continue;
    var og = document.createElement('optgroup');
    og.label = g.label;
    for (var j = 0; j < g.items.length; j++){
      var item = g.items[j];
      var opt = document.createElement('option');
      opt.value = item.key;
      opt.textContent = item.brand.name + (item.brand.country ? ' · ' + item.brand.country : '');
      og.appendChild(opt);
    }
    sel.appendChild(og);
  }
  /* 监听选择,实时显示品牌提示 */
  sel.addEventListener('change', function(){
    var hint = document.getElementById('brand-hint');
    if (!hint) return;
    var b = BC.BRAND_DATABASE[sel.value];
    if (b){
      hint.textContent = b.specialty + ' — ' + b.fit;
    } else {
      hint.textContent = 'Sizing varies by brand. Pick yours for a more accurate size.';
    }
  });
}

/* ──────────────────────────────────────────────────────────
   Quick Fill — 美国女性最常见尺码快捷填充
   ────────────────────────────────────────────────────────── */
/* Quick Fill 数据集 — 必须与 calculateBraSize 严格自洽
   算法: band = round(ub) → 偶数; diff = bust - band; cup = diff
   每条数据都按此反推 ub/bust, 确保 size 标签就是实际计算结果 */
var QUICK_FILL_DATA = [
  /* 32A: 小号底围(ub 30, band=30+1=31→32, diff=1, A) */
  { size: '32A',  ub: 31, bust: 33, body: 'Petite',     desc: 'Petite' },
  /* 34B: 标准底围(ub 33, band=33+1=34, diff=2, B) */
  { size: '34B',  ub: 33, bust: 36, body: 'Slim avg',   desc: 'Slim avg' },
  /* 36C: US 最常见尺码(ub 35, band=35+1=36, diff=3, C) */
  { size: '36C',  ub: 35, bust: 39, body: 'US avg',     desc: 'US avg', highlight: true },
  /* 34DD: 瘦底围大杯(ub 33, band=34, diff=5, DD) */
  { size: '34DD', ub: 33, bust: 39, body: 'Slim+cup',   desc: 'Slim+cup' },
  /* 38C: 大底围标准杯(ub 37, band=37+1=38, diff=3, C) */
  { size: '38C',  ub: 37, bust: 41, body: 'Fuller',     desc: 'Fuller' },
  /* 40B: 大底围小杯(ub 39, band=39+1=40, diff=2, B) */
  { size: '40B',  ub: 39, bust: 42, body: 'Plus',       desc: 'Plus' }
];

function renderQuickFill(form){
  if (form.querySelector('.bc-quick-templates')) return; /* 已存在 */
  var container = document.createElement('div');
  container.className = 'bc-quick-templates';
  /* 标题 + 装饰线 */
  var label = document.createElement('div');
  label.className = 'bc-quick-label';
  label.innerHTML = '<span class="bc-quick-label-text">Quick fill</span>';
  container.appendChild(label);
  /* 6 个 chip 网格 */
  var grid = document.createElement('div');
  grid.className = 'bc-quick-grid';
  for (var i = 0; i < QUICK_FILL_DATA.length; i++){
    (function(item){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bc-quick-btn' + (item.highlight ? ' bc-quick-btn-avg' : '');
      btn.setAttribute('aria-label', 'Use ' + item.size + ' (' + item.body + ')');
      btn.innerHTML =
        '<span class="bc-quick-size">' + item.size + '</span>' +
        '<span class="bc-quick-hint">' + item.desc + '</span>';
      btn.addEventListener('click', function(){
        var ub = document.getElementById('underbust');
        var b  = document.getElementById('bust');
        var unit = document.getElementById('unit');
        /* Quick Fill 数据以英寸为基准: 如果当前选择 cm, 转换并填入 */
        var curUnit = (unit && unit.value) || 'inches';
        var ubVal = item.ub;
        var bVal  = item.bust;
        if (curUnit === 'cm'){
          /* inch -> cm: 保留 1 位小数 */
          ubVal = Math.round(item.ub * 2.54 * 10) / 10;
          bVal  = Math.round(item.bust * 2.54 * 10) / 10;
        }
        if (ub) ub.value = ubVal;
        if (b)  b.value  = bVal;
        /* unit.value 不强制覆盖 — 保留用户选择, 通过 setUnit 同步 UI */
        if (window.__bcMain && window.__bcMain.setUnit){
          window.__bcMain.setUnit(curUnit);
        }
        /* 高亮被点击的 */
        var all = container.querySelectorAll('.bc-quick-btn');
        for (var k = 0; k < all.length; k++) all[k].classList.remove('bc-quick-btn-active');
        btn.classList.add('bc-quick-btn-active');
        /* 立即计算 */
        runCalculation(form);
      });
      grid.appendChild(btn);
    })(QUICK_FILL_DATA[i]);
  }
  container.appendChild(grid);
  /* 插到 Calculate 按钮之前(在 .calc-actions 之前) */
  var actions = form.querySelector('.calc-actions');
  if (actions) form.insertBefore(container, actions);
  else form.appendChild(container);
}

/* 确保 celebrate 卡片存在 */
function ensureCelebrate(form, resultEl){
  var existing = $('.bc-celebrate', resultEl);
  if (existing) return existing;
  if (!resultEl) return null;
  var cel = document.createElement('div');
  cel.className = 'bc-celebrate';
  cel.hidden = true;
  cel.innerHTML =
    '<div class="bc-celebrate-confetti" aria-hidden="true"></div>' +
    '<div class="bc-celebrate-icon" id="size-icon">✨</div>' +
    '<div class="bc-celebrate-eyebrow">Your perfect fit</div>' +
    '<div class="bc-celebrate-size-wrap">' +
      '<div class="bc-celebrate-size" id="size-us-3">—</div>' +
      '<div class="bc-celebrate-rare-pct" id="size-rare">—</div>' +
    '</div>' +
    '<div class="bc-celebrate-headline" id="size-headline">—</div>' +
    '<div class="bc-celebrate-sub" id="size-sub">—</div>' +
    '<div class="bc-celebrate-styles">' +
      '<div class="bc-celebrate-styles-title">Styles we love on you</div>' +
      '<div class="bc-celebrate-styles-list" id="size-styles">—</div>' +
    '</div>' +
    '<div class="bc-celebrate-sizes-card">' +
      '<div class="bc-celebrate-sizes-head">' +
        '<div class="bc-celebrate-sizes-title">Your recommended size, by region</div>' +
        '<div class="bc-celebrate-sizes-sub">Built from US standards, then mapped to UK, EU, France, Australia, New Zealand, India, and Canada — for the brands that ship to your door.</div>' +
      '</div>' +
      '<div class="bc-celebrate-sizes-grid" id="size-regions">' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">US</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-us-2">—</div>' +
        '</div>' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">UK</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-uk-2">—</div>' +
        '</div>' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">EU</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-eu-2">—</div>' +
        '</div>' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">FR/BE</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-fr-2">—</div>' +
        '</div>' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">AU</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-au-2">—</div>' +
        '</div>' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">NZ</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-nz-2">—</div>' +
        '</div>' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">India</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-india-2">—</div>' +
        '</div>' +
        '<div class="bc-celebrate-size-region">' +
          '<div class="bc-celebrate-size-region-name">Canada</div>' +
          '<div class="bc-celebrate-size-region-value" id="size-canada-2">—</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="bc-celebrate-sister-card" id="size-sister-card">' +
      '<div class="bc-celebrate-sister-head">' +
        '<div class="bc-celebrate-sister-eyebrow"><span class="bc-celebrate-sister-dot"></span>Sister Size Spectrum</div>' +
        '<div class="bc-celebrate-sister-title">Where you fall on the cup spectrum</div>' +
        '<div class="bc-celebrate-sister-sub" id="size-sister-sub">Calculating your position across 12 cup sizes and 23 band sizes…</div>' +
      '</div>' +
      '<div class="bc-celebrate-sister-gauge" id="size-sister-gauge">' +
        '<div class="bc-celebrate-sister-gear bc-celebrate-sister-gear-top" aria-hidden="true"></div>' +
        '<div class="bc-celebrate-sister-gear bc-celebrate-sister-gear-bottom" aria-hidden="true"></div>' +
        '<div class="bc-celebrate-sister-track">' +
          '<div class="bc-celebrate-sister-ruler" id="size-sister-ruler"></div>' +
          '<div class="bc-celebrate-sister-bars" id="size-sister-bars"></div>' +
          '<div class="bc-celebrate-sister-needle" id="size-sister-needle" aria-hidden="true">' +
            '<div class="bc-celebrate-sister-needle-pin"></div>' +
            '<div class="bc-celebrate-sister-needle-line"></div>' +
            '<div class="bc-celebrate-sister-needle-flag">' +
              '<div class="bc-celebrate-sister-needle-cup" id="size-sister-needle-cup">—</div>' +
              '<div class="bc-celebrate-sister-needle-lbl" id="size-sister-needle-lbl">YOU</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="bc-celebrate-sister-axis" id="size-sister-axis" aria-hidden="true"></div>' +
        '<div class="bc-celebrate-sister-readout">' +
          '<div class="bc-celebrate-sister-readout-row">' +
            '<span class="bc-celebrate-sister-readout-label">Your share</span>' +
            '<span class="bc-celebrate-sister-readout-value" id="size-sister-share">—</span>' +
          '</div>' +
          '<div class="bc-celebrate-sister-readout-row">' +
            '<span class="bc-celebrate-sister-readout-label">Percentile</span>' +
            '<span class="bc-celebrate-sister-readout-value" id="size-sister-pct">—</span>' +
          '</div>' +
          '<div class="bc-celebrate-sister-readout-row">' +
            '<span class="bc-celebrate-sister-readout-label">Volume</span>' +
            '<span class="bc-celebrate-sister-readout-value" id="size-sister-vol">—</span>' +
          '</div>' +
          '<div class="bc-celebrate-sister-readout-row">' +
            '<span class="bc-celebrate-sister-readout-label">vs US avg</span>' +
            '<span class="bc-celebrate-sister-readout-value" id="size-sister-vs">—</span>' +
          '</div>' +
        '</div>' +
        '<div class="bc-celebrate-sister-legend">' +
          '<span class="bc-celebrate-sister-legend-item"><span class="bc-celebrate-sister-legend-dot bc-celebrate-sister-legend-you"></span>You</span>' +
          '<span class="bc-celebrate-sister-legend-item"><span class="bc-celebrate-sister-legend-dot bc-celebrate-sister-legend-sister"></span>Sister size</span>' +
          '<span class="bc-celebrate-sister-legend-item"><span class="bc-celebrate-sister-legend-dot bc-celebrate-sister-legend-ext"></span>Extended sister</span>' +
          '<span class="bc-celebrate-sister-legend-item"><span class="bc-celebrate-sister-legend-bar"></span>US women share</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="bc-celebrate-brand-card" id="size-brand-card" hidden>' +
      '<div class="bc-celebrate-brand-head">' +
        '<div class="bc-celebrate-brand-title">Brand-specific size</div>' +
        '<div class="bc-celebrate-brand-sub" id="size-brand-sub">—</div>' +
      '</div>' +
      '<div class="bc-celebrate-brand-grid" id="size-brand-grid"></div>' +
      '<div class="bc-celebrate-brand-info" id="size-brand-info" hidden></div>' +
    '</div>' +
    '<div class="bc-celebrate-actions">' +
      '<button type="button" class="bc-celebrate-action bc-celebrate-action-primary" data-bc-action="print">' +
        '<span aria-hidden="true">🖨</span><span>Print my size</span>' +
      '</button>' +
      '<button type="button" class="bc-celebrate-action" data-bc-action="print">' +
        '<span aria-hidden="true">🖨</span><span>Print</span>' +
      '</button>' +
      '<button type="button" class="bc-celebrate-action" data-bc-action="share">' +
        '<span aria-hidden="true">↗</span><span>Share</span>' +
      '</button>' +
      '<button type="button" class="bc-celebrate-action bc-celebrate-action-reset" data-bc-action="reset">' +
        '<span aria-hidden="true">↺</span><span>Start Over</span>' +
      '</button>' +
    '</div>' +
    '<div class="bc-celebrate-tip" id="size-tip">—</div>' +
    '<div class="bc-celebrate-privacy">' +
      '<span class="bc-celebrate-privacy-icon" aria-hidden="true">🔒</span>' +
      '<span>Your measurements never leave your device. Processed entirely in your browser — no accounts, no tracking, no data uploaded, ever.</span>' +
    '</div>';
  /* 插到 .size-primary 之前 */
  var primary = $('.size-primary', resultEl);
  if (primary) resultEl.insertBefore(cel, primary);
  else resultEl.insertBefore(cel, resultEl.firstChild);
  return cel;
}

/* Fire confetti */
function fireConfetti(host){
  if (!host) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  host.innerHTML = '';
  var colors = ['#d4a574','#8b6f5f','#c8956d','#a07856','#6b5344','#f0d4a8','#fff2d8'];
  var shapes = ['●','◆','★','✦','❀','✿'];
  var n = 28;
  for (var i = 0; i < n; i++){
    var p = document.createElement('span');
    p.className = 'bc-confetti-piece';
    p.textContent = shapes[i % shapes.length];
    p.style.position = 'absolute';
    p.style.left = (Math.random() * 100) + '%';
    p.style.top = '-20px';
    p.style.color = colors[i % colors.length];
    p.style.fontSize = (10 + Math.random() * 14) + 'px';
    p.style.animation = 'bcConfettiFall ' + (1.6 + Math.random() * 1.6) + 's ' + (Math.random() * 0.4) + 's cubic-bezier(0.45,0.05,0.55,0.95) forwards';
    p.style.zIndex = '1';
    host.appendChild(p);
    (function(el){setTimeout(function(){if (el && el.parentNode) el.parentNode.removeChild(el);}, 3600);})(p);
  }
}

/* Insignts data (minimal subset needed) */
var SIZE_INSIGHTS = {
  'AA':{rarity:'Only 2% of US women wear AA cup — a quietly rare size.',icon:'🌸',mood:'Delicate & graceful',styles:['Bralettes','Wireless triangle cups','Lightly-lined t-shirt bras','Plunge styles for V-necks']},
  'A': {rarity:'About 5% of US women share your A cup.',icon:'🌷',mood:'Effortless & feminine',styles:['Push-up plunge','Demi-cup','Lace-trim bralettes','Front-close styles']},
  'B': {rarity:'Around 11% of US women wear B. Solid company.',icon:'🌹',mood:'Naturally classic',styles:['Balconette','T-shirt bra','Strapless','Lace demi']},
  'C': {rarity:'C cup is the most common US size — 28% of American women share yours.',icon:'✨',mood:'Confident & iconic',styles:['Full-coverage T-shirt','Demi','Plunge','Push-up','Strapless']},
  'D': {rarity:'About 18% of US women wear D. A size that walks the line.',icon:'💎',mood:'Bold & sculptural',styles:['Full-coverage','Side-support','Lace balconette','Strapless with grip']},
  'DD':{rarity:'Only 8% of US women wear DD. An exclusive club.',icon:'💫',mood:'Sculptural & statement',styles:['Side-support','Full-coverage lace','Wide-strap T-shirt','Minimizer under T-shirts']},
  'DDD':{rarity:'A real rarity — about 5% of US women share your E/DDD.',icon:'👑',mood:'Powerful & celebrated',styles:['4-hook band','Wide cushioned straps','Side-support','Forward-seam full cup']},
  'G': {rarity:'Less than 4% of US women wear G. Rarified company.',icon:'🌟',mood:'Powerful & celebrated',styles:['Full-cup bra','Wide band with 4+ hooks','Side-support','Sports bra with encapsulation']},
  'H': {rarity:'Less than 2% of US women wear H. A truly rare size.',icon:'👑',mood:'Red-carpet worthy',styles:['Full-cup (no padding)','Wide side panels','Cushioned straps','Longline for support']},
  'I': {rarity:'Less than 1% of US women wear I. Unicorn-tier.',icon:'💎',mood:'Unicorn-tier',styles:['Specialty full-cup','Custom longline','Wide-strapped sports','Front-close for ease']},
  'J': {rarity:'Fewer than 0.5% of US women wear J.',icon:'👑',mood:'Regal',styles:['Bespoke or custom','Full-cup lace','Longline','Sports encapsulation']},
  'K': {rarity:'Top 0.1% of US sizes.',icon:'✨',mood:'Strong & celebrated',styles:['Custom only','Full-cup','Reinforced strap','Bespoke longline']}
};
var BAND_INSIGHTS = {
  28:{note:'A rare 28-band means you likely have a slimmer ribcage — UK brands (Boux Avenue, Freya) carry 28.'},
  30:{note:'A 30-band sits at the slimmer end. Look for brands that go down to 30.'},
  32:{note:'A 32-band is the slimmer of the "standard" range. A true 32 is rare — congratulations on knowing your fit.'},
  34:{note:'A 34-band sits right at the US median. You\'re in the most-stocked range.'},
  36:{note:'A 36-band is the most common US band size. Every style available.'},
  38:{note:'A 38-band is widely stocked. The challenge is finding one that truly fits the cup.'},
  40:{note:'A 40-band is well-supported by plus-size specialty brands. Full structure, not scaled-up B-cup designs.'},
  42:{note:'42-band is well-catered for by Elomi, Goddess, and Lane Bryant Cacique.'},
  44:{note:'44-band is the entry to extended sizing. Real engineering from specialty brands.'},
  46:{note:'46-band is extended range. Specialty boutiques will respect your body better.'},
  48:{note:'48-band is extended. Elomi and Goddess craft real support.'},
  50:{note:'50-band is the largest standard size. Specialty brands carry 50 with full-cup engineering.'}
};

function buildCelebrationMessage(us, band, cup){
  var rarityPct = (SIZE_INSIGHTS[cup] || SIZE_INSIGHTS['C']).rarity.match(/(\d+(?:\.\d+)?)%/) || [,'15'];
  var p = rarityPct[1];
  if (parseFloat(p) < 6) return {headline:'A truly rare size — and a beautiful one.', sub:'You\'re one of only about ' + p + '% of US women who wear your size. Specialty brands are designed with you in mind.', vibe:'rare'};
  if (cup === 'AA' || cup === 'A') return {headline:'A petite, pretty fit.', sub:'You\'re in a beautifully common petite size. Smaller cups are about being perfectly proportioned.', vibe:'petite'};
  if (cup === 'DD' || cup === 'DDD' || cup === 'G' || cup === 'H' || cup === 'I' || cup === 'J' || cup === 'K') return {headline:'A full, sculpted silhouette.', sub:'You\'re in a fuller cup range — and your shape deserves real engineering, not scaled-up B-cup designs.', vibe:'fuller'};
  return {headline:'Welcome to the most-loved size in America.', sub:'You\'re in the same size as the majority of US women — which means every style, every brand, and every color is designed with you in mind.', vibe:'common'};
}

function fillEl(form, id, val){
  /* Try multiple lookups to be bulletproof */
  var el = document.getElementById(id);
  if (!el && form && form.parentElement) el = form.parentElement.querySelector('#' + id);
  if (!el && form) el = form.querySelector('#' + id);
  if (el) el.textContent = val;
  return !!el;
}

function fillAll(form, result){
  var fields = {
    'size-us': result.us,
    'size-uk': result.uk,
    'size-eu': result.eu,
    'size-fr': result.fr,
    'size-au': result.au,
    'size-india': result.india,
    'cup-diff': result.cupLetter,
    'cup-diff-value': result.cupDiff,
    'size-recommendation': BC.getBraRecommendation(result.cupLetter, result.bandSize)
  };
  for (var id in fields) fillEl(form, id, fields[id]);
}

function renderSisterSizes(container, bandSize, cupLetter){
  if (!container || !BC.getSisterSizes) return;
  var sisters = BC.getSisterSizes(bandSize, cupLetter);
  if (!sisters || sisters.length === 0){container.innerHTML = '';return;}
  var html = '<div class="bc-sister-sizes">';
  html += '<h4 class="bc-sister-title">Sister Sizes <span class="bc-sister-hint">(equivalent cup volume)</span></h4>';
  html += '<ul class="bc-sister-list" role="list">';
  for (var i = 0; i < sisters.length; i++){
    var s = sisters[i];
    var cls = 'bc-sister-item' + (s.primary ? ' bc-sister-primary' : '');
    html += '<li class="' + cls + '">';
    html += '<span class="bc-sister-band">' + s.band + '</span>';
    html += '<span class="bc-sister-cup">' + s.cup + '</span>';
    if (s.primary) html += '<span class="bc-sister-badge">Your size</span>';
    html += '</li>';
  }
  html += '</ul></div>';
  container.innerHTML = html;
}

function setLoading(form, loading){
  var btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  if (loading){
    btn.disabled = true;
    btn.dataset.origText = btn.textContent;
    btn.innerHTML = '<span class="bc-spinner" aria-hidden="true"></span><span>Calculating…</span>';
    btn.classList.add('is-loading');
  } else {
    btn.disabled = false;
    if (btn.dataset.origText) btn.textContent = btn.dataset.origText;
    btn.classList.remove('is-loading');
  }
}

function flashSuccess(form){
  var result = form.parentElement && (form.parentElement.querySelector('.calc-result') || form.parentElement.querySelector('#size-result') || form.parentElement.querySelector('[data-result]'));
  if (!result) return;
  result.classList.add('bc-flash-success');
  setTimeout(function(){result.classList.remove('bc-flash-success');},1200);
}

/* 记录当前用户原始尺码, 供 "返回" 交互使用 */
var _userOriginalSize = null;
/* ─── Task 7: GA4 事件追踪 (统一包装) ─── */
function bcTrack(eventName, params){
  try {
    if (typeof window.gtag === 'function'){
      window.gtag('event', eventName, params || {});
    }
  } catch (err){
    /* 静默失败, 不影响主流程 */
  }
}

/* hover debounce 状态 — 防止 hover 事件刷屏 */
var _hoverFired = {};

function renderSisterComparator(result){
  /* Live-update the Sister Size Comparator panel
     每张卡显示: 角色标签 / 尺码 / 底围长度 / 体积 / 罩杯投影 / 迷你 SVG
     支持点击姐妹尺码切换中心 (真实交互, 影响后续渲染) */
  try {
    if (!BC || !BC.getSisterSizes){
      console.warn('[bc-main] BC.getSisterSizes missing');
      return;
    }
    /* 保存用户原始尺码 (首次计算时) */
    if (!_userOriginalSize){
      _userOriginalSize = { band: result.bandSize, cup: result.cupLetter };
    }
    var sisters = BC.getSisterSizes(result.bandSize, result.cupLetter) || [];
    var emptyEl = document.getElementById('bc-history-empty');
    var activeEl = document.getElementById('bc-history-list');
    if (!activeEl){
      console.warn('[bc-main] #bc-history-list not found');
      return;
    }
    if (emptyEl){
      emptyEl.classList.add('bc-compass-hidden');
      emptyEl.setAttribute('hidden', '');
    }
    activeEl.classList.remove('bc-compass-hidden');
    activeEl.removeAttribute('hidden');
    activeEl.style.display = 'block';
    /* 同步 #bc-compass-instrument 的可见性(它与 #bc-history-list 平级, 不受 common.js 销毁) */
    var instrumentEl = document.getElementById('bc-compass-instrument');
    if (instrumentEl){
      instrumentEl.classList.remove('bc-compass-hidden');
      instrumentEl.removeAttribute('hidden');
      instrumentEl.style.display = 'block';
    }

    /* 当前选中 (与 form 同步) 的 primary */
    var currentPrimary = { band: result.bandSize, cup: result.cupLetter };

    /* 渲染 5 张姐妹卡 */
    var sistersEl = document.getElementById('bc-compass-sisters');
    if (sistersEl){
      var shtml = '';
      for (var i = 0; i < sisters.length; i++){
        shtml += buildSisterCardHtml(sisters[i], i, sisters.length, _userOriginalSize, true);
      }
      sistersEl.innerHTML = shtml;
      bindSisterCardClicks(sistersEl);
      bindSisterCheckClicks(sistersEl);
      bindSisterHoverTrack(sistersEl);
    }

    /* Task 5: 渲染换算条 */
    renderConversionRibbon(currentPrimary.band, currentPrimary.cup);

    /* 渲染汇总 + "返回原尺码" 链接 + 行动召唤 */
    renderSisterSummary(sisters, currentPrimary.band, currentPrimary.cup);

    /* Task 7: 首次进入视口打 section_view (IntersectionObserver) */
    ensureSisterSectionObserver();

    /* 滚动到 comparator */
    setTimeout(function(){
      var frame = document.querySelector('.bc-history-frame');
      if (frame && frame.scrollIntoView){
        frame.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    }, 600);
  } catch (err){
    console.error('[bc-main] renderSisterComparator error:', err);
  }
}

/* ──────────────────────────────────────────────────────────
   buildSisterCardHtml — 共享的单卡渲染逻辑
   设计目标:
     1) 优雅的尺寸视觉: 数字 + 斜体小字母
     2) 真实可点击: 姐妹卡有 cursor: pointer + ARIA
     3) 内容完整: 显示体积 / 底围 / 投影 三个数据
     4) "your size" badge 区分用户原尺码
   ────────────────────────────────────────────────────────── */
function buildSisterCardHtml(ss, i, total, userOriginal, withSpin){
  /* 7 张: i=1,2,total-2,total-3 为 sister; 其他为 extended; primary 为 you */
  var role = ss.primary ? 'you' : ((i >= 1 && i <= 2) || (i >= total - 3 && i <= total - 2) ? 'sister' : 'extended');
  var roleLbl = ss.primary ? 'YOU' : (role === 'sister' ? 'SISTER' : 'EXTENDED');
  var vol = BC.CUP_VOLUME_ML ? (BC.CUP_VOLUME_ML[ss.cup] || 0) : 0;
  var bandCm = (ss.band * 2.54).toFixed(1);
  /* 投影: 沿用 result 中的 cup projection, 否则默认 5.0cm */
  var proj = 5.0;
  var isUserOriginal = userOriginal && (ss.band === userOriginal.band && ss.cup === userOriginal.cup);
  var clickable = (!ss.primary) ? ' bc-compass-sister-clickable' : '';
  var origMark = (isUserOriginal && !ss.primary) ? ' <span class="bc-compass-sister-original">your size</span>' : '';
  var ariaLabel = 'Sister size ' + ss.label + (ss.primary ? ' (your size)' : ', click to make primary');

  /* YOU 卡顶部小三角指示 (文本版, 不用 SVG) */
  var youIndicator = ss.primary ? '<span class="bc-compass-sister-pointer" aria-hidden="true">▼</span>' : '';

  /* ─── Task 2: 5 区域副标签 ─── */
  var conv = BC.getSisterSizeConversion ? BC.getSisterSizeConversion(ss.band, ss.cup) : null;
  var convHtml = '';
  if (conv){
    convHtml =
      '<span class="bc-compass-sister-conversion">' +
        '<span class="bc-compass-sister-region bc-compass-sister-region-us">' + conv.us + '</span>' +
        '<span class="bc-compass-sister-region">' + conv.uk + '<i>UK</i></span>' +
        '<span class="bc-compass-sister-region">' + conv.eu + '<i>EU</i></span>' +
      '</span>';
  }

  /* ─── Task 2: extended 卡加 comfort 辅助文字 ─── */
  var comfort = '';
  if (role === 'extended'){
    comfort = '<span class="bc-compass-sister-comfort">±1 cup comfort</span>';
  }

  /* ─── Task 4: 对比 ✓ 图标 (仅非 primary 卡) ─── */
  var check = '';
  if (!ss.primary){
    check = '<span class="bc-compass-sister-check" role="button" tabindex="0" aria-label="Add ' + ss.label + ' to compare" data-action="compare">+</span>';
  }

  return '<button type="button" class="bc-compass-sister bc-compass-sister-' + role + clickable + '"' +
         ' data-band="' + ss.band + '" data-cup="' + ss.cup + '" data-role="' + role + '"' +
         ' aria-label="' + ariaLabel + '">' +
         check +
         '<span class="bc-compass-sister-role">' + roleLbl + '</span>' +
         youIndicator +
         '<span class="bc-compass-sister-size"><span class="bc-compass-sister-size-band">' + ss.band + '</span><span class="bc-compass-sister-size-cup">' + ss.cup + '</span></span>' +
         '<span class="bc-compass-sister-volume"><strong>' + vol + '</strong><span class="bc-compass-sister-unit"> mL</span></span>' +
         '<span class="bc-compass-sister-band">' + bandCm + ' cm · ' + proj + ' cm proj</span>' +
         convHtml + comfort + origMark +
         '</button>';
}

/* bindSisterCardClicks — 绑定姐妹卡点击事件 (Task 7: 加 GA4 事件) */
function bindSisterCardClicks(sistersEl){
  var btns = sistersEl.querySelectorAll('.bc-compass-sister-clickable');
  for (var j = 0; j < btns.length; j++){
    (function(btn){
      btn.addEventListener('click', function(ev){
        /* 如果点中 ✓ 按钮则忽略, 由 bindSisterCheckClicks 处理 */
        if (ev.target && ev.target.classList && ev.target.classList.contains('bc-compass-sister-check')) return;
        var b = parseInt(btn.getAttribute('data-band'), 10);
        var c = btn.getAttribute('data-cup');
        var role = btn.getAttribute('data-role') || 'sister';
        bcTrack('bc_sister_card_click', { band: String(b), cup: c, role: role });
        switchSisterPrimary(b, c);
      });
    })(btns[j]);
  }
}

/* bindSisterCheckClicks — 绑定对比 ✓ 按钮 (Task 4) */
function bindSisterCheckClicks(sistersEl){
  var checks = sistersEl.querySelectorAll('.bc-compass-sister-check');
  for (var j = 0; j < checks.length; j++){
    (function(ck){
      ck.addEventListener('click', function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        var card = ck.closest('.bc-compass-sister');
        if (!card) return;
        toggleCompareSelection(card, ck);
      });
      ck.addEventListener('keydown', function(ev){
        if (ev.key === 'Enter' || ev.key === ' '){
          ev.preventDefault();
          ck.click();
        }
      });
    })(checks[j]);
  }
}

/* bindSisterHoverTrack — hover 追踪 (Task 7) */
function bindSisterHoverTrack(sistersEl){
  var btns = sistersEl.querySelectorAll('.bc-compass-sister');
  for (var j = 0; j < btns.length; j++){
    (function(btn){
      var hoverTimer = null;
      btn.addEventListener('mouseenter', function(){
        var key = btn.getAttribute('data-band') + btn.getAttribute('data-cup');
        if (_hoverFired[key]) return;
        hoverTimer = setTimeout(function(){
          _hoverFired[key] = true;
          bcTrack('bc_sister_card_hover', {
            band: btn.getAttribute('data-band'),
            cup: btn.getAttribute('data-cup'),
            role: btn.getAttribute('data-role') || 'sister'
          });
        }, 200);
      });
      btn.addEventListener('mouseleave', function(){
        if (hoverTimer){ clearTimeout(hoverTimer); hoverTimer = null; }
      });
    })(btns[j]);
  }
}

/* Task 4: 切换对比选择 */
var _compareSelection = []; /* {band, cup, role} */
function toggleCompareSelection(card, checkEl){
  var band = card.getAttribute('data-band');
  var cup  = card.getAttribute('data-cup');
  var role = card.getAttribute('data-role');
  /* 已选中? 取消 */
  var existIdx = -1;
  for (var i = 0; i < _compareSelection.length; i++){
    if (_compareSelection[i].band === band && _compareSelection[i].cup === cup){
      existIdx = i; break;
    }
  }
  if (existIdx >= 0){
    _compareSelection.splice(existIdx, 1);
    card.classList.remove('bc-compass-sister-checked');
    bcTrack('bc_sister_compare_cancel', { band: band, cup: cup });
    renderCompareOverlay();
    return;
  }
  /* 最多 2 张 */
  if (_compareSelection.length >= 2){
    /* 替换最早的 */
    var first = _compareSelection.shift();
    var firstCard = document.querySelector('.bc-compass-sister[data-band="' + first.band + '"][data-cup="' + first.cup + '"]');
    if (firstCard) firstCard.classList.remove('bc-compass-sister-checked');
  }
  _compareSelection.push({ band: band, cup: cup, role: role });
  card.classList.add('bc-compass-sister-checked');
  if (_compareSelection.length === 2){
    bcTrack('bc_sister_compare_start', {
      a_band: _compareSelection[0].band, a_cup: _compareSelection[0].cup,
      b_band: _compareSelection[1].band, b_cup: _compareSelection[1].cup
    });
  }
  renderCompareOverlay();
}

/* Task 4: 渲染对比覆盖卡 */
function renderCompareOverlay(){
  var overlay = document.getElementById('bc-compass-compare');
  if (!overlay) return;
  if (_compareSelection.length < 2){
    overlay.classList.add('bc-compass-hidden');
    overlay.removeAttribute('data-active');
    overlay.innerHTML = '';
    return;
  }
  var a = _compareSelection[0];
  var b = _compareSelection[1];
  var ca = BC.getSisterSizeConversion ? BC.getSisterSizeConversion(a.band, a.cup) : null;
  var cb = BC.getSisterSizeConversion ? BC.getSisterSizeConversion(b.band, b.cup) : null;
  var va = BC.CUP_VOLUME_ML ? (BC.CUP_VOLUME_ML[a.cup] || 0) : 0;
  var vb = BC.CUP_VOLUME_ML ? (BC.CUP_VOLUME_ML[b.cup] || 0) : 0;
  var bandDiff = Math.abs(parseInt(a.band, 10) - parseInt(b.band, 10));
  var volDiff = Math.abs(va - vb);
  /* Recommendation 简单规则: band 小的更紧, cup 大的更适合丰满 */
  var recommend = bandDiff === 0
    ? 'Same band — pick the one that feels snugger.'
    : (parseInt(a.band, 10) < parseInt(b.band, 10)
        ? (a.label + ' has a snugger band; ' + b.label + ' a roomier fit.')
        : (b.label + ' has a snugger band; ' + a.label + ' a roomier fit.'));
  overlay.classList.remove('bc-compass-hidden');
  overlay.setAttribute('data-active', '1');
  overlay.innerHTML =
    '<div class="bc-compass-compare-card">' +
      '<div class="bc-compass-compare-eyebrow">Compare · side by side</div>' +
      '<div class="bc-compass-compare-pair">' +
        '<span class="bc-compass-compare-side">' + a.label + '</span>' +
        '<span class="bc-compass-compare-vs">vs</span>' +
        '<span class="bc-compass-compare-side">' + b.label + '</span>' +
      '</div>' +
      '<div class="bc-compass-compare-grid">' +
        '<div class="bc-compass-compare-row"><span>Band diff</span><strong>' + bandDiff + '″</strong></div>' +
        '<div class="bc-compass-compare-row"><span>Volume diff</span><strong>' + volDiff + ' mL</strong></div>' +
        '<div class="bc-compass-compare-row"><span>A · UK/EU</span><strong>' + (ca ? ca.uk + ' / ' + ca.eu : '—') + '</strong></div>' +
        '<div class="bc-compass-compare-row"><span>B · UK/EU</span><strong>' + (cb ? cb.uk + ' / ' + cb.eu : '—') + '</strong></div>' +
        '<div class="bc-compass-compare-row bc-compass-compare-row-wide"><span>Recommendation</span><em>' + recommend + '</em></div>' +
      '</div>' +
      '<button type="button" class="bc-compass-compare-close" id="bc-compass-compare-close" aria-label="Close compare">Close</button>' +
    '</div>';
  var closeBtn = document.getElementById('bc-compass-compare-close');
  if (closeBtn){
    closeBtn.addEventListener('click', function(){
      _compareSelection = [];
      var cards = document.querySelectorAll('.bc-compass-sister-checked');
      for (var k = 0; k < cards.length; k++) cards[k].classList.remove('bc-compass-sister-checked');
      renderCompareOverlay();
    });
  }
}

/* Task 5: 渲染换算条 */
function renderConversionRibbon(band, cup){
  var ribbon = document.getElementById('bc-compass-conversion');
  if (!ribbon) return;
  var conv = BC.getSisterSizeConversion ? BC.getSisterSizeConversion(band, cup) : null;
  if (!conv){ ribbon.innerHTML = ''; return; }
  ribbon.innerHTML =
    '<span class="bc-compass-conversion-label">Region size</span>' +
    '<span class="bc-compass-conversion-region"><i>US</i><b>' + conv.us + '</b></span>' +
    '<span class="bc-compass-conversion-region"><i>UK</i><b>' + conv.uk + '</b></span>' +
    '<span class="bc-compass-conversion-region"><i>EU</i><b>' + conv.eu + '</b></span>' +
    '<span class="bc-compass-conversion-region"><i>FR</i><b>' + conv.fr + '</b></span>' +
    '<span class="bc-compass-conversion-region"><i>AU</i><b>' + conv.au + '</b></span>';
}

/* Task 7: IntersectionObserver — 一次曝光 */
var _sisterObserverInstalled = false;
function ensureSisterSectionObserver(){
  if (_sisterObserverInstalled) return;
  var el = document.getElementById('bc-compass-instrument');
  if (!el || typeof IntersectionObserver === 'undefined') return;
  _sisterObserverInstalled = true;
  try {
    var obs = new IntersectionObserver(function(entries){
      for (var i = 0; i < entries.length; i++){
        if (entries[i].isIntersecting && entries[i].target === el){
          bcTrack('bc_sister_section_view', {});
          obs.disconnect();
          break;
        }
      }
    }, { threshold: 0.2 });
    obs.observe(el);
  } catch(e){ /* noop */ }
}

/* renderSisterSummary — 渲染汇总 + 交互按钮 (Task 6: 加 action bar) */
function renderSisterSummary(sisters, currentBand, currentCup){
  var summaryEl = document.getElementById('bc-compass-summary');
  if (!summaryEl || sisters.length === 0) return;
  var first = sisters[0];
  var last = sisters[sisters.length - 1];
  var midIdx = Math.floor(sisters.length / 2);
  var mid = sisters[midIdx] || sisters[0];
  var midVol = BC.CUP_VOLUME_ML ? (BC.CUP_VOLUME_ML[mid.cup] || 0) : 0;
  var showReset = (_userOriginalSize && (_userOriginalSize.band !== currentBand || _userOriginalSize.cup !== currentCup));
  var sizeHref = '/bra-size-guide/' + currentBand + String(currentCup).toLowerCase() + '/';
  var summaryHtml =
    '<div class="bc-compass-summary-equal">' +
      '<span class="bc-compass-summary-equal-label">Equal breast volume</span>' +
      '<span class="bc-compass-summary-equal-value">' + midVol + '</span>' +
      '<span class="bc-compass-summary-equal-hint">across ' + sisters.length + ' sister sizes</span>' +
    '</div>' +
    '<div class="bc-compass-summary-range">' +
      '<span>' + first.label + '</span>' +
      '<span class="bc-compass-summary-arrow" aria-hidden="true">↔</span>' +
      '<span>' + last.label + '</span>' +
    '</div>' +
    (showReset
      ? '<button type="button" class="bc-compass-summary-back" id="bc-compass-back">' +
        '← Return to your size (' + _userOriginalSize.band + _userOriginalSize.cup + ')' +
        '</button>'
      : '<div class="bc-compass-summary-tip">Tap any sister size to explore it as the center.</div>'
    ) +
    /* Task 6: 行动召唤 */
    '<div class="bc-compass-actions">' +
      '<a class="bc-compass-action bc-compass-action-primary" id="bc-compass-action-find" href="' + sizeHref + '" data-size="' + currentBand + currentCup + '">' +
        '<span>Find your fit</span>' +
        '<span class="bc-compass-action-arrow" aria-hidden="true">→</span>' +
      '</a>' +
      '<button type="button" class="bc-compass-action bc-compass-action-secondary" id="bc-compass-action-save" data-size="' + currentBand + currentCup + '">' +
        '<span class="bc-compass-action-icon" aria-hidden="true">⧉</span>' +
        '<span>Save my size</span>' +
      '</button>' +
    '</div>';
  summaryEl.innerHTML = summaryHtml;
  var backBtn = document.getElementById('bc-compass-back');
  if (backBtn){
    backBtn.addEventListener('click', function(){
      if (_userOriginalSize){
        switchSisterPrimary(_userOriginalSize.band, _userOriginalSize.cup);
      }
    });
  }
  /* Task 6: 行动召唤 — Save my size 复制主尺码到剪贴板 */
  var saveBtn = document.getElementById('bc-compass-action-save');
  if (saveBtn){
    saveBtn.addEventListener('click', function(){
      var size = saveBtn.getAttribute('data-size') || (currentBand + currentCup);
      bcTrack('bc_sister_cta_save', { size: size });
      try {
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(size).then(function(){
            showSisterToast('Copied ' + size + ' to clipboard');
          }, function(){
            fallbackCopy(size);
          });
        } else {
          fallbackCopy(size);
        }
      } catch(e){ fallbackCopy(size); }
    });
  }
  var findBtn = document.getElementById('bc-compass-action-find');
  if (findBtn){
    findBtn.addEventListener('click', function(){
      bcTrack('bc_sister_cta_findfit', { size: findBtn.getAttribute('data-size') || (currentBand + currentCup) });
    });
  }
}

function fallbackCopy(text){
  try {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showSisterToast('Copied ' + text + ' to clipboard');
  } catch(e){
    showSisterToast('Copy failed — ' + text);
  }
}

function showSisterToast(msg){
  /* 轻量 toast: 复用现有 showToast 或自定义 */
  try {
    if (typeof window.showToast === 'function'){ window.showToast(msg, 'success'); return; }
  } catch(e){}
  var t = document.getElementById('bc-compass-toast');
  if (!t){
    t = document.createElement('div');
    t.id = 'bc-compass-toast';
    t.className = 'bc-compass-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('bc-compass-toast-show');
  setTimeout(function(){ t.classList.remove('bc-compass-toast-show'); }, 1800);
}

/* 切换 sister primary (真实交互: 重新以该尺码为中心, 重渲染 5 卡) */
function switchSisterPrimary(band, cup){
  var sistersEl = document.getElementById('bc-compass-sisters');
  if (!sistersEl) return;
  var sisters = BC.getSisterSizes(band, cup) || [];
  /* 用共享函数生成 5 卡 + 共享 summary 渲染 */
  var shtml = '';
  for (var i = 0; i < sisters.length; i++){
    shtml += buildSisterCardHtml(sisters[i], i, sisters.length, _userOriginalSize, true);
  }
  sistersEl.innerHTML = shtml;
  bindSisterCardClicks(sistersEl);
  bindSisterCheckClicks(sistersEl);
  bindSisterHoverTrack(sistersEl);
  renderSisterSummary(sisters, band, cup);
  renderConversionRibbon(band, cup);
  /* 切换 primary 时清空对比选择 + 关闭对比卡 */
  _compareSelection = [];
  renderCompareOverlay();
}

function makeCupSvg(band, cup, volPct, role){
  /* SVG cup cross-section — width scales with band, height scales with cup */
  var bandScale = Math.min(2.0, Math.max(0.8, band / 36));
  var cupScale = Math.min(2.2, Math.max(0.5, volPct / 70));
  var w = 50 * bandScale;
  var h = 60 * cupScale;
  var x = 60 - w / 2;
  var y = 100 - h;
  var c1, c2;
  if (role === 'you'){ c1 = '#6b8a5e'; c2 = '#4a6240'; }
  else if (role === 'sister'){ c1 = '#b86054'; c2 = '#8b4a3a'; }
  else { c1 = '#d4a574'; c2 = '#b88a5a'; }
  return '<svg viewBox="0 0 120 110" class="bc-cup-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs>' +
      '<linearGradient id="cupGrad-' + band + cup + '" x1="0" x2="0" y1="0" y2="1">' +
        '<stop offset="0%" stop-color="' + c1 + '"/>' +
        '<stop offset="100%" stop-color="' + c2 + '"/>' +
      '</linearGradient>' +
      '<linearGradient id="cupHi-' + band + cup + '" x1="0" x2="0" y1="0" y2="1">' +
        '<stop offset="0%" stop-color="rgba(255,255,255,0.6)"/>' +
        '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>' +
      '</linearGradient>' +
    '</defs>' +
    /* Band arc at bottom */
    '<path d="M 8 100 Q 60 102 112 100" fill="none" stroke="#8b4a3a" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M 8 100 Q 60 102 112 100" fill="none" stroke="rgba(184,151,130,0.35)" stroke-width="6" stroke-linecap="round"/>' +
    /* Cup body */
    '<path d="M ' + x + ' ' + y + ' Q 60 0 ' + (x + w) + ' ' + y + ' L ' + (x + w) + ' 100 L ' + x + ' 100 Z" fill="url(#cupGrad-' + band + cup + ')"/>' +
    /* Highlight */
    '<path d="M ' + (x + w * 0.18) + ' ' + (y + h * 0.3) + ' Q ' + (x + w * 0.5) + ' ' + (y + h * 0.08) + ' ' + (x + w * 0.82) + ' ' + (y + h * 0.3) + ' L ' + (x + w * 0.78) + ' ' + (y + h * 0.5) + ' Q ' + (x + w * 0.5) + ' ' + (y + h * 0.32) + ' ' + (x + w * 0.22) + ' ' + (y + h * 0.5) + ' Z" fill="url(#cupHi-' + band + cup + ')"/>' +
    /* Band label */
    '<text x="60" y="108" text-anchor="middle" font-family="var(--font-sans)" font-size="6" font-weight="700" fill="#8b4a3a" letter-spacing="0.5">' + band + '″ BAND</text>' +
  '</svg>';
}

/* ──────────────────────────────────────────────────────────
   makeStainlessCupSvg — 不锈钢齿轮刻度质感的 cup 截面图
   设计目标:
     1) 银灰金属渐变 (brushed steel / polished)
     2) 顶部高光带, 体现打磨质感
     3) 底部细密刻度齿, 体现精密仪器
     4) "you" 用玫瑰金/暖色 override, 体现用户位置
   形状 / 比例: viewBox 100x100, 与 demo 静态 SVG 完全一致
   ────────────────────────────────────────────────────────── */
function makeBraLineSvg(band, cup, role, withSpin){
  /* ─── Task 9: 更精细的形状公式 ─── */
  /* cup 字母 -> 杯顶 Y 位置(数值越小, 杯越深) */
  var CUP_TOP_Y_TABLE = { AA: 18, A: 14, B: 12, C: 10, D: 8, DD: 6, DDD: 6, E: 14, F: 8, G: 4, H: 2, I: 2, J: 2, K: 2 };
  var cupTopY = (CUP_TOP_Y_TABLE[cup] != null) ? CUP_TOP_Y_TABLE[cup] : 10;
  /* 带宽: 28->22, 30->26, 32->30, 34->34, 36->38, 38->42, 40->46 (半宽, 居中于 x=50) */
  var bandHalfW = Math.max(18, Math.min(46, 22 + (band - 28) * 2.0));
  var cx = 50;
  var left = cx - bandHalfW;
  var right = cx + bandHalfW;
  var cupBotY = 82;
  var bandTopY = 82;
  var bandBotY = 92;

  /* 配色: you 玫金, sister 暖驼, extended 浅驼 */
  var stroke, fill, hi, strap, gradId;
  if (role === 'you'){
    stroke = '#b87a5a'; fill = 'rgba(245, 184, 150, 0.20)';
    hi = 'rgba(255, 230, 215, 0.7)'; strap = '#d68b6c';
    gradId = 'bcBraYouGrad';
  } else if (role === 'sister'){
    stroke = '#8a6850'; fill = 'rgba(232, 200, 168, 0.10)';
    hi = 'rgba(255, 245, 232, 0.6)'; strap = '#a88560';
    gradId = 'bcBraSisterGrad';
  } else {
    stroke = '#9c8268'; fill = 'rgba(220, 195, 165, 0.08)';
    hi = 'rgba(250, 240, 225, 0.4)'; strap = '#b89770';
    gradId = 'bcBraExtGrad';
  }

  var cupPath =
    'M ' + left + ' ' + cupBotY +
    ' C ' + left + ' ' + (cupBotY - 28) + ' 50 ' + (cupTopY - 6) + ' 50 ' + cupTopY +
    ' C 50 ' + (cupTopY - 6) + ' ' + right + ' ' + (cupBotY - 28) + ' ' + right + ' ' + cupBotY + ' Z';

  var cupStroke = role === 'you' ? 2.2 : 1.8;
  /* 渐变填充: 顶部高亮到底部阴影, 体现 "打光" 立体感 */
  var grad = '<defs>' +
    '<linearGradient id="' + gradId + band + cup + '" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>' +
      '<stop offset="60%" stop-color="' + fill + '"/>' +
      '<stop offset="100%" stop-color="rgba(184,122,90,0.10)"/>' +
    '</linearGradient>' +
  '</defs>';

  var cupEl = '<path d="' + cupPath + '" fill="url(#' + gradId + band + cup + ')" stroke="' + stroke + '" stroke-width="' + cupStroke + '" stroke-linejoin="round" stroke-linecap="round"/>';
  var seam = '<line x1="' + cx + '" y1="' + (cupTopY + 4) + '" x2="' + cx + '" y2="' + (cupBotY - 2) + '" stroke="' + stroke + '" stroke-width="0.6" stroke-dasharray="1.5,1.5" opacity="0.45"/>';
  var gore = '<path d="M ' + (cx - 5) + ' ' + (cupTopY - 1) + ' L ' + cx + ' ' + (cupTopY - 4) + ' L ' + (cx + 5) + ' ' + (cupTopY - 1) + '" fill="none" stroke="' + stroke + '" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>';
  var strapL = '<path d="M ' + (cx - 3) + ' ' + (cupTopY + 2) + ' Q ' + (cx - 14) + ' ' + (cupTopY - 14) + ' ' + (cx - 8) + ' ' + (cupTopY - 22) + '" fill="none" stroke="' + strap + '" stroke-width="0.8" stroke-linecap="round" opacity="0.55"/>';
  var strapR = '<path d="M ' + (cx + 3) + ' ' + (cupTopY + 2) + ' Q ' + (cx + 14) + ' ' + (cupTopY - 14) + ' ' + (cx + 8) + ' ' + (cupTopY - 22) + '" fill="none" stroke="' + strap + '" stroke-width="0.8" stroke-linecap="round" opacity="0.55"/>';
  var highlight = '<ellipse cx="' + cx + '" cy="' + (cupTopY + 10) + '" rx="' + (bandHalfW * 0.4) + '" ry="3" fill="' + hi + '" opacity="0.75"/>';
  var bandEl = '<rect x="' + (left - 1) + '" y="' + bandTopY + '" width="' + (bandHalfW * 2 + 2) + '" height="' + (bandBotY - bandTopY) + '" rx="1.5" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.2"/>';
  var hooks = '<line x1="' + left + '" y1="' + (bandTopY + 2) + '" x2="' + (left - 3) + '" y2="' + (bandBotY - 1) + '" stroke="' + stroke + '" stroke-width="0.7" stroke-linecap="round" opacity="0.55"/>' +
              '<line x1="' + right + '" y1="' + (bandTopY + 2) + '" x2="' + (right + 3) + '" y2="' + (bandBotY - 1) + '" stroke="' + stroke + '" stroke-width="0.7" stroke-linecap="round" opacity="0.55"/>';

  /* "you" 顶部装饰指针: 精致的小三角 + 圆点, 提示 "这是你的尺码"
     Task 3: 加 <animateTransform> 旋转 360° 一次性 (1.2s) */
  var pointer = '';
  if (role === 'you'){
    var spin = withSpin
      ? '<animateTransform attributeName="transform" type="rotate" from="0 ' + cx + ' 0" to="360 ' + cx + ' 0" dur="1.2s" fill="freeze"/>'
      : '';
    pointer =
      '<g class="bc-bra-pointer" aria-hidden="true">' +
        '<circle cx="' + cx + '" cy="2" r="1.5" fill="#b87a5a">' +
          '<animate attributeName="r" values="1.5;2.2;1.5" dur="1.6s" repeatCount="indefinite"/>' +
        '</circle>' +
        '<path d="M ' + (cx - 3) + ' 4 L ' + cx + ' 9 L ' + (cx + 3) + ' 4 Z" fill="#b87a5a">' + spin + '</path>' +
        '<line x1="' + cx + '" y1="9" x2="' + cx + '" y2="' + (cupTopY - 6) + '" stroke="#b87a5a" stroke-width="0.6" stroke-dasharray="1.2,1.5" opacity="0.55"/>' +
      '</g>';
  }

  return '<svg viewBox="0 0 100 110" class="bc-bra-svg" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    grad + pointer + cupEl + highlight + seam + gore + strapL + strapR + bandEl + hooks +
  '</svg>';
}

/* 向后兼容: renderSisterComparator 仍调用 makeStainlessCupSvg, 重定向到新函数 */
function makeStainlessCupSvg(band, cup, role, volMl){
  return makeBraLineSvg(band, cup, role);
}

/* ──────────────────────────────────────────────────────────
   空状态 (empty state) 现在直接由 HTML 中的 5 张静态 SVG 提供。
   active state 由 renderSisterComparator() 渲染, 调用 BC.getSisterSizes()。
   BC.getSisterSizes 的算法:
     - 用户尺码为中心 (primary=true)
     - 上下扩展各 2 个 sister: band±N, cup∓N
     - 共 5 张, 按 band 从小到大排序
   ────────────────────────────────────────────────────────── */

/* wireSisterDemo — 绑定 "Preview with 34C" 演示按钮 */
function wireSisterDemo(){
  var btn = document.getElementById('bc-compass-demo-btn');
  if (!btn) return;
  btn.addEventListener('click', function(){
    previewSisterDemo();
  });
}

/* previewSisterDemo — 用 34C 样例直接展示 comparator (无需表单) */
function previewSisterDemo(){
  try {
    var sample = { bandSize: 34, cupLetter: 'C', cupIndex: 2, us: '34C' };
    /* Task 7: GA4 事件 */
    bcTrack('bc_sister_preview_click', {});
    /* 强制重置 _userOriginalSize, 让 demo 视为"用户原始尺码" */
    _userOriginalSize = { band: 34, cup: 'C' };
    /* 重置对比选择 + hover debounce */
    _compareSelection = [];
    _hoverFired = {};
    renderSisterComparator(sample);
  } catch (err){
    console.error('[bc-main] previewSisterDemo error:', err);
  }
}

function resetSisterComparator(){
  /* 重置回 empty 状态 — 不保存任何数据
     注意: 只能清空子元素(sistersEl / summaryEl)的内容, 不能清空 activeEl 自身,
     否则 #bc-compass-sisters 和 #bc-compass-summary 这两个容器会一起被销毁,
     后续 renderSisterComparator() 就无法再找到它们了。 */
  try {
    var emptyEl = document.getElementById('bc-history-empty');
    var activeEl = document.getElementById('bc-history-list');
    if (emptyEl){
      emptyEl.classList.remove('bc-compass-hidden');
      emptyEl.removeAttribute('hidden');
      emptyEl.style.display = '';
    }
    if (activeEl){
      activeEl.classList.add('bc-compass-hidden');
      activeEl.setAttribute('hidden', '');
      activeEl.style.display = '';
    }
    /* 隐藏 #bc-compass-instrument(并清空它的子内容, 保留容器本身) */
    var instrumentEl = document.getElementById('bc-compass-instrument');
    if (instrumentEl){
      instrumentEl.classList.add('bc-compass-hidden');
      instrumentEl.setAttribute('hidden', '');
      instrumentEl.style.display = '';
    }
    /* 仅清空容器内的子元素, 保留 #bc-compass-sisters / #bc-compass-summary 容器本身 */
    var sistersEl = document.getElementById('bc-compass-sisters');
    var summaryEl = document.getElementById('bc-compass-summary');
    if (sistersEl) sistersEl.innerHTML = '';
    if (summaryEl) summaryEl.innerHTML = '—';
    /* Task 5: 清空换算条 + 对比卡 */
    var ribbon = document.getElementById('bc-compass-conversion');
    if (ribbon) ribbon.innerHTML = '';
    var compare = document.getElementById('bc-compass-compare');
    if (compare){
      compare.classList.add('bc-compass-hidden');
      compare.removeAttribute('data-active');
      compare.innerHTML = '';
    }
    /* 同步重置: 用户原始尺码记录 + 对比选择 + hover debounce */
    _userOriginalSize = null;
    _compareSelection = [];
    _hoverFired = {};
  } catch (err){
    console.error('[bc-main] resetSisterComparator error:', err);
  }
}

function renderSisterSpectrum(cel, result){
  if (!BC.getSisterSizeSpectrum) return;
  var spec = BC.getSisterSizeSpectrum(result);
  if (!spec || !spec.positions) return;
  var total = spec.positions.length;
  /* Ruler — 12 cup 字母 + 12 主刻度 + 24 半刻度(齿轮齿) */
  var ruler = cel.querySelector('#size-sister-ruler');
  if (ruler){
    var rulerHtml = '';
    for (var i = 0; i < total; i++){
      var p = spec.positions[i];
      var left = (i + 0.5) * (100 / total);
      var cls = 'bc-celebrate-sister-tick';
      if (p.isUser) cls += ' bc-celebrate-sister-tick-you';
      else if (Math.abs(p.diff) === 1) cls += ' bc-celebrate-sister-tick-sister';
      else if (Math.abs(p.diff) === 2) cls += ' bc-celebrate-sister-tick-ext';
      rulerHtml += '<div class="' + cls + '" style="left:' + left.toFixed(2) + '%">';
      rulerHtml += '<div class="bc-celebrate-sister-tick-line"></div>';
      rulerHtml += '<div class="bc-celebrate-sister-tick-cup">' + p.cup + '</div>';
      rulerHtml += '<div class="bc-celebrate-sister-tick-pct">' + p.ownPct + '%</div>';
      /* 半刻度(齿轮齿感) */
      if (i < total - 1){
        var midLeft = (i + 1) * (100 / total);
        rulerHtml += '<div class="bc-celebrate-sister-tick-minor" style="left:' + midLeft.toFixed(2) + '%"></div>';
      }
      rulerHtml += '</div>';
    }
    ruler.innerHTML = rulerHtml;
  }
  /* Bars — 12 cup 的 US 女性占比柱状图(精密仪器式) */
  var bars = cel.querySelector('#size-sister-bars');
  if (bars){
    var barsHtml = '';
    var maxPct = 0;
    for (var j = 0; j < spec.positions.length; j++) if (spec.positions[j].ownPct > maxPct) maxPct = spec.positions[j].ownPct;
    for (var k = 0; k < spec.positions.length; k++){
      var p2 = spec.positions[k];
      var h = Math.max(2, Math.round(80 * p2.ownPct / maxPct));
      var bc = 'bc-celebrate-sister-bar';
      if (p2.isUser) bc += ' bc-celebrate-sister-bar-you';
      else if (Math.abs(p2.diff) === 1) bc += ' bc-celebrate-sister-bar-sister';
      else if (Math.abs(p2.diff) === 2) bc += ' bc-celebrate-sister-bar-ext';
      var leftBar = (k + 0.5) * (100 / total);
      barsHtml += '<div class="' + bc + '" style="left:' + leftBar.toFixed(2) + '%;height:' + h + 'px" title="' + p2.cup + ': ' + p2.ownPct + '% of US women"><span>' + p2.ownPct + '%</span></div>';
    }
    bars.innerHTML = barsHtml;
  }
  /* Needle — 指针定位到 user cup */
  var needle = cel.querySelector('#size-sister-needle');
  if (needle){
    var leftN = (spec.userCupIndex + 0.5) * (100 / total);
    needle.style.left = leftN.toFixed(2) + '%';
  }
  var needleCup = cel.querySelector('#size-sister-needle-cup');
  if (needleCup) needleCup.textContent = result.bandSize + result.cupLetter;
  var needleLbl = cel.querySelector('#size-sister-needle-lbl');
  if (needleLbl) needleLbl.textContent = 'YOU · ' + result.bandSize + '″ BAND';
  /* Sub */
  var sub = cel.querySelector('#size-sister-sub');
  if (sub) sub.innerHTML = 'Of 12 cup sizes in the US market, your <em style="font-style:italic;color:#6b3328;font-weight:600;">' + result.cupLetter + ' cup</em> sits at the <strong style="font-style:italic;color:#8b4a3a;">' + (spec.userCupIndex + 1) + '. position</strong> — with sister sizes at positions ' + Math.max(1, spec.userCupIndex) + ' and ' + Math.min(12, spec.userCupIndex + 2) + '.';
  /* Readout */
  var share = cel.querySelector('#size-sister-share');
  if (share) share.textContent = spec.userOwnPct + '%';
  var pct = cel.querySelector('#size-sister-pct');
  if (pct) pct.textContent = spec.userCumulativePct + '%ile';
  var vol = cel.querySelector('#size-sister-vol');
  if (vol) vol.textContent = spec.positions[spec.userCupIndex].volume + ' ml';
  var vs = cel.querySelector('#size-sister-vs');
  if (vs) vs.textContent = spec.vsAvgText + ' · ' + spec.cupVsAvg;
}

function renderBrandResult(container, adjusted, original){
  if (!container) return;
  if (adjusted.brand && adjusted.brand.name === 'Standard (most brands)'){container.innerHTML = '';return;}
  function row(label, adj, orig){
    var changed = adj !== orig;
    return '<div class="bc-brand-row">' +
      '<span class="bc-brand-label">' + label + '</span>' +
      '<span class="bc-brand-value' + (changed ? ' bc-brand-changed' : '') + '">' + adj + '</span>' +
      (changed ? '<span class="bc-brand-original">(was ' + orig + ')</span>' : '') +
      '</div>';
  }
  /* 衍生数据 — cut/bandTightness/品牌哈希参与计算后的量化结果 */
  function metric(label, value, unit, hint){
    return '<div class="bc-brand-metric">' +
      '<span class="bc-brand-metric-label">' + label + '</span>' +
      '<span class="bc-brand-metric-value">' + value + '<span class="bc-brand-metric-unit">' + (unit||'') + '</span></span>' +
      (hint ? '<span class="bc-brand-metric-hint">' + hint + '</span>' : '') +
      '</div>';
  }
  var shapeIcon = { shallow: '◡', avg: '◐', projected: '◕' }[adjusted.shape] || '◐';
  var shapeName = ({shallow:'Shallow cut', avg:'Average cut', projected:'Projected cut'})[adjusted.shape] || 'Average cut';
  var adjExplain = (function(){
    var a = adjusted.adjustments;
    var bits = [];
    if (a.bandOffset !== 0) bits.push((a.bandOffset > 0 ? '+' : '') + a.bandOffset + ' band');
    if (a.cupOffset  !== 0) bits.push((a.cupOffset  > 0 ? '+' : '') + a.cupOffset  + ' cup');
    return bits.length ? '(' + bits.join(', ') + ')' : '(no size change)';
  })();
  var html = '<div class="bc-brand-result">';
  html += '<h4 class="bc-brand-title">Brand-Specific Size: ' + adjusted.brand.name + ' ' + adjExplain + '</h4>';
  html += '<div class="bc-brand-sizes">';
  html += row('US', adjusted.us, original.us);
  html += row('UK', adjusted.uk, original.uk);
  html += row('EU', adjusted.eu, original.eu);
  html += '</div>';
  /* 新增: 量化指标 — 每个 cut/bandTightness 字段都进入展示 */
  html += '<div class="bc-brand-metrics">';
  html += metric('Volume',     adjusted.adjustedVolumeMl, ' mL',  'per breast, brand-adjusted');
  html += metric('Projection', adjusted.projectionCm,    ' cm',  shapeIcon + ' ' + shapeName);
  html += metric('Band (worn)',adjusted.effectiveBandCm, ' cm',  'after stretch (' + (adjusted.brand.bandTightness || 'standard') + ')');
  html += metric('Fit score',  adjusted.fitScore,        '/100', 'compatibility with standard fit');
  html += '</div>';
  html += '<p class="bc-brand-note">' + adjusted.brand.note + '</p>';
  html += '</div>';
  container.innerHTML = html;
}

/* 主计算函数 — 总是有效 */
function runCalculation(form){
  if (!form) return;
  setLoading(form, true);
  setStatus('loading', 'Calculating your size…');
  setTimeout(function(){
    try {
      var data = readForm(form);
      if (!data){
        try {var dbg = document.getElementById('bc-debug'); if (dbg) dbg.innerHTML = '✗ Form inputs not found. form.parentElement=' + (form.parentElement && form.parentElement.tagName) + ' | children=' + (form.children ? form.children.length : 0);} catch(e){}
        throw new Error('Form inputs not found.');
      }
      if (isNaN(data.ub) || isNaN(data.bust)){
        try {var dbg = document.getElementById('bc-debug'); if (dbg) dbg.innerHTML = '✗ NaN values. ub=' + data.ub + ' bust=' + data.bust + ' unit=' + data.unit;} catch(e){}
        if (window.showToast) window.showToast('Please enter valid measurements.','error');
        return;
      }
      var uk = unitKey(data.unit);
      var v1 = BC.validateMeasurement(data.ub, 'underbust', uk);
      var v2 = BC.validateMeasurement(data.bust, 'bust', uk);
      if (!v1.valid || !v2.valid){
        if (window.showToast) window.showToast(v1.valid ? v2.message : v1.message, 'error');
        return;
      }
      var ubIn = BC.convertToInches(data.ub, uk);
      var bIn = BC.convertToInches(data.bust, uk);
      var vp = BC.validatePair(ubIn, bIn);
      if (!vp.valid){
        if (window.showToast) window.showToast(vp.message + ' ' + (vp.suggestion || ''), 'error');
        return;
      }
      var result = BC.calculateBraSize(ubIn, bIn);
      try {var dbg = document.getElementById('bc-debug'); if (dbg) dbg.innerHTML = '✓ Calculated! us=' + result.us + ' uk=' + result.uk + ' band=' + result.bandSize + ' cup=' + result.cupLetter;} catch(e){}
      /* 填充所有 ID 字段(站内的 + celebrate 内的) */
      fillAll(form, result);
      /* 直接给 #size-us 再保险一次(只设最重要的字段) */
      var su = document.getElementById('size-us');
      if (su) su.textContent = result.us;
      /* Celebration */
      var resultEl = getResultEl(form);
      if (resultEl){
        resultEl.hidden = false;
        resultEl.removeAttribute('hidden');
        resultEl.classList.remove('hidden');
        resultEl.style.display = 'block';
        ensureCelebrate(form, resultEl);
      }
      var cel = form.parentElement.querySelector('.bc-celebrate');
      if (cel){
        cel.hidden = false;
        cel.classList.add('bc-celebrate-show');
        var sIcon = cel.querySelector('#size-icon');
        var sUs3 = cel.querySelector('#size-us-3');
        var sRare = cel.querySelector('#size-rare');
        var sHead = cel.querySelector('#size-headline');
        var sSub = cel.querySelector('#size-sub');
        var sTip = cel.querySelector('#size-tip');
        var sStyles = cel.querySelector('#size-styles');
        var sConf = cel.querySelector('.bc-celebrate-confetti');
        var si = SIZE_INSIGHTS[result.cupLetter] || SIZE_INSIGHTS['C'];
        var bi = BAND_INSIGHTS[result.bandSize] || BAND_INSIGHTS[36];
        var cm = buildCelebrationMessage(result.us, result.bandSize, result.cupLetter);
        if (sIcon) sIcon.textContent = si.icon;
        if (sUs3) sUs3.textContent = result.us;
        if (sRare) sRare.textContent = si.rarity;
        if (sHead) sHead.textContent = cm.headline;
        if (sSub) sSub.textContent = cm.sub;
        if (sTip) sTip.textContent = bi.note;
        if (sStyles){
          var h = '';
          for (var j = 0; j < si.styles.length; j++){
            var sn = si.styles[j];
            var slug = sn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            var href = '/bra-buying-guide/?size=' + encodeURIComponent(result.us) + '&style=' + slug;
            h += '<a class="bc-celebrate-style-chip" href="' + href + '" data-style="' + slug + '" data-size="' + result.us + '">' + sn + '</a>';
          }
          sStyles.innerHTML = h;
        }
        /* 8 region sizes (US / UK / EU / FR / AU / NZ / India / Canada) */
        var sizes8 = [
          { l: 'US',     v: result.us,     id: 'size-us-2'     },
          { l: 'UK',     v: result.uk,     id: 'size-uk-2'     },
          { l: 'EU',     v: result.eu,     id: 'size-eu-2'     },
          { l: 'FR/BE',  v: result.fr,     id: 'size-fr-2'     },
          { l: 'AU',     v: result.au,     id: 'size-au-2'     },
          { l: 'NZ',     v: result.nz,     id: 'size-nz-2'     },
          { l: 'India',  v: result.india,  id: 'size-india-2'  },
          { l: 'Canada', v: result.canada, id: 'size-canada-2' }
        ];
        for (var r2 = 0; r2 < sizes8.length; r2++){
          var el2 = cel.querySelector('#' + sizes8[r2].id);
          if (el2) el2.textContent = sizes8[r2].v;
        }
        /* Sister Size Spectrum 精密仪器式渲染 */
        renderSisterSpectrum(cel, result);
        /* 同步更新首页 Sister Size Comparator 面板 */
        renderSisterComparator(result);
        /* Brand-specific size card */
        var brandSel2 = getBrandSelect(form);
        var brandCard = cel.querySelector('#size-brand-card');
        var brandGrid = cel.querySelector('#size-brand-grid');
        var brandSub = cel.querySelector('#size-brand-sub');
        if (brandSel2 && brandSel2.value && brandCard && brandGrid){
          var adj2 = BC.applyBrandAdjustment(result, brandSel2.value);
          brandCard.hidden = false;
          if (brandSub) brandSub.textContent = 'Adjusted from your US ' + result.us + ' to ' + (adj2.brand && adj2.brand.name ? adj2.brand.name : 'your selected brand') + ' sizing standards.';
          /* 全部 8 region sizes 按品牌调整 */
          var gridHtml = '';
          var bAdj = [
            { l: 'US',     v: adj2.us,     o: result.us     },
            { l: 'UK',     v: adj2.uk,     o: result.uk     },
            { l: 'EU',     v: adj2.eu,     o: result.eu     },
            { l: 'FR/BE',  v: adj2.fr,     o: result.fr     },
            { l: 'AU',     v: adj2.au,     o: result.au     },
            { l: 'NZ',     v: adj2.nz,     o: result.nz     },
            { l: 'India',  v: adj2.india,  o: result.india  },
            { l: 'Canada', v: adj2.canada, o: result.canada }
          ];
          for (var k = 0; k < bAdj.length; k++){
            var changed = bAdj[k].v !== bAdj[k].o;
            gridHtml += '<div class="bc-celebrate-brand-cell">' +
              '<div class="bc-celebrate-brand-cell-name">' + bAdj[k].l + '</div>' +
              '<div class="bc-celebrate-brand-cell-value' + (changed ? ' bc-celebrate-brand-changed' : '') + '">' + bAdj[k].v + '</div>' +
              (changed ? '<div class="bc-celebrate-brand-cell-orig">(from ' + bAdj[k].o + ')</div>' : '') +
              '</div>';
          }
          brandGrid.innerHTML = gridHtml;
          /* 展示品牌详细信息卡 */
          var brandInfo = cel.querySelector('#size-brand-info');
          if (brandInfo && adj2.brand){
            var bi = adj2.brand;
            var infoHtml = '<div class="bc-celebrate-brand-info-title">' + bi.name + '</div>';
            infoHtml += '<div class="bc-celebrate-brand-info-row"><span class="bc-celebrate-brand-info-label">Country</span><span class="bc-celebrate-brand-info-value">' + bi.country + '</span></div>';
            infoHtml += '<div class="bc-celebrate-brand-info-row"><span class="bc-celebrate-brand-info-label">Specialty</span><span class="bc-celebrate-brand-info-value">' + bi.specialty + '</span></div>';
            infoHtml += '<div class="bc-celebrate-brand-info-row"><span class="bc-celebrate-brand-info-label">Fit</span><span class="bc-celebrate-brand-info-value">' + bi.fit + '</span></div>';
            infoHtml += '<div class="bc-celebrate-brand-info-row"><span class="bc-celebrate-brand-info-label">Best for</span><span class="bc-celebrate-brand-info-value">' + bi.bestFor + '</span></div>';
            infoHtml += '<div class="bc-celebrate-brand-info-row"><span class="bc-celebrate-brand-info-label">Avoid if</span><span class="bc-celebrate-brand-info-value">' + bi.avoid + '</span></div>';
            infoHtml += '<div class="bc-celebrate-brand-info-row"><span class="bc-celebrate-brand-info-label">Sister-size advice</span><span class="bc-celebrate-brand-info-value">' + bi.sisterSizeAdvice + '</span></div>';
            brandInfo.innerHTML = infoHtml;
            brandInfo.hidden = false;
          }
        } else if (brandCard){
          brandCard.hidden = true;
        }
        if (sConf) fireConfetti(sConf);
      }
      /* Sisters */
      var sisterEl = getSisterContainer(form);
      if (sisterEl) renderSisterSizes(sisterEl, result.bandSize, result.cupLetter);
      /* Brand */
      var brandSel = getBrandSelect(form);
      var brandResultEl = getBrandResult(form);
      if (brandSel && brandResultEl && brandSel.value){
        var adj = BC.applyBrandAdjustment(result, brandSel.value);
        renderBrandResult(brandResultEl, adj, result);
      } else if (brandResultEl){
        brandResultEl.innerHTML = '';
      }
      /* 滚动到结果 */
      if (resultEl){
        try{resultEl.scrollIntoView({behavior:'smooth', block:'start'});}catch(e){}
      }
      /* Flash + toast */
      flashSuccess(form);
      if (window.showToast) window.showToast('Calculation complete!', 'success');
      /* 暴露给其他脚本 */
      form.__lastResult = result;
    } catch (err) {
      console.error('[bc-main] calculation error:', err);
      if (window.showToast) window.showToast('Calculation failed: ' + err.message, 'error');
    } finally {
      setLoading(form, false);
    }
  }, 80);
}

/* 表单 submit 委托 */
function handleFormSubmit(form, e){
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  runCalculation(form);
  return false;
}

/* 文档级委托 — 总是有效 */
function wireAll(){
  /* 找所有 .calc-form 表单 */
  var forms = [];
  var f1 = document.getElementById('size-form');
  if (f1 && f1.tagName === 'FORM') forms.push(f1);
  var allCalcForms = document.querySelectorAll('form.calc-form, .calc-form form, form#size-form');
  for (var i = 0; i < allCalcForms.length; i++){
    if (allCalcForms[i] && forms.indexOf(allCalcForms[i]) === -1) forms.push(allCalcForms[i]);
  }
  forms.forEach(function(form){
    if (form.dataset.bcMainWired === '1') return;
    form.dataset.bcMainWired = '1';
    /* Layer 1: capture-phase submit handler */
    form.addEventListener('submit', function(e){
      handleFormSubmit(form, e);
    }, true);
    /* Layer 2: 直接给 submit 按钮加 click — 不管 submit 事件如何混乱,只要点按钮就响应 */
    var submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button.btn-primary') || document.getElementById('calc-submit-btn');
    if (submitBtn && submitBtn.dataset.bcMainClick !== '1'){
      submitBtn.dataset.bcMainClick = '1';
      submitBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        runCalculation(form);
      }, true);
    }
    /* Layer 3: 表单 Enter 键 */
    form.addEventListener('keydown', function(e){
      if (e.key === 'Enter' && e.target.tagName === 'INPUT'){
        e.preventDefault();
        runCalculation(form);
      }
    }, true);
  });
  /* Celebration 按钮点击委托 — Print / Share / Reset (no save, no storage) */
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-bc-action]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var act = btn.dataset.bcAction;
    var BCA = window.BCActions;
    if (act === 'print' && BCA){
      BCA.printResult();
    } else if (act === 'share' && BCA){
      BCA.shareResult();
    } else if (act === 'reset' && BCA){
      BCA.resetForm();
      /* 重置时也清空 Sister Size Comparator 回到 empty 状态 */
      resetSisterComparator();
    }
  }, true);
  /* 站内 #size-save 按钮已废弃 — 改名为 "View brand guide" */
  var saveBtn = document.getElementById('size-save');
  if (saveBtn && saveBtn.dataset.bcMainSave !== '1'){
    saveBtn.dataset.bcMainSave = '1';
    saveBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var BCA = window.BCActions;
      if (BCA) BCA.printResult();
    }, true);
  }
  /* size-choice 卡片(Shop / Guide / Compare) */
  document.addEventListener('click', function(e){
    var card = e.target.closest('.size-choice-card');
    if (!card) return;
    var choice = card.dataset.choice;
    var result = document.querySelector('form#size-form') && document.querySelector('form#size-form').__lastResult;
    if (choice === 'shop' && result){
      window.location.href = '/bra-buying-guide/?size=' + encodeURIComponent(result.us);
    } else if (choice === 'guide'){
      window.location.href = '/how-to-measure-bra-size/';
    } else if (choice === 'compare'){
      var details = document.getElementById('size-details');
      var choice2 = document.getElementById('size-choice');
      if (details){details.hidden = false;details.removeAttribute('hidden');details.style.display = 'block';}
      if (choice2){choice2.hidden = true;choice2.style.display = 'none';}
    }
  }, true);
  /* size-choice-skip 按钮 */
  document.addEventListener('click', function(e){
    if (e.target.closest && e.target.closest('#size-choice-skip')){
      e.preventDefault();
      var choice3 = document.getElementById('size-choice');
      var details2 = document.getElementById('size-details');
      if (choice3){choice3.hidden = true;choice3.style.display = 'none';}
      if (details2){details2.hidden = false;details2.removeAttribute('hidden');details2.style.display = 'block';}
    }
  }, true);
  /* 填充 brand 下拉(全部 35 品牌按 region 分组) */
  populateBrandSelect();
  /* 渲染 Quick Fill 快捷填充(美国女性最常见尺码) */
  for (var qfi = 0; qfi < forms.length; qfi++){
    renderQuickFill(forms[qfi]);
  }
  /* 初始化 Sister Size Comparator — empty 状态直接由 HTML 提供 5 张静态 SVG */
  resetSisterComparator();
  /* 切换 Unit 时, 同步 placeholder / min / max / hints — 防止用户在 cm 单位下看到 inch 占位符 */
  wireUnitSwitch();
  /* Sister Size Comparator — Preview 按钮: 无需填表, 直接展示 34C 样例 */
  wireSisterDemo();
  /* 暴露给外部 */
  window.__bcMain = { runCalculation: runCalculation, wireAll: wireAll, setStatus: setStatus, renderSisterComparator: renderSisterComparator, resetSisterComparator: resetSisterComparator, setUnit: setUnit, previewSisterDemo: previewSisterDemo };
  /* 不显示任何后端状态 — 后台静默就绪 */
  console.log('[bc-main] ready');
}

/* ──────────────────────────────────────────────────────────
   Unit 切换 — 同步表单 placeholder/min/max 和 field hint
   - inches: underbust 20-90, bust 22-110, placeholder "e.g. 32" / "e.g. 36"
   - cm:     underbust 50-230, bust 56-280, placeholder "e.g. 81" / "e.g. 91"
   - 选择 cm 时, 所有数值按真实公制范围校验, 转换系数 1/2.54
   ────────────────────────────────────────────────────────── */
var UNIT_PROFILES = {
  inches: {
    ub: { placeholder: 'e.g. 32', min: 20, max: 90, step: 0.1 },
    bust: { placeholder: 'e.g. 36', min: 22, max: 110, step: 0.1 }
  },
  cm: {
    ub: { placeholder: 'e.g. 81', min: 50, max: 230, step: 0.1 },
    bust: { placeholder: 'e.g. 91', min: 56, max: 280, step: 0.1 }
  }
};

/* 上一次生效的单位,用于在 setUnit() 中判断是否需要换算输入框数值 */
var _lastUnit = null;

function setUnit(unit){
  var profile = UNIT_PROFILES[unit] || UNIT_PROFILES.inches;
  /* 单位换算: 仅在旧单位已知 + 旧单位 ≠ 新单位 + 输入框有合法数值 时执行 */
  if (_lastUnit && _lastUnit !== unit){
    convertInputValues(_lastUnit, unit);
  }
  _lastUnit = unit;

  var ub = document.getElementById('underbust');
  var b  = document.getElementById('bust');
  if (ub){
    ub.placeholder = profile.ub.placeholder;
    ub.min = profile.ub.min;
    ub.max = profile.ub.max;
    ub.step = profile.ub.step;
  }
  if (b){
    b.placeholder = profile.bust.placeholder;
    b.min = profile.bust.min;
    b.max = profile.bust.max;
    b.step = profile.bust.step;
  }
  /* 在 field-hint 里给当前单位的范围加亮标记 */
  var hints = document.querySelectorAll('.calc-field .field-hint');
  hints.forEach(function(hint){
    var text = hint.textContent || '';
    if (unit === 'cm'){
      /* 高亮 cm 范围: 50–230 cm / 56–280 cm */
      text = text.replace(/(\d+[\u2013\u2014\-]\d+\s*)(?:\u2033|in|inches?)/gi, function(m, range){
        return '<span style="opacity:0.4">' + m + '</span>';
      });
      text = text.replace(/(\d+[\u2013\u2014\-]\d+\s*)(cm|centimeters?)/gi, function(m, range){
        return '<span style="color:#b87a5a;font-weight:600">' + m + '</span>';
      });
    } else {
      /* 高亮 inch 范围 */
      text = text.replace(/(\d+[\u2013\u2014\-]\d+\s*)(?:\u2033|in|inches?)/gi, function(m, range){
        return '<span style="color:#b87a5a;font-weight:600">' + m + '</span>';
      });
      text = text.replace(/(\d+[\u2013\u2014\-]\d+\s*)(cm|centimeters?)/gi, function(m, range){
        return '<span style="opacity:0.4">' + m + '</span>';
      });
    }
    hint.innerHTML = text;
  });
}

/* 单位切换时的输入框数值自动换算
   - 从 inches → cm: × 2.54, 保留 1 位小数
   - 从 cm → inches: × (1/2.54), 保留 1 位小数
   - 空白 / NaN / mm 兜底跳过 */
function convertInputValues(fromUnit, toUnit){
  if (fromUnit === toUnit) return;
  var factor;
  if (fromUnit === 'inches' && toUnit === 'cm') factor = 2.54;
  else if (fromUnit === 'cm' && toUnit === 'inches') factor = 1 / 2.54;
  else return; /* 暂不支持 mm */

  ['underbust', 'bust'].forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    var raw = parseFloat(el.value);
    if (isNaN(raw) || raw <= 0) return; /* 空白或非法 — 不动 */
    var converted = raw * factor;
    /* 保留 1 位小数, 但 cm 一般不带 .0, 简化展示 */
    var rounded = Math.round(converted * 10) / 10;
    /* 去除无意义的尾随 .0, 保持输入框视觉简洁 */
    var display = (Math.round(rounded) === rounded) ? String(Math.round(rounded)) : String(rounded);
    el.value = display;
  });
}

function wireUnitSwitch(){
  var sel = document.getElementById('unit');
  if (!sel || sel.dataset.bcUnitWired === '1') return;
  sel.dataset.bcUnitWired = '1';
  /* 初始同步一次 */
  setUnit(sel.value || 'inches');
  sel.addEventListener('change', function(){
    setUnit(sel.value);
  });
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', wireAll);
} else {
  wireAll();
}
/* 多次重试,确保所有脚本加载完毕后才 wire */
[50, 250, 800].forEach(function(t){setTimeout(wireAll, t);});
})();
