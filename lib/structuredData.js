const { SITE_URL, SITE_NAME } = require('./seoMetadata');

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Science-based breast measurement, bra sizing, and fitting tools — trusted by women worldwide.',
    foundingDate: '2024',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${SITE_URL}/about/`,
    },
    sameAs: [],
  };
}

function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Science-based breast measurement, bra sizing, and fitting tools — trusted by women worldwide.',
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function webApplicationSchema(name, description, url, operatingSystem = 'All') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'HealthApplication',
    operatingSystem,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    browserRequirements: 'Requires JavaScript',
  };
}

function softwareApplicationSchema(name, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

function faqSchema(questions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

function howToSchema({ name, description, steps, tools, supplies, totalTime, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    image: image || `${SITE_URL}/images/og-default.jpg`,
    totalTime: totalTime || 'PT10M',
    ...(tools ? { tool: tools.map(t => ({ '@type': 'HowToTool', name: t })) } : {}),
    ...(supplies ? { supply: supplies.map(s => ({ '@type': 'HowToSupply', name: s })) } : {}),
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
  };
}

function articleSchema({ headline, description, datePublished, dateModified, image, authorName = 'Breast Calculator Team' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: image || `${SITE_URL}/images/og-default.jpg`,
    datePublished: datePublished || '2026-01-01T00:00:00Z',
    dateModified: dateModified || '2026-06-01T00:00:00Z',
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url || `${SITE_URL}${item.path}`,
    })),
  };
}

module.exports = {
  organizationSchema,
  webSiteSchema,
  webApplicationSchema,
  softwareApplicationSchema,
  faqSchema,
  howToSchema,
  articleSchema,
  breadcrumbSchema,
};