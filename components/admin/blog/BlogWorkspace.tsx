'use client';

import Link from 'next/link';
import { startTransition, useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminTable from '@/components/admin/ui/AdminTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import BulkActionsBar from '@/components/admin/blog/BulkActionsBar';
import FilterBar from '@/components/admin/blog/FilterBar';
import StageBadge from '@/components/admin/blog/StageBadge';
import type { PostStatusValue } from '@/lib/blog/postStatus';
import type { BlogStageValue } from '@/lib/blog/postStage';

type BlogWorkspacePost = {
  id: string;
  title: string;
  slug: string;
  status: PostStatusValue;
  stage: BlogStageValue;
  category: string;
  focusKeyword: string | null;
  excerpt: string | null;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
  scheduledFor: string | null;
  featured: boolean;
  authorLabel: string;
};

type BlogWorkspaceFilters = {
  search: string;
  status: 'all' | PostStatusValue;
  stage: 'all' | BlogStageValue;
  category: string;
  featured: 'all' | 'featured' | 'standard';
  sort: 'updated' | 'publishedAt' | 'title';
  page: number;
};

type Notice = {
  tone: 'success' | 'error';
  message: string;
};

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

function mapApiPost(payload: Record<string, unknown>, fallbackAuthorLabel: string) {
  return {
    id: String(payload.id),
    title: typeof payload.title === 'string' ? payload.title : 'Untitled post',
    slug: typeof payload.slug === 'string' ? payload.slug : '',
    status: payload.status as PostStatusValue,
    stage: payload.stage as BlogStageValue,
    category: typeof payload.category === 'string' ? payload.category : 'Registry Strategy',
    focusKeyword: typeof payload.focusKeyword === 'string' ? payload.focusKeyword : null,
    excerpt: typeof payload.excerpt === 'string' ? payload.excerpt : null,
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : new Date().toISOString(),
    publishedAt: typeof payload.publishedAt === 'string' ? payload.publishedAt : null,
    archivedAt: typeof payload.archivedAt === 'string' ? payload.archivedAt : null,
    scheduledFor: typeof payload.scheduledFor === 'string' ? payload.scheduledFor : null,
    featured: Boolean(payload.featured),
    authorLabel: typeof payload.authorLabel === 'string' ? payload.authorLabel : fallbackAuthorLabel,
  } satisfies BlogWorkspacePost;
}

export default function BlogWorkspace({
  posts,
  filters,
  pagination,
  categoryOptions,
}: {
  posts: BlogWorkspacePost[];
  filters: BlogWorkspaceFilters;
  pagination: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
  categoryOptions: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startRouteTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(filters.search);
  const deferredSearch = useDeferredValue(searchValue);
  const [rows, setRows] = useState(posts);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    setRows(posts);
  }, [posts]);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (deferredSearch === filters.search) {
      return;
    }

    updateFilters({ search: deferredSearch, page: 1 });
  }, [deferredSearch]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allVisibleSelected = rows.length > 0 && rows.every((row) => selectedSet.has(row.id));

  function updateFilters(partial: Partial<BlogWorkspaceFilters>) {
    const next = { ...filters, ...partial };
    const params = new URLSearchParams();

    if (next.search.trim()) {
      params.set('search', next.search.trim());
    }

    if (next.status !== 'all') {
      params.set('status', next.status);
    }

    if (next.stage !== 'all') {
      params.set('stage', next.stage);
    }

    if (next.category !== 'all') {
      params.set('category', next.category);
    }

    if (next.featured !== 'all') {
      params.set('featured', next.featured);
    }

    if (next.sort !== 'updated') {
      params.set('sort', next.sort);
    }

    if (next.page > 1) {
      params.set('page', String(next.page));
    }

    startRouteTransition(() => {
      router.replace(params.size > 0 ? `${pathname}?${params.toString()}` : pathname);
    });
  }

  async function refreshWithNotice(nextNotice: Notice) {
    setNotice(nextNotice);
    startTransition(() => router.refresh());
  }

  async function updateSinglePost(postId: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/blog/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok || !payload?.id) {
      throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to update the post.');
    }

    const existing = rows.find((row) => row.id === postId);
    const mapped = mapApiPost(payload, existing?.authorLabel ?? 'You');
    setRows((currentRows) => currentRows.map((row) => (row.id === postId ? mapped : row)));
    return mapped;
  }

  async function runBulkAction(body: Record<string, unknown>, successMessage: string) {
    if (selectedIds.length === 0) {
      setNotice({ tone: 'error', message: 'Select at least one post first.' });
      return;
    }

    setBusyKey(`bulk:${selectedIds.join(',')}`);
    setNotice(null);

    try {
      const response = await fetch('/api/blog/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          ...body,
        }),
      });
      const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

      if (!response.ok) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to update the selected posts.');
      }

      setSelectedIds([]);
      await refreshWithNotice({ tone: 'success', message: successMessage });
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to update the selected posts.',
      });
    } finally {
      setBusyKey(null);
    }
  }

  async function duplicatePost(postId: string) {
    setBusyKey(`duplicate:${postId}`);
    setNotice(null);

    try {
      const response = await fetch(`/api/blog/${postId}/duplicate`, {
        method: 'POST',
      });
      const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

      if (!response.ok || !payload?.id) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to duplicate the post.');
      }

      setNotice({ tone: 'success', message: 'Draft duplicated. Opening the copy.' });
      router.push(`/admin/blog/${payload.id}/edit`);
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to duplicate the post.',
      });
    } finally {
      setBusyKey(null);
    }
  }

  async function deletePost(postId: string) {
    const target = rows.find((row) => row.id === postId);
    if (!target) {
      return;
    }

    if (!window.confirm(`Delete "${target.title}"? This cannot be undone.`)) {
      return;
    }

    setBusyKey(`delete:${postId}`);
    setNotice(null);

    try {
      const response = await fetch(`/api/blog/${postId}`, { method: 'DELETE' });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to delete the post.');
      }

      await refreshWithNotice({ tone: 'success', message: 'Post deleted.' });
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to delete the post.',
      });
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="admin-stack gap-4">
      <FilterBar
        search={searchValue}
        status={filters.status}
        stage={filters.stage}
        category={filters.category}
        featured={filters.featured}
        sort={filters.sort}
        categoryOptions={categoryOptions}
        onSearchChange={setSearchValue}
        onStatusChange={(value) => updateFilters({ status: value, page: 1 })}
        onStageChange={(value) => updateFilters({ stage: value, page: 1 })}
        onCategoryChange={(value) => updateFilters({ category: value, page: 1 })}
        onFeaturedChange={(value) => updateFilters({ featured: value, page: 1 })}
        onSortChange={(value) => updateFilters({ sort: value, page: 1 })}
      />

      <BulkActionsBar
        selectedCount={selectedIds.length}
        categoryOptions={categoryOptions}
        onApplyStage={(value) => void runBulkAction({ action: 'set-stage', stage: value }, `Updated the stage on ${selectedIds.length} post${selectedIds.length === 1 ? '' : 's'}.`)}
        onApplyCategory={(value) => void runBulkAction({ action: 'set-category', category: value }, `Updated the category on ${selectedIds.length} post${selectedIds.length === 1 ? '' : 's'}.`)}
        onPublish={() => {
          if (window.confirm(`Publish ${selectedIds.length} selected post${selectedIds.length === 1 ? '' : 's'}?`)) {
            void runBulkAction({ action: 'publish' }, `Published ${selectedIds.length} post${selectedIds.length === 1 ? '' : 's'}.`);
          }
        }}
        onUnpublish={() => {
          if (window.confirm(`Unpublish ${selectedIds.length} selected post${selectedIds.length === 1 ? '' : 's'}?`)) {
            void runBulkAction({ action: 'unpublish' }, `Moved ${selectedIds.length} post${selectedIds.length === 1 ? '' : 's'} back to draft.`);
          }
        }}
        onArchive={() => {
          if (window.confirm(`Archive ${selectedIds.length} selected post${selectedIds.length === 1 ? '' : 's'}?`)) {
            void runBulkAction({ action: 'archive' }, `Archived ${selectedIds.length} post${selectedIds.length === 1 ? '' : 's'}.`);
          }
        }}
        onUnarchive={() => {
          if (window.confirm(`Unarchive ${selectedIds.length} selected post${selectedIds.length === 1 ? '' : 's'}?`)) {
            void runBulkAction({ action: 'unarchive' }, `Unarchived ${selectedIds.length} post${selectedIds.length === 1 ? '' : 's'}.`);
          }
        }}
      />

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
          { key: 'select', label: '', className: 'w-12' },
          { key: 'title', label: 'Title' },
          { key: 'status', label: 'Status' },
          { key: 'stage', label: 'Stage' },
          { key: 'category', label: 'Category' },
          { key: 'keyword', label: 'Focus Keyword' },
          { key: 'updated', label: 'Updated' },
          { key: 'publishedAt', label: 'Published At' },
          { key: 'featured', label: 'Featured' },
          { key: 'actions', label: 'Quick Actions', align: 'right' },
        ]}
        emptyState={
          <AdminEmptyState
            title="No posts match filters"
            hint="Try loosening filters or start a new post."
            action={
              <AdminButton asChild variant="primary" size="sm">
                <Link href="/admin/blog/new">New Post</Link>
              </AdminButton>
            }
          />
        }
      >
        {rows.map((post) => (
          <tr key={post.id} className="admin-row">
            <td>
              <input
                aria-label={`Select ${post.title}`}
                type="checkbox"
                checked={selectedSet.has(post.id)}
                onChange={(event) =>
                  setSelectedIds((current) =>
                    event.target.checked ? Array.from(new Set([...current, post.id])) : current.filter((id) => id !== post.id),
                  )
                }
                className="h-4 w-4 rounded border-[var(--admin-color-border)]"
              />
            </td>
            <td>
              <div className="admin-stack gap-1">
                <p className="text-sm font-medium text-admin">{post.title}</p>
                <p className="admin-table-code">{post.slug}</p>
                {post.excerpt ? <p className="admin-micro max-w-[36ch]">{post.excerpt}</p> : null}
                <p className="admin-micro">Author: {post.authorLabel}</p>
              </div>
            </td>
            <td>
              <StatusPill status={post.status} />
            </td>
            <td>
              <StageBadge stage={post.stage} />
            </td>
            <td>{post.category}</td>
            <td>{post.focusKeyword ?? '—'}</td>
            <td className="admin-micro">{formatDateTime(post.updatedAt)}</td>
            <td className="admin-micro">
              {post.status === 'PUBLISHED' ? formatDateTime(post.publishedAt) : post.status === 'SCHEDULED' ? formatDateTime(post.scheduledFor) : post.status === 'ARCHIVED' ? formatDateTime(post.archivedAt) : '—'}
            </td>
            <td>{post.featured ? <span className="admin-chip admin-chip--published">Featured</span> : <span className="admin-chip">No</span>}</td>
            <td>
              <div className="flex flex-wrap justify-end gap-2">
                <AdminButton asChild size="sm" variant="secondary">
                  <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                </AdminButton>
                <AdminButton asChild size="sm" variant="secondary">
                  <Link href={`/admin/blog/${post.id}/preview`}>Preview</Link>
                </AdminButton>
                <AdminButton
                  size="sm"
                  variant="ghost"
                  onClick={() => void duplicatePost(post.id)}
                  disabled={busyKey === `duplicate:${post.id}` || isPending}
                >
                  Duplicate
                </AdminButton>
                <AdminButton
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    void updateSinglePost(post.id, {
                      status: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
                      stage: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
                    }).then(async (updated) => {
                      await refreshWithNotice({
                        tone: 'success',
                        message: updated.status === 'PUBLISHED' ? 'Post published.' : 'Post moved to draft.',
                      });
                    }).catch((error) =>
                      setNotice({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Unable to update the post.',
                      }),
                    )
                  }
                  disabled={busyKey !== null || isPending}
                >
                  {post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                </AdminButton>
                <AdminButton
                  size="sm"
                  variant={post.status === 'ARCHIVED' ? 'secondary' : 'danger'}
                  onClick={() => {
                    const nextArchived = post.status !== 'ARCHIVED';
                    if (!window.confirm(`${nextArchived ? 'Archive' : 'Unarchive'} "${post.title}"?`)) {
                      return;
                    }

                    void updateSinglePost(post.id, {
                      status: nextArchived ? 'ARCHIVED' : 'DRAFT',
                      stage: nextArchived ? 'ARCHIVED' : 'DRAFT',
                    }).then(async () => {
                      await refreshWithNotice({
                        tone: 'success',
                        message: nextArchived ? 'Post archived.' : 'Post unarchived.',
                      });
                    }).catch((error) =>
                      setNotice({
                        tone: 'error',
                        message: error instanceof Error ? error.message : 'Unable to update the post.',
                      }),
                    );
                  }}
                  disabled={busyKey !== null || isPending}
                >
                  {post.status === 'ARCHIVED' ? 'Unarchive' : 'Archive'}
                </AdminButton>
                <AdminButton
                  size="sm"
                  variant="danger"
                  onClick={() => void deletePost(post.id)}
                  disabled={busyKey === `delete:${post.id}` || isPending}
                >
                  Delete
                </AdminButton>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {rows.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-admin">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(event) =>
                setSelectedIds(event.target.checked ? rows.map((row) => row.id) : [])
              }
              className="h-4 w-4 rounded border-[var(--admin-color-border)]"
            />
            Select all visible
          </label>

          <div className="flex items-center gap-3">
            <p className="admin-micro">
              Page {pagination.page} of {pagination.totalPages} • {pagination.totalCount} total posts
            </p>
            <div className="flex items-center gap-2">
              <AdminButton
                size="sm"
                variant="secondary"
                onClick={() => updateFilters({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1 || isPending}
              >
                Previous
              </AdminButton>
              <AdminButton
                size="sm"
                variant="secondary"
                onClick={() => updateFilters({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages || isPending}
              >
                Next
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
