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
// The Academy / Learn / Guides were all EDUCATIONAL content, so while hidden they
// 301 to /resources (the current "Know Before You Buy" educational hub) — the
// closest live equivalent — rather than the /services sales page. This also
// scrubs the legacy "Academy / mentor-led / membership / waitlist" positioning
// from Google's index once the Academy env flag is off (see NEXT_PUBLIC_ACADEMY_ENABLED).
const academyDisabledFlatten = [
  { source: '/academy', destination: '/resources', permanent: true },
  { source: '/academy/:path*', destination: '/resources', permanent: true },
  { source: '/guides', destination: '/resources', permanent: true },
  { source: '/guides/:path*', destination: '/resources', permanent: true },
  { source: '/learn', destination: '/resources', permanent: true },
  { source: '/learn/:path*', destination: '/resources', permanent: true },
];

const academyEnabled = process.env.NEXT_PUBLIC_ACADEMY_ENABLED === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Drop the X-Powered-By header (tiny response-size + fingerprint win).
  poweredByHeader: false,
  // Gzip/brotli text responses (HTML/CSS/JS) at the Node layer.
  compress: true,
  experimental: {
    // Inline the above-the-fold critical CSS and defer the rest of the (large,
    // global) stylesheet, instead of loading it all render-blocking. Directly
    // targets PageSpeed's "render-blocking requests" + "reduce unused CSS".
    // Requires the `critters` dependency (added to package.json). Runs at build
    // time only. If the site ever shows a flash of unstyled content, remove this
    // one key to revert.
    optimizeCss: true,
  },
  images: {
    // Serve next-gen formats first; the optimizer falls back to the original
    // for browsers that don't support them. Directly fixes PageSpeed's
    // "Serve images in next-gen formats" audit for every <Image> on the site.
    formats: ['image/avif', 'image/webp'],
    // Cache the optimizer's generated variants for 30 days so repeat requests
    // don't re-encode. (Independent of the browser cache headers below.)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Trim the breakpoint set to the widths this design actually renders at, so
    // the optimizer generates fewer, better-targeted variants.
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  // Long-lived browser caching for self-hosted static assets so repeat visits and
  // Core Web Vitals field data stop re-downloading logos, hero art, and fonts.
  // (Next already hashes + immutably caches /_next/static; this covers /assets.)
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
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
      // ─── Legacy ?type= checklist deep links → path-based variant URLs ────────
      // The Girl/Boy/Twins checklists now live at their own indexable paths.
      // 308-redirect the old query-param deep links so links/indexing consolidate
      // onto the path URLs. (?type=neutral stays on the base page.)
      {
        source: '/resources/baby-checklist',
        has: [{ type: 'query', key: 'type', value: 'girl' }],
        destination: '/resources/baby-checklist/girl',
        permanent: true,
      },
      {
        source: '/resources/baby-checklist',
        has: [{ type: 'query', key: 'type', value: 'boy' }],
        destination: '/resources/baby-checklist/boy',
        permanent: true,
      },
      {
        source: '/resources/baby-checklist',
        has: [{ type: 'query', key: 'type', value: 'twins' }],
        destination: '/resources/baby-checklist/twins',
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
      // ─── Retired standalone pages → their current homes ──────────────────────
      // These URLs 404 today but are still in Google's index ("Crawled – currently
      // not indexed"). 301 them to /services so the equity + any inbound links land
      // on the live page that now carries this content.
      { source: '/how-it-works', destination: '/services', permanent: true },
      { source: '/contact/service-private-concierge', destination: '/services', permanent: true },
      {
        source: '/blog/untitled-post-5',
        destination: '/blog/nuna-demi-icon-has-arrived',
        permanent: true,
      },
      {
        // "slug-" placeholder was left in the published URL. Run
        // scripts/fixNunaTravelCribPostMeta.ts to rename the DB slug, then this
        // 301 catches old inbound links.
        source: '/blog/slug-nuna-travel-crib-showdown-sena-paal-cove',
        destination: '/blog/nuna-travel-crib-showdown-sena-paal-cove',
        permanent: true,
      },
      {
        // Duplicated "blog-blog" prefix on the compact strollers guide. After
        // renaming the DB slug to best-compact-strollers-2026 (in the admin
        // editor), this 301 preserves backlinks/indexing from the old URL.
        source: '/blog/blog-best-compact-strollers-2026',
        destination: '/blog/best-compact-strollers-2026',
        permanent: true,
      },
      {
        // Newborn sleep guide: shorten the long slug to a cleaner, higher-intent
        // URL. After renaming the DB slug to bassinet-vs-crib-vs-pack-and-play
        // (in the admin editor), this 301 preserves the old URL's equity.
        source: '/blog/blog-newborn-sleep-setups-bassinet-crib-pack-and-play',
        destination: '/blog/bassinet-vs-crib-vs-pack-and-play',
        permanent: true,
      },
      // ─── Legacy pages no longer at these URLs ────────────────────────────────
      // Old invite-only / membership / mentor-led positioning is retired. These
      // 301 to the current live equivalent so no legacy URL 404s or lingers.
      {
        source: '/request-invite',
        destination: '/services',
        permanent: true,
      },
      // Old paid "membership" model → the current services page (primary offering
      // is the $75 Registry Strategy Session).
      {
        source: '/membership',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/membership/:path*',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/experience',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/car-seats-simplified',
        destination: '/resources',
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
