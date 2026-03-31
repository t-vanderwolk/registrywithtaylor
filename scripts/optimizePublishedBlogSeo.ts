import { getPublicPostWhere } from '@/lib/blog/postStatus';
import { buildBlogSeoSnapshot } from '@/lib/blog/seo';
import prisma from '@/lib/server/prisma';

const DRY_RUN_FLAG = '--dry-run';

async function main() {
  const dryRun = process.argv.includes(DRY_RUN_FLAG);
  const publishedPosts = await prisma.post.findMany({
    where: getPublicPostWhere(new Date()),
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      content: true,
      excerpt: true,
      deck: true,
      focusKeyword: true,
      seoTitle: true,
      seoDescription: true,
      shareTitle: true,
      shareDescription: true,
      canonicalUrl: true,
      readingTime: true,
    },
  });

  for (const post of publishedPosts) {
    const snapshot = buildBlogSeoSnapshot({
      title: post.title,
      slug: post.slug,
      category: post.category,
      content: post.content,
      excerpt: post.excerpt,
      deck: post.deck,
      focusKeyword: post.focusKeyword,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      shareTitle: post.shareTitle,
      shareDescription: post.shareDescription,
      canonicalUrl: post.canonicalUrl,
      readingTime: post.readingTime,
    });

    const updateData = {
      ...(post.excerpt?.trim() ? {} : { excerpt: snapshot.shareDescription }),
      ...(post.focusKeyword?.trim() ? {} : { focusKeyword: snapshot.focusKeyword }),
      ...(post.seoTitle?.trim() ? {} : { seoTitle: snapshot.seoTitle }),
      ...(post.seoDescription?.trim() ? {} : { seoDescription: snapshot.seoDescription }),
      ...(post.shareTitle?.trim() ? {} : { shareTitle: snapshot.shareTitle }),
      ...(post.shareDescription?.trim() ? {} : { shareDescription: snapshot.shareDescription }),
      ...(post.canonicalUrl?.trim() ? {} : { canonicalUrl: snapshot.canonicalUrl }),
      ...(post.readingTime ? {} : { readingTime: snapshot.readingTime }),
    };

    const changedFields = Object.keys(updateData);
    if (changedFields.length === 0) {
      console.log(`No SEO changes needed for ${post.slug}`);
      continue;
    }

    if (!dryRun) {
      await prisma.post.update({
        where: { id: post.id },
        data: updateData,
      });
    }

    console.log(`${dryRun ? 'Would update' : 'Updated'} ${post.slug}: ${changedFields.join(', ')}`);
  }

  console.log('');
  console.log(`${dryRun ? 'Scanned' : 'Optimized'} ${publishedPosts.length} published blog posts.`);
}

main()
  .catch((error) => {
    console.error('Failed to optimize published blog SEO:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
