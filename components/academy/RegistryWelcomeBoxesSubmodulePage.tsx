import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import {
  buildRegistryWelcomeBoxesAcademySubmoduleModule,
  getRegistryWelcomeBoxesAcademySubmodulePath,
  type RegistryWelcomeBoxesSubmoduleSlug,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import {
  getPublishedAcademyGuideForPath,
  mergeAcademyModuleWithGuideRecord,
} from '@/lib/server/academyGuides';

export default async function RegistryWelcomeBoxesSubmodulePage({
  slug,
}: {
  slug: RegistryWelcomeBoxesSubmoduleSlug;
}) {
  const path = getRegistryWelcomeBoxesAcademySubmodulePath(slug);
  const fallbackModule = buildRegistryWelcomeBoxesAcademySubmoduleModule(slug);
  const academyGuide = await getPublishedAcademyGuideForPath(path);
  const module = academyGuide ? mergeAcademyModuleWithGuideRecord(fallbackModule, academyGuide) : fallbackModule;

  return (
    <AcademyModuleRenderer
      module={module}
      guide={academyGuide}
      fallbackSlug={`academy-registry-welcome-boxes-perks-${slug}`}
    />
  );
}
