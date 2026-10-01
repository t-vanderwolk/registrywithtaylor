const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildPlan, applyReviewed, verify, digest } = require('../enrichChecklistEditorial.cjs');
const row = { id:'specific-xl-2-pack',brand:'Example',product:'Model XL 2 Pack',checklistItemId:'item',badge:null,standout:'',review:'Long review',amazonUrl:'https://amazon.com/exact',price:123,updatedAt:'2026-09-30T00:00:00.000Z' };
const copy = { auditProduct:'Example Model XL 2 Pack',brand:row.brand,product:row.product,checklistItemId:'item',badge:'Approved badge',standout:'Approved short description' };
const products = { [row.id]:copy };
const state = (rows) => ({ products:rows,categories:[],items:[] });
test('only missing badge/standout are targeted; source rows remain untouched',()=>{
 const original=structuredClone(row);const plan=buildPlan([row],products);
 assert.deepEqual(plan.entries[0].changes,{badge:copy.badge,standout:copy.standout});
 assert.deepEqual(row,original);
 assert.equal(plan.counts.productsUpdated,1);
});
test('nonempty editorial fields are preserved; typographic apostrophe is not a content conflict',()=>{
 const p=buildPlan([{...row,badge:"Taylor's Pick",standout:'Existing'}],{[row.id]:{...copy,badge:'Taylor’s Pick'}});
 assert.deepEqual(p.entries[0].changes,{});assert.deepEqual(p.entries[0].conflicts,['standout']);
});
test('different IDs, sizes, generations and assignments cannot match',()=>{
 for(const altered of [{...row,id:'standard-1-pack'},{...row,product:'Model XL 3 Pack'},{...row,brand:'Other'},{...row,checklistItemId:'other'}]){
  const plan=buildPlan([altered],products);assert.equal(plan.counts.unmatched,1);assert.deepEqual(plan.entries[0].changes,{});
 }
});
test('only the explicitly approved Momcozy identity may replace content',()=>{
 const id='amzcc-momcozy-baby-wrap-carrier-2-piece';
 const p=buildPlan([{...row,id,badge:'Old',standout:'Old'}],{[id]:{...copy,allowReplacement:true}});
 assert.equal(p.counts.badgesReplaced,1);assert.equal(p.counts.standoutsReplaced,1);
 const other=buildPlan([{...row,badge:'Old',standout:'Old'}],{[row.id]:{...copy,allowReplacement:true}});
 assert.deepEqual(other.entries[0].changes,{});
});
test('repeating a successful enrichment produces zero changes',()=>{
 const plan=buildPlan([row],products);const second=buildPlan([{...row,...plan.entries[0].changes}],products);
 assert.equal(second.counts.productsUpdated,0);
});
test('verification rejects any review, commerce or structure change',()=>{
 const plan=buildPlan([row],products);const before=state([row]);const after=state([{...row,...plan.entries[0].changes,updatedAt:'2026-09-30T01:00:00.000Z'}]);
 assert.equal(verify(before,after,plan.entries).reviewUnchanged,true);
 for(const change of [{review:'changed'},{amazonUrl:'different'},{price:124},{product:'Other'},{badge:'wrong'}]) assert.throws(()=>verify(before,state([{...after.products[0],...change}]),plan.entries));
 assert.throws(()=>verify(before,{...after,items:[{id:'new'}]},plan.entries));
});
test('stale dry-run and changed approval map stop before the first write',async()=>{
 let writes=0;const tx={checklistProduct:{findMany:async()=>[{...row,review:'concurrent edit'}],updateMany:async()=>{writes++;return {count:1};}},checklistCategory:{findMany:async()=>[]},checklistItem:{findMany:async()=>[]}};
 const db={$transaction:async(fn)=>fn(tx)};
 const reviewed={mode:'dry-run',mapDigest:digest(products),snapshot:state([row]),plan:buildPlan([row],products)};
 await assert.rejects(applyReviewed(db,reviewed,products),/Database changed/);
 await assert.rejects(applyReviewed(db,{...reviewed,mapDigest:'wrong'},products),/matching reviewed/);
 assert.equal(writes,0);
});
test('apply uses the reviewed exact ID and only badge/standout, then re-queries',async()=>{
 let current=structuredClone(row);const writes=[];
 const tx={checklistProduct:{findMany:async()=>[current],updateMany:async(args)=>{writes.push(args);current={...current,...args.data};return {count:1};}},checklistCategory:{findMany:async()=>[]},checklistItem:{findMany:async()=>[]}};
 const db={$transaction:async(fn)=>fn(tx)};
 const reviewed={mode:'dry-run',mapDigest:digest(products),snapshot:state([row]),plan:buildPlan([row],products)};
 const result=await applyReviewed(db,reviewed,products);
 assert.equal(writes.length,1);assert.equal(writes[0].where.id,row.id);assert.deepEqual(Object.keys(writes[0].data),['badge','standout']);assert.equal(result.verification.commerceUnchanged,true);
});
