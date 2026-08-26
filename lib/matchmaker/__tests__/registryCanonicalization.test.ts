import { describe, expect, it } from 'vitest';

import {
  BABYLIST_ROOT_SLUG_HOSTS,
  babylistRegistryCanonicalKey,
  canonicalizeBabylistRegistryUrl,
  isSameBabylistRegistry,
} from '../registryCanonicalization';

/** The three accepted V1 forms, for a given slug. */
const forms = (slug: string) => [
  `https://my.babylist.com/${slug}`,
  `https://www.babylist.com/list/${slug}`,
  `https://babylist.com/list/${slug}`,
];

describe('canonicalization — the three accepted forms are one identity', () => {
  it('all three produce babylist:list:<slug>', () => {
    const keys = forms('rivera').map(babylistRegistryCanonicalKey);
    expect(keys).toEqual([
      'babylist:list:rivera',
      'babylist:list:rivera',
      'babylist:list:rivera',
    ]);
    expect(new Set(keys).size).toBe(1);
  });

  it('every pair of the three forms compares equal', () => {
    for (const a of forms('rivera')) {
      for (const b of forms('rivera')) {
        expect(isSameBabylistRegistry(a, b)).toBe(true);
      }
    }
  });

  it('all three normalise to the same canonical url, slug, and family', () => {
    for (const form of [
      ...forms('rivera'),
      'http://my.babylist.com/rivera/',
      'https://MY.BABYLIST.COM/RIVERA',
      '  https://www.babylist.com/list/rivera/  ',
    ]) {
      const result = canonicalizeBabylistRegistryUrl(form);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.canonicalKey).toBe('babylist:list:rivera');
        expect(result.value.canonicalUrl).toBe('https://www.babylist.com/list/rivera');
        expect(result.value.slug).toBe('rivera');
        expect(result.value.family).toBe('list');
      }
    }
  });

  it('resolves the slug shapes Babylist issues in practice', () => {
    // Synthetic slugs, real shapes: multi-hyphen, letters-only, letters+digits.
    expect(babylistRegistryCanonicalKey('https://my.babylist.com/sample-family-registry'))
      .toBe('babylist:list:sample-family-registry');
    expect(babylistRegistryCanonicalKey(
      'https://my.babylist.com/sample-family-registry?utm_source=newsletter',
    )).toBe('babylist:list:sample-family-registry');
    expect(babylistRegistryCanonicalKey('https://my.babylist.com/samplefamily'))
      .toBe('babylist:list:samplefamily');
    expect(babylistRegistryCanonicalKey('https://my.babylist.com/babysample2026'))
      .toBe('babylist:list:babysample2026');
  });

  it('different registries never collide', () => {
    expect(isSameBabylistRegistry(
      'https://my.babylist.com/rivera',
      'https://my.babylist.com/okafor',
    )).toBe(false);
  });
});

