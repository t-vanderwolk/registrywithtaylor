/**
 * Controlled editorial update. No generic seed/upsert and no fuzzy matching.
 * node scripts/enrichChecklistEditorial.cjs --dry-run --report /tmp/editorial.json
 * Review that JSON + Markdown, then:
 * node scripts/enrichChecklistEditorial.cjs --apply --reviewed /tmp/editorial.json --report /tmp/applied.json
 * DATABASE_URL must point at the intended database. No credentials are written.
 */
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');
const approved = require('./data/checklistEditorialEnrichment-2026-09-30.json');
const REPLACEMENT_ID = 'amzcc-momcozy-baby-wrap-carrier-2-piece';
const fields = ['badge', 'standout'];
const normalize = (s) => (s ?? '').trim().replaceAll('’', "'");
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const plain = (value) => JSON.parse(JSON.stringify(value));

function buildPlan(rows, products = approved.products) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const counts = { productsUpdated: 0, badgesAdded: 0, badgesReplaced: 0, standoutsAdded: 0, standoutsReplaced: 0, existingBadges: 0, existingStandouts: 0, conflicts: 0, unmatched: 0, unchangedProducts: 0 };
  const entries = Object.entries(products).map(([id, copy]) => {
    const row = byId.get(id);
    const entry = { id, auditProduct: copy.auditProduct, brand: copy.brand, product: copy.product, identityNote: copy.identityNote, source: 'DB-backed (verified on live checklist in read-only preflight)', before: row ?? null, changes: {}, conflicts: [], fields: {} };
    if (!row || row.brand !== copy.brand || row.product !== copy.product || row.checklistItemId !== copy.checklistItemId) {
      counts.unmatched++;
      entry.source = 'Identity missing or changed; not eligible';
      entry.identityError = 'Exact ID, brand, product or checklist assignment does not match the reviewed identity.';
      return entry;
    }
    if (normalize(row.badge)) counts.existingBadges++;
    if (normalize(row.standout)) counts.existingStandouts++;
    for (const field of fields) {
      if (typeof copy[field] !== 'string' || !copy[field].trim()) throw new Error(`Missing approved ${field}: ${id}`);
      const old = row[field];
      const proposed = copy[field];
      let action = 'already-present';
      let next = old;
      if (!normalize(old)) { action = 'add'; next = proposed; }
      else if (normalize(old) !== normalize(proposed)) {
        if (id === REPLACEMENT_ID && copy.allowReplacement === true) { action = 'replace'; next = proposed; }
        else { action = 'conflict-preserved'; entry.conflicts.push(field); }
      }
      if (next !== old) {
        entry.changes[field] = next;
        counts[`${field === 'badge' ? 'badges' : 'standouts'}${action === 'add' ? 'Added' : 'Replaced'}`]++;
      }
      entry.fields[field] = { old, proposed, new: next, action, wouldOverwriteExisting: Boolean(normalize(old) && old !== proposed), willOverwriteExisting: action === 'replace' };
    }
    if (entry.conflicts.length) counts.conflicts++;
    if (Object.keys(entry.changes).length) counts.productsUpdated++;
    else counts.unchangedProducts++;
    return entry;
  });
  return { counts, entries };
}

async function snapshot(db) {
  return plain({
    products: await db.checklistProduct.findMany({ orderBy: { id: 'asc' } }),
    categories: await db.checklistCategory.findMany({ orderBy: { id: 'asc' } }),
    items: await db.checklistItem.findMany({ orderBy: { id: 'asc' } }),
  });
}

function verify(before, after, entries) {
  if (!isDeepStrictEqual(before.categories, after.categories) || !isDeepStrictEqual(before.items, after.items)) throw new Error('Checklist structure changed; verification failed.');
  if (before.products.length !== after.products.length) throw new Error('Product count changed.');
  const updates = new Map(entries.filter((e) => Object.keys(e.changes).length).map((e) => [e.id, e.changes]));
  for (const row of before.products) {
    const actual = after.products.find((r) => r.id === row.id);
    if (!actual) throw new Error(`Missing product ${row.id}`);
    const expected = { ...row, ...(updates.get(row.id) ?? {}) };
    if (updates.has(row.id)) expected.updatedAt = actual.updatedAt;
    if (!isDeepStrictEqual(expected, actual)) throw new Error(`Unexpected product-field change: ${row.id}`);
  }
  return { verifiedProducts: before.products.length, updatedProducts: updates.size, reviewUnchanged: true, commerceUnchanged: true, productIdentityUnchanged: true, categoriesAndLinesUnchanged: true, onlyAllowedFieldsChanged: ['badge', 'standout', 'updatedAt (automatic timestamp)'] };
}

async function applyReviewed(db, reviewed, products = approved.products) {
  if (reviewed.mode !== 'dry-run' || reviewed.mapDigest !== digest(products)) throw new Error('A matching reviewed dry-run report is required.');
  return db.$transaction(async (tx) => {
    const before = await snapshot(tx);
    if (!isDeepStrictEqual(before, reviewed.snapshot)) throw new Error('Database changed after dry run. Run and review a fresh dry run.');
    const plan = buildPlan(before.products, products);
    if (!isDeepStrictEqual(plan, reviewed.plan)) throw new Error('Reviewed plan differs.');
    if (plan.counts.unmatched) throw new Error('Unmatched identity: write mode refused.');
    for (const entry of plan.entries) {
      if (!Object.keys(entry.changes).length) continue;
      if (Object.keys(entry.changes).some((key) => !fields.includes(key))) throw new Error('Forbidden field.');
      const result = await tx.checklistProduct.updateMany({
        where: { id: entry.id, brand: entry.brand, product: entry.product, updatedAt: new Date(entry.before.updatedAt), badge: entry.before.badge, standout: entry.before.standout },
        data: entry.changes,
      });
      if (result.count !== 1) throw new Error(`Concurrent change: ${entry.id}`);
    }
    const after = await snapshot(tx);
    return { before, after, plan, verification: verify(before, after, plan.entries) };
  }, { isolationLevel: 'Serializable', timeout: 60000 });
}

