/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fix for Node 24 / TypeScript worker bug
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {},
  turbopack: {}
};

module.exports = nextConfig;