describe('canonicalization — my.babylist.com takes exactly one path segment', () => {
  it('only my.babylist.com is a root-slug host', () => {
    expect(BABYLIST_ROOT_SLUG_HOSTS).toEqual(['my.babylist.com']);
  });

  it('accepts exactly one non-empty segment', () => {
    expect(canonicalizeBabylistRegistryUrl('https://my.babylist.com/rivera').ok).toBe(true);
    expect(canonicalizeBabylistRegistryUrl('https://my.babylist.com/rivera/').ok).toBe(true);
  });

  it('rejects zero segments', () => {
    for (const url of ['https://my.babylist.com', 'https://my.babylist.com/', 'https://my.babylist.com//']) {
      expect(canonicalizeBabylistRegistryUrl(url)).toMatchObject({
        ok: false, code: 'UNRECOGNISED_REGISTRY_PATH',
      });
    }
  });

  it('rejects two or more segments', () => {
    for (const url of [
      'https://my.babylist.com/rivera/gifts',
      'https://my.babylist.com/a/b',
      'https://my.babylist.com/a/b/c',
      'https://my.babylist.com/list/rivera',
    ]) {
      expect(canonicalizeBabylistRegistryUrl(url)).toMatchObject({
        ok: false, code: 'UNRECOGNISED_REGISTRY_PATH',
      });
    }
  });

  it('rejects the password gate page — V1 wants the registry root', () => {
    expect(canonicalizeBabylistRegistryUrl('https://my.babylist.com/samplefamily/password'))
      .toMatchObject({ ok: false, code: 'UNRECOGNISED_REGISTRY_PATH' });
    // ...while the same registry's root URL resolves normally.
    expect(babylistRegistryCanonicalKey('https://my.babylist.com/samplefamily'))
      .toBe('babylist:list:samplefamily');
  });

  it('keeps no reserved-word denylist — an ordinary-looking slug is still a registry', () => {
    for (const slug of ['login', 'settings', 'store', 'help', 'search', 'account']) {
      expect(babylistRegistryCanonicalKey(`https://my.babylist.com/${slug}`))
        .toBe(`babylist:list:${slug}`);
    }
  });

  it('accepts lowercase letters, digits, and internal hyphens', () => {
    for (const slug of ['abc', 'baby2026', 'taylor-family', 'a', '2026', 'a-b-c-d']) {
      expect(babylistRegistryCanonicalKey(`https://my.babylist.com/${slug}`))
        .toBe(`babylist:list:${slug}`);
    }
  });

  it('rejects periods, underscores, edge hyphens, and encoded junk', () => {
    for (const slug of ['.abc', 'abc.', 'abc_def', 'abc.def', '-abc', 'abc-', '%20', '-', '_']) {
      expect(canonicalizeBabylistRegistryUrl(`https://my.babylist.com/${slug}`))
        .toMatchObject({ ok: false, code: 'UNRECOGNISED_REGISTRY_PATH' });
    }
  });
});

describe('canonicalization — inferred legacy forms are rejected, not silently accepted', () => {
  it('rejects /registry/<slug> on every host', () => {
    for (const url of [
      'https://www.babylist.com/registry/rivera',
      'https://babylist.com/registry/rivera',
      'https://my.babylist.com/registry/rivera',
    ]) {
      expect(canonicalizeBabylistRegistryUrl(url)).toMatchObject({
        ok: false, code: 'UNRECOGNISED_REGISTRY_PATH',
      });
      expect(babylistRegistryCanonicalKey(url)).toBeNull();
    }
  });

  it('rejects /baby-<slug> on every host', () => {
    for (const url of [
      'https://www.babylist.com/baby-rivera',
      'https://babylist.com/baby-rivera',
      'http://www.babylist.com/baby-rivera/',
    ]) {
      expect(canonicalizeBabylistRegistryUrl(url)).toMatchObject({
        ok: false, code: 'UNRECOGNISED_REGISTRY_PATH',
      });
      expect(babylistRegistryCanonicalKey(url)).toBeNull();
    }
  });

  it('a rejected legacy form never compares equal to the accepted form', () => {
    expect(isSameBabylistRegistry(
      'https://www.babylist.com/list/rivera',
      'https://www.babylist.com/registry/rivera',
    )).toBe(false);
    expect(isSameBabylistRegistry(
      'https://www.babylist.com/list/rivera',
      'https://www.babylist.com/baby-rivera',
    )).toBe(false);
  });

  it('babylist.com/<slug> at the root is still refused on www and the apex', () => {
    for (const url of [
      'https://www.babylist.com/rivera',
      'https://babylist.com/rivera',
      'https://www.babylist.com/anything-at-all',
    ]) {
      expect(canonicalizeBabylistRegistryUrl(url)).toMatchObject({
        ok: false, code: 'UNRECOGNISED_REGISTRY_PATH',
      });
    }
  });

  it('does not swallow real non-registry Babylist pages this repo already links to', () => {
    for (const url of [
      'https://www.babylist.com/store',
      'https://www.babylist.com/store/strollers',
      'https://www.babylist.com/store/cribs',
      'https://www.babylist.com/hello-baby/whats-inside-babylist-hello-baby-box',
    ]) {
      expect(canonicalizeBabylistRegistryUrl(url).ok).toBe(false);
    }
  });
});

