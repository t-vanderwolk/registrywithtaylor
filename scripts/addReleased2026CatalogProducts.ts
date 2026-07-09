/**
 * Add every product covered in "baby-gear-released-2026-so-far" to the catalogue
 * so the blog cards get prices + compatibility links.
 *
 * It parses each `## ⭐ <Brand Model>` section, classifies it by the parent
 * category header (Full-Size / Compact / Travel Strollers → stroller; Car Seats →
 * car seat; Accessories / Nursery / Bottle Washers → other), and reads the hero
 * image + affiliate links straight from the post (nothing hard-coded).
 *
 * Then, idempotently:
 *   • Stroller  → ensure a PUBLIC stroller-catalog entry: promote an existing
 *                 Babylist/MacroBaby feed row to public "Strollers", else add a
 *                 manual_tmbc product + enrichment using the post's link + image.
 *                 (Run `npm run strollers:import` after to build Stroller rows.)
 *   • Car seat  → ensure a CarSeat row (brand+model, INFANT) with the post's
 *                 Babylist/Amazon link + image, so the checker + "compatible
 *                 strollers" link resolve.
 *   • Other     → add a manual_tmbc catalogue row flagged needs-review (not auto
 *                 surfaced) so Taylor can categorise it.
 *
 * A product that already exists is reported and skipped — safe to re-run.
 *
 *   npx tsx scripts/addReleased2026CatalogProducts.ts            # dry run (report)
 *   npx tsx scripts/addReleased2026CatalogProducts.ts --apply
 *
 *   DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" \
 *     PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" \
 *     npx tsx scripts/addReleased2026CatalogProducts.ts --apply
 */
import prismaBase from '@/lib/server/prisma';
import { extractStoredCtaButtons, parseCtaSlotLine, type CtaButton } from '@/lib/blog/ctaButtons';
import { canonicalBrand } from '@/lib/catalog/brandAliases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;
const SLUG = 'baby-gear-released-2026-so-far';
const APPLY = process.argv.includes('--apply');
const MANUAL = 'manual_tmbc';

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/;
const MD_LINK = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
const IMAGE_HOST_OR_EXT = /(media-amazon|images-amazon|gstatic|\.(?:jpg|jpeg|png|webp|gif|svg)(?:$|\?))/i;
const NEWS_HEADING = /officially|launches|enters the|\bu\.?s\.?\s+market\b|now available|arrives in/i;
const MULTI_WORD_BRANDS = ['Silver Cross', 'Orbit Baby', 'Peg Perego', 'Jool Baby', 'Mercedes Baby', 'Baby Jogger'];

type LinkKind = 'babylist' | 'amazon' | 'macrobaby' | 'shop';
type Category = 'stroller' | 'carseat' | 'other';

type Product = {
  brand: string;
  model: string;
  category: Category;
  productType: string; // stroller sub-type / other tmbcCategory hint
  imageUrl: string | null;
  links: Partial<Record<LinkKind, string>>;
  shopRetailer: string | null;
};

