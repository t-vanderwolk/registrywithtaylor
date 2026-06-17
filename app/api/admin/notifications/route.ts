import { NextResponse } from 'next/server';
import { requireAdminViewSession } from '@/lib/server/session';
import prisma from '@/lib/server/prisma';

export type NotificationItem = {
  id: string;
  type: 'consultation' | 'inquiry' | 'waitlist' | 'member';
  title: string;
  description: string;
  href: string;
  createdAt: string; // ISO string
};

export type NotificationsPayload = {
  items: NotificationItem[];
  counts: {
    consultations: number;
    inquiries: number;
    waitlist: number;
    members: number;
    total: number;
  };
};

export async function GET() {
  try {
    await requireAdminViewSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [consultations, inquiries, waitlistEntries, newMembers] = await Promise.all([
    prisma.consultationRequest.findMany({
      where: { status: 'new' },
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.contactInquiry.findMany({
      where: { status: 'new' },
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: { id: true, fullName: true, email: true, service: true, createdAt: true },
    }),
    prisma.waitlistEntry.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, name: true, createdAt: true },
    }),
    prisma.learner.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, name: true, subscriptionTier: true, createdAt: true },
    }),
  ]);

  const items: NotificationItem[] = [
    ...consultations.map((c) => ({
      id: `consultation-${c.id}`,
      type: 'consultation' as const,
      title: c.name,
      description: `New consultation request from ${c.email}`,
      href: '/admin/consultations',
      createdAt: (c.createdAt ?? new Date()).toISOString(),
    })),
    ...inquiries.map((i) => ({
      id: `inquiry-${i.id}`,
      type: 'inquiry' as const,
      title: i.fullName,
      description: i.service ? `Inquiry about ${i.service}` : `Contact inquiry from ${i.email}`,
      href: '/admin/inquiries',
      createdAt: (i.createdAt ?? new Date()).toISOString(),
    })),
    ...waitlistEntries.map((w) => ({
      id: `waitlist-${w.id}`,
      type: 'waitlist' as const,
      title: w.name ?? w.email,
      description: `Joined the academy waitlist`,
      href: '/admin/members',
      createdAt: w.createdAt.toISOString(),
    })),
    ...newMembers.map((m) => ({
      id: `member-${m.id}`,
      type: 'member' as const,
      title: m.name ?? m.email,
      description: `New ${m.subscriptionTier === 'free' ? 'free' : 'paid'} academy enrollment`,
      href: '/admin/members',
      createdAt: m.createdAt.toISOString(),
    })),
  ];

  // Sort all items newest first
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const counts = {
    consultations: consultations.length,
    inquiries: inquiries.length,
    waitlist: waitlistEntries.length,
    members: newMembers.length,
    total: consultations.length + inquiries.length + waitlistEntries.length + newMembers.length,
  };

  return NextResponse.json({ items, counts } satisfies NotificationsPayload);
}
