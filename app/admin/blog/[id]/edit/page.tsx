import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import { generateUniqueSlug } from '@/lib/blog';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';

const asText = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

async function updatePost(formData: FormData) {
  'use server';

  const postId = asText(formData.get('postId'));
  const title = asText(formData.get('title'));
  const slugInput = asText(formData.get('slug'));
  const excerpt = asText(formData.get('excerpt'));
  const coverImage = asText(formData.get('coverImage'));
  const content = asText(formData.get('content'));
  const published = formData.get('published') === 'on';

  if (!postId) {
    throw new Error('Missing post ID');
  }

  if (!title) {
    throw new Error('Title is required');
  }

  if (!content) {
    throw new Error('Content is required');
  }

  await requireAdminSession();

  const slug = await generateUniqueSlug(slugInput || title, postId);

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      content,
      published,
    },
  });

  redirect('/admin/blog');
}

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  await requireAdminSession();

  const { id } = await Promise.resolve(params);
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Hero
        eyebrow="Edit Post"
        title={post.title}
        subtitle="Update copy, cover image, slug, and publish status."
        image={post.coverImage ?? '/assets/hero/hero-04.jpg'}
      />

      <form action={updatePost} className="card admin-form">
        <input type="hidden" name="postId" value={post.id} />

        <div className="form-field">
          <label className="form-field__label" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" defaultValue={post.title} className="form-field__input" required />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="slug">
            Slug
          </label>
          <input id="slug" name="slug" defaultValue={post.slug} className="form-field__input" />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="excerpt">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            className="form-field__textarea"
            rows={3}
            defaultValue={post.excerpt ?? ''}
          />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="coverImage">
            Cover Image URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            defaultValue={post.coverImage ?? ''}
            className="form-field__input"
          />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="form-field__textarea"
            rows={12}
            required
            defaultValue={post.content}
          />
        </div>

        <label className="form-field form-field--inline" htmlFor="published">
          <input id="published" type="checkbox" name="published" defaultChecked={post.published} />
          <span>Published</span>
        </label>

        <div className="admin-actions-row">
          <button type="submit" className="btn btn--primary">
            Save Changes
          </button>
          <Link href="/admin/blog" className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
