import 'server-only';
import prismaBase from '@/lib/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Map of retailer key → logo URL, built from the admin Affiliate Partners
 * (/admin/partners). Keyed by both the partner's normalized name and slug so a
 * checklist pick's "Other retailer" label (e.g. "Nuna") resolves to that
 * partner's logo. Falls back to {} if the table is unavailable.
 */
export async function getPartnerLogos(): Promise<Record<string, string>> {
  try {
    const rows: Array<{ name: string | null; slug: string | null; logoUrl: string | null }> =
      await db.affiliatePartner.findMany({
        where: { isActive: true, logoUrl: { not: null } },
        select: { name: true, slug: true, logoUrl: true },
      });
    const map: Record<string, string> = {};
    for (const r of rows) {
      if (!r.logoUrl) continue;
      if (r.name) map[normalize(r.name)] = r.logoUrl;
      if (r.slug) map[normalize(r.slug)] = r.logoUrl;
    }
    return map;
  } catch {
    return {};
  }
}
