import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { generateUniqueSlug } from '@/lib/blog';

async function updatePost(formData: FormData) {
  'use server';
  const postId = formData.get('postId');
  const titleInput = formData.get('title');
  const contentInput = formData.get('content');

  if (!postId || typeof postId !== 'string') {
    throw new Error('Missing post ID');
  }

  if (!titleInput || typeof titleInput !== 'string') {
    throw new Error('Title is required');
  }

  if (!contentInput || typeof contentInput !== 'string') {
    throw new Error('Content is required');
  }

  await requireAdminSession();

  const published = formData.get('published') === 'on';
  const excerptInput = formData.get('excerpt');
  const slug = await generateUniqueSlug(titleInput, postId);

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: titleInput.trim(),
      slug,
      excerpt:
        typeof excerptInput === 'string' ? excerptInput.trim() || null : null,
      content: contentInput.trim(),
      published,
    },
  });

  redirect('/admin/blog');
}

export default async function AdminBlogEditPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Edit post</p>
        <h1>{post.title}</h1>
      </header>

      <form action={updatePost} className="card space-y-4">
        <input type="hidden" name="postId" value={post.id} />

        <div className="form-field">
          <label className="form-field__label" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" defaultValue={post.title} className="form-field__input" required />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="excerpt">
            Excerpt / summary
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            className="form-field__textarea"
            rows={2}
            defaultValue={post.excerpt ?? ''}
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
            rows={8}
            required
            defaultValue={post.content}
          />
        </div>

        <label className="form-field">
          <input type="checkbox" name="published" defaultChecked={post.published} />
          <span style={{ marginLeft: '0.5rem' }}>Published</span>
        </label>

        <div className="hero__actions" style={{ justifyContent: 'flex-start' }}>
          <button type="submit" className="btn btn--primary">
            Save changes
          </button>
          <Link href="/admin/blog" className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
