import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { generateUniqueGuideSlug } from '@/lib/server/guides';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { revalidateGuidePaths } from '@/lib/server/guideMutation';
import { GUIDE_STORAGE_UNAVAILABLE_MESSAGE, isGuideStorageUnavailableError } from '@/lib/server/guideStorage';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const token = await requireAdmin(req);

    if (!token?.id) {
      return unauthorizedResponse();
    }

  const source = await prisma.guide.findUnique({
    where: { id },
  });

  if (!source) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const title = `${source.title} (Copy)`;
  const slug = await generateUniqueGuideSlug(title);

  const duplicated = await prisma.guide.create({
    data: {
      title,
      slug,
      excerpt: source.excerpt,
      intro: source.intro,
      content: source.content,
      conclusion: source.conclusion,
      heroImageUrl: source.heroImageUrl,
      heroImageAlt: source.heroImageAlt,
      authorId: source.authorId,
      category: source.category,
      topicCluster: source.topicCluster,
      status: 'DRAFT',
      publishedAt: null,
      scheduledFor: null,
      archivedAt: null,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ogTitle: source.ogTitle,
      ogDescription: source.ogDescription,
      ogImageUrl: source.ogImageUrl,
      ogImageAlt: source.ogImageAlt,
      canonicalUrl: source.canonicalUrl,
      targetKeyword: source.targetKeyword,
      secondaryKeywords: source.secondaryKeywords,
      internalLinkNotes: source.internalLinkNotes,
      tableOfContentsEnabled: source.tableOfContentsEnabled,
      faqItems: source.faqItems as Prisma.InputJsonValue,
      affiliateDisclosureEnabled: source.affiliateDisclosureEnabled,
      affiliateDisclosureText: source.affiliateDisclosureText,
      affiliateDisclosurePlacement: source.affiliateDisclosurePlacement,
      affiliateModules: source.affiliateModules as Prisma.InputJsonValue,
      consultationCtaEnabled: source.consultationCtaEnabled,
      consultationCtaLabel: source.consultationCtaLabel,
      newsletterCtaEnabled: source.newsletterCtaEnabled,
      newsletterCtaLabel: source.newsletterCtaLabel,
      newsletterCtaDescription: source.newsletterCtaDescription,
      newsletterCtaHref: source.newsletterCtaHref,
      nextStepCtaLabel: source.nextStepCtaLabel,
      nextStepCtaHref: source.nextStepCtaHref,
      founderSignatureEnabled: source.founderSignatureEnabled,
      founderSignatureText: source.founderSignatureText,
      relatedGuideIds: source.relatedGuideIds,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      authorId: true,
      status: true,
    },
  });

  await logGuideEvent({
    guideId: duplicated.id,
    event: GuideAnalyticsEvents.GUIDE_DUPLICATED,
    sourceRoute: `/admin/guides/${id}/edit`,
    meta: {
      guide_id: duplicated.id,
      guide_title: duplicated.title,
      guide_slug: duplicated.slug,
      guide_category: duplicated.category,
      author_id: duplicated.authorId,
      status: duplicated.status,
      source_guide_id: source.id,
      source_route: `/admin/guides/${id}/edit`,
    },
  });

    revalidateGuidePaths(duplicated);
    return NextResponse.json({ id: duplicated.id, slug: duplicated.slug }, { status: 201 });
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return NextResponse.json({ error: GUIDE_STORAGE_UNAVAILABLE_MESSAGE }, { status: 503 });
    }

    throw error;
  }
}
