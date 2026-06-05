import Link from 'next/link';
import { buildMetadata } from '@/lib/seoMetadata';
import { howToSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';
import BraCalculator from '@/components/BraCalculator';

export const metadata = buildMetadata({
  title: 'How to Measure Bra Size at Home: Step-by-Step Guide with Pictures',
  description: 'Learn how to measure your bra size at home with our step-by-step guide. Band, bust, cup size, and sister size — all explained clearly for accurate fit.',
  path: '/how-to-measure-bra-size/',
  keywords: ['how to measure bra size', 'measure bra size at home', 'bra measurement guide', 'how to measure bust', 'bra fitting guide'],
});

const steps = [
  {
    name: 'Prepare Your Tools',
    text: 'You will need a soft measuring tape (tailor\'s tape), a mirror, and a non-padded bra. Avoid wearing a push-up or padded bra — these add bulk and distort your measurement. Stand in front of a mirror with your shoulders relaxed and arms at your sides. If possible, ask someone to help — a second pair of eyes ensures the tape is level.',
  },
  {
    name: 'Measure Your Underbust (Band Size)',
    text: 'Wrap the measuring tape around your ribcage, directly under your breasts. The tape should be snug against your skin — firm but not digging in. Make sure the tape is parallel to the floor (use the mirror to check). Breathe out normally — do not hold your breath. Round the measurement to the nearest whole number. If it is an odd number, your band size is typically the next even number up. For example, a 33-inch underbust usually corresponds to a 34 band.',
  },
  {
    name: 'Measure Your Bust (Fullest Part)',
    text: 'Wrap the measuring tape around the fullest part of your bust, typically at nipple level. Keep the tape parallel to the floor — this is the most common mistake. Do not pull the tape tight — it should rest gently against your skin without compressing breast tissue. Record this number to the nearest 0.1 inch or centimeter. This is your bust measurement.',
  },
  {
    name: 'Calculate Your Cup Size',
    text: 'Subtract your underbust measurement from your bust measurement. The difference in inches determines your cup size: 1 inch = A, 2 = B, 3 = C, 4 = D, 5 = DD/E, 6 = DDD/F. For example, if your underbust is 34 inches and your bust is 37 inches, the difference is 3 inches — you are a 34C. Use our calculator below to get your result instantly.',
  },
  {
    name: 'Verify the Fit',
    text: 'Put on a bra in your calculated size. Check the band (should be snug on the loosest hook), cups (no spillage or gaping), straps (no digging or slipping), and center gore (should lie flat against your sternum). If any of these signs are off, try a sister size — go up one band and down one cup, or vice versa.',
  },
];

export default function HowToMeasureBraSize() {
  return (
    <>
      <JsonLd data={howToSchema({
        name: 'How to Measure Bra Size at Home',
        description: 'Step-by-step guide to measuring your bra size at home with a soft measuring tape. Find your accurate band and cup size.',
        totalTime: 'PT10M',
        supplies: ['Soft measuring tape (tailor\'s tape)', 'Non-padded bra', 'Mirror'],
        tools: ['Bra Size Calculator'],
        steps,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'How to Measure Bra Size', path: '/how-to-measure-bra-size/' },
      ])} />

      <article className="article">
        <h1>How to Measure Bra Size at Home: Complete Step-by-Step Guide</h1>
        <p>
          Learning how to measure your bra size at home is one of the most empowering things you can do for your comfort and confidence. 
          Studies show that approximately 80% of women wear the wrong bra size — often because they have never been properly measured 
          or their size has changed over time. This guide walks you through every step.
        </p>

        <div className="placeholder-img">
          [Image Placeholder: A woman demonstrating the correct way to hold a measuring tape around her underbust, with a mirror in front of her. The tape is level and parallel to the floor.]
        </div>

        {steps.map((step, i) => (
          <section key={i} style={{ marginBottom: 40 }}>
            <h2>Step {i + 1}: {step.name}</h2>
            <p>{step.text}</p>
            {i === 0 || i === 1 || i === 2 ? (
              <div className="placeholder-img" style={{ padding: 24, fontSize: '0.85rem' }}>
                [Image Placeholder: Step {i + 1} — {step.name} illustration]
              </div>
            ) : null}
          </section>
        ))}

        <div style={{ margin: '40px 0' }}>
          <h2>Try Our Bra Size Calculator</h2>
          <BraCalculator embedded />
        </div>

        <h2>Common Measurement Mistakes</h2>
        <ul>
          <li><strong>Measuring over clothing:</strong> Always measure against bare skin or with a very thin, non-padded bra. Clothing adds bulk and distorts the measurement.</li>
          <li><strong>Holding your breath:</strong> Your ribcage expands when you inhale. Breathe out naturally while measuring your underbust.</li>
          <li><strong>Tape not level:</strong> If the tape slopes down at the back, your underbust measurement will be too large. Use a mirror or ask for help.</li>
          <li><strong>Pulling too tight on the bust:</strong> The bust measurement should be taken gently — compressing breast tissue gives a falsely small cup size.</li>
          <li><strong>Measuring once and forgetting:</strong> Your bra size changes with weight fluctuations, hormonal cycles, pregnancy, and aging. Re-measure every 6–12 months.</li>
        </ul>

        <h2>What If My Measurements Give an Unusual Size?</h2>
        <p>
          If your calculated bra size seems surprising — for example, you have been wearing a 36B and the calculator says 32DD — 
          you are not alone. This is called the "bra size sticker shock" and it is incredibly common. Many women are wearing 
          bands that are too large and cups that are too small. Trust the measurement and try the calculated size. 
          You may be amazed at how much better it fits.
        </p>

        <h2>Related Resources</h2>
        <div className="card-grid" style={{ marginTop: 16 }}>
          <Link href="/bra-size-calculator/" className="card" style={{ display: 'block' }}>
            <h3>Bra Size Calculator</h3>
            <p>Enter your measurements for instant sizing across US, UK, EU systems.</p>
          </Link>
          <Link href="/bra-size-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Size Guides</h3>
            <p>Detailed guides for 20+ sizes — from 32A to 40D.</p>
          </Link>
          <Link href="/compare/" className="card" style={{ display: 'block' }}>
            <h3>Cup Size Comparisons</h3>
            <p>Confused between two cup sizes? See B vs C, C vs D, DD vs DDD side by side.</p>
          </Link>
          <Link href="/bra-buying-guide/" className="card" style={{ display: 'block' }}>
            <h3>Bra Buying Guide</h3>
            <p>How to choose the right bra for your shape and lifestyle.</p>
          </Link>
        </div>
      </article>
    </>
  );
}