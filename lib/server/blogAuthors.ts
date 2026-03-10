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

const fallbackNameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

export function toBlogAuthorProfile(author: AuthorLike, role = 'Contributor'): BlogAuthorProfile {
  return {
    id: author.id,
    email: author.email,
    name: author.name?.trim() || fallbackNameFromEmail(author.email),
    slug: author.slug?.trim() || null,
    bio: author.bio?.trim() || null,
    expertiseAreas: author.expertiseAreas,
    avatarUrl: author.avatarUrl?.trim() || null,
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
