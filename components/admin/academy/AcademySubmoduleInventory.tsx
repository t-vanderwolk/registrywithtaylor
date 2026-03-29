import Link from 'next/link';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import StatusPill from '@/components/admin/ui/StatusPill';
import type { AcademySubmoduleInventorySection } from '@/lib/server/academyEditorWorkspace';

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'Not seeded';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AcademySubmoduleInventory({
  sections,
}: {
  sections: AcademySubmoduleInventorySection[];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <AdminSurface className="admin-stack gap-6">
      <div className="admin-stack gap-2">
        <h2 className="text-lg font-semibold text-admin">Academy submodule map</h2>
        <p className="admin-copy max-w-3xl">
          Every Academy submodule lives here now, whether the guide record already exists or still needs its first draft.
          Use this map to create route-locked drafts without guessing canonical paths.
        </p>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => {
          const seededCount = section.items.filter((item) => item.existingGuideId).length;

          return (
            <section
              key={section.id}
              className="rounded-[24px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(148,163,184,0.14)] pb-4">
                <div className="admin-stack gap-1">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-admin-muted">{section.pathLabel}</p>
                  <h3 className="text-base font-semibold text-admin">{section.title}</h3>
                  <p className="admin-micro max-w-3xl">{section.description}</p>
                </div>
                <p className="admin-micro">
                  {seededCount} of {section.items.length} seeded
                </p>
              </div>

              <div className="mt-4 grid gap-3">
                {section.items.map((item) => (
                  <div
                    key={item.publicPath}
                    className="grid gap-4 rounded-[20px] border border-[rgba(148,163,184,0.14)] bg-[rgba(248,250,252,0.7)] p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_auto]"
                  >
                    <div className="admin-stack gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-admin">{item.title}</p>
                        {item.recordStatus ? (
                          <StatusPill status={item.recordStatus} />
                        ) : (
                          <span className="admin-chip">Not seeded</span>
                        )}
                        {item.duplicateCount > 1 ? (
                          <span className="admin-chip admin-chip--ready">{item.duplicateCount} records</span>
                        ) : null}
                      </div>
                      <p className="admin-micro">{item.description}</p>
                      <div className="admin-stack gap-1">
                        <span className="admin-table-code">{item.publicPath}</span>
                        <span className="admin-micro">
                          {item.recordTitle
                            ? `Editor record: ${item.recordTitle} · Updated ${formatDateTime(item.updatedAt)}`
                            : 'No guide record yet. Create the first draft from this route.'}
                        </span>
                      </div>
                    </div>

                    <div className="admin-stack gap-1">
                      <p className="admin-micro">Parent module</p>
                      <p className="text-sm font-medium text-admin">{item.parentLabel}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                      {item.existingGuideId ? (
                        <>
                          <AdminButton asChild variant="secondary" size="sm">
                            <Link href={`/admin/guides/${item.existingGuideId}/edit`}>Edit</Link>
                          </AdminButton>
                          <AdminButton asChild variant="ghost" size="sm">
                            <Link href={`/admin/guides/${item.existingGuideId}/preview`}>Preview</Link>
                          </AdminButton>
                        </>
                      ) : (
                        <AdminButton asChild variant="primary" size="sm">
                          <Link href={`/admin/guides/new?scope=academy&path=${encodeURIComponent(item.publicPath)}`}>Create draft</Link>
                        </AdminButton>
                      )}
                      <AdminButton asChild variant="ghost" size="sm">
                        <Link href={item.publicPath} target="_blank">
                          View route
                        </Link>
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AdminSurface>
  );
}
