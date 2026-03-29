import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import {
  buildDailyUseGearAcademySubmoduleModule,
  getDailyUseGearAcademySubmodulePath,
  type DailyUseGearAcademySubmoduleSlug,
} from '@/lib/academy/dailyUseGearAcademy';
import {
  getPublishedAcademyGuideForPath,
  mergeAcademyModuleWithGuideRecord,
} from '@/lib/server/academyGuides';

export default async function DailyUseGearSubmodulePage({
  slug,
}: {
  slug: DailyUseGearAcademySubmoduleSlug;
}) {
  const path = getDailyUseGearAcademySubmodulePath(slug);
  const fallbackModule = buildDailyUseGearAcademySubmoduleModule(slug);
  const academyGuide = await getPublishedAcademyGuideForPath(path);
  const module = academyGuide ? mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide) : fallbackModule;

  return (
    <AcademyModuleRenderer
      module={module}
      guide={academyGuide}
      fallbackSlug={`academy-gear-daily-use-gear-${slug}`}
    />
  );
}
