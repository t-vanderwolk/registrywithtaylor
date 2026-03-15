'use client';

import Link from 'next/link';
import { startTransition, useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminTable from '@/components/admin/ui/AdminTable';
import StatusPill from '@/components/admin/ui/StatusPill';
import { getGuidePath } from '@/lib/guides/routing';
import type { GuideStatusValue } from '@/lib/guides/status';

type AdminGuideRow = {
  id: string;
  title: string;
  slug: string;
  status: GuideStatusValue;
  category: string;
  topicCluster: string | null;
  targetKeyword: string | null;
  excerpt: string | null;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
  scheduledFor: string | null;
  authorLabel: string;
  performance: {
    views: number;
    consultationClicks: number;
    affiliateClicks: number;
  };
};

type GuideWorkspaceFilters = {
  search: string;
  status: 'all' | GuideStatusValue;
  category: 'all' | string;
  sort: 'updated' | 'publishedAt' | 'performance' | 'title';
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

function mapApiGuide(
  payload: Record<string, unknown>,
  fallback: Pick<AdminGuideRow, 'authorLabel' | 'performance'>,
): AdminGuideRow {
  const performance =
    payload.performance && typeof payload.performance === 'object'
      ? (payload.performance as Record<string, unknown>)
      : {};

  return {
    id: String(payload.id),
    title: typeof payload.title === 'string' ? payload.title : 'Untitled guide',
    slug: typeof payload.slug === 'string' ? payload.slug : '',
    status: payload.status as GuideStatusValue,
    category: typeof payload.category === 'string' ? payload.category : 'Strollers',
    topicCluster: typeof payload.topicCluster === 'string' ? payload.topicCluster : null,
    targetKeyword: typeof payload.targetKeyword === 'string' ? payload.targetKeyword : null,
    excerpt: typeof payload.excerpt === 'string' ? payload.excerpt : null,
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : new Date().toISOString(),
    publishedAt: typeof payload.publishedAt === 'string' ? payload.publishedAt : null,
    archivedAt: typeof payload.archivedAt === 'string' ? payload.archivedAt : null,
    scheduledFor: typeof payload.scheduledFor === 'string' ? payload.scheduledFor : null,
    authorLabel: typeof payload.authorLabel === 'string' ? payload.authorLabel : fallback.authorLabel,
    performance: {
      views: typeof performance.views === 'number' ? performance.views : fallback.performance.views,
      consultationClicks:
        typeof performance.consultationClicks === 'number'
          ? performance.consultationClicks
          : fallback.performance.consultationClicks,
      affiliateClicks:
        typeof performance.affiliateClicks === 'number'
          ? performance.affiliateClicks
          : fallback.performance.affiliateClicks,
    },
  };
}

export default function GuideWorkspace({
  guides,
  filters,
  pagination,
  categoryOptions,
}: {
  guides: AdminGuideRow[];
  filters: GuideWorkspaceFilters;
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
  const [rows, setRows] = useState(guides);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    setRows(guides);
  }, [guides]);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (deferredSearch === filters.search) {
      return;
    }

    updateFilters({ search: deferredSearch, page: 1 });
  }, [deferredSearch]);

  function updateFilters(partial: Partial<GuideWorkspaceFilters>) {
    const next = { ...filters, ...partial };
    const params = new URLSearchParams();

    if (next.search.trim()) {
      params.set('search', next.search.trim());
    }

    if (next.status !== 'all') {
      params.set('status', next.status);
    }

    if (next.category !== 'all') {
      params.set('category', next.category);
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

  async function updateGuide(postId: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/guides/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    if (!response.ok || !payload?.id) {
      throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to update the guide.');
    }

    const existing = rows.find((row) => row.id === postId);
    const mapped = mapApiGuide(payload, {
      authorLabel: existing?.authorLabel ?? 'You',
      performance: existing?.performance ?? {
        views: 0,
        consultationClicks: 0,
        affiliateClicks: 0,
      },
    });
    setRows((currentRows) => currentRows.map((row) => (row.id === postId ? mapped : row)));
    return mapped;
  }

  async function duplicateGuide(guideId: string) {
    setBusyKey(`duplicate:${guideId}`);
    setNotice(null);

    try {
      const response = await fetch(`/api/guides/${guideId}/duplicate`, { method: 'POST' });
      const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

      if (!response.ok || !payload?.id) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to duplicate the guide.');
      }

      setNotice({ tone: 'success', message: 'Draft duplicated. Opening the copy.' });
      router.push(`/admin/guides/${payload.id}/edit`);
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to duplicate the guide.',
      });
    } finally {
      setBusyKey(null);
    }
  }

  async function setGuideStatus(guideId: string, nextStatus: GuideStatusValue, successMessage: string) {
    const target = rows.find((row) => row.id === guideId);
    if (!target) {
      return;
    }

    setBusyKey(`${nextStatus.toLowerCase()}:${guideId}`);
    setNotice(null);

    try {
      await updateGuide(guideId, {
        status: nextStatus,
        sourceRoute: '/admin/guides',
      });
      await refreshWithNotice({ tone: 'success', message: successMessage });
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to update the guide.',
      });
    } finally {
      setBusyKey(null);
    }
  }

  const pageLabel = useMemo(() => {
    if (pagination.totalCount === 0) {
      return 'No guides';
    }

    const pageStart = (pagination.page - 1) * 25 + 1;
    const pageEnd = Math.min(pageStart + rows.length - 1, pagination.totalCount);
    return `${pageStart}-${pageEnd} of ${pagination.totalCount}`;
  }, [pagination.page, pagination.totalCount, rows.length]);

  return (
    <div className="admin-stack gap-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.75fr))]">
        <AdminInput
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search titles, slugs, keywords, or clusters"
          aria-label="Search guides"
        />
        <AdminSelect
          value={filters.status}
          onChange={(event) => updateFilters({ status: event.target.value as GuideWorkspaceFilters['status'], page: 1 })}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </AdminSelect>
        <AdminSelect
          value={filters.category}
          onChange={(event) => updateFilters({ category: event.target.value, page: 1 })}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          value={filters.sort}
          onChange={(event) => updateFilters({ sort: event.target.value as GuideWorkspaceFilters['sort'], page: 1 })}
          aria-label="Sort guides"
        >
          <option value="updated">Recently updated</option>
          <option value="publishedAt">Publish date</option>
          <option value="performance">Performance</option>
          <option value="title">Title</option>
        </AdminSelect>
      </div>

      {notice ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            notice.tone === 'success'
              ? 'border-[rgba(47,106,67,0.18)] bg-[rgba(47,106,67,0.05)] text-admin-success'
              : 'border-[rgba(159,47,47,0.18)] bg-[rgba(159,47,47,0.05)] text-admin-danger'
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="admin-micro">
          {pageLabel}
          {isPending ? ' · Updating…' : ''}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => updateFilters({ page: Math.max(1, pagination.page - 1) })}
            disabled={pagination.page <= 1 || isPending}
          >
            Previous
          </AdminButton>
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => updateFilters({ page: Math.min(pagination.totalPages, pagination.page + 1) })}
            disabled={pagination.page >= pagination.totalPages || isPending}
          >
            Next
          </AdminButton>
        </div>
      </div>

      <AdminTable
        density="compact"
        columns={[
          { key: 'guide', label: 'Guide' },
          { key: 'category', label: 'Category' },
          { key: 'author', label: 'Author' },
          { key: 'status', label: 'Status' },
          { key: 'updated', label: 'Updated' },
          { key: 'performance', label: 'Performance' },
          { key: 'actions', label: 'Actions', className: 'w-[18rem]' },
        ]}
        emptyState={
          <AdminEmptyState
            title="No guides found"
            hint="Start with a new evergreen guide or loosen the filters."
            action={
              <AdminButton asChild variant="primary" size="sm">
                <Link href="/admin/guides/new">Create New Guide</Link>
              </AdminButton>
            }
          />
        }
      >
        {rows.map((guide) => {
          const isPublished = guide.status === 'PUBLISHED';
          const isArchived = guide.status === 'ARCHIVED';
          const publicRoute = getGuidePath({ slug: guide.slug, topicCluster: guide.topicCluster });

          return (
            <tr key={guide.id} className="admin-row">
              <td>
                <div className="admin-stack gap-1">
                  <Link href={`/admin/guides/${guide.id}/edit`} className="text-admin transition hover:opacity-75">
                    {guide.title}
                  </Link>
                  <span className="admin-table-code">{publicRoute}</span>
                  {guide.excerpt ? <p className="admin-micro line-clamp-2">{guide.excerpt}</p> : null}
                  {guide.targetKeyword ? (
                    <p className="admin-micro">Target keyword: {guide.targetKeyword}</p>
                  ) : null}
                </div>
              </td>
              <td className="admin-micro">
                <div className="admin-stack gap-1">
                  <span>{guide.category}</span>
                  {guide.topicCluster ? <span>Cluster: {guide.topicCluster}</span> : null}
                </div>
              </td>
              <td className="admin-micro">{guide.authorLabel}</td>
              <td>
                <StatusPill status={guide.status} />
              </td>
              <td className="admin-micro">
                <div className="admin-stack gap-1">
                  <span>Updated: {formatDateTime(guide.updatedAt)}</span>
                  <span>
                    {guide.status === 'PUBLISHED'
                      ? `Published: ${formatDateTime(guide.publishedAt)}`
                      : guide.status === 'SCHEDULED'
                        ? `Scheduled: ${formatDateTime(guide.scheduledFor)}`
                        : guide.status === 'ARCHIVED'
                          ? `Archived: ${formatDateTime(guide.archivedAt)}`
                          : 'Draft'}
                  </span>
                </div>
              </td>
              <td className="admin-micro">
                <div className="admin-stack gap-1">
                  <span>{guide.performance.views.toLocaleString()} views</span>
                  <span>{guide.performance.consultationClicks.toLocaleString()} consult clicks</span>
                  <span>{guide.performance.affiliateClicks.toLocaleString()} affiliate clicks</span>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <AdminButton asChild variant="secondary" size="sm">
                    <Link href={`/admin/guides/${guide.id}/edit`}>Edit</Link>
                  </AdminButton>
                  <AdminButton asChild variant="ghost" size="sm">
                    <Link href={`/admin/guides/${guide.id}/preview`}>Preview</Link>
                  </AdminButton>
                  <AdminButton
                    variant={isPublished ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={busyKey !== null}
                    onClick={() =>
                      void setGuideStatus(
                        guide.id,
                        isPublished ? 'DRAFT' : 'PUBLISHED',
                        isPublished ? 'Guide moved back to draft.' : 'Guide published.',
                      )
                    }
                  >
                    {busyKey === `${isPublished ? 'draft' : 'published'}:${guide.id}`
                      ? 'Working...'
                      : isPublished
                        ? 'Unpublish'
                        : 'Publish'}
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    disabled={busyKey !== null}
                    onClick={() => void duplicateGuide(guide.id)}
                  >
                    {busyKey === `duplicate:${guide.id}` ? 'Working...' : 'Duplicate'}
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    disabled={busyKey !== null || isArchived}
                    onClick={() => void setGuideStatus(guide.id, 'ARCHIVED', 'Guide archived.')}
                  >
                    {busyKey === `archived:${guide.id}` ? 'Working...' : 'Archive'}
                  </AdminButton>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
