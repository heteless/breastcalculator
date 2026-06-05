import Link from 'next/link';
import { buildSizeCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildSizeCompareMeta('36B', '34C');

const faqs = [
  { question: 'Are 36B and 34C sister sizes?', answer: 'Yes — 36B and 34C are sister sizes, meaning they share the same total cup volume. The 34C has a smaller band (34 inches) with a larger cup letter, while the 36B has a larger band (36 inches) with a smaller cup letter. Both hold approximately 380-420 cc per breast.' },
  { question: 'Which provides better support: 36B or 34C?', answer: 'A 34C typically provides better support because the snugger band anchors the bra more securely. Approximately 70-80% of bra support comes from the band, so the tighter 34 band will offer more lift and stability than the looser 36 band, assuming the cup volume is equivalent.' },
  { question: 'Should I choose 36B or 34C if I am between sizes?', answer: 'If your underbust measures 33-34 inches, go with 34C. If your underbust measures 35-36 inches, a 36B will be more comfortable. Try both sizes on the loosest hook — a new bra should fit snugly on the loosest setting, allowing you to tighten as the band stretches over time.' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: '36B vs 34C Bra Size Comparison: Cup Volume & Band Fit Guide',
        description: 'Comprehensive comparison of 36B and 34C bra sizes with cup volume analysis, band fit, and practical recommendations.',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: '36B vs 34C', path: '/compare/36b-vs-34c/' },
      ])} />

      <section className="hero">
        <h1>36B vs 34C Bra Size Comparison</h1>
        <p>Sister sizes with different band and cup letter combinations — which one is right for you?</p>
      </section>

      <article className="article" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <p className="article-intro">
          <strong>36B</strong> and <strong>34C</strong> represent an interesting trade-off in bra sizing:
          one has a larger band with a smaller cup, while the other has a smaller band with a larger cup.
          Despite the different labels, these two sizes share the same total cup volume. Understanding
          this relationship is key to finding your most comfortable fit.
        </p>

        <h2>Key Differences Between 36B and 34C</h2>
        <table className="data-table">
          <thead><tr><th>Feature</th><th>36B</th><th>34C</th></tr></thead>
          <tbody>
            <tr><td>Band Size</td><td>36 inches (91 cm)</td><td>34 inches (86 cm)</td></tr>
            <tr><td>Cup Volume</td><td>~380 cc per breast</td><td>~390 cc per breast</td></tr>
            <tr><td>Bust Circumference</td><td>~38 inches (97 cm)</td><td>~37 inches (94 cm)</td></tr>
            <tr><td>Sister Sizes</td><td>34C, 38A, 32D</td><td>32D, 36B, 38A</td></tr>
          </tbody>
        </table>

        <h2>The Band vs Cup Trade-Off</h2>
        <p>
          When you go from a 36B to a 34C, you are trading band width for cup letter. The 34C will feel
          snugger around your ribcage, but the cup shape may be slightly different — C cups are typically
          designed with more forward projection, while B cups tend to be shallower and wider. This can
          affect how the bra sits against your chest wall.
        </p>

        <h2>Who Should Wear 36B?</h2>
        <p>
          A <strong>36B</strong> is best for women with an underbust of 35-36 inches (89-91 cm). This
          size works well for those who prefer a more relaxed band feel or have a broader back. The B
          cup on a 36 band is moderately shallow, making it a good match for breasts that are wider at
          the base with less forward projection.
        </p>

        <h2>Who Should Wear 34C?</h2>
        <p>
          A <strong>34C</strong> is ideal for women with a 33-34 inch underbust (84-86 cm). The 34 band
          provides solid support for most body types, and the C cup offers moderate volume with good
          forward shape. This is one of the most commonly worn bra sizes and has the widest availability
          across brands.
        </p>

        <h2>How to Choose</h2>
        <p>
          If your underbust measures 34 inches or less, the <strong>34C</strong> will provide better
          support. If it measures 35-36 inches, the <strong>36B</strong> will be more comfortable. For
          the most accurate measurement, use our <Link href="/bra-size-calculator/">free bra size calculator</Link> and consider trying both sizes to compare the feel.
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
          <h2>Explore More Size Comparisons</h2>
          <div className="related-grid">
            <Link href="/compare/32d-vs-34c/">32D vs 34C</Link>
            <Link href="/compare/34b-vs-36c/">34B vs 36C</Link>
            <Link href="/compare/34dd-vs-36d/">34DD vs 36D</Link>
            <Link href="/compare/38c-vs-40b/">38C vs 40B</Link>
            <Link href="/compare/">All Comparisons</Link>
            <Link href="/bra-size-calculator/">Bra Size Calculator</Link>
            <Link href="/bra-size-guide/">Bra Size Guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}