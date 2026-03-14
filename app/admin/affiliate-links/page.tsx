import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import AffiliateLinkCopyButton from '@/components/admin/AffiliateLinkCopyButton';
import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
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
import { listAffiliateLinkOptions } from '@/lib/server/affiliateBrands';

type SearchParams = Promise<{ sort?: string; created?: string }> | undefined;
type SortMode = 'recent' | 'clicks';

const CONTEXT_OPTIONS = [
  'blog',
  'guides',
  'services',
  'homepage',
  'book',
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
      where: { code },
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

  const partnerId = asText(formData.get('partnerId'));
  const sourceLinkId = asText(formData.get('sourceLinkId'));
  const destinationUrl = asText(formData.get('destinationUrl'));
  const label = asText(formData.get('context'));
  const blogPostId = asText(formData.get('blogPostId'));

  const sourceLink = sourceLinkId
    ? await prisma.affiliateLink.findUnique({
        where: { id: sourceLinkId },
        select: {
          id: true,
          partnerId: true,
          programId: true,
          name: true,
          url: true,
          destinationUrl: true,
        },
      })
    : null;

  const resolvedDestinationUrl = sourceLink
    ? sourceLink.url?.trim() || sourceLink.destinationUrl?.trim() || ''
    : destinationUrl;
  const resolvedPartnerId = sourceLink?.partnerId ?? partnerId;

  if (!resolvedDestinationUrl || (!resolvedPartnerId && !sourceLink?.programId)) {
    redirect('/admin/affiliate-links');
  }

  const shortCode = await generateShortCode();

  await prisma.affiliateLink.create({
    data: {
      partnerId: resolvedPartnerId || null,
      programId: sourceLink?.programId ?? null,
      name: sourceLink?.name ?? null,
      url: sourceLink ? resolvedDestinationUrl : destinationUrl,
      destinationUrl: resolvedDestinationUrl,
      code: shortCode,
      label: label || null,
      blogPostId: blogPostId || null,
    },
  });

  redirect(`/admin/affiliate-links?created=${encodeURIComponent(shortCode)}`);
}

export const dynamic = 'force-dynamic';

export default async function AdminAffiliateLinksPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : undefined;
  const sort = normalizeSort(params?.sort);
  const createdCode = params?.created ? params.created.trim() : '';

  const [affiliateOptions, savedLinkOptions, blogPosts, links] = await Promise.all([
    prisma.affiliatePartner.findMany({
      where: { isActive: true },
      orderBy: [{ network: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        network: true,
      },
    }),
    listAffiliateLinkOptions(),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    }),
    prisma.affiliateLink.findMany({
      where: {
        code: {
          not: null,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            network: true,
          },
        },
        program: {
          select: {
            id: true,
            network: true,
            brand: {
              select: {
                id: true,
                name: true,
              },
            },
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
            <AdminField label="Saved affiliate link (optional)" htmlFor="affiliate-link-source">
              <select id="affiliate-link-source" name="sourceLinkId" className="admin-select">
                <option value="">Paste a destination manually</option>
                {savedLinkOptions.map((link) => (
                  <option key={link.id} value={link.id}>
                    {link.label}
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Affiliate partner" htmlFor="affiliate-link-partner">
              <select id="affiliate-link-partner" name="partnerId" className="admin-select">
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
              placeholder="Leave blank when using a saved affiliate link"
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
            const shortUrl = `${siteOrigin}/r/${link.code!}`;
            const lastClickedAt = link.clicks[0]?.createdAt ?? null;

            return (
              <tr key={link.id} className="admin-row">
                <td>
                  <div className="admin-stack gap-1">
                    <Link href={shortUrl} target="_blank" className="admin-table-code hover:opacity-80">
                      {shortUrl}
                    </Link>
                    <p className="admin-micro truncate">→ {link.destinationUrl ?? link.url ?? '—'}</p>
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
                <td>
                  {link.partner ? (
                    <AffiliatePartnerIdentity name={link.partner.name} network={link.partner.network} size="sm" />
                  ) : (
                    link.program ? (
                      <AffiliatePartnerIdentity
                        name={link.program.brand.name}
                        network={link.program.network}
                        size="sm"
                      />
                    ) : '—'
                  )}
                </td>
                <td>{link.partner?.network || link.program?.network || '—'}</td>
                <td>{link.label || '—'}</td>
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
