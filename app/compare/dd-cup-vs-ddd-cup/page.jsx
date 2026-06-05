import { buildCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';
import CompareContent from '@/components/CompareContent';

export const metadata = buildCompareMeta('DD', 'DDD');

const faqs = [
  { question: 'What is the difference between DD and DDD cup?', answer: 'DDD (also called F in European sizing) is one full cup volume larger than DD. The bust-underbust difference is about 1 inch (2.5 cm) more — so a 36DDD is roughly 750 cc per breast, while a 36DD is about 600 cc. The DD-to-DDD gap is where many women find their true size after professional fitting.' },
  { question: 'Is DDD the same as F cup?', answer: 'Yes — DDD in US sizing is equivalent to F in most European and international sizing systems. The reason for the different label is historical: US brands extended the alphabet (DD, DDD, G) while European brands used a more linear letter progression (D, E, F, G). Both labels refer to the exact same cup volume.' },
  { question: 'I wear DD — how do I know if I need DDD?', answer: 'Try DDD if your DD cup shows: breast tissue spilling over the top of the cup, the underwire pressing into breast tissue at the sides or under the arms, the back band riding up despite being on the tightest hook, or shoulder grooving from straps carrying too much weight. DD-to-DDD is one of the most common size upgrades after a professional fitting.' },
];

export default function DDCupVsDDDCup() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'DD Cup vs DDD Cup: Visual Comparison & Differences',
        description: 'Compare DD cup and DDD cup bra sizes — see the volume difference, appearance, and which bra styles work best for each.',
        datePublished: '2026-06-01T00:00:00Z',
        dateModified: '2026-06-01T00:00:00Z',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: 'DD Cup vs DDD Cup', path: '/compare/dd-cup-vs-ddd-cup/' },
      ])} />
      <CompareContent cup1="DD" cup2="DDD" />
    </>
  );
}
