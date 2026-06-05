/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/tools/breast-expansion-calculator',
        destination: '/breast-shape-assessment/',
        permanent: true,
      },
      {
        source: '/tools/breast-expansion-calculator/',
        destination: '/breast-shape-assessment/',
        permanent: true,
      },
      {
        source: '/article/how-to-measure-bra-size-at-home',
        destination: '/how-to-measure-bra-size/',
        permanent: true,
      },
      {
        source: '/article/how-to-measure-bra-size-at-home/',
        destination: '/how-to-measure-bra-size/',
        permanent: true,
      },
      {
        source: '/specials/buying-guide',
        destination: '/bra-buying-guide/',
        permanent: true,
      },
      {
        source: '/specials/buying-guide/',
        destination: '/bra-buying-guide/',
        permanent: true,
      },
      {
        source: '/specials/sports-bra-science',
        destination: '/sports-bra-guide/',
        permanent: true,
      },
      {
        source: '/specials/sports-bra-science/',
        destination: '/sports-bra-guide/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;