describe('canonicalization — tracking parameters disappear', () => {
  it('drops utm, gclid, srsltid, referral codes, and fragments on both accepted hosts', () => {
    for (const url of [
      'https://www.babylist.com/list/rivera?utm_source=instagram&utm_medium=story',
      'https://www.babylist.com/list/rivera?gclid=abc123',
      'https://www.babylist.com/list/rivera?srsltid=zzz&utm_campaign=launch',
      'https://www.babylist.com/list/rivera#gifts',
      'https://my.babylist.com/rivera?ref=friend&invite=9f2',
      'https://my.babylist.com/rivera/?utm_source=x#top',
    ]) {
      expect(babylistRegistryCanonicalKey(url)).toBe('babylist:list:rivera');
    }
  });

  it('the canonical url never carries a query string or fragment', () => {
    const result = canonicalizeBabylistRegistryUrl(
      'https://my.babylist.com/rivera?utm_source=x&gclid=y#anchor',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.canonicalUrl).not.toContain('?');
      expect(result.value.canonicalUrl).not.toContain('#');
    }
  });
});

describe('canonicalization — unsupported domains are rejected', () => {
  it('rejects non-Babylist hosts', () => {
    for (const url of [
      'https://www.amazon.com/list/rivera',
      'https://www.target.com/gift-registry/rivera',
      'https://myregistry.com/rivera',
      'https://babylist.com.evil.example/list/rivera',
      'https://my.babylist.com.evil.example/rivera',
      'https://notbabylist.com/list/rivera',
      'https://shop.babylist.com/list/rivera',
    ]) {
      expect(canonicalizeBabylistRegistryUrl(url)).toMatchObject({
        ok: false, code: 'UNSUPPORTED_DOMAIN',
      });
    }
  });

  it('rejects non-http schemes', () => {
    for (const url of ['javascript:alert(1)', 'ftp://babylist.com/list/rivera', 'data:text/html,hi']) {
      const result = canonicalizeBabylistRegistryUrl(url);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(['UNSUPPORTED_SCHEME', 'UNSUPPORTED_DOMAIN']).toContain(result.code);
      }
    }
  });

  it('rejects a Babylist product URL — it is not a registry', () => {
    expect(canonicalizeBabylistRegistryUrl(
      'https://www.babylist.com/gp/nuna-mixx-next-pipa-urbn/36335/1925316',
    )).toMatchObject({ ok: false, code: 'UNRECOGNISED_REGISTRY_PATH' });
  });
});

describe('canonicalization — malformed input fails cleanly', () => {
  it('never throws, for any input', () => {
    const inputs: Array<string | null | undefined> = [
      '', '   ', null, undefined, 'not a url', 'my.babylist.com/rivera',
      'https://', '://babylist.com', 'https://babylist.com:notaport/list/x',
      '\n\t', '%%%', 'https://[::1]/list/x',
    ];
    for (const input of inputs) {
      expect(() => canonicalizeBabylistRegistryUrl(input)).not.toThrow();
      expect(canonicalizeBabylistRegistryUrl(input).ok).toBe(false);
    }
  });

  it('reports EMPTY_URL for blank input and MALFORMED_URL for junk', () => {
    expect(canonicalizeBabylistRegistryUrl('')).toMatchObject({ ok: false, code: 'EMPTY_URL' });
    expect(canonicalizeBabylistRegistryUrl('   ')).toMatchObject({ ok: false, code: 'EMPTY_URL' });
    expect(canonicalizeBabylistRegistryUrl(null)).toMatchObject({ ok: false, code: 'EMPTY_URL' });
    expect(canonicalizeBabylistRegistryUrl('not a url')).toMatchObject({ ok: false, code: 'MALFORMED_URL' });
  });

  it('every failure carries a human-readable message and no raw error text', () => {
    const result = canonicalizeBabylistRegistryUrl('https://www.amazon.com/x');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message.length).toBeGreaterThan(0);
      expect(result.message).not.toContain('Invalid URL');
      expect(result.message).not.toContain('Prisma');
    }
  });

  it('babylistRegistryCanonicalKey returns null rather than throwing', () => {
    expect(babylistRegistryCanonicalKey('nope')).toBeNull();
    expect(babylistRegistryCanonicalKey(null)).toBeNull();
  });
});
