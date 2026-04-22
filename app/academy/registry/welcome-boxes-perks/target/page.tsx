import type { Metadata } from 'next';
import RegistryWelcomeBoxesSubmodulePage from '@/components/academy/RegistryWelcomeBoxesSubmodulePage';
import SiteShell from '@/components/SiteShell';
import {
  getRegistryWelcomeBoxesAcademySubmodule,
  getRegistryWelcomeBoxesAcademySubmodulePath,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import { buildAcademyPageMetadata } from '@/lib/academy/routeMetadata';

const submodule = getRegistryWelcomeBoxesAcademySubmodule('target');
const path = getRegistryWelcomeBoxesAcademySubmodulePath('target');

export async function generateMetadata(): Promise<Metadata> {
  return buildAcademyPageMetadata({
    defaultTitle: `${submodule.title} | Welcome Boxes & Registry Perks | TMBC Baby Academy`,
    description: submodule.metadataDescription,
    path,
    imagePath: submodule.heroImageSrc,
    imageAlt: submodule.heroImageAlt,
    keywords: [
      submodule.title,
      submodule.deck,
      ...submodule.decisionBullets.slice(0, 4),
    ],
  });
}

export default function RegistryWelcomeBoxesTargetPage() {
  return (
    <SiteShell currentPath={path}>
      <main className="site-main min-h-0">
        <RegistryWelcomeBoxesSubmodulePage slug="target" />
      </main>
    </SiteShell>
  );
}
