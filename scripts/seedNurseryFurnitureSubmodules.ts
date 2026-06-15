import type { PostStatus, Prisma } from '@prisma/client';
import {
  buildNurseryFurnitureAcademySubmoduleModule,
  getNurseryFurnitureCategory,
  getNurseryFurnitureCategoryNextStepLinks,
  getNurseryFurnitureCategoryPath,
  isNurseryFurnitureCategorySlug,
  type NurseryFurnitureCategorySlug,
} from '@/lib/academy/nurseryFurnitureAcademy';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import prisma from '@/lib/server/prisma';

const PUBLISH_FLAG = '--publish';
const SLUG_FLAG_PREFIX = '--slug=';
const ACADEMY_TOPIC_CLUSTER_TOKEN = 'TMBC Baby Academy';
const NURSERY_CATEGORY = GUIDE_CATEGORIES[3];
const NURSERY_FURNITURE_TOPIC_CLUSTER = `${ACADEMY_TOPIC_CLUSTER_TOKEN} · Nursery · Furniture That Actually Works`;
const NURSERY_FURNITURE_PARENT_PATH = '/academy/nursery/furniture-that-actually-works';
const NURSERY_FURNITURE_PARENT_SLUG = 'furniture-that-actually-works';
const NURSERY_FURNITURE_SUBMODULE_SLUGS: NurseryFurnitureCategorySlug[] = [
  'cribs',
  'pack-and-play',
  'gliders',
  'dressers-changing',
  'diaper-pails',
  'baby-monitors',
  'baby-proofing',
];

function truncateAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, boundary > 0 ? boundary : maxLength).trim()}.`;
}

function buildGuideSlug(slug: NurseryFurnitureCategorySlug) {
  return `academy-nursery-furniture-that-actually-works-${slug}`;
}

function buildSeoTitle(title: string) {
  return `${title} | Furniture That Actually Works | TMBC Baby Academy`;
}

function buildTargetKeyword(title: string) {
  return `${title.toLowerCase()} nursery`;
}

function buildModuleContent(slug: NurseryFurnitureCategorySlug) {
  const module = buildNurseryFurnitureAcademySubmoduleModule(slug);
  const nextSteps = getNurseryFurnitureCategoryNextStepLinks(slug);

  const moduleIntro = [
    `## Module ${module.progress.current} of ${module.progress.total} · Furniture That Actually Works`,
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

  const nextStepsSection = [
    '## Next Steps',
    ...nextSteps.map((step) => `- ${step.label}: ${step.href}`),
  ].join('\n');

  return [moduleIntro, coreConsiderations, whatThisMeans, softCta, nextStepsSection].join('\n\n').trim();
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

async function findGuideIdByPathOrSlug({
  publicPath,
  stableSlug,
}: {
  publicPath: string;
  stableSlug: string;
}) {
  const guide = await prisma.guide.findFirst({
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
    select: { id: true },
  });

  return guide?.id ?? null;
}

function getRequestedSlug() {
  const slugArg = process.argv.find((arg) => arg.startsWith(SLUG_FLAG_PREFIX));
  if (!slugArg) {
    return null;
  }

  const value = slugArg.slice(SLUG_FLAG_PREFIX.length).trim();
  if (!isNurseryFurnitureCategorySlug(value)) {
    throw new Error(`Invalid nursery furniture submodule slug: ${value}`);
  }

  return value;
}

