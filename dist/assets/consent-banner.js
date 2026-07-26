/* consent-banner.js
 * Lightweight GDPR / CCPA cookie consent banner for breastcalculator.com.
 * - Pure vanilla JS, zero dependencies
 * - Fixed at the bottom of the viewport (z-index 9999)
 * - Three actions: Accept All, Reject All, Settings
 * - Persists choice in a first-party cookie (cookieConsent) + mirrors to localStorage
 * - Hides permanently once a choice is made
 * - Reusable across every page; just include with <script src="/assets/consent-banner.js" defer></script>
 */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__bcConsentBannerLoaded) return;
  window.__bcConsentBannerLoaded = true;

  var CONSENT_COOKIE = 'cookieConsent';
  var CONSENT_LS = 'bc_consent';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

  function getCookie(name) {
    var nameEq = name + '=';
    var parts = document.cookie ? document.cookie.split(';') : [];
    for (var i = 0; i < parts.length; i++) {
      var c = parts[i].replace(/^\s+/, '');
      if (c.indexOf(nameEq) === 0) {
        return decodeURIComponent(c.substring(nameEq.length));
      }
    }
    return null;
  }

  function setCookie(name, value, maxAge) {
    var v = encodeURIComponent(value);
    var parts = [
      name + '=' + v,
      'path=/',
      'max-age=' + maxAge,
      'SameSite=Lax'
    ];
    try {
      if (location.protocol === 'https:') parts.push('Secure');
    } catch (e) {}
    document.cookie = parts.join('; ');
  }

  function persist(value) {
    try {
      setCookie(CONSENT_COOKIE, value, COOKIE_MAX_AGE);
      localStorage.setItem(CONSENT_LS, value);
    } catch (e) {
      // localStorage may be unavailable in privacy modes
    }
    // Inform gtag (GA4) and other listeners about consent changes
    try {
      if (typeof window.gtag === 'function') {
        var ads = value === 'true' ? 'granted' : 'denied';
        var analytics = value === 'true' ? 'granted' : 'granted'; // analytics always on
        window.gtag('consent', 'update', {
          ad_storage: ads,
          ad_user_data: ads,
          ad_personalization: ads,
          analytics_storage: analytics
        });
      }
    } catch (e) {}
    try {
      window.dispatchEvent(new CustomEvent('bc:consent', { detail: { accepted: value === 'true' } }));
    } catch (e) {}
  }

  function readExisting() {
    var c = getCookie(CONSENT_COOKIE);
    if (c === 'true' || c === 'false') return c;
    try {
      var ls = localStorage.getItem(CONSENT_LS);
      if (ls === 'true' || ls === 'false') return ls;
    } catch (e) {}
    return null;
  }

  function removeBanner() {
    var el = document.getElementById('bc-cookie-banner');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function injectStyles() {
    if (document.getElementById('bc-cookie-banner-styles')) return;
    var css = [
      '#bc-cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fdf8f5;border-top:1px solid #e8ddd0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#3a2f25;box-shadow:0 -4px 18px rgba(91,70,54,.08);}',
      '#bc-cookie-banner .bc-cb-inner{max-width:1100px;margin:0 auto;padding:14px 18px;display:flex;flex-direction:column;gap:12px;align-items:stretch;}',
      '@media (min-width:720px){#bc-cookie-banner .bc-cb-inner{flex-direction:row;align-items:center;gap:20px;}}',
      '#bc-cookie-banner .bc-cb-text{font-size:13.5px;line-height:1.55;color:#5b4636;flex:1 1 auto;min-width:0;}',
      '#bc-cookie-banner .bc-cb-text a{color:#7a6455;text-decoration:underline;text-underline-offset:3px;}',
      '#bc-cookie-banner .bc-cb-text a:hover{color:#6b5344;}',
      '#bc-cookie-banner .bc-cb-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;flex:0 0 auto;}',
      '#bc-cookie-banner button{font-family:inherit;font-size:13px;line-height:1;padding:9px 16px;border-radius:6px;cursor:pointer;transition:background .2s ease,color .2s ease,border-color .2s ease;min-height:36px;}',
      '#bc-cookie-banner .bc-cb-reject,#bc-cookie-banner .bc-cb-settings{background:transparent;border:1px solid #d8c8b6;color:#7a6455;}',
      '#bc-cookie-banner .bc-cb-reject:hover,#bc-cookie-banner .bc-cb-settings:hover{background:#f4e3d7;border-color:#7a6455;color:#6b5344;}',
      '#bc-cookie-banner .bc-cb-accept{background:#7a6455;border:1px solid #7a6455;color:#fff;font-weight:600;}',
      '#bc-cookie-banner .bc-cb-accept:hover{background:#6b5344;border-color:#6b5344;}',
      'body.bc-cb-shown{padding-bottom:96px;}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'bc-cookie-banner-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.getElementById('bc-cookie-banner')) return;
    injectStyles();

    var banner = document.createElement('div');
    banner.id = 'bc-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = [
      '<div class="bc-cb-inner">',
      '  <p class="bc-cb-text">',
      '    We use cookies to improve your experience and serve personalized ads. By clicking "Accept All", you consent to our use of cookies.',
      '    <a href="/privacy/">Privacy Policy</a>',
      '  </p>',
      '  <div class="bc-cb-actions">',
      '    <button type="button" class="bc-cb-reject" data-bc-cb="reject">Reject All</button>',
      '    <button type="button" class="bc-cb-settings" data-bc-cb="settings">Settings</button>',
      '    <button type="button" class="bc-cb-accept" data-bc-cb="accept">Accept All</button>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);
    document.body.classList.add('bc-cb-shown');

    banner.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.getAttribute) return;
      var action = t.getAttribute('data-bc-cb');
      if (!action) return;
      if (action === 'accept') {
        persist('true');
        removeBanner();
        document.body.classList.remove('bc-cb-shown');
      } else if (action === 'reject') {
        persist('false');
        removeBanner();
        document.body.classList.remove('bc-cb-shown');
      } else if (action === 'settings') {
        // Deep-link to the cookies section of the privacy policy
        window.location.href = '/privacy/#cookies';
      }
    });
  }

  function init() {
    var existing = readExisting();
    if (existing === 'true' || existing === 'false') {
      // Already made a choice — make sure gtag reflects the persisted value
      try {
        if (typeof window.gtag === 'function') {
          var ads = existing === 'true' ? 'granted' : 'denied';
          window.gtag('consent', 'update', {
            ad_storage: ads,
            ad_user_data: ads,
            ad_personalization: ads,
            analytics_storage: 'granted'
          });
        }
      } catch (e) {}
      return;
    }
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
