const { test } = require('node:test');
const assert = require('node:assert/strict');
const { affiliateUrl, buildPlan, verify } = require('../seedChecklistGoodBuyGear.cjs');
const map = { exact: { brand: 'Brand', product: 'Model 2', checklistItemId: 'crib', url: 'https://goodbuygear.com/products/exact?color=grey' } };
const row = { id: 'exact', brand: 'Brand', product: 'Model 2', checklistItemId: 'crib', badge: 'GoodBuy Gear', review: 'Keep', price: 200, updatedAt: '2026-10-02', retailerLinks: [{ retailer: 'Amazon', url: 'https://amzn.to/exact', preferred: true, displayOrder: 4, custom: 'keep' }] };
test('appends tracked destination without changing existing links; second run is a no-op', () => {
  const before = JSON.stringify(row);
  const plan = buildPlan([row], map);
  assert.equal(JSON.stringify(row), before);
  assert.deepEqual(plan[0].retailerLinks[0], row.retailerLinks[0]);
  assert.equal(plan[0].retailerLinks[1].displayOrder, 5);
  assert.equal(new URL(plan[0].retailerLinks[1].url).searchParams.get('u'), map.exact.url);
  assert.equal(buildPlan([{ ...row, retailerLinks: plan[0].retailerLinks }], map)[0].changed, false);
});
test('refuses wrong generation, changed assignment, changed badge and conflicting GBG link', () => {
  for (const patch of [{product:'Model 3'}, {checklistItemId:'bassinet'}, {badge:"Taylor's Pick"}, {retailerLinks:[{retailer:'GoodBuy Gear',url:'https://goodbuygear.com/products/other'}]}]) {
    assert.throws(() => buildPlan([{...row,...patch}],map));
  }
  assert.throws(() => buildPlan([],map));
});
test('rejects changes to price, review or previous retailer metadata during verification', () => {
  const plan=buildPlan([row],map);
  const after={...row,retailerLinks:plan[0].retailerLinks,updatedAt:'2026-10-03'};
  assert.equal(verify([row],[after],plan).updated,1);
  for (const patch of [{price:100},{review:'changed'},{retailerLinks:after.retailerLinks.slice(1)}]) assert.throws(()=>verify([row],[{...after,...patch}],plan));
});
test('deep links preserve full user destination and reject foreign hosts',()=>{
  const destination='https://goodbuygear.com/products/desert-lark-linen-sling?_pos=2&_sid=25ac132e5&_ss=r';
  assert.equal(new URL(affiliateUrl(destination)).searchParams.get('u'),destination);
  assert.throws(()=>affiliateUrl('https://goodbuygear.com.evil.test/products/x'));
});
