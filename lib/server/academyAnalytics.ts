import 'server-only';

import prisma from '@/lib/server/prisma';

export type AcademyPathSlugKey = 'registry' | 'nursery' | 'gear' | 'postpartum';

export const ACADEMY_PATH_CONFIG: Record<
  AcademyPathSlugKey,
  { title: string; moduleCount: number }
> = {
  registry: { title: 'Registry Path', moduleCount: 8 },
  nursery: { title: 'Nursery Path', moduleCount: 6 },
  gear: { title: 'Gear Path', moduleCount: 9 },
  postpartum: { title: 'Postpartum Path', moduleCount: 6 },
};

export type AcademyPathStat = {
  pathSlug: AcademyPathSlugKey;
  title: string;
  moduleCount: number;
  activeMembers: number;
  totalVisits: number;
  avgModulesPerMember: number;
  topModules: Array<{ moduleSlug: string; visitCount: number }>;
};

export type AcademyMemberStats = {
  totalLearners: number;
  activeLearners: number;
  pathStats: AcademyPathStat[];
};

export async function getAcademyMemberStats(): Promise<AcademyMemberStats> {
  const [totalLearners, progressRows] = await Promise.all([
    prisma.learner.count().catch(() => 0),
    prisma.lessonProgress
      .findMany({
        select: {
          learnerId: true,
          pathSlug: true,
          moduleSlug: true,
          visitCount: true,
        },
      })
      .catch(() => [] as Array<{ learnerId: string; pathSlug: string; moduleSlug: string; visitCount: number }>),
  ]);

  // Aggregate per path in JS — dataset is small
  const pathBuckets = new Map<
    string,
    {
      learnerIds: Set<string>;
      totalVisits: number;
      moduleCounts: Map<string, number>;
    }
  >();

  const allLearnerIds = new Set<string>();

  for (const row of progressRows) {
    allLearnerIds.add(row.learnerId);

    const bucket = pathBuckets.get(row.pathSlug) ?? {
      learnerIds: new Set<string>(),
      totalVisits: 0,
      moduleCounts: new Map<string, number>(),
    };

    bucket.learnerIds.add(row.learnerId);
    bucket.totalVisits += row.visitCount;
    bucket.moduleCounts.set(
      row.moduleSlug,
      (bucket.moduleCounts.get(row.moduleSlug) ?? 0) + row.visitCount,
    );
    pathBuckets.set(row.pathSlug, bucket);
  }

  const pathSlugs: AcademyPathSlugKey[] = ['registry', 'nursery', 'gear', 'postpartum'];

  const pathStats: AcademyPathStat[] = pathSlugs.map((pathSlug) => {
    const config = ACADEMY_PATH_CONFIG[pathSlug];
    const bucket = pathBuckets.get(pathSlug);

    if (!bucket) {
      return {
        pathSlug,
        title: config.title,
        moduleCount: config.moduleCount,
        activeMembers: 0,
        totalVisits: 0,
        avgModulesPerMember: 0,
        topModules: [],
      };
    }

    const activeMembers = bucket.learnerIds.size;
    const topModules = [...bucket.moduleCounts.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([moduleSlug, visitCount]) => ({ moduleSlug, visitCount }));

    return {
      pathSlug,
      title: config.title,
      moduleCount: config.moduleCount,
      activeMembers,
      totalVisits: bucket.totalVisits,
      avgModulesPerMember:
        activeMembers > 0
          ? Math.round((bucket.moduleCounts.size / activeMembers) * 10) / 10
          : 0,
      topModules,
    };
  });

  return {
    totalLearners,
    activeLearners: allLearnerIds.size,
    pathStats,
  };
}

// Scope filter for the 3 public preview modules
export function getPreviewModuleScopeWhere() {
  return {
    topicCluster: {
      equals: 'TMBC Preview Module',
      mode: 'insensitive' as const,
    },
  };
}
