(function() {

 'use strict';
 // HTML escape helper
 function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }



 // ========== Global error guard (suppress & log null-target addEventListener from

 // third-party / built bundles — keeps the page functional) ==========

 (function installErrorGuard() {

 if (window.__bcErrorGuardInstalled) return;

 window.__bcErrorGuardInstalled = true;

 var orig = window.onerror;

 window.onerror = function(msg, src, line, col, err) {

 try {

 var s = String(msg || '');

 if (/Cannot read propert.*null.*addEventListener/.test(s)) {

 console.warn('[bc-guard] suppressed null-target addEventListener at', src, line);

 return true; // suppress

 }

 } catch (e) {}

 if (typeof orig === 'function') return orig.apply(this, arguments);

 return false;

 };

 })();


 // ========== iOS / macOS Safari viewport fix ==========

 // iOS Safari URL bar causes 100vh to be too tall; --vh tracks the *real* visible height.

 function setVh() {

 const vh = window.innerHeight * 0.01;

 document.documentElement.style.setProperty('--vh', vh + 'px');

 }

 setVh();

 window.addEventListener('resize', setVh, { passive: true });

 window.addEventListener('orientationchange', () => setTimeout(setVh, 100), { passive: true });

 if (window.visualViewport) {

 window.visualViewport.addEventListener('resize', setVh, { passive: true });

 }


 // ========== Unit System ==========

 const UNIT_CONFIG = {

 inch: {

 label: 'Inches',

 underbust: { min: 20, max: 60, step: 0.1, placeholder: 'e.g. 32' },

 bust: { min: 22, max: 70, step: 0.1, placeholder: 'e.g. 38' },

 toInches: 1

 },

 cm: {

 label: 'Centimeters',

 underbust: { min: 50, max: 152, step: 0.1, placeholder: 'e.g. 81' },

 bust: { min: 56, max: 178, step: 0.1, placeholder: 'e.g. 97' },

 toInches: 1 / 2.54

 },

 mm: {

 label: 'Millimeters',

 underbust: { min: 500, max: 1520, step: 1, placeholder: 'e.g. 813' },

 bust: { min: 560, max: 1780, step: 1, placeholder: 'e.g. 965' },

 toInches: 1 / 25.4

 }

 };


 let currentUnit = 'inch';


 function convertToInches(value, unit) {

 return value * UNIT_CONFIG[unit].toInches;

 }


 function updateUnitUI(unit) {

 currentUnit = unit;

 const config = UNIT_CONFIG[unit];


 const underbustInput = document.getElementById('underbust');

 const bustInput = document.getElementById('bust');


 if (!underbustInput || !bustInput) return;


 underbustInput.min = config.underbust.min;

 underbustInput.max = config.underbust.max;

 underbustInput.step = config.underbust.step;

 underbustInput.placeholder = config.underbust.placeholder;


 bustInput.min = config.bust.min;

 bustInput.max = config.bust.max;

 bustInput.step = config.bust.step;

 bustInput.placeholder = config.bust.placeholder;


 document.querySelectorAll('.unit-btn').forEach(function(btn) {

 btn.classList.toggle('active', btn.dataset.unit === unit);

 });

 }


 function initUnitToggle() {

 var toggle = document.getElementById('unit-toggle');

 if (!toggle) return;


 toggle.addEventListener('click', function(e) {

 var btn = e.target.closest('.unit-btn');

 if (!btn || btn.classList.contains('active')) return;

 updateUnitUI(btn.dataset.unit);

 });

 }


 // ========== Bra Size Calculation ==========

 var CUP_SIZES = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J', 'K'];

 var UK_CUP_MAP = { 'DDD': 'E', 'G': 'F', 'H': 'FF', 'I': 'G', 'J': 'GG', 'K': 'H' };

 var EU_CUP_MAP = { 'DD': 'E', 'DDD': 'F', 'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J', 'K': 'K' };


 function getCupLetter(index) {

 if (index < 0) return CUP_SIZES[0];

 if (index >= CUP_SIZES.length) return CUP_SIZES[CUP_SIZES.length - 1];

 return CUP_SIZES[index];

 }


 function calculateBraSize(underbustInches, bustInches) {

 var bandSize = Math.round(underbustInches);

 if (bandSize % 2 !== 0) bandSize += 1;

 if (bandSize < 28) bandSize = 28;

 if (bandSize > 50) bandSize = 50;


 var diff = bustInches - bandSize;

 var cupIndex = Math.round(diff);

 if (cupIndex < 0) cupIndex = 0;

 if (cupIndex > 10) cupIndex = 10;


 var usCup = getCupLetter(cupIndex);

 var ukCup = UK_CUP_MAP[usCup] || usCup;

 var euCup = EU_CUP_MAP[usCup] || usCup;

 var euBand = Math.round((bandSize * 2.54) / 5) * 5;

 var frBand = euBand + 15;


 return {

 us: bandSize + usCup,

 uk: bandSize + ukCup,

 eu: euBand + euCup,

 fr: frBand + euCup,

 au: (bandSize - 22) + usCup,

 india: bandSize + usCup,

 cupDiff: diff.toFixed(1),

 cupLetter: usCup

 };

 }


 function getBraRecommendation(cupLetter, bandSize) {

 var text = 'Your recommended bra size is ';

 text += bandSize + cupLetter + '. ';

 if (cupLetter === 'AA' || cupLetter === 'A') {

 text += 'Smaller cup sizes are normal. Ensure a proper fit by checking the band and straps.';

 } else if (cupLetter === 'B' || cupLetter === 'C' || cupLetter === 'D') {

 text += 'This is a common size range. A well-fitted bra should feel comfortable without digging in.';

 } else {

 text += 'Larger cup sizes need extra support. Look for bras with wider straps and reinforced bands.';

 }

 return text;

 }


 function initSizeCalculator() {

 var form = document.getElementById('size-form');

 if (!form) return;


 form.addEventListener('submit', function(e) {

 e.preventDefault();


 var underbustVal = parseFloat(document.getElementById('underbust').value);

 var bustVal = parseFloat(document.getElementById('bust').value);


 if (isNaN(underbustVal) || isNaN(bustVal)) return;


 var underbustInches = convertToInches(underbustVal, currentUnit);

 var bustInches = convertToInches(bustVal, currentUnit);


 var result = calculateBraSize(underbustInches, bustInches);


 document.getElementById('size-us').textContent = result.us;

 document.getElementById('size-uk').textContent = result.uk;

 document.getElementById('size-eu').textContent = result.eu;

 document.getElementById('size-fr').textContent = result.fr;

 document.getElementById('size-au').textContent = result.au;

 document.getElementById('size-india').textContent = result.india;

 document.getElementById('cup-diff').textContent = result.cupLetter;

 document.getElementById('cup-diff-value').textContent = result.cupDiff;

 document.getElementById('size-recommendation').textContent = getBraRecommendation(result.cupLetter, parseInt(result.us));


 var resultDiv = document.getElementById('size-result');

 resultDiv.classList.remove('hidden');

 resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });


 });

 }


 // ========== Breast Volume Calculator ==========

 function estimateBreastVolume(underbustInches, bustInches) {

 var diff = bustInches - underbustInches;

 var bandSize = Math.round(underbustInches);

 if (bandSize % 2 !== 0) bandSize += 1;

 if (bandSize < 28) bandSize = 28;

 if (bandSize > 50) bandSize = 50;


 var cupIndex = Math.round(diff);

 if (cupIndex < 0) cupIndex = 0;

 if (cupIndex > 10) cupIndex = 10;


 var CUP_VOLUMES = [150, 200, 280, 350, 430, 520, 620, 720, 830, 950, 1080];

 var baseVolume = CUP_VOLUMES[cupIndex] || 1080;


 var bandAdjustment = (bandSize - 34) * 8;

 var volume = Math.round(baseVolume + bandAdjustment);

 if (volume < 100) volume = 100;


 var category, note;

 if (volume <= 250) {

 category = 'Small';

 note = 'This volume range is common for AA to A cup sizes. Your breast volume is on the smaller side, which often allows for more bra style options including bralettes and wireless designs.';

 } else if (volume <= 400) {

 category = 'Average';

 note = 'This volume range corresponds to approximately B to C cup sizes. Most standard bras are designed for this volume range, giving you a wide variety of choices.';

 } else if (volume <= 600) {

 category = 'Full';

 note = 'This volume range typically corresponds to D to DD cup sizes. Bras with wider straps, reinforced bands, and full-coverage cups provide the best support.';

 } else if (volume <= 900) {

 category = 'Large';

 note = 'This volume range is common for DDD to G cup sizes. Look for bras specifically designed for larger busts with extra support features and wider side panels.';

 } else {

 category = 'Very Large';

 note = 'This volume range is for H+ cup sizes. Specialized bras with maximum support, reinforced construction, and cushioned straps are recommended for comfort and breast health.';

 }


 return { volume: volume, category: category, note: note, diff: diff.toFixed(1) };

 }


 function initVolumeCalculator() {

 var form = document.getElementById('volume-form');

 if (!form) return;


 form.addEventListener('submit', function(e) {

 e.preventDefault();


 var underbust = parseFloat(document.getElementById('vol-underbust').value);

 var bust = parseFloat(document.getElementById('vol-bust').value);


 if (isNaN(underbust) || isNaN(bust)) return;


 var result = estimateBreastVolume(underbust, bust);


 document.getElementById('volume-value').textContent = '~' + result.volume + ' cc per breast (' + result.category + ')';

 document.getElementById('volume-note').textContent = result.note;


 var resultDiv = document.getElementById('volume-result');

 resultDiv.classList.remove('hidden');

 resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });


 });

 }


 // ========== Ptosis Calculator ==========

 function getPtosisLevel(nippleScore, hangScore) {

 var total = nippleScore + hangScore;

 if (total <= 1) return { level: 'Grade 0 — No Ptosis', desc: 'Your breasts show minimal to no signs of sagging. Your nipple remains above the breast crease.' };

 if (total <= 3) return { level: 'Grade 1 — Mild Ptosis', desc: 'Your nipple is at or slightly below the breast crease but above the lower breast contour. This is a mild form of sagging.' };

 if (total <= 5) return { level: 'Grade 2 — Moderate Ptosis', desc: 'Your nipple is below the crease but remains above the lowest contour of the breast. Moderate sagging is present.' };

 if (total <= 7) return { level: 'Grade 3 — Advanced Ptosis', desc: 'Your nipple is at the lowest point of the breast, pointing downward. Advanced sagging is present.' };

 return { level: 'Grade 4 — Severe Ptosis', desc: 'Your nipple is clearly below the lower breast contour. Severe sagging may require medical consultation.' };

 }


 function getPtosisRecommendations(level) {

 var recommendations = [];

 if (level === 0 || level === 1) {

 recommendations.push('Continue wearing well-fitted bras for support');

 recommendations.push('Consider moisture-keeping skincare to maintain skin elasticity');

 } else if (level === 2) {

 recommendations.push('Choose bras with stronger support, such as full-coverage bras');

 recommendations.push('Avoid running or high-impact activities without proper sports bras');

 recommendations.push('Chest exercises (e.g., push-ups) may help strengthen underlying muscles');

 } else {

 recommendations.push('Consult a healthcare provider for a professional evaluation');

 recommendations.push('Look into supportive undergarments designed for advanced ptosis');

 recommendations.push('Avoid significant weight fluctuations that may worsen sagging');

 recommendations.push('Consider discussing treatment options with a specialist if self-conscious');

 }

 return recommendations;

 }


 function initPtosisCalculator() {

 var form = document.getElementById('ptosis-form');

 if (!form) return;


 form.addEventListener('submit', function(e) {

 e.preventDefault();


 var nippleScore = parseInt(document.getElementById('nipple-position').value);

 var hangScore = parseInt(document.getElementById('tissue-hang').value);


 var result = getPtosisLevel(nippleScore, hangScore);

 var recommendations = getPtosisRecommendations(nippleScore + hangScore);


 document.getElementById('ptosis-level').textContent = result.level;

 document.getElementById('ptosis-description').textContent = result.desc;


 var list = document.getElementById('ptosis-recommendations');

 list.innerHTML = '';

 recommendations.forEach(function(rec) {

 var li = document.createElement('li');

 li.textContent = rec;

 list.appendChild(li);

 });


 var resultDiv = document.getElementById('ptosis-result');

 resultDiv.classList.remove('hidden');

 resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });


 });

 }


 // ========== Expansion Calculator ==========

 function getExpansionLevel(gapScore, directionScore) {

 var total = gapScore + directionScore;

 if (total <= 1) return { level: 'Minimal Splaying', desc: 'Your breasts have minimal outward splaying. The cleavage gap is narrow and your nipples face forward.' };

 if (total <= 3) return { level: 'Mild Splaying', desc: 'Your breasts show mild outward splaying. There is a noticeable gap and/or your nipples point slightly outward.' };

 if (total <= 5) return { level: 'Moderate Splaying', desc: 'Your breasts have moderate splaying. The cleavage gap is wide and your nipples tend to point outward.' };

 return { level: 'Pronounced Splaying', desc: 'Your breasts show pronounced outward splaying. The gap is wide and nipples clearly point away from center.' };

 }


 function getExpansionRecommendations(total) {

 var recs = [];

 if (total <= 1) {

 recs.push('Continue using well-fitted bras to maintain breast position');

 recs.push('No corrective action needed — your breast positioning is balanced');

 } else if (total <= 3) {

 recs.push('Consider bras with center padding or a plunge design to help center the breasts');

 recs.push('Look for bras with side support panels');

 recs.push('Proper fitting is important — ensure the band is snug and straps are adjusted evenly');

 } else {

 recs.push('Consult a professional bra fitter for specialized fitting advice');

 recs.push('Look for bras specifically designed for side support and forward projection');

 recs.push('Try balconette or T-shirt bras that provide structure and centering');

 recs.push('Chest exercises targeting the pectoral muscles may help improve breast posture');

 recs.push('If the condition is causing significant discomfort, consider consulting a healthcare professional');

 }

 return recs;

 }


 function initExpansionCalculator() {

 var form = document.getElementById('expansion-form');

 if (!form) return;


 form.addEventListener('submit', function(e) {

 e.preventDefault();


 var gapScore = parseInt(document.getElementById('cleavage-gap').value);

 var directionScore = parseInt(document.getElementById('nipple-direction').value);


 var result = getExpansionLevel(gapScore, directionScore);

 var recommendations = getExpansionRecommendations(gapScore + directionScore);


 document.getElementById('expansion-level').textContent = result.level;

 document.getElementById('expansion-description').textContent = result.desc;


 var list = document.getElementById('expansion-recommendations');

 list.innerHTML = '';

 recommendations.forEach(function(rec) {

 var li = document.createElement('li');

 li.textContent = rec;

 list.appendChild(li);

 });


 var resultDiv = document.getElementById('expansion-result');

 resultDiv.classList.remove('hidden');

 resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });


 });

 }


 // ========== Mobile Nav Toggle ==========

 function initNavToggle() {

 var toggle = document.querySelector('.nav-toggle');

 var links = document.querySelector('.nav-links');

 if (!toggle || !links) return;


 toggle.addEventListener('click', function() {

 links.classList.toggle('open');

 });


 document.querySelectorAll('.nav-link').forEach(function(link) {

 link.addEventListener('click', function() {

 links.classList.remove('open');

 });

 });

 }


 // gtag 

 function updateGtagConsent(c) {

 if (typeof window.gtag !== 'function') return;

 window.gtag('consent', 'update', {

 'ad_storage': c.ads ? 'granted' : 'denied',

 'ad_user_data': c.ads ? 'granted' : 'denied',

 'ad_personalization': c.ads ? 'granted' : 'denied',

 'analytics_storage': c.ga ? 'granted' : 'denied'

 });

 }


 // AdSense + GA / GTM CSP 

 // -----------------------------------------------------------------------

 // GA4 

 // Cloudflare Workers /stats/gtag/* → 

 // https://www.googletagmanager.com/gtag/* Host 

 // G-XXXXXXX GA4 ID

 // -----------------------------------------------------------------------

 function loadThirdParty(consent) {

 if (window.__bcThirdPartyLoaded) return;

 if (!consent) {

 try { consent = JSON.parse(localStorage.getItem('bc_consent') || 'null') || {}; }

 catch (e) { consent = {}; }

 }

 var wantAds = !!consent.ads;

 var wantGA = !!consent.ga;

 if (!wantAds && !wantGA) return;

 window.__bcThirdPartyLoaded = true;


 // 1) GA4 / GTM /stats 

 if (wantGA) injectScript('/stats/gtag/js?id=G-XXXXXXXXXX', { async: true });

 // 2) AdSense

 if (wantAds) injectScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX', { async: true, crossorigin: 'anonymous' });

 }

 function injectScript(src, attrs) {

 try {

 var s = document.createElement('script');

 s.src = src;

 Object.keys(attrs || {}).forEach(function(k) { s.setAttribute(k, attrs[k]); });

 document.head.appendChild(s);

 } catch (e) { console.warn('[bc] inject failed', src, e); }

 }


 // ========== Chart Tabs ==========

 function initChartTabs() {

 var tabs = document.querySelectorAll('.chart-tab');

 tabs.forEach(function(tab) {

 tab.addEventListener('click', function() {

 document.querySelectorAll('.chart-tab').forEach(function(t) { t.classList.remove('active'); });

 document.querySelectorAll('.chart-panel').forEach(function(p) { p.classList.remove('active'); });

 tab.classList.add('active');

 var panel = document.getElementById(tab.dataset.tab);

 if (panel) panel.classList.add('active');

 });

 });

 }


 // ========== FAQ Accordion ==========

 function initFaqAccordions() {

 var items = document.querySelectorAll('.faq-item h3');

 items.forEach(function(heading) {

 heading.addEventListener('click', function() {

 heading.closest('.faq-item').classList.toggle('open');

 });

 });

 }


 // ========== v4: hover + click + ==========

 // React hydration nav 

 // MutationObserver nav 

 function initToolsNav() {

 var MQ = window.matchMedia('(min-width: 768px)');

 var isDesktop = function() { return MQ.matches; };


 // 

 if (window.__bcToolsNavDelegated) return;

 window.__bcToolsNavDelegated = true;


 function openItem(li) {

 var all = document.querySelectorAll('.nav-links > li');

 all.forEach(function(other) { other.classList.remove('open'); });

 li.classList.add('open');

 }

 function closeAll() {

 var all = document.querySelectorAll('.nav-links > li');

 all.forEach(function(li) { li.classList.remove('open'); });

 }


 // 1) Click .nav-label 

 document.addEventListener('click', function(e) {

 if (!isDesktop()) return;

 var label = e.target.closest('.nav-links > li > .nav-label');

 if (label) {

 e.preventDefault();

 e.stopPropagation();

 var li = label.parentElement;

 if (!li) return;

 if (li.classList.contains('open')) {

 li.classList.remove('open');

 } else {

 openItem(li);

 }

 return;

 }

 // 

 var inDropdown = e.target.closest('.nav-links .dropdown-menu');

 if (inDropdown) return;

 // 

 closeAll();

 }, true);


 // 2) Hover mouseover/mouseout nav-links 

 var navLinks = document.querySelector('.nav-links');

 if (navLinks) {

 navLinks.addEventListener('mouseover', function(e) {

 if (!isDesktop()) return;

 var li = e.target.closest('.nav-links > li');

 if (li && li.querySelector(':scope > .dropdown-menu')) {

 // hover 

 var wasOpen = li.classList.contains('open');

 closeAll();

 if (!wasOpen) li.classList.add('open');

 }

 });

 navLinks.addEventListener('mouseout', function(e) {

 if (!isDesktop()) return;

 var li = e.target.closest('.nav-links > li');

 if (!li) return;

 var related = e.relatedTarget;

 if (related && li.contains(related)) return;

 // li

 li.classList.remove('open');

 });

 }


 // 3) Enter/Space Escape 

 document.addEventListener('keydown', function(e) {

 var active = document.activeElement;

 if (active && active.classList && active.classList.contains('nav-label')) {

 var li = active.parentElement;

 if (li && li.classList.contains('open') === false && (e.key === 'Enter' || e.key === ' ')) {

 e.preventDefault();

 openItem(li);

 } else if (e.key === 'Escape') {

 closeAll();

 active.blur();

 }

 } else if (e.key === 'Escape') {

 closeAll();

 }

 });


 // 4) .nav-label ARIA 

 function syncAria() {

 document.querySelectorAll('.nav-links > li').forEach(function(li) {

 var label = li.querySelector(':scope > .nav-label');

 if (!label) return;

 if (!label.hasAttribute('tabindex')) label.setAttribute('tabindex', '0');

 if (!label.hasAttribute('role')) label.setAttribute('role', 'button');

 if (!label.hasAttribute('aria-haspopup')) label.setAttribute('aria-haspopup', 'true');

 if (!label.hasAttribute('aria-expanded')) {

 label.setAttribute('aria-expanded', li.classList.contains('open') ? 'true' : 'false');

 }

 });

 }

 syncAria();


 // 5) MutationObserver React nav ARIA

 if (window.MutationObserver && !window.__bcNavObserverInstalled) {

 window.__bcNavObserverInstalled = true;

 var mo = new MutationObserver(function(muts) {

 for (var i = 0; i < muts.length; i++) {

 var m = muts[i];

 if (m.type === 'childList' || m.type === 'attributes') {

 syncAria();

 break;

 }

 }

 });

 // nav 

 var nav = document.querySelector('.navbar');

 if (nav) {

 mo.observe(nav, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

 }

 }


 // 6) 

 if (MQ.addEventListener) {

 MQ.addEventListener('change', function() { if (!isDesktop()) closeAll(); });

 } else if (MQ.addListener) {

 MQ.addListener(function() { if (!isDesktop()) closeAll(); });

 }

 }


 // ========== v3: + ==========

 function initInputValidation() {

 document.querySelectorAll('.calc-form, form[data-validate]').forEach(function(form) {

 var inputs = form.querySelectorAll('input[type="number"], input[data-validate], select[data-validate]');

 inputs.forEach(function(input) {

 // /

 var handler = function() { validateField(input); };

 input.addEventListener('blur', handler);

 input.addEventListener('input', function() {

 if (input.classList.contains('invalid')) validateField(input);

 });

 });

 form.addEventListener('submit', function(e) {

 var ok = true;

 inputs.forEach(function(i) { if (!validateField(i)) ok = false; });

 if (!ok) {

 e.preventDefault();

 showToast('Please check the highlighted fields', 'error');

 }

 });

 });

 }

 function validateField(input) {

 var v = input.value;

 var min = parseFloat(input.getAttribute('min'));

 var max = parseFloat(input.getAttribute('max'));

 var required = input.hasAttribute('required');

 // 

 if (input.type === 'number') {

 if (required && (v === '' || isNaN(parseFloat(v)))) {

 setFieldState(input, false, 'Please enter a number');

 return false;

 }

 if (v !== '' && isNaN(parseFloat(v))) {

 setFieldState(input, false, 'Invalid number');

 return false;

 }

 var num = parseFloat(v);

 if (!isNaN(min) && num < min) { setFieldState(input, false, 'Min ' + min); return false; }

 if (!isNaN(max) && num > max) { setFieldState(input, false, 'Max ' + max); return false; }

 } else if (required && !v) {

 setFieldState(input, false, 'Required');

 return false;

 }

 setFieldState(input, true, '');

 return true;

 }

 function setFieldState(input, valid, msg) {

 input.classList.remove(valid ? 'invalid' : 'valid');

 input.classList.add(valid ? 'valid' : 'invalid');

 // input / .input-error

 var sib = input.nextElementSibling;

 if (!sib || !sib.classList || !sib.classList.contains('input-error')) {

 var err = document.createElement('p');

 err.className = 'input-error';

 err.setAttribute('role', 'alert');

 input.insertAdjacentElement('afterend', err);

 sib = err;

 }

 sib.textContent = msg || '';

 }


 // ========== v3: Toast // ==========

 var toastTimer = null;

 function ensureToastNode() {

 var t = document.querySelector('.toast-feedback');

 if (!t) {

 t = document.createElement('div');

 t.className = 'toast-feedback';

 t.setAttribute('role', 'status');

 t.setAttribute('aria-live', 'polite');

 document.body.appendChild(t);

 }

 return t;

 }

 function showToast(msg, type) {

 type = type || 'info';

 var t = ensureToastNode();

 t.className = 'toast-feedback ' + type;

 var icon = type === 'success' ? '' : (type === 'error' ? '' : 'i');

 t.innerHTML = '<span class="toast-icon" aria-hidden="true">' + icon + '</span><span class="toast-text"></span>';

 t.querySelector('.toast-text').textContent = msg;

 // 

 void t.offsetWidth;

 t.classList.add('show');

 clearTimeout(toastTimer);

 toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2400);

 }

 // window 

 window.showToast = showToast;


 // ========== v3: ==========

 function initBackButton() {

 // 

 var path = (location.pathname || '').toLowerCase();

 if (!path || path === '/' || path === '/index.html') return;

 // h1 

 var h1 = document.querySelector('h1');

 if (!h1) return;

 // 

 if (document.querySelector('.back-bar')) return;

 // referrer

 var backHref = '/';

 var referrer = document.referrer || '';

 try {

 var refUrl = new URL(referrer);

 if (refUrl.host === location.host && refUrl.pathname && refUrl.pathname !== location.pathname) {

 backHref = refUrl.pathname;

 }

 } catch (e) {}

 // 

 var title = h1.textContent || document.title || '';

 title = title.replace(/^[\s\-–—:|·•]+|[\s\-–—:|·•]+$/g, '').trim();

 if (!title) title = (document.title || 'Back').split('|')[0].split(':')[0].trim();

 // main 

 var main = document.querySelector('main') || document.body;

 var first = main.firstChild;

 var bar = document.createElement('div');

 bar.className = 'back-bar';

 bar.innerHTML =

 '<a class="back-btn" href="' + backHref + '">Back</a>' +

 '<span class="back-spacer"></span>' +

 '<span class="back-title">' + escapeHtml(title.slice(0, 60)) + '</span>';

 if (first) first.parentElement.insertBefore(bar, first);

 else main.appendChild(bar);

 }


 // ========== v3: React JS ==========

 function injectHomeTools() {

 // v4: Disabled on home page - Bra Size Calculator is the primary first-screen content
 // The home-tools section is no longer rendered on the home page
 var path = (location.pathname || '/').toLowerCase();

 var isHome = path === '/' || path === '/index.html' || /^\/[a-z-]*\/?$/.test(path);

 if (isHome) return;

 if (document.querySelector('.home-tools')) return;

 var section = document.createElement('section');

 section.className = 'home-tools';

 section.innerHTML = [

 '<div class="container">',

 '<h2 class="ht-title">All Calculators &amp; Tools</h2>',

 '<p class="ht-sub">Science-based breast and bra assessments — pick the one that fits your need.</p>',

 '<div class="tools-grid">',

 tile('','Bra Size Calculator','US, UK, EU, FR, AU sizing from two measurements.','/bra-size-calculator/'),

 tile('','Breast Volume','Estimate volume in cc / mL with clinical formulas.','/tools/breast-volume-calculator/'),

 tile('','Breast Weight','Calculate weight in g and kg for health insights.','/tools/breast-weight-calculator/'),

 tile('','Ptosis Grade','Grade sagging with the Regnault classification.','/tools/breast-ptosis-calculator/'),

 tile('','Breast Shape','Identify your breast shape from 6 common types.','/tools/breast-shape-calculator/'),

 tile('','Expansion Ratio','Measure splaying with the nipple-spacing ratio.','/tools/breast-expansion-calculator/'),

 tile('','Length Converter','Convert inches and centimeters instantly.','/tools/length-converter/'),

 tile('','How to Measure','Step-by-step measurement guide with diagrams.','/how-to-measure-bra-size/'),

 '</div>',

 '<div class="hero-cta-group" style="margin-top:24px">',

 '<a class="btn-tool" href="/tools/">View All Tools</a>',

 '<a class="btn-secondary" href="/bra-size-guide/">Bra Size Guides</a>',

 '</div>',

 '</div>'

 ].join('');

 var main = document.querySelector('main') || document.body;

 // main React 

 main.appendChild(section);

 }

 function tile(icon, title, desc, href) {

 return '<a class="tool-tile" href="' + href + '">' +

 '<div class="tt-icon" aria-hidden="true">' + icon + '</div>' +

 '<div class="tt-body"><h3 class="tt-title">' + title + '</h3>' +

 '<p class="tt-desc">' + desc + '</p></div>' +

 '<span class="tt-arrow">→</span></a>';

 }


 // ========== v3: footer / ==========

 // footer inline onclick="toggleFooterCol(this)"

 // [data-footer-col] 

 function initFooterCollapse() {

 if (window.__bcFooterCollapseBound) return;

 window.__bcFooterCollapseBound = true;

 // 1) inline onclick

 window.toggleFooterCol = function(btn) {

 try {

 var col = btn.parentElement;

 var list = col.querySelector('[data-footer-col]');

 if (!list) return;

 var isOpen = list.classList.contains('is-open');

 // 

 col.parentElement.querySelectorAll('[data-footer-col].is-open').forEach(function(el) {

 el.classList.remove('is-open');

 el.classList.add('is-collapsed');

 });

 if (isOpen) {

 list.classList.add('is-collapsed');

 list.classList.remove('is-open');

 btn.setAttribute('aria-expanded', 'false');

 } else {

 list.classList.remove('is-collapsed');

 list.classList.add('is-open');

 btn.setAttribute('aria-expanded', 'true');

 }

 } catch (e) {}

 };

 // 2) 

 if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {

 document.querySelectorAll('footer [data-footer-col]').forEach(function(el) {

 el.classList.add('is-collapsed');

 });

 } else {

 document.querySelectorAll('footer [data-footer-col]').forEach(function(el) {

 el.classList.remove('is-collapsed');

 el.classList.remove('is-open');

 });

 }

 }


 // ========== Init ==========

 document.addEventListener('DOMContentLoaded', function() {

 initNavToggle();

 initUnitToggle();

 initSizeCalculator();

 initPtosisCalculator();

 initVolumeCalculator();

 initExpansionCalculator();

 initCookieConsent();

 initChartTabs();

 initFaqAccordions();

 // v3 additions Tools

 initInputValidation();

 initToolsNav();

 // v6 additions: drawer, back-to-top, share bar, privacy links

 initDrawer();

 initBackToTop();

 initPrivacyPolicyLinks();

 initBackButton();

 initFooterCollapse();
 initBraCalcClear();

 // v3: 

 // React hydration

 setTimeout(injectHomeTools, 50);

 setTimeout(injectHomeTools, 250);

 setTimeout(injectHomeTools, 800);

 // React hydration nav

 [50, 250, 800, 1500, 3000].forEach(function(t) {

 setTimeout(initInputValidation, t);

 setTimeout(initBackButton, t);

 setTimeout(initFooterCollapse, t);

 setTimeout(initToolsNav, t);

 setTimeout(initBackToTop, t);

 setTimeout(initDrawer, t);

 });

 });




 // === v4: Clear button for home Bra Size Calculator ===
 function initBraCalcClear() {
 if (window.__braCalcClearBound) return;
 window.__braCalcClearBound = true;
 document.addEventListener('click', function(e) {
 var btn = e.target.closest('#braCalcClearBtn');
 if (!btn) return;
 var form = btn.closest('form');
 if (!form) return;
 e.preventDefault();
 form.querySelectorAll('input[type="number"], input[type="text"]').forEach(function(i) { i.value = ''; });
 var sel = form.querySelector('select#unit');
 if (sel) sel.value = 'inches';
 var result = form.parentElement.querySelector('[id*="-result"]');
 if (result) result.classList.add('hidden');
 if (typeof showToast === 'function') showToast('Form cleared', 'success');
 });
 }


 // ========== Mobile Drawer (side panel navigation) ==========
 // The drawer is the side panel that opens on small screens when the
 // hamburger (.nav-toggle / #menuToggle) is tapped. It is *separate* from
 // the desktop nav-links hover dropdowns.
 function initDrawer() {
 if (window.__bcDrawerBound) return;
 window.__bcDrawerBound = true;

 var toggle = document.getElementById('menuToggle') || document.querySelector('.nav-toggle');
 var drawer = document.getElementById('drawer');
 var overlay = document.getElementById('drawerOverlay');
 var closeBtn = document.getElementById('drawerClose');

 if (!drawer) return;

 function open() {
 drawer.classList.add('open');
 if (overlay) overlay.classList.add('open');
 document.body.style.overflow = 'hidden';
 if (toggle) {
 toggle.setAttribute('aria-expanded', 'true');
 toggle.setAttribute('aria-label', 'Close menu');
 }
 // Focus the close button for keyboard users
 if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 200);
 }

 function close() {
 drawer.classList.remove('open');
 if (overlay) overlay.classList.remove('open');
 document.body.style.overflow = '';
 if (toggle) {
 toggle.setAttribute('aria-expanded', 'false');
 toggle.setAttribute('aria-label', 'Open menu');
 }
 }

 function isOpen() { return drawer.classList.contains('open'); }

 if (toggle) {
 toggle.addEventListener('click', function(e) {
 e.preventDefault();
 e.stopPropagation();
 if (isOpen()) close(); else open();
 });
 }

 if (closeBtn) {
 closeBtn.addEventListener('click', function(e) {
 e.preventDefault();
 close();
 });
 }

 if (overlay) {
 overlay.addEventListener('click', function() { close(); });
 }

 // Close drawer when a nav link is clicked
 drawer.querySelectorAll('a').forEach(function(a) {
 a.addEventListener('click', function() { close(); });
 });

 // Escape key closes the drawer
 document.addEventListener('keydown', function(e) {
 if (e.key === 'Escape' && isOpen()) {
 close();
 if (toggle) toggle.focus();
 }
 });
 }


 // ========== Back-to-Top button ==========
 // Wires up any element with id="footerBackToTop" or class="back-to-top".
 // Shows / hides based on scroll position, then smooth-scrolls to top.
 function initBackToTop() {
 if (window.__bcBackToTopBound) return;
 window.__bcBackToTopBound = true;

 var btns = document.querySelectorAll('#footerBackToTop, .back-to-top, [data-back-to-top]');
 if (!btns.length) return;

 function visible() {
 return window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
 }

 function update() {
 var y = visible();
 btns.forEach(function(btn) {
 if (y > 320) {
 btn.classList.remove('opacity-0', 'pointer-events-none');
 btn.classList.add('opacity-100', 'pointer-events-auto');
 } else {
 btn.classList.add('opacity-0', 'pointer-events-none');
 btn.classList.remove('opacity-100', 'pointer-events-auto');
 }
 });
 }

 btns.forEach(function(btn) {
 // Make sure it's a button (not a link) so we control the click
 if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');
 // Prevent any default <a href="#"> navigation
 if (btn.tagName === 'A') btn.setAttribute('href', '#');
 btn.addEventListener('click', function(e) {
 e.preventDefault();
 // Respect reduced-motion
 var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 try {
 window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
 } catch (err) {
 window.scrollTo(0, 0);
 }
 // Update focus for a11y
 var main = document.getElementById('main') || document.body;
 if (main && main.setAttribute) {
 main.setAttribute('tabindex', '-1');
 main.focus({ preventScroll: true });
 }
 });
 });

 var ticking = false;
 window.addEventListener('scroll', function() {
 if (!ticking) {
 window.requestAnimationFrame(function() { update(); ticking = false; });
 ticking = true;
 }
 }, { passive: true });

 update();
 }


 // ========== Privacy + Share + Bookmark (psb-bar) ==========
 // Global handlers for the privacy-strip-style bar that sits at the bottom
 // of calculator pages. Provides:
 // - Copy page link (Clipboard API + textarea fallback)
 // - Share to X / Twitter
 // - Share to Facebook
 // - Share to Pinterest (with og:image preview)
 // - Share to Instagram / TikTok (copy-link + instructions fallback)
 // - "Share result" (used after a calculator produces a value)
 // All share functions are zero-storage — they only open native share
 // dialogs in new tabs and never transmit measurements to our servers.
 (function initPsbBar() {
 if (window.__bcPsbBarBound) return;
 window.__bcPsbBarBound = true;

 function pageUrl() { return window.location.href; }
 function pageTitle() { return document.title || 'Breast Calculator'; }

 function getResultText() {
 try {
 var candidates = ['resultValue', 'conversionResult', 'size-us', 'volume-value', 'ptosis-level', 'shape-result', 'expansion-result', 'weight-value', 'length-value'];
 for (var i = 0; i < candidates.length; i++) {
 var el = document.getElementById(candidates[i]);
 if (el && el.textContent && el.textContent.trim() && el.textContent.trim() !== '\u2014' && el.textContent.trim() !== '—') {
 return el.textContent.trim();
 }
 }
 } catch (e) {}
 return '';
 }

 function buildShareText() {
 var r = getResultText();
 if (r) return pageTitle() + ' \u2014 ' + r + ' \u2014 Check it out on Breast Calculator';
 return pageTitle() + ' \u2014 Free tool on Breast Calculator';
 }

 function toast(btn, msg) {
 if (!btn) return;
 var old = btn.innerHTML;
 btn.innerHTML = '<span style="font-size:0.78rem">\u2713 ' + msg + '</span>';
 btn.classList.add('copied');
 setTimeout(function() { btn.innerHTML = old; btn.classList.remove('copied'); }, 1800);
 }

 function fallbackCopy(text, btn) {
 var ta = document.createElement('textarea');
 ta.value = text;
 ta.setAttribute('readonly', '');
 ta.style.position = 'fixed';
 ta.style.top = '0';
 ta.style.left = '0';
 ta.style.opacity = '0';
 document.body.appendChild(ta);
 ta.select();
 try {
 document.execCommand('copy');
 toast(btn, 'Link copied!');
 } catch (e) {
 toast(btn, 'Press Ctrl+C');
 }
 document.body.removeChild(ta);
 }

 window.psbCopyLink = function(btn) {
 if (!btn) btn = document.querySelector('.psb-copy');
 if (!btn) return false;
 var url = pageUrl();
 if (navigator.clipboard && navigator.clipboard.writeText) {
 navigator.clipboard.writeText(url).then(function() {
 btn.classList.add('copied');
 toast(btn, 'Link copied!');
 setTimeout(function() { btn.classList.remove('copied'); }, 1800);
 }).catch(function() { fallbackCopy(url, btn); });
 } else {
 fallbackCopy(url, btn);
 }
 return false;
 };

 window.psbShareX = function(e) {
 if (e) e.preventDefault();
 var text = encodeURIComponent(buildShareText());
 var url = encodeURIComponent(pageUrl());
 window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank', 'noopener,width=550,height=420');
 return false;
 };

 window.psbShareFacebook = function(e) {
 if (e) e.preventDefault();
 var url = encodeURIComponent(pageUrl());
 window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'noopener,width=550,height=420');
 return false;
 };

 window.psbSharePinterest = function(e) {
 if (e) e.preventDefault();
 var desc = encodeURIComponent(buildShareText());
 var url = encodeURIComponent(pageUrl());
 var media = encodeURIComponent('https://breastcalculator.com/images/og-default.jpg');
 window.open('https://pinterest.com/pin/create/button/?url=' + url + '&description=' + desc + '&media=' + media, '_blank', 'noopener,width=750,height=550');
 return false;
 };

 window.psbShareInstagram = function(e) {
 if (e) e.preventDefault();
 var btn = document.querySelector('.psb-copy');
 psbCopyLink(btn);
 if (window.showToast) showToast('Instagram does not allow direct web links \u2014 the page link has been copied. Open Instagram and paste it into your Story, DM, or bio.', 'info');
 else alert('Instagram does not allow direct web links.\n\nThe page link has been copied to your clipboard.\n\nOpen Instagram, then paste the link into your Story, DM, or bio.');
 return false;
 };

 window.psbShareTikTok = function(e) {
 if (e) e.preventDefault();
 var btn = document.querySelector('.psb-copy');
 psbCopyLink(btn);
 if (window.showToast) showToast('TikTok does not allow direct web links \u2014 the page link has been copied. Open TikTok and paste it into your bio or DM.', 'info');
 else alert('TikTok does not allow direct web links in posts.\n\nThe page link has been copied to your clipboard.\n\nOpen TikTok, then paste the link into your bio or DM.');
 return false;
 };

 window.psbBookmark = function(btn) {
 var tip = document.getElementById('psbBookmarkTip');
 if (tip) {
 if (tip.hasAttribute('hidden')) {
 tip.removeAttribute('hidden');
 tip.scrollIntoView({ behavior: 'smooth', block: 'center' });
 } else {
 tip.setAttribute('hidden', '');
 }
 }
 return false;
 };

 // Used by calculators to share the just-computed result.
 window.shareResult = function() {
 var btn = document.querySelector('.psb-copy');
 if (btn) return psbCopyLink(btn);
 return false;
 };
 })();


 // ========== v6: Privacy-strip click → policy modal scroll ==========
 // Adds a smooth-scroll handler for the in-text "Read our privacy policy"
 // anchor so any embedded page can call into the policy.
 function initPrivacyPolicyLinks() {
 if (window.__bcPrivacyLinksBound) return;
 window.__bcPrivacyLinksBound = true;
 document.querySelectorAll('a[href="/privacy/"], a[href="/privacy"], a[href="./../privacy/"]').forEach(function(a) {
 // no-op: links work natively, but we ensure the target is _self and not blank
 a.setAttribute('target', '_self');
 });
 }


 // ========== Cookie Consent (zero-storage compliant) ==========
 // Implements a fully-functional, GDPR/CCPA-friendly consent banner with
 // Accept / Reject / Settings buttons. The banner is generated dynamically
 // if not present in the DOM, so every page picks it up automatically.
 //
 // PERSISTENCE MODEL (defence in depth — "consent once, applies site-wide"):
 // 1. In-memory flag (window.__bcConsent)  – fastest, prevents re-show in the
 //    same page load even if every other store is wiped.
 // 2. localStorage["bcConsent"]            – primary persistent store.
 // 3. sessionStorage["bcConsent"]           – same-tab fallback when
 //    localStorage is disabled / blocked (e.g. strict Safari ITP).
 // 4. document.cookie "bc_consent"          – first-party HTTP cookie with
 //    Path=/, SameSite=Lax, Secure (on https), 365-day expiry. Works across
 //    tabs and survives localStorage being cleared.
 // 5. BroadcastChannel "bc_consent_channel" – real-time cross-tab sync, so
 //    consenting in tab A hides the banner in tab B instantly without
 //    waiting for a reload. The legacy `storage` event is also listened to.
 //
 // LEGACY KEY MIGRATION:
 //   An older revision used the key "cookieConsent". If we detect it we
 //   silently migrate to "bcConsent" so users who consented before are
 //   honoured and the banner does not reappear.
 //
 // IMPORTANT: this site does NOT set tracking or analytics cookies. The
 // consent state is only stored client-side and never transmitted.
 function initCookieConsent() {
 if (window.__bcCookieBound) return;
 window.__bcCookieBound = true;

 var CONSENT_KEY = 'bcConsent';
 var LEGACY_KEY = 'cookieConsent';   // old key used by the previous build
 var DATE_KEY = 'bcConsentDate';
 var VER_KEY = 'bcConsentVersion';
 var COOKIE_NAME = 'bc_consent';
 var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds
 var VERSION = '1';
 var MEMORY_KEY = '__bcConsentFlag';   // in-memory flag (DO NOT collide with public API)
 var CHANNEL_NAME = 'bc_consent_channel';

 // ===== Storage helpers (each never throws) =====
 function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
 function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
 function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
 function ssSet(k, v) { try { sessionStorage.setItem(k, v); return true; } catch (e) { return false; } }

 function isHttps() {
 try { return typeof location !== 'undefined' && location.protocol === 'https:'; }
 catch (e) { return false; }
 }

 function writeCookie(name, value, maxAge) {
 try {
 var exp = new Date(Date.now() + maxAge * 1000).toUTCString();
 var cookie = name + '=' + encodeURIComponent(value) + '; expires=' + exp + '; path=/; SameSite=Lax';
 // Secure flag is required by Chrome for SameSite=None, and is the modern
 // default for any cookie that can leave the page. We only set it on https
 // because most browsers reject Secure cookies set on http origins.
 if (isHttps()) cookie += '; Secure';
 document.cookie = cookie;
 } catch (e) {}
 }

 function readCookie(name) {
 try {
 var prefix = name + '=';
 var parts = document.cookie ? document.cookie.split(';') : [];
 for (var i = 0; i < parts.length; i++) {
 var c = parts[i].replace(/^\s+/, '');
 if (c.indexOf(prefix) === 0) {
 return decodeURIComponent(c.substring(prefix.length));
 }
 }
 } catch (e) {}
 return null;
 }

 function deleteCookie(name) {
 try {
 document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
 } catch (e) {}
 }

 // ===== Migrate old `cookieConsent` key (one-time, silent) =====
 (function migrateLegacy() {
 try {
 var oldVal = lsGet(LEGACY_KEY);
 if (oldVal && !lsGet(CONSENT_KEY)) {
 lsSet(CONSENT_KEY, oldVal);
 // Also write the cookie so cross-page reads see it immediately
 writeCookie(COOKIE_NAME, oldVal, COOKIE_MAX_AGE);
 try { window[MEMORY_KEY] = oldVal; } catch (e) {}
 }
 // Clean up the legacy key regardless to avoid future confusion
 lsSet(LEGACY_KEY, '');
 } catch (e) {}
 })();

 // ===== hasConsent(): checks every available tier =====
 // Returns true ONLY when consent is present AND the stored schema version
 // matches the current VERSION. A version mismatch (e.g. legal text update,
 // new cookie category added) means the user must re-confirm.
 function hasConsent() {
 // 1) Memory flag (no I/O, fastest)
 try { if (window[MEMORY_KEY]) { if (isCurrentVersion()) return true; } } catch (e) {}
 // 2) localStorage
 if (lsGet(CONSENT_KEY) && isCurrentVersion()) return true;
 // 3) sessionStorage (same-tab fallback)
 if (ssGet(CONSENT_KEY) && isCurrentVersion()) return true;
 // 4) document.cookie
 if (readCookie(COOKIE_NAME) && isCurrentVersion()) return true;
 return false;
 }

 // ===== Version helper =====
 // If a stored consent exists but the schema/copy version differs, we treat
 // the user as "undecided" so the banner re-appears with the new wording.
 function isCurrentVersion() {
 try {
 var stored = lsGet(VER_KEY) || readCookie(COOKIE_NAME + '_v');
 if (!stored) return true; // No version recorded — accept the legacy value
 return stored === VERSION;
 } catch (e) {
 return true; // On error, do not re-prompt unnecessarily
 }
 }

 // ===== getConsentValue(): returns the stored value or null =====
 function getConsentValue() {
 try { if (window[MEMORY_KEY]) return window[MEMORY_KEY]; } catch (e) {}
 var v = lsGet(CONSENT_KEY);
 if (v) return v;
 v = ssGet(CONSENT_KEY);
 if (v) return v;
 v = readCookie(COOKIE_NAME);
 if (v) return v;
 return null;
 }

 // ===== setConsent(): writes to ALL five tiers + broadcasts =====
 function setConsent(value) {
 if (!value) return;
 // 1) In-memory
 try { window[MEMORY_KEY] = value; } catch (e) {}
 // 2) localStorage
 lsSet(CONSENT_KEY, value);
 lsSet(DATE_KEY, new Date().toISOString());
 lsSet(VER_KEY, VERSION);
 // 3) sessionStorage (works even when localStorage is blocked)
 ssSet(CONSENT_KEY, value);
 // 4) HTTP cookie (cross-tab, cross-page, survives localStorage wipe)
 writeCookie(COOKIE_NAME, value, COOKIE_MAX_AGE);
 writeCookie(COOKIE_NAME + '_v', VERSION, COOKIE_MAX_AGE);
 // 5) Cross-tab broadcast (instant hide of banner in sibling tabs)
 try {
 if (typeof BroadcastChannel !== 'undefined') {
 var ch = new BroadcastChannel(CHANNEL_NAME);
 ch.postMessage({ type: 'consent', value: value, ts: Date.now() });
 ch.close();
 }
 } catch (e) {}
 // Notify any listeners (e.g. analytics that respect consent)
 try {
 window.dispatchEvent(new CustomEvent('bc:consent', { detail: { value: value } }));
 } catch (e) {}
 }

 // ===== Listen for cross-tab consent updates (other tab clicked Accept) =====
 var __bcChannel = null;
 try {
 if (typeof BroadcastChannel !== 'undefined') {
 __bcChannel = new BroadcastChannel(CHANNEL_NAME);
 __bcChannel.onmessage = function(ev) {
 try {
 if (ev && ev.data && ev.data.type === 'consent' && ev.data.value) {
 // Mirror into local tiers (silently) and hide any visible banner
 ssSet(CONSENT_KEY, ev.data.value);
 lsSet(CONSENT_KEY, ev.data.value);
 try { window[MEMORY_KEY] = ev.data.value; } catch (e) {}
 hideBanner();
 }
 } catch (e) {}
 };
 }
 } catch (e) {}

 // ===== Legacy cross-tab sync via the `storage` event =====
 try {
 window.addEventListener('storage', function(ev) {
 try {
 if (!ev) return;
 if (ev.key === CONSENT_KEY && ev.newValue) {
 ssSet(CONSENT_KEY, ev.newValue);
 try { window[MEMORY_KEY] = ev.newValue; } catch (e) {}
 hideBanner();
 }
 } catch (e) {}
 });
 } catch (e) {}

 // ===== Public API on window (for debugging / external use) =====
 try {
 window.__bcConsent = {
 get: getConsentValue,
 has: hasConsent,
 set: setConsent,
 clear: function() {
 try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
 try { sessionStorage.removeItem(CONSENT_KEY); } catch (e) {}
 try { window[MEMORY_KEY] = null; } catch (e) {}
 deleteCookie(COOKIE_NAME);
 }
 };
 } catch (e) {}

 // Build a clean banner if the page didn't ship one
 function ensureBanner() {
 var banner = document.getElementById('cookieBanner');
 if (banner) return banner;

 // Inject a minimal, accessible, mobile-friendly banner
 banner = document.createElement('div');
 banner.className = 'cookie-banner';
 banner.id = 'cookieBanner';
 banner.setAttribute('role', 'dialog');
 banner.setAttribute('aria-live', 'polite');
 banner.setAttribute('aria-label', 'Cookie consent');
 banner.innerHTML =
 '<div class="cookie-icon" aria-hidden="true">' +
 '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
 '<path d="M21 12.5a9 9 0 1 1-9.5-9 4 4 0 0 0 4 4 4 4 0 0 0 4 4 1.5 1.5 0 0 0 1 1z"/>' +
 '<circle cx="8.5" cy="10.5" r="0.5" fill="currentColor"/>' +
 '<circle cx="12" cy="14" r="0.5" fill="currentColor"/>' +
 '<circle cx="15.5" cy="11.5" r="0.5" fill="currentColor"/>' +
 '</svg></div>' +
 '<div class="cookie-text">' +
 '<strong>We respect your privacy.</strong> ' +
 'This site does not use tracking or advertising cookies. ' +
 'Only an essential consent preference is stored locally in your browser. ' +
 '<a href="/privacy/" class="cookie-policy-link">Read our privacy policy</a>.' +
 '</div>' +
 '<div class="cookie-btns">' +
 '<button type="button" class="btn-secondary cookie-reject" data-cookie-action="reject">Reject</button>' +
 '<button type="button" class="btn-secondary cookie-settings" data-cookie-action="settings">Settings</button>' +
 '<button type="button" class="btn-primary cookie-accept" data-cookie-action="accept">Accept All</button>' +
 '</div>';
 document.body.appendChild(banner);
 return banner;
 }

 // Build the privacy settings modal if the page didn't ship one
 function ensureModal() {
 var modal = document.getElementById('privacyModal');
 if (modal) return modal;

 modal = document.createElement('div');
 modal.className = 'modal-overlay';
 modal.id = 'privacyModal';
 modal.setAttribute('role', 'dialog');
 modal.setAttribute('aria-modal', 'true');
 modal.setAttribute('aria-labelledby', 'privacyModalTitle');
 modal.innerHTML =
 '<div class="modal">' +
 '<h3 id="privacyModalTitle">Privacy Settings</h3>' +
 '<label><input type="checkbox" id="ckFunc" checked disabled>' +
 '<span><strong>Essential</strong> &mdash; stores your consent preference only. Always on.</span></label>' +
 '<label><input type="checkbox" id="ckAnalytics">' +
 '<span><strong>Analytics</strong> &mdash; currently disabled. This site runs zero analytics.</span></label>' +
 '<div class="modal-actions">' +
 '<button type="button" class="btn-secondary" data-cookie-action="close-settings">Cancel</button>' +
 '<button type="button" class="btn-primary" data-cookie-action="save-settings">Save Settings</button>' +
 '</div></div>';
 document.body.appendChild(modal);
 return modal;
 }

 // === Defence-in-depth: hard-block banner/modal on non-homepage pages ===
 // Even though the bottom of initCookieConsent() already returns early on
 // non-homepage routes, we re-check here so that ANY future call path
 // (e.g. a public-API consumer calling __bcConsent.show()) is also blocked.
 function isConsentSurfaceAllowed() {
 try { return isHomePage(); } catch (e) { return false; }
 }

 function showBanner() {
 // HARD GUARD: cookie consent is homepage-only. Never render the banner
 // on article, tool, calculator, or any other non-homepage route.
 if (!isConsentSurfaceAllowed()) return;
 var b = ensureBanner();
 // small delay so the page paints first
 setTimeout(function() { b.classList.add('show'); }, 320);
 }

 function hideBanner() {
 var b = document.getElementById('cookieBanner');
 if (!b) return;
 // If the element is already hidden (no .show class), nothing to do.
 // This guards against double-hide calls from accept() + closeSettings().
 if (!b.classList.contains('show')) {
 b.style.display = 'none';
 b.setAttribute('aria-hidden', 'true');
 b.setAttribute('hidden', '');
 return;
 }
 // Play the smooth retraction animation. We swap in the .hiding class
 // which triggers the fadeOutDown keyframe defined in style.css. Once
 // the animation ends we drop .show + .hiding and set display:none so
 // the element is fully removed from the accessibility tree and from
 // the focus order. No layout shift because position:fixed keeps the
 // banner out of the normal document flow.
 b.classList.remove('show');
 b.classList.add('hiding');
 b.setAttribute('aria-hidden', 'true');
 var onEnd = function() {
 b.removeEventListener('animationend', onEnd);
 b.classList.remove('hiding');
 b.style.display = 'none';
 b.setAttribute('hidden', '');
 };
 b.addEventListener('animationend', onEnd);
 // Safety fallback: if 'animationend' never fires (e.g. reduced-motion
 // user with animations disabled, or a browser quirk) we still hide the
 // banner after the same duration. This avoids the banner getting stuck
 // visible if the event is missed.
 setTimeout(function() {
 if (b.classList.contains('hiding')) {
 b.classList.remove('hiding');
 b.style.display = 'none';
 b.setAttribute('hidden', '');
 }
 }, 400);
 }

 function openSettings() {
 // HARD GUARD: settings modal is homepage-only.
 if (!isConsentSurfaceAllowed()) return;
 var m = ensureModal();
 m.classList.remove('closing');
 m.classList.add('show');
 m.style.display = 'flex';
 m.setAttribute('aria-hidden', 'false');
 m.removeAttribute('hidden');
 // Reflect current state
 try {
 var c = localStorage.getItem(CONSENT_KEY) || readCookie(COOKIE_NAME);
 var a = document.getElementById('ckAnalytics');
 if (a) a.checked = (c === 'all');
 } catch (e) {}
 hideBanner();
 }

 function closeSettings() {
 var m = document.getElementById('privacyModal');
 if (!m) return;
 // If already closed, nothing to do
 if (!m.classList.contains('show') && m.style.display === 'none') return;
 // Play the fade-out animation before fully removing the modal from
 // the layout. Same pattern as hideBanner() — swap in .closing, wait
 // for animationend, then set display:none and clear ARIA.
 m.classList.remove('show');
 m.classList.add('closing');
 m.setAttribute('aria-hidden', 'true');
 var onEnd = function() {
 m.removeEventListener('animationend', onEnd);
 m.classList.remove('closing');
 m.style.display = 'none';
 m.setAttribute('hidden', '');
 // If the user hasn't decided yet, re-show banner
 if (!hasConsent()) showBanner();
 };
 m.addEventListener('animationend', onEnd);
 // Safety fallback: still close even if animationend is missed.
 setTimeout(function() {
 if (m.classList.contains('closing')) {
 m.classList.remove('closing');
 m.style.display = 'none';
 m.setAttribute('hidden', '');
 if (!hasConsent()) showBanner();
 }
 }, 250);
 }

 function accept() {
 setConsent('all');
 hideBanner();
 closeSettings();
 flashToast('Cookie preferences saved');
 }

 function reject() {
 setConsent('rejected');
 hideBanner();
 closeSettings();
 flashToast('Only essential cookies will be used');
 }

 function saveSettings() {
 var analytics = document.getElementById('ckAnalytics');
 var aChecked = analytics && analytics.checked;
 setConsent(aChecked ? 'all' : 'essential');
 hideBanner();
 closeSettings();
 flashToast('Cookie preferences saved');
 }

 // Minimal toast for confirmation feedback
 function flashToast(msg) {
 try {
 var t = document.createElement('div');
 t.className = 'consent-toast';
 t.setAttribute('role', 'status');
 t.setAttribute('aria-live', 'polite');
 t.textContent = msg;
 document.body.appendChild(t);
 setTimeout(function() { t.classList.add('show'); }, 10);
 setTimeout(function() {
 t.classList.remove('show');
 setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 250);
 }, 1800);
 } catch (e) {}
 }

 // Event delegation for the dynamic cookie banner + modal
 document.addEventListener('click', function(e) {
 var t = e.target.closest('[data-cookie-action]');
 if (!t) return;
 var action = t.getAttribute('data-cookie-action');
 if (action === 'accept') accept();
 else if (action === 'reject') reject();
 else if (action === 'settings') openSettings();
 else if (action === 'close-settings') closeSettings();
 else if (action === 'save-settings') saveSettings();
 });

 // Also wire any pre-existing banner buttons that don't have data attributes
 // (backwards compat with the older inline-onclick pattern).
 document.addEventListener('click', function(e) {
 var btn = e.target.closest('#cookieBanner button, #privacyModal button');
 if (!btn) return;
 if (btn.hasAttribute('data-cookie-action')) return; // already handled
 var txt = (btn.textContent || '').toLowerCase().trim();
 // Order matters: 'save settings' would otherwise match 'settings' first.
 if (txt.indexOf('accept') !== -1) { accept(); return; }
 if (txt.indexOf('reject') !== -1) { reject(); return; }
 if (txt.indexOf('save') !== -1) { saveSettings(); return; }
 if (txt.indexOf('cancel') !== -1 || txt === 'close') { closeSettings(); return; }
 if (txt === 'settings' || txt === 'privacy settings' || (txt.indexOf('settings') !== -1 && txt.indexOf('save') === -1)) { openSettings(); return; }
 });

 // Click outside the modal to close
 document.addEventListener('click', function(e) {
 var m = document.getElementById('privacyModal');
 if (!m || !m.classList.contains('show')) return;
 if (e.target === m) closeSettings();
 });

 // Escape key closes the modal
 document.addEventListener('keydown', function(e) {
 if (e.key !== 'Escape') return;
 var m = document.getElementById('privacyModal');
 if (m && m.classList.contains('show')) closeSettings();
 });

 // Show banner ONLY on the main homepage, and ONLY if no decision has been
 // recorded yet. The preference is persisted across sessions, so once the
 // user accepts or rejects, the banner never reappears on the homepage. On
 // every other page of the site the banner is never shown at all.
 //
 // === HOMEPAGE-ONLY RENDERING CONTRACT ===
 // The cookie consent popup is rendered EXCLUSIVELY on the website's main
 // homepage. This is enforced at THREE independent layers so a single bug
 // cannot leak the banner onto a non-homepage route:
 //
 //  1) EARLY-RETURN (this block):
 //     `if (!isHomePage()) return;` — prevents showBanner() from being
 //     called on article, tool, calculator, compare, privacy, terms, etc.
 //
 //  2) FUNCTION-LEVEL GUARDS (defence in depth):
 //     `showBanner()` and `openSettings()` themselves re-check
 //     `isConsentSurfaceAllowed()` before touching the DOM. This means
 //     even if a future caller invokes them directly (e.g. via the public
 //     `window.__bcConsent.show` API), the banner still cannot appear on
 //     a non-homepage page.
 //
 //  3) CSS: the cookie banner styles only ever apply on the homepage
 //     (no other page contains a matching element in its shipped HTML,
 //      and the dynamic injector is gated by the JS checks above).
 //
 // === FIRST-VISIT / PREFERENCES-UPDATED RENDERING ===
 // The banner appears when:
 //   (a) This is the user's first visit to the homepage (no decision stored
 //       in any of the four persistence tiers: memory, localStorage,
 //       sessionStorage, document.cookie), OR
 //   (b) The stored consent is for an older schema version, which means
 //       the wording or categories have changed and the user must
 //       re-confirm. The version bump is the only "preferences need to be
 //       updated" trigger we honor.
 if (!isHomePage()) {
 return;
 }
 if (!hasConsent()) {
 // Pre-build the modal so it can open instantly
 ensureModal();
 showBanner();
 }
 }

 // ===== Homepage detection =====
 // The cookie consent banner is, by design, only ever shown on the website's
 // main homepage (/). Other pages (article, bra-size-guide, compare, tools,
 // etc.) must NEVER display the banner — even before the user has chosen.
 //
 // We recognise the homepage by:
 //   1. pathname === "/" (root URL)
 //   2. pathname === "/index.html" (direct file)
 //   3. canonical-link match, in case the site is served under a sub-path
 //   4. <meta name="bc-page" content="home"> override on the homepage
 //      (lets the homepage opt-in explicitly without relying on URL parsing)
 function isHomePage() {
 try {
 var path = (location.pathname || '').toLowerCase();
 // Strip trailing slash for comparison (e.g. "/" and "" both match root)
 var normalised = path.replace(/\/+$/, '');
 if (normalised === '' || normalised === '/index' || normalised === '/index.html') {
 return true;
 }
 // Allow the homepage <head> to opt-in explicitly via a meta tag
 var meta = document.querySelector('meta[name="bc-page"]');
 if (meta && (meta.getAttribute('content') || '').toLowerCase() === 'home') {
 return true;
 }
 // Cross-check canonical link if present
 var canonical = document.querySelector('link[rel="canonical"]');
 if (canonical) {
 var href = (canonical.getAttribute('href') || '').toLowerCase();
 if (href === location.origin + '/' || href === location.origin + '/index.html') {
 return true;
 }
 }
 return false;
 } catch (e) {
 // If anything blows up, fall back to the safest default: do NOT show.
 return false;
 }
 }


})();