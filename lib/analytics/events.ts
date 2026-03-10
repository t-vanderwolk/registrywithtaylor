export const AnalyticsEvents = {
  HOW_IT_WORKS_VIEW: 'page_view_how_it_works',
  CONSULTATION_CLICK: 'consultation_cta_click',
  CONSULTATION_STARTED: 'consultation_form_started',
  CONSULTATION_SUBMITTED: 'consultation_request_submitted',
  BLOG_AFFILIATE_CTA_CLICK: 'blog_affiliate_cta_click',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export const BookingAnalyticsEvents = {
  SECTION_VIEWED: 'booking_section_viewed',
  SECTION_IN_VIEW: 'booking_scrolled_into_view',
  INTERACTION: 'booking_interaction',
} as const;

export type BookingAnalyticsEventName =
  (typeof BookingAnalyticsEvents)[keyof typeof BookingAnalyticsEvents];
