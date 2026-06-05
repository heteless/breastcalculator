import Link from 'next/link';
import { buildSizeCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildSizeCompareMeta('32D', '34C');

const faqs = [
  { question: 'Are 32D and 34C sister sizes?', answer: 'Yes — 32D and 34C are sister sizes, meaning they share the same cup volume (~420 cc per breast). The difference is in the band: the 32 band is 2 inches smaller than the 34 band. If you go down one band size, you go up one cup size to maintain the same volume.' },
  { question: 'Which is bigger: 32D or 34C?', answer: 'The cup volume is essentially the same. However, the 34C has a larger band (34 inches vs 32 inches), making it fit a broader ribcage. If you have a narrow ribcage, the 32D will provide a snugger, more supportive fit.' },
  { question: 'Can I wear 34C if my bra size is 32D?', answer: 'You can try a 34C if the 32D band feels too tight, but the looser band may compromise support. For optimal support, 70-80% of bra support should come from the band. If the 32 band is genuinely too tight, a 34C can serve as a more comfortable alternative while maintaining similar cup volume.' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: '32D vs 34C Bra Size: Same Cup Volume, Different Fit',
        description: 'Complete comparison of 32D and 34C bra sizes including cup volume equivalence, band differences, and sister sizing.',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: '32D vs 34C', path: '/compare/32d-vs-34c/' },
      ])} />

      <section className="hero">
        <h1>32D vs 34C Bra Size Comparison</h1>
        <p>Sister sizes with equal cup volume — understand band differences for the perfect fit</p>
      </section>

      <article className="article" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <p className="article-intro">
          The <strong>32D vs 34C</strong> comparison is one of the most important to understand in bra sizing
          because these two sizes share the same cup volume. They are classic sister sizes: as the band goes
          down, the cup letter goes up to maintain equivalent breast volume.
        </p>

        <h2>Key Differences Between 32D and 34C</h2>
        <table className="data-table">
          <thead><tr><th>Feature</th><th>32D</th><th>34C</th></tr></thead>
          <tbody>
            <tr><td>Band Size</td><td>32 inches (81 cm)</td><td>34 inches (86 cm)</td></tr>
            <tr><td>Cup Volume</td><td>~420 cc per breast</td><td>~420 cc per breast</td></tr>
            <tr><td>Bust Circumference</td><td>~36 inches (91 cm)</td><td>~37 inches (94 cm)</td></tr>
            <tr><td>Sister Sizes</td><td>30DD, 34C, 36B</td><td>32D, 36B, 38A</td></tr>
          </tbody>
        </table>

        <h2>The Sister Size Relationship</h2>
        <p>
          32D and 34C are <strong>true sister sizes</strong>. Both hold approximately 420 cc of breast
          volume per cup. The only difference is the band circumference: a 32 band is designed for an
          underbust of about 80-82 cm, while a 34 band fits an underbust of about 84-86 cm. This means
          if you try on both sizes, the cup should feel very similar — but the band tightness will differ.
        </p>

        <h2>When to Choose 32D</h2>
        <p>
          Choose a <strong>32D</strong> if your underbust measurement is 31-32 inches (80-82 cm) and
          your bust measurement is approximately 35-36 inches (89-91 cm). The snugger band provides
          better support for active lifestyles and ensures the bra stays in place throughout the day.
        </p>

        <h2>When to Choose 34C</h2>
        <p>
          Opt for <strong>34C</strong> if your underbust is 33-34 inches (84-86 cm). The slightly wider
          band is more comfortable if you have a broader ribcage or prefer a less snug fit. Many women
          who find the 32D band too restrictive switch to 34C for everyday comfort while maintaining the
          same cup volume.
        </p>

        <h2>The Bottom Line</h2>
        <p>
          If the cup of your 34C fits perfectly but the band feels loose, try a <strong>32D</strong>.
          If your 32D cup is great but the band is too tight, go for a <strong>34C</strong>. For the
          most accurate size recommendation, use our <Link href="/bra-size-calculator/">free bra size calculator</Link> with your exact measurements.
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
            <Link href="/compare/34b-vs-36c/">34B vs 36C</Link>
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