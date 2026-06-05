import Link from 'next/link';
import ComparisonVisual from '@/components/ComparisonVisual';

const CUP_DATA = {
  B: {
    volumeDiff: '2 inches (5 cm)',
    volumeDesc: 'Moderate',
    appearance: 'Subtle, natural projection',
    styles: 'T-shirt, plunge, wireless',
    cleavage: 'Natural, subtle',
    analogy: 'Think of two medium apples — a classic, balanced proportion.',
    tips: [
      'T-Shirt Bra — Seamless and invisible under fitted tops.',
      'Plunge Bra — Creates natural shape with lower necklines.',
      'Wireless Bra — Comfortable for all-day wear without sacrificing shape.',
      'Demi Bra — Light lift with a lower cut for square or wide necklines.',
    ],
  },
  C: {
    volumeDiff: '3 inches (7.6 cm)',
    volumeDesc: 'Fuller / more rounded',
    appearance: 'Noticeable fullness, defined shape',
    styles: 'Balconette, full-coverage, side-support',
    cleavage: 'More defined, easier to create',
    analogy: 'Think of two large apples — full, rounded, and substantial.',
    tips: [
      'Balconette Bra — Lifts from the bottom, creating a rounded silhouette.',
      'Full-Coverage Bra — Encapsulates all breast tissue, preventing spillage.',
      'Side-Support Bra — Panels direct tissue forward for a streamlined look.',
      'Push-Up Bra — Adds lift and shape for more defined shape.',
    ],
  },
  D: {
    volumeDiff: '4 inches (10.2 cm)',
    volumeDesc: 'Full, substantial projection',
    appearance: 'Significant fullness, attention needed for support',
    styles: 'Full-coverage, side-support, minimizer',
    cleavage: 'Prominent — support is priority',
    analogy: 'Think of two small grapefruits — generous volume needing reliable daily support.',
    tips: [
      'Full-Coverage Bra — Maximum encapsulation and support for fuller busts.',
      'Minimizer Bra — Reduces projection by up to 1 inch for better layering.',
      'Side-Support Bra — Essential for redirecting tissue forward.',
      'Sports Bra (High Impact) — Non-negotiable for exercise to reduce bounce.',
    ],
  },
  DD: {
    volumeDiff: '5 inches (12.7 cm)',
    volumeDesc: 'Generous, substantial volume',
    appearance: 'Dramatic fullness, wide straps recommended',
    styles: 'Full-coverage, encapsulation sports, minimizer',
    cleavage: 'Very prominent — structured support required',
    analogy: 'Think of two medium grapefruits — impressive volume requiring engineered support.',
    tips: [
      'Full-Coverage Bra — Encapsulation with reinforced cups and wide straps.',
      'High-Impact Sports Bra — Essential for comfort during any activity.',
      'Minimizer Bra — Reduces projection for smoother clothing fit.',
      'Front-Close Bra — Easier to put on with a wide, comfortable back.',
    ],
  },
  DDD: {
    volumeDiff: '6 inches (15.2 cm)',
    volumeDesc: 'Very generous, maximum support needed',
    appearance: 'Very substantial, structured support essential',
    styles: 'Full-coverage, encapsulation, posture-correcting',
    cleavage: 'Maximum projection — engineering-grade support',
    analogy: 'Think of two large grapefruits — very full, requiring thoughtfully engineered support.',
    tips: [
      'Full-Coverage Bra — Maximum coverage with padded straps and wide bands.',
      'Posture-Correcting Bra — Distributes weight across shoulders and back.',
      'High-Impact Sports Bra — Encapsulation style for zero bounce.',
      'Custom-Fit Brands — Consider brands specializing in DDD+ for best fit.',
    ],
  },
};

const TRANSITION_SIGNS = {
  'B-C': [
    'Breast tissue spilling out of the top or sides of your B cup bras',
    'The center gore (wire between cups) no longer lies flat against your sternum',
    'You feel compressed in your current B cup bras',
    'You recently gained weight, started hormonal birth control, or are in a different phase of your menstrual cycle',
  ],
  'C-D': [
    'You notice the underwire digging into breast tissue at the sides',
    'Your C cup bras feel like they are not providing enough coverage',
    'The band feels tighter because breast tissue is pushing the cups away from your body',
    'You experience shoulder grooving from straps supporting more weight',
  ],
  'D-DD': [
    'Breast tissue frequently escapes the top or sides of D cup bras',
    'You feel you need to "adjust" throughout the day',
    'Your bras show signs of strain — stretched straps, distorted underwires',
    'You have been wearing the same D cup for years but recently noticed fit changes',
  ],
  'DD-DDD': [
    'Your DD cup bras consistently feel too small — constant spillage',
    'The underwire digs into your ribcage or breast tissue',
    'You need to double up on sports bras for adequate exercise support',
    'You have been professionally fitted and told you need a larger cup than DD',
  ],
};

