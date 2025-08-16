// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✨ ADD THIS BLOCK
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;