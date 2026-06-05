import Link from 'next/link';
import { ALL_BRA_SIZES } from '@/lib/braSizes';
import { buildMetadata } from '@/lib/seoMetadata';
import { breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildMetadata({
  title: 'Bra Size Guide: Complete Size Chart & Fitting Tips for Every Size',
  description: 'Complete bra size guide covering 20+ sizes from 32A to 40D. Find measurements, sister sizes, best bra styles, and fitting tips for your specific size.',
  path: '/bra-size-guide/',
  keywords: ['bra size guide', 'bra size chart', 'bra sizes', 'bra fitting guide', 'bra measurement chart'],
});

const sizeGroups = {
  '32 Band': ALL_BRA_SIZES.filter(s => s.startsWith('32')),
  '34 Band': ALL_BRA_SIZES.filter(s => s.startsWith('34')),
  '36 Band': ALL_BRA_SIZES.filter(s => s.startsWith('36')),
  '38 Band': ALL_BRA_SIZES.filter(s => s.startsWith('38')),
  '40 Band': ALL_BRA_SIZES.filter(s => s.startsWith('40')),
};

export default function BraSizeGuideHome() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Guide', path: '/bra-size-guide/' },
      ])} />

      <section className="hero">
        <h1>Bra Size Guide</h1>
        <p>Complete bra size guides for 20+ sizes. Find your measurements, sister sizes, and the best bra styles for your specific size.</p>
      </section>

      <section className="section">
        <div className="article">
          <h2>How Bra Sizes Work</h2>
          <p>
            A bra size has two parts: a <strong>band size</strong> (the number) and a <strong>cup size</strong> (the letter). 
            The band size corresponds to your underbust measurement in inches. The cup size represents the 
            difference between your bust and underbust measurements.
          </p>
          <p>
            For example, a 34C bra means a 34-inch underbust and a bust that is approximately 3 inches larger than the underbust (C = 3-inch difference).
            Below you will find detailed guides for every size we cover.
          </p>
        </div>

        {Object.entries(sizeGroups).map(([groupName, sizes]) => (
          <div key={groupName} style={{ marginTop: 40 }}>
            <h2 className="section-title">{groupName}</h2>
            <div className="card-grid" style={{ marginTop: 16 }}>
              {sizes.map(size => (
                <Link key={size} href={`/bra-size-guide/${size.toLowerCase()}/`} className="card" style={{ display: 'block' }}>
                  <h3>{size} Bra Size Guide</h3>
                  <p>Complete {size} measurements, sister sizes, bra styles, and fitting tips.</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="cta-banner" style={{ marginTop: 48 }}>
          <h2>Not Sure What Your Size Is?</h2>
          <p>Measure and find your bra size with our free, accurate calculator.</p>
          <Link href="/bra-size-calculator/" className="btn-primary" style={{ display: 'inline-block', color: 'var(--color-primary)' }}>
            Calculate My Bra Size &rarr;
          </Link>
        </div>

        <h2 className="section-title" style={{ marginTop: 48 }}>More Resources</h2>
        <div className="card-grid" style={{ marginTop: 24 }}>
          <Link href="/compare/" className="card" style={{ display: 'block' }}>
            <h3>Cup Size Comparisons</h3>
            <p>Side-by-side visual comparisons of B, C, D, DD, and DDD cups. See the real difference.</p>
          </Link>
          <Link href="/best-comfort-bras/" className="card" style={{ display: 'block' }}>
            <h3>Most Comfortable Bras</h3>
            <p>Expert-tested comfortable bras for every size — from AA to DDD+.</p>
          </Link>
          <Link href="/best-wireless-bras/" className="card" style={{ display: 'block' }}>
            <h3>Best Wireless Bras</h3>
            <p>The most comfortable wireless bras that actually provide real support.</p>
          </Link>
          <Link href="/how-to-measure-bra-size/" className="card" style={{ display: 'block' }}>
            <h3>How to Measure Bra Size</h3>
            <p>Step-by-step measurement guide with pictures — get accurate results at home.</p>
          </Link>
        </div>
      </section>
    </>
  );
}