import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestToken, requireAdmin, unauthorizedResponse } from '@/lib/server/apiAuth';
import prisma from '@/lib/server/prisma';
import { normalizeGuideCategory } from '@/lib/guides/categories';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { getPublicGuideWhere } from '@/lib/guides/status';
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
} from '@/lib/server/guidePayload';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = await getRequestToken(req);
    const where = token?.role === 'ADMIN' ? undefined : getPublicGuideWhere();

    const guides = await prisma.guide.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        topicCluster: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(guides);
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return NextResponse.json([], { status: 200 });
    }

    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await requireAdmin(req);

    if (!token?.id) {
      return unauthorizedResponse();
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

  const titleInput = asText(body.title);
  const title = titleInput || 'Untitled guide';
  const slugInput = asText(body.slug);
  const excerpt = asNullableText(body.excerpt);
  const intro = asNullableText(body.intro);
  const content = asText(body.content);
  const conclusion = asNullableText(body.conclusion);
  const category = normalizeGuideCategory(body.category);
  const topicCluster = asNullableText(body.topicCluster);
  const heroImageUrl = asNullableImageUrl(body.heroImageUrl);
  const heroImageAlt = asNullableText(body.heroImageAlt);
  const seoTitle = asNullableText(body.seoTitle);
  const seoDescription = asNullableText(body.seoDescription);
  const ogTitle = asNullableText(body.ogTitle);
  const ogDescription = asNullableText(body.ogDescription);
  const ogImageUrl = asNullableImageUrl(body.ogImageUrl);
  const ogImageAlt = asNullableText(body.ogImageAlt);
  const canonicalUrl = asNullableLinkTarget(body.canonicalUrl);
  const targetKeyword = asNullableText(body.targetKeyword);
  const secondaryKeywords = asStringArray(body.secondaryKeywords);
  const internalLinkNotes = asNullableText(body.internalLinkNotes);
  const tableOfContentsEnabled = body.tableOfContentsEnabled !== false;
  const faqItems = asGuideFaqItems(body.faqItems);
  const affiliateDisclosureEnabled = body.affiliateDisclosureEnabled !== false;
  const affiliateDisclosureText = asNullableText(body.affiliateDisclosureText);
  const affiliateDisclosurePlacement = asNullableText(body.affiliateDisclosurePlacement) ?? 'before_affiliates';
  const affiliateModules = asGuideAffiliateModules(body.affiliateModules);
  const consultationCtaEnabled = body.consultationCtaEnabled !== false;
  const consultationCtaLabel = asNullableText(body.consultationCtaLabel);
  const newsletterCtaEnabled = Boolean(body.newsletterCtaEnabled);
  const newsletterCtaLabel = asNullableText(body.newsletterCtaLabel);
  const newsletterCtaDescription = asNullableText(body.newsletterCtaDescription);
  const newsletterCtaHref = asNullableLinkTarget(body.newsletterCtaHref);
  const nextStepCtaLabel = asNullableText(body.nextStepCtaLabel);
  const nextStepCtaHref = asNullableLinkTarget(body.nextStepCtaHref);
  const founderSignatureEnabled = Boolean(body.founderSignatureEnabled);
  const founderSignatureText = asNullableText(body.founderSignatureText);
  const relatedGuideIds = asStringArray(body.relatedGuideIds);
  const authorId = asText(body.authorId) || (token.id as string);
  const sourceRoute = asNullableText(body.sourceRoute) ?? '/admin/guides/new';
  const combinedContent = [intro, content, conclusion].filter(Boolean).join('\n\n');

  const lifecycle = deriveGuideLifecycle({
    existing: {
      status: 'DRAFT',
      publishedAt: null,
      scheduledFor: null,
      archivedAt: null,
    },
    requestedStatus: body.status,
    requestedPublished: body.published,
    requestedScheduledFor: body.scheduledFor,
    content: combinedContent,
  });

  if (!lifecycle.ok) {
    return NextResponse.json({ error: lifecycle.error }, { status: 400 });
  }

  const slug = await generateUniqueGuideSlug(slugInput || title);

  const guide = await prisma.guide.create({
    data: {
      title,
      slug,
      excerpt,
      intro: null,
      content: combinedContent,
      conclusion: null,
      heroImageUrl,
      heroImageAlt,
      authorId,
      category,
      topicCluster,
      status: lifecycle.status,
      publishedAt: lifecycle.publishedAt,
      scheduledFor: lifecycle.scheduledFor,
      archivedAt: lifecycle.archivedAt,
      seoTitle,
      seoDescription,
      ogTitle,
      ogDescription,
      ogImageUrl,
      ogImageAlt,
      canonicalUrl,
      targetKeyword,
      secondaryKeywords,
      internalLinkNotes,
      tableOfContentsEnabled,
      faqItems: faqItems as Prisma.InputJsonValue,
      affiliateDisclosureEnabled,
      affiliateDisclosureText,
      affiliateDisclosurePlacement,
      affiliateModules: affiliateModules as Prisma.InputJsonValue,
      consultationCtaEnabled,
      consultationCtaLabel,
      newsletterCtaEnabled,
      newsletterCtaLabel,
      newsletterCtaDescription,
      newsletterCtaHref,
      nextStepCtaLabel,
      nextStepCtaHref,
      founderSignatureEnabled,
      founderSignatureText,
      relatedGuideIds,
    },
    select: guideEditorSelect,
  });

  const analyticsMeta = {
    guide_id: guide.id,
    guide_title: guide.title,
    guide_slug: guide.slug,
    guide_category: guide.category,
    author_id: authorId,
    status: guide.status,
    source_route: sourceRoute,
  };

  await logGuideEvent({
    guideId: guide.id,
    event: GuideAnalyticsEvents.GUIDE_CREATED,
    sourceRoute,
    meta: analyticsMeta,
  });

  if (guide.status === 'DRAFT') {
    await logGuideEvent({
      guideId: guide.id,
      event: GuideAnalyticsEvents.GUIDE_SAVED_DRAFT,
      sourceRoute,
      meta: analyticsMeta,
    });
  }

  if (guide.status === 'PUBLISHED') {
    await logGuideEvent({
      guideId: guide.id,
      event: GuideAnalyticsEvents.GUIDE_PUBLISHED,
      sourceRoute,
      meta: analyticsMeta,
    });
  }

    revalidateGuidePaths(guide);
    return NextResponse.json(toGuideEditorRecord(guide), { status: 201 });
  } catch (error) {
    if (isGuideStorageUnavailableError(error)) {
      return NextResponse.json({ error: GUIDE_STORAGE_UNAVAILABLE_MESSAGE }, { status: 503 });
    }

    throw error;
  }
}
