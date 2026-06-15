import type { PostStatus, Prisma } from '@prisma/client';
import {
  buildRegistryWelcomeBoxesAcademySubmoduleModule,
  getRegistryWelcomeBoxesAcademySubmodule,
  getRegistryWelcomeBoxesAcademySubmoduleNavigation,
  getRegistryWelcomeBoxesAcademySubmodulePath,
  type RegistryWelcomeBoxesSubmoduleSlug,
} from '@/lib/academy/registryWelcomeBoxesAcademy';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import prisma from '@/lib/server/prisma';

const PUBLISH_FLAG = '--publish';
const ACADEMY_TOPIC_CLUSTER_TOKEN = 'TMBC Baby Academy';
const REGISTRY_CATEGORY = GUIDE_CATEGORIES[2];
const REGISTRY_WELCOME_BOXES_TOPIC_CLUSTER = `${ACADEMY_TOPIC_CLUSTER_TOKEN} · Registry · Welcome Boxes & Registry Perks`;
const REGISTRY_WELCOME_BOXES_PARENT_PATH = '/academy/registry/welcome-boxes-perks';
const REGISTRY_WELCOME_BOXES_PARENT_SLUG = 'academy-registry-welcome-boxes-perks';
const REGISTRY_WELCOME_BOXES_SUBMODULE_SLUGS: RegistryWelcomeBoxesSubmoduleSlug[] = [
  'target',
  'babylist',
  'amazon',
  'macrobaby',
];

function truncateAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, boundary > 0 ? boundary : maxLength).trim()}.`;
}

function buildGuideSlug(slug: RegistryWelcomeBoxesSubmoduleSlug) {
  return `academy-registry-welcome-boxes-perks-${slug}`;
}

function buildSeoTitle(title: string) {
  return `${title} | Welcome Boxes & Registry Perks | TMBC Baby Academy`;
}

function buildTargetKeyword(title: string) {
  return `${title.toLowerCase()} registry perk`;
}

function buildModuleContent(slug: RegistryWelcomeBoxesSubmoduleSlug) {
  const module = buildRegistryWelcomeBoxesAcademySubmoduleModule(slug);
  const navigation = getRegistryWelcomeBoxesAcademySubmoduleNavigation(slug);

  const moduleIntro = [
    `## Module ${module.progress.current} of ${module.progress.total} · Welcome Boxes & Registry Perks`,
    ...module.intro,
  ].join('\n\n');

  const coreConsiderations = [
    '## Core Considerations',
    ...module.coreSections.map((section) =>
      [
        `### ${section.title}`,
        `![${section.imageAlt}](${section.imageSrc})`,
        section.imageCaption ? `*${section.imageCaption}*` : null,
        ...section.paragraphs,
      ]
        .filter(Boolean)
        .join('\n\n'),
    ),
  ].join('\n\n');

  const whatThisMeans = [
    `## ${module.decisionTitle}`,
    ...module.decisionBullets.map((bullet) => `- ${bullet}`),
  ].join('\n');

  const softCta = [
    `## ${module.softCtaLabel}`,
    module.softCtaTitle,
    ...module.softCtaBody,
  ].join('\n\n');

  const nextSteps = [
    '## Next Steps',
    `- Return to the Welcome Boxes & Registry Perks hub: ${navigation.hub.href}`,
    navigation.previous ? `- Previous stop: ${navigation.previous.title} (${navigation.previous.href})` : null,
    navigation.next ? `- Continue to: ${navigation.next.title} (${navigation.next.href})` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [moduleIntro, coreConsiderations, whatThisMeans, softCta, nextSteps].join('\n\n').trim();
}

function getStatusData({
  existing,
  publish,
}: {
  existing: { status: PostStatus; publishedAt: Date | null; archivedAt: Date | null } | null;
  publish: boolean;
}) {
  if (publish) {
    return {
      status: 'PUBLISHED' as const,
      publishedAt: existing?.publishedAt ?? new Date(),
      archivedAt: null,
    };
  }

  return {
    status: existing?.status ?? ('DRAFT' as const),
    publishedAt: existing?.publishedAt ?? null,
    archivedAt: existing?.archivedAt ?? null,
  };
}

async function getSeedAuthor() {
  return (
    (await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    })) ??
    (await prisma.user.findFirst({
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    }))
  );
}

