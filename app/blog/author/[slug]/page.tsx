import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/SiteShell';
import JournalCard from '@/components/blog/JournalCard';
import FinalCTA from '@/components/layout/FinalCTA';
import { Body, H1, H2 } from '@/components/ui/MarketingHeading';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { getPostDisplayDate, getPublicPostWhere } from '@/lib/blog/postStatus';
import { normalizeBlogCategory } from '@/lib/blogCategories';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { SITE_URL } from '@/lib/marketing/metadata';
import prisma from '@/lib/server/prisma';
import { toExcerpt } from '@/components/blog/PostArticleView';
import { toBlogAuthorProfile } from '@/lib/server/blogAuthors';

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (value: Date) =>
  value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

async function getAuthorPageData(slug: string) {
  const author = await prisma.user.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      email: true,
      slug: true,
      bio: true,
      expertiseAreas: true,
      avatarUrl: true,
    },
  });

  if (!author) {
    return null;
  }

  const posts = await prisma.post.findMany({
    where: {
      ...getPublicPostWhere(),
      OR: [{ authorId: author.id }, { authorships: { some: { userId: author.id } } }],
    },
    orderBy: [{ publishedAt: 'desc' }, { scheduledFor: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      content: true,
      readingTime: true,
      featuredImageUrl: true,
      coverImage: true,
      featuredImage: {
        select: {
          url: true,
        },
      },
      publishedAt: true,
      scheduledFor: true,
      createdAt: true,
    },
  });

  return { author, posts };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAuthorPageData(slug);

  if (!data) {
    return {};
  }

  const authorProfile = toBlogAuthorProfile(data.author, 'Author');
  const name = authorProfile.name;
  const description =
    authorProfile.bio?.trim() || `${name} writes practical baby planning guidance for Taylor-Made Baby Co.`;

  return {
    title: `${name} | Taylor-Made Baby Co.`,
    description,
    alternates: {
      canonical: `${SITE_URL}/blog/author/${slug}`,
    },
    openGraph: {
      title: `${name} | Taylor-Made Baby Co.`,
      description,
      type: 'profile',
      url: `${SITE_URL}/blog/author/${slug}`,
      images: authorProfile.avatarUrl ? [{ url: authorProfile.avatarUrl, alt: name }] : undefined,
    },
  };
}

export default async function BlogAuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const data = await getAuthorPageData(slug);

  if (!data) {
    notFound();
  }

  const authorProfile = toBlogAuthorProfile(data.author, 'Author');
  const authorName = authorProfile.name;
  const shouldSkipAvatarOptimization = isRemoteImageUrl(authorProfile.avatarUrl);

  return (
    <SiteShell currentPath="/blog">
      <main className="site-main" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
        <section className="section-base bg-[#FBF7F1]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-[240px,1fr] md:items-start">
              <div className="flex justify-center md:justify-start">
                {authorProfile.avatarUrl ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-[30px] shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
                    <Image
                      src={authorProfile.avatarUrl}
                      alt={authorName}
                      fill
                      sizes="160px"
                      className="object-cover"
                      unoptimized={shouldSkipAvatarOptimization}
                    />
                  </div>
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-[30px] bg-black/[0.04] font-serif text-5xl text-neutral-900">
                    {authorName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <span className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">Author</span>
                <H1 className="font-serif text-neutral-900">{authorName}</H1>
                <Body className="max-w-[60ch] text-charcoal/75">
                  {authorProfile.bio?.trim() ||
                    'Practical guidance for baby registry planning, gear decisions, and calmer prep.'}
                </Body>

                {authorProfile.expertiseAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {authorProfile.expertiseAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-charcoal/75"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="section-base bg-white">
          <div className="mx-auto max-w-5xl px-6">
            <div className="space-y-4">
              <span className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">Articles</span>
              <H2 className="font-serif text-neutral-900">Guides by {authorName}</H2>
            </div>

            {data.posts.length > 0 ? (
              <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
                {data.posts.map((post) => (
                  <JournalCard
                    key={post.id}
                    title={post.title}
                    slug={post.slug}
                    coverImage={post.featuredImage?.url ?? post.featuredImageUrl ?? post.coverImage}
                    excerpt={toExcerpt(post.excerpt, post.content, 170)}
                    dateLabel={formatDate(getPostDisplayDate(post))}
                    dateTime={getPostDisplayDate(post).toISOString()}
                    readingTime={post.readingTime}
                    category={normalizeBlogCategory(post.category)}
                    authorName={authorName}
                  />
                ))}
              </div>
            ) : (
              <MarketingSurface className="mt-10 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-charcoal/55">No public posts yet</p>
                <Body className="mt-4 text-charcoal/72">This author does not have a published guide yet.</Body>
              </MarketingSurface>
            )}
          </div>
        </section>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
