import Link from 'next/link';
import { buildMetadata } from '@/lib/seoMetadata';
import { breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';

export const metadata = buildMetadata({
  title: 'Bra Size Comparisons: Cup Size & Sister Size Visual Guides',
  description: 'Confused between cup sizes or sister sizes? See side-by-side comparisons of B, C, D, DD, DDD cups, plus sister size comparisons like 32D vs 34C and 36B vs 34C.',
  path: '/compare/',
  keywords: ['cup size comparison', 'bra size comparison', 'sister size comparison', 'B cup vs C cup', 'C cup vs D cup', '32D vs 34C', '36B vs 34C', 'wireless vs wired bra'],
});

const comparisons = [
  {
    href: '/compare/b-cup-vs-c-cup/',
    title: 'B Cup vs C Cup',
    desc: 'The most common cup size confusion. See the 1-inch difference in volume, appearance, and which bra styles work best for each.',
    icon: 'B↔C',
  },
  {
    href: '/compare/c-cup-vs-d-cup/',
    title: 'C Cup vs D Cup',
    desc: 'The jump from C to D is significant — more volume, more projection, and different bra needs. See the visual difference.',
    icon: 'C↔D',
  },
  {
    href: '/compare/d-cup-vs-dd-cup/',
    title: 'D Cup vs DD Cup',
    desc: 'Where support needs change dramatically. Many women wear D when they need DD. Find out if you should switch.',
    icon: 'D↔DD',
  },
  {
    href: '/compare/dd-cup-vs-ddd-cup/',
    title: 'DD Cup vs DDD Cup',
    desc: 'The DD-to-DDD gap is where professional fitting often reveals surprising results. See the real difference.',
    icon: 'DD↔DDD',
  },
  {
    href: '/compare/wireless-vs-wired-bra/',
    title: 'Wireless vs Wired Bra',
    desc: 'Not a cup comparison — a style comparison. Which is best for your breast shape, size, and daily comfort?',
    icon: '⌣↔⌢',
  },
];

export default function CompareIndex() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
      ])} />

      <section className="hero">
        <h1>Bra Size Comparisons</h1>
        <p>
          Compare cup sizes, sister sizes, and bra styles side by side. Our visual comparisons help you understand 
          the real difference in volume, appearance, and bra fit — so you can choose with confidence.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">Sister Size Comparisons</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
          Same cup volume, different band — these comparisons help you find the best fit when you are between sizes.
        </p>
        <div className="card-grid" style={{ marginTop: 24 }}>
          <Link href="/compare/32d-vs-34c/" className="card" style={{ display: 'block' }}>
            <h3>32D vs 34C</h3>
            <p>Sister sizes with ~420 cc each. Find the right balance between band snugness and comfort.</p>
          </Link>
          <Link href="/compare/34b-vs-36c/" className="card" style={{ display: 'block' }}>
            <h3>34B vs 36C</h3>
            <p>Different cup volumes — 350 cc vs 450 cc. Understand which matches your measurements.</p>
          </Link>
          <Link href="/compare/36b-vs-34c/" className="card" style={{ display: 'block' }}>
            <h3>36B vs 34C</h3>
            <p>Classic sister size trade-off: larger band + smaller cup, or smaller band + larger cup.</p>
          </Link>
          <Link href="/compare/34dd-vs-36d/" className="card" style={{ display: 'block' }}>
            <h3>34DD vs 36D</h3>
            <p>Fuller bust comparison with ~700 cc each. Support and comfort for DD/D cups.</p>
          </Link>
          <Link href="/compare/38c-vs-40b/" className="card" style={{ display: 'block' }}>
            <h3>38C vs 40B</h3>
            <p>Plus size sister sizes with ~480 cc each. Find the sweet spot between band comfort and support.</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Cup Size Comparisons</h2>
        <div className="card-grid" style={{ marginTop: 24 }}>
          {comparisons.filter(c => c.href.includes('-cup-vs-')).map(c => (
            <Link key={c.href} href={c.href} className="card" style={{ display: 'block' }}>
              <div className="card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Bra Style Comparisons</h2>
        <div className="card-grid" style={{ marginTop: 24 }}>
          {comparisons.filter(c => !c.href.includes('-cup-vs-')).map(c => (
            <Link key={c.href} href={c.href} className="card" style={{ display: 'block' }}>
              <div className="card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-banner">
          <h2>Not Sure Which Size You Are?</h2>
          <p>Use our free calculator to find your exact bra size, then explore the comparison guide for your cups.</p>
          <Link href="/bra-size-calculator/" className="btn-primary" style={{ display: 'inline-block', color: 'var(--color-primary)' }}>
            Calculate My Bra Size &rarr;
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How to Use These Comparisons</h2>
        <div className="article">
          <ol>
            <li><strong>Find your size</strong> — Use our <Link href="/bra-size-calculator/">Bra Size Calculator</Link> to get your measurement.</li>
            <li><strong>If you are between two cups</strong> — Click the relevant comparison to see the volume difference visually.</li>
            <li><strong>Read the bra recommendations</strong> — Each comparison page lists the best bra styles for each cup size.</li>
            <li><strong>Check the signs</strong> — Each page includes signs that you may need to switch cup sizes.</li>
            <li><strong>Browse size guides</strong> — Visit our <Link href="/bra-size-guide/">Bra Size Guides</Link> for detailed information on your specific size.</li>
          </ol>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius)', padding: '48px 24px' }}>
        <h2 className="section-title">Explore Your Size in Detail</h2>
        <div className="card-grid" style={{ marginTop: 24 }}>
          <Link href="/bra-size-guide/" className="card" style={{ display: 'block' }}>
            <h3>All Bra Size Guides</h3>
            <p>Complete guides for 20+ sizes from 32A to 40D — measurements, sister sizes, and best bra styles.</p>
          </Link>
          <Link href="/bra-size-guide/32b/" className="card" style={{ display: 'block' }}>
            <h3>32B Guide</h3>
            <p>A common starting size. See if you should really be a 32C or 30C.</p>
          </Link>
          <Link href="/bra-size-guide/34c/" className="card" style={{ display: 'block' }}>
            <h3>34C Guide</h3>
            <p>The most-sold bra size in the US. Check sister sizes and style tips.</p>
          </Link>
          <Link href="/bra-size-guide/36d/" className="card" style={{ display: 'block' }}>
            <h3>36D Guide</h3>
            <p>Full coverage and support tips for the 36D size range.</p>
          </Link>
        </div>
      </section>
    </>
  );
}