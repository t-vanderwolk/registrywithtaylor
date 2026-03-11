export const GuideAnalyticsEvents = {
  VIEW: 'guide_view',
  AFFILIATE_CLICK: 'guide_affiliate_click',
  CONSULTATION_CTA_CLICK: 'guide_consultation_cta_click',
  NEWSLETTER_CTA_CLICK: 'guide_newsletter_cta_click',
  GUIDE_CREATED: 'guide_created',
  GUIDE_UPDATED: 'guide_updated',
  GUIDE_SAVED_DRAFT: 'guide_saved_draft',
  GUIDE_PREVIEWED: 'guide_previewed',
  GUIDE_PUBLISHED: 'guide_published',
  GUIDE_UNPUBLISHED: 'guide_unpublished',
  GUIDE_DUPLICATED: 'guide_duplicated',
  GUIDE_ARCHIVED: 'guide_archived',
} as const;

export type GuideAnalyticsEventName =
  (typeof GuideAnalyticsEvents)[keyof typeof GuideAnalyticsEvents];

export const GUIDE_PUBLIC_EVENT_NAMES = [
  GuideAnalyticsEvents.VIEW,
  GuideAnalyticsEvents.AFFILIATE_CLICK,
  GuideAnalyticsEvents.CONSULTATION_CTA_CLICK,
  GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK,
] as const;

export const GUIDE_ADMIN_EVENT_NAMES = [
  GuideAnalyticsEvents.GUIDE_CREATED,
  GuideAnalyticsEvents.GUIDE_UPDATED,
  GuideAnalyticsEvents.GUIDE_SAVED_DRAFT,
  GuideAnalyticsEvents.GUIDE_PREVIEWED,
  GuideAnalyticsEvents.GUIDE_PUBLISHED,
  GuideAnalyticsEvents.GUIDE_UNPUBLISHED,
  GuideAnalyticsEvents.GUIDE_DUPLICATED,
  GuideAnalyticsEvents.GUIDE_ARCHIVED,
] as const;

