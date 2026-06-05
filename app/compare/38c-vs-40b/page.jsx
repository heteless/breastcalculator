import Link from 'next/link';
import { buildSizeCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildSizeCompareMeta('38C', '40B');

const faqs = [
  { question: 'Are 38C and 40B the same size?', answer: 'They are sister sizes, meaning they share the same cup volume (~450-500 cc per breast). The 38C has a 38-inch band with a C cup, while the 40B has a 40-inch band with a B cup. The total bust circumference differs: 38C measures about 41 inches, while 40B measures about 42 inches.' },
  { question: 'Is 38C a plus size?', answer: '38C falls in the mid-to-full figure range. A 38 band corresponds to an underbust measurement of 37-38 inches (94-97 cm). Many plus size bra brands start their sizing at 38 bands, though plus size is more of a fit category than a rigid definition.' },
  { question: 'Can I switch from 38C to 40B for more comfort?', answer: 'Yes, if the 38 band feels too tight, a 40B can provide more comfort while maintaining the same cup volume. However, ensure the 40 band is snug enough on the loosest hooks — a band that is too loose can ride up in the back, reducing support and causing shoulder strain.' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: '38C vs 40B Bra Size: Plus Size Fit & Comfort Comparison',
        description: 'Comprehensive comparison of 38C and 40B bra sizes for fuller figures. Sister size analysis with cup volume, band support, and fit recommendations.',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: '38C vs 40B', path: '/compare/38c-vs-40b/' },
      ])} />

      <section className="hero">
        <h1>38C vs 40B Bra Size Comparison</h1>
        <p>Plus size sister sizes — find the perfect balance of band comfort and cup support</p>
      </section>

      <article className="article" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <p className="article-intro">
          For women in the plus size range, the difference between <strong>38C</strong> and <strong>40B</strong>
          is about finding the sweet spot between band comfort and overall support. These sister sizes
          offer the same cup volume but deliver different wearing experiences based on your ribcage
          measurement.
        </p>

        <h2>Key Differences Between 38C and 40B</h2>
        <table className="data-table">
          <thead><tr><th>Feature</th><th>38C</th><th>40B</th></tr></thead>
          <tbody>
            <tr><td>Band Size</td><td>38 inches (97 cm)</td><td>40 inches (102 cm)</td></tr>
            <tr><td>Cup Volume</td><td>~480 cc per breast</td><td>~480 cc per breast</td></tr>
            <tr><td>Bust Circumference</td><td>~41 inches (104 cm)</td><td>~42 inches (107 cm)</td></tr>
            <tr><td>Sister Sizes</td><td>36D, 40B, 42A</td><td>38C, 42A, 44AA</td></tr>
          </tbody>
        </table>

        <h2>Understanding Plus Size Bra Fit</h2>
        <p>
          In larger band sizes, the principles of bra fit remain the same but comfort considerations
          become more important. A <strong>38C</strong> has a 38-inch band designed for a 37-38 inch
          underbust, while a <strong>40B</strong> accommodates a 39-40 inch underbust. Both hold
          approximately 480 cc of breast volume per cup — roughly equivalent to a medium orange in size.
        </p>

        <h2>Who Should Wear 38C?</h2>
        <p>
          Choose <strong>38C</strong> if your underbust measures 37-38 inches (94-97 cm) and you prefer
          a secure, supportive fit. The C cup on a 38 band provides moderate volume with good shape
          definition. The snugger band helps prevent the bra from shifting during movement.
        </p>

        <h2>Who Should Wear 40B?</h2>
        <p>
          Opt for <strong>40B</strong> if your underbust is 39-40 inches (99-102 cm). The wider band
          distributes pressure across a larger surface area, which can reduce red marks and discomfort.
          The B cup on a 40 band tends to be shallower and wider, suiting breasts that are more spread
          across the chest wall.
        </p>

        <h2>Making the Right Choice</h2>
        <p>
          The key decision factor is your <strong>underbust measurement</strong>. If it is 38 inches or
          less, choose 38C for better support. If it is closer to 40 inches, the 40B will be more
          comfortable. For precise sizing, use our <Link href="/bra-size-calculator/">free bra size calculator</Link> with both your underbust and bust measurements for personalized results.
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
            <Link href="/compare/34dd-vs-36d/">34DD vs 36D</Link>
            <Link href="/compare/">All Comparisons</Link>
            <Link href="/bra-size-calculator/">Bra Size Calculator</Link>
            <Link href="/bra-size-guide/">Bra Size Guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}