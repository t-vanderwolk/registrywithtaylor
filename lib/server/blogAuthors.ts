import prisma from '@/lib/server/prisma';

type AuthorLike = {
  id: string;
  email: string;
  name: string | null;
  slug: string | null;
  bio: string | null;
  expertiseAreas: string[];
  avatarUrl: string | null;
};

export type BlogAuthorProfile = {
  id: string;
  email: string;
  name: string;
  slug: string | null;
  bio: string | null;
  expertiseAreas: string[];
  avatarUrl: string | null;
  role: string;
};

export type BlogAuthorOption = Omit<BlogAuthorProfile, 'role'>;

const BRAND_AUTHOR_NAME = 'Taylor Vanderwolk';
const BRAND_AUTHOR_BIO =
  'Founder of Taylor-Made Baby Co. and baby gear advisor for parents sorting registry, stroller, car seat, nursery, and preparation decisions with more clarity.';
const BRAND_AUTHOR_EXPERTISE = [
  'Baby Gear Guidance',
  'Registry Planning',
  'Nursery Preparation',
  'Target Baby Concierge',
];
const BRAND_AUTHOR_AVATAR = '/assets/editorial/taylor.png';

const fallbackNameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const isBrandFallbackAuthor = (author: AuthorLike) => {
  const normalizedName = author.name?.trim().toLowerCase() ?? '';
  const normalizedEmail = author.email.trim().toLowerCase();
  const normalizedSlug = author.slug?.trim().toLowerCase() ?? '';

  return normalizedName === 'admin' || normalizedEmail.startsWith('admin@') || normalizedSlug === 'admin';
};

export function toBlogAuthorProfile(author: AuthorLike, role = 'Contributor'): BlogAuthorProfile {
  const useBrandFallback = isBrandFallbackAuthor(author);

  return {
    id: author.id,
    email: author.email,
    name: useBrandFallback ? BRAND_AUTHOR_NAME : author.name?.trim() || fallbackNameFromEmail(author.email),
    slug: author.slug?.trim() || null,
    bio: useBrandFallback ? author.bio?.trim() || BRAND_AUTHOR_BIO : author.bio?.trim() || null,
    expertiseAreas:
      useBrandFallback && author.expertiseAreas.length === 0 ? [...BRAND_AUTHOR_EXPERTISE] : author.expertiseAreas,
    avatarUrl: useBrandFallback ? author.avatarUrl?.trim() || BRAND_AUTHOR_AVATAR : author.avatarUrl?.trim() || null,
    role,
  };
}

export function normalizePostAuthors({
  primaryAuthor,
  authorships = [],
}: {
  primaryAuthor: AuthorLike;
  authorships?: Array<{
    role: string;
    user: AuthorLike;
  }>;
}) {
  const authorMap = new Map<string, BlogAuthorProfile>();
  authorMap.set(primaryAuthor.id, toBlogAuthorProfile(primaryAuthor, 'Primary Author'));

  for (const authorship of authorships) {
    authorMap.set(authorship.user.id, toBlogAuthorProfile(authorship.user, authorship.role));
  }

  return [...authorMap.values()].sort((left, right) => {
    const leftPriority = left.role === 'Primary Author' ? 0 : 1;
    const rightPriority = right.role === 'Primary Author' ? 0 : 1;
    return leftPriority - rightPriority || left.name.localeCompare(right.name);
  });
}

export function formatContributionLabel(authors: BlogAuthorProfile[]) {
  const primaryAuthor = authors.find((author) => author.role === 'Primary Author') ?? authors[0] ?? null;
  const contributors = authors.filter((author) => author.id !== primaryAuthor?.id);

  return {
    primaryAuthor,
    contributors,
    byline:
      primaryAuthor && contributors.length > 0
        ? `By ${primaryAuthor.name} with contributions from ${contributors.map((author) => author.name).join(', ')}`
        : primaryAuthor
          ? `By ${primaryAuthor.name}`
          : 'By Taylor-Made Baby Co.',
  };
}

export async function listBlogAuthorOptions() {
  const users = await prisma.user.findMany({
    orderBy: [{ name: 'asc' }, { email: 'asc' }],
    select: {
      id: true,
      email: true,
      name: true,
      slug: true,
      bio: true,
      expertiseAreas: true,
      avatarUrl: true,
    },
  });

  return users.map((user) => {
    const profile = toBlogAuthorProfile(user, 'Contributor');
    const { role: _role, ...option } = profile;
    return option;
  });
}
