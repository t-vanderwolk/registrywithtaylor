import type { ReactNode } from 'react';
import type { BlogAuthorProfile } from '@/lib/server/blogAuthors';
import BlogDivider from '@/components/blog/BlogDivider';
import CategoryTag from '@/components/blog/CategoryTag';

type TMBCBlogTemplateProps = {
  featuredImageUrl: string | null;
  title: string;
  categoryLabel: string;
  subtitle?: string | null;
  authors: BlogAuthorProfile[];
  publishDateLabel: string;
  publishDateIso: string;
  readingTime?: number | null;
  affiliateDisclosure?: ReactNode;
  body: ReactNode;
  resources?: ReactNode;
  gallery?: ReactNode;
  affiliateCta?: ReactNode;
  shareSection: ReactNode;
  relatedPosts?: ReactNode;
};

/*
TMBC Tone Guidelines
- Warm
- Witty
- Wise
- Human
- Calm authority

Editorial pattern:
- Start with a relatable observation.
- Add expert insight without sounding clinical.
- End each section with a clear recommendation or next step.
*/
export default function TMBCBlogTemplate({
  featuredImageUrl,
  title,
  categoryLabel,
  subtitle,
  authors,
  publishDateLabel,
  publishDateIso,
  readingTime,
  affiliateDisclosure,
  body,
  resources,
  gallery,
  affiliateCta,
  shareSection,
  relatedPosts,
}: TMBCBlogTemplateProps) {
  const primaryAuthor = authors[0] ?? null;
  const contributors = authors.slice(1);

  return (
    <>
      <section className="section-base" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
        <article className="mx-auto max-w-4xl px-6">
          <header className="tmbc-blog-hero">
            <div className="tmbc-blog-hero__inner">
              <div className="tmbc-blog-hero__eyebrow">
                <CategoryTag label={categoryLabel} />
              </div>
              <div className="tmbc-blog-hero__copy">
                <h1 className="text-[var(--tmbc-blog-charcoal)]">{title}</h1>
                {subtitle ? <p className="excerpt">{subtitle}</p> : null}
              </div>

              <div className="meta tmbc-blog-meta">
                {primaryAuthor ? (
                  primaryAuthor.slug ? (
                    <a
                      href={`/blog/author/${primaryAuthor.slug}`}
                      className="font-medium text-[var(--tmbc-blog-rose)] underline underline-offset-4"
                    >
                      {primaryAuthor.name}
                    </a>
                  ) : (
                    <span className="font-medium text-[var(--tmbc-blog-rose)]">{primaryAuthor.name}</span>
                  )
                ) : null}
                <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                <time dateTime={publishDateIso}>{publishDateLabel}</time>
                {readingTime ? (
                  <>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                    <span>{readingTime} min read</span>
                  </>
                ) : null}
                {contributors.length > 0 ? (
                  <>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                    <span>with contributions from {contributors.map((author) => author.name).join(', ')}</span>
                  </>
                ) : null}
              </div>
              <div className="tmbc-blog-hero__divider">
                <BlogDivider />
              </div>
            </div>
          </header>

          {featuredImageUrl ? (
            <div className="mb-12 overflow-hidden rounded-[34px]">
              <img src={featuredImageUrl} alt={title} className="h-auto w-full" />
            </div>
          ) : null}

          {affiliateDisclosure ? <div className="mt-10">{affiliateDisclosure}</div> : null}

          <div className="mt-14">{body}</div>
          {resources}
          {gallery}
          {affiliateCta}

          <section className="blog-section-soft mt-16 px-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--tmbc-blog-soft-text)]">Share This Guide</p>
            <div className="mt-5">{shareSection}</div>
          </section>
        </article>
      </section>

      {relatedPosts}
    </>
  );
}
