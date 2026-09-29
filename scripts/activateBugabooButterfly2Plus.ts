/** Repair the existing Plus entry without duplicating Butterfly 2. Dry-run by default.
 * Sources verified 2026-09-28:
 * https://www.babylist.com/gp/bugaboo-butterfly-2-plus-stroller/86187/3571867
 * https://www.nordstrom.com/s/bugaboo-butterfly-2-plus/9114247
 * Run: node --import tsx scripts/activateBugabooButterfly2Plus.ts [--apply]
 */
import { PrismaClient } from '@prisma/client';
import { findStrollerSpecSeed } from '../lib/catalog/strollerSpecSeeds';
const db = new PrismaClient();
const babylist = 'https://www.babylist.com/gp/bugaboo-butterfly-2-plus-stroller/86187/3571867';
const nordstrom = 'https://www.nordstrom.com/s/bugaboo-butterfly-2-plus/9114247';
async function main() {
  const plus = await db.affiliateCatalogProduct.findUniqueOrThrow({
    where: { provider_externalId: { provider: 'manual_tmbc', externalId: 'manual-bugaboo-butterfly-2-plus' } },
    include: { enrichment: true },
  });
  if (!plus.imageUrl || !plus.enrichment || plus.title !== 'Bugaboo Butterfly 2 Plus') throw new Error('Unexpected Plus entry; review before applying.');
  const originals = await db.affiliateCatalogProduct.findMany({
    where: { brand: { equals: 'Bugaboo', mode: 'insensitive' }, title: { contains: 'butterfly', mode: 'insensitive' }, enrichment: { is: { tmbcCategory: 'Strollers' } } },
    include: { enrichment: true },
  });
  const hidden = originals.filter(r => !/butterfly\s*(?:2|ii)\b/i.test(r.title)).map(r => r.enrichment!.id);
  const seed = findStrollerSpecSeed('Bugaboo', 'Butterfly 2 Plus')!;
  const { match: _match, summary, ...spec } = seed;
  console.log(JSON.stringify({ mode: process.argv.includes('--apply') ? 'apply' : 'dry-run', plusId: plus.id, originalRowsToKeepHidden: hidden.length, price: 579, babylist, nordstrom, spec }, null, 2));
  if (!process.argv.includes('--apply')) return;
  await db.$transaction(async tx => {
    await tx.productEnrichment.updateMany({ where: { id: { in: hidden } }, data: { reviewStatus: 'HIDDEN', isPublic: false } });
    await tx.affiliateCatalogProduct.update({ where: { id: plus.id }, data: {
      price: 579, productUrl: babylist, affiliateUrl: babylist, isActiveInFeed: true,
      enrichment: { update: { canonicalBrand: 'Bugaboo', canonicalName: 'Butterfly 2 Plus', tmbcCategory: 'Strollers', productType: 'travel stroller', needsReview: false, reviewStatus: 'REVIEWED', isPublic: true } },
    } });
    const existing = await tx.stroller.findUnique({ where: { brand_model: { brand: 'Bugaboo', model: 'Butterfly 2 Plus' } } });
    const links = Array.isArray(existing?.retailerLinks) ? existing.retailerLinks : [];
    const otherLinks = links.filter((r: any) => String(r?.retailer).toLowerCase() !== 'nordstrom');
    const retailerLinks = [...otherLinks, { retailer: 'Nordstrom', url: nordstrom, preferred: false, displayOrder: otherLinks.length }];
    const data = { displayName: 'Bugaboo Butterfly 2 Plus', summary, imageUrl: plus.imageUrl, manualBabylistUrl: babylist, babylistUrl: babylist, babylistPrice: 579, babylistImage: plus.imageUrl, retailerLinks };
    const stroller = await tx.stroller.upsert({
      where: { brand_model: { brand: 'Bugaboo', model: 'Butterfly 2 Plus' } },
      create: { id: 'bugaboo-butterfly-2-plus', brand: 'Bugaboo', model: 'Butterfly 2 Plus', ...data }, update: data,
    });
    await tx.strollerSpec.upsert({ where: { strollerId: stroller.id }, create: { strollerId: stroller.id, ...spec }, update: spec });
  });
  console.log('Applied. Butterfly 2 and all compatibility records were left unchanged.');
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
