import { trackEvent } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { sendAffiliateClickBeacon } from '@/lib/analytics/affiliateClickBeacon';

export type ToolName = 'stroller-finder' | 'travel-system-checker' | 'stroller-quiz';

type Extra = Record<string, string | number | boolean | null | undefined>;

/** Fired once when a tool is first opened/rendered. */
export function trackToolOpened(tool: ToolName, extra: Extra = {}) {
  trackEvent(AnalyticsEvents.TOOL_OPENED, { tool, label: tool, ...extra });
}

/** Fired when the user makes a selection inside a tool (brand, category, stroller, seat, quiz answer). */
export function trackToolSelection(tool: ToolName, kind: string, value: string, extra: Extra = {}) {
  trackEvent(AnalyticsEvents.TOOL_SELECTION, {
    tool,
    kind,
    value,
    label: `${tool} · ${kind}: ${value}`,
    ...extra,
  });
}

/** Fired when a result / compatibility outcome is shown to the user. */
export function trackToolResultViewed(tool: ToolName, extra: Extra = {}) {
  trackEvent(AnalyticsEvents.TOOL_RESULT_VIEWED, { tool, label: tool, ...extra });
}

/** Fired on every buy-link click that originates inside a tool. */
export function trackToolAffiliateClick(
  tool: ToolName,
  input: { product?: string | null; retailer?: string | null; brand?: string | null; url?: string | null },
) {
  trackEvent(AnalyticsEvents.TOOL_AFFILIATE_CLICK, {
    tool,
    product: input.product ?? undefined,
    retailer: input.retailer ?? undefined,
    brand: input.brand ?? undefined,
    url: input.url ?? undefined,
    label: input.product ?? input.brand ?? input.url ?? tool,
  });

  // Also persist the outbound click server-side so the admin dashboard can show
  // a real by-retailer breakdown (GA alone never reaches the DB).
  sendAffiliateClickBeacon({
    url: input.url,
    retailer: input.retailer,
    brand: input.brand,
    product: input.product,
    source: `tool:${tool}`,
  });
}
