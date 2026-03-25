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
    source: '/guides/strollers/compact-strollers',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/strollers/full-size-modular-strollers',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/strollers/convertible-strollers',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/strollers/double-strollers',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/strollers/jogging-strollers',
    destination: '/academy/gear/stroller-foundations',
    permanent: true,
  },
  {
    source: '/guides/strollers/travel-strollers',
    destination: '/academy/gear/travel-systems',
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
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/infant-car-seats',
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/convertible-car-seats',
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/all-in-one-car-seats',
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/booster-seats',
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/rotating-car-seats',
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/travel-lightweight-car-seats',
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/car-seats/:subSlug',
    destination: '/academy/gear/car-seat-basics',
    permanent: true,
  },
  {
    source: '/guides/registry',
    destination: '/academy/nursery/vision-and-lifestyle',
    permanent: true,
  },
  {
    source: '/guides/baby-registry',
    destination: '/academy/nursery/vision-and-lifestyle',
    permanent: true,
  },
  {
    source: '/guides/registry/:subSlug',
    destination: '/academy/nursery/vision-and-lifestyle',
    permanent: true,
  },
  {
    source: '/guides/nursery',
    destination: '/academy/nursery/space-and-flow',
    permanent: true,
  },
  {
    source: '/guides/nursery/sleep-setup',
    destination: '/academy/nursery/space-and-flow',
    permanent: true,
  },
  {
    source: '/guides/nursery/furniture',
    destination: '/academy/nursery/space-and-flow',
    permanent: true,
  },
  {
    source: '/guides/nursery/changing-station',
    destination: '/academy/nursery/storage-and-stations',
    permanent: true,
  },
  {
    source: '/guides/nursery/storage',
    destination: '/academy/nursery/storage-and-stations',
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
  {
    source: '/guides/:slug/:subSlug',
    destination: '/academy',
    permanent: true,
  },
  {
    source: '/guides/:slug',
    destination: '/academy',
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
