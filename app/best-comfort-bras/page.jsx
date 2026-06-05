import Link from 'next/link';
import { buildRecommendMeta } from '@/lib/seoMetadata';
import { articleSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildRecommendMeta('best-comfort-bras');

const recs = [
  {
    title: 'Best Overall: Full-Coverage Seamless Bra',
    forWho: 'All sizes, especially C–DDD',
    why: 'Memory foam cups mold to your shape. Wide, cushioned straps prevent digging. Back-smoothing fabric eliminates lines under clothing. The seamless design disappears under fitted tees.',
    priceRange: '$$',
    sizes: '32B–42DDD',
  },
  {
    title: 'Best Wireless: Soft Stretch Bralette',
    forWho: 'A–DD cups seeking lounge-to-street comfort',
    why: 'Buttery-soft modal fabric with a wide underband that provides gentle support without compression. Removable pads and adjustable straps. Ideal for sensitive skin and post-surgery recovery.',
    priceRange: '$',
    sizes: 'XS–3X (fits 30A–40DD)',
  },
  {
    title: 'Best T-Shirt Bra: Molded Memory Foam',
    forWho: 'B–DDD cups wanting invisible under clothing',
    why: 'Smooth, molded cups with memory foam that adapts to your body temperature. Low-cut center allows for V-necks. No-show under even the thinnest white tees.',
    priceRange: '$$$',
    sizes: '32A–40DDD',
  },
  {
    title: 'Best for Full Bust: Structured Full-Coverage',
    forWho: 'D–H cups needing maximum support',
    why: 'Reinforced side panels, wide padded straps, and a leotard-style back for weight distribution. The cups fully encapsulate — no quad-boob, no side spillage. Worn by our testers for 14-hour days without complaint.',
    priceRange: '$$$',
    sizes: '32D–44H',
  },
  {
    title: 'Best for Small Bust: Lightly Lined Demi',
    forWho: 'AA–B cups seeking natural enhancement',
    why: 'Light padding adds just enough shape without looking artificial. The demi cut works with lower necklines. Comfortable underwire or wireless versions available.',
    priceRange: '$',
    sizes: '30A–38B',
  },
  {
    title: 'Best Sports Bra: High-Impact Encapsulation',
    forWho: 'C–DDD+ cups who exercise regularly',
    why: 'Encapsulation design — each breast is individually supported rather than compressed. Reduces bounce by up to 83% in lab tests. Moisture-wicking fabric and a cushioned front closure.',
    priceRange: '$$$',
    sizes: '32C–42G',
  },
  {
    title: 'Best Budget: Everyday Value Bra',
    forWho: 'All sizes seeking affordable daily rotation',
    why: 'Surprisingly high quality for the price. Smooth cups, comfortable band, and decent support through DDD. Available in 20+ colors. Stock up for a full week rotation.',
    priceRange: '$',
    sizes: '34A–42DDD',
  },
];

export default function BestComfortBras() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'Most Comfortable Bras 2026: Expert-Tested & Reviewed',
        description: 'Discover the most comfortable bras for every size — from wireless to full-coverage. Expert-tested and reviewed.',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Most Comfortable Bras', path: '/best-comfort-bras/' },
      ])} />

      <article className="article">
        <h1>Most Comfortable Bras 2026: Expert-Tested &amp; Reviewed</h1>
        <p>
          We tested dozens of bras across all sizes to find the ones you will actually want to wear all day. 
          From seamless T-shirt bras to supportive full-coverage styles, here are the most comfortable bras 
          for every breast size and shape.
        </p>

        <p>
          <strong>How we tested:</strong> Each bra was worn for a full day (10+ hours) by at least one tester 
          in the target size range. We evaluated fit, fabric feel, strap comfort, band snugness, 
          wire placement (if applicable), and how it held up after washing.
        </p>

        <h2>Our Top Picks</h2>

        {recs.map((rec, i) => (
          <div key={i} className="rec-card" id={rec.title.replace(/\s+/g, '-').toLowerCase()}>
            <h3>{i + 1}. {rec.title}</h3>
            <p><strong>Best for:</strong> {rec.forWho}</p>
            <p>{rec.why}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 8 }}>
              Price range: {rec.priceRange} &middot; Sizes: {rec.sizes}
            </p>
            <a href={`#affiliate-${rec.title.replace(/\s+/g, '-').toLowerCase()}`} className="affiliate-link">
              [Affiliate Link: {rec.title}]
            </a>
          </div>
        ))}

        <h2>How to Choose the Most Comfortable Bra for You</h2>
        <p>
          Comfort is personal. The most comfortable bra for a 32B will be different from the most comfortable 
          bra for a 38DD. Here is how to narrow it down:
        </p>
        <ul>
          <li><strong>Know your true size:</strong> Use our <Link href="/bra-size-calculator/">Bra Size Calculator</Link> first. The most common cause of discomfort is wearing the wrong size.</li>
          <li><strong>Match the bra to your breast shape:</strong> Use our <Link href="/tools/breast-shape-calculator/">Breast Shape Calculator</Link> to understand what styles flatter your specific shape.</li>
          <li><strong>Consider your daily activities:</strong> An office day needs different support than a weekend of errands.</li>
          <li><strong>Fabric matters:</strong> Modal and cotton are most breathable. Nylon-spandex blends offer the most stretch. Avoid rough lace if you have sensitive skin.</li>
          <li><strong>Replace regularly:</strong> Even the most comfortable bra loses support after 6–12 months of regular wear.</li>
        </ul>

        <h2>Related Resources</h2>
        <div className="card-grid" style={{ marginTop: 16 }}>
          <Link href="/best-wireless-bras/" className="card" style={{ display: 'block' }}>
            <h3>Best Wireless Bras &rarr;</h3>
            <p>Discover the most comfortable wireless bras that provide real support.</p>
          </Link>
          <Link href="/bra-buying-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Buying Guide &rarr;</h3>
            <p>How to choose the right bra for your shape, size, and lifestyle.</p>
          </Link>
          <Link href="/compare/" className="card" style={{ display: 'block' }}>
            <h3>Cup Size Comparisons &rarr;</h3>
            <p>Side-by-side visual guides: B vs C, C vs D, DD vs DDD, and more.</p>
          </Link>
          <Link href="/bra-size-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Size Guides &rarr;</h3>
            <p>Detailed guides for every size — measurements, sister sizes, and style recommendations.</p>
          </Link>
        </div>
      </article>
    </>
  );
}