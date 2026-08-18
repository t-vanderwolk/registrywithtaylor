/**
 * Analytics hooks for the Baby Checklist.
 *
 * Two layers, both non-blocking / guarded:
 *  1. GA4 events via window.gtag (checklist_started, checklist_item_checked, …).
 *  2. Server-side beacons that feed the admin dashboard — the same ToolEvent
 *     funnel (opened → selection → result_viewed) and OutboundClick logging the
 *     other free tools use, so the checklist shows up alongside them.
 *
 * No private user data is sent — only checklist type, category, item/product ids,
 * retailer, and the affiliate URL.
 */
import { sendToolEventBeacon } from '@/lib/analytics/toolEventBeacon';
import { sendAffiliateClickBeacon } from '@/lib/analytics/affiliateClickBeacon';

const TOOL = 'baby-checklist';

type EventParams = Record<string, string | number | boolean | undefined>;

function fire(action: string, params: EventParams): void {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', action, params);
  } catch {
    /* analytics must never break the UI */
  }
}

export const checklistAnalytics = {
  started: (checklist_type: string) => {
    fire('checklist_started', { checklist_type });
    sendToolEventBeacon({ tool: TOOL, event: 'opened' });
  },
  itemChecked: (checklist_type: string, category: string, item_id: string) => {
    fire('checklist_item_checked', { checklist_type, category, item_id });
    sendToolEventBeacon({ tool: TOOL, event: 'selection', kind: category, value: item_id });
  },
  affiliateClicked: (opts: {
    checklistType: string;
    itemId: string;
    productId: string;
    product?: string;
    brand?: string;
    retailer?: string;
    url?: string;
  }) => {
    fire('affiliate_link_clicked', {
      checklist_type: opts.checklistType,
      item_id: opts.itemId,
      product_id: opts.productId,
      retailer: opts.retailer,
    });
    // Dashboard funnel: a click means the visitor reached a real pick.
    sendToolEventBeacon({ tool: TOOL, event: 'result_viewed', kind: opts.retailer, value: opts.productId });
    // Persist the outbound click so it appears in the by-retailer breakdown and
    // the tool's "clicks" column (source `tool:baby-checklist`).
    sendAffiliateClickBeacon({
      url: opts.url,
      retailer: opts.retailer,
      brand: opts.brand,
      product: opts.product,
      source: `tool:${TOOL}`,
    });
  },
  printed: (checklist_type: string) => {
    fire('checklist_printed', { checklist_type });
  },
  consultationCta: () => {
    fire('consultation_cta_clicked', {});
  },
};
