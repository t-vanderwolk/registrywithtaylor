export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  BLOG_VIEW: 'blog_view',
  CONSULTATION_CLICK: 'consultation_cta_click',
  CONTACT_CLICK: 'contact_cta_click',
  CONSULTATION_FORM_OPEN: 'consultation_form_open',
  CONSULTATION_SUBMITTED: 'consultation_request_submitted',
  CONTACT_FORM_OPEN: 'contact_form_open',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  BLOG_TO_CONSULTATION_CLICK: 'blog_to_consultation_click',
  BLOG_TO_CONTACT_CLICK: 'blog_to_contact_click',
  BLOG_TO_SERVICES_CLICK: 'blog_to_services_click',
  BLOG_AFFILIATE_CTA_CLICK: 'blog_affiliate_cta_click',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
