const SITE_NAME = 'Breast Calculator';
const SITE_URL = 'https://breastcalculator.com';
const TAGLINE = 'Science-based breast measurement, bra sizing, and fitting — trusted by women worldwide.';

function buildMetadata({ title, description, path, image, type = 'website', keywords = [] }) {
  // Title suffix is added by Next.js layout template (`'%s | Breast Calculator'`),
  // so we return the bare title here to avoid duplication like
  // "X | Breast Calculator | Breast Calculator".
  const defaultKeywords = ['breast calculator', 'bra size calculator', 'bra fitting', 'cup size', 'breast measurement'];
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return {
    title,
    description,
    keywords: allKeywords.join(', '),
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        en: `${SITE_URL}${path}`,
        'x-default': `${SITE_URL}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      images: [{ url: image || `${SITE_URL}/images/og-default.jpg`, width: 1200, height: 630 }],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || `${SITE_URL}/images/og-default.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

function buildBraSizeGuideMeta(size) {
  return buildMetadata({
    title: `${size} Bra Size Guide: Measurements, Sister Sizes & Best Bras`,
    description: `Everything you need to know about ${size} bra size. See how it looks, find your sister sizes, and discover the best bras for your shape.`,
    path: `/bra-size-guide/${size.toLowerCase()}/`,
    keywords: [`${size} bra size`, `${size} bra`, `${size} bra size guide`, `${size} cup`, 'bra size guide'],
  });
}

function buildCompareMeta(cup1, cup2) {
  const title = `${cup1} Cup vs ${cup2} Cup: Visual Comparison & Differences`;
  const desc = `Confused between ${cup1} and ${cup2} cup sizes? See side-by-side visuals, understand the volume difference, and find the best bra for each.`;
  return buildMetadata({
    title,
    description: desc,
    path: `/compare/${cup1.toLowerCase()}-cup-vs-${cup2.toLowerCase()}-cup/`,
    keywords: [`${cup1} cup vs ${cup2} cup`, `difference between ${cup1} and ${cup2}`, `${cup1} cup`, `${cup2} cup`, 'cup size comparison'],
  });
}

function buildSizeCompareMeta(size1, size2) {
  const title = `${size1} vs ${size2} Bra Size: Comparison & Fit Guide`;
  const desc = `Compare ${size1} and ${size2} bra sizes side by side — cup volume, band size, fit differences, and which one is right for your measurements.`;
  return buildMetadata({
    title,
    description: desc,
    path: `/compare/${size1.toLowerCase()}-vs-${size2.toLowerCase()}/`,
    type: 'article',
    keywords: [`${size1} vs ${size2}`, `${size1} bra size`, `${size2} bra size`, 'sister size comparison', 'bra size comparison', 'bra fit guide'],
  });
}

function buildRecommendMeta(page) {
  const configs = {
    'best-comfort-bras': {
      title: 'Most Comfortable Bras 2026: Expert-Tested & Reviewed',
      description: 'Discover the most comfortable bras for every size. Our expert review covers wireless, T-shirt, and full-coverage bras for all-day comfort.',
      keywords: ['most comfortable bra', 'comfortable bras', 'best bra for comfort', 'wireless bra', 'soft bra'],
    },
    'best-wireless-bras': {
      title: 'Most Comfortable Wireless Bras 2026: No Underwire, All Support',
      description: 'The most comfortable wireless bras that actually support. Tested for all-day wear, from small to full bust. No digging, no slipping.',
      keywords: ['most comfortable wireless bra', 'wireless bra', 'no underwire bra', 'comfortable wireless bra', 'best wireless bra'],
    },
  };
  const cfg = configs[page] || configs['best-comfort-bras'];
  return buildMetadata({ ...cfg, path: `/${page}/`, type: 'article' });
}

module.exports = { buildMetadata, buildBraSizeGuideMeta, buildCompareMeta, buildSizeCompareMeta, buildRecommendMeta, SITE_NAME, SITE_URL, TAGLINE };