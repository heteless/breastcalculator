# -*- coding: utf-8 -*-
"""Batch fix cookie consent - exact string replacement"""

import os

BASE = r'd:\DevProject\breastcalculator'

# === All files needing the old breastcalc_cookie_consent fix ===
files_all = [
    'article/post-mastectomy-breast-care.html',
    'specials/sports-bra-science.html',
    'specials/expansion-evidence.html',
    'specials/ptosis-prevention-evidence.html',
    'specials/buying-guide.html',
    'specials/accessory-breast-guide.html',
    'specials/why-d-cup-support.html',
    'wellness/prosthetic-bras-guide.html',
    'wellness/sports-bras-after-surgery.html',
]

# --- OLD JS (Pattern A1: with function g/s, semicolons) ---
OLD_JS_A1 = """(function(){'use strict';var T=document.getElementById('menuToggle'),D=document.getElementById('drawer'),O=document.getElementById('drawerOverlay'),C=document.getElementById('drawerClose');function o(){D.classList.add('open');O.classList.add('open');T.setAttribute('aria-expanded','true');}function c(){D.classList.remove('open');O.classList.remove('open');T.setAttribute('aria-expanded','false');}if(T){T.addEventListener('click',function(e){e.stopPropagation();D.classList.contains('open')?c():o();});}if(O){O.addEventListener('click',c);}if(C){C.addEventListener('click',c);}document.addEventListener('keydown',function(e){if(e.key==='Escape'&&D.classList.contains('open')){c();}});var B=document.getElementById('cookieBanner'),M=document.getElementById('privacyModal');function g(){return localStorage.getItem('breastcalc_cookie_consent');}function s(){if(!g()){B.classList.add('show');}}window.acceptCookies=function(){localStorage.setItem('breastcalc_cookie_consent','all');gtag('consent','update',{'analytics_storage':'granted','ad_storage':'granted'});B.classList.remove('show');};window.openPrivacyModal=function(){document.getElementById('ckAnalytics').checked=localStorage.getItem('breastcalc_ck_analytics')!=='false';document.getElementById('ckAd').checked=localStorage.getItem('breastcalc_ck_ad')!=='false';M.classList.add('show');};window.savePrivacy=function(){var a=document.getElementById('ckAnalytics').checked,ad=document.getElementById('ckAd').checked;localStorage.setItem('breastcalc_ck_analytics',a);localStorage.setItem('breastcalc_ck_ad',ad);localStorage.setItem('breastcalc_cookie_consent','custom');gtag('consent','update',{'analytics_storage':a?'granted':'denied','ad_storage':ad?'granted':'denied'});B.classList.remove('show');M.classList.remove('show');};window.closePrivacyModal=function(){M.classList.remove('show');};M.addEventListener('click',function(e){if(e.target===M){M.classList.remove('show');}});document.getElementById('privacyFromDrawer').addEventListener('click',function(e){e.preventDefault();c();openPrivacyModal();});s();})();"""

# --- OLD JS (Pattern A2: compact, no g/s, no braces around if) ---
OLD_JS_A2 = """(function(){'use strict';var T=document.getElementById('menuToggle'),D=document.getElementById('drawer'),O=document.getElementById('drawerOverlay'),C=document.getElementById('drawerClose');function o(){D.classList.add('open');O.classList.add('open');T.setAttribute('aria-expanded','true')}function c(){D.classList.remove('open');O.classList.remove('open');T.setAttribute('aria-expanded','false')}if(T)T.addEventListener('click',function(e){e.stopPropagation();D.classList.contains('open')?c():o()});if(O)O.addEventListener('click',c);if(C)C.addEventListener('click',c);document.addEventListener('keydown',function(e){if(e.key==='Escape'&&D.classList.contains('open'))c()});var B=document.getElementById('cookieBanner'),M=document.getElementById('privacyModal');if(!localStorage.getItem('breastcalc_cookie_consent')){B.classList.add('show')}window.acceptCookies=function(){localStorage.setItem('breastcalc_cookie_consent','all');gtag('consent','update',{'analytics_storage':'granted','ad_storage':'granted'});B.classList.remove('show')};window.openPrivacyModal=function(){document.getElementById('ckAnalytics').checked=localStorage.getItem('breastcalc_ck_analytics')!=='false';document.getElementById('ckAd').checked=localStorage.getItem('breastcalc_ck_ad')!=='false';M.classList.add('show')};window.savePrivacy=function(){var a=document.getElementById('ckAnalytics').checked,ad=document.getElementById('ckAd').checked;localStorage.setItem('breastcalc_ck_analytics',a);localStorage.setItem('breastcalc_ck_ad',ad);localStorage.setItem('breastcalc_cookie_consent','custom');gtag('consent','update',{'analytics_storage':a?'granted':'denied','ad_storage':ad?'granted':'denied'});B.classList.remove('show');M.classList.remove('show')};window.closePrivacyModal=function(){M.classList.remove('show')};M.addEventListener('click',function(e){if(e.target===M)M.classList.remove('show')});document.getElementById('privacyFromDrawer').addEventListener('click',function(e){e.preventDefault();c();setTimeout(openPrivacyModal,400)});})();"""

