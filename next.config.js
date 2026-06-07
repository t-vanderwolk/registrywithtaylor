/**
 * /academy → /learn consolidation redirects.
 *
 * Standard modules and path hubs now live under /learn.
 * Submodule branch pages (stroller lanes, car seat categories, nursery
 * furniture subcategories, welcome box platforms, daily-use gear items)
 * stay at /academy/* for now — they don't yet have /learn/* equivalents.
 * Those will be added when the full /learn/[path]/[module]/[submodule]
 * route layer is built.
 */
const academyToLearnRedirects = [
  // ─── Academy home ───────────────────────────────────────────────────────
  { source: '/academy', destination: '/learn', permanent: true },

  // ─── Registry ───────────────────────────────────────────────────────────
  { source: '/academy/registry', destination: '/learn/registry', permanent: true },
  // welcome-boxes-perks hub IS a standard module slug → safe to redirect
  // welcome-boxes-perks/:platform submodules stay at /academy/* (no /learn route yet)
  { source: '/academy/registry/:module', destination: '/learn/registry/:module', permanent: true },

  // ─── Nursery ────────────────────────────────────────────────────────────
  { source: '/academy/nursery', destination: '/learn/nursery', permanent: true },
  // furniture-that-actually-works hub IS a standard module slug → safe to redirect
  // furniture-that-actually-works/:category submodules stay at /academy/*
  { source: '/academy/nursery/:module', destination: '/learn/nursery/:module', permanent: true },

  // ─── Gear ───────────────────────────────────────────────────────────────
  { source: '/academy/gear', destination: '/learn/gear', permanent: true },
  // Hub modules (stroller-foundations, car-seat-foundations, daily-use-gear,
  // feeding-setup-flow) ARE standard module slugs → safe to redirect.
  // Their child pages (/:lane, /:category, /:item) stay at /academy/* for now.
  { source: '/academy/gear/:module', destination: '/learn/gear/:module', permanent: true },

  // ─── Postpartum ─────────────────────────────────────────────────────────
  { source: '/academy/postpartum', destination: '/learn/postpartum', permanent: true },
  { source: '/academy/postpartum/:module', destination: '/learn/postpartum/:module', permanent: true },

  // ─── Case studies stay at /academy/case-studies for now ─────────────────
];

const academyGuideRedirects = [
  // Guides → Learn (canonical destinations now under /learn)
  { source: '/guides', destination: '/learn', permanent: true },
  { source: '/guides/strollers', destination: '/learn/gear/stroller-foundations', permanent: true },
  { source: '/guides/compact-strollers', destination: '/learn/gear/stroller-foundations', permanent: true },
  { source: '/guides/travel-strollers', destination: '/learn/gear/travel-systems', permanent: true },
  { source: '/guides/travel-with-baby', destination: '/learn/gear/travel-systems', permanent: true },
  { source: '/guides/car-seats', destination: '/learn/gear/car-seat-foundations', permanent: true },
  { source: '/guides/infant-car-seats', destination: '/learn/gear/car-seat-foundations/infant-car-seats', permanent: true },
  { source: '/guides/convertible-car-seats', destination: '/learn/gear/car-seat-foundations/convertible-car-seats', permanent: true },
  { source: '/guides/all-in-one-car-seats', destination: '/learn/gear/car-seat-foundations/all-in-one-car-seats', permanent: true },
  { source: '/guides/booster-seats', destination: '/learn/gear/car-seat-foundations/booster-seats', permanent: true },
  { source: '/guides/rotating-car-seats', destination: '/learn/gear/car-seat-foundations/rotating-car-seats', permanent: true },
  { source: '/guides/travel-lightweight-car-seats', destination: '/learn/gear/car-seat-foundations/travel-lightweight-car-seats', permanent: true },
  { source: '/guides/registry', destination: '/learn/registry/where-to-register', permanent: true },
  { source: '/guides/baby-registry', destination: '/learn/registry/where-to-register', permanent: true },
  { source: '/guides/registry/:subSlug', destination: '/learn/registry/where-to-register', permanent: true },
  { source: '/guides/nursery', destination: '/learn/nursery/vision-and-lifestyle', permanent: true },
  { source: '/guides/nursery/sleep-setup', destination: '/learn/nursery/sleep-space-decisions', permanent: true },
  { source: '/guides/nursery/furniture', destination: '/learn/nursery/furniture-that-actually-works', permanent: true },
  { source: '/guides/nursery/changing-station', destination: '/learn/nursery/storage-and-organization', permanent: true },
  { source: '/guides/nursery/storage', destination: '/learn/nursery/storage-and-organization', permanent: true },
  { source: '/guides/postpartum', destination: '/learn/postpartum/healing-and-recovery', permanent: true },
  { source: '/guides/feeding', destination: '/learn/postpartum/feeding-and-lactation', permanent: true },
  { source: '/guides/essentials', destination: '/learn', permanent: true },

  // Legacy /academy slug aliases that predate the current taxonomy
  { source: '/academy/registry/vision-and-lifestyle', destination: '/learn/registry/where-to-register', permanent: true },
  { source: '/academy/registry/registry-foundations', destination: '/learn/registry/where-to-register', permanent: true },
  { source: '/academy/nursery/vision-and-lifestyle-foundations', destination: '/learn/nursery/vision-and-lifestyle', permanent: true },
  { source: '/academy/nursery/space-and-flow', destination: '/learn/nursery/layout-and-flow', permanent: true },
  { source: '/academy/nursery/storage-and-stations', destination: '/learn/nursery/storage-and-organization', permanent: true },
  { source: '/academy/gear/car-seat-basics', destination: '/learn/gear/car-seat-foundations', permanent: true },
  { source: '/academy/gear/compact-vs-full-size', destination: '/learn/gear/stroller-foundations', permanent: true },
  { source: '/academy/postpartum/recovery-and-support', destination: '/learn/postpartum/healing-and-recovery', permanent: true },
  { source: '/academy/postpartum/feeding-and-home-rhythm', destination: '/learn/postpartum/feeding-and-lactation', permanent: true },
  { source: '/academy/postpartum/first-weeks-essentials', destination: '/learn', permanent: true },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow any external HTTPS image source.
    // This site references affiliate product images, blog embeds, partner logos,
    // and editorial images from many different CDNs — enumerating every hostname
    // isn't sustainable for a content/affiliate platform.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Use the classic compiler (Webpack/SWC) instead of Turbopack
  async redirects() {
    return [
      // Academy → Learn must come BEFORE the legacy guide redirects
      // so the more-specific patterns take precedence.
      ...academyToLearnRedirects,
      // Guide → Learn (updated from old guide → academy destinations)
      ...academyGuideRedirects,
      {
        source: '/blog/untitled-post-5',
        destination: '/blog/nuna-demi-icon-has-arrived',
        permanent: true,
      },
      {
        source: '/book',
        destination: '/consultation',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
