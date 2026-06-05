import Link from 'next/link';
import { buildMetadata } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildMetadata({
  title: 'Wireless vs Wired Bra: Which Is Best for Your Shape & Size?',
  description: 'Wireless bra vs wired bra — compare comfort, support, and breast shape compatibility. Find out which one works best for your size and lifestyle.',
  path: '/compare/wireless-vs-wired-bra/',
  type: 'article',
  keywords: ['wireless vs wired bra', 'wireless bra', 'wired bra', 'underwire bra', 'bra comparison', 'comfortable bra', 'bra shape guide'],
});

const faqs = [
  { question: 'Is wireless bra better than wired for everyday?', answer: 'For most people, wireless bras offer comparable support and noticeably better comfort for daily wear — no underwire digging, more flexibility, and easier to put on. Wired bras still provide superior lift and a more defined silhouette, making them better for formal wear, work outfits, and DDD+ sizes that need structured support.' },
  { question: 'Do wireless bras work for large busts?', answer: 'Modern wireless bras can work for large busts (D+ cups) if they have wide underbands, strong side support panels, and reinforced straps. Brands like Soma, ThirdLove, and Knix make wireless bras specifically engineered for fuller busts. However, for very large busts (G+ cups) or high-impact activities, a well-fitted wired bra still provides more reliable support.' },
  { question: 'What is the difference between wireless and wired bras?', answer: 'The key difference is the underwire — a thin, semi-circular wire sewn into the base of each cup in wired bras to provide structure and lift. Wireless bras use fabric, seaming, elastic, and molded cups to shape the bust without any metal hardware. Wired bras generally offer more lift and separation, while wireless bras prioritize comfort and a softer feel.' },
];

