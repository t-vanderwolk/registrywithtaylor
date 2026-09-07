import 'server-only';

import { canonicalBrand } from '@/lib/catalog/brandAliases';
import { isExcludedStrollerFinderProduct } from '@/lib/catalog/strollerFinderRules';
import { productModelKey } from '@/lib/catalog/modelIdentity';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';
import { CAR_SEAT_PRODUCT_GROUPS } from '@/lib/data/products/carSeats';
import { STROLLER_PRODUCT_GROUPS } from '@/lib/data/products/strollers';
import type { GuideAffiliateModule } from '@/lib/guides/types';
import prismaBase from '@/lib/server/prisma';
import { TRAVEL_SYSTEM_AFFILIATE_LINKS } from '@/lib/travelSystemAffiliateLinks';
import {
  extractAmazonUrlsFromText,
  isAmazonShortUrl,
  isAmazonUrl,
  parseAmazonAsinFromUrl,
  resolveAmazonShortUrl,
} from '@/lib/server/amazonCreators/url';
import type { AmazonSyncTarget, AmazonSyncTargetSource } from '@/lib/server/amazonCreators/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type ProductRef = { brand: string; productName: string };

type RawTarget = {
  source: AmazonSyncTargetSource;
  sourceId: string;
  surface: AmazonSyncTarget['surface'];
  label: string;
  url: string | null | undefined;
};

type DiscoverOptions = {
  scope: 'blog' | 'all';
  resolveShortLinks?: boolean;
  fetchImpl?: typeof fetch;
};

type CatalogAmazonRow = {
  id: string;
  brand: string | null;
  title: string;
  affiliateUrl: string | null;
  manualAmazonUrl: string | null;
  enrichment: { canonicalBrand: string | null; canonicalName: string | null } | null;
};

function norm(value: string | null | undefined) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function nameMatches(haystack: string, wantName: string): boolean {
  if (!wantName) return false;
  if (new RegExp(`\\b${escapeRegex(wantName)}\\b`).test(haystack)) return true;
  return wantName.length >= 4 && haystack.includes(wantName);
}

