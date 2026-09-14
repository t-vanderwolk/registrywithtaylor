'use server';

import { NewsletterIssueStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/server/prisma';
import { requireAdminSession } from '@/lib/server/session';

const VALID_STATUSES = new Set<string>(Object.values(NewsletterIssueStatus));

const str = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const lines = (value: string | null) =>
  (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseDateTime = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

function getIssueStatus(formData: FormData) {
  const status = str(formData, 'status') ?? NewsletterIssueStatus.DRAFT;
  return VALID_STATUSES.has(status) ? (status as NewsletterIssueStatus) : NewsletterIssueStatus.DRAFT;
}

function buildIssueContent(formData: FormData) {
  return {
    intro: str(formData, 'intro') ?? '',
    highlights: lines(str(formData, 'highlights')),
    featuredLinks: lines(str(formData, 'featuredLinks')),
    productPicks: lines(str(formData, 'productPicks')),
    cta: {
      label: str(formData, 'ctaLabel') ?? '',
      url: str(formData, 'ctaUrl') ?? '',
    },
    signoff: str(formData, 'signoff') ?? '',
    internalNotes: str(formData, 'internalNotes') ?? '',
  };
}

function revalidateNewsletter() {
  revalidatePath('/admin');
  revalidatePath('/admin/newsletter');
  revalidatePath('/admin/newsletter/issues');
}

export async function createNewsletterIssue(formData: FormData) {
  await requireAdminSession('/admin/newsletter/issues/new');

  const title = str(formData, 'title');
  const subject = str(formData, 'subject');
  if (!title || !subject) return;

  const slug = str(formData, 'slug') ?? slugify(title);
  const issue = await prisma.newsletterIssue.create({
    data: {
      title,
      subject,
      previewText: str(formData, 'previewText'),
      slug: slug || null,
      status: getIssueStatus(formData),
      scheduledFor: parseDateTime(str(formData, 'scheduledFor')),
      sentAt: parseDateTime(str(formData, 'sentAt')),
      content: buildIssueContent(formData),
    },
    select: { id: true },
  });

  revalidateNewsletter();
  redirect(`/admin/newsletter/issues/${issue.id}`);
}

export async function updateNewsletterIssue(formData: FormData) {
  const id = str(formData, 'id');
  await requireAdminSession(id ? `/admin/newsletter/issues/${id}` : '/admin/newsletter/issues');
  if (!id) return;

  const title = str(formData, 'title');
  const subject = str(formData, 'subject');
  if (!title || !subject) return;

  await prisma.newsletterIssue.update({
    where: { id },
    data: {
      title,
      subject,
      previewText: str(formData, 'previewText'),
      slug: str(formData, 'slug') ?? slugify(title),
      status: getIssueStatus(formData),
      scheduledFor: parseDateTime(str(formData, 'scheduledFor')),
      sentAt: parseDateTime(str(formData, 'sentAt')),
      content: buildIssueContent(formData),
    },
  });

  revalidateNewsletter();
  revalidatePath(`/admin/newsletter/issues/${id}`);
  redirect(`/admin/newsletter/issues/${id}`);
}

export async function archiveNewsletterIssue(formData: FormData) {
  const id = str(formData, 'id');
  await requireAdminSession(id ? `/admin/newsletter/issues/${id}` : '/admin/newsletter/issues');
  if (!id) return;

  await prisma.newsletterIssue.update({
    where: { id },
    data: { status: NewsletterIssueStatus.ARCHIVED },
  });

  revalidateNewsletter();
  revalidatePath(`/admin/newsletter/issues/${id}`);
}
