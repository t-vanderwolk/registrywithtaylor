import LearnModuleLayout, { type LearnModuleData } from '@/components/learn/LearnModuleLayout';

/**
 * AcademyModuleRenderer now delegates to LearnModuleLayout.
 * Used by stroller lane pages, car seat category pages,
 * and DailyUseGearSubmodulePage.
 */
export default function AcademyModuleRenderer({
  module,
}: {
  module: LearnModuleData;
}) {
  return <LearnModuleLayout module={module} />;
}
