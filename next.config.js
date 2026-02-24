/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the classic compiler (Webpack/SWC) instead of Turbopack
  async redirects() {
    return [
      {
        source: '/book',
        destination: '/how-it-works#step-1',
        permanent: true,
      },
      {
        source: '/howitworks',
        destination: '/how-it-works#step-1',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