async function main() {
  const publish = process.argv.includes(PUBLISH_FLAG);
  const requestedSlug = getRequestedSlug();
  const targetSlugs = requestedSlug ? [requestedSlug] : NURSERY_FURNITURE_SUBMODULE_SLUGS;
  const author = await getSeedAuthor();

  if (!author) {
    throw new Error('No users found. Create an admin user before seeding Nursery Furniture submodules.');
  }

  const parentGuide = await prisma.guide.findFirst({
    where: {
      OR: [
        {
          canonicalUrl: {
            endsWith: NURSERY_FURNITURE_PARENT_PATH,
            mode: 'insensitive',
          },
        },
        { slug: NURSERY_FURNITURE_PARENT_SLUG },
      ],
    },
    select: { id: true },
  });

  const seededGuideIdsBySlug = new Map<NurseryFurnitureCategorySlug, string>();

  for (const slug of targetSlugs) {
    const category = getNurseryFurnitureCategory(slug);
    const module = buildNurseryFurnitureAcademySubmoduleModule(slug);
    const publicPath = getNurseryFurnitureCategoryPath(slug);
    const stableSlug = buildGuideSlug(slug);
    const existing = await findExistingGuide({ publicPath, stableSlug });
    const statusData = getStatusData({ existing, publish });
    const nextSteps = getNurseryFurnitureCategoryNextStepLinks(slug);
    const nextStepHref = nextSteps[0]?.href ?? NURSERY_FURNITURE_PARENT_PATH;
    const nextStepLabel = nextSteps[0]?.label ? `Continue to ${nextSteps[0].label}` : 'Back to Furniture That Actually Works';
    const seoDescription = truncateAtWordBoundary(category.metadataDescription, 160);
    const excerpt = truncateAtWordBoundary(module.intro.join(' '), 220);

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
      category: NURSERY_CATEGORY,
      topicCluster: NURSERY_FURNITURE_TOPIC_CLUSTER,
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
      secondaryKeywords: [
        slug.replace(/-/g, ' '),
        category.description,
        ...category.types.slice(0, 2).map((item) => item.split(':')[0].trim().toLowerCase()),
      ],
      internalLinkNotes:
        'Seeded from lib/academy/nurseryFurnitureAcademy.ts. This record powers the live Furniture That Actually Works Nursery Academy submodule route and its editor workspace entry.',
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
    console.log(`${existing ? 'Updated' : 'Created'} Nursery Furniture submodule: ${saved.title} [${saved.status}]`);
  }

  for (const slug of targetSlugs) {
    const guideId = seededGuideIdsBySlug.get(slug);
    if (!guideId) {
      continue;
    }

    const currentIndex = NURSERY_FURNITURE_SUBMODULE_SLUGS.indexOf(slug);
    const previousSlug = currentIndex > 0 ? NURSERY_FURNITURE_SUBMODULE_SLUGS[currentIndex - 1] ?? null : null;
    const nextSlug =
      currentIndex >= 0 && currentIndex < NURSERY_FURNITURE_SUBMODULE_SLUGS.length - 1
        ? NURSERY_FURNITURE_SUBMODULE_SLUGS[currentIndex + 1] ?? null
        : null;

    const previousGuideId = previousSlug
      ? (seededGuideIdsBySlug.get(previousSlug) ??
        (await findGuideIdByPathOrSlug({
          publicPath: getNurseryFurnitureCategoryPath(previousSlug),
          stableSlug: buildGuideSlug(previousSlug),
        })))
      : null;
    const nextGuideId = nextSlug
      ? (seededGuideIdsBySlug.get(nextSlug) ??
        (await findGuideIdByPathOrSlug({
          publicPath: getNurseryFurnitureCategoryPath(nextSlug),
          stableSlug: buildGuideSlug(nextSlug),
        })))
      : null;

    const relatedGuideIds = [parentGuide?.id ?? null, previousGuideId, nextGuideId].filter(
      (id): id is string => Boolean(id),
    );

    await prisma.guide.update({
      where: { id: guideId },
      data: { relatedGuideIds },
    });
  }

  console.log('');
  console.log(
    `Seeded ${targetSlugs.length} Nursery Furniture submodule${targetSlugs.length === 1 ? '' : 's'} as ${publish ? 'published' : 'draft'} content.`,
  );
  console.log(`Author: ${author.name?.trim() || author.email}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed Nursery Furniture submodules:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
