import Link from 'next/link';
import { NewsletterSubscriberStatus } from '@prisma/client';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminTabs from '@/components/admin/ui/AdminTabs';
import AdminEmptyState from '@/components/admin/patterns/AdminEmptyState';
import { formatNewsletterSource } from '@/lib/server/newsletter';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';
import { updateNewsletterSubscriberStatus } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Newsletter Subscribers · Admin',
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ status?: string; q?: string }> | undefined;
type StatusFilter = 'all' | NewsletterSubscriberStatus;

const STATUS_FILTERS: StatusFilter[] = [
  'all',
  NewsletterSubscriberStatus.SUBSCRIBED,
  NewsletterSubscriberStatus.UNSUBSCRIBED,
  NewsletterSubscriberStatus.PENDING,
  NewsletterSubscriberStatus.CLEANED,
  NewsletterSubscriberStatus.ARCHIVED,
];

const normalizeStatusFilter = (value?: string): StatusFilter =>
  value && STATUS_FILTERS.includes(value as StatusFilter) ? (value as StatusFilter) : 'all';

const statusLabel = (status: StatusFilter) => {
  if (status === 'all') return 'All';
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDateTime = (value?: Date | null) =>
  value
    ? value.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'N/A';

const toChipClassName = (status: NewsletterSubscriberStatus) => {
  if (status === NewsletterSubscriberStatus.SUBSCRIBED) return 'admin-chip admin-chip--published';
  if (status === NewsletterSubscriberStatus.UNSUBSCRIBED) return 'admin-chip admin-chip--archived';
  if (status === NewsletterSubscriberStatus.PENDING) return 'admin-chip admin-chip--scheduled';
  if (status === NewsletterSubscriberStatus.CLEANED) return 'admin-chip admin-chip--ready';
  return 'admin-chip admin-chip--draft';
};

function buildStatusHref(status: StatusFilter, query: string) {
  const params = new URLSearchParams();
  if (status !== 'all') params.set('status', status);
  if (query) params.set('q', query);
  const suffix = params.toString();
  return `/admin/newsletter/subscribers${suffix ? `?${suffix}` : ''}`;
}

export default async function AdminNewsletterSubscribersPage({ searchParams }: { searchParams?: SearchParams }) {
  await requireAdminSession('/admin/newsletter/subscribers');
  const params = searchParams ? await searchParams : undefined;
  const statusFilter = normalizeStatusFilter(params?.status);
  const query = params?.q?.trim() ?? '';

  const where = {
    ...(statusFilter === 'all' ? {} : { status: statusFilter }),
    ...(query
      ? {
          OR: [
            { email: { contains: query, mode: 'insensitive' as const } },
            { firstName: { contains: query, mode: 'insensitive' as const } },
            { lastName: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [subscribers, statusCounts] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      take: 250,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        source: true,
        sourceDetail: true,
        tags: true,
        subscribedAt: true,
        unsubscribedAt: true,
        createdAt: true,
      },
    }),
    prisma.newsletterSubscriber.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const countByStatus = statusCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});

  const totalSubscribers = statusCounts.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Newsletter"
        title="Subscribers"
        subtitle="Private local subscriber list. This page is not available in reviewer mode."
        actions={
          <AdminButton asChild variant="secondary">
            <Link href="/admin/newsletter">Newsletter hub</Link>
          </AdminButton>
        }
      />

      <section className="admin-kpi-grid md:grid-cols-3 xl:grid-cols-5" aria-label="Subscriber totals">
        <AdminKpiCard label="All records" value={totalSubscribers.toLocaleString()} />
        <AdminKpiCard label="Subscribed" value={(countByStatus.SUBSCRIBED ?? 0).toLocaleString()} />
        <AdminKpiCard label="Unsubscribed" value={(countByStatus.UNSUBSCRIBED ?? 0).toLocaleString()} />
        <AdminKpiCard label="Pending" value={(countByStatus.PENDING ?? 0).toLocaleString()} />
        <AdminKpiCard label="Archived" value={(countByStatus.ARCHIVED ?? 0).toLocaleString()} />
      </section>

      <AdminSurface className="admin-stack gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <AdminTabs
            ariaLabel="Filter subscribers by status"
            activeValue={statusFilter}
            tabs={STATUS_FILTERS.map((status) => ({
              value: status,
              label: statusLabel(status),
              href: buildStatusHref(status, query),
            }))}
          />

          <form action="/admin/newsletter/subscribers" className="flex flex-wrap items-center gap-2">
            {statusFilter !== 'all' ? <input type="hidden" name="status" value={statusFilter} /> : null}
            <AdminInput
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search email or name"
              aria-label="Search subscribers"
              className="min-w-[16rem]"
            />
            <AdminButton type="submit" variant="secondary" size="sm">
              Search
            </AdminButton>
            {query ? (
              <AdminButton asChild variant="ghost" size="sm">
                <Link href={buildStatusHref(statusFilter, '')}>Clear</Link>
              </AdminButton>
            ) : null}
          </form>
        </div>

        <AdminTable
          density="comfortable"
          columns={[
            { key: 'subscriber', label: 'Subscriber' },
            { key: 'source', label: 'Source' },
            { key: 'status', label: 'Status' },
            { key: 'tags', label: 'Tags' },
            { key: 'date', label: 'Subscribed', align: 'right' },
            { key: 'actions', label: 'Update', align: 'right' },
          ]}
          emptyState={
            <AdminEmptyState
              title="No subscribers found"
              hint="New newsletter signups will appear here after the local capture goes live."
            />
          }
        >
          {subscribers.map((subscriber) => {
            const name = [subscriber.firstName, subscriber.lastName].filter(Boolean).join(' ');

            return (
              <tr key={subscriber.id} className="admin-row">
                <td>
                  <div className="admin-stack gap-1">
                    <p className="text-admin font-medium">{subscriber.email}</p>
                    {name ? <p className="admin-micro">{name}</p> : null}
                  </div>
                </td>
                <td>
                  <p className="text-admin">{formatNewsletterSource(subscriber.source)}</p>
                  {subscriber.sourceDetail ? <p className="admin-micro">{subscriber.sourceDetail}</p> : null}
                </td>
                <td>
                  <span className={toChipClassName(subscriber.status)}>{statusLabel(subscriber.status)}</span>
                  {subscriber.unsubscribedAt ? (
                    <p className="admin-micro">Left {formatDateTime(subscriber.unsubscribedAt)}</p>
                  ) : null}
                </td>
                <td className="admin-micro">{subscriber.tags.length ? subscriber.tags.join(', ') : '-'}</td>
                <td className="text-right admin-micro">{formatDateTime(subscriber.subscribedAt)}</td>
                <td className="text-right">
                  <form action={updateNewsletterSubscriberStatus} className="inline-flex flex-wrap justify-end gap-2">
                    <input type="hidden" name="id" value={subscriber.id} />
                    <AdminSelect
                      name="status"
                      defaultValue={subscriber.status}
                      aria-label={`Update status for ${subscriber.email}`}
                      className="min-w-[9rem]"
                    >
                      {STATUS_FILTERS.filter((status): status is NewsletterSubscriberStatus => status !== 'all').map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </AdminSelect>
                    <AdminButton type="submit" variant="secondary" size="sm">
                      Save
                    </AdminButton>
                  </form>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      </AdminSurface>
    </AdminStack>
  );
}
