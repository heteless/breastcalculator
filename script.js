(function() {
    'use strict';

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

    // ========== Cookie Consent ==========
    function initCookieConsent() {
        if (localStorage.getItem('cookieConsent')) return;

        var banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.innerHTML = [
            '<div class="cookie-consent-inner">',
            '<p>This website uses cookies to provide the best user experience and analyze traffic. <a href="/privacy.html">Learn more</a></p>',
            '<div class="cookie-consent-buttons">',
            '<button class="cookie-btn cookie-btn-reject" id="cookie-reject">Reject All</button>',
            '<button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept All</button>',
            '</div>',
            '</div>'
        ].join('');
        document.body.appendChild(banner);

        setTimeout(function() {
            banner.classList.add('show');
        }, 200);

        document.getElementById('cookie-accept').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted'
                });
            }
            banner.classList.remove('show');
            setTimeout(function() { banner.remove(); }, 400);
        });

        document.getElementById('cookie-reject').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied'
                });
            }
            banner.classList.remove('show');
            setTimeout(function() { banner.remove(); }, 400);
        });
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
    });

})();