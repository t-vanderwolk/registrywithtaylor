/**
 * Append verified Nordstrom destinations to existing car seat records only.
 * Defaults to dry run. Use --apply to seed; --backup=<path> chooses the rollback snapshot.
 * Infant finder and travel-system tools read CarSeat.retailerLinks.
 * Does not touch checklist products, blog posts, prices, or primary affiliate URLs.
 * Matches and verification dates are recorded in the reviewed manifest.
 * Example: node scripts/seedNordstromCarSeatLinks.cjs --manifest=reports/nordstrom/infant-car-seat-seed-2026-09-28.json --apply
 */
const { PrismaClient } = require('@prisma/client');
const { writeFileSync, mkdirSync } = require('node:fs');
const { dirname, resolve } = require('node:path');
const db = new PrismaClient();
const manifestPath = process.argv.find(arg=>arg.startsWith('--manifest='))?.slice(11);
if (!manifestPath) throw new Error('Provide --manifest=<reviewed JSON file>');
const manifest = JSON.parse(require('node:fs').readFileSync(manifestPath,'utf8'));
const normalize = value => value.trim().toLowerCase();
const key = (brand,model) => `${normalize(brand)}|${normalize(model)}`;
const mapping = new Map(manifest.matches.map(item => [key(item.brand,item.model),item.url]));
if (mapping.size !== manifest.matches.length) throw new Error('Duplicate model in manifest');
for (const item of manifest.matches) {
  const parsed = new URL(item.url);
  if (parsed.origin !== 'https://www.nordstrom.com' || !/^\/s\/[^/]+\/\d+$/.test(parsed.pathname) || parsed.search) throw new Error('Invalid Nordstrom URL');
}
function destination(url) {
  try {
    const parsed = new URL(url);
    return ['shopmy.us','go.shopmy.us'].includes(parsed.hostname) && parsed.searchParams.get('url')
      ? new URL(parsed.searchParams.get('url')) : parsed;
  } catch { return null; }
}
async function main() {
  const brands = [...new Set(manifest.matches.map(item=>item.brand))];
  const rows = await db.carSeat.findMany({where:{seatType:'INFANT',OR:brands.map(brand=>({brand:{equals:brand,mode:'insensitive'}}))},orderBy:[{brand:'asc'},{model:'asc'}]});
  for (const item of manifest.matches) {
    if (!rows.some(row => row.id === item.id && key(row.brand,row.model) === key(item.brand,item.model))) throw new Error(`Missing model: ${item.brand} ${item.model}`);
  }
  const changes = [];
  for (const row of rows) {
    const url = mapping.get(key(row.brand,row.model));
    if (!url) continue;
    if (!manifest.matches.some(item => item.id === row.id && key(item.brand,item.model) === key(row.brand,row.model))) throw new Error(`Unreviewed seat ID: ${row.id}`);
    if (row.retailerLinks != null && !Array.isArray(row.retailerLinks)) throw new Error(`Unexpected retailerLinks: ${row.id}`);
    const existing = row.retailerLinks ?? [];
    const nordstrom = existing.filter(link => normalize(link.retailer ?? '') === 'nordstrom' || /(^|\.)nordstrom\.com$/.test(destination(link.url)?.hostname ?? ''));
    if (nordstrom.length) {
      if (nordstrom.length !== 1 || destination(nordstrom[0].url)?.pathname.replace(/\/$/,'') !== new URL(url).pathname) throw new Error(`Existing Nordstrom conflict: ${row.model}`);
      continue;
    }
    if (existing.length >= 5) throw new Error(`Retailer capacity reached: ${row.model}`);
    changes.push({row, next:[...existing,{retailer:'Nordstrom',url,preferred:false}]});
  }
  console.log(JSON.stringify({mode:process.argv.includes('--apply')?'apply':'dry-run',changes:changes.map(({row,next})=>({id:row.id,brand:row.brand,model:row.model,url:next.at(-1).url,retailers:next.map(link=>link.retailer)})),unchanged:rows.length-changes.length},null,2));
  if (!process.argv.includes('--apply') || !changes.length) return;
  const backupArg = process.argv.find(arg=>arg.startsWith('--backup='));
  const backup = resolve(backupArg?.slice(9) || `reports/nordstrom/carseats-before-${Date.now()}.json`);
  mkdirSync(dirname(backup),{recursive:true});
  writeFileSync(backup,JSON.stringify(changes.map(({row})=>row),null,2),{flag:'wx'});
  await db.$transaction(async tx=>{
    for (const {row,next} of changes) {
      const current = await tx.carSeat.findUnique({where:{id:row.id}});
      if (!current || current.updatedAt.getTime()!==row.updatedAt.getTime() || JSON.stringify(current.retailerLinks)!==JSON.stringify(row.retailerLinks)) throw new Error(`Concurrent edit: ${row.model}`);
      const result = await tx.carSeat.updateMany({where:{id:row.id,brand:row.brand,model:row.model,updatedAt:row.updatedAt},data:{retailerLinks:next}});
      if (result.count!==1) throw new Error(`Concurrent edit: ${row.model}`);
    }
  },{isolationLevel:'Serializable',timeout:120000});
  console.log(`Applied ${changes.length} car seat updates. Backup: ${backup}`);
}
main().catch(error=>{console.error(error.message);process.exitCode=1}).finally(()=>db.$disconnect());
