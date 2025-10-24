/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
    scrollRestoration: true,
    serverActions: true,
    optimizePackageImports: ['antd'],
  },
  images: {
    unoptimized: true,
    domains: [
      'storage.googleapis.com',
      'coinpayments.net',
      'images.pexels.com',
      'sd-ecom.s3.ap-southeast-1.amazonaws.com',
      'pmh-domdom-media.s3.ap-southeast-1.amazonaws.com',
    ],
    minimumCacheTTL: 1500000,
  },
};
const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts',
);

module.exports = withNextIntl(nextConfig);
