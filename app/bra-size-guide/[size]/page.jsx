import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ALL_BRA_SIZES,
  parseSize,
  getSisterSizes,
  getAdjacentSizes,
  getMeasurementRange,
  SIZE_DESCRIPTIONS,
  getBraRecommendations,
} from '@/lib/braSizes';
import { buildBraSizeGuideMeta } from '@/lib/seoMetadata';
import { faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';
import FAQ from '@/components/FAQ';

export function generateStaticParams() {
  return ALL_BRA_SIZES.map(size => ({
    size: size.toLowerCase(),
  }));
}

export function generateMetadata({ params }) {
  const size = params.size.toUpperCase();
  if (!ALL_BRA_SIZES.includes(size)) return {};
  return buildBraSizeGuideMeta(size);
}

const SITE_URL = 'https://breastcalculator.com';

const REC_BRAS_BY_CATEGORY = {
  petite: [
    { name: 'Aerie Real Sunnie Wireless', type: 'Wireless', forWho: 'Small frames seeking everyday comfort without wires.' },
    { name: "Natori Feathers Contour Plunge", type: 'Plunge', forWho: 'Petite frames wanting natural shape for deep necklines.' },
    { name: "Calvin Klein Invisibles Bralette", type: 'Bralette', forWho: 'Relaxed days where light support is all you need.' },
  ],
  average: [
    { name: 'Wacoal Basic Beauty Full-Figure', type: 'Full-Coverage', forWho: 'Average frames seeking all-day support with smooth shaping.' },
    { name: 'ThirdLove 24/7 Classic T-Shirt Bra', type: 'T-Shirt', forWho: 'Seamless under tees with memory foam cups that adapt to you.' },
    { name: "Chantelle Rive Gauche Full-Coverage", type: 'Full-Coverage', forWho: 'French-designed support with all-day comfort for D+ cups.' },
  ],
  'full-figure': [
    { name: 'Elomi Cate Full-Coverage', type: 'Full-Coverage', forWho: 'Larger bands needing maximum support and side smoothing.' },
    { name: 'Goddess Keira Banded Underwire', type: 'Underwire', forWho: 'Full-figure support with soft fabrics and reinforced cups.' },
    { name: 'Vanity Fair Full-Figure Beauty Back', type: 'Smoothing', forWho: 'Back-smoothing design with 4-way stretch for larger bands.' },
  ],
};

const CUP_INCHES = { A: 1, B: 2, C: 3, D: 4, DD: 5, DDD: 6 };

export default function BraSizeGuidePage({ params }) {
  const size = params.size.toUpperCase();
  if (!ALL_BRA_SIZES.includes(size)) notFound();

  const parsed = parseSize(size);
  const measurements = getMeasurementRange(size);
  const sisters = getSisterSizes(size);
  const adjacent = getAdjacentSizes(size);
  const desc = SIZE_DESCRIPTIONS[size] || { category: 'average', volume: 'Standard volume.', analogy: '', visualSimilar: '' };
  const recommendations = getBraRecommendations(size);
  const recBras = REC_BRAS_BY_CATEGORY[desc.category] || REC_BRAS_BY_CATEGORY.average;
  const projectionInches = CUP_INCHES[parsed.cup] || 3;

  const faqs = [
    {
      question: `What does a ${size} look like?`,
      answer: `${desc.visualSimilar || `A ${size} bra size typically presents with ${desc.volume.toLowerCase()}`} To visualize, ${desc.analogy || `the bust has noticeable projection relative to the ${parsed.band}-inch underbust.`} Breast shape — round, teardrop, slender, or tubular — can make the same ${size} look very different from person to person. Use our Breast Shape Calculator to identify your specific shape.`,
    },
    {
      question: `What are the sister sizes of ${size}?`,
      answer: sisters.length > 0
        ? `The sister sizes of ${size} are ${sisters.map(s => s.size).join(' and ')}. ${sisters[0] ? `${sisters[0].size} — if the band feels too tight on ${size}, try this sister size: go up one band size and down one cup size for the same cup volume with a looser band.` : ''} ${sisters[1] ? `${sisters[1].size} — if the band feels too loose on ${size}, try this sister size: go down one band size and up one cup size for the same cup volume with a snugger band.` : ''} Sister sizes share the same cup volume but with different band lengths, making them useful when a bra feels close-but-not-perfect.`
        : `For ${size}, conventional sister sizing does not apply due to the band-cup combination. Use our Bra Size Calculator to find your best-fitting size.`,
    },
    {
      question: `What type of bra is best for ${size}?`,
      answer: recommendations.length > 0
        ? `The best bra types for ${size} are: ${recommendations.map(r => `${r.type} — ${r.reason}`).join('; ')}. The ideal style also depends on your breast shape and the outfits you wear. If you have a teardrop shape or concerns about support, prioritize fuller-coverage styles. For everyday versatility with ${size}, start with a well-fitted T-shirt bra and build your collection from there.`
        : `For ${size}, a variety of bra styles work well. Consider your breast shape, outfit needs, and comfort preferences. A professional fitting can help identify the specific styles that flatter your figure most.`,
    },
  ];

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Guide', path: '/bra-size-guide/' },
        { name: `${size} Bra Size Guide`, path: `/bra-size-guide/${size.toLowerCase()}/` },
      ])} />

      <section className="size-guide-header">
        <h1>{size} Bra Size Guide: Measurements, Sister Sizes &amp; Best Bras</h1>
        <p>Everything you need to know about the {size} bra size — from how it looks to the most comfortable bra styles for your shape.</p>
      </section>

      <div className="size-guide-content">
        <section className="guide-section">
          <h2>{size} at a Glance</h2>
          <p>{desc.volume} This is a <strong>{desc.category}</strong> size. Understanding your {size} measurements helps you choose bras that fit comfortably and flatter your figure.</p>

          <div className="guide-grid">
            <div className="guide-card">
              <h4>Measurements</h4>
              <table className="data-table">
                <tbody>
                  <tr>
                    <th>Underbust</th>
                    <td>{measurements.underbust}</td>
                  </tr>
                  <tr>
                    <th>Bust</th>
                    <td>{measurements.bust}</td>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <td>{desc.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="guide-card">
              <h4>Sister Sizes</h4>
              {sisters.length > 0 ? (
                <table className="data-table">
                  <tbody>
                    {sisters.map((s, i) => (
                      <tr key={i}>
                        <th>{s.size}</th>
                        <td>{s.direction === 'up-band' ? 'Looser band, same cup volume' : 'Snugger band, same cup volume'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No conventional sister sizes for this band-cup combination.</p>
              )}
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>What Does a {size} Look Like?</h2>
          <div className="placeholder-img">
            [Image Placeholder: Person wearing a well-fitted {size} bra, shown from front and side angles with a neutral, relaxed posture.]
          </div>
          <p>{desc.visualSimilar}</p>
          <p>
            To help visualize: <strong>{desc.analogy}</strong>
          </p>
          <p>
            On a {parsed.band}-inch underbust, the bust projects approximately {projectionInches} inch{projectionInches > 1 ? 'es' : ''} from the chest wall. 
            Breast shape — round, teardrop, slender, or tubular — can dramatically change how {size} looks on different bodies. 
            Use our <Link href="/tools/breast-shape-calculator/">Breast Shape Calculator</Link> to identify your specific shape and learn how it affects fit.
          </p>
        </section>

        <section className="guide-section">
          <h2>Best Bra Styles for {size}</h2>
          <p>Based on the {size} profile, here are the bra styles we recommend for comfort, support, and a flattering silhouette:</p>

          {recommendations.map((rec, i) => (
            <div key={i} className="rec-card">
              <h3>{rec.type}</h3>
              <p>{rec.reason}</p>
            </div>
          ))}

          <h3 style={{ marginTop: 32 }}>Editor-Tested Bra Recommendations for {size}</h3>
          {recBras.map((bra, i) => (
            <div key={i} className="rec-card">
              <h3>{bra.name} ({bra.type})</h3>
              <p>{bra.forWho}</p>
              <a href={`#affiliate-${bra.name.replace(/\s+/g, '-').toLowerCase()}`} className="affiliate-link">
                [Affiliate Link: {bra.name}]
              </a>
            </div>
          ))}
        </section>

        <section className="guide-section">
          <h2>Tips for Wearing {size}</h2>
          <ul>
            <li>Get professionally fitted at least once a year — weight changes, pregnancy, and aging affect bra size.</li>
            <li>If you are between sizes, choose the option that feels most comfortable on the loosest hook.</li>
            <li>Replace bras every 6–12 months depending on wear — stretched bands reduce support.</li>
            <li>Always fasten new bras on the loosest hook to extend their usable life as the elastic wears.</li>
            <li>Mix up bra styles — wearing the same style daily can create pressure points.</li>
            <li>For {size}, the band provides approximately 70% of the support — ensure it sits level all around, never riding up.</li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>{size} vs Other Sizes</h2>
          <p>
            If you are between sizes or curious how {size} compares, explore our visual comparison guides:
          </p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {['bc', 'cd', 'dd', 'ddd'].map(cup => {
              const href = `/compare/${cup === 'bc' ? 'b' : cup === 'cd' ? 'c' : cup === 'dd' ? 'd' : 'dd'}-cup-vs-${cup === 'bc' ? 'c' : cup === 'cd' ? 'd' : cup === 'dd' ? 'dd' : 'ddd'}-cup/`;
              const label = cup === 'bc' ? 'B Cup vs C Cup' : cup === 'cd' ? 'C Cup vs D Cup' : cup === 'dd' ? 'D Cup vs DD Cup' : 'DD Cup vs DDD Cup';
              return (
                <Link key={cup} href={href} className="card" style={{ display: 'block' }}>
                  <h3>{label}</h3>
                  <p>See the visual difference between these cup sizes.</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="guide-section">
          <h2>Related Resources</h2>
          <div className="card-grid" style={{ marginTop: 16 }}>
            <Link href="/bra-size-calculator/" className="card" style={{ display: 'block' }}>
              <h3>Bra Size Calculator</h3>
              <p>Measure yourself and find your exact bra size instantly.</p>
            </Link>
            <Link href="/how-to-measure-bra-size/" className="card" style={{ display: 'block' }}>
              <h3>How to Measure Bra Size</h3>
              <p>Step-by-step guide with tips for accurate at-home measurement.</p>
            </Link>
            <Link href="/bra-buying-guide/" className="card" style={{ display: 'block' }}>
              <h3>Bra Buying Guide</h3>
              <p>How to choose the right bra for your shape, size, and lifestyle.</p>
            </Link>
            <Link href="/best-comfort-bras/" className="card" style={{ display: 'block' }}>
              <h3>Most Comfortable Bras</h3>
              <p>Expert-tested comfortable bras for every size.</p>
            </Link>
          </div>
        </section>

        {adjacent.length > 0 && (
          <nav className="sibling-nav">
            {adjacent[0] ? (
              <Link href={`/bra-size-guide/${adjacent[0].size.toLowerCase()}/`}>
                &larr; {adjacent[0].size} Guide
              </Link>
            ) : <span />}
            {adjacent[1] ? (
              <Link href={`/bra-size-guide/${adjacent[1].size.toLowerCase()}/`}>
                {adjacent[1].size} Guide &rarr;
              </Link>
            ) : <span />}
          </nav>
        )}
      </div>

      <FAQ questions={faqs} />
    </>
  );
}