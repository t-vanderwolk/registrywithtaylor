/** Add the four user-selected picks only; existing rows are never overwritten.
 * npx tsx scripts/addChecklistPicks20261004.ts --dry-run --report /tmp/picks-plan.json
 * npx tsx scripts/addChecklistPicks20261004.ts --apply --reviewed /tmp/picks-plan.json --report /tmp/picks-result.json
 */
import fs from 'node:fs';
import { isDeepStrictEqual as equal } from 'node:util';
import { PrismaClient } from '@prisma/client';
import source from './data/checklistAdditions-2026-10-04.json';
import { babylistShopMyUrl } from '../lib/affiliateShopMy';
import { checklistItems } from '../lib/checklist/data';
const db = new PrismaClient();
const plain = (v: unknown): any => JSON.parse(JSON.stringify(v));
const args = process.argv.slice(2);
const flag = (key: string) => args.includes(key);
const option = (key: string) => args[args.indexOf(key) + 1];
const apply = flag('--apply');
const report = flag('--report') ? option('--report') : null;
const reviewedPath = flag('--reviewed') ? option('--reviewed') : null;
const allowed = new Set(['--apply', '--dry-run', '--report', '--reviewed']);
for (let n = 0; n < args.length; n++) {
  if (!allowed.has(args[n])) throw new Error(`Unknown option: ${args[n]}`);
  if (['--report', '--reviewed'].includes(args[n])) {
    if (!args[n + 1] || args[n + 1].startsWith('--')) throw new Error('Missing option value');
    n++;
  }
}
if (!report || (apply && (flag('--dry-run') || !reviewedPath || report === reviewedPath))) throw new Error('Provide a report and, for apply, a separate reviewed dry-run report');
function destination(value: string | null | undefined): string {
  try {
    let url = new URL(value ?? '');
    for (let n = 0; n < 3; n++) {
      const nested = url.searchParams.get('u') ?? url.searchParams.get('url');
      if (!nested) break;
      url = new URL(nested);
    }
    return url.origin.replace('://www.', '://') + url.pathname.replace(/\/$/, '');
  } catch { return ''; }
}
async function snapshot(tx: any) {
  return plain({products: await tx.checklistProduct.findMany({orderBy:{id:'asc'}}), items: await tx.checklistItem.findMany({orderBy:{id:'asc'}})});
}
function plan(before: any) {
  const products = source.products.map((p, index) => {
    if (!checklistItems.some(i => i.id === p.checklistItemId)) throw new Error(`Unknown checklist line: ${p.checklistItemId}`);
    const existing = before.products.find((r: any) => r.id === p.id);
    const matches = before.products.filter((r: any) => r.id !== p.id && (
      (r.brand.toLowerCase() === p.brand.toLowerCase() && r.product.toLowerCase() === p.product.toLowerCase()) ||
      [r.affiliateUrl, r.amazonUrl, r.secondaryUrl, ...(Array.isArray(r.retailerLinks) ? r.retailerLinks.map((l: any) => l.url) : [])].some(u => destination(u) === destination(p.destination))
    ));
    if (matches.length) throw new Error(`Duplicate destination or identity: ${p.id}`);
    const babylist = p.priceSource === 'Babylist';
    const data = {
      id:p.id, brand:p.brand, product:p.product, checklistItemId:p.checklistItemId,
      review:'', bestFor:'', standout:p.standout, price:p.price, priceSource:p.priceSource,
      imageUrl:p.imageUrl, affiliateUrl:babylist ? babylistShopMyUrl(p.destination) : 'AFFILIATE_LINK_NEEDED',
      secondaryUrl:babylist ? null : p.destination, secondaryRetailer:babylist ? null : 'Bumble Beez',
      retailer:babylist ? 'Babylist' : 'Bumble Beez', disclosure:babylist, sortOrder:existing?.sortOrder ?? Math.max(0,...before.products.map((r:any)=>r.sortOrder)) + index + 1,
    };
    if (existing && Object.entries(data).some(([k,v])=>!equal(existing[k],v))) throw new Error(`Existing row differs; leave unchanged: ${p.id}`);
    return {data,create:!existing};
  });
  const base = checklistItems.find(i=>i.id==='milk-collectors')!;
  const data = {id:base.id,categoryId:base.category,title:base.title,note:base.note ?? null,timing:base.timing,take:base.take,sortOrder:140,hidden:false,includeVersions:[]};
  const existing = before.items.find((r:any)=>r.id===data.id);
  if (existing && Object.entries(data).some(([k,v])=>!equal(existing[k],v))) throw new Error('Milk collection line changed; review before updating');
  return {products,item:{data,create:!existing}};
}
function verify(before:any, after:any, change:any) {
  for (const table of ['products','items']) {
    for (const row of before[table]) if (!equal(row,after[table].find((r:any)=>r.id===row.id))) throw new Error(`Existing ${table} row changed: ${row.id}`);
    const entries = table==='products' ? change.products : [change.item];
    if (after[table].length !== before[table].length + entries.filter((p:any)=>p.create).length) throw new Error(`Unexpected ${table} count`);
    for (const entry of entries) {
      const actual=after[table].find((r:any)=>r.id===entry.data.id);
      for (const [k,v] of Object.entries(entry.data)) if (!equal(actual?.[k],v)) throw new Error(`Verification failed: ${entry.data.id}.${k}`);
    }
  }
  return {addedProducts:change.products.filter((p:any)=>p.create).length,addedItems:Number(change.item.create),existingRowsUnchanged:true};
}
async function main() {
  const reviewed = apply ? JSON.parse(fs.readFileSync(reviewedPath!, 'utf8')) : null;
  const result = await db.$transaction(async tx=>{
    if (!apply) await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
    const before=await snapshot(tx); const change=plan(before);
    if (!apply) return {mode:'dry-run',before,plan:change};
    if (reviewed.mode!=='dry-run' || !equal(before,reviewed.before) || !equal(change,reviewed.plan)) throw new Error('State or plan changed; run a fresh dry run');
    for (const p of change.products.filter(p=>p.create)) await tx.checklistProduct.create({data:p.data});
    if(change.item.create) await tx.checklistItem.create({data:change.item.data});
    const after=await snapshot(tx);
    return {mode:'applied',before,plan:change,after,verification:verify(before,after,change)};
  },{isolationLevel:apply?'Serializable':'RepeatableRead',timeout:60000});
  if (apply) result.verification=verify(result.before,await snapshot(db),result.plan);
  fs.writeFileSync(report!,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({mode:result.mode,products:result.plan.products.map(p=>({id:p.data.id,product:p.data.product,item:p.data.checklistItemId,action:p.create?'CREATE':'UNCHANGED',url:p.data.secondaryUrl??p.data.affiliateUrl})),milkCollectionLine:result.plan.item.create?'SHOW EXISTING STATIC LINE':'UNCHANGED',verification:result.verification},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
