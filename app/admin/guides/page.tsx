import Link from 'next/link';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminKpiStrip from '@/components/admin/blog/AdminKpiStrip';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import GuideWorkspace from '@/components/admin/guides/GuideWorkspace';
import { listAdminGuidesSafe, parseAdminGuideListParams } from '@/lib/server/adminGuides';

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

export const dynamic = 'force-dynamic';

export default async function AdminGuidesIndexPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = parseAdminGuideListParams(searchParams ? await searchParams : undefined);
  const result = await listAdminGuidesSafe(params);

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Guides"
        title="Guide editor workspace"
        subtitle="Manage evergreen authority content, publish updates, and keep guide performance close to the editing workflow."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/guides/analytics">Guide Analytics</Link>
            </AdminButton>
            <AdminButton asChild variant="primary">
              <Link href="/admin/guides/new">Create New Guide</Link>
            </AdminButton>
          </>
        }
      />

      {result.storageReady ? (
        <>
          <AdminKpiStrip
            items={[
              { label: 'Total guides', value: result.kpis.totalGuides },
              { label: 'Draft count', value: result.kpis.draftCount },
              { label: 'Scheduled count', value: result.kpis.scheduledCount },
              { label: 'Published count', value: result.kpis.publishedCount },
            ]}
          />

          <AdminSurface className="admin-stack gap-5">
            <GuideWorkspace
              guides={result.guides}
              filters={{
                search: params.search,
                status: params.status,
                category: params.category,
                sort: params.sort,
                page: params.page,
              }}
              pagination={{
                page: result.pagination.page,
                totalPages: result.pagination.totalPages,
                totalCount: result.pagination.totalCount,
              }}
              categoryOptions={result.categoryOptions}
            />
          </AdminSurface>
        </>
      ) : (
        <GuideStorageNotice backHref="/admin" />
      )}
    </AdminStack>
  );
}
