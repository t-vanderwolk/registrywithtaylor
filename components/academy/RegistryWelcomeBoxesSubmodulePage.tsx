import AcademyModuleRenderer from '@/components/academy/AcademyModuleRenderer';
import {
  buildRegistryWelcomeBoxesAcademySubmoduleModule,
  type RegistryWelcomeBoxesSubmoduleSlug,
} from '@/lib/academy/registryWelcomeBoxesAcademy';

export default async function RegistryWelcomeBoxesSubmodulePage({
  slug,
}: {
  slug: RegistryWelcomeBoxesSubmoduleSlug;
}) {
  const module = buildRegistryWelcomeBoxesAcademySubmoduleModule(slug);

  return <AcademyModuleRenderer module={module} />;
}
