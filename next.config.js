/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fix for Node 24 / TypeScript worker bug
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {},
  turbopack: {},

  // Ensure messages and config are included in the build
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  }
};

module.exports = nextConfig;