export default function WirelessVsWired() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'Wireless vs Wired Bra: Which Is Best for Your Breast Shape & Size?',
        description: 'Compare wireless bras and wired bras — comfort, support, and breast shape compatibility explained.',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: 'Wireless vs Wired Bra', path: '/compare/wireless-vs-wired-bra/' },
      ])} />

      <section className="hero">
        <h1>Wireless vs Wired Bra: Which Is Best for Your Breast Shape &amp; Size?</h1>
        <p>Compare comfort, support, and breast shape compatibility — find out which one works best for your size and lifestyle.</p>
      </section>

      <article className="article" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <p className="article-intro">
          The wireless vs wired bra debate is one of the most common in bra shopping. 
          Both have strong advantages — the right choice depends on your breast size, shape, 
          daily activities, and personal comfort preference.
        </p>

        <div className="comparison-visual">
          <div className="comparison-row">
            <div className="comparison-item">
              <svg viewBox="0 0 100 80" className="cup-svg" role="img" aria-label="Wireless bra illustration" style={{ width: 140 }}>
                <path d="M30,70 Q30,50 50,45 Q70,50 70,70" fill="none" stroke="#c49585" strokeWidth="3" />
                <text x="50" y="30" textAnchor="middle" fill="#5a3d38" fontSize="10" fontWeight="600">Wireless</text>
              </svg>
              <span className="cup-label">Wireless Bra</span>
            </div>
            <div className="comparison-vs">vs</div>
            <div className="comparison-item">
              <svg viewBox="0 0 100 80" className="cup-svg" role="img" aria-label="Wired bra illustration" style={{ width: 140 }}>
                <path d="M25,70 Q25,40 50,35 Q75,40 75,70" fill="none" stroke="#7a4a3a" strokeWidth="3" />
                <path d="M26,60 Q26,45 50,38 Q74,45 74,60" fill="none" stroke="#c49585" strokeWidth="1.5" strokeDasharray="4,2" />
                <text x="50" y="25" textAnchor="middle" fill="#5a3d38" fontSize="10" fontWeight="600">Wired</text>
              </svg>
              <span className="cup-label">Wired Bra</span>
            </div>
          </div>
        </div>

        <h2>Wireless Bras: Pros and Cons</h2>
        <p>Wireless bras use fabric construction, seams, and elastic to provide shape and support without metal underwire.</p>
        <table className="data-table">
          <thead><tr><th>Pros</th><th>Cons</th></tr></thead>
          <tbody>
            <tr><td>Maximum all-day comfort — no wire digging</td><td>May provide less lift and separation than wired bras</td></tr>
            <tr><td>Ideal for lounging, travel, and casual wear</td><td>For DDD+ sizes, wireless support can be limited</td></tr>
            <tr><td>No risk of underwire poking through fabric</td><td>May create a less defined silhouette under tight clothing</td></tr>
            <tr><td>Great for sensitive skin or post-surgery recovery</td><td>Not all wireless bras provide adequate sports support</td></tr>
            <tr><td>Modern designs rival wired support for B–DD cups</td><td>Washing and wear can stretch fabric more quickly</td></tr>
          </tbody>
        </table>

        <h2>Wired Bras: Pros and Cons</h2>
        <p>Wired bras use a metal or plastic underwire sewn into the cup channel to provide structured support and lift.</p>
        <table className="data-table">
          <thead><tr><th>Pros</th><th>Cons</th></tr></thead>
          <tbody>
            <tr><td>Superior lift and separation — defined silhouette</td><td>Can dig into ribs if the band is too tight or cup too small</td></tr>
            <tr><td>Essential for D+ cups needing structured support</td><td>Underwire may poke through fabric after extended wear</td></tr>
            <tr><td>Better support for full-bust profiles during activity</td><td>Less comfortable for lounging or sleep</td></tr>
            <tr><td>Maintains shape longer than wireless alternatives</td><td>Not recommended immediately after breast surgery</td></tr>
            <tr><td>Wide selection across all sizes and styles</td><td>Finding the perfect fit is more critical — wrong size hurts</td></tr>
          </tbody>
        </table>

        <h2>Which Is Best for Your Breast Size?</h2>
        <ul>
          <li><strong>A–B Cup:</strong> Wireless bras work excellently. You have the most flexibility — choose based on outfit and comfort.</li>
          <li><strong>C–DD Cup:</strong> Both work well. Choose wired for defined shape under fitted clothing; wireless for daily comfort.</li>
          <li><strong>DDD+ Cup:</strong> Wired bras generally provide better support and separation. High-quality wireless bras from specialized brands can work for casual days.</li>
        </ul>

        <h2>Which Is Best for Your Breast Shape?</h2>
        <p>Use our <Link href="/tools/breast-shape-calculator/">Breast Shape Calculator</Link> to identify your shape, then match it to bra type:</p>
        <ul>
          <li><strong>Round / Full:</strong> Both wired and wireless work. Wired bras provide better separation.</li>
          <li><strong>Teardrop:</strong> Wired bras with side support panels help center the tissue.</li>
          <li><strong>Slender / Tubular:</strong> Wireless bras with light padding add natural-looking volume.</li>
          <li><strong>Asymmetric:</strong> Wired bras with removable pads allow you to balance the difference.</li>
          <li><strong>Wide-set:</strong> Wired plunge bras bring tissue toward center. Wireless may not provide enough centering.</li>
        </ul>

        <h2>Our Top Picks</h2>
        <div className="rec-card">
          <h3>Best Wireless Bra Overall</h3>
          <p>For everyday comfort without wires, we recommend styles with wide underbands and molded cups that mimic wired support.</p>
        </div>
        <div className="rec-card">
          <h3>Best Wired Bra for Daily Wear</h3>
          <p>Look for bras with cushioned underwire channels and flexible wires that move with your body.</p>
        </div>

        <p style={{ marginTop: 24 }}>
          For more specific recommendations, check our <Link href="/best-comfort-bras/">Most Comfortable Bras</Link> and 
          <Link href="/best-wireless-bras/"> Best Wireless Bras</Link> guides.
        </p>
      </article>

      <section className="section">
        <div className="cta-banner">
          <h2>Not Sure Your Exact Size?</h2>
          <p>Use our free calculator to find your precise bra size, then come back to compare with confidence.</p>
          <Link href="/bra-size-calculator/" className="btn-primary" style={{ display: 'inline-block', color: 'var(--color-primary)' }}>
            Calculate My Bra Size &rarr;
          </Link>
        </div>
      </section>

      <section className="related-links">
        <div className="related-links-inner">
          <h2>Explore More</h2>
          <div className="related-grid">
            <Link href="/compare/b-cup-vs-c-cup/">B Cup vs C Cup</Link>
            <Link href="/compare/c-cup-vs-d-cup/">C Cup vs D Cup</Link>
            <Link href="/compare/d-cup-vs-dd-cup/">D Cup vs DD Cup</Link>
            <Link href="/compare/dd-cup-vs-ddd-cup/">DD Cup vs DDD Cup</Link>
            <Link href="/compare/32d-vs-34c/">32D vs 34C</Link>
            <Link href="/compare/34b-vs-36c/">34B vs 36C</Link>
            <Link href="/compare/36b-vs-34c/">36B vs 34C</Link>
            <Link href="/best-comfort-bras/">Most Comfortable Bras</Link>
            <Link href="/best-wireless-bras/">Best Wireless Bras</Link>
          </div>
        </div>
      </section>
    </>
  );
}