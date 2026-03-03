'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminToolbar from '@/components/admin/patterns/AdminToolbar';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminInput from '@/components/admin/ui/AdminInput';
import StatusPill from '@/components/admin/ui/StatusPill';
import AdminTable from '@/components/admin/ui/AdminTable';
import { POST_STATUS_LABELS, type PostStatusValue } from '@/lib/blog/postStatus';

type BlogWorkspacePost = {
  id: string;
  title: string;
  slug: string;
  deck: string | null;
  excerpt: string | null;
  status: PostStatusValue;
  publishedAt: string | null;
  scheduledFor: string | null;
  archivedAt: string | null;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorLabel: string;
};

type Notice = {
  tone: 'error' | 'success';
  message: string;
};

type StatusFilter = 'all' | PostStatusValue;

type ActionState = {
  key: string;
  action: 'duplicate' | 'set-status' | 'bulk' | 'delete';
} | null;

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const toIsoFromLocalDateTime = (value: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

function mapApiPost(payload: Record<string, unknown>) {
  return {
    id: String(payload.id),
    title: typeof payload.title === 'string' ? payload.title : 'Untitled post',
    slug: typeof payload.slug === 'string' ? payload.slug : '',
    deck: typeof payload.deck === 'string' ? payload.deck : null,
    excerpt: typeof payload.excerpt === 'string' ? payload.excerpt : null,
    status: payload.status as PostStatusValue,
    publishedAt: typeof payload.publishedAt === 'string' ? payload.publishedAt : null,
    scheduledFor: typeof payload.scheduledFor === 'string' ? payload.scheduledFor : null,
    archivedAt: typeof payload.archivedAt === 'string' ? payload.archivedAt : null,
    featured: Boolean(payload.featured),
    published: Boolean(payload.published),
    createdAt: typeof payload.createdAt === 'string' ? payload.createdAt : new Date().toISOString(),
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : new Date().toISOString(),
    authorLabel: typeof payload.authorLabel === 'string' ? payload.authorLabel : 'You',
  } satisfies BlogWorkspacePost;
}

export default function BlogWorkspace({ posts }: { posts: BlogWorkspacePost[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');
  const [rows, setRows] = useState(posts);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkScheduleFor, setBulkScheduleFor] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [actionState, setActionState] = useState<ActionState>(null);
  const deferredSearch = useDeferredValue(searchValue);

  const visiblePosts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return rows.filter((post) => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [post.title, post.slug, post.deck ?? '', post.excerpt ?? '', post.authorLabel]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [deferredSearch, rows, statusFilter]);

  const allVisibleSelected = visiblePosts.length > 0 && visiblePosts.every((post) => selectedIds.includes(post.id));

  function setRow(nextPost: BlogWorkspacePost) {
    setRows((currentRows) => currentRows.map((post) => (post.id === nextPost.id ? nextPost : post)));
  }

  async function updatePostStatus(postId: string, status: PostStatusValue, scheduledFor?: string | null) {
    const response = await fetch(`/api/blog/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        scheduledFor: status === 'SCHEDULED' ? scheduledFor : null,
      }),
    });
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok || !payload?.id) {
      throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to update the post.');
    }

    return mapApiPost({
      ...payload,
      authorLabel: rows.find((post) => post.id === String(payload.id))?.authorLabel ?? 'You',
    });
  }

  async function duplicatePost(postId: string) {
    setActionState({ key: postId, action: 'duplicate' });
    setNotice(null);

    try {
      const sourceRes = await fetch(`/api/blog/${postId}`);
      const sourceJson = (await sourceRes.json().catch(() => null)) as Record<string, unknown> | null;

      if (!sourceRes.ok || !sourceJson?.id) {
        throw new Error(typeof sourceJson?.error === 'string' ? sourceJson.error : 'Unable to load the source post.');
      }

      const duplicateRes = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${typeof sourceJson.title === 'string' ? sourceJson.title : 'Untitled post'} (Copy)`,
          slug: '',
          category: sourceJson.category,
          deck: sourceJson.deck,
          excerpt: sourceJson.excerpt,
          coverImage: sourceJson.coverImage,
          featuredImageId: sourceJson.featuredImageId,
          content: sourceJson.content,
          mediaIds: sourceJson.mediaIds ?? [],
          status: 'DRAFT',
          featured: false,
          affiliateIds: sourceJson.affiliateIds ?? [],
        }),
      });

      const duplicateJson = (await duplicateRes.json().catch(() => null)) as Record<string, unknown> | null;
      if (!duplicateRes.ok || !duplicateJson?.id) {
        throw new Error(typeof duplicateJson?.error === 'string' ? duplicateJson.error : 'Unable to duplicate the post.');
      }

      setRows((currentRows) => [
        mapApiPost({
          ...duplicateJson,
          authorLabel: rows.find((post) => post.id === postId)?.authorLabel ?? 'You',
        }),
        ...currentRows,
      ]);
      setNotice({ tone: 'success', message: 'Draft duplicated. Opening the new copy.' });
      router.push(`/admin/blog/${duplicateJson.id}/edit`);
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to duplicate the post.',
      });
    } finally {
      setActionState(null);
    }
  }

  async function deletePost(postId: string) {
    const target = rows.find((post) => post.id === postId);
    if (!target) {
      return;
    }

    const confirmed = window.confirm(`Delete "${target.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setActionState({ key: postId, action: 'delete' });
    setNotice(null);

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to delete the post.');
      }

      setRows((currentRows) => currentRows.filter((post) => post.id !== postId));
      setSelectedIds((currentIds) => currentIds.filter((id) => id !== postId));
      setNotice({ tone: 'success', message: 'Post deleted.' });
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to delete the post.',
      });
    } finally {
      setActionState(null);
    }
  }

  async function handleRowStatusChange(postId: string, status: PostStatusValue) {
    setActionState({ key: postId, action: 'set-status' });
    setNotice(null);

    try {
      const nextPost = await updatePostStatus(postId, status, null);
      setRow(nextPost);
      setNotice({ tone: 'success', message: `Post moved to ${POST_STATUS_LABELS[status].toLowerCase()}.` });
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to update the post.',
      });
    } finally {
      setActionState(null);
    }
  }

  async function handleBulkStatusChange(status: PostStatusValue) {
    if (selectedIds.length === 0) {
      setNotice({ tone: 'error', message: 'Select at least one post first.' });
      return;
    }

    const scheduledFor = status === 'SCHEDULED' ? toIsoFromLocalDateTime(bulkScheduleFor) : null;
    if (status === 'SCHEDULED' && !scheduledFor) {
      setNotice({ tone: 'error', message: 'Choose a future schedule date and time for the selected posts.' });
      return;
    }

    setActionState({ key: selectedIds.join(','), action: 'bulk' });
    setNotice(null);

    try {
      const results = await Promise.all(
        selectedIds.map(async (postId) => {
          try {
            const updated = await updatePostStatus(postId, status, scheduledFor);
            return { ok: true as const, updated };
          } catch (error) {
            return { ok: false as const, error: error instanceof Error ? error.message : 'Unable to update post.' };
          }
        }),
      );

      const successes = results.filter((result) => result.ok).map((result) => result.updated);
      const failures = results.filter((result) => !result.ok);

      if (successes.length > 0) {
        setRows((currentRows) =>
          currentRows.map((post) => successes.find((updated) => updated.id === post.id) ?? post),
        );
      }

      if (failures.length > 0) {
        setNotice({
          tone: 'error',
          message: failures[0]?.error ?? 'Some posts could not be updated.',
        });
      } else {
        setNotice({
          tone: 'success',
          message: `${successes.length} post${successes.length === 1 ? '' : 's'} moved to ${POST_STATUS_LABELS[status].toLowerCase()}.`,
        });
      }

      setSelectedIds([]);
      if (status === 'SCHEDULED') {
        setBulkScheduleFor('');
      }
    } finally {
      setActionState(null);
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) {
      setNotice({ tone: 'error', message: 'Select at least one post first.' });
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedIds.length} selected post${selectedIds.length === 1 ? '' : 's'}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setActionState({ key: selectedIds.join(','), action: 'bulk' });
    setNotice(null);

    try {
      const results = await Promise.all(
        selectedIds.map(async (postId) => {
          const response = await fetch(`/api/blog/${postId}`, {
            method: 'DELETE',
          });
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;

          if (!response.ok) {
            throw new Error(payload?.error || 'Unable to delete post.');
          }

          return postId;
        }),
      );

      setRows((currentRows) => currentRows.filter((post) => !results.includes(post.id)));
      setSelectedIds([]);
      setNotice({
        tone: 'success',
        message: `${results.length} post${results.length === 1 ? '' : 's'} deleted.`,
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to delete selected posts.',
      });
    } finally {
      setActionState(null);
    }
  }

  function toggleSelection(postId: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? Array.from(new Set([...current, postId])) : current.filter((id) => id !== postId),
    );
  }

  function toggleSelectAllVisible(checked: boolean) {
    if (!checked) {
      setSelectedIds((current) => current.filter((id) => !visiblePosts.some((post) => post.id === id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...visiblePosts.map((post) => post.id)])));
  }

  return (
    <div className="admin-stack gap-4">
      <AdminToolbar
        left={
          <>
            {STATUS_OPTIONS.map((status) => {
              const isActive = statusFilter === status.value;
              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setStatusFilter(status.value)}
                  className={`admin-btn admin-btn--secondary admin-tab ${isActive ? 'is-active' : ''}`}
                  aria-pressed={isActive}
                >
                  {status.label}
                </button>
              );
            })}
          </>
        }
        right={
          <>
            <AdminInput
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search title, slug, deck, excerpt, author"
              aria-label="Search posts"
              className="min-w-[18rem]"
            />
            <AdminButton asChild variant="primary">
              <Link href="/admin/blog/new">Create draft</Link>
            </AdminButton>
          </>
        }
      />

      {selectedIds.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
          <p className="admin-micro">
            {selectedIds.length} selected. Apply a bulk status change to the current selection.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton size="sm" variant="secondary" onClick={() => void handleBulkStatusChange('PUBLISHED')} disabled={actionState?.action === 'bulk'}>
              Publish
            </AdminButton>
            <AdminInput
              type="datetime-local"
              value={bulkScheduleFor}
              onChange={(event) => setBulkScheduleFor(event.target.value)}
              className="min-w-[14rem]"
              aria-label="Bulk schedule date"
            />
            <AdminButton size="sm" variant="secondary" onClick={() => void handleBulkStatusChange('SCHEDULED')} disabled={actionState?.action === 'bulk'}>
              Schedule
            </AdminButton>
            <AdminButton size="sm" variant="secondary" onClick={() => void handleBulkStatusChange('ARCHIVED')} disabled={actionState?.action === 'bulk'}>
              Archive
            </AdminButton>
            <AdminButton size="sm" variant="ghost" onClick={() => void handleBulkStatusChange('DRAFT')} disabled={actionState?.action === 'bulk'}>
              Move to Draft
            </AdminButton>
            <AdminButton size="sm" variant="danger" onClick={() => void handleBulkDelete()} disabled={actionState?.action === 'bulk'}>
              Delete
            </AdminButton>
          </div>
        </div>
      ) : null}

      {notice ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            notice.tone === 'error'
              ? 'border-[rgba(159,47,47,0.18)] bg-[rgba(159,47,47,0.05)] text-admin-danger'
              : 'border-[rgba(47,106,67,0.18)] bg-[rgba(47,106,67,0.05)] text-admin-success'
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <AdminTable
        density="comfortable"
        columns={[
          { key: 'select', label: '' },
          { key: 'title', label: 'Title' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Status' },
          { key: 'updated', label: 'Updated' },
          { key: 'published', label: 'Published' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'author', label: 'Author' },
        ]}
        emptyState={
          <AdminEmptyState
            title="No posts found"
            hint="Start the workspace with a new draft."
            action={
              <AdminButton asChild variant="primary" size="sm">
                <Link href="/admin/blog/new">Create your first draft</Link>
              </AdminButton>
            }
          />
        }
      >
        {visiblePosts.map((post) => {
          const isDuplicating = actionState?.key === post.id && actionState.action === 'duplicate';
          const isUpdating = actionState?.key === post.id && actionState.action === 'set-status';
          const isDeleting = actionState?.key === post.id && actionState.action === 'delete';
          const isSelected = selectedIds.includes(post.id);
          const rowStatusAction = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

          return (
            <tr key={post.id} className="admin-row">
              <td>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(event) => toggleSelection(post.id, event.target.checked)}
                  aria-label={`Select ${post.title}`}
                  className="h-4 w-4 rounded border-[var(--admin-color-border)]"
                />
              </td>
              <td>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/blog/${post.id}`} className="font-medium text-admin transition-opacity duration-200 hover:opacity-70">
                      {post.title}
                    </Link>
                    {post.featured ? <span className="admin-chip">Featured</span> : null}
                  </div>
                  <p className="admin-micro">{post.deck?.trim() || post.excerpt?.trim() || 'No summary yet.'}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminButton asChild variant="ghost" size="sm">
                      <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                    </AdminButton>
                    <AdminButton asChild variant="ghost" size="sm">
                      <Link href={`/admin/blog/${post.id}/preview`}>Preview</Link>
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      onClick={() => void duplicatePost(post.id)}
                      disabled={isDuplicating || isUpdating || isDeleting}
                    >
                      {isDuplicating ? 'Duplicating...' : 'Duplicate'}
                    </AdminButton>
                    <AdminButton
                      variant={post.status === 'PUBLISHED' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => void handleRowStatusChange(post.id, rowStatusAction)}
                      disabled={isDuplicating || isUpdating || isDeleting}
                    >
                      {isUpdating ? 'Saving...' : rowStatusAction === 'PUBLISHED' ? 'Publish' : 'Move to Draft'}
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() => void deletePost(post.id)}
                      disabled={isDuplicating || isUpdating || isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </AdminButton>
                  </div>
                </div>
              </td>
              <td>
                <span className="admin-table-code">{post.slug}</span>
              </td>
              <td>
                <StatusPill status={post.status} />
              </td>
              <td className="admin-micro">{formatDateTime(post.updatedAt)}</td>
              <td className="admin-micro">{post.status === 'PUBLISHED' ? formatDateTime(post.publishedAt) : '—'}</td>
              <td className="admin-micro">{post.status === 'SCHEDULED' ? formatDateTime(post.scheduledFor) : '—'}</td>
              <td className="admin-micro">{post.authorLabel}</td>
            </tr>
          );
        })}
      </AdminTable>

      {visiblePosts.length > 0 ? (
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-admin-muted">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(event) => toggleSelectAllVisible(event.target.checked)}
              className="h-4 w-4 rounded border-[var(--admin-color-border)]"
            />
            Select all visible posts
          </label>
          <p className="admin-micro">{visiblePosts.length} post{visiblePosts.length === 1 ? '' : 's'} in view.</p>
        </div>
      ) : null}
    </div>
  );
}
