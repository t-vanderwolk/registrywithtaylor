import type { PostStatusValue } from '@/lib/blog/postStatus';

export const BLOG_STAGES = ['IDEA', 'OUTLINE', 'DRAFT', 'READY', 'PUBLISHED', 'ARCHIVED'] as const;

export type BlogStageValue = (typeof BLOG_STAGES)[number];

export const BLOG_STAGE_LABELS: Record<BlogStageValue, string> = {
  IDEA: 'Idea',
  OUTLINE: 'Outline',
  DRAFT: 'Draft',
  READY: 'Ready',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

const PIPELINE_STAGES: BlogStageValue[] = ['IDEA', 'OUTLINE', 'DRAFT', 'READY'];

export function normalizeBlogStage(value: unknown, fallback: BlogStageValue = 'DRAFT'): BlogStageValue {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim().toUpperCase();
  if (BLOG_STAGES.includes(normalized as BlogStageValue)) {
    return normalized as BlogStageValue;
  }

  return fallback;
}

export function stageImpliesStatus(stage: BlogStageValue): PostStatusValue | null {
  if (stage === 'PUBLISHED') {
    return 'PUBLISHED';
  }

  if (stage === 'ARCHIVED') {
    return 'ARCHIVED';
  }

  return null;
}

export function resolveBlogStage({
  stageInput,
  status,
  fallback = 'DRAFT',
}: {
  stageInput: unknown;
  status: PostStatusValue;
  fallback?: BlogStageValue;
}) {
  const requested = normalizeBlogStage(stageInput, fallback);

  if (status === 'ARCHIVED') {
    return 'ARCHIVED' as const;
  }

  if (status === 'PUBLISHED') {
    return 'PUBLISHED' as const;
  }

  if (status === 'SCHEDULED') {
    return 'READY' as const;
  }

  return PIPELINE_STAGES.includes(requested) ? requested : 'DRAFT';
}

export function getStageBadgeClassName(stage: BlogStageValue) {
  switch (stage) {
    case 'IDEA':
      return 'admin-chip admin-chip--idea';
    case 'OUTLINE':
      return 'admin-chip admin-chip--outline';
    case 'READY':
      return 'admin-chip admin-chip--ready';
    case 'PUBLISHED':
      return 'admin-chip admin-chip--published';
    case 'ARCHIVED':
      return 'admin-chip admin-chip--archived';
    case 'DRAFT':
    default:
      return 'admin-chip admin-chip--draft';
  }
}
