import Link from 'next/link';
import { buildSizeCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildSizeCompareMeta('34B', '36C');

const faqs = [
  { question: 'Is 34B the same cup volume as 36C?', answer: 'No — they differ in both band and cup. A 34B has a smaller total cup volume than a 36C. The 36C cup holds about 30-60 cc more volume than the 34B cup. These are actually sister sizes: 34B = 36A, and 36C = 34D.' },
  { question: 'Can I wear 36C if my bra size is 34B?', answer: 'If you typically wear 34B, a 36C will have a looser band and a larger cup. The band will be 2 inches bigger, which may reduce support. The cup will also be significantly larger. It is generally recommended to stay with your measured size for optimal support.' },
  { question: 'Which is bigger: 34B or 36C?', answer: 'A 36C is larger in both band and cup. The 36 band is 2 inches (5 cm) wider than the 34 band, and the C cup holds more volume than a B cup on the same band. The 36C is approximately one full cup size larger in total volume.' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: '34B vs 36C Bra Size Comparison: Which Fits You Better?',
        description: 'Complete comparison of 34B and 36C bra sizes including cup volume, band size, sister sizing, and fit recommendations.',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: '34B vs 36C', path: '/compare/34b-vs-36c/' },
      ])} />

      <section className="hero">
        <h1>34B vs 36C Bra Size Comparison</h1>
        <p>Understand cup volume, band size differences, and find your best fit</p>
      </section>

      <article className="article" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <p className="article-intro">
          Choosing between a <strong>34B</strong> and <strong>36C</strong> bra is a common dilemma for
          women whose underbust measurement falls between band sizes or who are discovering their true
          size for the first time. While both sizes serve different body types, understanding the
          differences in band length, cup volume, and fit can help you make the best choice.
        </p>

        <h2>Key Differences Between 34B and 36C</h2>
        <table className="data-table">
          <thead><tr><th>Feature</th><th>34B</th><th>36C</th></tr></thead>
          <tbody>
            <tr><td>Band Size</td><td>34 inches (86 cm)</td><td>36 inches (91 cm)</td></tr>
            <tr><td>Cup Volume</td><td>~350 cc per breast</td><td>~450 cc per breast</td></tr>
            <tr><td>Bust Circumference</td><td>~36 inches (91 cm)</td><td>~39 inches (99 cm)</td></tr>
            <tr><td>Best For</td><td>Petite to medium frame</td><td>Medium to broad ribcage</td></tr>
          </tbody>
        </table>

        <h2>Understanding Sister Sizes</h2>
        <p>
          34B and 36C are <strong>not direct sister sizes</strong>. The sister sizes for 34B are 32C and
          36A. The sister sizes for 36C are 34D and 38B. This means that while these two sizes are close
          in the sizing spectrum, they serve different body proportions. If you find yourself between a
          34B and 36C, you may actually be a 34C or 36B.
        </p>

        <h2>Who Should Wear 34B?</h2>
        <p>
          A 34B is ideal for women with an underbust measurement of approximately <strong>84-86 cm (33-34
          inches)</strong> and a bust measurement of approximately <strong>89-91 cm (35-36 inches)</strong>.
          This size is common among women with a petite to average frame and a modest bust. The 34 band
          provides good support for those with a narrower ribcage.
        </p>

        <h2>Who Should Wear 36C?</h2>
        <p>
          A 36C suits women with an underbust measurement of approximately <strong>89-91 cm (35-36
          inches)</strong> and a bust measurement of approximately <strong>96-99 cm (38-39 inches)</strong>.
          The larger band accommodates a broader ribcage, while the C cup provides generous volume without
          excessive projection. This is a popular size for women transitioning from a B cup due to natural
          changes or weight fluctuations.
        </p>

        <h2>How to Decide Between These Sizes</h2>
        <p>
          The best approach is to <strong>measure yourself accurately</strong> using a soft measuring tape.
          If your underbust is 33-34 inches, a 34 band is likely correct. If it is 35-36 inches, a 36 band
          will be more comfortable. The cup letter should then be determined by subtracting your band
          measurement from your bust measurement. For personalized results, use our
          <Link href="/bra-size-calculator/"> free bra size calculator</Link>.
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
            <Link href="/compare/36b-vs-34c/">36B vs 34C</Link>
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