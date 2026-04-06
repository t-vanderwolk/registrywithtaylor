import fs from 'node:fs';
import path from 'node:path';

import { PrismaClient, Prisma, type Prisma as PrismaTypes } from '@prisma/client';

import { getPublicPostWhere } from '@/lib/blog/postStatus';

type SourceUser = {
  email: string;
  password: string;
  role: PrismaTypes.UserCreateInput['role'];
  name: string | null;
  slug: string | null;
  bio: string | null;
  expertiseAreas: string[];
  avatarUrl: string | null;
};

type SourceMedia = {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
};

type SourceBrand = {
  name: string;
  website: string | null;
  logoUrl: string | null;
};

type SourceAffiliatePartner = {
  slug: string;
  name: string;
  network: PrismaTypes.AffiliatePartnerCreateInput['network'];
  commissionType: PrismaTypes.AffiliatePartnerCreateInput['commissionType'];
  commissionRate: string;
  category: string | null;
  threeMonthEpc: number | null;
  sevenDayEpc: number | null;
  notes: string | null;
  isActive: boolean;
  allowedDomains: string[];
  logoUrl: string | null;
  website: string | null;
  affiliateLink: string | null;
  brandId: string | null;
  programId: string | null;
  partnerType: string;
  affiliateTier: string;
  paymentRisk: boolean;
  retailerFallback: string[];
  affiliatePid: string | null;
  baseUrl: string;
  routingPriority: number;
  allowedContexts: PrismaTypes.JsonValue;
};

type TransactionClient = PrismaTypes.TransactionClient;

const DRY_RUN_FLAG = '--dry-run';
const ARCHIVE_MISSING_LOCAL_PUBLIC_FLAG = '--archive-missing-local-public';

const toInputJsonValue = (value: PrismaTypes.JsonValue): PrismaTypes.InputJsonValue | typeof Prisma.JsonNull =>
  value === null ? Prisma.JsonNull : (value as PrismaTypes.InputJsonValue);

const readDotEnvValue = (key: string) => {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return null;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const candidateKey = line.slice(0, separatorIndex).trim();
    if (candidateKey !== key) {
      continue;
    }

    const rawValue = line.slice(separatorIndex + 1).trim();
    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      return rawValue.slice(1, -1);
    }

    return rawValue;
  }

  return null;
};

const sourceDatabaseUrl = process.env.SOURCE_DATABASE_URL?.trim() || null;
const targetDatabaseUrl =
  process.env.TARGET_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || readDotEnvValue('DATABASE_URL');

if (!sourceDatabaseUrl) {
  throw new Error('SOURCE_DATABASE_URL is required.');
}

if (!targetDatabaseUrl) {
  throw new Error('TARGET_DATABASE_URL or DATABASE_URL is required.');
}

const sourcePrisma = new PrismaClient({ datasourceUrl: sourceDatabaseUrl });
const targetPrisma = new PrismaClient({ datasourceUrl: targetDatabaseUrl });

const userCache = new Map<string, string>();
const mediaCache = new Map<string, string>();
const brandCache = new Map<string, string>();
const affiliateCache = new Map<string, string>();

async function ensureUser(tx: TransactionClient, user: SourceUser) {
  const cacheKey = user.email.trim().toLowerCase();
  const cached = userCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const existing = await tx.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (existing) {
    await tx.user.update({
      where: { id: existing.id },
      data: {
        role: user.role,
        name: user.name,
        slug: user.slug,
        bio: user.bio,
        expertiseAreas: user.expertiseAreas,
        avatarUrl: user.avatarUrl,
      },
    });
    userCache.set(cacheKey, existing.id);
    return existing.id;
  }

  const created = await tx.user.create({
    data: {
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name,
      slug: user.slug,
      bio: user.bio,
      expertiseAreas: user.expertiseAreas,
      avatarUrl: user.avatarUrl,
    },
    select: { id: true },
  });

  userCache.set(cacheKey, created.id);
  return created.id;
}

