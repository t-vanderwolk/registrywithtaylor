import LearnHubLayout from '@/components/learn/LearnHubLayout';
import {
  REGISTRY_WELCOME_BOXES_DECK,
  REGISTRY_WELCOME_BOXES_HUB_INTRO,
  REGISTRY_WELCOME_BOXES_LEARNING_HIGHLIGHTS,
  REGISTRY_WELCOME_BOXES_NEXT_LINKS,
  REGISTRY_WELCOME_BOXES_STRATEGY,
  REGISTRY_WELCOME_BOXES_TITLE,
  getRegistryWelcomeBoxesAcademySubmoduleCards,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import { REGISTRY_PATH_IMAGES } from '@/lib/academy/registryModules';

export default function RegistryWelcomeBoxesHub() {
  return (
    <LearnHubLayout
      pathSlug="registry"
      moduleSlug="welcome-boxes-perks"
      breadcrumbs={[
        { label: 'Academy', href: '/learn' },
        { label: 'Registry', href: '/learn/registry' },
        { label: REGISTRY_WELCOME_BOXES_TITLE },
      ]}
      title={REGISTRY_WELCOME_BOXES_TITLE}
      deck={REGISTRY_WELCOME_BOXES_DECK}
      intro={[...REGISTRY_WELCOME_BOXES_HUB_INTRO]}
      heroImageSrc={REGISTRY_PATH_IMAGES.welcomeBox}
      heroImageAlt="Editorial registry welcome box image for Taylor-Made Baby Co."
      progress={{ current: 4, total: 8 }}
      learningHighlights={[...REGISTRY_WELCOME_BOXES_LEARNING_HIGHLIGHTS]}
      philosophy={[...REGISTRY_WELCOME_BOXES_STRATEGY]}
      taylorNoteTitle="This is not about collecting boxes."
      taylorNoteBody="It is about understanding platforms. The freebie is only interesting if the system around it still makes sense once the samples are gone."
      submodulesTitle="Open the platform that needs the clearer read"
      submodulesDescription="Each submodule breaks down how the box works, how to qualify, what the perk actually says about the platform, and whether the setup is worth your time."
      submoduleCards={getRegistryWelcomeBoxesAcademySubmoduleCards()}
      primaryCta={{ href: '/academy/registry/welcome-boxes-perks/target', label: 'Explore submodules' }}
      nextLinks={[...REGISTRY_WELCOME_BOXES_NEXT_LINKS]}
    />
  );
}
