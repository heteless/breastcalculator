import { buildCompareMeta } from '@/lib/seoMetadata';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/structuredData';
import JsonLd from '@/components/JsonLd';
import CompareContent from '@/components/CompareContent';

export const metadata = buildCompareMeta('B', 'C');

const faqs = [
  { question: 'Is C cup much bigger than B cup?', answer: 'A C cup is about 1 inch (2.5 cm) larger in bust-underbust difference than a B cup — roughly 15-25% more volume. The change is noticeable but subtle, which is why many women fluctuate between B and C cups depending on hormonal cycles and brand fit.' },
  { question: 'Are 32B and 34C the same size?', answer: 'Yes — 32B and 34C are sister sizes, sharing approximately the same cup volume (~280-300 cc per breast). The 32B has a snugger band, while the 34C has a slightly wider band. If the 32 band feels too tight, try 34C for the same cup in a more comfortable band.' },
  { question: 'How do I know if I need a B or C cup?', answer: 'Measure your underbust and bust, then subtract. A 1-inch difference typically means a B cup; a 2-inch difference means a C cup. Other signs you may need a C cup include breast tissue spilling out of the top or sides of B cup bras, or the underwire center gore no longer lying flat against your sternum.' },
];

export default function BCupVsCCup() {
  return (
    <>
      <JsonLd data={articleSchema({
        headline: 'B Cup vs C Cup: Visual Comparison & Differences',
        description: 'Compare B cup and C cup bra sizes — see the volume difference, appearance, and which bra styles work best for each.',
        datePublished: '2026-06-01T00:00:00Z',
        dateModified: '2026-06-01T00:00:00Z',
      })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Bra Size Comparisons', path: '/compare/' },
        { name: 'B Cup vs C Cup', path: '/compare/b-cup-vs-c-cup/' },
      ])} />
      <CompareContent cup1="B" cup2="C" />
    </>
  );
}
