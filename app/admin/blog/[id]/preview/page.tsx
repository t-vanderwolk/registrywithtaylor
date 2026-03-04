import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import PostArticleView, { type PostArticleRecord } from '@/components/blog/PostArticleView';
import { getPublicPostWhere, isPostPubliclyVisible } from '@/lib/blog/postStatus';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type AdminBlogPreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogPreviewPage({ params }: AdminBlogPreviewPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      content: true,
      deck: true,
      excerpt: true,
      featuredImageUrl: true,
      coverImage: true,
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
      affiliates: {
        where: {
          affiliate: {
            isActive: true,
          },
        },
        select: {
          affiliate: {
            select: {
              id: true,
              name: true,
              network: true,
            },
          },
        },
      },
      status: true,
      publishedAt: true,
      scheduledFor: true,
      archivedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post) {
    notFound();
  }

  const relatedPosts = await prisma.post.findMany({
    where: {
      ...getPublicPostWhere(),
      NOT: {
        id: post.id,
      },
    },
    orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      publishedAt: true,
      scheduledFor: true,
      createdAt: true,
    },
  });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Preview"
        title={post.title?.trim() ? post.title : 'Untitled post'}
        subtitle="This preview reuses the public article renderer without incrementing public view analytics."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href={`/admin/blog/${post.id}/edit`}>Back to editor</Link>
            </AdminButton>
            {isPostPubliclyVisible(post.status, post.scheduledFor) ? (
              <AdminButton asChild variant="ghost">
                <Link href={`/blog/${post.slug}`} target="_blank">
                  View public page
                </Link>
              </AdminButton>
            ) : null}
          </>
        }
      />

      <PostArticleView
        post={post as PostArticleRecord}
        relatedPosts={relatedPosts.map((relatedPost) => ({
          ...relatedPost,
          category: normalizeBlogCategory(relatedPost.category),
        }))}
        trackView={false}
      />
    </AdminStack>
  );
}
