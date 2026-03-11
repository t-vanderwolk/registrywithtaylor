import {
  POST_STATUS_LABELS,
  getPostDisplayDate,
  getPublicPostWhere,
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
export const getPublicGuideWhere = getPublicPostWhere;
export const requiresLiveGuideContent = requiresLiveContent;
export const getGuideDisplayDate = getPostDisplayDate;