# --- OLD JS (Pattern B: multiline with function g/s) ---
OLD_JS_B = """(function(){
'use strict';
var T=document.getElementById('menuToggle'),D=document.getElementById('drawer'),O=document.getElementById('drawerOverlay'),C=document.getElementById('drawerClose');
function o(){D.classList.add('open');O.classList.add('open');T.setAttribute('aria-expanded','true');}
function c(){D.classList.remove('open');O.classList.remove('open');T.setAttribute('aria-expanded','false');}
if(T){T.addEventListener('click',function(e){e.stopPropagation();D.classList.contains('open')?c():o();});}
if(O){O.addEventListener('click',c);}if(C){C.addEventListener('click',c);}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&D.classList.contains('open')){c();}});
var B=document.getElementById('cookieBanner'),M=document.getElementById('privacyModal');
function g(){return localStorage.getItem('breastcalc_cookie_consent');}
function s(){if(!g()){B.classList.add('show');}}
window.acceptCookies=function(){localStorage.setItem('breastcalc_cookie_consent','all');gtag('consent','update',{'analytics_storage':'granted','ad_storage':'granted'});B.classList.remove('show');};
window.openPrivacyModal=function(){document.getElementById('ckAnalytics').checked=localStorage.getItem('breastcalc_ck_analytics')!=='false';document.getElementById('ckAd').checked=localStorage.getItem('breastcalc_ck_ad')!=='false';M.classList.add('show');};
window.savePrivacy=function(){var a=document.getElementById('ckAnalytics').checked,ad=document.getElementById('ckAd').checked;localStorage.setItem('breastcalc_ck_analytics',a);localStorage.setItem('breastcalc_ck_ad',ad);localStorage.setItem('breastcalc_cookie_consent','custom');gtag('consent','update',{'analytics_storage':a?'granted':'denied','ad_storage':ad?'granted':'denied'});B.classList.remove('show');M.classList.remove('show');};
window.closePrivacyModal=function(){M.classList.remove('show');};
M.addEventListener('click',function(e){if(e.target===M){M.classList.remove('show');}});
document.getElementById('privacyFromDrawer').addEventListener('click',function(e){e.preventDefault();c();openPrivacyModal();});
s();
})();"""

# --- NEW JS (compact version, always same) ---
NEW_JS = """(function(){'use strict';var T=document.getElementById('menuToggle'),D=document.getElementById('drawer'),O=document.getElementById('drawerOverlay'),C=document.getElementById('drawerClose');function o(){D.classList.add('open');O.classList.add('open');T.setAttribute('aria-expanded','true')}function c(){D.classList.remove('open');O.classList.remove('open');T.setAttribute('aria-expanded','false')}if(T)T.addEventListener('click',function(e){e.stopPropagation();D.classList.contains('open')?c():o()});if(O)O.addEventListener('click',c);if(C)C.addEventListener('click',c);document.addEventListener('keydown',function(e){if(e.key==='Escape'&&D.classList.contains('open'))c()});var cb=document.getElementById('cookieBanner'),pm=document.getElementById('privacyModal');if(!localStorage.getItem('cookieConsent')){cb.classList.add('show')}window.acceptCookies=function(){localStorage.setItem('cookieConsent','all');gtag('consent','update',{'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'});cb.classList.remove('show')};window.openPrivacyModal=function(){cb.classList.remove('show');pm.classList.add('show')};window.closePrivacyModal=function(){pm.classList.remove('show')};window.savePrivacy=function(){var a=document.getElementById('ckAnalytics').checked?'granted':'denied';var ad=document.getElementById('ckAds').checked?'granted':'denied';localStorage.setItem('cookieConsent','custom');gtag('consent','update',{'analytics_storage':a,'ad_storage':ad,'ad_user_data':ad,'ad_personalization':ad});pm.classList.remove('show')};document.getElementById('privacyLink').addEventListener('click',function(e){e.preventDefault();openPrivacyModal()});var pfd=document.getElementById('privacyFromDrawer');if(pfd)pfd.addEventListener('click',function(e){e.preventDefault();c();openPrivacyModal()});})();"""