const SAMPLE_SIZES = {
  B: [
    { size: '32B', label: '32B — Petite Frame' },
    { size: '34B', label: '34B — Average Frame' },
    { size: '36B', label: '36B — Medium Frame' },
  ],
  C: [
    { size: '32C', label: '32C — Petite Frame' },
    { size: '34C', label: '34C — Average Frame' },
    { size: '36C', label: '36C — Medium Frame' },
  ],
  D: [
    { size: '32D', label: '32D — Petite Frame' },
    { size: '34D', label: '34D — Average Frame' },
    { size: '36D', label: '36D — Medium Frame' },
  ],
  DD: [
    { size: '32DD', label: '32DD — Petite Frame' },
    { size: '34DD', label: '34DD — Average Frame' },
    { size: '36DD', label: '36DD — Medium Frame' },
  ],
  DDD: [],
};

const WHY_CONFUSED = {
  'B-C': 'Many women fluctuate between B and C cups depending on hormonal cycles, weight changes, and brand sizing differences. The 1-inch difference is subtle, making these two sizes frequently confused — especially since 32B and 34C (sister sizes) share nearly identical cup volume.',
  'C-D': 'The jump from C to D is significant — 1 inch more bust projection and noticeably more volume. Women often wear the wrong size here for years, either in a too-small C cup or incorrectly sized into D.',
  'D-DD': 'The D-to-DD transition is where support needs change dramatically. Many women wear D cups long after they should have switched to DD, leading to discomfort and poor fit.',
  'DD-DDD': 'The DD-to-DDD gap is where many women discover they have been wearing the wrong cup size for years. Professional fitting often reveals the need for DDD or larger.',
};

