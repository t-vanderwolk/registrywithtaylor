import RegistryWelcomeBoxesSubmodulePage from '@/components/academy/RegistryWelcomeBoxesSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getRegistryWelcomeBoxesAcademySubmodule,
  getRegistryWelcomeBoxesAcademySubmodulePath,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

const submodule = getRegistryWelcomeBoxesAcademySubmodule('macrobaby');
const path = getRegistryWelcomeBoxesAcademySubmodulePath('macrobaby');

export const metadata = buildMarketingMetadata({
  title: `${submodule.title} | Welcome Boxes & Registry Perks | TMBC Baby Academy`,
  description: submodule.metadataDescription,
  path,
  imagePath: submodule.heroImageSrc,
  imageAlt: submodule.heroImageAlt,
});

export default function RegistryWelcomeBoxesMacroBabyPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <RegistryWelcomeBoxesSubmodulePage slug="macrobaby" />
      </main>
    </SiteShell>
  );
}
