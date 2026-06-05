import Link from 'next/link';
import { buildMetadata } from '@/lib/seoMetadata';
import { articleSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildMetadata({
  title: 'Sports Bra Guide: How to Choose the Right Support Level for Your Breast Size',
  description: 'Complete sports bra guide: choose the right support level (low, medium, high impact) for your breast size and activity. Science-backed recommendations.',
  path: '/sports-bra-guide/',
  type: 'article',
  keywords: ['sports bra guide', 'sports bra support', 'high impact sports bra', 'best sports bra', 'exercise bra', 'sports bra for large bust'],
});

const supportLevels = [
  {
    level: 'Low Impact',
    activities: 'Yoga, Pilates, walking, barre, stretching',
    bestFor: 'A–C cups for low-movement activities',
    design: 'Compression or light encapsulation. Often pullover style with a racerback. Minimal structure.',
    replace: 'Every 8–12 months',
  },
  {
    level: 'Medium Impact',
    activities: 'Cycling, hiking, dancing, elliptical, weight training',
    bestFor: 'B–DD cups for moderate-movement activities',
    design: 'Compression with some encapsulation. Wider straps and a firmer band. May have adjustable straps.',
    replace: 'Every 6–10 months',
  },
  {
    level: 'High Impact',
    activities: 'Running, HIIT, CrossFit, jumping, plyometrics, horseback riding',
    bestFor: 'C–H cups for high-movement activities — non-negotiable for D+',
    design: 'Encapsulation (each breast individually supported). Maximum strap width, firm band, and often a front or back closure for security.',
    replace: 'Every 6–8 months',
  },
];

const sizeRecs = [
  { size: 'AA–B Cup', recommendation: 'Low-impact compression styles work well. You can wear pullover styles without closures. Look for removable pads for shaping.' },
  { size: 'C–DD Cup', recommendation: 'Medium-impact encapsulation or hybrid styles. Adjustable straps and a firm band are essential. Consider high-impact for running.' },
  { size: 'DDD+ Cup', recommendation: 'High-impact encapsulation ONLY. Look for underwire, wide padded straps, and a leotard-style back. Do not compromise on support — breast pain during exercise is a sign of inadequate support.' },
];

export default function SportsBraGuide() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'Sports Bra Guide: Choose the Right Support Level for Your Breast Size',
        description: 'Complete sports bra guide — how to choose the right support level based on breast size and activity. Science-backed.',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Sports Bra Guide', path: '/sports-bra-guide/' },
      ])} />

      <article className="article">
        <h1>Sports Bra Guide: How to Choose the Right Support Level for Your Breast Size</h1>
        <p>
          A sports bra is the most important piece of exercise equipment you own — and the most overlooked. 
          Breast movement during exercise can cause pain, tissue stretching, and long-term sagging. 
          This guide helps you choose the right support level based on your breast size and activity.
        </p>

        <div className="placeholder-img">
          [Image Placeholder: Side-by-side comparison of low, medium, and high-impact sports bras with labels showing design differences.]
        </div>

        <h2>Why Sports Bra Support Matters</h2>
        <p>
          Breasts move in a figure-8 pattern during exercise — up-and-down, side-to-side, and in-and-out. 
          Without adequate support, the Cooper ligaments (the connective tissue that supports the breasts) 
          can stretch irreversibly. Once stretched, they do not bounce back. A good sports bra reduces 
          breast movement by 60–83%, depending on the design.
        </p>

        <h2>Support Levels Explained</h2>
        <table className="data-table">
          <thead>
            <tr><th>Support Level</th><th>Activities</th><th>Best For</th><th>Design</th><th>Replace</th></tr>
          </thead>
          <tbody>
            {supportLevels.map((s, i) => (
              <tr key={i}>
                <td><strong>{s.level}</strong></td>
                <td>{s.activities}</td>
                <td>{s.bestFor}</td>
                <td>{s.design}</td>
                <td>{s.replace}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Sports Bra by Breast Size</h2>
        {sizeRecs.map((s, i) => (
          <div key={i} className="rec-card">
            <h3>{s.size}</h3>
            <p>{s.recommendation}</p>
          </div>
        ))}

        <h2>Encapsulation vs Compression: What Is the Difference?</h2>
        <p>
          <strong>Compression bras</strong> press the breasts against the chest wall to reduce movement. 
          They work well for A–B cups but can create a uniboob effect and are less effective for larger sizes.
        </p>
        <p>
          <strong>Encapsulation bras</strong> have individual cups that surround and support each breast separately, 
          similar to a regular bra but with more structure. These are the gold standard for C+ cups and high-impact activities. 
          Many modern sports bras combine both approaches.
        </p>

        <h2>How to Check If Your Sports Bra Fits</h2>
        <ul>
          <li><strong>Band:</strong> Should be snug on the loosest hook. Two fingers should fit under the band with effort.</li>
          <li><strong>Straps:</strong> Should not dig in or slip off. If they leave marks, they are too tight.</li>
          <li><strong>Cups:</strong> No spillage at the top or sides. Tissue should be fully contained.</li>
          <li><strong>Jump test:</strong> Jump in place. If you feel significant movement, you need more support.</li>
          <li><strong>Underwire (if applicable):</strong> Should encircle breast tissue completely, not sit on it.</li>
        </ul>

        <h2>Sports Bra Care</h2>
        <ul>
          <li>Wash after every workout — sweat breaks down elastic.</li>
          <li>Hand wash or use a mesh bag on a delicate cycle with cold water.</li>
          <li>Air dry only — heat from the dryer destroys spandex.</li>
          <li>Have at least 2 sports bras in rotation so elastic can recover between wears.</li>
        </ul>

        <h2>Related Resources</h2>
        <div className="card-grid" style={{ marginTop: 16 }}>
          <Link href="/tools/breast-weight-calculator/" className="card" style={{ display: 'block' }}>
            <h3>Breast Weight Calculator</h3>
            <p>Estimate your breast weight to understand your support needs during exercise.</p>
          </Link>
          <Link href="/best-comfort-bras/" className="card" style={{ display: 'block' }}>
            <h3>Most Comfortable Bras</h3>
            <p>Our top picks for everyday comfort, including sports bras.</p>
          </Link>
          <Link href="/compare/" className="card" style={{ display: 'block' }}>
            <h3>Cup Size Comparisons</h3>
            <p>Compare cup sizes side by side to find the right fit for your sports bra.</p>
          </Link>
          <Link href="/bra-size-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Size Guides</h3>
            <p>Detailed size guides — know your true size before buying a sports bra.</p>
          </Link>
          <Link href="/bra-size-calculator/" className="card" style={{ display: 'block' }}>
            <h3>Bra Size Calculator</h3>
            <p>Find your accurate size before shopping for sports bras.</p>
          </Link>
        </div>
      </article>
    </>
  );
}