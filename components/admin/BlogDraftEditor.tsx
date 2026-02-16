'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import AdminToast from '@/components/admin/ui/AdminToast';

type DraftStatus = 'draft' | 'published';

type Draft = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImageUrl?: string;
  content?: string;
  status?: DraftStatus;
  createdAt?: number;
  updatedAt?: number;
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

export default function BlogDraftEditor({ draftId, initialDraft }: { draftId: string; initialDraft: Draft }) {
  const [draft, setDraft] = useState<Draft>({
    ...initialDraft,
    status: initialDraft.status === 'published' ? 'published' : 'draft',
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<number | null>(null);

  const apiUrl = useMemo(() => `/api/admin/blog/${draftId}`, [draftId]);

  async function save(partial: Partial<Draft>) {
    setSaving(true);
    const res = await fetch(apiUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok && json?.draft) {
      setDraft({
        ...json.draft,
        status: json.draft.status === 'published' ? 'published' : 'draft',
      });
      setSavedAt(Date.now());
    }
  }

  function queueSave(partial: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...partial }));
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
              <Link href="/admin/blog" aria-label="Back to drafts">
                Back to drafts
              </Link>
            </AdminButton>
            <AdminButton variant="ghost" size="sm" disabled aria-disabled="true">
              Preview on site (coming soon)
            </AdminButton>
            <AdminButton variant="primary" size="sm" onClick={() => void save(draft)}>
              Save now
            </AdminButton>
          </div>
        </div>
      </div>

      <AdminStack gap="lg" className="pb-2">
        <AdminField label="Title" htmlFor="draft-title">
          <AdminInput
            id="draft-title"
            value={draft.title ?? ''}
            onChange={(event) => {
              const title = event.target.value;
              const nextSlug = draft.slug && draft.slug.trim().length > 0 ? draft.slug : slugify(title);
              queueSave({ title, slug: nextSlug });
            }}
            placeholder="The Art of the Registry"
          />
        </AdminField>

        <AdminField label="Slug" htmlFor="draft-slug" help="If left empty, slug is generated from the title.">
          <AdminInput
            id="draft-slug"
            value={draft.slug ?? ''}
            onChange={(event) => queueSave({ slug: event.target.value })}
            placeholder="auto-generated-if-empty"
          />
        </AdminField>

        <AdminField label="Excerpt" htmlFor="draft-excerpt">
          <AdminTextarea
            id="draft-excerpt"
            value={draft.excerpt ?? ''}
            onChange={(event) => queueSave({ excerpt: event.target.value })}
            className="min-h-[130px]"
            placeholder="A calm, practical approach to building a registry that fits your real life."
          />
        </AdminField>

        <AdminField
          label="Cover Image URL"
          htmlFor="draft-cover-image"
          help="Use a hero-safe image without baked-in copy."
        >
          <AdminInput
            id="draft-cover-image"
            value={draft.coverImageUrl ?? ''}
            onChange={(event) => queueSave({ coverImageUrl: event.target.value })}
            placeholder="/assets/blog/the-art-of-the-registry.jpg"
          />
        </AdminField>

        <AdminField label="Publishing" htmlFor="draft-published" help="Toggles local draft status only.">
          <label className="admin-toggle" htmlFor="draft-published">
            <input
              id="draft-published"
              type="checkbox"
              checked={draft.status === 'published'}
              onChange={(event) => queueSave({ status: event.target.checked ? 'published' : 'draft' })}
            />
            <span>Published</span>
          </label>
        </AdminField>

        <AdminField label="Content" htmlFor="draft-content">
          <AdminTextarea
            id="draft-content"
            value={draft.content ?? ''}
            onChange={(event) => queueSave({ content: event.target.value })}
            className="min-h-[420px]"
            placeholder="Paste your draft here..."
          />
        </AdminField>
      </AdminStack>
    </AdminStack>
  );
}
