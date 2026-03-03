export const POST_STATUSES = ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const;

export type PostStatusValue = (typeof POST_STATUSES)[number];

export const POST_STATUS_LABELS: Record<PostStatusValue, string> = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

export function normalizePostStatus(value: unknown, fallback: PostStatusValue = 'DRAFT'): PostStatusValue {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim().toUpperCase();
  if (POST_STATUSES.includes(normalized as PostStatusValue)) {
    return normalized as PostStatusValue;
  }

  return fallback;
}

export function getStatusPillClassName(status: PostStatusValue) {
  switch (status) {
    case 'SCHEDULED':
      return 'admin-chip admin-chip--scheduled';
    case 'PUBLISHED':
      return 'admin-chip admin-chip--published';
    case 'ARCHIVED':
      return 'admin-chip admin-chip--archived';
    case 'DRAFT':
    default:
      return 'admin-chip admin-chip--draft';
  }
}

export function isPostPubliclyVisible(
  status: PostStatusValue,
  scheduledFor?: Date | string | null,
  now: Date = new Date(),
) {
  if (status === 'PUBLISHED') {
    return true;
  }

  if (status === 'SCHEDULED' && scheduledFor) {
    return new Date(scheduledFor).getTime() <= now.getTime();
  }

  return false;
}

export function getPublicPostWhere(now: Date = new Date()) {
  return {
    OR: [
      { status: 'PUBLISHED' as const },
      {
        status: 'SCHEDULED' as const,
        scheduledFor: {
          lte: now,
        },
      },
    ],
  };
}

export function getPostDisplayDate({
  createdAt,
  publishedAt,
  scheduledFor,
}: {
  createdAt: Date | string;
  publishedAt?: Date | string | null;
  scheduledFor?: Date | string | null;
}) {
  return new Date(publishedAt ?? scheduledFor ?? createdAt);
}

export function toLegacyPublished(status: PostStatusValue) {
  return status === 'PUBLISHED';
}

export function requiresLiveContent(status: PostStatusValue) {
  return status === 'PUBLISHED' || status === 'SCHEDULED';
}
