import { notFound } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import {
  listAffiliateBrandOptions,
  resolveAffiliateBrandIdsFromLegacyAffiliateIds,
} from '@/lib/server/affiliateBrands';
import { listBlogAuthorOptions } from '@/lib/server/blogAuthors';
import { listAffiliatePartnerOptions } from '@/lib/server/affiliatePartners';
import { postEditorSelect, toPostEditorRecord } from '@/lib/server/postEditorRecord';
import prisma from '@/lib/server/prisma';

export const dynamic = 'force-dynamic';

type EditPostProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: postEditorSelect,
  });

  if (!post) notFound();

  const [affiliateBrandOptions, affiliatePartnerOptions, fallbackAffiliateBrandIds, authorOptions] = await Promise.all([
    listAffiliateBrandOptions(),
    listAffiliatePartnerOptions(),
    resolveAffiliateBrandIdsFromLegacyAffiliateIds(post.affiliates.map((entry) => entry.affiliateId)),
    listBlogAuthorOptions(),
  ]);
  const editorPost = toPostEditorRecord(post);

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
          ...editorPost,
          category: normalizeBlogCategory(editorPost.category),
          affiliateBrandIds: editorPost.affiliateBrandIds.length > 0 ? editorPost.affiliateBrandIds : fallbackAffiliateBrandIds,
        }}
        affiliateBrandOptions={affiliateBrandOptions}
        affiliatePartnerOptions={affiliatePartnerOptions}
        authorOptions={authorOptions}
      />
    </AdminStack>
  );
}