async function ensureMedia(tx: TransactionClient, media: SourceMedia | null) {
  if (!media) {
    return null;
  }

  const cacheKey = media.url.trim();
  const cached = mediaCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const existing = await tx.media.findFirst({
    where: { url: media.url },
    select: { id: true },
  });

  if (existing) {
    await tx.media.update({
      where: { id: existing.id },
      data: {
        fileName: media.fileName,
        fileType: media.fileType,
        fileSize: media.fileSize,
      },
    });
    mediaCache.set(cacheKey, existing.id);
    return existing.id;
  }

  const created = await tx.media.create({
    data: {
      url: media.url,
      fileName: media.fileName,
      fileType: media.fileType,
      fileSize: media.fileSize,
      createdAt: media.createdAt,
    },
    select: { id: true },
  });

  mediaCache.set(cacheKey, created.id);
  return created.id;
}

async function ensureBrand(tx: TransactionClient, brand: SourceBrand) {
  const cacheKey = brand.name.trim().toLowerCase();
  const cached = brandCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const record = await tx.brand.upsert({
    where: { name: brand.name },
    update: {
      website: brand.website,
      logoUrl: brand.logoUrl,
    },
    create: {
      name: brand.name,
      website: brand.website,
      logoUrl: brand.logoUrl,
    },
    select: { id: true },
  });

  brandCache.set(cacheKey, record.id);
  return record.id;
}

async function ensureAffiliatePartner(tx: TransactionClient, affiliate: SourceAffiliatePartner) {
  const cacheKey = affiliate.slug.trim().toLowerCase();
  const cached = affiliateCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const record = await tx.affiliatePartner.upsert({
    where: { slug: affiliate.slug },
    update: {
      name: affiliate.name,
      network: affiliate.network,
      commissionType: affiliate.commissionType,
      commissionRate: affiliate.commissionRate,
      category: affiliate.category,
      threeMonthEpc: affiliate.threeMonthEpc,
      sevenDayEpc: affiliate.sevenDayEpc,
      notes: affiliate.notes,
      isActive: affiliate.isActive,
      allowedDomains: affiliate.allowedDomains,
      logoUrl: affiliate.logoUrl,
      website: affiliate.website,
      affiliateLink: affiliate.affiliateLink,
      partnerType: affiliate.partnerType,
      affiliateTier: affiliate.affiliateTier,
      paymentRisk: affiliate.paymentRisk,
      retailerFallback: affiliate.retailerFallback,
      affiliatePid: affiliate.affiliatePid,
      baseUrl: affiliate.baseUrl,
      routingPriority: affiliate.routingPriority,
      allowedContexts: toInputJsonValue(affiliate.allowedContexts),
    },
    create: {
      slug: affiliate.slug,
      name: affiliate.name,
      network: affiliate.network,
      commissionType: affiliate.commissionType,
      commissionRate: affiliate.commissionRate,
      category: affiliate.category,
      threeMonthEpc: affiliate.threeMonthEpc,
      sevenDayEpc: affiliate.sevenDayEpc,
      notes: affiliate.notes,
      isActive: affiliate.isActive,
      allowedDomains: affiliate.allowedDomains,
      logoUrl: affiliate.logoUrl,
      website: affiliate.website,
      affiliateLink: affiliate.affiliateLink,
      partnerType: affiliate.partnerType,
      affiliateTier: affiliate.affiliateTier,
      paymentRisk: affiliate.paymentRisk,
      retailerFallback: affiliate.retailerFallback,
      affiliatePid: affiliate.affiliatePid,
      baseUrl: affiliate.baseUrl,
      routingPriority: affiliate.routingPriority,
      allowedContexts: toInputJsonValue(affiliate.allowedContexts),
    },
    select: { id: true },
  });

  affiliateCache.set(cacheKey, record.id);
  return record.id;
}

