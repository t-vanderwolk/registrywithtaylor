import { getAnalyticsPageType } from '@/lib/analytics';

export const GuideAnalyticsEvents = {
  VIEW: 'academy_view',
  AFFILIATE_CLICK: 'academy_action_affiliate_click',
  TO_CONSULTATION_CLICK: 'academy_conversion',
  TO_CONTACT_CLICK: 'academy_action_contact_click',
  TO_SERVICES_CLICK: 'academy_action_services_click',
  NEWSLETTER_CTA_CLICK: 'academy_action_newsletter_click',
  GUIDE_CREATED: 'academy_created',
  GUIDE_UPDATED: 'academy_updated',
  GUIDE_SAVED_DRAFT: 'academy_saved_draft',
  GUIDE_PREVIEWED: 'academy_previewed',
  GUIDE_PUBLISHED: 'academy_published',
  GUIDE_UNPUBLISHED: 'academy_unpublished',
  GUIDE_DUPLICATED: 'academy_duplicated',
  GUIDE_ARCHIVED: 'academy_archived',
} as const;

export type GuideAnalyticsEventName =
  (typeof GuideAnalyticsEvents)[keyof typeof GuideAnalyticsEvents];

const GUIDE_ANALYTICS_LEGACY_EVENT_ALIASES: Record<GuideAnalyticsEventName, string[]> = {
  [GuideAnalyticsEvents.VIEW]: ['guide_view'],
  [GuideAnalyticsEvents.AFFILIATE_CLICK]: ['guide_affiliate_click'],
  [GuideAnalyticsEvents.TO_CONSULTATION_CLICK]: ['guide_to_consultation_click'],
  [GuideAnalyticsEvents.TO_CONTACT_CLICK]: ['guide_to_contact_click'],
  [GuideAnalyticsEvents.TO_SERVICES_CLICK]: ['guide_to_services_click'],
  [GuideAnalyticsEvents.NEWSLETTER_CTA_CLICK]: ['guide_newsletter_cta_click'],
  [GuideAnalyticsEvents.GUIDE_CREATED]: ['guide_created'],
  [GuideAnalyticsEvents.GUIDE_UPDATED]: ['guide_updated'],
  [GuideAnalyticsEvents.GUIDE_SAVED_DRAFT]: ['guide_saved_draft'],
  [GuideAnalyticsEvents.GUIDE_PREVIEWED]: ['guide_previewed'],
  [GuideAnalyticsEvents.GUIDE_PUBLISHED]: ['guide_published'],
  [GuideAnalyticsEvents.GUIDE_UNPUBLISHED]: ['guide_unpublished'],
  [GuideAnalyticsEvents.GUIDE_DUPLICATED]: ['guide_duplicated'],
  [GuideAnalyticsEvents.GUIDE_ARCHIVED]: ['guide_archived'],
};

const GUIDE_ANALYTICS_EVENT_INDEX = Object.entries(GUIDE_ANALYTICS_LEGACY_EVENT_ALIASES).reduce<Map<string, GuideAnalyticsEventName>>(
  (acc, [canonicalEvent, aliases]) => {
    acc.set(canonicalEvent, canonicalEvent as GuideAnalyticsEventName);

    for (const alias of aliases) {
      acc.set(alias, canonicalEvent as GuideAnalyticsEventName);
    }

    return acc;
  },
  new Map<string, GuideAnalyticsEventName>(),
);

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

export const GUIDE_TRACKABLE_PUBLIC_EVENT_NAMES = Array.from(
  new Set(
    GUIDE_PUBLIC_EVENT_NAMES.flatMap((eventName) => [
      eventName,
      ...GUIDE_ANALYTICS_LEGACY_EVENT_ALIASES[eventName],
    ]),
  ),
);

export function getGuideAnalyticsEventAliases(eventName: GuideAnalyticsEventName) {
  return [eventName, ...GUIDE_ANALYTICS_LEGACY_EVENT_ALIASES[eventName]];
}

export function normalizeGuideAnalyticsEventName(eventName: string) {
  return GUIDE_ANALYTICS_EVENT_INDEX.get(eventName) ?? null;
}

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
