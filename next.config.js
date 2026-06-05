/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Note: redirects are NOT configured here because output: 'export' mode
  // ignores them at runtime. Redirects are handled by Cloudflare Pages
  // via the public/_redirects file (copied to out/_redirects at build time).
};

module.exports = nextConfig;
