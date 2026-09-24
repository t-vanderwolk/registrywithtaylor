import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildMarketingMetadata, NOINDEX_FOLLOW_ROBOTS } from '@/lib/marketing/metadata';

/**
 * The indexing policy the tools ship with (79f60fd, "stop indexing parameterized
 * tool states"):
 *
 *   - the clean tool landing pages stay indexable and self-canonical — they are
 *     what `pages.xml` submits and what should rank;
 *   - every parameterised state (?brand=, ?category=, ?ids=, ?carSeatBrand=,
 *     ?strollerBrand=, and the whole /results surface) serves `noindex, follow`
 *     and canonicalises to its clean landing page, so ~400 interactive states
 *     stop competing with it. The states stay fully usable, and their links are
 *     still followed.
 *
 * This file guards both halves: the mechanism in buildMarketingMetadata, and how
 * each tool page uses it.
 */

const TOOL_PAGES = {
  finder: 'app/tools/stroller-finder/page.tsx',
  compare: 'app/tools/compare/page.tsx',
  travelSystem: 'app/tools/travel-system/page.tsx',
  travelSystemResults: 'app/tools/travel-system/results/page.tsx',
  quiz: 'app/tools/stroller-quiz/page.tsx',
} as const;

const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

/** The argument object of every buildMarketingMetadata call in a page. */
function metadataCalls(file: string): string[] {
  return read(file)
    .split('buildMarketingMetadata(')
    .slice(1)
    .map((chunk) => chunk.split(/\n\s*\}\);/)[0]);
}

const isNoindex = (call: string) => /\bnoindex:\s*true\b/.test(call);
const pathsIn = (call: string) => [...call.matchAll(/\bpath:\s*(?:'([^']*)'|`([^`]*)`)/g)].map((m) => m[1] ?? m[2]);

describe('tool metadata mechanism', () => {
  it('turns noindex into noindex, follow while keeping the canonical it was given', () => {
    const state = buildMarketingMetadata({
      title: 'Orbit Baby Strollers',
      description: 'Every Orbit Baby stroller in one place.',
      path: '/tools/stroller-finder',
      noindex: true,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: 'Orbit Baby strollers',
    });
    expect(state.robots).toEqual(NOINDEX_FOLLOW_ROBOTS);
    expect(state.alternates?.canonical).toBe('/tools/stroller-finder');
    // Still described for humans and link previews.
    expect(state.title).toBe('Orbit Baby Strollers');
  });

  it('leaves everything else indexable', () => {
    const landing = buildMarketingMetadata({
      title: 'Stroller Finder',
      description: 'Browse strollers by brand and model.',
      path: '/tools/stroller-finder',
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: 'Stroller finder',
    });
    expect(landing.robots).toMatchObject({ index: true, follow: true });
    expect(landing.alternates?.canonical).toBe('/tools/stroller-finder');
  });
});

describe('public tool SEO indexing', () => {
  it('never canonicalises a tool page to a parameterised URL', () => {
    for (const file of Object.values(TOOL_PAGES)) {
      for (const call of metadataCalls(file)) {
        for (const path of pathsIn(call)) {
          expect(`${file} → ${path}`).toBe(`${file} → ${path.split('?')[0]}`);
        }
      }
    }
  });

  it('keeps each tool landing page indexable while its filtered states are not', () => {
    for (const file of [TOOL_PAGES.finder, TOOL_PAGES.compare, TOOL_PAGES.travelSystem]) {
      const calls = metadataCalls(file);
      expect(calls.length).toBeGreaterThan(1);
      expect(calls.filter((call) => !isNoindex(call)).length).toBeGreaterThan(0);
      expect(calls.filter(isNoindex).length).toBeGreaterThan(0);
    }
  });

  it('keeps the whole travel-system results surface out of the index', () => {
    const calls = metadataCalls(TOOL_PAGES.travelSystemResults);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every(isNoindex)).toBe(true);
  });

  it('leaves the quiz fully indexable', () => {
    const calls = metadataCalls(TOOL_PAGES.quiz);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.some(isNoindex)).toBe(false);
  });

  it('never blocks the sitemap routes themselves', () => {
    for (const file of ['app/sitemap.xml/route.ts', 'app/sitemaps/[name]/route.ts']) {
      expect(/\bnoindex\b/i.test(read(file))).toBe(false);
    }
  });
});
