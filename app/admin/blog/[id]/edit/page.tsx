import { notFound } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import {
  listAffiliateBrandOptions,
  resolveAffiliateBrandIdsFromLegacyAffiliateIds,
} from '@/lib/server/affiliateBrands';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type EditPostProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      stage: true,
      deck: true,
      excerpt: true,
      focusKeyword: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      featuredImageUrl: true,
      coverImage: true,
      featuredImageId: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
      media: {
        select: {
          id: true,
          url: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      },
      content: true,
      status: true,
      publishedAt: true,
      scheduledFor: true,
      archivedAt: true,
      featured: true,
      published: true,
      affiliates: {
        select: {
          affiliate: {
            select: {
              id: true,
              brandId: true,
            },
          },
        },
      },
      affiliateBrands: {
        select: {
          id: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post) notFound();

  const [affiliateBrandOptions, affiliatePartnerOptions, fallbackAffiliateBrandIds] = await Promise.all([
    listAffiliateBrandOptions(),
    prisma.affiliatePartner.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        network: true,
        logoUrl: true,
      },
    }),
    resolveAffiliateBrandIdsFromLegacyAffiliateIds(post.affiliates.map((entry) => entry.affiliate.id)),
  ]);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Publish"
        title={post.title?.trim() ? post.title : 'Untitled post'}
        subtitle="Autosave is enabled. Keep the draft moving without leaving the workspace."
      />
      <PostEditor
        key={post.id}
        initialPost={{
          ...post,
          category: normalizeBlogCategory(post.category),
          mediaIds: post.media.map((entry) => entry.id),
          affiliateBrandIds:
            post.affiliateBrands.length > 0
              ? post.affiliateBrands.map((entry) => entry.id)
              : fallbackAffiliateBrandIds,
        }}
        affiliateBrandOptions={affiliateBrandOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
      />
    </AdminStack>
  );
}