# HTML replacements
OLD_BANNER_TEXT = '<p>We use cookies to improve your experience. By continuing, you agree to our use of cookies.</p>'
NEW_BANNER_TEXT = '<p>This website uses cookies to optimize your experience and analyze traffic. Click "Accept" to enable analytics and personalization features.</p>'

OLD_BTN_ML = '<button class="btn-primary" onclick="acceptCookies()">Accept All</button>\n<button class="btn-secondary" onclick="openPrivacyModal()">Customize</button>'
NEW_BTN_ML = '<button class="btn-primary" onclick="acceptCookies()">Accept &amp; Continue</button>\n<button class="btn-secondary" onclick="openPrivacyModal()">Privacy Settings</button>'

OLD_BTN_INLINE = '<button class="btn-primary" onclick="acceptCookies()">Accept All</button><button class="btn-secondary" onclick="openPrivacyModal()">Customize</button>'
NEW_BTN_INLINE = '<button class="btn-primary" onclick="acceptCookies()">Accept &amp; Continue</button><button class="btn-secondary" onclick="openPrivacyModal()">Privacy Settings</button>'

OLD_MODAL_ML = '''<h3>Privacy Settings</h3>
<label><input type="checkbox" id="ckAnalytics"> Analytics Storage</label>
<label><input type="checkbox" id="ckAd"> Ad Storage</label>
<div class="modal-actions">
<button class="btn-secondary" onclick="savePrivacy()">Save</button>
<button class="btn-primary" onclick="closePrivacyModal()">Close</button>
</div>'''

NEW_MODAL_ML = '''<h3>Privacy Settings</h3>
<label><input type="checkbox" id="ckFunc" checked disabled><span>Functional Cookies (always on)</span></label>
<label><input type="checkbox" id="ckAnalytics"><span>Analytics Cookies</span></label>
<label><input type="checkbox" id="ckAds"><span>Advertising Cookies</span></label>
<div class="modal-actions">
<button class="btn-secondary" onclick="closePrivacyModal()">Cancel</button>
<button class="btn-primary" onclick="savePrivacy()">Save Settings</button>
</div>'''

OLD_MODAL_INLINE = '<h3>Privacy Settings</h3><label><input type="checkbox" id="ckAnalytics"> Analytics Storage</label><label><input type="checkbox" id="ckAd"> Ad Storage</label><div class="modal-actions"><button class="btn-secondary" onclick="savePrivacy()">Save</button><button class="btn-primary" onclick="closePrivacyModal()">Close</button></div>'
NEW_MODAL_INLINE = '<h3>Privacy Settings</h3><label><input type="checkbox" id="ckFunc" checked disabled><span>Functional Cookies (always on)</span></label><label><input type="checkbox" id="ckAnalytics"><span>Analytics Cookies</span></label><label><input type="checkbox" id="ckAds"><span>Advertising Cookies</span></label><div class="modal-actions"><button class="btn-secondary" onclick="closePrivacyModal()">Cancel</button><button class="btn-primary" onclick="savePrivacy()">Save Settings</button></div>'

for fname in files_all:
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'breastcalc_cookie_consent' not in content:
        print(f"SKIP (no old marker): {fname}")
        continue

    # --- HTML replacements ---
    content = content.replace(OLD_BANNER_TEXT, NEW_BANNER_TEXT)
    content = content.replace(OLD_BTN_ML, NEW_BTN_ML)
    content = content.replace(OLD_BTN_INLINE, NEW_BTN_INLINE)
    content = content.replace(OLD_MODAL_ML, NEW_MODAL_ML)
    content = content.replace(OLD_MODAL_INLINE, NEW_MODAL_INLINE)

    # --- JS replacement ---
    if OLD_JS_A1 in content:
        content = content.replace(OLD_JS_A1, NEW_JS)
        print(f"OK (A1): {fname}")
    elif OLD_JS_A2 in content:
        content = content.replace(OLD_JS_A2, NEW_JS)
        print(f"OK (A2): {fname}")
    elif OLD_JS_B in content:
        content = content.replace(OLD_JS_B, NEW_JS)
        print(f"OK (B): {fname}")
    else:
        print(f"FAIL (no JS pattern match): {fname}")
        # Debug: show first 120 chars of cookie-related JS
        import re
        js_match = re.search(r"\(function\(\)\{'use strict';var T=document\.getElementById\('menuToggle'.*?\}\(\)\);", content, re.DOTALL)
        if js_match:
            js = js_match.group(0)
            print(f"  Found JS length={len(js)}, starts with: {js[:80]}...")
            print(f"  Has 'function g': {'function g' in js}")
            print(f"  Has 'breastcalc': {'breastcalc_cookie_consent' in js}")
        continue

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("\n=== DONE ===")