async function main() {
  const dryRun = process.argv.includes(DRY_RUN_FLAG);
  const archiveMissingLocalPublic = process.argv.includes(ARCHIVE_MISSING_LOCAL_PUBLIC_FLAG);
  const now = new Date();

  const sourcePosts = await sourcePrisma.post.findMany({
    where: getPublicPostWhere(now),
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      published: true,
      authorId: true,
      views: true,
      createdAt: true,
      coverImage: true,
      category: true,
      deck: true,
      archivedAt: true,
      featured: true,
      publishedAt: true,
      scheduledFor: true,
      status: true,
      stage: true,
      focusKeyword: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      featuredImageUrl: true,
      readingTime: true,
      shareTitle: true,
      shareDescription: true,
      author: {
        select: {
          email: true,
          password: true,
          role: true,
          name: true,
          slug: true,
          bio: true,
          expertiseAreas: true,
          avatarUrl: true,
        },
      },
      authorships: {
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: {
          role: true,
          user: {
            select: {
              email: true,
              password: true,
              role: true,
              name: true,
              slug: true,
              bio: true,
              expertiseAreas: true,
              avatarUrl: true,
            },
          },
        },
      },
      featuredImage: {
        select: {
          url: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
      media: {
        select: {
          url: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
        },
      },
      images: {
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: {
          url: true,
          alt: true,
          createdAt: true,
        },
      },
      affiliateBrands: {
        select: {
          name: true,
          website: true,
          logoUrl: true,
        },
      },
      affiliates: {
        select: {
          affiliate: {
            select: {
              slug: true,
              name: true,
              network: true,
              commissionType: true,
              commissionRate: true,
              category: true,
              threeMonthEpc: true,
              sevenDayEpc: true,
              notes: true,
              isActive: true,
              allowedDomains: true,
              logoUrl: true,
              website: true,
              affiliateLink: true,
              brandId: true,
              programId: true,
              partnerType: true,
              affiliateTier: true,
              paymentRisk: true,
              retailerFallback: true,
              affiliatePid: true,
              baseUrl: true,
              routingPriority: true,
              allowedContexts: true,
            },
          },
        },
      },
    },
  });

  const targetPublicPosts = await targetPrisma.post.findMany({
    where: getPublicPostWhere(now),
    select: {
      slug: true,
      title: true,
    },
  });

  const sourceSlugSet = new Set(sourcePosts.map((post) => post.slug));
  const extraLocalPosts = targetPublicPosts.filter((post) => !sourceSlugSet.has(post.slug));

  console.log(`Found ${sourcePosts.length} public production blog posts to sync.`);
  if (extraLocalPosts.length > 0) {
    console.log('');
    console.log(
      archiveMissingLocalPublic
        ? 'Local public posts not present in production will be archived locally:'
        : 'Local public posts not present in production were left untouched:',
    );
    for (const post of extraLocalPosts) {
      console.log(`- ${post.slug} (${post.title})`);
    }
  }

  if (!dryRun && archiveMissingLocalPublic && extraLocalPosts.length > 0) {
    const archived = await targetPrisma.post.updateMany({
      where: {
        slug: {
          in: extraLocalPosts.map((post) => post.slug),
        },
      },
      data: {
        status: 'ARCHIVED',
        stage: 'ARCHIVED',
        published: false,
        scheduledFor: null,
        archivedAt: now,
      },
    });

    console.log('');
    console.log(`Archived ${archived.count} local-only public posts.`);
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const sourcePost of sourcePosts) {
    const existing = await targetPrisma.post.findUnique({
      where: { slug: sourcePost.slug },
      select: { id: true },
    });

    const actionLabel = existing ? 'update' : 'create';
    if (dryRun) {
      console.log(`Would ${actionLabel} ${sourcePost.slug}`);
      continue;
    }

    await targetPrisma.$transaction(async (tx) => {
      const primaryAuthorId = await ensureUser(tx, sourcePost.author);
      const featuredImageId = await ensureMedia(tx, sourcePost.featuredImage);
      const mediaIds = (
        await Promise.all(sourcePost.media.map((media) => ensureMedia(tx, media)))
      ).filter((id): id is string => Boolean(id));
      const affiliateBrandIds = await Promise.all(sourcePost.affiliateBrands.map((brand) => ensureBrand(tx, brand)));
      const affiliateIds = await Promise.all(
        sourcePost.affiliates.map(({ affiliate }) => ensureAffiliatePartner(tx, affiliate)),
      );

      const sourceAuthorAssignments = new Map<string, { userId: string; role: string }>();
      sourceAuthorAssignments.set(primaryAuthorId, { userId: primaryAuthorId, role: 'Primary Author' });

      for (const authorship of sourcePost.authorships) {
        const userId = await ensureUser(tx, authorship.user);
        const nextRole = authorship.role?.trim() || 'Contributor';
        const existingAssignment = sourceAuthorAssignments.get(userId);
        if (!existingAssignment || existingAssignment.role !== 'Primary Author') {
          sourceAuthorAssignments.set(userId, { userId, role: nextRole });
        }
      }

      const postData: Prisma.PostUncheckedCreateInput = {
        title: sourcePost.title,
        slug: sourcePost.slug,
        content: sourcePost.content,
        excerpt: sourcePost.excerpt,
        published: sourcePost.published,
        authorId: primaryAuthorId,
        views: sourcePost.views,
        createdAt: sourcePost.createdAt,
        coverImage: sourcePost.coverImage,
        category: sourcePost.category,
        featuredImageId,
        archivedAt: sourcePost.archivedAt,
        deck: sourcePost.deck,
        featured: sourcePost.featured,
        publishedAt: sourcePost.publishedAt,
        scheduledFor: sourcePost.scheduledFor,
        status: sourcePost.status,
        stage: sourcePost.stage,
        focusKeyword: sourcePost.focusKeyword,
        seoTitle: sourcePost.seoTitle,
        seoDescription: sourcePost.seoDescription,
        canonicalUrl: sourcePost.canonicalUrl,
        featuredImageUrl: sourcePost.featuredImageUrl,
        readingTime: sourcePost.readingTime,
        shareTitle: sourcePost.shareTitle,
        shareDescription: sourcePost.shareDescription,
      };

      const saved = existing
        ? await tx.post.update({
            where: { id: existing.id },
            data: {
              ...postData,
              media: { set: mediaIds.map((id) => ({ id })) },
              affiliateBrands: { set: affiliateBrandIds.map((id) => ({ id })) },
            },
            select: { id: true },
          })
        : await tx.post.create({
            data: {
              ...postData,
              media: { connect: mediaIds.map((id) => ({ id })) },
              affiliateBrands: { connect: affiliateBrandIds.map((id) => ({ id })) },
            },
            select: { id: true },
          });

      await tx.postAuthor.deleteMany({ where: { postId: saved.id } });
      await tx.postImage.deleteMany({ where: { postId: saved.id } });
      await tx.blogPostAffiliate.deleteMany({ where: { blogPostId: saved.id } });

      if (sourceAuthorAssignments.size > 0) {
        await tx.postAuthor.createMany({
          data: [...sourceAuthorAssignments.values()].map((assignment) => ({
            postId: saved.id,
            userId: assignment.userId,
            role: assignment.role,
          })),
          skipDuplicates: true,
        });
      }

      if (sourcePost.images.length > 0) {
        await tx.postImage.createMany({
          data: sourcePost.images.map((image) => ({
            postId: saved.id,
            url: image.url,
            alt: image.alt,
            createdAt: image.createdAt,
          })),
        });
      }

      if (affiliateIds.length > 0) {
        await tx.blogPostAffiliate.createMany({
          data: affiliateIds.map((affiliateId) => ({
            blogPostId: saved.id,
            affiliateId,
          })),
          skipDuplicates: true,
        });
      }
    });

    if (existing) {
      updatedCount += 1;
    } else {
      createdCount += 1;
    }

    console.log(`${existing ? 'Updated' : 'Created'} ${sourcePost.slug}`);
  }

  console.log('');
  console.log(
    `${dryRun ? 'Scanned' : 'Synced'} ${sourcePosts.length} production posts. ${createdCount} created, ${updatedCount} updated.`,
  );
}

main()
  .catch((error) => {
    console.error('Failed to sync published production blog posts:', error);
    process.exit(1);
  })
  .finally(async () => {
    await Promise.all([sourcePrisma.$disconnect(), targetPrisma.$disconnect()]);
  });
