'use server';

import { NewsletterSubscriberStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';

const VALID_STATUSES = new Set<string>(Object.values(NewsletterSubscriberStatus));

const str = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

function revalidateNewsletterSubscribers() {
  revalidatePath('/admin');
  revalidatePath('/admin/newsletter');
  revalidatePath('/admin/newsletter/subscribers');
}

export async function updateNewsletterSubscriberStatus(formData: FormData) {
  await requireAdminSession('/admin/newsletter/subscribers');

  const id = str(formData, 'id');
  const status = str(formData, 'status');
  if (!id || !status || !VALID_STATUSES.has(status)) return;

  const nextStatus = status as NewsletterSubscriberStatus;
  const isSubscribed = nextStatus === NewsletterSubscriberStatus.SUBSCRIBED;
  const isUnsubscribed = nextStatus === NewsletterSubscriberStatus.UNSUBSCRIBED;

  await prisma.newsletterSubscriber.update({
    where: { id },
    data: {
      status: nextStatus,
      subscribedAt: isSubscribed ? new Date() : undefined,
      unsubscribedAt: isSubscribed ? null : isUnsubscribed ? new Date() : undefined,
    },
  });

  revalidateNewsletterSubscribers();
}
