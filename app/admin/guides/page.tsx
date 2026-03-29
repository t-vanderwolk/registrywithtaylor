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

export default async function AdminGuidesIndexPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = parseAdminGuideListParams(searchParams ? await searchParams : undefined);
  const result = await listAdminGuidesSafe(params);
  const showAcademyScope = params.scope === 'academy';
  const inventoryResult =
    result.storageReady && showAcademyScope
      ? await getAcademySubmoduleInventorySafe()
      : { sections: [], storageReady: false, storageMessage: null };

  return (
    <AdminStack gap="xl">
      <AdminHeader
        eyebrow={showAcademyScope ? 'Guides · Academy Scope' : 'Guides'}
        title={showAcademyScope ? 'Guide workspace for Academy records' : 'Guide editor workspace'}
        subtitle={
          showAcademyScope
            ? 'Academy modules and submodules are managed here as guide records. Use the route map to create exact Academy pages without maintaining a second admin path.'
            : 'Manage evergreen authority content, publish updates, and keep guide performance close to the editing workflow.'
        }
        actions={
          <>
            <AdminButton asChild variant="secondary">
              <Link href={showAcademyScope ? '/admin/guides' : '/admin/guides?scope=academy'}>
                {showAcademyScope ? 'All guide records' : 'Academy records'}
              </Link>
            </AdminButton>
            <AdminButton asChild variant="secondary">
              <Link href={showAcademyScope ? '/admin/guides/analytics?scope=academy' : '/admin/guides/analytics'}>
                {showAcademyScope ? 'Academy Analytics' : 'Guide Analytics'}
              </Link>
            </AdminButton>
            <AdminButton asChild variant="primary">
              <Link href={showAcademyScope ? '/admin/guides/new?scope=academy' : '/admin/guides/new'}>
                {showAcademyScope ? 'Create Academy Draft' : 'Create New Guide'}
              </Link>
            </AdminButton>
          </>
        }
      />

      {result.storageReady ? (
        <>
          <AdminKpiStrip
            items={[
              { label: showAcademyScope ? 'Total academy records' : 'Total guides', value: result.kpis.totalGuides },
              { label: 'Draft count', value: result.kpis.draftCount },
              { label: 'Scheduled count', value: result.kpis.scheduledCount },
              { label: 'Published count', value: result.kpis.publishedCount },
            ]}
          />

          {showAcademyScope && inventoryResult.storageReady ? (
            <AcademySubmoduleInventory sections={inventoryResult.sections} />
          ) : null}

          <AdminSurface className="admin-stack gap-5">
            <GuideWorkspace
              guides={result.guides}
              filters={{
                search: params.search,
                status: params.status,
                category: params.category,
                sort: params.sort,
                scope: params.scope,
                page: params.page,
              }}
              pagination={{
                page: result.pagination.page,
                totalPages: result.pagination.totalPages,
                totalCount: result.pagination.totalCount,
              }}
              categoryOptions={result.categoryOptions}
              itemLabel={showAcademyScope ? 'academy record' : 'guide'}
              itemsLabel={showAcademyScope ? 'academy records' : 'guides'}
              primaryColumnLabel={showAcademyScope ? 'Academy Page' : 'Guide'}
              newHref={showAcademyScope ? '/admin/guides/new?scope=academy' : '/admin/guides/new'}
            />
          </AdminSurface>
        </>
      ) : (
        <GuideStorageNotice backHref="/admin" />
      )}
    </AdminStack>
  );
}
