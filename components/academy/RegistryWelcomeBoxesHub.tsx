import AcademyModuleHub from '@/components/academy/AcademyModuleHub';
import {
  REGISTRY_WELCOME_BOXES_DECK,
  REGISTRY_WELCOME_BOXES_GUIDANCE_LINES,
  REGISTRY_WELCOME_BOXES_HUB_INTRO,
  REGISTRY_WELCOME_BOXES_LEARNING_HIGHLIGHTS,
  REGISTRY_WELCOME_BOXES_NEXT_LINKS,
  REGISTRY_WELCOME_BOXES_PULL_QUOTE,
  REGISTRY_WELCOME_BOXES_STRATEGY,
  REGISTRY_WELCOME_BOXES_TITLE,
  getRegistryWelcomeBoxesAcademySubmoduleCards,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import { REGISTRY_PATH_IMAGES } from '@/lib/academy/registryModules';

export default function RegistryWelcomeBoxesHub() {
  return (
    <AcademyModuleHub
      pathSlug="registry"
      moduleSlug="welcome-boxes-perks"
      breadcrumbs={[
        { label: 'TMBC Academy', href: '/academy' },
        { label: 'Registry', href: '/academy/registry' },
        { label: REGISTRY_WELCOME_BOXES_TITLE },
      ]}
      heroEyebrow="TMBC Registry Module"
      title={REGISTRY_WELCOME_BOXES_TITLE}
      deck={REGISTRY_WELCOME_BOXES_DECK}
      intro={[...REGISTRY_WELCOME_BOXES_HUB_INTRO]}
      heroImageSrc={REGISTRY_PATH_IMAGES.welcomeBox}
      heroImageAlt="Editorial registry welcome box image for Taylor-Made Baby Co."
      pullQuote={REGISTRY_WELCOME_BOXES_PULL_QUOTE}
      progress={{ current: 4, total: 8, label: 'Registry path progress' }}
      learningTitle="How welcome boxes reveal the platform underneath"
      learningDescription="This is the part of registry strategy that sounds small until you realize it reveals how each platform actually wants you to behave."
      learningHighlights={[...REGISTRY_WELCOME_BOXES_LEARNING_HIGHLIGHTS]}
      philosophyTitle="Use perks to understand the platform, not just the box"
      philosophy={[...REGISTRY_WELCOME_BOXES_STRATEGY]}
      philosophyNoteTitle="The goal isn't to collect everything. It's to understand what actually works."
      philosophyNoteBody="A welcome box is useful when it gives you information, testing value, or a clearer reason to keep a platform in the mix."
      submodulesTitle="Open the platform that needs the clearer read"
      submodulesDescription="Each submodule breaks down how the box works, how to qualify, what the perk actually says about the platform, and whether the setup is worth your time."
      submoduleCards={getRegistryWelcomeBoxesAcademySubmoduleCards()}
      guidanceEyebrow="Strategy"
      guidanceTitle="The smartest registries do not rely on one platform"
      guidanceDescription="They layer the strengths instead of pretending every retailer should do the same job equally well."
      guidanceLines={[...REGISTRY_WELCOME_BOXES_GUIDANCE_LINES]}
      taylorNoteTitle="This is not about collecting boxes."
      taylorNoteBody="It is about understanding platforms. The freebie is only interesting if the system around it still makes sense once the samples are gone."
      nextTitle="Keep the Registry path moving"
      nextDescription="Use the links below to continue into support and store strategy or zoom back out to the full Registry path."
      nextLinks={[...REGISTRY_WELCOME_BOXES_NEXT_LINKS]}
      primaryCta={{ href: '/academy/registry/welcome-boxes-perks/target', label: 'Explore submodules' }}
      secondaryCta={{ href: '/academy/registry', label: 'Back to Registry path' }}
    />
  );
}
