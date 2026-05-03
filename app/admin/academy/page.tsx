import Link from 'next/link';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminStack from '@/components/admin/ui/AdminStack';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminKpiStrip from '@/components/admin/blog/AdminKpiStrip';
import AcademySubmoduleInventory from '@/components/admin/academy/AcademySubmoduleInventory';
import GuideStorageNotice from '@/components/admin/guides/GuideStorageNotice';
import GuideWorkspace from '@/components/admin/guides/GuideWorkspace';
import { listAdminGuidesSafe, parseAdminGuideListParams } from '@/lib/server/adminGuides';
import { getAcademySubmoduleInventorySafe } from '@/lib/server/academyEditorWorkspace';

type SearchParams = Promise<Record<string, string | string[] | undefined>> | undefined;

export const dynamic = 'force-dynamic';

export default async function AdminAcademyIndexPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const baseParams = parseAdminGuideListParams(searchParams ? await searchParams : undefined);
  const params = { ...baseParams, scope: 'all' as const };
  const result = await listAdminGuidesSafe(params);
  const inventoryResult = result.storageReady
    ? await getAcademySubmoduleInventorySafe()
    : { sections: [], storageReady: false, storageMessage: null };

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow="Academy"
        title="Academy workspace"
        subtitle="Manage Academy modules and learning-content records in one system while keeping public Academy and guide URLs intact."
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href="/admin/academy/analytics">Academy analytics</Link>
            </AdminButton>
            <AdminButton asChild variant="primary">
              <Link href="/admin/academy/new">Create Learning Content</Link>
            </AdminButton>
          </>
        }
      />

      {result.storageReady ? (
        <>
          <AdminKpiStrip
            items={[
              { label: 'Learning content', value: result.kpis.totalGuides },
              { label: 'Draft count', value: result.kpis.draftCount },
              { label: 'Scheduled count', value: result.kpis.scheduledCount },
              { label: 'Published count', value: result.kpis.publishedCount },
            ]}
          />

          {inventoryResult.storageReady ? <AcademySubmoduleInventory sections={inventoryResult.sections} /> : null}

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
              itemLabel="learning content record"
              itemsLabel="learning content records"
              primaryColumnLabel="Learning Content"
              editorBasePath="/admin/academy"
              newHref="/admin/academy/new"
            />
          </AdminSurface>
        </>
      ) : (
        <GuideStorageNotice backHref="/admin" />
      )}
    </AdminStack>
  );
}