async function findExistingGuide({
  publicPath,
  stableSlug,
}: {
  publicPath: string;
  stableSlug: string;
}) {
  return prisma.guide.findFirst({
    where: {
      OR: [
        {
          canonicalUrl: {
            endsWith: publicPath,
            mode: 'insensitive',
          },
        },
        {
          slug: stableSlug,
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      status: true,
      publishedAt: true,
      archivedAt: true,
    },
  });
}

async function main() {
  const publish = process.argv.includes(PUBLISH_FLAG);
  const author = await getSeedAuthor();

  if (!author) {
    throw new Error('No users found. Create an admin user before seeding Welcome Boxes & Registry Perks submodules.');
  }

  const parentGuide = await prisma.guide.findFirst({
    where: {
      OR: [
        {
          canonicalUrl: {
            endsWith: REGISTRY_WELCOME_BOXES_PARENT_PATH,
            mode: 'insensitive',
          },
        },
        { slug: REGISTRY_WELCOME_BOXES_PARENT_SLUG },
      ],
    },
    select: {
      id: true,
    },
  });

  const seededGuideIdsBySlug = new Map<RegistryWelcomeBoxesSubmoduleSlug, string>();

  for (const slug of REGISTRY_WELCOME_BOXES_SUBMODULE_SLUGS) {
    const submodule = getRegistryWelcomeBoxesAcademySubmodule(slug);
    const module = buildRegistryWelcomeBoxesAcademySubmoduleModule(slug);
    const publicPath = getRegistryWelcomeBoxesAcademySubmodulePath(slug);
    const stableSlug = buildGuideSlug(slug);
    const existing = await findExistingGuide({ publicPath, stableSlug });
    const statusData = getStatusData({ existing, publish });
    const navigation = getRegistryWelcomeBoxesAcademySubmoduleNavigation(slug);
    const nextStepHref = navigation.next?.href ?? navigation.hub.href;
    const nextStepLabel = navigation.next ? `Continue to ${navigation.next.title}` : 'Back to Welcome Boxes & Registry Perks';
    const seoDescription = truncateAtWordBoundary(submodule.metadataDescription, 160);
    const excerpt = truncateAtWordBoundary(submodule.cardSummary, 220);

    const data = {
      title: module.title,
      slug: existing?.slug ?? stableSlug,
      excerpt,
      intro: module.intro.join('\n\n'),
      content: buildModuleContent(slug),
      conclusion: null,
      heroImageUrl: module.imagePath,
      heroImageAlt: module.imageAlt,
      authorId: author.id,
      category: REGISTRY_CATEGORY,
      topicCluster: REGISTRY_WELCOME_BOXES_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: buildSeoTitle(module.title),
      seoDescription,
      ogTitle: buildSeoTitle(module.title),
      ogDescription: seoDescription,
      ogImageUrl: module.imagePath,
      ogImageAlt: module.imageAlt,
      canonicalUrl: publicPath,
      targetKeyword: buildTargetKeyword(module.title),
      secondaryKeywords: [] as string[],
      internalLinkNotes:
        'Seeded from lib/academy/registryWelcomeBoxesAcademy.ts. This record powers the live Welcome Boxes & Registry Perks Academy submodule route and its editor workspace entry.',
      tableOfContentsEnabled: true,
      faqItems: [] as Prisma.InputJsonValue,
      affiliateDisclosureEnabled: false,
      affiliateDisclosureText: null,
      affiliateDisclosurePlacement: 'before_affiliates',
      affiliateModules: [] as Prisma.InputJsonValue,
      consultationCtaEnabled: true,
      consultationCtaLabel: 'Book a Free Consultation',
      newsletterCtaEnabled: false,
      newsletterCtaLabel: null,
      newsletterCtaDescription: null,
      newsletterCtaHref: null,
      nextStepCtaLabel: nextStepLabel,
      nextStepCtaHref: nextStepHref,
      founderSignatureEnabled: false,
      founderSignatureText: null,
    };

    const saved = existing
      ? await prisma.guide.update({
          where: { id: existing.id },
          data,
          select: { id: true, title: true, status: true },
        })
      : await prisma.guide.create({
          data: {
            ...data,
            relatedGuideIds: [],
          },
          select: { id: true, title: true, status: true },
        });

    seededGuideIdsBySlug.set(slug, saved.id);
    console.log(`${existing ? 'Updated' : 'Created'} Welcome Boxes submodule: ${saved.title} [${saved.status}]`);
  }

  for (const slug of REGISTRY_WELCOME_BOXES_SUBMODULE_SLUGS) {
    const navigation = getRegistryWelcomeBoxesAcademySubmoduleNavigation(slug);
    const guideId = seededGuideIdsBySlug.get(slug);

    if (!guideId) {
      continue;
    }

    const previousSlug = navigation.previous?.href.split('/').filter(Boolean).at(-1) as RegistryWelcomeBoxesSubmoduleSlug | undefined;
    const nextSlug = navigation.next?.href.split('/').filter(Boolean).at(-1) as RegistryWelcomeBoxesSubmoduleSlug | undefined;

    const relatedGuideIds = [
      parentGuide?.id ?? null,
      previousSlug && REGISTRY_WELCOME_BOXES_SUBMODULE_SLUGS.includes(previousSlug)
        ? seededGuideIdsBySlug.get(previousSlug) ?? null
        : null,
      nextSlug && REGISTRY_WELCOME_BOXES_SUBMODULE_SLUGS.includes(nextSlug)
        ? seededGuideIdsBySlug.get(nextSlug) ?? null
        : null,
    ].filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  console.log('');
  console.log(
    `Seeded ${REGISTRY_WELCOME_BOXES_SUBMODULE_SLUGS.length} Welcome Boxes & Registry Perks submodules as ${publish ? 'published' : 'draft'} content.`,
  );
  console.log(`Author: ${author.name?.trim() || author.email}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed Welcome Boxes & Registry Perks submodules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
