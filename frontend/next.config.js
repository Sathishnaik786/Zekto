/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Disable webpack caching warnings
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  // Enable static optimization
  reactStrictMode: true,
  // Disable image optimization during development
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig; 