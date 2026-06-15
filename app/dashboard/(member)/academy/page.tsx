import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/server/authOptions';
import prisma from '@/lib/server/prisma';
import {
  getAcademyPathSlugs,
  getAcademyPathData,
  type AcademyPathSlug,
} from '@/lib/academy/content';
import AcademyClient from './AcademyClient';
import type { AcademyClientProps, PathPanel } from './AcademyClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Academy | Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

const PATH_META: Record<string, { icon: string }> = {
  registry:   { icon: '🎁' },
  nursery:    { icon: '🛏' },
  gear:       { icon: '🛒' },
  postpartum: { icon: '🤱' },
};

export default async function AcademyDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard/academy');
  if (session.user.role === 'ADMIN') redirect('/admin');
  if (session.user.role === 'REVIEWER') redirect('/dashboard/reviewer');

  const email = session.user.email ?? '';

  const [learner, progressRows] = await Promise.all([
    prisma.learner.findUnique({
      where:  { email },
      select: { subscriptionTier: true },
    }).catch(() => null),
    prisma.lessonProgress.findMany({
      where:  { learner: { email } },
      select: { pathSlug: true, moduleSlug: true },
    }).catch(() => []),
  ]);

  const tier      = learner?.subscriptionTier ?? null;
  const hasAccess = tier === 'academy' || tier === 'academy_plus' || tier === 'concierge';
  const completedSet = new Set(progressRows.map((r) => `${r.pathSlug}/${r.moduleSlug}`));

  const pathSlugs = getAcademyPathSlugs() as AcademyPathSlug[];

  // Fetch all path data (includes module cards with descriptions)
  const pathDataArr = await Promise.all(pathSlugs.map((slug) => getAcademyPathData(slug)));

  // Build panels
  const paths: PathPanel[] = pathDataArr.map((pd) => {
    const slug     = pd.slug;
    const mods     = pd.moduleCards;
    const done     = hasAccess ? mods.filter((m) => completedSet.has(`${slug}/${m.slug}`)).length : 0;
    const total    = mods.length;
    const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
    const icon     = PATH_META[slug]?.icon ?? '📚';
    const nextMod  = hasAccess ? mods.find((m) => !completedSet.has(`${slug}/${m.slug}`)) : null;

    return {
      slug,
      title:            pd.title,
      shortDescription: pd.shortDescription,
      icon,
      done,
      total,
      pct,
      locked:  !hasAccess,
      nextHref: nextMod?.href ?? null,
      modules: mods.map((m) => ({
        slug:        m.slug,
        href:        m.href,
        title:       m.title,
        description: m.description,
        done:        hasAccess && completedSet.has(`${slug}/${m.slug}`),
        locked:      !hasAccess,
      })),
    };
  });

  // Compute "next up" — first uncompleted module across all paths
  let nextUp: AcademyClientProps['nextUp'] = null;
  if (hasAccess) {
    for (const p of paths) {
      const firstUndone = p.modules.find((m) => !m.done);
      if (firstUndone) {
        nextUp = {
          pathSlug:    p.slug,
          pathTitle:   p.title,
          pathIcon:    p.icon,
          moduleTitle: firstUndone.title,
          href:        firstUndone.href,
        };
        break;
      }
    }
  }

  const totalModules = paths.reduce((s, p) => s + p.total, 0);
  const doneModules  = paths.reduce((s, p) => s + p.done, 0);
  const overallPct   = totalModules > 0 ? Math.round((doneModules / totalModules) * 100) : 0;

  return (
    <AcademyClient
      hasAccess={hasAccess}
      tier={tier}
      totalModules={totalModules}
      doneModules={doneModules}
      overallPct={overallPct}
      paths={paths}
      nextUp={nextUp}
    />
  );
}