function markdown(report) {
  const cell = (v) => JSON.stringify(v ?? null).replaceAll('|', '\\|');
  const lines = ['# Checklist editorial enrichment — 2026-09-30', '', `Mode: ${report.mode}. Generated: ${report.generatedAt}.`, '', '## Counts', '', ...Object.entries(report.plan.counts).map(([k,v]) => `- ${k}: ${v}`), '', '## Source and identity', '', '118 audited products were individually matched to unique DB IDs and found on the live neutral checklist before writing. The short labels in the source audit were resolved to the full stored names below, preserving sizes, generations, bundles, counts, and colors. The Guava / BabyBjörn label is an existing combined-label DB row, not a merge performed by this script. Static recommendation wiring can select a DB product; it does not mean static product content is used.', '', 'Existing non-empty content is preserved, including apostrophe typography. Two substantive differences are retained: Evolur PureSprout badge and playard-pick standout. The Momcozy wrap is the only authorized replacement and already contains the requested copy. Review is never an update target.', '', '## Every audited product', ''];
  for (const e of report.plan.entries) {
    lines.push(`### ${e.auditProduct}`, '', `- ID: \`${e.id}\``, `- Brand / product: ${e.brand} / ${e.product}`, `- Source: ${e.source}`, `- Current review (preserved): ${cell(e.before?.review)}`);
    if (e.identityError) lines.push(`- UNMATCHED: ${e.identityError}`);
    for (const field of fields) {
      const f = e.fields[field]; if (!f) continue;
      lines.push(`- ${field}: ${cell(f.old)} → ${cell(f.new)} (${f.action})`, `- Proposed ${field}: ${cell(f.proposed)}; would overwrite existing: ${f.wouldOverwriteExisting}; actual overwrite: ${f.willOverwriteExisting}`);
    }
    lines.push('');
  }
  if (report.verification) lines.push('## Verification', '', '```json', JSON.stringify(report.verification,null,2), '```', '');
  return lines.join('\n');
}

async function main(args = process.argv.slice(2)) {
  const known = new Set(['--dry-run','--apply','--report','--reviewed']);
  const opts = {};
  for (let i=0;i<args.length;i++) {
    const arg=args[i]; if(!known.has(arg)) throw new Error(`Unknown option: ${arg}`);
    if(arg==='--report'||arg==='--reviewed') { if(!args[i+1]||args[i+1].startsWith('--')) throw new Error(`Missing value: ${arg}`); opts[arg]=args[++i]; }
    else opts[arg]=true;
  }
  if(opts['--dry-run']&&opts['--apply']) throw new Error('Choose dry-run or apply, not both.');
  if(opts['--apply']&&(!opts['--reviewed']||!opts['--report'])) throw new Error('Apply requires --reviewed and --report.');
  if (opts['--report']) {
    const output = path.resolve(opts['--report']);
    if (opts['--reviewed'] && output === path.resolve(opts['--reviewed'])) throw new Error('Report must not overwrite reviewed dry run.');
    fs.accessSync(path.dirname(output), fs.constants.W_OK);
  }
  const { PrismaClient } = require('@prisma/client');
  const db = new PrismaClient();
  try {
    let report;
    if(opts['--apply']) {
      const reviewed=JSON.parse(fs.readFileSync(opts['--reviewed'],'utf8'));
      const result=await applyReviewed(db,reviewed);
      const persisted=await snapshot(db);
      const persistedVerification=verify(result.before,persisted,result.plan.entries);
      report={ mode:'applied',generatedAt:new Date().toISOString(),mapDigest:digest(approved.products),snapshot:result.before,plan:result.plan,after:persisted,verification:persistedVerification };
    } else {
      // PostgreSQL itself enforces zero database writes in the entire dry run.
      const before=await db.$transaction(async(tx)=>{ await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY'); return snapshot(tx); }, { isolationLevel:'RepeatableRead',timeout:30000 });
      report={mode:'dry-run',generatedAt:new Date().toISOString(),mapDigest:digest(approved.products),snapshot:before,plan:buildPlan(before.products)};
    }
    for(const e of report.plan.entries) console.log(`${e.id}\n${e.brand} | ${e.product}\nBadge: ${JSON.stringify(e.fields.badge?.old)} → ${JSON.stringify(e.fields.badge?.new)}\nStandout: ${JSON.stringify(e.fields.standout?.old)} → ${JSON.stringify(e.fields.standout?.new)}${e.identityError?'\nUNMATCHED: '+e.identityError:''}${e.conflicts.length?'\nPRESERVED CONFLICT: '+e.conflicts.join(', '):''}\n`);
    console.log(JSON.stringify(report.plan.counts,null,2));
    if(opts['--report']) {
      const output=path.resolve(opts['--report']);
      if(opts['--reviewed']&&output===path.resolve(opts['--reviewed'])) throw new Error('Report must not overwrite reviewed dry run.');
      fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
      fs.writeFileSync(output.replace(/\.json$/, '')+'.md',markdown(report));
    }
  } finally { await db.$disconnect(); }
}
if(require.main===module) main().catch((error)=>{console.error(error.message);process.exitCode=1;});
module.exports={buildPlan,applyReviewed,verify,digest};
