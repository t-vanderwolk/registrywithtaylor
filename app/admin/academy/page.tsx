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

export default async function AdminAcademyIndexPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = parseAdminGuideListParams(searchParams ? await searchParams : undefined);
  const result = await listAdminGuidesSafe({
    ...params,
    scope: 'academy',
  });

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Academy"
        title="Academy editor workspace"
        subtitle="Manage TMBC Baby Academy modules, keep their canonical academy URLs intact, and edit the records the academy routes now use for live tracking and module content."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/academy/analytics">Academy Analytics</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/guides">All Guide Records</Link>
            </AdminButton>
          </>
        }
      />

      {result.storageReady ? (
        <>
          <AdminKpiStrip
            items={[
              { label: 'Total modules', value: result.kpis.totalGuides },
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
              itemLabel="academy module"
              itemsLabel="academy modules"
              primaryColumnLabel="Module"
              editorBasePath="/admin/academy"
              showCreateAction={false}
            />
          </AdminSurface>
        </>
      ) : (
        <GuideStorageNotice backHref="/admin" />
      )}
    </AdminStack>
  );
}
