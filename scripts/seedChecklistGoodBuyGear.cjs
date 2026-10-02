/** Exact, append-only GoodBuy Gear links. Dry run is enforced read-only.
 * node scripts/seedChecklistGoodBuyGear.cjs --dry-run --report /tmp/gbg-plan.json
 * node scripts/seedChecklistGoodBuyGear.cjs --apply --reviewed /tmp/gbg-plan.json --report /tmp/gbg-result.json
 */
const fs = require('node:fs');
const { isDeepStrictEqual: equal } = require('node:util');
const { createHash } = require('node:crypto');
const approved = require('./data/checklistGoodBuyGear-2026-10-02.json').products;
const plain = value => JSON.parse(JSON.stringify(value));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
// Existing GoodBuy Gear Impact deep-link configuration used by setOrbitBabyGoodBuyOffers.ts.
function affiliateUrl(destination) {
  const url = new URL(destination);
  if (url.protocol !== 'https:' || url.hostname !== 'goodbuygear.com' || !url.pathname.startsWith('/products/') || url.username || url.password) throw new Error('Invalid approved destination');
  return `https://goodbuygear.pxf.io/c/6560395/3220593/40600?u=${encodeURIComponent(destination)}&partnerpropertyid=7490466`;
}
function buildPlan(rows, map = approved) {
  return Object.entries(map).map(([id, expected]) => {
    const row = rows.find(r => r.id === id);
    if (!row || ['brand', 'product', 'checklistItemId'].some(k => row[k] !== expected[k])) throw new Error(`Identity mismatch: ${id}`);
    if (row.badge !== 'GoodBuy Gear') throw new Error(`Badge changed: ${id}`);
    if (row.retailerLinks != null && !Array.isArray(row.retailerLinks)) throw new Error(`Malformed retailer links: ${id}`);
    const links = row.retailerLinks ?? [];
    const url = affiliateUrl(expected.url);
    const existing = links.filter(l => /goodbuy/i.test(`${l.retailer} ${l.url}`));
    if (existing.length && (existing.length !== 1 || existing[0].url !== url || existing[0].retailer !== 'GoodBuy Gear')) throw new Error(`Conflicting GoodBuy Gear link: ${id}`);
    if (/goodbuy/i.test(`${row.affiliateUrl} ${row.amazonUrl} ${row.secondaryUrl}`)) throw new Error(`Existing dedicated GoodBuy Gear link: ${id}`);
    const displayOrder = Math.max(links.length, ...links.map(l => Number.isFinite(l.displayOrder) ? l.displayOrder + 1 : 0));
    return { id, brand: row.brand, product: row.product, destination: expected.url, changed: !existing.length,
      retailerLinks: existing.length ? row.retailerLinks : [...links, { retailer: 'GoodBuy Gear', url, preferred: false, displayOrder }] };
  });
}
async function snapshot(db) {
  return plain(await db.checklistProduct.findMany({ orderBy: { id: 'asc' } }));
}
function verify(before, after, plan) {
  const changes = new Map(plan.filter(p => p.changed).map(p => [p.id, p]));
  if (before.length !== after.length) throw new Error('Product count changed');
  for (const row of before) {
    const actual = after.find(r => r.id === row.id);
    const change = changes.get(row.id);
    const expected = change ? { ...row, retailerLinks: change.retailerLinks, updatedAt: actual?.updatedAt } : row;
    if (!equal(expected, actual)) throw new Error(`Unexpected field change: ${row.id}`);
  }
  return { verifiedProducts: before.length, updated: changes.size, onlyFieldsChanged: ['retailerLinks (append only)', 'updatedAt'], allOtherProductFieldsUnchanged: true };
}
async function main(args = process.argv.slice(2)) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run' || arg === '--apply') options[arg] = true;
    else if (arg === '--report' || arg === '--reviewed') {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing ${arg}`);
      options[arg] = args[++i];
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (options['--apply'] && options['--dry-run']) throw new Error('Choose one mode');
  if (!options['--report']) throw new Error('--report is required');
  if (options['--apply'] && (!options['--reviewed'] || options['--reviewed'] === options['--report'])) throw new Error('Separate reviewed dry-run report required');
  const { PrismaClient } = require('@prisma/client');
  const db = new PrismaClient();
  try {
    let result;
    if (!options['--apply']) {
      result = await db.$transaction(async tx => {
        await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
        const before = await snapshot(tx);
        return { mode: 'dry-run', digest: digest(approved), before, plan: buildPlan(before) };
      }, { isolationLevel: 'RepeatableRead', timeout: 30000 });
    } else {
      const reviewed = JSON.parse(fs.readFileSync(options['--reviewed'], 'utf8'));
      if (reviewed.mode !== 'dry-run' || reviewed.digest !== digest(approved)) throw new Error('Reviewed map differs');
      result = await db.$transaction(async tx => {
        const before = await snapshot(tx);
        if (!equal(before, reviewed.before)) throw new Error('Database changed; refresh the dry run');
        const plan = buildPlan(before);
        if (!equal(plan, reviewed.plan)) throw new Error('Reviewed plan differs');
        for (const entry of plan.filter(p => p.changed)) {
          const old = before.find(r => r.id === entry.id);
          const update = await tx.checklistProduct.updateMany({ where: { id: entry.id, updatedAt: new Date(old.updatedAt) }, data: { retailerLinks: entry.retailerLinks } });
          if (update.count !== 1) throw new Error(`Concurrent change: ${entry.id}`);
        }
        const after = await snapshot(tx);
        return { mode: 'applied', before, plan, after, verification: verify(before, after, plan) };
      }, { isolationLevel: 'Serializable', timeout: 60000 });
      result.verification = verify(result.before, await snapshot(db), result.plan);
    }
    fs.writeFileSync(options['--report'], JSON.stringify(result, null, 2) + '\n');
    for (const p of result.plan) console.log(`${p.id} | ${p.brand} ${p.product} | ${p.changed ? 'ADD' : 'UNCHANGED'} | ${p.destination}`);
    console.log(JSON.stringify(result.verification ?? { matched: result.plan.length, adding: result.plan.filter(p => p.changed).length }));
  } finally { await db.$disconnect(); }
}
module.exports = { affiliateUrl, buildPlan, verify };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
