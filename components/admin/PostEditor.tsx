'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AffiliateNetwork } from '@prisma/client';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminToast from '@/components/admin/ui/AdminToast';

type AffiliateOption = {
  id: string;
  name: string;
  network: AffiliateNetwork;
};

type PostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  content: string;
  published: boolean;
  affiliateIds: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getSavedText(saving: boolean, savedAt: number | null) {
  if (saving) return 'Saving changes...';
  if (savedAt) return `Saved at ${new Date(savedAt).toLocaleTimeString()}`;
  return 'Autosave is on. Changes save every few seconds.';
}

export default function PostEditor({
  postId,
  initialPost,
  affiliateOptions,
}: {
  postId: string;
  initialPost: PostRecord;
  affiliateOptions: AffiliateOption[];
}) {
  const [post, setPost] = useState<PostRecord>(initialPost);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<number | null>(null);

  const apiUrl = useMemo(() => `/api/blog/${postId}`, [postId]);

  async function save(partial: Partial<PostRecord>) {
    setSaving(true);
    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok && json?.id) {
      setPost(json as PostRecord);
      setSavedAt(Date.now());
    }
  }

  function queueSave(partial: Partial<PostRecord>) {
    setPost((currentPost) => ({ ...currentPost, ...partial }));
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      void save(partial);
    }, 350);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <AdminStack gap="lg">
      <div className="admin-surface-muted md:sticky md:top-4 md:z-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <AdminToast tone={saving ? 'warning' : 'success'}>{getSavedText(saving, savedAt)}</AdminToast>
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton asChild variant="secondary" size="sm">
              <Link href="/admin/blog" aria-label="Back to posts">
                Back to posts
              </Link>
            </AdminButton>
            <AdminButton variant="ghost" size="sm" disabled aria-disabled="true">
              Preview on site (coming soon)
            </AdminButton>
            <AdminButton variant="primary" size="sm" onClick={() => void save(post)}>
              Save now
            </AdminButton>
          </div>
        </div>
      </div>

      <AdminStack gap="lg" className="pb-2">
        <AdminField label="Title" htmlFor="post-title">
          <AdminInput
            id="post-title"
            value={post.title ?? ''}
            onChange={(event) => {
              const title = event.target.value;
              const nextSlug = post.slug && post.slug.trim().length > 0 ? post.slug : slugify(title);
              queueSave({ title, slug: nextSlug });
            }}
            placeholder="The Art of the Registry"
          />
        </AdminField>

        <AdminField label="Slug" htmlFor="post-slug" help="If left empty, slug is generated from the title.">
          <AdminInput
            id="post-slug"
            value={post.slug ?? ''}
            onChange={(event) => queueSave({ slug: event.target.value })}
            placeholder="auto-generated-if-empty"
          />
        </AdminField>

        <AdminField label="Excerpt" htmlFor="post-excerpt">
          <AdminTextarea
            id="post-excerpt"
            value={post.excerpt ?? ''}
            onChange={(event) => queueSave({ excerpt: event.target.value })}
            className="min-h-[130px]"
            placeholder="A calm, practical approach to building a registry that fits your real life."
          />
        </AdminField>

        <AdminField
          label="Cover Image URL"
          htmlFor="post-cover-image"
          help="Use a hero-safe image without baked-in copy."
        >
          <AdminInput
            id="post-cover-image"
            value={post.coverImage ?? ''}
            onChange={(event) => queueSave({ coverImage: event.target.value })}
            placeholder="/assets/blog/the-art-of-the-registry.jpg"
          />
        </AdminField>

        <AdminField label="Publishing" htmlFor="post-published" help="Published posts are visible on the public blog.">
          <label className="admin-toggle" htmlFor="post-published">
            <input
              id="post-published"
              type="checkbox"
              checked={post.published}
              onChange={(event) => queueSave({ published: event.target.checked })}
            />
            <span>Published</span>
          </label>
        </AdminField>

        <AdminField
          label="Affiliate Partners"
          htmlFor="post-affiliates"
          help="Select all relevant active partners for this post."
        >
          <select
            id="post-affiliates"
            className="admin-select min-h-[180px]"
            multiple
            value={post.affiliateIds ?? []}
            onChange={(event) => {
              const affiliateIds = Array.from(event.target.selectedOptions).map((option) => option.value);
              queueSave({ affiliateIds });
            }}
          >
            {affiliateOptions.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name} ({partner.network})
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField label="Content" htmlFor="post-content">
          <AdminTextarea
            id="post-content"
            value={post.content ?? ''}
            onChange={(event) => queueSave({ content: event.target.value })}
            className="min-h-[420px]"
            placeholder="Paste your draft here..."
          />
        </AdminField>
      </AdminStack>
    </AdminStack>
  );
}
