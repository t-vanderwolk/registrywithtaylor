import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';
import AffiliateLinkCopyButton from '@/components/admin/AffiliateLinkCopyButton';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminToolbar from '@/components/admin/patterns/AdminToolbar';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminTabs from '@/components/admin/ui/AdminTabs';

type SearchParams = Promise<{ sort?: string; created?: string }> | undefined;
type SortMode = 'recent' | 'clicks';

const CONTEXT_OPTIONS = [
  'blog',
  'services',
  'homepage',
  'how-it-works',
  'contact',
  'faq',
  'about',
  'email',
  'social',
  'newsletter',
  'other',
] as const;

const asText = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

const normalizeSort = (value?: string): SortMode => (value === 'clicks' ? 'clicks' : 'recent');

const formatDateTime = (value: Date | null | undefined) => {
  if (!value) return '—';
  return value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

async function generateShortCode(length = 7) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

  for (let attempt = 0; attempt < 20; attempt += 1) {
    let code = '';
    for (let i = 0; i < length; i += 1) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    const exists = await prisma.affiliateLink.findUnique({
      where: { shortCode: code },
      select: { id: true },
    });

    if (!exists) {
      return code;
    }
  }

  throw new Error('Failed to generate a unique short code.');
}

async function createAffiliateLink(formData: FormData) {
  'use server';

  await requireAdminSession();

  const affiliateId = asText(formData.get('affiliateId'));
  const destinationUrl = asText(formData.get('destinationUrl'));
  const context = asText(formData.get('context'));
  const blogPostId = asText(formData.get('blogPostId'));

  if (!affiliateId || !destinationUrl) {
    redirect('/admin/affiliate-links');
  }

  const shortCode = await generateShortCode();

  await prisma.affiliateLink.create({
    data: {
      affiliateId,
      destinationUrl,
      shortCode,
      context: context || null,
      blogPostId: blogPostId || null,
    },
  });

  redirect(`/admin/affiliate-links?created=${encodeURIComponent(shortCode)}`);
}

export const dynamic = 'force-dynamic';

export default async function DashboardAdminAffiliateLinksPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  await requireAdminSession();

  const params = searchParams ? await searchParams : undefined;
  const sort = normalizeSort(params?.sort);
  const createdCode = params?.created ? params.created.trim() : '';

  const [affiliateOptions, blogPosts, links] = await Promise.all([
    prisma.affiliatePartner.findMany({
      where: { isActive: true },
      orderBy: [{ network: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        network: true,
      },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    }),
    prisma.affiliateLink.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        affiliate: {
          select: {
            id: true,
            name: true,
            network: true,
          },
        },
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            clicks: true,
          },
        },
        clicks: {
          select: {
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
  ]);

  const sortedLinks =
    sort === 'clicks'
      ? [...links].sort((a, b) => b._count.clicks - a._count.clicks || b.createdAt.getTime() - a.createdAt.getTime())
      : links;

  const siteOrigin = process.env.NEXTAUTH_URL?.replace(/\/$/, '') || 'http://localhost:3000';
  const createdShortUrl = createdCode ? `${siteOrigin}/r/${createdCode}` : null;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Affiliate Links"
        title="Affiliate link generator"
        subtitle="Create trackable short links for blog and marketing placements."
      />

      <AdminSurface className="admin-stack">
        <h2 className="admin-h2">Generate link</h2>

        <form action={createAffiliateLink} className="admin-stack gap-3.5">
          <div className="grid gap-3 md:grid-cols-2">
            <AdminField label="Affiliate partner" htmlFor="affiliate-link-partner">
              <select id="affiliate-link-partner" name="affiliateId" className="admin-select" required>
                <option value="">Select active partner</option>
                {affiliateOptions.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} ({partner.network})
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Context" htmlFor="affiliate-link-context">
              <select id="affiliate-link-context" name="context" className="admin-select">
                <option value="">Select context</option>
                {CONTEXT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>

          <AdminField label="Destination URL" htmlFor="affiliate-link-destination">
            <AdminInput
              id="affiliate-link-destination"
              name="destinationUrl"
              required
              placeholder="https://partner.example.com/product?aff_id=..."
            />
          </AdminField>

          <AdminField label="Related blog post (optional)" htmlFor="affiliate-link-blog-post">
            <select id="affiliate-link-blog-post" name="blogPostId" className="admin-select">
              <option value="">None</option>
              {blogPosts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
          </AdminField>

          <div>
            <AdminButton type="submit" variant="primary">
              Generate link
            </AdminButton>
          </div>
        </form>

        {createdShortUrl && (
          <AdminSurface variant="muted" className="admin-stack gap-3">
            <p className="admin-eyebrow">Generated short URL</p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="admin-table-code break-all">{createdShortUrl}</p>
              <AffiliateLinkCopyButton value={createdShortUrl} />
            </div>
          </AdminSurface>
        )}
      </AdminSurface>

      <AdminSurface className="admin-stack">
        <AdminToolbar
          left={
            <AdminTabs
              ariaLabel="Sort affiliate links"
              activeValue={sort}
              tabs={[
                { label: 'Most Recent', href: '/admin/affiliate-links', value: 'recent' },
                { label: 'Most Clicked', href: '/admin/affiliate-links?sort=clicks', value: 'clicks' },
              ]}
            />
          }
        />

        <AdminTable
          density="comfortable"
          columns={[
            { key: 'link', label: 'Short URL' },
            { key: 'partner', label: 'Partner' },
            { key: 'network', label: 'Network' },
            { key: 'context', label: 'Context' },
            { key: 'clicks', label: 'Click count', align: 'right' },
            { key: 'lastClicked', label: 'Last clicked', align: 'right' },
          ]}
          emptyState={
            <AdminEmptyState
              title="No affiliate links yet"
              hint="Generate your first short link to begin tracking marketing and blog clicks."
            />
          }
        >
          {sortedLinks.map((link) => {
            const shortUrl = `${siteOrigin}/r/${link.shortCode}`;
            const lastClickedAt = link.clicks[0]?.createdAt ?? null;

            return (
              <tr key={link.id} className="admin-row">
                <td>
                  <div className="admin-stack gap-1">
                    <Link href={shortUrl} target="_blank" className="admin-table-code hover:opacity-80">
                      {shortUrl}
                    </Link>
                    <p className="admin-micro truncate">→ {link.destinationUrl}</p>
                    {link.blogPost ? (
                      <p className="admin-micro">
                        Post:{' '}
                        <Link href={`/blog/${link.blogPost.slug}`} target="_blank" className="underline underline-offset-2">
                          {link.blogPost.title}
                        </Link>
                      </p>
                    ) : null}
                  </div>
                </td>
                <td>{link.affiliate.name}</td>
                <td>{link.affiliate.network}</td>
                <td>{link.context || '—'}</td>
                <td className="text-right">{link._count.clicks}</td>
                <td className="text-right admin-micro">{formatDateTime(lastClickedAt)}</td>
              </tr>
            );
          })}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
