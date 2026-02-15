import Link from 'next/link';
import { redirect } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import { generateUniqueSlug } from '@/lib/blog';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';

const asText = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value.trim() : '';

async function createPost(formData: FormData) {
  'use server';

  const title = asText(formData.get('title'));
  const slugInput = asText(formData.get('slug'));
  const excerpt = asText(formData.get('excerpt'));
  const coverImage = asText(formData.get('coverImage'));
  const content = asText(formData.get('content'));
  const published = formData.get('published') === 'on';

  if (!title) {
    throw new Error('Title is required');
  }

  if (!content) {
    throw new Error('Content is required');
  }

  const session = await requireAdminSession();
  const slug = await generateUniqueSlug(slugInput || title);

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      content,
      published,
      authorId: session.user.id,
    },
  });

  redirect('/admin/blog');
}

export default async function AdminBlogNewPage() {
  await requireAdminSession();

  return (
    <div className="space-y-6">
      <Hero
        eyebrow="New Post"
        title="Create a journal post"
        subtitle="Draft now, publish when ready. Slugs are generated automatically if left blank."
        image="/assets/hero/hero-05.jpg"
      />

      <form action={createPost} className="card admin-form">
        <div className="form-field">
          <label className="form-field__label" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" className="form-field__input" required />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="slug">
            Slug
          </label>
          <input id="slug" name="slug" className="form-field__input" placeholder="auto-generated-if-empty" />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="excerpt">
            Excerpt
          </label>
          <textarea id="excerpt" name="excerpt" className="form-field__textarea" rows={3} />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="coverImage">
            Cover Image URL
          </label>
          <input id="coverImage" name="coverImage" className="form-field__input" />
        </div>

        <div className="form-field">
          <label className="form-field__label" htmlFor="content">
            Content
          </label>
          <textarea id="content" name="content" className="form-field__textarea" rows={12} required />
        </div>

        <label className="form-field form-field--inline" htmlFor="published">
          <input id="published" type="checkbox" name="published" />
          <span>Published</span>
        </label>

        <div className="admin-actions-row">
          <button type="submit" className="btn btn--primary">
            Save Post
          </button>
          <Link href="/admin/blog" className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
