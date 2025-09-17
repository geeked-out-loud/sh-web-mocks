// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // allows production builds to finish even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
