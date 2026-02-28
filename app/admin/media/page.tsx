import { redirect } from 'next/navigation';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import MediaUrlCopyButton from '@/components/admin/MediaUrlCopyButton';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { formatFileSize, isImageMediaType } from '@/lib/media';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { deleteFromStorageByUrl, getStorageBucketName, isStorageConfigured } from '@/lib/server/storage';

type SearchParams = Promise<{ deleted?: string; error?: string }> | undefined;

const formatDateTime = (value: Date) =>
  value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const asText = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

async function deleteMediaAction(formData: FormData) {
  'use server';

  await requireAdminSession();

  const mediaId = asText(formData.get('mediaId'));
  if (!mediaId) {
    redirect('/admin/media?error=missing');
  }

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: {
      id: true,
      url: true,
      _count: {
        select: {
          posts: true,
          featuredInPosts: true,
        },
      },
    },
  });

  if (!media) {
    redirect('/admin/media?error=missing');
  }

  if (media._count.posts > 0 || media._count.featuredInPosts > 0) {
    redirect('/admin/media?error=attached');
  }

  try {
    await deleteFromStorageByUrl(media.url);
    await prisma.media.delete({ where: { id: media.id } });
    redirect('/admin/media?deleted=1');
  } catch {
    redirect('/admin/media?error=delete');
  }
}

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage({ searchParams }: { searchParams?: SearchParams }) {
  await requireAdminSession();
  const params = searchParams ? await searchParams : undefined;
  const deleted = params?.deleted === '1';
  const error = params?.error ?? '';

  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url: true,
      fileName: true,
      fileType: true,
      fileSize: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          featuredInPosts: true,
        },
      },
    },
  });

  const bucketName = isStorageConfigured() ? getStorageBucketName() : null;

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Media"
        title="Media library"
          subtitle={
          bucketName
            ? `Uploaded blog assets stored in the ${bucketName} bucket.`
            : 'Storage is not configured yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable uploads. SUPABASE_STORAGE_BUCKET defaults to blog-media.'
        }
      />

      {(deleted || error) && (
        <AdminSurface variant="muted">
          <p className={`admin-body ${error ? 'text-admin-danger' : 'text-admin-success'}`}>
            {deleted
              ? 'Media deleted.'
              : error === 'attached'
                ? 'This media is still attached to a post and cannot be deleted.'
                : error === 'delete'
                  ? 'Unable to delete media from storage.'
                  : 'Media item not found.'}
          </p>
        </AdminSurface>
      )}

      {mediaItems.length === 0 ? (
        <AdminSurface>
          <AdminEmptyState
            title="No media uploaded yet"
            hint="Upload files from the blog editor to populate the library."
          />
        </AdminSurface>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mediaItems.map((media) => {
            const isAttached = media._count.posts > 0 || media._count.featuredInPosts > 0;

            return (
              <AdminSurface key={media.id} className="admin-stack gap-4">
                <div className="overflow-hidden rounded-2xl border border-[var(--admin-color-border)] bg-[rgba(0,0,0,0.03)]">
                  {isImageMediaType(media.fileType) ? (
                    <img
                      src={media.url}
                      alt={media.fileName}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center px-6 text-center">
                      <div className="space-y-2">
                        <p className="admin-eyebrow">PDF</p>
                        <p className="admin-body">Document preview unavailable</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="admin-stack gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="admin-chip admin-chip--draft">{media.fileType}</span>
                    <span className="admin-micro">{formatFileSize(media.fileSize)}</span>
                  </div>
                  <p className="font-serif text-[1.05rem] leading-tight text-admin">{media.fileName}</p>
                  <p className="admin-micro">Uploaded {formatDateTime(media.createdAt)}</p>
                  <p className="admin-micro">
                    {isAttached
                      ? `Attached to ${media._count.featuredInPosts + media._count.posts} post placement${media._count.featuredInPosts + media._count.posts === 1 ? '' : 's'}.`
                      : 'Not attached to any post.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <MediaUrlCopyButton value={media.url} />
                  <AdminButton asChild variant="ghost" size="sm">
                    <a href={media.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </AdminButton>
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="mediaId" value={media.id} />
                    <AdminButton type="submit" variant="ghost" size="sm" disabled={isAttached}>
                      Delete
                    </AdminButton>
                  </form>
                </div>
              </AdminSurface>
            );
          })}
        </div>
      )}
    </AdminStack>
  );
}
