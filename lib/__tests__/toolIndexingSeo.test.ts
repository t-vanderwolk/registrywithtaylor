import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function walkFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walkFiles(path) : [path];
  });
}

describe('public tool SEO indexing', () => {
  it('does not block public tool pages from indexing', () => {
    const files = [
      ...walkFiles(join(process.cwd(), 'app/tools')),
      join(process.cwd(), 'app/sitemap.ts'),
    ];

    const offenders = files.filter((file) => {
      const source = readFileSync(file, 'utf8');
      return /\bnoindex\b/i.test(source) || /\bindex\s*:\s*false\b/.test(source) || /\bfollow\s*:\s*false\b/.test(source);
    });

    expect(offenders).toEqual([]);
  });
});
