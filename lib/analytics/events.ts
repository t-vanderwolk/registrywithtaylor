export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  BLOG_VIEW: 'blog_view',
  CONSULTATION_CLICK: 'consultation_cta_click',
  CONTACT_CLICK: 'contact_cta_click',
  GUIDE_DOWNLOAD: 'guide_download',
  AFFILIATE_CLICK: 'affiliate_click',
  AFFILIATE_OUTBOUND_CLICK: 'affiliate_outbound_click',
  CONSULTATION_FORM_OPEN: 'consultation_form_open',
  CONSULTATION_SUBMITTED: 'consultation_request_submitted',
  CONTACT_FORM_OPEN: 'contact_form_open',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  BLOG_TO_CONSULTATION_CLICK: 'blog_to_consultation_click',
  BLOG_TO_CONTACT_CLICK: 'blog_to_contact_click',
  BLOG_TO_SERVICES_CLICK: 'blog_to_services_click',
  BLOG_AFFILIATE_CTA_CLICK: 'blog_affiliate_cta_click',
  INTERNAL_LINK_CLICK: 'internal_link_click',
  // ── Member dashboard ────────────────────────────────────────────────────────
  DASHBOARD_VIEWED:    'dashboard_viewed',
  REGISTRY_ADDED:      'registry_added',
  REGISTRY_UPDATED:    'registry_updated',
  REGISTRY_REMOVED:    'registry_removed',
  // ── Free tools (stroller finder / travel-system checker / stroller quiz) ─────
  TOOL_OPENED:          'tool_opened',
  TOOL_SELECTION:       'tool_selection',
  TOOL_RESULT_VIEWED:   'tool_result_viewed',
  TOOL_AFFILIATE_CLICK: 'tool_affiliate_click',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
