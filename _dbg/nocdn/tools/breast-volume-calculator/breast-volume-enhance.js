(function (){'use strict';if (window.__bvEnhanced) return;window.__bvEnhanced = true;function createMindMapSVG(){var svg = '' +
'<svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" class="bv-mindmap-svg" role="img" aria-label="Breast Volume Categories Mind Map">' +
' <defs>' +
' <filter id="bv-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
' <radialGradient id="bv-center-grad" cx="50%" cy="50%"><stop offset="0%" stop-color="#dcb4a5"/><stop offset="100%" stop-color="#c49585"/></radialGradient>' +
' <linearGradient id="bv-branch-1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8c5b9"/><stop offset="100%" stop-color="#dbb7a7"/></linearGradient>' +
' <linearGradient id="bv-branch-2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f2d5c4"/><stop offset="100%" stop-color="#e0c0a8"/></linearGradient>' +
' <linearGradient id="bv-branch-3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fae4d5"/><stop offset="100%" stop-color="#eccfb8"/></linearGradient>' +
' <linearGradient id="bv-branch-4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fbe9db"/><stop offset="100%" stop-color="#efd7c5"/></linearGradient>' +
' <linearGradient id="bv-branch-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fceee3"/><stop offset="100%" stop-color="#f2dfcf"/></linearGradient>' +
' <linearGradient id="bv-branch-6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf3ec"/><stop offset="100%" stop-color="#f5e6d8"/></linearGradient>' +
' </defs>' +
' <!-- Background petal hints -->' +
' <ellipse cx="120" cy="140" rx="80" ry="55" fill="#fef9f7" opacity="0.6" transform="rotate(-30 120 140)"/>' +
' <ellipse cx="480" cy="140" rx="80" ry="55" fill="#fef9f7" opacity="0.6" transform="rotate(30 480 140)"/>' +
' <ellipse cx="120" cy="350" rx="80" ry="55" fill="#fef9f7" opacity="0.6" transform="rotate(30 120 350)"/>' +
' <ellipse cx="480" cy="350" rx="80" ry="55" fill="#fef9f7" opacity="0.6" transform="rotate(-30 480 350)"/>' +
' <ellipse cx="300" cy="90" rx="60" ry="42" fill="#fef9f7" opacity="0.5"/>' +
' <ellipse cx="300" cy="400" rx="60" ry="42" fill="#fef9f7" opacity="0.5"/>' +
' <!-- Connecting lines with curves -->' +
' <path d="M300 240 Q225 170 170 150" fill="none" stroke="#e8d0c5" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.6"/>' +
' <path d="M300 240 Q375 170 430 150" fill="none" stroke="#e8d0c5" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.6"/>' +
' <path d="M300 270 Q225 310 170 330" fill="none" stroke="#e8d0c5" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.6"/>' +
' <path d="M300 270 Q375 310 430 330" fill="none" stroke="#e8d0c5" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.6"/>' +
' <path d="M300 240 L300 110" fill="none" stroke="#e8d0c5" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>' +
' <path d="M300 270 L300 375" fill="none" stroke="#e8d0c5" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>' +
' <!-- Nodes:AA/A cup -->' +
' <circle cx="170" cy="148" r="38" fill="url(#bv-branch-1)" filter="url(#bv-glow)" opacity="0.95"/>' +
' <text x="170" y="143" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#5a3d38">AA / A</text>' +
' <text x="170" y="162" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#7a5f5a">100 – 250 cc</text>' +
' <!-- Nodes:B cup -->' +
' <circle cx="430" cy="148" r="38" fill="url(#bv-branch-2)" filter="url(#bv-glow)" opacity="0.95"/>' +
' <text x="430" y="143" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#5a3d38">B</text>' +
' <text x="430" y="162" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#7a5f5a">250 – 400 cc</text>' +
' <!-- Nodes:C cup -->' +
' <circle cx="170" cy="332" r="38" fill="url(#bv-branch-3)" filter="url(#bv-glow)" opacity="0.95"/>' +
' <text x="170" y="327" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#5a3d38">C</text>' +
' <text x="170" y="346" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#7a5f5a">400 – 550 cc</text>' +
' <!-- Nodes:D cup -->' +
' <circle cx="430" cy="332" r="38" fill="url(#bv-branch-4)" filter="url(#bv-glow)" opacity="0.95"/>' +
' <text x="430" y="327" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#5a3d38">D</text>' +
' <text x="430" y="346" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#7a5f5a">550 – 800 cc</text>' +
' <!-- Nodes:DD+ cup -->' +
' <circle cx="300" cy="108" r="36" fill="url(#bv-branch-5)" filter="url(#bv-glow)" opacity="0.9"/>' +
' <text x="300" y="104" text-anchor="middle" font-family="Georgia,serif" font-size="12" font-weight="700" fill="#5a3d38">DD/E+</text>' +
' <text x="300" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#7a5f5a">800+ cc</text>' +
' <!-- Nodes:G+ cup -->' +
' <circle cx="300" cy="376" r="36" fill="url(#bv-branch-6)" filter="url(#bv-glow)" opacity="0.9"/>' +
' <text x="300" y="372" text-anchor="middle" font-family="Georgia,serif" font-size="12" font-weight="700" fill="#5a3d38">G+</text>' +
' <text x="300" y="388" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#7a5f5a">1000+ cc</text>' +
' <!-- Central node:Breast Volume -->' +
' <circle cx="300" cy="255" r="52" fill="url(#bv-center-grad)" filter="url(#bv-glow)"/>' +
' <circle cx="300" cy="255" r="50" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.35"/>' +
' <text x="300" y="248" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#fff">Breast</text>' +
' <text x="300" y="266" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#fff">Volume</text>' +
' <text x="300" y="283" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="rgba(255,255,255,0.7)">per breast (cc)</text>' +
' <!-- Decorative dots -->' +
' <circle cx="82" cy="112" r="3" fill="#e8c5b9" opacity="0.5"/><circle cx="518" cy="112" r="3" fill="#e8c5b9" opacity="0.5"/>' +
' <circle cx="82" cy="370" r="3" fill="#e8c5b9" opacity="0.5"/><circle cx="518" cy="370" r="3" fill="#e8c5b9" opacity="0.5"/>' +
'</svg>';return svg;}function createDivider(){return '' +
'<div class="bv-divider" aria-hidden="true">' +
' <svg width="80" height="14" viewBox="0 0 80 14"><line x1="0" y1="7" x2="80" y2="7" stroke="currentColor" stroke-width="1" opacity="0.25"/></svg>' +
' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose,#dcb4a5)" stroke-width="1.5" stroke-linecap="round"><path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z"/><circle cx="12" cy="10" r="3" fill="var(--rose,#dcb4a5)" fill-opacity="0.3"/></svg>' +
' <svg width="80" height="14" viewBox="0 0 80 14"><line x1="0" y1="7" x2="80" y2="7" stroke="currentColor" stroke-width="1" opacity="0.25"/></svg>' +
'</div>';}function createImagePlaceholder(){return '' +
'<div class="bv-image-placeholder bv-animate-in bv-delay-2" role="complementary" aria-label="Measurement illustration placeholder">' +
' <div class="bv-ip-icon">' +
' <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">' +
' <rect x="8" y="6" width="32" height="36" rx="4" stroke="#dcb4a5" stroke-width="1.5" stroke-dasharray="3,3" fill="none"/>' +
' <circle cx="24" cy="22" r="8" stroke="#dcb4a5" stroke-width="1.5" fill="rgba(220,180,165,0.08)"/>' +
' <circle cx="24" cy="22" r="3" fill="#dcb4a5" opacity="0.3"/>' +
' <path d="M18 36 Q24 30 30 36" stroke="#dcb4a5" stroke-width="1.5" fill="none"/>' +
' <path d="M16 38 L32 38" stroke="#dcb4a5" stroke-width="1.5" fill="none"/>' +
' <path d="M10 8 Q20 4 20 8" stroke="#dcb4a5" stroke-width="1" fill="none" opacity="0.4"/>' +
' <path d="M38 8 Q28 4 28 8" stroke="#dcb4a5" stroke-width="1" fill="none" opacity="0.4"/>' +
' </svg>' +
' </div>' +
' <div class="bv-ip-title">How to Measure for Accurate Breast Volume</div>' +
' <div class="bv-ip-hint">Illustration:key measurement points for breast volume calculation<br>— add your custom infographic or photo here —</div>' +
'</div>';}function initScrollAnimation(){if (typeof IntersectionObserver === 'undefined'){document.querySelectorAll('.bv-animate-in').forEach(function (el){el.style.opacity = '1';});return;}var observer = new IntersectionObserver(function (entries){entries.forEach(function (entry){if (entry.isIntersecting){entry.target.style.opacity = '1';observer.unobserve(entry.target);}});},{threshold:0.1,rootMargin:'0px 0px -30px 0px'});document.querySelectorAll('.bv-animate-in').forEach(function (el){el.style.opacity = '0';observer.observe(el);});}function injectEnhancements(){var main = document.querySelector('main');if (!main) return;var interpretation = main.querySelector('.interpretation-v2');if (interpretation){var mindmapWrapper = document.createElement('div');mindmapWrapper.className = 'bv-mindmap-wrapper bv-animate-in bv-delay-3';mindmapWrapper.innerHTML =
'<h3>Breast Volume Visual Guide</h3>' +
'<p class="bv-mindmap-sub">Cup size ranges and their corresponding volume in cc (per breast)</p>' +
createMindMapSVG();interpretation.parentNode.insertBefore(mindmapWrapper,interpretation.nextSibling);}var howToMeasure = main.querySelector('.how-to-measure');if (howToMeasure){var placeholderDiv = document.createElement('div');placeholderDiv.innerHTML = createImagePlaceholder();howToMeasure.parentNode.insertBefore(placeholderDiv.firstElementChild,howToMeasure);var dividerDiv = document.createElement('div');dividerDiv.innerHTML = createDivider();howToMeasure.parentNode.insertBefore(dividerDiv.firstElementChild,howToMeasure.previousElementSibling);}if (howToMeasure){var h3s = howToMeasure.querySelectorAll('h3');for (var i = 0;i < h3s.length;i++){h3s[i].classList.add('step-' + (i + 1));}}var toolCard = main.querySelector('.tool-card');if (toolCard){toolCard.classList.add('bv-animate-in');}var elements = main.querySelectorAll('.interpretation-v2,.result-card-v2,.how-to-measure,.tool-faq-v2');elements.forEach(function (el,i){el.classList.add('bv-animate-in');if (i < 4) el.classList.add('bv-delay-' + (i + 1));});initScrollAnimation();}if (document.readyState === 'loading'){document.addEventListener('DOMContentLoaded',injectEnhancements);}else{injectEnhancements();}setTimeout(injectEnhancements,80);setTimeout(injectEnhancements,300);})();