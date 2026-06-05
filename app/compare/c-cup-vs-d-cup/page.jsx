import { buildCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';
import CompareContent from '@/components/CompareContent';

export const metadata = buildCompareMeta('C', 'D');

const faqs = [
  { question: 'Is D cup much bigger than C cup?', answer: 'A D cup is about 1 inch (2.5 cm) larger in bust-underbust difference than a C cup — roughly 25-35% more volume. The jump from C to D is significant: more projection, more support needs, and different bra styles work best. Many women wear the wrong size at this range for years.' },
  { question: 'What is the average bra size in the US?', answer: 'The most commonly sold bra size in the US is 34C, with 36C close behind. Average bust-underbust differences fall in the 3-4 inch range, placing many women in the C-D cup range. Regional and demographic variations apply, but C-D is the statistical center of US bra sizing.' },
  { question: 'How do I know if I need a D cup instead of C?', answer: 'Signs you may need a D cup include: the underwire digging into breast tissue at the sides, your C cup bras not providing enough coverage, the band feeling tighter because breast tissue is pushing cups away, and shoulder grooving from straps supporting more weight. Measure your bust-underbust difference — 4 inches or more suggests a D cup.' },
];

export default function CCupVsDCup() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'C Cup vs D Cup: Visual Comparison & Differences',
        description: 'Compare C cup and D cup bra sizes — see the volume difference, appearance, and which bra styles work best for each.',
        datePublished: '2026-06-01T00:00:00Z',
        dateModified: '2026-06-01T00:00:00Z',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: 'C Cup vs D Cup', path: '/compare/c-cup-vs-d-cup/' },
      ])} />
      <CompareContent cup1="C" cup2="D" />
    </>
  );
}
