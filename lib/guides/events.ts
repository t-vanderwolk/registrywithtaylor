import { getAnalyticsPageType } from '@/lib/analytics';

export const GuideAnalyticsEvents = {
  VIEW: 'guide_view',
  AFFILIATE_CLICK: 'guide_affiliate_click',
  TO_CONSULTATION_CLICK: 'guide_to_consultation_click',
  TO_CONTACT_CLICK: 'guide_to_contact_click',
  TO_SERVICES_CLICK: 'guide_to_services_click',
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
  GuideAnalyticsEvents.TO_CONSULTATION_CLICK,
  GuideAnalyticsEvents.TO_CONTACT_CLICK,
  GuideAnalyticsEvents.TO_SERVICES_CLICK,
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

export function getGuideDestinationEvent(href: string) {
  const pageType = getAnalyticsPageType(href);

  if (pageType === 'book') {
    return GuideAnalyticsEvents.TO_CONSULTATION_CLICK;
  }

  if (pageType === 'contact') {
    return GuideAnalyticsEvents.TO_CONTACT_CLICK;
  }

  if (pageType === 'services') {
    return GuideAnalyticsEvents.TO_SERVICES_CLICK;
  }

  return null;
}
