import Link from 'next/link';
import { buildSizeCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildSizeCompareMeta('34DD', '36D');

const faqs = [
  { question: 'Are 34DD and 36D the same cup size?', answer: 'They are sister sizes with equivalent total cup volume (~700 cc per breast). The 34DD has a smaller band (34 inches) with a larger cup letter, while the 36D has a larger band (36 inches) with a smaller cup letter. Both hold the same approximate volume of breast tissue.' },
  { question: 'Is 34DD a common bra size?', answer: 'Yes, 34DD is a fairly common bra size. Research suggests that DD/E cup sizes are more common than previously thought, especially when women are properly fitted. Many women who currently wear 38C or 36D may actually be a 34DD when measured accurately.' },
  { question: 'What is the difference between DD and D cup?', answer: 'A DD cup is one size larger than a D cup on the same band. On a 34 band, a D cup holds approximately 590 cc while a DD holds about 700 cc — a difference of roughly 110 cc per breast. The DD cup provides more forward projection and fuller coverage.' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: '34DD vs 36D Bra Size Comparison: Full Bust Support Guide',
        description: 'Detailed comparison of 34DD and 36D bra sizes for fuller busts. Cup volume equivalence, band fit, support analysis, and practical recommendations.',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: '34DD vs 36D', path: '/compare/34dd-vs-36d/' },
      ])} />

      <section className="hero">
        <h1>34DD vs 36D Bra Size Comparison</h1>
        <p>Full bust sister sizes — which one gives you the support and comfort you need?</p>
      </section>

      <article className="article" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <p className="article-intro">
          For women with fuller busts, the difference between <strong>34DD</strong> and <strong>36D</strong>
          can significantly affect comfort and support throughout the day. These two sizes share the same
          cup volume but differ in band size, creating different wearing experiences.
        </p>

        <h2>Key Differences Between 34DD and 36D</h2>
        <table className="data-table">
          <thead><tr><th>Feature</th><th>34DD</th><th>36D</th></tr></thead>
          <tbody>
            <tr><td>Band Size</td><td>34 inches (86 cm)</td><td>36 inches (91 cm)</td></tr>
            <tr><td>Cup Volume</td><td>~700 cc per breast</td><td>~700 cc per breast</td></tr>
            <tr><td>Bust Circumference</td><td>~39 inches (99 cm)</td><td>~40 inches (102 cm)</td></tr>
            <tr><td>Sister Sizes</td><td>32E, 36D, 38C</td><td>34DD, 38C, 40B</td></tr>
          </tbody>
        </table>

        <h2>Support Considerations for Fuller Busts</h2>
        <p>
          With cup volumes around <strong>700 cc per breast</strong>, the band is especially important for
          proper support. The weight of a DD/D cup breast (approximately 700-900 grams each) requires a
          firm, well-anchored band. For this reason, many women with fuller busts benefit from the snugger
          <strong>34DD</strong> band, as it prevents the bra from riding up and provides better weight
          distribution.
        </p>

        <h2>When to Choose 34DD</h2>
        <p>
          Select <strong>34DD</strong> if your underbust measures 33-34 inches and you have a fuller bust.
          This size is excellent for women who want maximum support without a band that feels restrictive.
          The DD cup on a 34 band provides generous forward projection while the band keeps everything
          securely in place.
        </p>

        <h2>When to Choose 36D</h2>
        <p>
          Choose <strong>36D</strong> if your underbust is 35-36 inches. The wider band offers more surface
          area for weight distribution, which can be more comfortable for extended wear. However, ensure the
          band is snug enough on the loosest hook — a band that is too loose will not provide adequate
          support for heavier breast tissue.
        </p>

        <h2>Fit Tips for DD/D Cup Wearers</h2>
        <p>
          For DD and larger cup sizes, look for bras with <strong>wider straps, reinforced underwire, and
          multi-hook back closures</strong>. These features help distribute weight more evenly and reduce
          shoulder strain. If you are between these two sizes, we recommend using our
          <Link href="/bra-size-calculator/"> free bra size calculator</Link> for a precise measurement before purchasing.
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
            <Link href="/compare/36b-vs-34c/">36B vs 34C</Link>
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