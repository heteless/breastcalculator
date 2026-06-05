import BraCalculator from '@/components/BraCalculator';
import Link from 'next/link';
import { ALL_BRA_SIZES } from '@/lib/braSizes';

const popularSizes = ['32B', '34B', '34C', '34D', '34DD', '36C', '36D', '38C'];

const tools = [
  { href: '/tools/breast-volume-calculator/', title: 'Breast Volume Calculator', desc: 'Estimate breast volume in cc and mL using clinical formulas.' },
  { href: '/tools/breast-weight-calculator/', title: 'Breast Weight Calculator', desc: 'Calculate breast weight in grams and ounces for health insights.' },
  { href: '/tools/breast-shape-calculator/', title: 'Breast Shape Calculator', desc: 'Identify your breast shape — round, teardrop, slender, or asymmetric.' },
  { href: '/tools/breast-ptosis-calculator/', title: 'Breast Ptosis Calculator', desc: 'Assess breast droop using clinical grading criteria.' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Find Your Perfect Bra Size — Free Breast Calculator</h1>
        <p>
          Accurate, private, and backed by science. Measure your band and bust at home to get your bra size in US, UK, EU, FR, and AU sizing. No registration needed.
        </p>
        <BraCalculator embedded />
        <div style={{ marginTop: 20 }}>
          <Link href="/bra-size-calculator/" className="btn-link-secondary" style={{ display: 'inline-block' }}>
            Open Full Calculator &rarr;
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Popular Bra Size Guides</h2>
        <p className="section-subtitle">In-depth guides for every size — measurements, sister sizes, and bra style recommendations.</p>
        <div className="card-grid">
          {popularSizes.map(size => (
            <Link key={size} href={`/bra-size-guide/${size.toLowerCase()}/`} className="card" style={{ display: 'block' }}>
              <h3>{size} Bra Size Guide</h3>
              <p>Complete {size} measurements, sister sizes, and the best bra styles for your size.</p>
            </Link>
          ))}
          <Link href="/bra-size-guide/" className="card" style={{ display: 'block', border: '2px dashed var(--color-primary)', background: 'transparent' }}>
            <h3>View All Size Guides &rarr;</h3>
            <p>Browse our complete library of 20+ bra size guides.</p>
          </Link>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius)', padding: '56px 24px' }}>
        <h2 className="section-title">More Free Tools</h2>
        <p className="section-subtitle">Beyond bra sizing — explore our full suite of science-based breast assessment tools.</p>
        <div className="card-grid">
          {tools.map(tool => (
            <Link key={tool.href} href={tool.href} className="card" style={{ display: 'block' }}>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Bra Size Comparisons</h2>
        <p className="section-subtitle">Not sure which size is right for you? Explore side-by-side cup size visuals and sister size comparisons to find your perfect fit.</p>
        <div className="card-grid">
          <Link href="/compare/" className="card" style={{ display: 'block', background: 'linear-gradient(135deg, var(--color-primary-light), #f9eaf3)', border: '2px solid var(--color-primary)' }}>
            <h3>View All Comparisons &rarr;</h3>
            <p>Browse our complete library of cup size, sister size, and bra style comparisons — all in one place.</p>
          </Link>
          {[
            ['B Cup vs C Cup', '/compare/b-cup-vs-c-cup/'],
            ['C Cup vs D Cup', '/compare/c-cup-vs-d-cup/'],
            ['D Cup vs DD Cup', '/compare/d-cup-vs-dd-cup/'],
            ['DD Cup vs DDD Cup', '/compare/dd-cup-vs-ddd-cup/'],
            ['Wireless vs Wired Bra', '/compare/wireless-vs-wired-bra/'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="card" style={{ display: 'block' }}>
              <h3>{label}</h3>
              <p>Compare volume, appearance, and the best bra styles for each.</p>
            </Link>
          ))}
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 36, marginBottom: 16 }}>Sister Size Comparisons</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20, fontSize: '0.95rem' }}>Same cup volume, different band — find the perfect fit when you are between sizes.</p>
        <div className="card-grid">
          {[
            ['32D vs 34C', '/compare/32d-vs-34c/'],
            ['34B vs 36C', '/compare/34b-vs-36c/'],
            ['36B vs 34C', '/compare/36b-vs-34c/'],
            ['34DD vs 36D', '/compare/34dd-vs-36d/'],
            ['38C vs 40B', '/compare/38c-vs-40b/'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="card" style={{ display: 'block' }}>
              <h3>{label}</h3>
              <p>Compare cup volume, band support, and find which size is right for your measurements.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius)', padding: '56px 24px' }}>
        <h2 className="section-title">Bra Shopping Guides</h2>
        <p className="section-subtitle">Expert-tested recommendations for the most comfortable and supportive bras.</p>
        <div className="card-grid">
          <Link href="/best-comfort-bras/" className="card" style={{ display: 'block' }}>
            <h3>Most Comfortable Bras</h3>
            <p>Editor-tested comfortable bras for every size — wireless, T-shirt, and full coverage options.</p>
          </Link>
          <Link href="/best-wireless-bras/" className="card" style={{ display: 'block' }}>
            <h3>Best Wireless Bras</h3>
            <p>The most comfortable wireless bras that actually provide support. No digging, no slipping.</p>
          </Link>
          <Link href="/bra-buying-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Buying Guide</h3>
            <p>How to choose the right bra for your breast shape, size, and lifestyle needs.</p>
          </Link>
          <Link href="/sports-bra-guide/" className="card" style={{ display: 'block' }}>
            <h3>Sports Bra Guide</h3>
            <p>Science-backed sports bra selection based on your activity level and breast size.</p>
          </Link>
        </div>
      </section>

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="cta-banner">
          <h2>Not Sure How to Measure?</h2>
          <p>Follow our step-by-step measurement guide to get accurate results every time.</p>
          <Link href="/how-to-measure-bra-size/" className="btn-primary" style={{ display: 'inline-block', color: 'var(--color-primary)' }}>
            How to Measure Bra Size &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}