document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initTabs();
    initSizeCalculator();
    initPtosisCalculator();
});

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', function() {
            links.classList.toggle('open');
        });

        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !links.contains(e.target)) {
                links.classList.remove('open');
            }
        });
    }
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            const result = document.getElementById(tabId).querySelector('.result');
            if (result) {
                result.classList.add('hidden');
            }
        });
    });
}

function initSizeCalculator() {
    const form = document.getElementById('size-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const underbust = parseFloat(document.getElementById('underbust').value);
        const bust = parseFloat(document.getElementById('bust').value);

        if (isNaN(underbust) || isNaN(bust) || underbust < 20 || underbust > 60 || bust < 25 || bust > 70) {
            alert('Please enter valid measurements within the specified ranges.');
            return;
        }

        if (bust <= underbust) {
            alert('Bust measurement must be greater than underbust measurement.');
            return;
        }

        const bandSize = getBandSize(underbust);
        const cupSize = getCupSize(bust, bandSize);
        const sisterSizes = getSisterSizes(bandSize, cupSize);

        document.getElementById('bra-size').textContent = bandSize + cupSize;

        const rec = document.getElementById('size-recommendation');
        rec.innerHTML = getBraRecommendation(bandSize, cupSize, underbust, bust) +
            '<br><br><strong>Sister Sizes:</strong> ' + sisterSizes.join(', ');

        document.getElementById('size-result').classList.remove('hidden');
    });
}

function getBandSize(underbust) {
    let band = Math.round(underbust);
    if (band < 26) return '28';
    if (band < 28) return '28';
    if (band < 30) return '30';
    if (band < 32) return '32';
    if (band < 34) return '34';
    if (band < 36) return '36';
    if (band < 38) return '38';
    if (band < 40) return '40';
    if (band < 42) return '42';
    if (band < 44) return '44';
    if (band < 46) return '46';
    return '48';
}

function getCupSize(bust, bandSize) {
    const bandNum = parseInt(bandSize);
    const diff = bust - bandNum;

    if (diff < 0) return 'AA';
    if (diff < 1) return 'AA';
    if (diff < 2) return 'A';
    if (diff < 3) return 'B';
    if (diff < 4) return 'C';
    if (diff < 5) return 'D';
    if (diff < 6) return 'DD';
    if (diff < 7) return 'DDD';
    if (diff < 8) return 'G';
    if (diff < 9) return 'H';
    if (diff < 10) return 'I';
    if (diff < 11) return 'J';
    return 'K';
}

function getSisterSizes(band, cup) {
    const sizes = [];
    const bandNum = parseInt(band);
    const cupLetters = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J', 'K'];
    const cupIndex = cupLetters.indexOf(cup);

    if (cupIndex > 0 && bandNum < 48) {
        sizes.push((bandNum + 2) + cupLetters[cupIndex - 1]);
    }
    if (cupIndex < cupLetters.length - 1 && bandNum > 26) {
        sizes.push((bandNum - 2) + cupLetters[cupIndex + 1]);
    }

    return sizes.length > 0 ? sizes : ['None available'];
}

function getBraRecommendation(band, cup, underbust, bust) {
    const bandNum = parseInt(band);
    const ratio = bust / underbust;

    if (ratio < 1.1) {
        return 'Your measurements suggest a smaller bust size. Consider trying lightly padded or push-up bras for added shape and definition.';
    } else if (ratio < 1.2) {
        return 'Your measurements indicate an average bust size. Look for comfortable, everyday bras with good support and a natural shape.';
    } else if (ratio < 1.3) {
        return 'Your measurements suggest a fuller bust. We recommend bras with wider straps and full-coverage cups for optimal support.';
    } else {
        return 'Your measurements indicate a larger bust size. Look for bras with reinforced support, wider bands, and fully adjustable straps. Minimizer bras may also be a good option.';
    }
}

function initPtosisCalculator() {
    const form = document.getElementById('ptosis-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nipplePos = parseInt(document.getElementById('nipple-position').value);
        const tissueHang = parseInt(document.getElementById('tissue-hang').value);

        if (isNaN(nipplePos) || isNaN(tissueHang)) {
            alert('Please answer both questions to assess your ptosis level.');
            return;
        }

        const totalScore = nipplePos + tissueHang;
        const result = getPtosisResult(totalScore);

        document.getElementById('ptosis-level').textContent = result.level;
        document.getElementById('ptosis-description').textContent = result.description;

        const recList = document.getElementById('ptosis-recommendations');
        recList.innerHTML = '';
        result.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recList.appendChild(li);
        });

        document.getElementById('ptosis-result').classList.remove('hidden');
    });
}

function getPtosisResult(score) {
    if (score <= 1) {
        return {
            level: 'Grade 0 — No Ptosis',
            description: 'Your breasts show no significant signs of sagging. Your nipples are positioned at or above the breast crease with minimal tissue droop.',
            recommendations: [
                'Continue wearing properly fitted bras for everyday support',
                'Wear a supportive sports bra during exercise',
                'Maintain a stable weight to prevent skin stretching',
                'Keep up with regular breast self-exams'
            ]
        };
    } else if (score <= 3) {
        return {
            level: 'Grade 1 — Mild Ptosis',
            description: 'Your nipples are at or slightly below the breast crease. This is a common and normal stage that many women experience.',
            recommendations: [
                'Choose bras with good support and wider straps',
                'Consider a professional bra fitting for best results',
                'Use moisturizing creams to maintain skin elasticity',
                'Practice good posture to support breast tissue'
            ]
        };
    } else if (score <= 5) {
        return {
            level: 'Grade 2 — Moderate Ptosis',
            description: 'Your nipples are clearly below the breast crease but above the lowest point of the breast. Moderate sagging is common and manageable.',
            recommendations: [
                'Invest in high-support bras with reinforced cups',
                'Consider full-coverage bras for better shaping',
                'Strengthen pectoral muscles with targeted exercises',
                'Consult a bra fitting specialist for personalized advice',
                'Monitor for any changes in breast tissue'
            ]
        };
    } else if (score <= 7) {
        return {
            level: 'Grade 3 — Advanced Ptosis',
            description: 'Your nipples are at the lowest point of the breast, pointing downward. This level of sagging may cause physical discomfort.',
            recommendations: [
                'Wear high-impact support bras with strong underwire',
                'Consider consulting a healthcare professional',
                'Look into breast lift options if discomfort persists',
                'Use proper sleep support with soft, supportive bras',
                'Maintain a healthy lifestyle to support skin health'
            ]
        };
    } else {
        return {
            level: 'Grade 4 — Severe Ptosis',
            description: 'Your nipples are below the lowest point of the breast. This significant level of sagging may be accompanied by skin irritation and discomfort.',
            recommendations: [
                'Consult a healthcare professional for proper evaluation',
                'Consider surgical consultation for breast lift options',
                'Use medical-grade support bras for daily comfort',
                'Watch for skin irritation in the breast crease area',
                'Discuss your options with a board-certified specialist'
            ]
        };
    }
}