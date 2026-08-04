/**
 * Parser tests for the six editorial styled blocks (quick-answer, feature-list,
 * decision-cards, note, checklist, verdict) plus regression coverage of the
 * existing blocks. No test runner is configured, so this runs standalone:
 *
 *   npx tsx scripts/testStyledBlocks.ts
 *
 * Exits non-zero on the first failed assertion.
 */
import assert from 'node:assert/strict';
import { extractStyledBlocks, type ParsedStyledBlock } from '@/lib/blog/styledBlocks';

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
}

/** Parse a single block from a markdown snippet. */
function one(md: string): ParsedStyledBlock {
  const blocks = extractStyledBlocks(md);
  assert.equal(blocks.length, 1, `expected exactly one block, got ${blocks.length}`);
  return blocks[0];
}

console.log('quick-answer');
test('captures freeform body', () => {
  const b = one(':::quick-answer\nThe **SENA Aire** is the best all-around pick.\n:::');
  assert.equal(b.type, 'quick-answer');
  if (b.type !== 'quick-answer') return;
  assert.equal(b.body, 'The **SENA Aire** is the best all-around pick.');
});
test('preserves paragraph breaks and single line breaks', () => {
  const b = one(':::quick-answer\nLine one.\nLine two.\n\nSecond paragraph.\n:::');
  if (b.type !== 'quick-answer') throw new Error('wrong type');
  assert.equal(b.body, 'Line one.\nLine two.\n\nSecond paragraph.');
});
test('does not treat ordinary colons as fields', () => {
  const b = one(':::quick-answer\nBest for travel: the PAAL wins.\n:::');
  if (b.type !== 'quick-answer') throw new Error('wrong type');
  assert.equal(b.body, 'Best for travel: the PAAL wins.');
});

console.log('note');
test('captures freeform body', () => {
  const b = one(':::note\nPrices reflect typical retail as of publication.\n:::');
  assert.equal(b.type, 'note');
  if (b.type !== 'note') return;
  assert.equal(b.body, 'Prices reflect typical retail as of publication.');
});

console.log('feature-list');
test('splits Features on pipe, trims, ignores empties', () => {
  const b = one(':::feature-list\nTitle: What you get\nFeatures: A |  | B | C \n:::');
  if (b.type !== 'feature-list') throw new Error('wrong type');
  assert.equal(b.title, 'What you get');
  assert.deepEqual(b.features, ['A', 'B', 'C']);
});
test('title is optional', () => {
  const b = one(':::feature-list\nFeatures: One | Two\n:::');
  if (b.type !== 'feature-list') throw new Error('wrong type');
  assert.equal(b.title, null);
  assert.deepEqual(b.features, ['One', 'Two']);
});
test('accepts bare bullet features', () => {
  const b = one(':::feature-list\n- Alpha\n- Beta\n:::');
  if (b.type !== 'feature-list') throw new Error('wrong type');
  assert.deepEqual(b.features, ['Alpha', 'Beta']);
});

console.log('decision-cards');
test('splits each Option on the FIRST pipe only', () => {
  const b = one(':::decision-cards\nOption 1: Best all-around | Dependable | flexible | pick\n:::');
  if (b.type !== 'decision-cards') throw new Error('wrong type');
  assert.equal(b.cards.length, 1);
  assert.equal(b.cards[0].heading, 'Best all-around');
  assert.equal(b.cards[0].body, 'Dependable | flexible | pick');
});
test('sorts options numerically regardless of source order', () => {
  const b = one(
    ':::decision-cards\nOption 3: Third | c\nOption 1: First | a\nOption 2: Second | b\n:::',
  );
  if (b.type !== 'decision-cards') throw new Error('wrong type');
  assert.deepEqual(b.cards.map((c) => c.heading), ['First', 'Second', 'Third']);
});
test('heading with no pipe yields empty body', () => {
  const b = one(':::decision-cards\nOption 1: Just a heading\n:::');
  if (b.type !== 'decision-cards') throw new Error('wrong type');
  assert.equal(b.cards[0].heading, 'Just a heading');
  assert.equal(b.cards[0].body, '');
});
test('title is optional and not rendered as a card', () => {
  const b = one(':::decision-cards\nTitle: Which fits you?\nOption 1: A | x\n:::');
  if (b.type !== 'decision-cards') throw new Error('wrong type');
  assert.equal(b.title, 'Which fits you?');
  assert.equal(b.cards.length, 1);
});

console.log('checklist');
test('parses Item rows and sorts numerically', () => {
  const b = one(':::checklist\nTitle: Before you buy\nItem 2: Second\nItem 1: First\n:::');
  if (b.type !== 'checklist') throw new Error('wrong type');
  assert.equal(b.title, 'Before you buy');
  assert.deepEqual(b.items, ['First', 'Second']);
});
test('drops empty items and keeps punctuation in value', () => {
  const b = one(':::checklist\nItem 1: Measure the space: next to your bed.\nItem 2:\n:::');
  if (b.type !== 'checklist') throw new Error('wrong type');
  assert.deepEqual(b.items, ['Measure the space: next to your bed.']);
});

console.log('verdict');
test('keeps key/value rows in original order', () => {
  const b = one(
    ':::verdict\nBest overall: Nuna SENA Aire\nBest for frequent travel: Nuna PAAL\n:::',
  );
  if (b.type !== 'verdict') throw new Error('wrong type');
  assert.deepEqual(b.rows, [
    { label: 'Best overall', value: 'Nuna SENA Aire' },
    { label: 'Best for frequent travel', value: 'Nuna PAAL' },
  ]);
});
test('splits on first colon so values keep colons/URLs', () => {
  const b = one(':::verdict\nBest link: https://example.com/x?a=1\n:::');
  if (b.type !== 'verdict') throw new Error('wrong type');
  assert.equal(b.rows[0].label, 'Best link');
  assert.equal(b.rows[0].value, 'https://example.com/x?a=1');
});
test('ignores a bare Title line', () => {
  const b = one(':::verdict\nTitle: The verdict\nBest overall: X\n:::');
  if (b.type !== 'verdict') throw new Error('wrong type');
  assert.deepEqual(b.rows, [{ label: 'Best overall', value: 'X' }]);
});

console.log('robustness & regressions');
test('malformed / empty blocks do not throw', () => {
  assert.doesNotThrow(() => extractStyledBlocks(':::feature-list\n:::'));
  assert.doesNotThrow(() => extractStyledBlocks(':::decision-cards\n:::'));
  assert.doesNotThrow(() => extractStyledBlocks(':::verdict\n:::'));
  assert.doesNotThrow(() => extractStyledBlocks(':::quick-answer\n:::'));
});
test('closing ::: is not confused with a new opening block', () => {
  const blocks = extractStyledBlocks(
    ':::note\nfirst\n:::\n\n:::verdict\nBest: Y\n:::',
  );
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].type, 'note');
  assert.equal(blocks[1].type, 'verdict');
});
test('unknown block types keep the existing fallback (ignored)', () => {
  const blocks = extractStyledBlocks(':::totally-made-up\nhello\n:::');
  assert.equal(blocks.length, 0);
});
test('existing callout block still parses (no regression)', () => {
  const b = one(':::callout\nTitle line\nBody line\n:::');
  assert.equal(b.type, 'callout');
});
test('existing spec-table block still parses (no regression)', () => {
  const b = one(':::spec-table\nColumns: A | B\nWeight: 1 | 2\n:::');
  assert.equal(b.type, 'spec-table');
});

console.log(`\nAll ${passed} styled-block parser tests passed.`);
