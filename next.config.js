/**
 * /academy → /learn consolidation redirects.
 *
 * All Academy content — path hubs, standard modules, and submodule branches —
 * now has canonical /learn/* URLs. These 301s preserve SEO equity.
 *
 * Order matters: more-specific patterns (3-segment) must come before
 * the 2-segment wildcard catch-alls so Next.js matches them first.
 */
const academyToLearnRedirects = [
  // ─── Academy home ───────────────────────────────────────────────────────
  { source: '/academy', destination: '/learn', permanent: true },

  // ─── Registry submodule branches (3-segment, before 2-segment catch-all)
  { source: '/academy/registry/welcome-boxes-perks/:platform', destination: '/learn/registry/welcome-boxes-perks/:platform', permanent: true },

  // ─── Registry path hub + standard modules ───────────────────────────────
  { source: '/academy/registry', destination: '/learn/registry', permanent: true },
  { source: '/academy/registry/:module', destination: '/learn/registry/:module', permanent: true },

  // ─── Nursery submodule branches (3-segment) ─────────────────────────────
  { source: '/academy/nursery/furniture-that-actually-works/:category', destination: '/learn/nursery/furniture-that-actually-works/:category', permanent: true },

  // ─── Nursery path hub + standard modules ────────────────────────────────
  { source: '/academy/nursery', destination: '/learn/nursery', permanent: true },
  { source: '/academy/nursery/:module', destination: '/learn/nursery/:module', permanent: true },

  // ─── Gear submodule branches (3-segment) ────────────────────────────────
  { source: '/academy/gear/stroller-foundations/:lane', destination: '/learn/gear/stroller-foundations/:lane', permanent: true },
  { source: '/academy/gear/car-seat-foundations/:category', destination: '/learn/gear/car-seat-foundations/:category', permanent: true },
  { source: '/academy/gear/daily-use-gear/:item', destination: '/learn/gear/daily-use-gear/:item', permanent: true },

  // ─── Gear path hub + standard modules ───────────────────────────────────
  { source: '/academy/gear', destination: '/learn/gear', permanent: true },
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

// When Academy is hidden (launch-phase), every /academy and /guides URL ultimately
// lands on /services. Sending them straight there in one 301 avoids a redirect
// chain (/academy → /learn → /services) that Search Console flags. When Academy is
// re-enabled, the /learn destination redirects above take over to preserve equity.
const academyDisabledFlatten = [
  { source: '/academy', destination: '/services', permanent: true },
  { source: '/academy/:path*', destination: '/services', permanent: true },
  { source: '/guides', destination: '/services', permanent: true },
  { source: '/guides/:path*', destination: '/services', permanent: true },
];

const academyEnabled = process.env.NEXT_PUBLIC_ACADEMY_ENABLED === 'true';

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
      // ─── Canonical host: bare domain → www ───────────────────────────────────
      // www.taylormadebabyco.com is the canonical domain (matches every canonical
      // tag, the sitemap, and OpenGraph). 308-redirect the apex so Google
      // consolidates all indexing signals onto one host instead of splitting them.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'taylormadebabyco.com' }],
        destination: 'https://www.taylormadebabyco.com/:path*',
        permanent: true,
      },
      // While Academy is hidden, collapse every /academy + /guides URL to a
      // single 301 → /services (no /learn hop). When enabled, fall back to the
      // /learn destination redirects that preserve each URL's SEO equity.
      // Academy → Learn must come BEFORE the legacy guide redirects
      // so the more-specific patterns take precedence.
      ...(academyEnabled
        ? [...academyToLearnRedirects, ...academyGuideRedirects]
        : academyDisabledFlatten),
      {
        source: '/blog/untitled-post-5',
        destination: '/blog/nuna-demi-icon-has-arrived',
        permanent: true,
      },
      // ─── Legacy pages no longer at these URLs ────────────────────────────────
      {
        source: '/request-invite',
        destination: '/learn/waitlist',
        permanent: true,
      },
      {
        source: '/experience',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/car-seats-simplified',
        destination: '/learn/gear/car-seat-foundations',
        permanent: true,
      },
      // /consultation funnel retired — all booking goes through /book (Calendly).
      {
        source: '/consultation',
        destination: '/book',
        permanent: true,
      },
      {
        source: '/consultation/:path*',
        destination: '/book',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
