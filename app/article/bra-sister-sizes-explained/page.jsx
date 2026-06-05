import Link from 'next/link';
import { buildMetadata } from '@/lib/seoMetadata';
import { articleSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildMetadata({
  title: 'Bra Sister Sizes Explained — How to Find Your Alternative Bra Fit',
  description: 'Learn how bra sister sizes work and find your alternative fit. Complete sister sizing guide with charts, examples, and expert bra shopping tips.',
  path: '/article/bra-sister-sizes-explained/',
  type: 'article',
  keywords: ['bra sister sizes', 'sister sizes explained', 'alternative bra fit', 'bra size chart', 'sister sizing guide', 'bra size calculator'],
});

const sisterSizeExamples = [
  { base: '32A', down: '30B', up: '34AA' },
  { base: '34B', down: '32C', up: '36A' },
  { base: '36C', down: '34D', up: '38B' },
  { base: '38D', down: '36DD', up: '40C' },
  { base: '40DD', down: '38DDD', up: '42D' },
];

const comparisons = [
  { label: '32D vs 34C', href: '/compare/32d-vs-34c/', desc: 'Sister sizes with ~420 cc each. Find the right balance between band snugness and comfort.', highlight: true },
  { label: '34B vs 36C', href: '/compare/34b-vs-36c/', desc: 'Different cup volumes — 350 cc vs 450 cc. Understand which matches your measurements.' },
  { label: '36B vs 34C', href: '/compare/36b-vs-34c/', desc: 'Classic sister size trade-off: larger band + smaller cup, or smaller band + larger cup.', highlight: true },
  { label: '34DD vs 36D', href: '/compare/34dd-vs-36d/', desc: 'Fuller bust comparison with ~700 cc each. Support and comfort for DD/D cups.' },
  { label: '38C vs 40B', href: '/compare/38c-vs-40b/', desc: 'Plus size sister sizes with ~480 cc each. Band comfort and support balance.', highlight: true },
  { label: 'B Cup vs C Cup', href: '/compare/b-cup-vs-c-cup/', desc: 'The most common cup size confusion — see the 1-inch difference in volume.' },
  { label: 'C Cup vs D Cup', href: '/compare/c-cup-vs-d-cup/', desc: 'More volume, more projection, and different bra needs for each size.' },
  { label: 'D Cup vs DD Cup', href: '/compare/d-cup-vs-dd-cup/', desc: 'Where support needs change dramatically between sizes.' },
  { label: 'DD Cup vs DDD Cup', href: '/compare/dd-cup-vs-ddd-cup/', desc: 'The DD-to-DDD gap — professional fitting often reveals surprises here.' },
  { label: 'Wireless vs Wired Bra', href: '/compare/wireless-vs-wired-bra/', desc: 'Not a cup comparison — style choice for breast shape and daily comfort.' },
];

export default function BraSisterSizesExplained() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'Bra Sister Sizes Explained — How to Find Your Alternative Bra Fit',
        description: 'Learn how bra sister sizes work and how to find your alternative bra fit. Complete guide to sister sizing with charts, examples, and tips for using sister sizes when shopping.',
        image: 'https://breastcalculator.com/images/og-default.jpg',
        datePublished: '2026-05-11T08:00:00Z',
        dateModified: '2026-06-01T08:00:00Z',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Sister Sizes Explained', path: '/article/bra-sister-sizes-explained/' },
      ])} />

      <section className="hero">
        <h1>Bra Sister Sizes Explained — How to Find Your Alternative Bra Fit</h1>
        <p>Learn how sister sizes work, when to use them, and how to find your perfect alternative fit when your usual size is unavailable.</p>
      </section>

      <article className="article">
        <div className="placeholder-img" style={{ marginBottom: 32 }}>
          [Image: Bra size measurement guide — sister sizes explained]
        </div>

        <p>
          If you have ever gone bra shopping and found that your usual size is out of stock, or that a bra
          in your size does not fit quite right, sister sizes may be the answer. Understanding bra sister
          sizes can significantly expand your options and help you find a comfortable, supportive fit even
          when your exact size is not available.
        </p>
        <p>
          In this guide, we explain what sister sizes are, how they work, and how to use them to find your
          perfect bra fit. Start with our <Link href="/bra-size-calculator/">free bra size calculator</Link> to
          determine your base size first.
        </p>

        <h2>What Are Bra Sister Sizes?</h2>
        <p>
          Sister sizes are bra sizes that have the <strong>same cup volume</strong> but different band and cup
          letter combinations. When you go up one band size and down one cup letter, or down one band size and
          up one cup letter, the cup volume remains the same.
        </p>
        <p>
          For example, if you wear a <strong>34C</strong> bra, your sister sizes would be <strong>32D</strong> and
          <strong>36B</strong>. All three sizes contain approximately the same cup volume — only the band length
          and cup letter differ.
        </p>

        <h2>Sister Size Rule Explained</h2>
        <p>The sister size rule is simple to remember:</p>
        <ul>
          <li><strong>Band up, cup down:</strong> If you need a larger band, go up one band size and down one cup letter (e.g., 34C &rarr; 36B)</li>
          <li><strong>Band down, cup up:</strong> If you need a smaller band, go down one band size and up one cup letter (e.g., 34C &rarr; 32D)</li>
        </ul>
        <p>
          This rule works because cup letters represent the difference between bust and band measurements, not
          absolute volume. By adjusting both the band and cup together, the overall cup volume stays consistent.
        </p>

        <div style={{
          background: 'var(--color-primary-light)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '28px 24px',
          margin: '32px 0',
        }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>Quick Reference: Sister Size Chart</h3>
          <p style={{ marginBottom: 16 }}>Find your size below, then look left and right for your sister size alternatives:</p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Band Down, Cup Up</th>
                <th>Your Size</th>
                <th>Band Up, Cup Down</th>
              </tr>
            </thead>
            <tbody>
              {sisterSizeExamples.map((row) => (
                <tr key={row.base}>
                  <td><strong>{row.down}</strong></td>
                  <td>{row.base}</td>
                  <td><strong>{row.up}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>When to Use Sister Sizes</h2>
        <p>Sister sizes are particularly useful in these situations:</p>
        <ul>
          <li><strong>Your exact size is unavailable:</strong> Many stores stock limited sizes. Sister sizes give you alternatives that will still fit well.</li>
          <li><strong>Between band sizes:</strong> If you are between band sizes (e.g., between 34 and 36), trying sister sizes can help you decide which band feels more comfortable.</li>
          <li><strong>Different bra styles fit differently:</strong> Some styles run smaller or larger in the band. Knowing your sister sizes helps you adjust.</li>
          <li><strong>Weight fluctuations:</strong> If you have gained or lost a few pounds, sister sizing can help you find a comfortable fit without a full remeasurement.</li>
        </ul>

        <h2>Important Considerations When Using Sister Sizes</h2>
        <ul>
          <li><strong>Sister sizes are not identical:</strong> Although the cup volume is similar, the band length and cup shape differ slightly. You may need to adjust strap length when trying a sister size.</li>
          <li><strong>Start with your correct base size:</strong> Always use our <Link href="/bra-size-calculator/">bra size calculator</Link> to find your most accurate size first, then explore sister sizes from there.</li>
          <li><strong>Only go one step in each direction:</strong> Going more than one band size up or down can significantly alter the fit and support level.</li>
          <li><strong>Band fit is critical:</strong> The band provides most of your bra&apos;s support. If a sister size makes the band too loose or too tight, it may not provide adequate support.</li>
        </ul>

        <h2>How to Test a Sister Size</h2>
        <p>When trying a sister size, follow these steps to ensure a good fit:</p>
        <ol>
          <li>Put on the bra and fasten it on the loosest hook</li>
          <li>Check that the band sits level around your ribcage (not riding up or digging in)</li>
          <li>Ensure the center gore lies flat against your breastbone</li>
          <li>Verify there is no spillage from the cups or gaps at the top</li>
          <li>Adjust the straps so they sit comfortably without digging in</li>
          <li>Move around — raise your arms, bend over, and twist to test the fit in motion</li>
        </ol>

        <p>
          Understanding bra sister sizes gives you more flexibility and options when shopping for bras.
          Use our <Link href="/bra-size-calculator/">bra size calculator</Link> to find your base size,
          then explore sister sizes to discover your best fit.
        </p>
      </article>

      <section className="section">
        <div className="cta-banner">
          <h2>Find Your Exact Bra Size First</h2>
          <p>Use our free calculator to determine your base size, then explore sister size alternatives with confidence.</p>
          <Link href="/bra-size-calculator/" className="btn-primary" style={{ display: 'inline-block', color: 'var(--color-primary)' }}>
            Calculate My Bra Size &rarr;
          </Link>
        </div>
      </section>

      <section style={{ background: 'var(--color-surface)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <h2 className="section-title">Bra Size Comparisons</h2>
          <p className="section-subtitle">
            Now that you understand sister sizes, explore our detailed side-by-side size comparisons to see the real differences in cup volume, band support, and fit.
          </p>
          <div className="card-grid" style={{ marginTop: 24 }}>
            {comparisons.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="card"
                style={{
                  display: 'block',
                  ...(c.highlight ? {
                    background: 'linear-gradient(135deg, var(--color-primary-light), #f9eaf3)',
                    border: '2px solid var(--color-primary)',
                  } : {}),
                }}
              >
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="related-links">
        <div className="related-links-inner">
          <h2>Explore More</h2>
          <div className="related-grid">
            <Link href="/compare/">All Comparisons</Link>
            <Link href="/bra-size-calculator/">Bra Size Calculator</Link>
            <Link href="/bra-size-guide/">Bra Size Guides</Link>
            <Link href="/how-to-measure-bra-size/">How to Measure Bra Size</Link>
            <Link href="/bra-buying-guide/">Bra Buying Guide</Link>
            <Link href="/best-comfort-bras/">Most Comfortable Bras</Link>
            <Link href="/best-wireless-bras/">Best Wireless Bras</Link>
          </div>
        </div>
      </section>
    </>
  );
}
