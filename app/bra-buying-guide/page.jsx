import Link from 'next/link';
import { buildMetadata } from '@/lib/seoMetadata';
import { articleSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildMetadata({
  title: 'Bra Buying Guide 2026: How to Choose the Right Bra for Your Shape & Lifestyle',
  description: 'Complete bra buying guide — how to choose the right bra for your breast shape, size, and lifestyle. Tips for T-shirt, sports, wireless, and full-coverage bras.',
  path: '/bra-buying-guide/',
  type: 'article',
  keywords: ['bra buying guide', 'how to choose a bra', 'bra fitting guide', 'bra styles', 'bra for breast shape'],
});

const styleRecs = [
  { style: 'T-Shirt Bra', bestFor: 'Everyday wear under fitted tees', shape: 'All shapes — the universal bra', tip: 'Look for seamless, molded cups to avoid any lines or texture showing through.' },
  { style: 'Balconette Bra', bestFor: 'Square or wide necklines', shape: 'Round and full breasts benefit most', tip: 'The horizontal cup cut lifts from the bottom, creating a rounded silhouette without push-up padding.' },
  { style: 'Plunge Bra', bestFor: 'Deep V-necks and low-cut tops', shape: 'Wide-set breasts get the most centering benefit', tip: 'The deep center front allows for the lowest necklines. Not ideal for very soft tissue.' },
  { style: 'Full-Coverage Bra', bestFor: 'Maximum support and coverage', shape: 'Full, heavy breasts; D+ cups', tip: 'Look for side panels and wide straps. This style prevents spillage from all angles.' },
  { style: 'Wireless Bra', bestFor: 'All-day comfort and lounging', shape: 'A–DD cups get the best support from wireless', tip: 'Modern wireless bras with molded cups and wide underbands rival wired support.' },
  { style: 'Sports Bra', bestFor: 'Exercise and high-movement activities', shape: 'All shapes — but support level must match impact level', tip: 'Choose encapsulation over compression for D+ cups. Replace every 6–12 months.' },
  { style: 'Strapless Bra', bestFor: 'Off-shoulder and strapless outfits', shape: 'B–DD cups work best; larger cups need structured designs', tip: 'Look for silicone grip strips along the band. The band must be snug to stay up without straps.' },
  { style: 'Minimizer Bra', bestFor: 'Reducing projection under button-downs and layers', shape: 'Full, projected breasts (D+)', tip: 'Redistributes tissue rather than compressing. Can reduce projection by up to 1 inch.' },
];

const lifeStageRecs = [
  { stage: 'Everyday Workwear', recommendation: 'Rotate between 2–3 T-shirt bras and one full-coverage bra for variety. Replace every 6–8 months.' },
  { stage: 'Pregnancy & Nursing', recommendation: 'Wireless maternity and nursing bras are safest. Look for drop-down cups and wide, comfortable bands.' },
  { stage: 'Post-Surgery Recovery', recommendation: 'Front-close wireless bras with soft, seamless fabric. Avoid underwire for at least 6–8 weeks.' },
  { stage: 'Active Lifestyle', recommendation: 'Invest in at least 2 high-quality sports bras — one for high-impact, one for yoga/walking. Wash after every workout.' },
  { stage: 'Special Occasion', recommendation: 'Strapless or convertible bras with silicone grips. Do a trial run before the event — a slipping strapless bra ruins confidence.' },
];

export default function BraBuyingGuide() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'Bra Buying Guide 2026: How to Choose the Right Bra',
        description: 'Complete bra buying guide covering styles, breast shapes, and life stages. Learn which bra works best for you.',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Buying Guide', path: '/bra-buying-guide/' },
      ])} />

      <article className="article">
        <h1>Bra Buying Guide: How to Choose the Right Bra for Your Shape &amp; Lifestyle</h1>
        <p>
          The right bra transforms how your clothes fit, how you carry yourself, and how comfortable you feel 
          throughout the day. This guide helps you choose based on your breast shape, daily activities, 
          and life stage — so every bra in your drawer earns its place.
        </p>

        <h2>Step 1: Know Your Size and Shape</h2>
        <p>
          Before buying any bra, know your true size. Use our <Link href="/bra-size-calculator/">Bra Size Calculator</Link> for an accurate measurement. 
          Then, identify your breast shape with our <Link href="/tools/breast-shape-calculator/">Breast Shape Calculator</Link>. 
          The same bra size can look and fit very differently depending on whether your breasts are round, teardrop, slender, or asymmetric.
        </p>

        <h2>Step 2: Match Bra Style to Breast Shape</h2>
        <table className="data-table">
          <thead>
            <tr><th>Bra Style</th><th>Best For</th><th>Ideal Breast Shape</th><th>Key Buying Tip</th></tr>
          </thead>
          <tbody>
            {styleRecs.map((s, i) => (
              <tr key={i}>
                <td><strong>{s.style}</strong></td>
                <td>{s.bestFor}</td>
                <td>{s.shape}</td>
                <td>{s.tip}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Step 3: Bra Guide by Life Stage</h2>
        {lifeStageRecs.map((ls, i) => (
          <div key={i} className="rec-card">
            <h3>{ls.stage}</h3>
            <p>{ls.recommendation}</p>
          </div>
        ))}

        <h2>Step 4: Build Your Bra Wardrobe</h2>
        <p>A well-rounded bra collection does not need dozens of bras. Here is the essential lineup:</p>
        <ul>
          <li><strong>2–3 Everyday bras:</strong> Seamless T-shirt bras or lightly lined styles for daily rotation.</li>
          <li><strong>1–2 Sports bras:</strong> At least one high-impact for your most active days.</li>
          <li><strong>1 Strapless or convertible:</strong> For special outfits and occasions.</li>
          <li><strong>1–2 Comfort/lounge bras:</strong> Wireless styles for weekends and relaxing at home.</li>
          <li><strong>Optional: 1 special-occasion bra:</strong> Plunge or push-up for date nights and events.</li>
        </ul>

        <h2>Bra Care Tips</h2>
        <ul>
          <li>Hand wash or use a mesh bag on a delicate cycle with cold water.</li>
          <li>Never put bras in the dryer — heat destroys elastic. Air dry only.</li>
          <li>Rotate bras daily — elastic needs 24 hours to recover between wears.</li>
          <li>Replace bras when the band is stretched (you are using the tightest hook) or cups lose shape.</li>
        </ul>

        <h2>Related Resources</h2>
        <div className="card-grid" style={{ marginTop: 16 }}>
          <Link href="/best-comfort-bras/" className="card" style={{ display: 'block' }}>
            <h3>Most Comfortable Bras &rarr;</h3>
            <p>Expert-tested comfortable bras for every size and shape.</p>
          </Link>
          <Link href="/best-wireless-bras/" className="card" style={{ display: 'block' }}>
            <h3>Best Wireless Bras &rarr;</h3>
            <p>The most comfortable wireless bras that actually support.</p>
          </Link>
          <Link href="/compare/" className="card" style={{ display: 'block' }}>
            <h3>Cup Size Comparisons &rarr;</h3>
            <p>Side-by-side visual comparisons of B, C, D, DD, and DDD cups.</p>
          </Link>
          <Link href="/bra-size-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Size Guides &rarr;</h3>
            <p>Complete guides for 20+ bra sizes with measurements and style recommendations.</p>
          </Link>
        </div>

        <p style={{ marginTop: 24 }}>
          Ready to shop? Check our <Link href="/best-comfort-bras/">Most Comfortable Bras</Link> and 
          <Link href="/best-wireless-bras/"> Best Wireless Bras</Link> guides for specific product recommendations.
        </p>
      </article>
    </>
  );
}