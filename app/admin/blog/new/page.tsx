import BlogDraftEditor from '@/components/admin/BlogDraftEditor';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { generateUniqueSlug } from '@/lib/blog';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export default async function NewDraftPage() {
  const session = await requireAdminSession();
  const slug = await generateUniqueSlug(`untitled-post-${Date.now()}`);

  const post = await prisma.post.create({
    data: {
      title: 'Untitled post',
      slug,
      excerpt: '',
      coverImage: '',
      content: 'Start writing...',
      published: false,
      authorId: session.user.id,
    },
  });

  const affiliateOptions = await prisma.affiliatePartner.findMany({
    where: { isActive: true },
    orderBy: [{ network: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      network: true,
    },
  });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Blog"
        title="New post"
        subtitle="Start with confidence. Then refine with calm editorial cadence."
      />
      <AdminSurface>
        <BlogDraftEditor draftId={post.id} initialDraft={{ ...post, affiliateIds: [] }} affiliateOptions={affiliateOptions} />
      </AdminSurface>
    </AdminStack>
  );
}
