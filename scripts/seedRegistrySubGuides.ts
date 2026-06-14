import type { PostStatus, Prisma } from '@prisma/client';
import { extractFaqEntries, extractLeadParagraphs, stripMarkdown } from '@/lib/blog/contentText';
import { GUIDE_CATEGORIES } from '@/lib/guides/categories';
import {
  REGISTRY_GUIDE_PARENT_SLUG,
  REGISTRY_GUIDE_TOPIC_CLUSTER,
  getRegistrySubGuideBySlug,
  getRegistrySubGuideSlugs,
} from '@/lib/learn/registry/where-to-registerSubguides';
import { getGuidePath } from '@/lib/guides/routing';
import prisma from '@/lib/server/prisma';

const PUBLISH_FLAG = '--publish';
const REGISTRY_CATEGORY = GUIDE_CATEGORIES[2];
const REGISTRY_GUIDE_IMAGE = '/assets/hero/hero-baby-editorial.jpg';

function truncateAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, boundary > 0 ? boundary : maxLength).trim()}.`;
}

function buildExcerpt(content: string, fallback: string) {
  const lead = extractLeadParagraphs(content, 2)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter(Boolean)
    .join(' ');

  return truncateAtWordBoundary(lead || fallback, 220);
}

function buildSeoDescription(content: string, fallback: string) {
  const lead = extractLeadParagraphs(content, 2)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter(Boolean)
    .join(' ');

  return truncateAtWordBoundary(lead || fallback, 160);
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

async function main() {
  const publish = process.argv.includes(PUBLISH_FLAG);

  const author =
    (await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    })) ??
    (await prisma.user.findFirst({
      select: { id: true, email: true, name: true },
      orderBy: { createdAt: 'asc' },
    }));

  if (!author) {
    throw new Error('No users found. Create an admin user before seeding registry sub-guides.');
  }

  const guides = getRegistrySubGuideSlugs().map((slug) => {
    const guide = getRegistrySubGuideBySlug(slug);
    if (!guide) {
      throw new Error(`Missing registry sub-guide definition for "${slug}".`);
    }

    return {
      ...guide,
      excerpt: buildExcerpt(guide.content, guide.description),
      derivedSeoDescription: buildSeoDescription(guide.content, guide.seoDescription),
      faqItems: extractFaqEntries(guide.content),
    };
  });

  const seededGuideIdsBySlug = new Map<string, string>();

  for (const guide of guides) {
    const existing = await prisma.guide.findUnique({
      where: { slug: guide.slug },
      select: { id: true, status: true, publishedAt: true, archivedAt: true },
    });

    const statusData = getStatusData({ existing, publish });
    const data = {
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
      intro: null,
      content: guide.content,
      conclusion: null,
      heroImageUrl: REGISTRY_GUIDE_IMAGE,
      heroImageAlt: guide.title,
      authorId: author.id,
      category: REGISTRY_CATEGORY,
      topicCluster: REGISTRY_GUIDE_TOPIC_CLUSTER,
      status: statusData.status,
      publishedAt: statusData.publishedAt,
      scheduledFor: null,
      archivedAt: statusData.archivedAt,
      seoTitle: guide.seoTitle,
      seoDescription: guide.derivedSeoDescription,
      ogTitle: guide.seoTitle,
      ogDescription: guide.derivedSeoDescription,
      ogImageUrl: REGISTRY_GUIDE_IMAGE,
      ogImageAlt: guide.title,
      canonicalUrl: getGuidePath({ slug: guide.slug, topicCluster: REGISTRY_GUIDE_TOPIC_CLUSTER }),
      targetKeyword: guide.targetKeyword,
      secondaryKeywords: [...guide.secondaryKeywords],
      internalLinkNotes:
        'Seeded from lib/learn/registry/where-to-registerSubguides.ts. Review registry retailer details and perk language when partner terms change.',
      tableOfContentsEnabled: true,
      faqItems: guide.faqItems as Prisma.InputJsonValue,
      affiliateDisclosureEnabled: false,
      affiliateDisclosureText: null,
      affiliateDisclosurePlacement: 'before_affiliates',
      affiliateModules: [] as Prisma.InputJsonValue,
      consultationCtaEnabled: true,
      consultationCtaLabel: 'Book a Consultation',
      newsletterCtaEnabled: false,
      newsletterCtaLabel: null,
      newsletterCtaDescription: null,
      newsletterCtaHref: null,
      nextStepCtaLabel: guide.nextStepCtaLabel,
      nextStepCtaHref: guide.nextStepCtaHref,
      founderSignatureEnabled: false,
      founderSignatureText: null,
    };

    const saved = existing
      ? await prisma.guide.update({
          where: { id: existing.id },
          data,
          select: { id: true, slug: true, title: true, status: true },
        })
      : await prisma.guide.create({
          data: {
            ...data,
            relatedGuideIds: [],
          },
          select: { id: true, slug: true, title: true, status: true },
        });

    seededGuideIdsBySlug.set(saved.slug, saved.id);
    console.log(`${existing ? 'Updated' : 'Created'} registry guide: ${saved.title} (${saved.slug}) [${saved.status}]`);
  }

  const relatedSlugs = Array.from(
    new Set([REGISTRY_GUIDE_PARENT_SLUG, ...guides.flatMap((guide) => guide.relatedSlugs)]),
  );

  const relatedGuideRecords = await prisma.guide.findMany({
    where: {
      slug: {
        in: relatedSlugs,
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  const guideIdBySlug = new Map<string, string>(relatedGuideRecords.map((guide) => [guide.slug, guide.id]));
  for (const [slug, id] of seededGuideIdsBySlug) {
    guideIdBySlug.set(slug, id);
  }

  for (const guide of guides) {
    const guideId = seededGuideIdsBySlug.get(guide.slug);
    if (!guideId) {
      continue;
    }

    const relatedGuideIds = guide.relatedSlugs
      .map((slug) => guideIdBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        relatedGuideIds,
      },
    });
  }

  const parentGuideId = guideIdBySlug.get(REGISTRY_GUIDE_PARENT_SLUG);
  if (parentGuideId) {
    await prisma.guide.update({
      where: { id: parentGuideId },
      data: {
        relatedGuideIds: guides
          .map((guide) => seededGuideIdsBySlug.get(guide.slug))
          .filter((id): id is string => Boolean(id)),
      },
    });
  }

  console.log('');
  console.log(`Seeded ${guides.length} registry sub-guides as ${publish ? 'published' : 'draft'} content.`);
  console.log(`Author: ${author.name?.trim() || author.email}`);
}

main()
  .catch((error) => {
    console.error('Failed to seed registry sub-guides:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
