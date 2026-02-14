import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { generateUniqueSlug } from '@/lib/blog';

async function createPost(formData: FormData) {
  'use server';
  const titleInput = formData.get('title');
  const contentInput = formData.get('content');

  if (!titleInput || typeof titleInput !== 'string') {
    throw new Error('Title is required');
  }

  if (!contentInput || typeof contentInput !== 'string') {
    throw new Error('Content is required');
  }

  const session = await requireAdminSession();
  const slug = await generateUniqueSlug(titleInput);
  const published = formData.get('published') === 'on';
  const excerptInput = formData.get('excerpt');

  await prisma.post.create({
    data: {
      title: titleInput.trim(),
      slug,
      excerpt:
        typeof excerptInput === 'string' ? excerptInput.trim() || null : null,
      content: contentInput.trim(),
      published,
      authorId: session.user.id,
    },
  });

  redirect('/admin/blog');
}

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">New post</p>
        <h1>Create journal entry</h1>
        <p className="body-copy">
          Fill in the post details and publish when you are ready. Drafts stay private until you hit publish.
        </p>
      </header>

      <form action={createPost} className="card space-y-4">
        <div className="form-field">
          <label className="form-field__label" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" className="form-field__input" required />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="excerpt">
            Excerpt / summary
          </label>
          <textarea id="excerpt" name="excerpt" className="form-field__textarea" rows={2} />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="content">
            Content
          </label>
          <textarea id="content" name="content" className="form-field__textarea" rows={8} required />
        </div>

        <label className="form-field">
          <input type="checkbox" name="published" />
          <span style={{ marginLeft: '0.5rem' }}>Publish now</span>
        </label>

        <div className="hero__actions" style={{ justifyContent: 'flex-start' }}>
          <button type="submit" className="btn btn--primary">
            Save post
          </button>
          <Link href="/admin/blog" className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
