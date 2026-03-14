/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the classic compiler (Webpack/SWC) instead of Turbopack
  async redirects() {
    return [
      {
        source: '/book',
        destination: '/consultation',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
