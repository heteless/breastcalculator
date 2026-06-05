import Link from 'next/link';
import BraCalculator from '@/components/BraCalculator';
import JsonLd from '@/components/JsonLd';
import { buildMetadata } from '@/lib/seoMetadata';
import { webApplicationSchema, breadcrumbSchema } from '@/lib/structuredData';

export const metadata = buildMetadata({
  title: 'Bra Size Calculator: Accurate US, UK, EU Sizing — Free & Instant',
  description: 'Find your accurate bra size with our free calculator. Enter your band and bust measurements for instant US, UK, EU, FR, and AU sizing. Includes sister sizes.',
  path: '/bra-size-calculator/',
  keywords: ['bra size calculator', 'bra calculator', 'bra size', 'cup size calculator', 'bra fitting', 'measure bra size'],
});

export default function BraSizeCalculatorPage() {
  return (
    <>
      <JsonLd data={webApplicationSchema(
        'Bra Size Calculator',
        'Accurate, free bra size calculator. Enter band and bust measurements for instant US, UK, EU sizing with sister sizes.',
        'https://breastcalculator.com/bra-size-calculator/'
      )} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Calculator', path: '/bra-size-calculator/' },
      ])} />

      <section className="hero">
        <BraCalculator />
      </section>

      <section className="section">
        <div className="article">
          <h2>How to Use the Bra Size Calculator</h2>
          <p>
            This bra size calculator uses the standard fitting method used by professional bra fitters worldwide. 
            Enter two measurements — your underbust (ribcage just under the breasts) and your bust (fullest part) — 
            and the calculator does the rest.
          </p>

          <h3>Step 1: Measure Your Underbust</h3>
          <p>
            Wrap a soft measuring tape snugly around your ribcage, directly under your breasts. 
            The tape should be level all the way around and firm against your skin. 
            Breathe out naturally while measuring for the most accurate reading.
          </p>

          <h3>Step 2: Measure Your Bust</h3>
          <p>
            Measure around the fullest part of your bust, typically at nipple level. 
            Keep the tape parallel to the floor — not sloping up or down at the back. 
            Wear a non-padded bra for the most accurate result.
          </p>

          <h3>Step 3: Get Your Results</h3>
          <p>
            Click "Calculate My Bra Size" and you will see your bra size along with sister sizes. 
            Sister sizes have the same cup volume but different band sizes — if the band feels too tight, 
            try the larger band sister size.
          </p>

          <h2>What If My Size Is Between Bands?</h2>
          <p>
            If your underbust measurement falls between two even numbers (e.g., 33"), the calculator rounds 
            to the nearest even number. If you are exactly halfway, we recommend trying both sizes — 
            the smaller band for more support, the larger for more comfort.
          </p>

          <h2>Bra Sizing Systems Explained</h2>
          <p>
            Different countries use different bra sizing systems. Here is how they compare:
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th>System</th>
                <th>Band Size</th>
                <th>Cup Size</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>US / Canada</td><td>Inches (even numbers)</td><td>AA, A, B, C, D, DD/E, DDD/F, G, H, I, J, K</td></tr>
              <tr><td>UK</td><td>Inches (even numbers)</td><td>AA, A, B, C, D, DD, E, F, FF, G, GG, H, HH, J</td></tr>
              <tr><td>EU</td><td>Based on underbust cm − 28</td><td>AA, A, B, C, D, E, F, G, H</td></tr>
              <tr><td>FR / Belgium / Spain</td><td>Band + 15</td><td>AA, A, B, C, D, E, F, G, H</td></tr>
              <tr><td>AU / NZ</td><td>Band − 2</td><td>AA, A, B, C, D, DD, E, F, G, H</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Explore Your Bra Size</h2>
        <div className="card-grid" style={{ marginTop: 16 }}>
          <Link href="/bra-size-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Size Guides</h3>
            <p>Complete guides for 20+ sizes — from 32A to 40D. Measurements, sister sizes, and best bra styles for each.</p>
          </Link>
          <Link href="/compare/" className="card" style={{ display: 'block' }}>
            <h3>Cup Size Comparisons</h3>
            <p>Side-by-side visual comparisons of B, C, D, DD, and DDD cups. See the real difference.</p>
          </Link>
          <Link href="/how-to-measure-bra-size/" className="card" style={{ display: 'block' }}>
            <h3>How to Measure Bra Size</h3>
            <p>Step-by-step measurement guide with pictures. Learn to measure your band and bust at home.</p>
          </Link>
          <Link href="/bra-buying-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Buying Guide</h3>
            <p>How to choose the right bra for your breast shape, size, and lifestyle.</p>
          </Link>
        </div>
      </section>
    </>
  );
}