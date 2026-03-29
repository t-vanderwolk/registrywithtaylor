import ModuleLayout, { type ModuleLayoutData } from '@/components/academy/ModuleLayout';
import {
  DAILY_USE_GEAR_ACADEMY_HUB_PATH,
  DAILY_USE_GEAR_ACADEMY_TITLE,
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmoduleNavigation,
  getDailyUseGearAcademySubmodulePath,
  type DailyUseGearAcademySection,
  type DailyUseGearAcademySubmoduleSlug,
} from '@/lib/academy/dailyUseGearAcademy';

function flattenSectionParagraphs(section: DailyUseGearAcademySection) {
  return [
    ...(section.paragraphs ?? []),
    ...(
      section.groups?.flatMap((group) =>
        group.items.map((item, index) =>
          group.title && index === 0 ? `${group.title}: ${item}` : item,
        ),
      ) ?? []
    ),
  ];
}

function buildCoreSections(submodule: ReturnType<typeof getDailyUseGearAcademySubmodule>): ModuleLayoutData['coreSections'] {
  return [
    {
      title: 'Start with the category basics',
      paragraphs: flattenSectionParagraphs(submodule.learn),
      imageSrc: submodule.heroImageSrc,
      imageAlt: submodule.heroImageAlt,
      imageCaption: 'Understanding the category first usually makes the shortlist much quieter.',
    },
    {
      title: 'What to think through before you choose',
      paragraphs: flattenSectionParagraphs(submodule.plan),
      imageSrc: '/assets/editorial/clipboard.png',
      imageAlt: 'Planning notes for daily-use baby gear decisions.',
      imageCaption: 'This is the part where the category gets smaller because your routine gets clearer.',
    },
    {
      title: 'What to pressure-test in real life',
      paragraphs: flattenSectionParagraphs(submodule.trySection),
      imageSrc: '/assets/editorial/ipadblueprint.png',
      imageAlt: 'Testing notes for daily-use gear decisions.',
      imageCaption: 'Testing the boring parts now usually prevents the louder regret later.',
    },
    {
      title: 'How to keep the purchase edited',
      paragraphs: flattenSectionParagraphs(submodule.buy),
      imageSrc: '/assets/editorial/organize.png',
      imageAlt: 'Organized everyday baby gear setup.',
      imageCaption: 'The best buy is usually the one that supports the routine without multiplying the category.',
    },
  ];
}

export default async function DailyUseGearSubmodulePage({
  slug,
}: {
  slug: DailyUseGearAcademySubmoduleSlug;
}) {
  const submodule = getDailyUseGearAcademySubmodule(slug);
  const navigation = getDailyUseGearAcademySubmoduleNavigation(slug);
  const currentPath = getDailyUseGearAcademySubmodulePath(slug);

  const module: ModuleLayoutData = {
    slug,
    pathSlug: 'gear',
    href: currentPath,
    title: submodule.title,
    description: submodule.cardSummary,
    subhead: submodule.deck,
    intro: submodule.intro,
    imagePath: submodule.heroImageSrc,
    imageAlt: submodule.heroImageAlt,
    progress: {
      current: submodule.order,
      total: 6,
    },
    coreSections: buildCoreSections(submodule),
    decisionTitle: 'What This Means For You',
    decisionBullets: submodule.decisionBullets,
    products: [],
    softCtaLabel: submodule.note.eyebrow,
    softCtaTitle: submodule.note.title,
    softCtaBody: [submodule.note.body],
    previous: navigation.previous,
    next: navigation.next,
    related: navigation.hub,
    editorialLinks: [],
    submoduleSection: null,
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: 'Gear', href: '/academy/gear' },
      { label: DAILY_USE_GEAR_ACADEMY_TITLE, href: DAILY_USE_GEAR_ACADEMY_HUB_PATH },
      { label: submodule.title },
    ],
  };

  return <ModuleLayout module={module} />;
}
