import { buildCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';
import CompareContent from '@/components/CompareContent';

export const metadata = buildCompareMeta('D', 'DD');

const faqs = [
  { question: 'Is DD really a cup size or just an extension of D?', answer: 'DD (sometimes called E) is a real, distinct cup size — it is one full cup volume larger than D. DD cups are typically 1 inch (2.5 cm) bigger in bust-underbust difference than D. The label "DD" causes confusion because many people assume the alphabet ends at D, but DD, DDD, and G are all standard cup sizes used worldwide.' },
  { question: 'How much bigger is DD than D cup?', answer: 'A DD cup is about 1 inch (2.5 cm) larger in bust-underbust difference than a D cup. In terms of volume, DD is approximately 30-40% larger than D — meaning a 36DD holds roughly 600 cc per breast, while a 36D holds about 450 cc. The size jump is real and meaningful for support and bra selection.' },
  { question: 'I wear a D cup — should I try DD?', answer: 'Try DD if your D cup shows: breast tissue spilling over the top of the cup, the underwire pressing into breast tissue at the sides, the back band riding up (because cups are too small to distribute weight), or the center gore not lying flat against your sternum. Many women discover they have been wearing D when they really need DD.' },
];

export default function DCupVsDDCup() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'D Cup vs DD Cup: Visual Comparison & Differences',
        description: 'Compare D cup and DD cup bra sizes — see the volume difference, appearance, and which bra styles work best for each.',
        datePublished: '2026-06-01T00:00:00Z',
        dateModified: '2026-06-01T00:00:00Z',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: 'D Cup vs DD Cup', path: '/compare/d-cup-vs-dd-cup/' },
      ])} />
      <CompareContent cup1="D" cup2="DD" />
    </>
  );
}
