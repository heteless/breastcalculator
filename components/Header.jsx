'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/**
 * Unified navigation header — matches d:\DevProject\breastcalculator\index.html
 * byte-for-byte structure. Renders:
 *   - <nav class="navbar">  (sticky, blurred, with .nav-links dropdowns)
 *   - <button class="nav-toggle">  (mobile hamburger)
 *   - <div class="drawer-overlay"> + <div class="drawer">  (mobile slide-in)
 *
 * Drawer state is managed by `data-open` attribute + useEffect, and the
 * native click / overlay / Escape close handlers are bound in layout.jsx.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstRender = useRef(true);

  // Auto-close on every route change.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open (iOS Safari).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isHome = pathname === '/' || pathname === '';
  const isBraSizeGuide = pathname.startsWith('/bra-size-guide');
  const isBraSizeCalculator = pathname.startsWith('/bra-size-calculator');
  const isSpecials = pathname.startsWith('/specials');
  const isWellness = pathname.startsWith('/wellness');
  const isAbout = pathname.startsWith('/about');
  const isArticles = pathname.startsWith('/articles');
  const isArticle = pathname.startsWith('/article/');
  const isCompare = pathname.startsWith('/compare');
  const isTools = pathname.startsWith('/tools/');
  const isHowTo = pathname.startsWith('/how-to-measure-bra-size');
  const isBraBuying = pathname.startsWith('/bra-buying-guide');
  const isSportsBra = pathname.startsWith('/sports-bra-guide');
  const isBestComfort = pathname.startsWith('/best-comfort-bras');
  const isBestWireless = pathname.startsWith('/best-wireless-bras');

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Breast Calculator</Link>
          <ul className="nav-links">
            <li>
              <Link href="/" className={isHome ? 'active' : ''}>Home</Link>
            </li>
            <li>
              <span className="nav-label">Tools <span className="arrow">&#9662;</span></span>
              <div className="dropdown-menu">
                <Link href="/bra-size-calculator/">Bra Size Calculator <span className="dd-desc">Compute US/UK/EU/FR/AU sizes</span></Link>
                <Link href="/tools/breast-expansion-calculator/">Breast Expansion Calculator <span className="dd-desc">Assess splaying with nipple-spacing ratio</span></Link>
                <Link href="/tools/breast-ptosis-calculator/">Breast Ptosis Calculator <span className="dd-desc">Grade sagging with nipple-inframammary distance</span></Link>
                <Link href="/tools/breast-volume-calculator/">Breast Volume Calculator <span className="dd-desc">Estimate volume in cc/mL</span></Link>
                <Link href="/tools/breast-weight-calculator/">Breast Weight Calculator <span className="dd-desc">Estimate weight in g/kg</span></Link>
                <Link href="/tools/breast-shape-calculator/">Breast Shape Calculator <span className="dd-desc">Identify your breast shape type</span></Link>
                <Link href="/tools/length-converter/">Length Converter <span className="dd-desc">Convert inches &amp; cm instantly</span></Link>
              </div>
            </li>
            <li>
              <span className="nav-label">Articles <span className="arrow">&#9662;</span></span>
              <div className="dropdown-menu">
                <Link href="/articles/">All Articles <span className="dd-desc">Complete article listing</span></Link>
                <Link href="/article/how-to-measure-bra-size-at-home/">How to Measure Bra Size <span className="dd-desc">Step-by-step guide</span></Link>
                <Link href="/article/how-to-tell-if-bra-fits/">Bra Fit Checklist <span className="dd-desc">5 signs of a good fit</span></Link>
                <Link href="/article/bra-sister-sizes-explained/">Sister Sizes Explained <span className="dd-desc">Find alternative fits</span></Link>
                <Link href="/article/breast-volume-guide/">Breast Volume Guide <span className="dd-desc">Volume estimation &amp; bra fitting</span></Link>
                <Link href="/article/breast-ptosis-causes-and-solutions/">Breast Ptosis Guide <span className="dd-desc">Causes &amp; prevention</span></Link>
              </div>
            </li>
            <li><Link href="/specials/" className={isSpecials ? 'active' : ''}>Specials</Link></li>
            <li><Link href="/wellness/" className={isWellness ? 'active' : ''}>Wellness</Link></li>
            <li><Link href="/about/" className={isAbout ? 'active' : ''}>About</Link></li>
          </ul>
          <button
            type="button"
            className={`nav-toggle${open ? ' open' : ''}`}
            id="menuToggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div
        className={`drawer-overlay${open ? ' open' : ''}`}
        id="drawerOverlay"
        onClick={() => setOpen(false)}
      />
      <div
        className={`drawer${open ? ' open' : ''}`}
        id="drawer"
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="drawer-header">
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--heading)' }}>Menu</span>
          <button
            type="button"
            className="drawer-close"
            id="drawerClose"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >&times;</button>
        </div>
        <ul className="drawer-nav">
          <li><Link href="/">Home</Link></li>
          <li className="drawer-section"><span className="drawer-section-label">Tools</span></li>
          <li className="drawer-sub"><Link href="/bra-size-calculator/">Bra Size Calculator</Link></li>
          <li className="drawer-sub"><Link href="/tools/breast-expansion-calculator/">Breast Expansion Calculator</Link></li>
          <li className="drawer-sub"><Link href="/tools/breast-ptosis-calculator/">Breast Ptosis Calculator</Link></li>
          <li className="drawer-sub"><Link href="/tools/breast-volume-calculator/">Breast Volume Calculator</Link></li>
          <li className="drawer-sub"><Link href="/tools/breast-weight-calculator/">Breast Weight Calculator</Link></li>
          <li className="drawer-sub"><Link href="/tools/breast-shape-calculator/">Breast Shape Calculator</Link></li>
          <li className="drawer-sub"><Link href="/tools/length-converter/">Length Converter</Link></li>
          <li className="drawer-section"><span className="drawer-section-label">Articles</span></li>
          <li className="drawer-sub"><Link href="/articles/">All Articles</Link></li>
          <li className="drawer-sub"><Link href="/article/how-to-measure-bra-size-at-home/">How to Measure Bra Size</Link></li>
          <li className="drawer-sub"><Link href="/article/how-to-tell-if-bra-fits/">Bra Fit Checklist</Link></li>
          <li className="drawer-sub"><Link href="/article/bra-sister-sizes-explained/">Sister Sizes</Link></li>
          <li className="drawer-sub"><Link href="/article/breast-volume-guide/">Breast Volume Guide</Link></li>
          <li className="drawer-sub"><Link href="/article/breast-ptosis-causes-and-solutions/">Breast Ptosis Guide</Link></li>
          <li className="drawer-section"><span className="drawer-section-label">Wellness &amp; Recovery</span></li>
          <li className="drawer-sub"><Link href="/wellness/">Overview</Link></li>
          <li className="drawer-sub"><Link href="/wellness/prosthetic-bras-guide/">Prosthetic Bras Guide</Link></li>
          <li className="drawer-sub"><Link href="/wellness/sports-bras-after-surgery/">Sports Bras After Surgery</Link></li>
          <li className="drawer-section"><span className="drawer-section-label">Guides &amp; Resources</span></li>
          <li className="drawer-sub"><Link href="/bra-size-guide/">Bra Size Guides</Link></li>
          <li className="drawer-sub"><Link href="/compare/">Bra Size Comparisons</Link></li>
          <li className="drawer-sub"><Link href="/how-to-measure-bra-size/">How to Measure Bra Size</Link></li>
          <li className="drawer-sub"><Link href="/bra-buying-guide/">Bra Buying Guide</Link></li>
          <li className="drawer-sub"><Link href="/sports-bra-guide/">Sports Bra Guide</Link></li>
          <li className="drawer-sub"><Link href="/best-comfort-bras/">Most Comfortable Bras</Link></li>
          <li className="drawer-sub"><Link href="/best-wireless-bras/">Best Wireless Bras</Link></li>
          <li><Link href="/specials/">Specials &amp; Research</Link></li>
          <li><Link href="/about/">About</Link></li>
          <li><a href="#" id="privacyFromDrawer">Privacy Settings</a></li>
        </ul>
        <div className="drawer-footer">&copy; 2026 Breast Calculator</div>
      </div>
    </>
  );
}
