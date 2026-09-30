import { cache } from 'react';
import prisma from '@/lib/server/prisma';
import { dedupeOutboundEvents } from '@/lib/analytics/outboundReporting';
export const getOutboundAnalyticsEvents = cache(async () => dedupeOutboundEvents(await prisma.outboundClick.findMany({
  select: { id: true, retailer: true, network: true, url: true, source: true, path: true,
    brand: true, product: true, visitorHash: true, createdAt: true },
  orderBy: { createdAt: 'asc' },
})));
