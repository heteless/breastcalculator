import Link from 'next/link';

/**
 * Unified footer — matches d:\DevProject\breastcalculator\index.html footer
 * structure: 5-column grid (Brand / Tools / Specials / Wellness / Resources)
 * + bottom bar with copyright + back-to-top. Uses Tailwind classes that are
 * loaded via the layout's <script src="https://cdn.tailwindcss.com/3.4.17">.
 */
export default function Footer() {
  return (
    <>
      <footer className="bg-[#fdf8f5] border-t border-[#e8ddd0] text-[#8b7355] font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-6">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="font-bold text-[1.25rem] leading-[1.6] mb-3" style={{ fontFamily: 'Georgia,\'Times New Roman\',Times,serif', color: '#7a6455' }}>BREAST CALCULATOR</div>
              <p className="text-[0.9rem] leading-[1.6] mb-3" style={{ fontFamily: 'Georgia,\'Times New Roman\',Times,serif', color: '#8b7355' }}>Free science-based bra fitting tools and breast health education.</p>
              <a href="mailto:contact@breastcalculator.com?subject=Inquiry%20from%20Breast%20Calculator" className="inline-flex items-center gap-1.5 text-xs text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 min-h-[28px]">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" /></svg>
                <span className="hover:underline decoration-1 underline-offset-2">contact@breastcalculator.com</span>
              </a>
            </div>

            {/* Tools */}
            <div>
              <button className="flex md:hidden items-center justify-between w-full text-left font-bold text-sm tracking-[0.1em] text-[#7a6455] min-h-[48px] px-0 py-2 bg-transparent border-0 cursor-pointer" onClick={(e) => toggleFooterCol(e.currentTarget)} aria-expanded="false">
                TOOLS
                <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className="font-bold text-sm tracking-[0.1em] mb-3 text-[#7a6455] hidden md:block">TOOLS</div>
              <ul className="space-y-2 hidden md:block m-0 p-0 list-none" data-footer-col>
                <li><Link href="/bra-size-calculator/" className="block text-sm font-semibold text-[#7a6455] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Bra Size Calculator</Link></li>
                <li><Link href="/tools/breast-expansion-calculator/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Breast Expansion Calculator</Link></li>
                <li><Link href="/tools/breast-ptosis-calculator/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Breast Ptosis Calculator</Link></li>
                <li><Link href="/tools/breast-volume-calculator/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Breast Volume Calculator</Link></li>
                <li><Link href="/tools/breast-weight-calculator/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Breast Weight Calculator</Link></li>
                <li><Link href="/tools/breast-shape-calculator/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Breast Shape Calculator</Link></li>
                <li><Link href="/tools/length-converter/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Length Converter</Link></li>
              </ul>
            </div>

            {/* Specials */}
            <div>
              <button className="flex md:hidden items-center justify-between w-full text-left font-bold text-sm tracking-[0.1em] text-[#7a6455] min-h-[48px] px-0 py-2 bg-transparent border-0 cursor-pointer" onClick={(e) => toggleFooterCol(e.currentTarget)} aria-expanded="false">
                SPECIALS
                <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className="font-bold text-sm tracking-[0.1em] mb-3 text-[#7a6455] hidden md:block">SPECIALS</div>
              <ul className="space-y-2 hidden md:block m-0 p-0 list-none" data-footer-col>
                <li><Link href="/specials/why-d-cup-support/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">D+ Cup Support Science</Link></li>
                <li><Link href="/specials/sports-bra-science/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Sports Bra Science</Link></li>
                <li><Link href="/specials/accessory-breast-guide/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Accessory Breast Guide</Link></li>
                <li><Link href="/specials/expansion-evidence/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Expansion Evidence</Link></li>
                <li><Link href="/specials/ptosis-prevention-evidence/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Ptosis Prevention</Link></li>
                <li><Link href="/specials/buying-guide/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">D+ Cup Buying Guide</Link></li>
              </ul>
            </div>

            {/* Wellness */}
            <div>
              <button className="flex md:hidden items-center justify-between w-full text-left font-bold text-sm tracking-[0.1em] text-[#7a6455] min-h-[48px] px-0 py-2 bg-transparent border-0 cursor-pointer" onClick={(e) => toggleFooterCol(e.currentTarget)} aria-expanded="false">
                WELLNESS
                <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className="font-bold text-sm tracking-[0.1em] mb-3 text-[#7a6455] hidden md:block">WELLNESS</div>
              <ul className="space-y-2 hidden md:block m-0 p-0 list-none" data-footer-col>
                <li><Link href="/wellness/prosthetic-bras-guide/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Prosthetic Bras Guide</Link></li>
                <li><Link href="/wellness/sports-bras-after-surgery/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Sports Bras After Surgery</Link></li>
                <li><Link href="/wellness/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Overview</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <button className="flex md:hidden items-center justify-between w-full text-left font-bold text-sm tracking-[0.1em] text-[#7a6455] min-h-[48px] px-0 py-2 bg-transparent border-0 cursor-pointer" onClick={(e) => toggleFooterCol(e.currentTarget)} aria-expanded="false">
                RESOURCES
                <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className="font-bold text-sm tracking-[0.1em] mb-3 text-[#7a6455] hidden md:block">RESOURCES</div>
              <ul className="space-y-2 hidden md:block m-0 p-0 list-none" data-footer-col>
                <li><Link href="/articles/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">All Articles</Link></li>
                <li><Link href="/bra-size-guide/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Bra Size Guides</Link></li>
                <li><Link href="/compare/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Bra Size Comparisons</Link></li>
                <li><Link href="/how-to-measure-bra-size/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">How to Measure Bra Size</Link></li>
                <li><Link href="/bra-buying-guide/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Bra Buying Guide</Link></li>
                <li><Link href="/sports-bra-guide/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Sports Bra Guide</Link></li>
                <li><Link href="/best-comfort-bras/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Most Comfortable Bras</Link></li>
                <li><Link href="/best-wireless-bras/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Best Wireless Bras</Link></li>
                <li><Link href="/about/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">About</Link></li>
                <li><Link href="/privacy/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Privacy Policy</Link></li>
                <li><Link href="/terms/" className="block text-sm text-[#8b7355] hover:text-[#6b5344] transition-colors duration-200 hover:underline decoration-1 underline-offset-2 min-h-[28px] leading-[28px] no-underline">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e6d5c3]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#8b7355] m-0 text-center sm:text-left">&copy; 2026 Breast Calculator. This website is for informational purposes only and does not provide medical advice.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#e6d5c3] hover:border-[#6b5344] hover:text-[#6b5344] transition-colors duration-200 min-w-[48px] min-h-[48px] sm:min-w-0 sm:min-h-0 justify-center text-xs text-[#8b7355] flex-shrink-0" aria-label="Back to top">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
              <span className="hidden sm:inline">Back to Top</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Back-to-top floating button (mirrors index.html) */}
      <button id="footerBackToTop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#fdf8f5] border border-[#e6d5c3] text-[#8b7355] hover:text-[#6b5344] hover:border-[#6b5344] shadow-md flex items-center justify-center transition-all duration-300 opacity-0 pointer-events-none" aria-label="Back to top">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
      </button>

      {/* Cookie banner (mirrors index.html) */}
      <div className="cookie-banner" id="cookieBanner">
        <p>We do not collect private data without your explicit authorization. Basic cookies are used only for site functionality.</p>
        <div className="cookie-btns">
          <button className="btn-primary" onClick={() => acceptCookies()}>Accept &amp; Continue</button>
          <button className="btn-secondary" onClick={() => openPrivacyModal()}>Privacy Settings</button>
        </div>
      </div>

      {/* Privacy modal */}
      <div className="modal-overlay" id="privacyModal">
        <div className="modal">
          <h3>Privacy Settings</h3>
          <label><input type="checkbox" id="ckFunc" defaultChecked disabled /><span>Functional Cookies (always on)</span></label>
          <label><input type="checkbox" id="ckAnalytics" /><span>Analytics Cookies</span></label>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => closePrivacyModal()}>Cancel</button>
            <button className="btn-primary" onClick={() => savePrivacy()}>Save Settings</button>
          </div>
        </div>
      </div>
    </>
  );
}

// Helpers bound on global window for native (non-React) event handlers.
function toggleFooterCol(btn) {
  const ul = btn.nextElementSibling?.nextElementSibling;
  if (!ul || !ul.hasAttribute('data-footer-col')) return;
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  ul.classList.toggle('hidden');
}
function acceptCookies() {
  const b = document.getElementById('cookieBanner');
  if (b) b.style.display = 'none';
}
function openPrivacyModal() {
  const m = document.getElementById('privacyModal');
  if (m) m.classList.add('show');
}
function closePrivacyModal() {
  const m = document.getElementById('privacyModal');
  if (m) m.classList.remove('show');
}
function savePrivacy() {
  acceptCookies();
  closePrivacyModal();
}

// Expose to window so onclick handlers in JSX can call them.
if (typeof window !== 'undefined') {
  window.toggleFooterCol = toggleFooterCol;
  window.acceptCookies = acceptCookies;
  window.openPrivacyModal = openPrivacyModal;
  window.closePrivacyModal = closePrivacyModal;
  window.savePrivacy = savePrivacy;
}
