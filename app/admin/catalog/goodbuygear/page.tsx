import Link from 'next/link';
import prismaBase from '@/lib/server/prisma';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import { requireAdminSession } from '@/lib/server/session';
import { extractStyledBlocks } from '@/lib/blog/styledBlocks';
import { blogProductKey } from '@/lib/blog/blogProductCatalog';
import { resolveBlogGoodBuyGearOffers } from '@/lib/server/blogGoodBuyGear';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'GoodBuy Gear Match Audit · Admin',
  robots: { index: false, follow: false },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prismaBase as any;

type ProductRow = {
  brand: string;
  product: string;
  matched: boolean;
  price: number | null;
  url: string | null;
  posts: { title: string; slug: string; status: string }[];
};

/**
 * Audit which :::catalog-product cards across the blog currently resolve to a
 * GoodBuy Gear open-box offer (and would therefore show the badge) vs. don't.
 * Read-only. Helps spot name mismatches between a card and the GBG feed.
 */
export default async function GoodBuyGearAuditPage() {
  await requireAdminSession('/admin/catalog/goodbuygear');

  let posts: Array<{ title: string; slug: string; status: string; content: string }> = [];
  try {
    posts = await db.post.findMany({ select: { title: true, slug: true, status: true, content: true } });
  } catch {
    posts = [];
  }

  // Collect every catalog-product block, keyed by brand+product, with the posts that use it.
  const byKey = new Map<string, ProductRow>();
  for (const post of posts) {
    if (!post.content || !post.content.includes(':::catalog-product')) continue;
    for (const block of extractStyledBlocks(post.content)) {
      if (block.type !== 'catalog-product') continue;
      const brand = (block.brand ?? '').trim();
      const product = (block.productName ?? '').trim();
      if (!brand && !product) continue;
      const key = blogProductKey(brand, product);
      const row = byKey.get(key) ?? { brand, product, matched: false, price: null, url: null, posts: [] };
      if (!row.posts.some((p) => p.slug === post.slug)) {
        row.posts.push({ title: post.title, slug: post.slug, status: post.status });
      }
      byKey.set(key, row);
    }
  }

  const rows = [...byKey.values()];

  // One batched resolve against the GoodBuy Gear feed (same path the cards use).
  const offers = await resolveBlogGoodBuyGearOffers(
    rows.map((r) => ({ brand: r.brand, productName: r.product })),
  );
  for (const r of rows) {
    const offer = offers[blogProductKey(r.brand, r.product)];
    if (offer && (offer.url || offer.price != null)) {
      r.matched = true;
      r.price = offer.price;
      r.url = offer.url;
    }
  }

  rows.sort(
    (a, b) =>
      Number(b.matched) - Number(a.matched) ||
      a.brand.localeCompare(b.brand) ||
      a.product.localeCompare(b.product),
  );

  const matchedCount = rows.filter((r) => r.matched).length;

  return (
    <AdminContainer>
      <AdminHeader
        eyebrow="Catalog"
        title="GoodBuy Gear match audit"
        subtitle="Every :::catalog-product card across the blog, and whether it currently resolves to a GoodBuy Gear open-box offer (which renders the badge). Unmatched rows are usually a name mismatch or no active open-box listing."
      />

      <section className="admin-kpi-grid" aria-label="GoodBuy Gear match metrics">
        <AdminKpiCard label="Distinct products" value={String(rows.length)} />
        <AdminKpiCard label="With open-box match" value={String(matchedCount)} />
        <AdminKpiCard label="No match" value={String(rows.length - matchedCount)} />
      </section>

      <AdminSurface className="admin-stack">
        <AdminTable
          density="compact"
          columns={[
            { key: 'match', label: 'GBG' },
            { key: 'brand', label: 'Brand' },
            { key: 'product', label: 'Product' },
            { key: 'price', label: 'Open-box', align: 'right' },
            { key: 'posts', label: 'Used in' },
          ]}
          emptyState={<p className="admin-body p-6">No :::catalog-product cards found in any post.</p>}
        >
          {rows.map((r) => (
            <tr key={`${r.brand}-${r.product}`} className="admin-row">
              <td>
                {r.matched ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">match</span>
                ) : (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">none</span>
                )}
              </td>
              <td className="text-admin">{r.brand}</td>
              <td className="text-admin">{r.product}</td>
              <td className="text-right text-admin">
                {r.matched ? (
                  r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                      {r.price != null ? `$${Math.round(r.price)}` : 'view'}
                    </a>
                  ) : r.price != null ? (
                    `$${Math.round(r.price)}`
                  ) : (
                    '—'
                  )
                ) : (
                  '—'
                )}
              </td>
              <td className="admin-micro">
                {r.posts.map((p, i) => (
                  <span key={p.slug}>
                    {i > 0 ? ', ' : ''}
                    <Link href={`/blog/${p.slug}`} target="_blank" className="underline underline-offset-2">
                      {p.title}
                    </Link>
                    {p.status !== 'PUBLISHED' ? ` (${p.status.toLowerCase()})` : ''}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminSurface>
    </AdminContainer>
  );
}
