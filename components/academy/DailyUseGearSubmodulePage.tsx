import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import {
  buildDailyUseGearAcademySubmoduleModule,
  type DailyUseGearAcademySubmoduleSlug,
} from '@/lib/academy/dailyUseGearAcademy';

export default async function DailyUseGearSubmodulePage({
  slug,
}: {
  slug: DailyUseGearAcademySubmoduleSlug;
}) {
  const module = buildDailyUseGearAcademySubmoduleModule(slug);

  return <AcademyModuleRenderer module={module} />;
}
