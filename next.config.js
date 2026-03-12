/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the classic compiler (Webpack/SWC) instead of Turbopack
  async redirects() {
    return [
      {
        source: '/book',
        destination: '/#journey',
        permanent: true,
      },
      {
        source: '/howitworks',
        destination: '/#journey',
        permanent: true,
      },
      {
        source: '/how-it-works',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