function uniqueTargets(targets: RawTarget[]) {
  const seen = new Set<string>();
  return targets.filter((target) => {
    const url = target.url?.trim();
    if (!url || !isAmazonUrl(url)) return false;
    const key = `${target.source}|${target.sourceId}|${url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractAmazonUrlsFromUnknown(value: unknown): string[] {
  if (typeof value === 'string') return extractAmazonUrlsFromText(value);
  if (Array.isArray(value)) return value.flatMap(extractAmazonUrlsFromUnknown);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(extractAmazonUrlsFromUnknown);
  }
  return [];
}

async function withAsins(targets: RawTarget[], options: DiscoverOptions): Promise<AmazonSyncTarget[]> {
  const out: AmazonSyncTarget[] = [];
  const shortLinkResolutions = new Map<string, Promise<string | null>>();
  for (const target of uniqueTargets(targets)) {
    const url = target.url!.trim();
    let asin = parseAmazonAsinFromUrl(url);
    let resolvedUrl: string | null = null;
    let asinSource: AmazonSyncTarget['asinSource'] = asin ? 'direct-url' : 'missing';

    if (!asin && options.resolveShortLinks && isAmazonShortUrl(url)) {
      try {
        let resolution = shortLinkResolutions.get(url);
        if (!resolution) {
          resolution = resolveAmazonShortUrl(url, options.fetchImpl);
          shortLinkResolutions.set(url, resolution);
        }
        resolvedUrl = await resolution;
        asin = parseAmazonAsinFromUrl(resolvedUrl);
        asinSource = asin ? 'short-url' : 'missing';
      } catch {
        asinSource = 'missing';
      }
    }

    out.push({
      ...target,
      url,
      asin,
      resolvedUrl,
      asinSource,
    });
  }
  return out;
}

function addTextTargets(targets: RawTarget[], source: RawTarget['source'], sourceId: string, surface: RawTarget['surface'], label: string, text: string | null | undefined) {
  for (const url of extractAmazonUrlsFromText(text)) {
    targets.push({ source, sourceId, surface, label, url });
  }
}

async function addBlogTargets(targets: RawTarget[], blogProductRefs: ProductRef[]) {
  const posts = (await db.post.findMany({
    where: { status: { not: 'ARCHIVED' } },
    select: { id: true, slug: true, title: true, content: true },
  })) as Array<{ id: string; slug: string; title: string; content: string }>;

  for (const post of posts) {
    addTextTargets(targets, 'blog_content', post.id, 'blog', post.title || post.slug, post.content);
    for (const block of extractStyledBlocks(post.content)) {
      if (block.type !== 'product' && block.type !== 'catalog-product') continue;
      blogProductRefs.push({ brand: block.brand, productName: block.productName });
    }
  }

  const blogLinks = (await db.affiliateLink.findMany({
    where: {
      blogPostId: { not: null },
      OR: [
        { destinationUrl: { contains: 'amazon', mode: 'insensitive' } },
        { destinationUrl: { contains: 'amzn.to', mode: 'insensitive' } },
        { url: { contains: 'amazon', mode: 'insensitive' } },
        { url: { contains: 'amzn.to', mode: 'insensitive' } },
      ],
    },
    select: { id: true, name: true, code: true, destinationUrl: true, url: true },
  })) as Array<{ id: string; name: string | null; code: string | null; destinationUrl: string | null; url: string | null }>;

  for (const link of blogLinks) {
    targets.push({
      source: 'blog_affiliate_link',
      sourceId: link.id,
      surface: 'blog',
      label: link.name ?? link.code ?? link.id,
      url: link.destinationUrl ?? link.url,
    });
  }
}

async function addBlogCatalogAmazonTargets(targets: RawTarget[], refs: ProductRef[]) {
  const pairs = refs.filter((p) => p.brand.trim() && p.productName.trim());
  if (pairs.length === 0) return;

  const brandFilters = Array.from(new Set(pairs.flatMap((p) => [p.brand.trim(), canonicalBrand(p.brand)]).filter(Boolean)));
  const rows = (await db.affiliateCatalogProduct.findMany({
    where: {
      isActiveInFeed: true,
      OR: [
        ...brandFilters.map((brand) => ({ brand: { equals: brand, mode: 'insensitive' } })),
        { manualAmazonUrl: { not: null } },
        { affiliateUrl: { contains: 'amazon', mode: 'insensitive' } },
        { affiliateUrl: { contains: 'amzn.to', mode: 'insensitive' } },
      ],
      NOT: { enrichment: { is: { reviewStatus: 'HIDDEN' } } },
    },
    select: {
      id: true,
      brand: true,
      title: true,
      affiliateUrl: true,
      manualAmazonUrl: true,
      enrichment: { select: { canonicalBrand: true, canonicalName: true } },
    },
  })) as CatalogAmazonRow[];

  const seen = new Set<string>();
  for (const ref of pairs) {
    const wantBrand = canonicalBrand(ref.brand).toLowerCase();
    const wantName = norm(ref.productName);
    if (!wantName) continue;

    const candidates = rows.filter((row) => {
      const rowBrand = canonicalBrand(row.enrichment?.canonicalBrand ?? row.brand ?? '').toLowerCase();
      if (rowBrand !== wantBrand) return false;
      const haystack = norm(`${row.enrichment?.canonicalName ?? ''} ${row.title}`);
      if (!nameMatches(haystack, wantName)) return false;
      return !isExcludedStrollerFinderProduct({ brand: row.brand, title: row.title, affiliateUrl: row.affiliateUrl });
    });

    for (const row of candidates) {
      const url = row.manualAmazonUrl ?? (isAmazonUrl(row.affiliateUrl) ? row.affiliateUrl : null);
      if (!url) continue;
      const key = `${productModelKey(ref.brand, ref.productName)}|${row.id}|${url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      targets.push({
        source: row.manualAmazonUrl ? 'affiliate_catalog_manual_amazon' : 'affiliate_catalog_amazon',
        sourceId: row.id,
        surface: 'blog',
        label: `${ref.brand} ${ref.productName}`,
        url,
      });
    }
  }
}

async function addGuideTargets(targets: RawTarget[]) {
  const guides = (await db.guide.findMany({
    where: { status: { not: 'ARCHIVED' } },
    select: { id: true, slug: true, title: true, content: true, affiliateModules: true },
  })) as Array<{
    id: string;
    slug: string;
    title: string;
    content: string;
    affiliateModules: GuideAffiliateModule[] | unknown;
  }>;

  for (const guide of guides) {
    addTextTargets(targets, 'guide_content', guide.id, 'guide', guide.title || guide.slug, guide.content);
    const moduleUrls = extractAmazonUrlsFromUnknown(guide.affiliateModules);
    for (const url of moduleUrls) {
      targets.push({
        source: 'guide_affiliate_module',
        sourceId: guide.id,
        surface: 'guide',
        label: guide.title || guide.slug,
        url,
      });
    }
  }
}

async function addChecklistTargets(targets: RawTarget[]) {
  const rows = (await db.checklistProduct.findMany({
    select: { id: true, brand: true, product: true, amazonUrl: true },
  })) as Array<{ id: string; brand: string; product: string; amazonUrl: string | null }>;

  for (const row of rows) {
    targets.push({
      source: 'checklist_product',
      sourceId: row.id,
      surface: 'checklist',
      label: `${row.brand} ${row.product}`,
      url: row.amazonUrl,
    });
  }
}

async function addStrollerTargets(targets: RawTarget[]) {
  const rows = (await db.stroller.findMany({
    select: { id: true, brand: true, model: true, amazonUrl: true },
  })) as Array<{ id: string; brand: string; model: string; amazonUrl: string | null }>;

  for (const row of rows) {
    targets.push({
      source: 'stroller',
      sourceId: row.id,
      surface: 'stroller-finder',
      label: `${row.brand} ${row.model}`,
      url: row.amazonUrl,
    });
  }
}

async function addCarSeatTargets(targets: RawTarget[]) {
  const rows = (await db.carSeat.findMany({
    select: { id: true, brand: true, model: true, amazonUrl: true },
  })) as Array<{ id: string; brand: string; model: string; amazonUrl: string | null }>;

  for (const row of rows) {
    targets.push({
      source: 'car_seat',
      sourceId: row.id,
      surface: 'car-seat-finder',
      label: `${row.brand} ${row.model}`,
      url: row.amazonUrl,
    });
  }
}

async function addCatalogTargets(targets: RawTarget[]) {
  const rows = (await db.affiliateCatalogProduct.findMany({
    where: {
      OR: [
        { manualAmazonUrl: { not: null } },
        { affiliateUrl: { contains: 'amazon', mode: 'insensitive' } },
        { affiliateUrl: { contains: 'amzn.to', mode: 'insensitive' } },
      ],
    },
    select: { id: true, brand: true, title: true, affiliateUrl: true, manualAmazonUrl: true },
  })) as Array<{
    id: string;
    brand: string | null;
    title: string;
    affiliateUrl: string | null;
    manualAmazonUrl: string | null;
  }>;

  for (const row of rows) {
    const label = `${row.brand ?? ''} ${row.title}`.trim();
    targets.push({
      source: 'affiliate_catalog_manual_amazon',
      sourceId: row.id,
      surface: 'stroller-finder',
      label,
      url: row.manualAmazonUrl,
    });
    if (isAmazonUrl(row.affiliateUrl)) {
      targets.push({
        source: 'affiliate_catalog_amazon',
        sourceId: row.id,
        surface: 'stroller-finder',
        label,
        url: row.affiliateUrl,
      });
    }
  }
}

async function addCompatibilityAdapterTargets(targets: RawTarget[]) {
  const rows = (await db.compatibility.findMany({
    where: { adapterBabylistUrl: { not: null } },
    select: {
      id: true,
      adapterBabylistUrl: true,
      stroller: { select: { brand: true, model: true } },
      carSeat: { select: { brand: true, model: true } },
    },
  })) as Array<{
    id: string;
    adapterBabylistUrl: string | null;
    stroller: { brand: string; model: string };
    carSeat: { brand: string; model: string };
  }>;

  for (const row of rows) {
    targets.push({
      source: 'compatibility_adapter',
      sourceId: row.id,
      surface: 'travel-system',
      label: `${row.stroller.brand} ${row.stroller.model} adapter for ${row.carSeat.brand} ${row.carSeat.model}`,
      url: row.adapterBabylistUrl,
    });
  }
}

function addStaticTargets(targets: RawTarget[]) {
  for (const [key, links] of Object.entries(TRAVEL_SYSTEM_AFFILIATE_LINKS)) {
    targets.push({
      source: 'static_travel_system_link',
      sourceId: key,
      surface: 'static',
      label: key.replace(':::', ' '),
      url: links.amazonUrl,
    });
  }

  const products = [
    ...Object.values(STROLLER_PRODUCT_GROUPS).flat(),
    ...Object.values(CAR_SEAT_PRODUCT_GROUPS).flat(),
  ] as Array<{ name?: string; brand?: string | null; productName?: string | null; affiliateUrl?: string | null }>;

  for (const product of products) {
    targets.push({
      source: 'static_product_group',
      sourceId: `${product.brand ?? ''}:${product.productName ?? product.name ?? ''}`,
      surface: 'static',
      label: `${product.brand ?? ''} ${product.productName ?? product.name ?? ''}`.trim(),
      url: product.affiliateUrl,
    });
  }
}

export async function discoverAmazonSyncTargets(options: DiscoverOptions): Promise<AmazonSyncTarget[]> {
  const targets: RawTarget[] = [];
  const blogProductRefs: ProductRef[] = [];

  await addBlogTargets(targets, blogProductRefs);
  await addBlogCatalogAmazonTargets(targets, blogProductRefs);

  if (options.scope === 'all') {
    await addGuideTargets(targets);
    await addChecklistTargets(targets);
    await addStrollerTargets(targets);
    await addCarSeatTargets(targets);
    await addCatalogTargets(targets);
    await addCompatibilityAdapterTargets(targets);
    addStaticTargets(targets);
  }

  return withAsins(targets, options);
}