const norm = (v: string | null | undefined) =>
  (v ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

const isImageUrl = (url: string) => IMAGE_HOST_OR_EXT.test(url);
function classifyUrl(url: string): LinkKind | null {
  if (isImageUrl(url)) return null;
  const u = url.toLowerCase();
  if (u.includes('babylist')) return 'babylist';
  if (u.includes('amzn.to') || /amazon\.[a-z.]+\//.test(u)) return 'amazon';
  if (u.includes('macrobaby.com')) return 'macrobaby';
  return null;
}
const retailerFromLabel = (l?: string) =>
  l ? l.replace(/^(shop|explore|buy(?:\s+on)?|add to|view(?:\s+on)?|get)\s+/i, '').trim() || null : null;

function headingTitle(line: string) {
  return line.replace(/^##\s+/, '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
}
function splitBrandProduct(title: string): { brand: string; product: string } {
  for (const brand of MULTI_WORD_BRANDS) {
    if (title.toLowerCase().startsWith(brand.toLowerCase())) return { brand, product: title.slice(brand.length).trim() || title };
  }
  const parts = title.split(/\s+/);
  return { brand: parts[0] ?? title, product: parts.slice(1).join(' ') || title };
}

/** Classify a `## <emoji> <text>` category header. Returns null for prose headers. */
function classifyCategoryHeader(title: string): { category: Category | 'skip'; productType: string } | null {
  if (/car\s*seat/i.test(title)) return { category: 'carseat', productType: 'infant car seat' };
  if (/stroller/i.test(title)) {
    if (/full[-\s]?size/i.test(title)) return { category: 'stroller', productType: 'full-size stroller' };
    return { category: 'stroller', productType: 'compact stroller' }; // mid-size / compact / travel
  }
  if (/accessor/i.test(title)) return { category: 'other', productType: 'Travel Systems & Adapters' };
  if (/nursery|living/i.test(title)) return { category: 'other', productType: 'Nursery' };
  if (/bottle\s*washer|feeding/i.test(title)) return { category: 'other', productType: 'Feeding' };
  if (/industry\s*news/i.test(title)) return { category: 'skip', productType: '' };
  return null; // not a category header (intro / trend prose)
}

function sectionEnd(lines: string[], headingIndex: number) {
  let end = headingIndex + 1;
  while (end < lines.length) {
    const t = lines[end]?.trim() ?? '';
    if (t.startsWith('## ') && !t.startsWith('### ')) break;
    end += 1;
  }
  return end;
}

/** Pure parse (no DB) — unit-testable. */
export function parseReleased2026Products(content: string): Product[] {
  const stored = extractStoredCtaButtons(content ?? '');
  const buttonById = new Map<string, CtaButton>(stored.buttons.map((b) => [b.id, b]));
  const lines = stored.body.split('\n');

  const products: Product[] = [];
  let current: { category: Category | 'skip'; productType: string } | null = null;

  for (let idx = 0; idx < lines.length; idx += 1) {
    const trimmed = lines[idx].trim();
    if (!/^##\s/.test(trimmed) || trimmed.startsWith('### ')) continue;
    const title = headingTitle(lines[idx]);

    if (!trimmed.includes('⭐')) {
      const cat = classifyCategoryHeader(title);
      if (cat) current = cat; // only real category headers switch context
      continue;
    }

    // Product section.
    if (!current || current.category === 'skip' || NEWS_HEADING.test(title)) continue;
    const end = sectionEnd(lines, idx);

    let imageUrl: string | null = null;
    const links: Partial<Record<LinkKind, string>> = {};
    let shopRetailer: string | null = null;
    const addLink = (url: string, label?: string) => {
      const kind = classifyUrl(url);
      if (kind) {
        if (!links[kind]) links[kind] = url;
      } else if (!links.shop) {
        links.shop = url;
        shopRetailer = retailerFromLabel(label);
      }
    };

    for (let i = idx + 1; i < end; i += 1) {
      const raw = lines[i] ?? '';
      const t = raw.trim();
      const img = t.match(IMAGE_LINE);
      if (img) { if (!imageUrl) imageUrl = img[1]; continue; }

      const slotId = parseCtaSlotLine(t);
      if (slotId) { const b = buttonById.get(slotId); if (b) addLink(b.url, b.label); continue; }

      MD_LINK.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = MD_LINK.exec(raw)) !== null) {
        if (m[1] === '!') continue;
        if (classifyUrl(m[3])) addLink(m[3]);
      }
    }

    const { brand, product } = splitBrandProduct(title);
    products.push({
      brand,
      model: product,
      category: current.category,
      productType: current.productType,
      imageUrl,
      links,
      shopRetailer,
    });
  }

  return products;
}

const preferredLink = (p: Product) => p.links.babylist ?? p.links.macrobaby ?? p.links.amazon ?? p.links.shop ?? null;
const retailerFor = (p: Product) =>
  p.links.babylist ? 'Babylist' : p.links.macrobaby ? 'MacroBaby' : p.links.amazon ? 'Amazon' : p.shopRetailer ?? 'Shop';
const externalIdFor = (p: Product) => `released2026-${norm(`${p.brand} ${p.model}`).replace(/\s+/g, '-')}`;

async function upsertCatalog(p: Product, tmbcCategory: string, isPublic: boolean, productType: string) {
  const raw = await db.affiliateCatalogProduct.upsert({
    where: { provider_externalId: { provider: MANUAL, externalId: externalIdFor(p) } },
    update: {
      brand: p.brand,
      title: `${p.brand} ${p.model}`,
      affiliateUrl: preferredLink(p),
      imageUrl: p.imageUrl,
      retailer: retailerFor(p),
      isActiveInFeed: true,
      lastSyncedAt: new Date(),
    },
    create: {
      provider: MANUAL,
      externalId: externalIdFor(p),
      brand: p.brand,
      title: `${p.brand} ${p.model}`,
      affiliateUrl: preferredLink(p),
      imageUrl: p.imageUrl,
      retailer: retailerFor(p),
      isActiveInFeed: true,
    },
    select: { id: true },
  });
  await db.productEnrichment.upsert({
    where: { rawProductId: raw.id },
    update: {
      canonicalBrand: p.brand,
      tmbcCategory,
      productType,
      isPublic,
      needsReview: !isPublic,
      reviewStatus: isPublic ? 'REVIEWED' : 'AUTO_CATEGORIZED',
    },
    create: {
      rawProductId: raw.id,
      canonicalBrand: p.brand,
      tmbcCategory,
      productType,
      isPublic,
      needsReview: !isPublic,
      reviewStatus: isPublic ? 'REVIEWED' : 'AUTO_CATEGORIZED',
    },
  });
}

type CatRow = {
  id: string;
  provider: string;
  brand: string | null;
  title: string;
  enrichment: { id: string; tmbcCategory: string | null; reviewStatus: string | null; isPublic: boolean | null } | null;
};

async function main() {
  const post = await db.post.findFirst({ where: { slug: SLUG }, select: { content: true, title: true } });
  if (!post) {
    console.error(`✗ Post not found for slug "${SLUG}".`);
    process.exit(1);
  }
  const products = parseReleased2026Products(post.content ?? '');
  console.log(`── Add missing 2026 products ──  (${APPLY ? 'APPLY' : 'dry-run'})`);
  console.log(`Parsed ${products.length} product(s) from "${post.title}".\n`);

  // Pre-load catalog rows for all brands, plus all infant car seats.
  const brands = Array.from(new Set(products.flatMap((p) => [p.brand, canonicalBrand(p.brand)])));
  const catalog: CatRow[] = await db.affiliateCatalogProduct.findMany({
    where: { OR: brands.map((b) => ({ brand: { equals: b, mode: 'insensitive' } })) },
    select: {
      id: true, provider: true, brand: true, title: true,
      enrichment: { select: { id: true, tmbcCategory: true, reviewStatus: true, isPublic: true } },
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const carSeats: Array<{ brand: string; model: string }> = await db.carSeat.findMany({ select: { brand: true, model: true } });

  const matchRows = (p: Product) => {
    const wantBrand = canonicalBrand(p.brand).toLowerCase();
    const wantModel = norm(p.model);
    return catalog.filter(
      (r) => canonicalBrand(r.brand ?? '').toLowerCase() === wantBrand && norm(r.title).includes(wantModel),
    );
  };

  const summary = { publicOk: 0, promoted: 0, addedStroller: 0, addedCarSeat: 0, carSeatExists: 0, addedOther: 0 };

  for (const p of products) {
    const label = `${p.brand} ${p.model}`.padEnd(34);

    if (p.category === 'stroller') {
      const rows = matchRows(p);
      const publicRow = rows.find(
        (r) => r.enrichment?.tmbcCategory === 'Strollers' && r.enrichment?.reviewStatus !== 'HIDDEN' && r.enrichment?.isPublic,
      );
      if (publicRow) {
        console.log(`  [stroller] ${label} already public ✓`);
        summary.publicOk += 1;
        continue;
      }
      const feedRow = rows.find((r) => r.provider === 'babylist_impact' || r.provider === 'shopify_macrobaby');
      if (feedRow) {
        console.log(`  [stroller] ${label} ${APPLY ? 'PROMOTED' : 'would promote'} feed row → public Strollers`);
        if (APPLY) {
          await db.productEnrichment.upsert({
            where: { rawProductId: feedRow.id },
            update: { tmbcCategory: 'Strollers', productType: p.productType, isPublic: true, needsReview: false, reviewStatus: 'REVIEWED' },
            create: { rawProductId: feedRow.id, tmbcCategory: 'Strollers', productType: p.productType, isPublic: true, needsReview: false, reviewStatus: 'REVIEWED' },
          });
        }
        summary.promoted += 1;
        continue;
      }
      console.log(`  [stroller] ${label} ${APPLY ? 'ADDED' : 'would add'} manual_tmbc (${retailerFor(p)})`);
      if (APPLY) await upsertCatalog(p, 'Strollers', true, p.productType);
      summary.addedStroller += 1;
      continue;
    }

    if (p.category === 'carseat') {
      const exists = carSeats.some(
        (c) => canonicalBrand(c.brand).toLowerCase() === canonicalBrand(p.brand).toLowerCase() && norm(c.model) === norm(p.model),
      );
      if (exists) {
        console.log(`  [carseat]  ${label} already in CarSeat table ✓`);
        summary.carSeatExists += 1;
        continue;
      }
      console.log(`  [carseat]  ${label} ${APPLY ? 'ADDED' : 'would add'} CarSeat row (INFANT, ${retailerFor(p)})`);
      if (APPLY) {
        await db.carSeat.upsert({
          where: { brand_model: { brand: p.brand, model: p.model } },
          update: {
            seatType: 'INFANT',
            displayName: `${p.brand} ${p.model}`,
            babylistUrl: p.links.babylist ?? undefined,
            babylistImage: p.imageUrl ?? undefined,
            amazonUrl: p.links.amazon ?? undefined,
          },
          create: {
            brand: p.brand,
            model: p.model,
            displayName: `${p.brand} ${p.model}`,
            seatType: 'INFANT',
            babylistUrl: p.links.babylist ?? null,
            babylistImage: p.imageUrl ?? null,
            amazonUrl: p.links.amazon ?? null,
          },
        });
      }
      summary.addedCarSeat += 1;
      continue;
    }

    // other (accessories / nursery / bottle washers): catalogue row, needs review.
    console.log(`  [other]    ${label} ${APPLY ? 'ADDED' : 'would add'} needs-review catalogue row (${p.productType})`);
    if (APPLY) await upsertCatalog(p, p.productType, false, p.productType);
    summary.addedOther += 1;
  }

  console.log('\n════════════════════════════════════════');
  console.log(
    `Strollers: ${summary.publicOk} already public, ${summary.promoted} promoted, ${summary.addedStroller} added.\n` +
      `Car seats: ${summary.carSeatExists} existing, ${summary.addedCarSeat} added.\n` +
      `Other:     ${summary.addedOther} added (needs review).`,
  );
  if (!APPLY) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply.');
  } else {
    console.log('\n✓ Applied. Next: `npm run strollers:import` to build Stroller rows for the new strollers.');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect?.();
  });
