import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestToken, requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { normalizeGuideCategory } from '@/lib/guides/categories';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { isGuidePubliclyVisible } from '@/lib/guides/status';
import { generateUniqueGuideSlug } from '@/lib/server/guides';
import { deriveGuideLifecycle, revalidateGuidePaths } from '@/lib/server/guideMutation';
import { guideEditorSelect, toGuideEditorRecord } from '@/lib/server/guideEditorRecord';
import { logGuideEvent } from '@/lib/server/guideAnalytics';
import { GUIDE_STORAGE_UNAVAILABLE_MESSAGE, isGuideStorageUnavailableError } from '@/lib/server/guideStorage';
import {
  asGuideAffiliateModules,
  asGuideFaqItems,
  asNullableImageUrl,
  asNullableLinkTarget,
  asNullableText,
  asStringArray,
  asText,
  hasOwn,
} from '@/lib/server/guidePayload';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const token = await getRequestToken(req);

    const guide = await prisma.guide.findUnique({
      where: { id },
      select: guideEditorSelect,
    });

    if (!guide) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (token?.role !== 'ADMIN' && !isGuidePubliclyVisible(guide.status, guide.scheduledFor)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (token?.role !== 'ADMIN') {
      return unauthorizedResponse();
    }

    return NextResponse.json(toGuideEditorRecord(guide));
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return NextResponse.json({ error: GUIDE_STORAGE_UNAVAILABLE_MESSAGE }, { status: 503 });
    }

    throw error;
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const token = await requireAdmin(req);

    if (!token?.id) {
      return unauthorizedResponse();
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

  const existingGuide = await prisma.guide.findUnique({
    where: { id },
    select: guideEditorSelect,
  });

  if (!existingGuide) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const shouldUpdateSlug = hasOwn(body, 'slug') || hasOwn(body, 'title');
  const nextTitle = hasOwn(body, 'title') ? asText(body.title) || 'Untitled guide' : existingGuide.title;
  const nextExcerpt = hasOwn(body, 'excerpt') ? asNullableText(body.excerpt) : existingGuide.excerpt;
  const nextIntro = hasOwn(body, 'intro') ? asNullableText(body.intro) : existingGuide.intro;
  const nextContent = hasOwn(body, 'content') ? asText(body.content) : existingGuide.content;
  const nextConclusion = hasOwn(body, 'conclusion') ? asNullableText(body.conclusion) : existingGuide.conclusion;
  const nextHeroImageUrl = hasOwn(body, 'heroImageUrl') ? asNullableImageUrl(body.heroImageUrl) : existingGuide.heroImageUrl;
  const nextHeroImageAlt = hasOwn(body, 'heroImageAlt') ? asNullableText(body.heroImageAlt) : existingGuide.heroImageAlt;
  const nextAuthorId = hasOwn(body, 'authorId') ? asText(body.authorId) || existingGuide.authorId : existingGuide.authorId;
  const nextCategory = hasOwn(body, 'category') ? normalizeGuideCategory(body.category) : normalizeGuideCategory(existingGuide.category);
  const nextTopicCluster = hasOwn(body, 'topicCluster') ? asNullableText(body.topicCluster) : existingGuide.topicCluster;
  const nextSeoTitle = hasOwn(body, 'seoTitle') ? asNullableText(body.seoTitle) : existingGuide.seoTitle;
  const nextSeoDescription = hasOwn(body, 'seoDescription') ? asNullableText(body.seoDescription) : existingGuide.seoDescription;
  const nextOgTitle = hasOwn(body, 'ogTitle') ? asNullableText(body.ogTitle) : existingGuide.ogTitle;
  const nextOgDescription = hasOwn(body, 'ogDescription') ? asNullableText(body.ogDescription) : existingGuide.ogDescription;
  const nextOgImageUrl = hasOwn(body, 'ogImageUrl') ? asNullableImageUrl(body.ogImageUrl) : existingGuide.ogImageUrl;
  const nextOgImageAlt = hasOwn(body, 'ogImageAlt') ? asNullableText(body.ogImageAlt) : existingGuide.ogImageAlt;
  const nextCanonicalUrl = hasOwn(body, 'canonicalUrl') ? asNullableLinkTarget(body.canonicalUrl) : existingGuide.canonicalUrl;
  const nextTargetKeyword = hasOwn(body, 'targetKeyword') ? asNullableText(body.targetKeyword) : existingGuide.targetKeyword;
  const nextSecondaryKeywords = hasOwn(body, 'secondaryKeywords') ? asStringArray(body.secondaryKeywords) : existingGuide.secondaryKeywords;
  const nextInternalLinkNotes = hasOwn(body, 'internalLinkNotes')
    ? asNullableText(body.internalLinkNotes)
    : existingGuide.internalLinkNotes;
  const nextTableOfContentsEnabled = hasOwn(body, 'tableOfContentsEnabled')
    ? body.tableOfContentsEnabled !== false
    : existingGuide.tableOfContentsEnabled;
  const nextFaqItems = hasOwn(body, 'faqItems') ? asGuideFaqItems(body.faqItems) : existingGuide.faqItems;
  const nextAffiliateDisclosureEnabled = hasOwn(body, 'affiliateDisclosureEnabled')
    ? body.affiliateDisclosureEnabled !== false
    : existingGuide.affiliateDisclosureEnabled;
  const nextAffiliateDisclosureText = hasOwn(body, 'affiliateDisclosureText')
    ? asNullableText(body.affiliateDisclosureText)
    : existingGuide.affiliateDisclosureText;
  const nextAffiliateDisclosurePlacement = hasOwn(body, 'affiliateDisclosurePlacement')
    ? asNullableText(body.affiliateDisclosurePlacement) ?? 'before_affiliates'
    : existingGuide.affiliateDisclosurePlacement;
  const nextAffiliateModules = hasOwn(body, 'affiliateModules')
    ? asGuideAffiliateModules(body.affiliateModules)
    : existingGuide.affiliateModules;
  const nextConsultationCtaEnabled = hasOwn(body, 'consultationCtaEnabled')
    ? body.consultationCtaEnabled !== false
    : existingGuide.consultationCtaEnabled;
  const nextConsultationCtaLabel = hasOwn(body, 'consultationCtaLabel')
    ? asNullableText(body.consultationCtaLabel)
    : existingGuide.consultationCtaLabel;
  const nextNewsletterCtaEnabled = hasOwn(body, 'newsletterCtaEnabled')
    ? Boolean(body.newsletterCtaEnabled)
    : existingGuide.newsletterCtaEnabled;
  const nextNewsletterCtaLabel = hasOwn(body, 'newsletterCtaLabel')
    ? asNullableText(body.newsletterCtaLabel)
    : existingGuide.newsletterCtaLabel;
  const nextNewsletterCtaDescription = hasOwn(body, 'newsletterCtaDescription')
    ? asNullableText(body.newsletterCtaDescription)
    : existingGuide.newsletterCtaDescription;
  const nextNewsletterCtaHref = hasOwn(body, 'newsletterCtaHref')
    ? asNullableLinkTarget(body.newsletterCtaHref)
    : existingGuide.newsletterCtaHref;
  const nextNextStepCtaLabel = hasOwn(body, 'nextStepCtaLabel')
    ? asNullableText(body.nextStepCtaLabel)
    : existingGuide.nextStepCtaLabel;
  const nextNextStepCtaHref = hasOwn(body, 'nextStepCtaHref')
    ? asNullableLinkTarget(body.nextStepCtaHref)
    : existingGuide.nextStepCtaHref;
  const nextFounderSignatureEnabled = hasOwn(body, 'founderSignatureEnabled')
    ? Boolean(body.founderSignatureEnabled)
    : existingGuide.founderSignatureEnabled;
  const nextFounderSignatureText = hasOwn(body, 'founderSignatureText')
    ? asNullableText(body.founderSignatureText)
    : existingGuide.founderSignatureText;
  const nextRelatedGuideIds = hasOwn(body, 'relatedGuideIds') ? asStringArray(body.relatedGuideIds) : existingGuide.relatedGuideIds;
  const sourceRoute = asNullableText(body.sourceRoute) ?? `/admin/guides/${id}/edit`;

  const lifecycle = deriveGuideLifecycle({
    existing: {
      status: existingGuide.status,
      publishedAt: existingGuide.publishedAt,
      scheduledFor: existingGuide.scheduledFor,
      archivedAt: existingGuide.archivedAt,
    },
    requestedStatus: hasOwn(body, 'status') ? body.status : undefined,
    requestedPublished: hasOwn(body, 'published') ? body.published : undefined,
    requestedScheduledFor: hasOwn(body, 'scheduledFor') ? body.scheduledFor : undefined,
    content: [nextIntro, nextContent, nextConclusion].filter(Boolean).join('\n\n'),
  });

  if (!lifecycle.ok) {
    return NextResponse.json({ error: lifecycle.error }, { status: 400 });
  }

  const slugSeed = shouldUpdateSlug ? asText(body.slug) || nextTitle : existingGuide.slug;
  const nextSlug = shouldUpdateSlug ? await generateUniqueGuideSlug(slugSeed, id) : existingGuide.slug;

  const updatedGuide = await prisma.guide.update({
    where: { id },
    data: {
      title: nextTitle,
      slug: nextSlug,
      excerpt: nextExcerpt,
      intro: nextIntro,
      content: nextContent,
      conclusion: nextConclusion,
      heroImageUrl: nextHeroImageUrl,
      heroImageAlt: nextHeroImageAlt,
      authorId: nextAuthorId,
      category: nextCategory,
      topicCluster: nextTopicCluster,
      status: lifecycle.status,
      publishedAt: lifecycle.publishedAt,
      scheduledFor: lifecycle.scheduledFor,
      archivedAt: lifecycle.archivedAt,
      seoTitle: nextSeoTitle,
      seoDescription: nextSeoDescription,
      ogTitle: nextOgTitle,
      ogDescription: nextOgDescription,
      ogImageUrl: nextOgImageUrl,
      ogImageAlt: nextOgImageAlt,
      canonicalUrl: nextCanonicalUrl,
      targetKeyword: nextTargetKeyword,
      secondaryKeywords: nextSecondaryKeywords,
      internalLinkNotes: nextInternalLinkNotes,
      tableOfContentsEnabled: nextTableOfContentsEnabled,
      faqItems: nextFaqItems as Prisma.InputJsonValue,
      affiliateDisclosureEnabled: nextAffiliateDisclosureEnabled,
      affiliateDisclosureText: nextAffiliateDisclosureText,
      affiliateDisclosurePlacement: nextAffiliateDisclosurePlacement,
      affiliateModules: nextAffiliateModules as Prisma.InputJsonValue,
      consultationCtaEnabled: nextConsultationCtaEnabled,
      consultationCtaLabel: nextConsultationCtaLabel,
      newsletterCtaEnabled: nextNewsletterCtaEnabled,
      newsletterCtaLabel: nextNewsletterCtaLabel,
      newsletterCtaDescription: nextNewsletterCtaDescription,
      newsletterCtaHref: nextNewsletterCtaHref,
      nextStepCtaLabel: nextNextStepCtaLabel,
      nextStepCtaHref: nextNextStepCtaHref,
      founderSignatureEnabled: nextFounderSignatureEnabled,
      founderSignatureText: nextFounderSignatureText,
      relatedGuideIds: nextRelatedGuideIds,
    },
    select: guideEditorSelect,
  });

  const analyticsMeta = {
    guide_id: updatedGuide.id,
    guide_title: updatedGuide.title,
    guide_slug: updatedGuide.slug,
    guide_category: updatedGuide.category,
    author_id: updatedGuide.authorId,
    status: updatedGuide.status,
    source_route: sourceRoute,
  };

  await logGuideEvent({
    guideId: updatedGuide.id,
    event: GuideAnalyticsEvents.GUIDE_UPDATED,
    sourceRoute,
    meta: analyticsMeta,
  });

  if (updatedGuide.status === 'DRAFT') {
    await logGuideEvent({
      guideId: updatedGuide.id,
      event: GuideAnalyticsEvents.GUIDE_SAVED_DRAFT,
      sourceRoute,
      meta: analyticsMeta,
    });
  }

  if (existingGuide.status !== 'PUBLISHED' && updatedGuide.status === 'PUBLISHED') {
    await logGuideEvent({
      guideId: updatedGuide.id,
      event: GuideAnalyticsEvents.GUIDE_PUBLISHED,
      sourceRoute,
      meta: analyticsMeta,
    });
  }

  if (existingGuide.status === 'PUBLISHED' && updatedGuide.status !== 'PUBLISHED') {
    await logGuideEvent({
      guideId: updatedGuide.id,
      event: GuideAnalyticsEvents.GUIDE_UNPUBLISHED,
      sourceRoute,
      meta: analyticsMeta,
    });
  }

  if (existingGuide.status !== 'ARCHIVED' && updatedGuide.status === 'ARCHIVED') {
    await logGuideEvent({
      guideId: updatedGuide.id,
      event: GuideAnalyticsEvents.GUIDE_ARCHIVED,
      sourceRoute,
      meta: analyticsMeta,
    });
  }

    revalidateGuidePaths(updatedGuide);
    return NextResponse.json(toGuideEditorRecord(updatedGuide));
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return NextResponse.json({ error: GUIDE_STORAGE_UNAVAILABLE_MESSAGE }, { status: 503 });
    }

    throw error;
  }
}
