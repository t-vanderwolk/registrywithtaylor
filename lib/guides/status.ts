import type { Prisma } from '@prisma/client';
import {
  POST_STATUS_LABELS,
  getPostDisplayDate,
  getStatusPillClassName,
  isPostPubliclyVisible,
  normalizePostStatus,
  requiresLiveContent,
  type PostStatusValue,
} from '@/lib/blog/postStatus';

export type GuideStatusValue = PostStatusValue;

export const GUIDE_STATUSES = Object.keys(POST_STATUS_LABELS) as GuideStatusValue[];
export const GUIDE_STATUS_LABELS = POST_STATUS_LABELS;
export const normalizeGuideStatus = normalizePostStatus;
export const getGuideStatusPillClassName = getStatusPillClassName;
export const isGuidePubliclyVisible = isPostPubliclyVisible;
export const requiresLiveGuideContent = requiresLiveContent;
export const getGuideDisplayDate = getPostDisplayDate;

export function getPublicGuideWhere(now: Date = new Date()): Prisma.GuideWhereInput {
  return {
    OR: [
      { status: 'PUBLISHED' },
      {
        status: 'SCHEDULED',
        scheduledFor: {
          lte: now,
        },
      },
    ],
  };
}
