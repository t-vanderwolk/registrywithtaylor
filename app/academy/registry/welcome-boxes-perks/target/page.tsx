import RegistryWelcomeBoxesSubmodulePage from '@/components/academy/RegistryWelcomeBoxesSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getRegistryWelcomeBoxesAcademySubmodule,
  getRegistryWelcomeBoxesAcademySubmodulePath,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const submodule = getRegistryWelcomeBoxesAcademySubmodule('target');
const path = getRegistryWelcomeBoxesAcademySubmodulePath('target');

export const metadata = buildMarketingMetadata({
  title: `${submodule.title} | Welcome Boxes & Registry Perks | TMBC Baby Academy`,
  description: submodule.metadataDescription,
  path,
  imagePath: submodule.heroImageSrc,
  imageAlt: submodule.heroImageAlt,
});

export default function RegistryWelcomeBoxesTargetPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <RegistryWelcomeBoxesSubmodulePage slug="target" />
      </main>
    </SiteShell>
  );
}
