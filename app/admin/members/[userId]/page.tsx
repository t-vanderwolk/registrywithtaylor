import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/server/prisma';
import { registryDelegate } from '@/lib/server/prismaRegistry';
import AdminContainer from '@/components/admin/ui/AdminContainer';
import AdminHeader from '@/components/admin/ui/AdminHeader';
import AdminKpiCard from '@/components/admin/ui/AdminKpiCard';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import { requireAdminSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ userId: string }> };

const PATH_TOTALS: Record<string, number> = {
  registry: 8, nursery: 6, gear: 9, postpartum: 6,
};

const PLATFORM_LABELS: Record<string, string> = {
  BABYLIST: 'Babylist', AMAZON: 'Amazon', TARGET: 'Target',
  BUYBUYBABY: 'buybuy BABY', WALMART: 'Walmart', OTHER: 'Other',
};

function formatDate(d: Date | string | null | undefined) {
  if (!d) return '—';
  return new Date(d as string).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function formatRelative(iso: Date | string | null | undefined) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso as string).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30)  return `${days} days ago`;
  return formatDate(iso as string);
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-[var(--color-accent)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[0.72rem] tabular-nums text-neutral-500">
        {value}/{total} ({pct}%)
      </span>
    </div>
  );
}

export default async function AdminMemberDetailPage({ params: paramsPromise }: Props) {
  const { userId } = await paramsPromise;
  await requireAdminSession(`/admin/members/${userId}`);

  // Phase 1: fetch the user (we need email to look up Learner)
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!user) notFound();

  // Phase 2: parallel queries that depend on user.email or userId
  const [learner, registries, progressRows, consultationsByEmail] = await Promise.all([
    prisma.learner.findUnique({
      where:  { email: user.email },
      select: {
        id: true, email: true, name: true, partnerName: true,
        dueDate: true, subscriptionTier: true, createdAt: true,
      },
    }).catch(() => null),

    registryDelegate.findMany({
      where:   { userId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, platform: true, name: true, url: true,
        itemCount: true, completedCount: true, notes: true, createdAt: true,
      },
    }),

    prisma.lessonProgress.groupBy({
      by:    ['pathSlug'],
      where: { learner: { email: user.email } },
      _count: { moduleSlug: true },
      _max:   { lastSeenAt: true },
    }).catch(() => []),

    prisma.consultationRequest.findMany({
      where:   { email: user.email },
      orderBy: { createdAt: 'desc' },
      select:  { id: true, status: true, createdAt: true, message: true },
      take:    10,
    }).catch(() => []),
  ]);

  // ── Derived ─────────────────────────────────────────────────────────────────

  const progressByPath: Record<string, number> = {};
  let   lastActive: Date | null = null;
  for (const row of progressRows) {
    progressByPath[row.pathSlug] = row._count.moduleSlug;
    const la = row._max.lastSeenAt;
    if (la && (!lastActive || la > lastActive)) lastActive = la;
  }

  const totalDone  = Object.values(progressByPath).reduce((a, b) => a + b, 0);
  const totalAvail = Object.values(PATH_TOTALS).reduce((a, b) => a + b, 0);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <main className="admin-page">
      <AdminContainer className="admin-stack">

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <div>
          <Link
            href="/admin/members"
            className="admin-micro text-[var(--color-accent-dark)] underline hover:opacity-75"
          >
            ← Back to Members
          </Link>
        </div>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <AdminHeader
          eyebrow="Member detail"
          title={learner?.name ?? user.name ?? user.email}
          subtitle={`${user.email} · ${learner?.subscriptionTier ?? 'No learner record'} · Joined ${formatDate(user.createdAt)}`}
        />

        {/* ── KPI strip ────────────────────────────────────────────────── */}
        <section className="admin-kpi-grid md:grid-cols-4" aria-label="Member stats">
          <AdminKpiCard label="Tier"          value={learner?.subscriptionTier ?? '—'} />
          <AdminKpiCard label="Modules done"  value={`${totalDone}/${totalAvail}`} />
          <AdminKpiCard label="Registries"    value={String(registries.length)} />
          <AdminKpiCard
            label="Consultations"
            value={String(consultationsByEmail.length)}
            hint={`Last active ${formatRelative(lastActive)}`}
          />
        </section>

        {/* ── Registries ───────────────────────────────────────────────── */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow={`${registries.length} saved`}
            title="Baby Registries"
          />
          {registries.length === 0 ? (
            <p className="admin-micro">No registries saved yet.</p>
          ) : (
            <div className="admin-stack gap-2">
              {registries.map((r) => {
                const domain = (() => {
                  try { return new URL(r.url).hostname.replace(/^www\./, ''); }
                  catch { return r.url; }
                })();
                const pct =
                  r.itemCount && r.completedCount != null
                    ? Math.round((r.completedCount / r.itemCount) * 100)
                    : null;
                return (
                  <div key={r.id} className="flex flex-col gap-1 rounded-xl border border-neutral-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="admin-chip">
                          {PLATFORM_LABELS[r.platform] ?? r.platform}
                        </span>
                        {r.name && (
                          <span className="admin-micro ml-2 text-neutral-600">{r.name}</span>
                        )}
                      </div>
                      <span className="admin-micro text-neutral-400">
                        Added {formatDate(r.createdAt)}
                      </span>
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-micro text-[var(--color-accent-dark)] underline"
                    >
                      {domain} ↗
                    </a>
                    {r.itemCount != null && (
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-20 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-[var(--color-accent)]"
                            style={{ width: `${pct ?? 0}%` }}
                          />
                        </div>
                        <span className="admin-micro text-neutral-500">
                          {r.completedCount ?? 0}/{r.itemCount} items
                          {pct !== null ? ` (${pct}%)` : ''}
                        </span>
                      </div>
                    )}
                    {r.notes && (
                      <p className="admin-micro italic text-neutral-400">{r.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </AdminSurface>

        {/* ── Academy progress ─────────────────────────────────────────── */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow="Academy"
            title="Path Progress"
            subtitle={`${totalDone} of ${totalAvail} modules visited`}
          />
          <div className="admin-stack gap-3">
            {Object.entries(PATH_TOTALS).map(([slug, total]) => {
              const done = progressByPath[slug] ?? 0;
              return (
                <div key={slug} className="flex flex-col gap-1">
                  <span className="text-[0.8rem] font-semibold capitalize text-neutral-700">
                    {slug}
                  </span>
                  <ProgressBar value={done} total={total} />
                </div>
              );
            })}
          </div>
        </AdminSurface>

        {/* ── Consultations ────────────────────────────────────────────── */}
        <AdminSurface className="admin-stack">
          <AdminHeader
            eyebrow={`${consultationsByEmail.length} total`}
            title="Consultation Requests"
          />
          {consultationsByEmail.length === 0 ? (
            <p className="admin-micro">No consultations on record for this email.</p>
          ) : (
            <div className="admin-stack gap-2">
              {consultationsByEmail.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 rounded-xl border border-neutral-100 p-3"
                >
                  <span className="admin-chip">{c.status ?? 'unknown'}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="admin-micro text-neutral-500">
                      {formatDate(c.createdAt)}
                    </span>
                    {c.message && (
                      <p className="admin-micro text-neutral-600 line-clamp-2">{c.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSurface>

        {/* ── Learner meta ─────────────────────────────────────────────── */}
        {learner && (
          <AdminSurface className="admin-stack">
            <AdminHeader eyebrow="Learner record" title="Personal details" />
            <dl className="grid grid-cols-2 gap-3 text-[0.83rem] sm:grid-cols-3">
              {[
                { label: 'Full name',   value: learner.name        ?? '—' },
                { label: 'Partner',     value: learner.partnerName ?? '—' },
                { label: 'Due date',    value: formatDate(learner.dueDate) },
                { label: 'Enrolled',    value: formatDate(learner.createdAt) },
                { label: 'Last active', value: formatRelative(lastActive) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="admin-micro uppercase tracking-wide text-neutral-400">{label}</dt>
                  <dd className="font-medium text-neutral-800">{value}</dd>
                </div>
              ))}
            </dl>
          </AdminSurface>
        )}

      </AdminContainer>
    </main>
  );
}
