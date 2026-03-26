const academyGuideRedirects = [
  {
    source: '/guides',
    destination: '/academy',
    permanent: true,
  },
  {
    source: '/guides/strollers',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/compact-strollers',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/travel-strollers',
    destination: '/academy/gear/travel-systems',
    permanent: true,
  },
  {
    source: '/guides/travel-with-baby',
    destination: '/academy/gear/travel-systems',
    permanent: true,
  },
  {
    source: '/guides/car-seats',
    destination: '/academy/gear/car-seat-foundations',
    permanent: true,
  },
  {
    source: '/guides/infant-car-seats',
    destination: '/guides/car-seats/infant-car-seats',
    permanent: true,
  },
  {
    source: '/guides/convertible-car-seats',
    destination: '/guides/car-seats/convertible-car-seats',
    permanent: true,
  },
  {
    source: '/guides/all-in-one-car-seats',
    destination: '/guides/car-seats/all-in-one-car-seats',
    permanent: true,
  },
  {
    source: '/guides/booster-seats',
    destination: '/guides/car-seats/booster-seats',
    permanent: true,
  },
  {
    source: '/guides/rotating-car-seats',
    destination: '/guides/car-seats/rotating-car-seats',
    permanent: true,
  },
  {
    source: '/guides/travel-lightweight-car-seats',
    destination: '/guides/car-seats/travel-lightweight-car-seats',
    permanent: true,
  },
  {
    source: '/guides/registry',
    destination: '/academy/registry/where-to-register',
    permanent: true,
  },
  {
    source: '/guides/baby-registry',
    destination: '/academy/registry/where-to-register',
    permanent: true,
  },
  {
    source: '/guides/registry/:subSlug',
    destination: '/academy/registry/where-to-register',
    permanent: true,
  },
  {
    source: '/guides/nursery',
    destination: '/academy/nursery/vision-and-lifestyle',
    permanent: true,
  },
  {
    source: '/guides/nursery/sleep-setup',
    destination: '/academy/nursery/sleep-space-decisions',
    permanent: true,
  },
  {
    source: '/guides/nursery/furniture',
    destination: '/academy/nursery/furniture-that-actually-works',
    permanent: true,
  },
  {
    source: '/guides/nursery/changing-station',
    destination: '/academy/nursery/storage-and-organization',
    permanent: true,
  },
  {
    source: '/guides/nursery/storage',
    destination: '/academy/nursery/storage-and-organization',
    permanent: true,
  },
  {
    source: '/academy/registry/vision-and-lifestyle',
    destination: '/academy/registry/where-to-register',
    permanent: true,
  },
  {
    source: '/academy/registry/registry-foundations',
    destination: '/academy/registry/where-to-register',
    permanent: true,
  },
  {
    source: '/academy/nursery/vision-and-lifestyle-foundations',
    destination: '/academy/nursery/vision-and-lifestyle',
    permanent: true,
  },
  {
    source: '/academy/nursery/space-and-flow',
    destination: '/academy/nursery/layout-and-flow',
    permanent: true,
  },
  {
    source: '/academy/nursery/storage-and-stations',
    destination: '/academy/nursery/storage-and-organization',
    permanent: true,
  },
  {
    source: '/academy/gear/car-seat-basics',
    destination: '/academy/gear/car-seat-foundations',
    permanent: true,
  },
  {
    source: '/academy/gear/compact-vs-full-size',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/postpartum',
    destination: '/academy/postpartum/recovery-and-support',
    permanent: true,
  },
  {
    source: '/guides/feeding',
    destination: '/academy/postpartum/feeding-and-home-rhythm',
    permanent: true,
  },
  {
    source: '/guides/essentials',
    destination: '/academy/postpartum/first-weeks-essentials',
    permanent: true,
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use the classic compiler (Webpack/SWC) instead of Turbopack
  async redirects() {
    return [
      ...academyGuideRedirects,
      {
        source: '/book',
        destination: '/consultation',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
