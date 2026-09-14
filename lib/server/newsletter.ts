import 'server-only';

import {
  NewsletterIssueStatus,
  NewsletterSubscriberStatus,
  type NewsletterSubscriber,
} from '@prisma/client';
import prisma from '@/lib/server/prisma';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIX_MONTHS = 6;

export class NewsletterValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewsletterValidationError';
  }
}

export type NewsletterSubscribeInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  sourceDetail?: string | null;
  tags?: string[];
};

export type NewsletterSubscriberSummary = {
  id: string;
  email: string;
  firstName: string | null;
  status: NewsletterSubscriberStatus;
  source: string | null;
  sourceDetail: string | null;
  subscribedAt: Date;
  createdAt: Date;
};

export type NewsletterIssueSummary = {
  id: string;
  title: string;
  subject: string;
  status: NewsletterIssueStatus;
  scheduledFor: Date | null;
  sentAt: Date | null;
  updatedAt: Date;
};

export type NewsletterGrowthMonth = {
  month: string;
  subscribed: number;
  unsubscribed: number;
  net: number;
};

export type NewsletterAnalytics = {
  audience: {
    totalSubscribers: number;
    unsubscribed: number;
    pending: number;
    archived: number;
    signupsThisMonth: number;
    signupsLast30Days: number;
    issueCount: number;
    draftIssueCount: number;
    sentIssueCount: number;
    lastSubDate: Date | null;
  };
  recentSubscribers: NewsletterSubscriberSummary[];
  recentIssues: NewsletterIssueSummary[];
  growthHistory: NewsletterGrowthMonth[];
};

export function normalizeNewsletterEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidNewsletterEmail(value: string) {
  return EMAIL_RE.test(normalizeNewsletterEmail(value));
}

export function formatNewsletterSource(source?: string | null) {
  if (!source) return 'Unknown';

  const labels: Record<string, string> = {
    blog_capture: 'Blog capture',
    consultation_intake: 'Consultation intake',
    consultation_request: 'Consultation request',
    newsletter_form: 'Newsletter form',
  };

  return labels[source] ?? source.replace(/_/g, ' ');
}

function cleanText(value?: string | null, maxLength = 120) {
  const clean = value?.trim();
  if (!clean) return null;
  return clean.slice(0, maxLength);
}

function mergeTags(...tagLists: Array<string[] | null | undefined>) {
  return Array.from(
    new Set(
      tagLists
        .flatMap((tags) => tags ?? [])
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

function getMonthKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function getRecentMonthKeys() {
  const now = new Date();
  return Array.from({ length: SIX_MONTHS }, (_, index) => {
    const value = new Date(now.getFullYear(), now.getMonth() - (SIX_MONTHS - 1 - index), 1);
    return getMonthKey(value);
  });
}

export async function subscribeToNewsletter(input: NewsletterSubscribeInput): Promise<NewsletterSubscriber> {
  const email = normalizeNewsletterEmail(input.email);

  if (!isValidNewsletterEmail(email)) {
    throw new NewsletterValidationError('Please enter a valid email address.');
  }

  const firstName = cleanText(input.firstName);
  const lastName = cleanText(input.lastName);
  const source = cleanText(input.source) ?? 'newsletter_form';
  const sourceDetail = cleanText(input.sourceDetail, 300);
  const tags = mergeTags(input.tags, source ? [source] : null);
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing) {
    return prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        firstName: firstName ?? existing.firstName,
        lastName: lastName ?? existing.lastName,
        status: NewsletterSubscriberStatus.SUBSCRIBED,
        source: existing.source ?? source,
        sourceDetail: sourceDetail ?? existing.sourceDetail,
        tags: mergeTags(existing.tags, tags),
        unsubscribedAt: null,
      },
    });
  }

  return prisma.newsletterSubscriber.create({
    data: {
      email,
      firstName,
      lastName,
      source,
      sourceDetail,
      tags,
      status: NewsletterSubscriberStatus.SUBSCRIBED,
    },
  });
}

export async function getNewsletterAnalytics(): Promise<NewsletterAnalytics> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthKeys = getRecentMonthKeys();
  const monthStart = new Date(now.getFullYear(), now.getMonth() - (SIX_MONTHS - 1), 1);

  const [
    subscriberCounts,
    issueCounts,
    signupsThisMonth,
    signupsLast30Days,
    lastSubscriber,
    recentSubscribers,
    recentIssues,
    recentSubscriberRows,
    recentUnsubscribedRows,
  ] = await Promise.all([
    prisma.newsletterSubscriber.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.newsletterIssue.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.newsletterSubscriber.findFirst({
      where: { status: NewsletterSubscriberStatus.SUBSCRIBED },
      orderBy: [{ subscribedAt: 'desc' }, { createdAt: 'desc' }],
      select: { subscribedAt: true },
    }),
    prisma.newsletterSubscriber.findMany({
      orderBy: [{ createdAt: 'desc' }],
      take: 5,
      select: {
        id: true,
        email: true,
        firstName: true,
        status: true,
        source: true,
        sourceDetail: true,
        subscribedAt: true,
        createdAt: true,
      },
    }),
    prisma.newsletterIssue.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      take: 5,
      select: {
        id: true,
        title: true,
        subject: true,
        status: true,
        scheduledFor: true,
        sentAt: true,
        updatedAt: true,
      },
    }),
    prisma.newsletterSubscriber.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.newsletterSubscriber.findMany({
      where: { unsubscribedAt: { gte: monthStart } },
      select: { unsubscribedAt: true },
    }),
  ]);

  const subscriberCountByStatus = subscriberCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});

  const issueCountByStatus = issueCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});

  const monthlySubscribed = recentSubscriberRows.reduce<Record<string, number>>((acc, row) => {
    const key = getMonthKey(row.createdAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const monthlyUnsubscribed = recentUnsubscribedRows.reduce<Record<string, number>>((acc, row) => {
    if (!row.unsubscribedAt) return acc;
    const key = getMonthKey(row.unsubscribedAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const growthHistory = monthKeys.map((month) => {
    const subscribed = monthlySubscribed[month] ?? 0;
    const unsubscribed = monthlyUnsubscribed[month] ?? 0;
    return {
      month: getMonthLabel(month),
      subscribed,
      unsubscribed,
      net: subscribed - unsubscribed,
    };
  });

  return {
    audience: {
      totalSubscribers: subscriberCountByStatus[NewsletterSubscriberStatus.SUBSCRIBED] ?? 0,
      unsubscribed: subscriberCountByStatus[NewsletterSubscriberStatus.UNSUBSCRIBED] ?? 0,
      pending: subscriberCountByStatus[NewsletterSubscriberStatus.PENDING] ?? 0,
      archived: subscriberCountByStatus[NewsletterSubscriberStatus.ARCHIVED] ?? 0,
      signupsThisMonth,
      signupsLast30Days,
      issueCount: Object.values(issueCountByStatus).reduce((sum, count) => sum + count, 0),
      draftIssueCount: issueCountByStatus[NewsletterIssueStatus.DRAFT] ?? 0,
      sentIssueCount: issueCountByStatus[NewsletterIssueStatus.SENT] ?? 0,
      lastSubDate: lastSubscriber?.subscribedAt ?? null,
    },
    recentSubscribers,
    recentIssues,
    growthHistory,
  };
}