export default function CompareContent({ cup1, cup2 }) {
  const c1 = CUP_DATA[cup1];
  const c2 = CUP_DATA[cup2];
  const key = `${cup1}-${cup2}`;
  const signs = TRANSITION_SIGNS[key] || TRANSITION_SIGNS['B-C'];
  const confused = WHY_CONFUSED[key] || `The difference between ${cup1} and ${cup2} cups can be subtle, making it easy to wear the wrong size.`;
  const sample1 = SAMPLE_SIZES[cup1] || [];
  const sample2 = SAMPLE_SIZES[cup2] || [];

  const relatedComparisons = [
    { label: 'B Cup vs C Cup', href: '/compare/b-cup-vs-c-cup/', active: cup1 === 'B' && cup2 === 'C' },
    { label: 'C Cup vs D Cup', href: '/compare/c-cup-vs-d-cup/', active: cup1 === 'C' && cup2 === 'D' },
    { label: 'D Cup vs DD Cup', href: '/compare/d-cup-vs-dd-cup/', active: cup1 === 'D' && cup2 === 'DD' },
    { label: 'DD Cup vs DDD Cup', href: '/compare/dd-cup-vs-ddd-cup/', active: cup1 === 'DD' && cup2 === 'DDD' },
    { label: 'Wireless vs Wired Bra', href: '/compare/wireless-vs-wired-bra/', active: false },
  ].filter(r => !r.active);

  return (
    <>
      <section className="hero">
        <h1>{cup1} Cup vs {cup2} Cup: Visual Comparison, Volume &amp; Best Bras</h1>
        <p>Confused between {cup1} and {cup2} cups? See the visual difference, volume comparison, and best bra styles for each.</p>
      </section>

      <article className="article" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        <p className="article-intro">
          Confused between {cup1} and {cup2} cup sizes? You are not alone. {confused} This guide gives you a side-by-side comparison with visuals, daily object analogies, and clear bra recommendations for each.
        </p>

      <ComparisonVisual cup1={cup1} cup2={cup2} />

      <h2>Volume Difference: {cup1} Cup vs {cup2} Cup</h2>
      <p>
        A {cup1} cup has a bust-underbust difference of <strong>{c1.volumeDiff}</strong>, while a {cup2} cup has <strong>{c2.volumeDiff}</strong>. 
        That extra inch (2.5 cm) changes how clothing fits, how much support you need, and which bra styles feel most comfortable.
      </p>
      <p>
        To put it in everyday terms: <strong>{c1.analogy}</strong> In contrast, <strong>{c2.analogy}</strong> 
        The volume difference is roughly 15–25% — enough to change your bra size and silhouette, but often subtle enough to cause confusion.
      </p>

      <h3>Side-by-Side Comparison</h3>
      <table className="data-table">
        <thead>
          <tr><th>Feature</th><th>{cup1} Cup</th><th>{cup2} Cup</th></tr>
        </thead>
        <tbody>
          <tr><td>Bust-Underbust Difference</td><td>{c1.volumeDiff}</td><td>{c2.volumeDiff}</td></tr>
          <tr><td>Volume</td><td>{c1.volumeDesc}</td><td>{c2.volumeDesc}</td></tr>
          <tr><td>Appearance</td><td>{c1.appearance}</td><td>{c2.appearance}</td></tr>
          <tr><td>Best Bra Styles</td><td>{c1.styles}</td><td>{c2.styles}</td></tr>
          <tr><td>Cleavage</td><td>{c1.cleavage}</td><td>{c2.cleavage}</td></tr>
        </tbody>
      </table>

      <h2>Why {cup1} Cups and {cup2} Cups Look Different on Different Bands</h2>
      <p>
        Cup size is relative to band size. A {cup1} cup on a 32-inch band has less total volume than a {cup1} cup on a 38-inch band 
        because the cup is scaled to the band's width. This is why sister sizes exist — a 34{cup1} and 32{cup2} share roughly the same 
        cup volume with different band lengths.
      </p>

      <div className="guide-grid" style={{ marginTop: 24 }}>
        {sample1.length > 0 && (
          <div className="guide-card">
            <h4>{cup1} Cup Size Guides</h4>
            <ul>
              {sample1.map(s => (
                <li key={s.size}>
                  <Link href={`/bra-size-guide/${s.size.toLowerCase()}/`}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {sample2.length > 0 && (
          <div className="guide-card">
            <h4>{cup2} Cup Size Guides</h4>
            <ul>
              {sample2.map(s => (
                <li key={s.size}>
                  <Link href={`/bra-size-guide/${s.size.toLowerCase()}/`}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h2>Best Bra Styles for {cup1} Cup</h2>
      <p>With a {cup1} cup, you have excellent versatility. The following styles work especially well:</p>
      <ul>{c1.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>

      <h2>Best Bra Styles for {cup2} Cup</h2>
      <p>With a {cup2} cup, support becomes increasingly important. We recommend:</p>
      <ul>{c2.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>

      <h2>Common Signs You May Need a {cup2} Cup Instead of {cup1}</h2>
      <p>Here are the indicators that a {cup2} cup may be a better fit for you than your current {cup1}:</p>
      <ul>{signs.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <p>
        If you recognize two or more of these signs, try a {cup2} cup in your band size. The difference in comfort can be life-changing.
      </p>

      <h2>Summary: Should You Choose {cup1} or {cup2}?</h2>
      <p>
        If your measurements fall between a {cup1} and {cup2} cup, we recommend trying both sizes in the same brand and style. 
        A {cup1} cup may feel more comfortable for casual days and under looser clothing, while a {cup2} cup provides more 
        coverage and support for active days, fitted outfits, or when you want a fuller silhouette.
      </p>
      <p>
        The right choice depends on your breast shape, the specific bra brand (sizing varies!), and your personal comfort 
        preference. When in doubt, prioritize comfort — a bra that feels good is the one you will reach for every day.
      </p>
      <p>
        <strong>Not sure what your size is?</strong> Use our <Link href="/bra-size-calculator/">Bra Size Calculator</Link> to find out, 
        then browse our <Link href="/bra-size-guide/">Bra Size Guides</Link> to learn more about your specific size.
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
          <h2>Explore More Comparisons</h2>
          <div className="related-grid">
            {relatedComparisons.map(r => (
              <Link key={r.href} href={r.href}>{r.label}</Link>
            ))}
            <Link href="/bra-size-calculator/">Bra Size Calculator</Link>
            <Link href="/bra-size-guide/">Bra Size Guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}